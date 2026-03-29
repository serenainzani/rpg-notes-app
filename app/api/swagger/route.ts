import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
    const yaml = readFileSync(join(process.cwd(), "swagger.yaml"), "utf-8");
    return new Response(yaml, {
        headers: { "Content-Type": "application/yaml" },
        status: 200,
    });
}
