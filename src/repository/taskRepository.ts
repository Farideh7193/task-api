import { Task } from "../types";

// The API depends on this interface, not on a concrete database.
// This makes it easy to test (in-memory) and to run for real (PostgreSQL).
export interface TaskRepository {
  list(): Promise<Task[]>;
  get(id: number): Promise<Task | undefined>;
  create(title: string): Promise<Task>;
  update(id: number, changes: { title?: string; done?: boolean }): Promise<Task | undefined>;
  remove(id: number): Promise<boolean>;
}
