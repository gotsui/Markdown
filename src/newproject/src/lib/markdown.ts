import fs from "fs/promises";
import path from "path";

const articlesDir = path.join(process.cwd(), "articles");

export const saveMarkdown = async (slug: string, content: string): Promise<void> => {
    // ディレクトリが存在しない場合は作成する
    await fs.mkdir(articlesDir, { recursive: true });
    const filePath = path.join(articlesDir, `${slug}.md`);
    await fs.writeFile(filePath, content);
};

export const readMarkdown = async (slug: string): Promise<string> => {
    const filePath = path.join(articlesDir, `${slug}.md`);
    return fs.readFile(filePath, "utf-8");
};