import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  get tasks(): Task[] {
    return this.tasksSubject.getValue();
  }

  addTask(task: Task) {
    this.tasksSubject.next([...this.tasks, task]);
  }

  updateTask(updatedTask: Task) {
    const updatedTasks = this.tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
    this.tasksSubject.next(updatedTasks);
  }

  deleteTask(taskId: number) {
    const filteredTasks = this.tasks.filter(task => task.id !== taskId);
    this.tasksSubject.next(filteredTasks);
  }
}
