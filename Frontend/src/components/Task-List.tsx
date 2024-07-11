import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

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
  const BASE_URL = "http://localhost:3000/api/tasks";

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    try {
      const response = await axios.get<Task[]>(BASE_URL);
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

      const response = await axios.post<Task>(BASE_URL, {
        description: newTaskDescription,
        completed: false,
      });

      if (response.status === 201) {
        setTasks([...tasks, response.data]);
        setNewTaskDescription("");
        toast.success("Criado com sucesso");
      }
    } catch (error) {
      console.error("Error adding task:", error);
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
              const res = await axios.delete(`${BASE_URL}/${taskId}`);

              if (res.status === 204) {
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
      const response = await axios.put<Task>(`${BASE_URL}/${taskId}`, {
        ...tasks.find((task) => task.id === taskId),
        completed: !completed,
        completionDate: completed === false ? new Date() : null,
      });
      setTasks(
        tasks.map((task) => (task.id === taskId ? response.data : task))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const ordenedTasks = [...tasks].sort((a: any, b: any) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    if (a.completed === b.completed) {
      return dateA.getTime() - dateB.getTime();
    }
    return a.completed ? 1 : -1;
  });

  return (
    <div className="max-w-md mx-auto my-8 p-6 space-y-5 bg-white rounded-md shadow-lg">
      <h1 className="text-xl font-bold text-center">Lista de Tarefas</h1>
      <div className="flex gap-2">
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Descrição da tarefa"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 duration-300"
          onClick={addTask}
        >
          Adicionar
        </button>
      </div>
      <ul className="space-y-3">
        {ordenedTasks.map((task) => (
          <li key={task.id} className="flex gap-5 items-center justify-between">
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
              className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 duration-300"
              onClick={() => deleteTask(task.id!)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
