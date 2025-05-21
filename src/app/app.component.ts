import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { TaskComponent } from './components/task/task.component';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from './models/task.model';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskComponent, AsyncPipe],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'rxjs';
  todoTitle = '';
  description = '';
  editMode = false;
  currentId: number | null = null;

 
  private filterSubject = new BehaviorSubject<'all' | 'completed'>('all');
  filter$ = this.filterSubject.asObservable();


  filteredTasks$: Observable<Task[]>;

  constructor(public taskService: TaskService) {
    this.filteredTasks$ = combineLatest([
      this.taskService.tasks$, 
      this.filter$
    ]).pipe(
      map(([tasks, filter]) => {
        if (filter === 'completed') {
          return tasks.filter(task => task.completed);
        }
        return tasks;
      })
    );
  }

  setFilter(filter: 'all' | 'completed') {
    this.filterSubject.next(filter);
  }

  addOrUpdateTask() {
    if (!this.todoTitle || !this.description) return;

    if (this.editMode && this.currentId !== null) {
      this.taskService.updateTask({
        id: this.currentId,
        todoTitle: this.todoTitle,
        description: this.description,
        completed: false,
      });
    } else {
      this.taskService.addTask({
        id: Date.now(),
        todoTitle: this.todoTitle,
        description: this.description,
        completed: false,
      });
    }

    this.clearForm();
  }

  startEdit(task: Task) {
    this.todoTitle = task.todoTitle;
    this.description = task.description;
    this.editMode = true;
    this.currentId = task.id;
  }

  deleteTask(taskId: number) {
    this.taskService.deleteTask(taskId);
    if (this.currentId === taskId) {
      this.clearForm();
    }
  }

  updateTask(task: Task) {
    this.taskService.updateTask(task);
  }

  clearForm() {
    this.todoTitle = '';
    this.description = '';
    this.editMode = false;
    this.currentId = null;
  }
}
