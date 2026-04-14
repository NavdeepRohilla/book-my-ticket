import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDirectory = path.resolve(__dirname, "../data");

const seedData = {
  users: [],
  bookings: [],
};

const queueState = {
  current: Promise.resolve(),
};

const getFilePath = (collectionName) =>
  path.join(dataDirectory, `${collectionName}.json`);

const ensureSeedFile = async (collectionName) => {
  const filePath = getFilePath(collectionName);

  try {
    await fs.access(filePath);
  } catch {
    const defaultValue = seedData[collectionName] ?? [];
    await fs.writeFile(filePath, JSON.stringify(defaultValue, null, 2));
  }
};

export const initializeStore = async () => {
  await fs.mkdir(dataDirectory, { recursive: true });
  await Promise.all(Object.keys(seedData).map(ensureSeedFile));
};

export const readCollection = async (collectionName) => {
  await ensureSeedFile(collectionName);
  const rawData = await fs.readFile(getFilePath(collectionName), "utf-8");
  return JSON.parse(rawData);
};

export const writeCollection = async (collectionName, records) => {
  await ensureSeedFile(collectionName);
  await fs.writeFile(
    getFilePath(collectionName),
    JSON.stringify(records, null, 2)
  );
};

export const runExclusive = async (task) => {
  const runTask = queueState.current.then(task, task);
  queueState.current = runTask.catch(() => {});
  return runTask;
};
