import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import TaskService from "../services/TaskService";

interface Task {
  id?: number;
  description: string;
  completed: boolean;
  creationDate?: string;
  completionDate?: string;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskDescription, setNewTaskDescription] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    try {
      const response = await TaskService.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    try {
      if (!newTaskDescription) {
        toast.error("A descrição da tarefa não pode estar vazia.");
        return;
      }

      const response = await TaskService.addTask({
        description: newTaskDescription,
        completed: false,
      });

      if (response.status === 201) {
        setTasks([...tasks, response.data]);
        setNewTaskDescription("");
        setIsModalOpen(false);
        toast.success("Criado com sucesso");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async () => {
    try {
      if (!editTask || !newTaskDescription) {
        toast.error("A descrição da tarefa não pode estar vazia.");
        return;
      }

      const response = await TaskService.editTask(
        {
          ...editTask,
          description: newTaskDescription,
        },
        editTask.id
      );

      if (response.status === 200) {
        setTasks(
          tasks.map((task) => (task.id === editTask.id ? response.data : task))
        );
        setNewTaskDescription("");
        setEditTask(null);
        setIsModalOpen(false);
        toast.success("Atualizado com sucesso");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId: number) => {
    confirmAlert({
      title: "Confirmar Exclusão",
      message: "Tem certeza que deseja excluir esta tarefa?",
      buttons: [
        {
          label: "Sim",
          onClick: async () => {
            try {
              const response = await TaskService.deleteTask(taskId);
              if (response.status === 204) {
                setTasks(tasks.filter((task) => task.id !== taskId));
                toast.success("Deletado com sucesso!");
              }
            } catch (error) {
              console.error("Error deleting task:", error);
            }
          },
        },
        {
          label: "Não",
          onClick: () => {},
        },
      ],
    });
  };

  const toggleTaskCompletion = async (taskId: number, completed: boolean) => {
    try {
      const response = await TaskService.editTask(
        {
          ...tasks.find((task) => task.id === taskId),
          completed: !completed,
          completionDate: completed === false ? new Date() : null,
        },
        taskId
      );

      setTasks(
        tasks.map((task) => (task.id === taskId ? response.data : task))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const ordenedTasks = [...tasks].sort((a: any, b: any) => {
    const dateA = new Date(a.creationDate);
    const dateB = new Date(b.creationDate);

    if (a.completed === b.completed) {
      return dateB.getTime() - dateA.getTime();
    }
    return a.completed ? 1 : -1;
  });

  const openModal = (task?: Task) => {
    if (task) {
      setEditTask(task);
      setNewTaskDescription(task.description);
    } else {
      setEditTask(null);
      setNewTaskDescription("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditTask(null);
    setNewTaskDescription("");
  };

  const handleSubmit = () => {
    if (editTask) {
      updateTask();
    } else {
      addTask();
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto my-8 p-6 space-y-5 bg-white rounded-md shadow-lg">
        <div className="flex justify-between items-center gap-5">
          <h1 className="text-xl font-bold text-center">Lista de Tarefas</h1>
          <button
            className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 duration-300 text-sm"
            onClick={() => openModal()}
          >
            Adicionar
          </button>
        </div>
        <ul className="space-y-3">
          {ordenedTasks.map((task) => (
            <li
              key={task.id}
              className="flex gap-5 items-center justify-between"
            >
              <input
                type="checkbox"
                className="w-6 h-6 cursor-pointer"
                checked={task.completed}
                onClick={() => toggleTaskCompletion(task.id!, task.completed)}
              />
              <span
                className={`flex-1 ${
                  task.completed ? "line-through text-gray-500" : "text-black"
                }`}
              >
                {task.description}
              </span>
              <button
                className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 duration-300 text-sm"
                onClick={() => openModal(task)}
              >
                Editar
              </button>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 duration-300 text-sm"
                onClick={() => deleteTask(task.id!)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex min-h-screen items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editTask ? "Editar Tarefa" : "Adicionar Tarefa"}
            </h2>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md mb-4"
              placeholder="Descrição da tarefa"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 duration-300"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 duration-300"
                onClick={handleSubmit}
              >
                {editTask ? "Atualizar" : "Adicionar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
