import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as prompts from "@clack/prompts";
import colors from "picocolors";

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  ".turbo",
  ".pruned",
  ".vite",
  ".tanstack",
  ".tsbuildinfo",
  "__generated",
]);

const SKIP_FILES = new Set(["package-lock.json", "npm-debug.log", ".env.local"]);

function isEmpty(dir: string): boolean {
  const entries = fs.readdirSync(dir).filter((name) => name !== ".git");
  return entries.length === 0;
}

function shouldSkip(name: string): boolean {
  return SKIP_DIRS.has(name) || SKIP_FILES.has(name);
}

function copyDir(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    if (shouldSkip(name)) continue;
    const from = path.join(src, name);
    const to = path.join(dest, name);
    if (fs.statSync(from).isDirectory()) {
      copyDir(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

function isTextFile(filePath: string): boolean {
  const ext = path.extname(filePath);
  return (
    [
      ".json",
      ".html",
      ".md",
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      ".mjs",
      ".cjs",
      ".css",
      ".yml",
      ".yaml",
      ".example",
      ".env",
    ].includes(ext) || filePath.endsWith(".env.example")
  );
}

function replaceInTree(dir: string, replacements: Record<string, string>): void {
  const entries = Object.entries(replacements);
  if (entries.length === 0) return;

  for (const name of fs.readdirSync(dir)) {
    if (shouldSkip(name)) continue;
    const filePath = path.join(dir, name);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      replaceInTree(filePath, replacements);
      continue;
    }
    if (!isTextFile(filePath)) continue;

    const content = fs.readFileSync(filePath, "utf-8");
    let updated = content;
    for (const [placeholder, replacement] of entries) {
      if (updated.includes(placeholder)) {
        updated = updated.replaceAll(placeholder, replacement);
      }
    }
    if (updated !== content) {
      fs.writeFileSync(filePath, updated);
    }
  }
}

function commandErrorMessage(result: { stderr: string | null }, command: string, args: string[]): string {
  return result.stderr ? result.stderr.trim() : `Command failed: ${command} ${args.join(" ")}`;
}

function runCapture(command: string, args: string[], options: { cwd: string }): string {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    console.error(colors.red(commandErrorMessage(result, command, args)));
    process.exit(result.status ?? 1);
  }
  const stdout = result.stdout.trim();
  if (!stdout) {
    console.error(colors.red(`Command produced no output: ${command} ${args.join(" ")}`));
    process.exit(1);
  }
  return stdout;
}

function runQuiet(command: string, args: string[], options: { cwd: string }): void {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: "utf-8",
    stdio: ["ignore", "ignore", "pipe"],
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    console.error(colors.red(commandErrorMessage(result, command, args)));
    process.exit(result.status ?? 1);
  }
}

async function promptText(message: string): Promise<string> {
  const answer = await prompts.text({
    message,
    validate: (value) => {
      if (!value.trim()) return "Required";
    },
  });

  if (prompts.isCancel(answer)) {
    prompts.cancel("Cancelled.");
    process.exit(0);
  }

  const value = answer.trim();
  if (!value) {
    prompts.cancel("Cancelled.");
    process.exit(1);
  }

  return value;
}

const isInteractive = process.stdin.isTTY && process.stdout.isTTY;

async function read(options: { argvIndex: number; prompt: string; errorMessage: string }): Promise<string> {
  const fromArgv = process.argv[options.argvIndex]?.trim();
  if (fromArgv && !fromArgv.startsWith("-")) return fromArgv;
  if (isInteractive) return promptText(options.prompt);
  console.error(colors.red(options.errorMessage));
  process.exit(1);
}

async function shouldInitializeGit(): Promise<boolean> {
  if (process.argv.includes("--skip-git")) return false;
  if (!isInteractive) return true;

  const answer = await prompts.confirm({
    message: "Initialize git repository?",
    initialValue: true,
  });

  if (prompts.isCancel(answer)) {
    prompts.cancel("Cancelled.");
    process.exit(0);
  }

  return answer;
}

