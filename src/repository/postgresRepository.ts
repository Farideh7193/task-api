import { Pool } from "pg";
import { Task } from "../types";
import { TaskRepository } from "./taskRepository";

interface Row {
  id: number;
  title: string;
  done: boolean;
  created_at: Date;
}

const toTask = (r: Row): Task => ({
  id: r.id,
  title: r.title,
  done: r.done,
  createdAt: r.created_at.toISOString(),
});

export class PostgresTaskRepository implements TaskRepository {
  constructor(private pool: Pool) {}

  async init(): Promise<void> {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        done BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`);
  }

  async list(): Promise<Task[]> {
    const { rows } = await this.pool.query<Row>("SELECT * FROM tasks ORDER BY id");
    return rows.map(toTask);
  }

  async get(id: number): Promise<Task | undefined> {
    const { rows } = await this.pool.query<Row>("SELECT * FROM tasks WHERE id = $1", [id]);
    return rows[0] ? toTask(rows[0]) : undefined;
  }

  async create(title: string): Promise<Task> {
    const { rows } = await this.pool.query<Row>("INSERT INTO tasks (title) VALUES ($1) RETURNING *", [title]);
    return toTask(rows[0]);
  }

  async update(id: number, changes: { title?: string; done?: boolean }): Promise<Task | undefined> {
    const { rows } = await this.pool.query<Row>(
      `UPDATE tasks SET title = COALESCE($2, title), done = COALESCE($3, done)
       WHERE id = $1 RETURNING *`,
      [id, changes.title ?? null, changes.done ?? null]
    );
    return rows[0] ? toTask(rows[0]) : undefined;
  }

  async remove(id: number): Promise<boolean> {
    const { rowCount } = await this.pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    return (rowCount ?? 0) > 0;
  }
}
