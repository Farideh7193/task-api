import { Pool } from "pg";
import { createApp } from "./app";
import { MemoryTaskRepository } from "./repository/memoryRepository";
import { PostgresTaskRepository } from "./repository/postgresRepository";
import { TaskRepository } from "./repository/taskRepository";

async function main() {
  const port = Number(process.env.PORT ?? 3000);
  let repo: TaskRepository;

  if (process.env.DATABASE_URL) {
    const pgRepo = new PostgresTaskRepository(new Pool({ connectionString: process.env.DATABASE_URL }));
    await pgRepo.init();
    repo = pgRepo;
    console.log("Using PostgreSQL");
  } else {
    repo = new MemoryTaskRepository();
    console.log("DATABASE_URL not set, using in-memory storage");
  }

  createApp(repo).listen(port, () => console.log(`Task API listening on port ${port}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
