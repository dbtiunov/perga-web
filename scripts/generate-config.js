import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const templatePath = path.resolve("config.json.template");
const outputPath = path.resolve("public/config.json");

// Read template and insert vars from .env
let template = fs.readFileSync(templatePath, "utf-8");
template = template.replace(/\$\{(\w+)}/g, (_, key) => {
  const value = process.env[key];

  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }

  return value;
});

fs.writeFileSync(outputPath, template);

console.log("File /public/config.json generated from template");
