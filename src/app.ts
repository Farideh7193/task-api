import express, { Request, Response } from "express";
import { TaskRepository } from "./repository/taskRepository";

export function createApp(repo: TaskRepository) {
  const app = express();
  app.use(express.json());

  const parseId = (req: Request): number | undefined => {
    const id = Number(req.params.id);
    return Number.isInteger(id) && id > 0 ? id : undefined;
  };

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/tasks", async (_req, res) => {
    res.json(await repo.list());
  });

  app.get("/tasks/:id", async (req: Request, res: Response) => {
    const id = parseId(req);
    if (!id) return res.status(400).json({ error: "invalid id" });
    const task = await repo.get(id);
    if (!task) return res.status(404).json({ error: "task not found" });
    res.json(task);
  });

  app.post("/tasks", async (req: Request, res: Response) => {
    const title = req.body?.title;
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ error: "title is required" });
    }
    res.status(201).json(await repo.create(title.trim()));
  });

  app.put("/tasks/:id", async (req: Request, res: Response) => {
    const id = parseId(req);
    if (!id) return res.status(400).json({ error: "invalid id" });
    const { title, done } = req.body ?? {};
    if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
      return res.status(400).json({ error: "title must be a non-empty string" });
    }
    if (done !== undefined && typeof done !== "boolean") {
      return res.status(400).json({ error: "done must be a boolean" });
    }
    const task = await repo.update(id, { title: title?.trim(), done });
    if (!task) return res.status(404).json({ error: "task not found" });
    res.json(task);
  });

  app.delete("/tasks/:id", async (req: Request, res: Response) => {
    const id = parseId(req);
    if (!id) return res.status(400).json({ error: "invalid id" });
    const removed = await repo.remove(id);
    if (!removed) return res.status(404).json({ error: "task not found" });
    res.status(204).send();
  });

  return app;
}
