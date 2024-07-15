import { toast } from "react-toastify";
import api from "./api";

const TaskService = {
  getTasks: async () => {
    try {
      const res = await api.get("/tasks");
      return res;
    } catch (error: any) {
      return error.response;
    }
  },
  addTask: async (payload: any) => {
    try {
      const res = await api.post(`/tasks`, payload);
      return res;
    } catch (error: any) {
      return error.response;
    }
  },
  editTask: async (payload: any, id: any) => {
    try {
      const res = await api.put(`/tasks/${id}`, payload);
      return res;
    } catch (error: any) {
      toast.error("Erro ao Editar Tarefa");
      return error.response;
    }
  },
  deleteTask: async (id: any) => {
    try {
      const res = await api.delete(`/tasks/${id}`);
      return res;
    } catch (error: any) {
      toast.error("Erro ao Deletar Tarefa");
      return error.response;
    }
  },
};

export default TaskService;
