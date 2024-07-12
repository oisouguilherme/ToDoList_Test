import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import axios from 'axios';

interface Task {
  id?: number;
  description: string;
  completed: boolean;
  createdAt?: string;
  completionDate?: string | null;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'FrontendAngular';
  tasks: Task[] = [];
  newTaskDescription: string = '';
  isModalOpen: boolean = false;
  editTask: Task | null = null;
  BASE_URL = 'http://localhost:3000/api/tasks';

  async ngOnInit() {
    await this.getTasks();
  }

  async getTasks() {
    try {
      const response = await axios.get<Task[]>(this.BASE_URL);
      this.tasks = response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  async addTask() {
    try {
      if (!this.newTaskDescription) {
        alert('A descrição da tarefa não pode estar vazia.');
        return;
      }

      const response = await axios.post<Task>(this.BASE_URL, {
        description: this.newTaskDescription,
        completed: false,
      });

      if (response.status === 201) {
        this.tasks = [...this.tasks, response.data];
        this.newTaskDescription = '';
        this.isModalOpen = false;
        alert('Criado com sucesso');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }

  async updateTask() {
    try {
      if (!this.editTask || !this.newTaskDescription) {
        alert('A descrição da tarefa não pode estar vazia.');
        return;
      }

      const response = await axios.put<Task>(
        `${this.BASE_URL}/${this.editTask.id}`,
        {
          ...this.editTask,
          description: this.newTaskDescription,
        }
      );

      if (response.status === 200) {
        this.tasks = this.tasks.map((task) =>
          task.id === this.editTask!.id ? response.data : task
        );
        this.newTaskDescription = '';
        this.editTask = null;
        this.isModalOpen = false;
        alert('Atualizado com sucesso');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  async deleteTask(taskId: number) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        const res = await axios.delete(`${this.BASE_URL}/${taskId}`);

        if (res.status === 204) {
          this.tasks = this.tasks.filter((task) => task.id !== taskId);
          alert('Deletado com sucesso!');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  }

  async toggleTaskCompletion(taskId: number, completed: boolean) {
    try {
      const response = await axios.put<Task>(`${this.BASE_URL}/${taskId}`, {
        ...this.tasks.find((task) => task.id === taskId),
        completed: !completed,
        completionDate: !completed ? new Date().toISOString() : null,
      });

      this.tasks = this.tasks.map((task) =>
        task.id === taskId ? response.data : task
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  get ordenedTasks() {
    return [...this.tasks].sort((a, b) => {
      const dateA = new Date(a.createdAt!);
      const dateB = new Date(b.createdAt!);

      if (a.completed === b.completed) {
        return dateB.getTime() - dateA.getTime();
      }
      return a.completed ? 1 : -1;
    });
  }

  openModal(task?: Task) {
    if (task) {
      this.editTask = task;
      this.newTaskDescription = task.description;
    } else {
      this.editTask = null;
      this.newTaskDescription = '';
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.editTask = null;
    this.newTaskDescription = '';
  }

  handleSubmit() {
    if (this.editTask) {
      this.updateTask();
    } else {
      this.addTask();
    }
  }
}
