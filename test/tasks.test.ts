import request from "supertest";
import { createApp } from "../src/app";
import { MemoryTaskRepository } from "../src/repository/memoryRepository";

const newApp = () => createApp(new MemoryTaskRepository());

describe("Task API", () => {
  it("returns health status", async () => {
    const res = await request(newApp()).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("creates and lists tasks", async () => {
    const app = newApp();
    const created = await request(app).post("/tasks").send({ title: "Learn Docker" });
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ id: 1, title: "Learn Docker", done: false });

    const list = await request(app).get("/tasks");
    expect(list.body).toHaveLength(1);
  });

  it("rejects an empty title", async () => {
    const res = await request(newApp()).post("/tasks").send({ title: "   " });
    expect(res.status).toBe(400);
  });

  it("gets a single task and returns 404 for unknown ids", async () => {
    const app = newApp();
    await request(app).post("/tasks").send({ title: "A" });
    expect((await request(app).get("/tasks/1")).status).toBe(200);
    expect((await request(app).get("/tasks/99")).status).toBe(404);
    expect((await request(app).get("/tasks/abc")).status).toBe(400);
  });

  it("updates a task", async () => {
    const app = newApp();
    await request(app).post("/tasks").send({ title: "A" });
    const res = await request(app).put("/tasks/1").send({ done: true });
    expect(res.status).toBe(200);
    expect(res.body.done).toBe(true);
    expect(res.body.title).toBe("A");
  });

  it("validates update input", async () => {
    const app = newApp();
    await request(app).post("/tasks").send({ title: "A" });
    expect((await request(app).put("/tasks/1").send({ done: "yes" })).status).toBe(400);
    expect((await request(app).put("/tasks/99").send({ done: true })).status).toBe(404);
  });

  it("deletes a task", async () => {
    const app = newApp();
    await request(app).post("/tasks").send({ title: "A" });
    expect((await request(app).delete("/tasks/1")).status).toBe(204);
    expect((await request(app).delete("/tasks/1")).status).toBe(404);
    expect((await request(app).get("/tasks")).body).toHaveLength(0);
  });
});
