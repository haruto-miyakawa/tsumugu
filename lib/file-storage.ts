import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const ARTICLES_DIR = path.join(DATA_DIR, "articles");
const IMAGES_DIR = path.join(DATA_DIR, "images");

export function getImagesDir(): string {
  return IMAGES_DIR;
}

export function getImagePath(filename: string): string {
  return path.join(IMAGES_DIR, filename);
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

export async function readJson<T>(filePath: string): Promise<T | null> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

export async function writeJson<T>(filePath: string, data: T): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function getStylePath(): string {
  return path.join(DATA_DIR, "style.json");
}

export function getArticlePath(id: string): string {
  return path.join(ARTICLES_DIR, `${id}.json`);
}

export async function listArticleFiles(): Promise<string[]> {
  await ensureDir(ARTICLES_DIR);
  const files = await fs.readdir(ARTICLES_DIR);
  return files
    .filter((f) => f.endsWith(".json"))
    .sort()
    .reverse();
}

export async function deleteArticleFile(id: string): Promise<void> {
  const filePath = getArticlePath(id);
  await fs.unlink(filePath);
}
