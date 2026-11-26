import { Task } from "../types";
import { TaskRepository } from "./taskRepository";

export class MemoryTaskRepository implements TaskRepository {
  private tasks: Task[] = [];
  private nextId = 1;

  async list(): Promise<Task[]> {
    return [...this.tasks];
  }

  async get(id: number): Promise<Task | undefined> {
    return this.tasks.find((t) => t.id === id);
  }

  async create(title: string): Promise<Task> {
    const task: Task = { id: this.nextId++, title, done: false, createdAt: new Date().toISOString() };
    this.tasks.push(task);
    return task;
  }

  async update(id: number, changes: { title?: string; done?: boolean }): Promise<Task | undefined> {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return undefined;
    if (changes.title !== undefined) task.title = changes.title;
    if (changes.done !== undefined) task.done = changes.done;
    return task;
  }

  async remove(id: number): Promise<boolean> {
    const before = this.tasks.length;
    this.tasks = this.tasks.filter((t) => t.id !== id);
    return this.tasks.length < before;
  }
}