function resolveTarget(appNameInput: string): { root: string; appName: string } {
  if (appNameInput === ".") {
    if (!isEmpty(process.cwd())) {
      console.error(colors.red("Current directory is not empty. Use an empty folder or choose another app name."));
      process.exit(1);
    }
    const appName = path.basename(process.cwd());
    if (!appName || appName === ".") {
      console.error(colors.red("Could not determine app name from current directory."));
      process.exit(1);
    }
    return { root: process.cwd(), appName };
  }

  const root = path.join(process.cwd(), appNameInput);
  if (fs.existsSync(root) && !isEmpty(root)) {
    console.error(colors.red(`"${appNameInput}" already exists and is not empty.`));
    process.exit(1);
  }

  return { root, appName: appNameInput };
}

interface ShadcnPresetOutput {
  code: string;
  version: string;
  values: {
    menuColor: string;
    menuAccent: string;
    radius: string;
    font: string;
    iconLibrary: string;
    theme: string;
    baseColor: string;
    style: string;
    chartColor: string;
    fontHeading: string;
  };
  derived: string[];
  url: string;
}

function applyShadcnPreset(projectRoot: string, preset: string): void {
  const uiDir = path.join(projectRoot, "packages/ui");
  const componentsJson = path.join(uiDir, "components.json");

  if (!fs.existsSync(componentsJson)) {
    console.error(colors.red("Missing packages/ui/components.json — cannot apply shadcn preset."));
    process.exit(1);
  }

  const decodedPreset = runCapture("npx", ["shadcn@latest", "preset", "decode", preset, "--json"], {
    cwd: projectRoot,
  });
  const decodedPresetJson = JSON.parse(decodedPreset) as ShadcnPresetOutput;
  const { values } = decodedPresetJson;
  replaceInTree(uiDir, {
    __SHADCN_PRESET_STYLE__: values.style,
    __SHADCN_PRESET_BASE_COLOR__: values.baseColor,
    __SHADCN_PRESET_ICON_LIBRARY__: values.iconLibrary,
    __SHADCN_PRESET_MENU_COLOR__: values.menuColor,
    __SHADCN_PRESET_ACCENT_COLOR__: values.menuAccent,
  });
  runQuiet("npx", ["shadcn@latest", "apply", preset, "-y", "-s", "-c", uiDir, "--only", "theme"], { cwd: projectRoot });
  runQuiet("npx", ["shadcn@latest", "apply", preset, "-y", "-s", "-c", uiDir, "--only", "font"], { cwd: projectRoot });
}

function createInitialGitCommit(projectRoot: string): void {
  if (!fs.existsSync(path.join(projectRoot, ".git"))) {
    runQuiet("git", ["init"], { cwd: projectRoot });
  }
  runQuiet("git", ["add", "."], { cwd: projectRoot });
  runQuiet("git", ["commit", "-m", "Initial commit"], { cwd: projectRoot });
}

try {
  prompts.intro(colors.magenta("create-jvstack"));

  const appNameInput = await read({
    argvIndex: 2,
    prompt: "App name (use . for current directory):",
    errorMessage: "App name required (e.g. my-app or .).",
  });
  const preset = await read({
    argvIndex: 3,
    prompt: "shadcn preset code (from ui.shadcn.com/create):",
    errorMessage: "shadcn preset code required (e.g. from ui.shadcn.com/create).",
  });
  const { root, appName } = resolveTarget(appNameInput);

  const templateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../templates/default");
  if (!fs.existsSync(templateDir)) {
    console.error(colors.red(`Template not found: ${templateDir}`));
    process.exit(1);
  }

  prompts.log.step(`Creating ${colors.cyan(appName)}...`);
  fs.mkdirSync(root, { recursive: true });
  copyDir(templateDir, root);
  replaceInTree(root, { __APP_NAME__: appName });
  prompts.log.success("Project created.");

  prompts.log.step("Installing dependencies...");
  runQuiet("npm", ["install"], { cwd: root });
  prompts.log.success("Dependencies installed.");

  prompts.log.step(`Applying shadcn preset ${colors.cyan(preset)}...`);
  applyShadcnPreset(root, preset);
  prompts.log.success("Shadcn preset applied.");

  if (await shouldInitializeGit()) {
    prompts.log.step("Creating git repository...");
    createInitialGitCommit(root);
    prompts.log.success("Initial commit created.");
  }

  const rel = path.relative(process.cwd(), root) || ".";
  prompts.outro([`Next:`, `  ${colors.yellow(`cd ${rel}`)}`, `  ${colors.yellow("npx turbo dev")}`].join("\n"));
} catch (error: unknown) {
  console.error(colors.red("Error:"), error instanceof Error ? error.message : error);
  process.exit(1);
}
