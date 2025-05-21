import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task',
  standalone: true,
  templateUrl: './task.component.html',
})
export class TaskComponent {
  @Input() task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<number>();
  @Output() toggleComplete = new EventEmitter<Task>();

  onEdit() {
    this.edit.emit(this.task);
  }

  onDelete() {
    this.delete.emit(this.task.id);
  }

   onToggleComplete() {
    const updatedTask = { ...this.task, completed: !this.task.completed };
    this.toggleComplete.emit(updatedTask);
  }
}
