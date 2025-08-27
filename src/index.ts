#!/usr/bin/env node
import inquirer from "inquirer";
import { execSync } from "child_process";
import chalk from "chalk";
import os from "os";
import fs from "fs";
import path from "path";


async function safePrompt(prompt: any) {
  try {
    return await inquirer.prompt(prompt);
  } catch (err: any) {
    if (err.name === "ExitPromptError") {
      console.log(chalk.yellow("\n⛔ Prompt canceled. You can run the CLI again anytime!"));
      process.exit(0);
    } else {
      throw err;
    }
  }
}

const stylingOptions: Record<string, string> = {
  TailwindCSS: "tailwindcss postcss autoprefixer",
  Bootstrap: "bootstrap",
  "Styled Components": "styled-components",
  Emotion: "@emotion/react @emotion/styled",
  Sass: "sass",
  Less: "less",
  "Material UI": "@mui/material @emotion/react @emotion/styled",
  "Chakra UI": "@chakra-ui/react @emotion/react @emotion/styled",
};

const stateOptions: Record<string, string> = {
  Redux: "@reduxjs/toolkit react-redux",
  Zustand: "zustand",
  Jotai: "jotai",
  Recoil: "recoil",
  MobX: "mobx mobx-react-lite",
};

const routingOptions: Record<string, string> = {
  "React Router": "react-router-dom",
  "Vue Router": "vue-router",
  "Svelte Navigator": "svelte-navigator",
};

const utilityOptions: Record<string, string> = {
  Lodash: "lodash",
  Dayjs: "dayjs",
  Axios: "axios",
  "React Query": "@tanstack/react-query",
};

const testingOptions: Record<string, string> = {
  Jest: "jest @types/jest ts-jest",
  Vitest: "vitest",
  Cypress: "cypress",
  "React Testing Library": "@testing-library/react @testing-library/jest-dom",
};

const lintingOptions: Record<string, string> = {
  ESLint: "eslint",
  Prettier: "prettier eslint-config-prettier eslint-plugin-prettier",
  StandardJS: "standard",
};

const componentOptions: Record<string, string> = {
  "Material UI": "@mui/material @emotion/react @emotion/styled",
  Mantine: "@mantine/core @mantine/hooks",
  "Shadcn UI": "",
  "Ant Design": "antd",
  "Radix UI": "@radix-ui/react-accordion @radix-ui/react-dialog",
};

const envOptions: Record<string, string> = {
  Dotenv: "dotenv",
  EnvSetup: "",
  "Theme / Dark Mode": "",
};

const shellCommands: Record<string, string> = {
  "Components Folder": "src/components",
  "Pages Folder": "src/pages",
  "Hooks Folder": "src/hooks",
  "Utils Folder": "src/utils",
  "Boilerplate Files": "src/App.tsx src/main.tsx src/index.html",
  "README / LICENSE": "README.md LICENSE",
  "GitHub Actions": ".github/workflows/node.yml",
};

const devToolsOptions: Record<string, string> = {
  "React Icons": "react-icons",
  "Form Handling": "react-hook-form formik",
  "State DevTools": "redux-devtools-extension",
};

async function runCLI() {
  console.log(chalk.cyan("\n🚀 Welcome to Vite Stack Wizard!\n"));

  const { projectName } = await safePrompt([
    { type: "input", name: "projectName", message: "Project name:", default: "my-vite-app" },
  ]);

  const { framework } = await safePrompt([
    { type: "list", name: "framework", message: "Choose a framework:", choices: ["react", "vue", "svelte", "vanilla"] },
  ]);

  const { language } = await safePrompt([
    { type: "list", name: "language", message: "Choose a language:", choices: ["JavaScript", "TypeScript"] },
  ]);

  console.log(chalk.green(`\n📦 Creating Vite app: ${projectName}\n`));
  execSync(`npm create vite@latest ${projectName} -- --template ${framework}${language === "TypeScript" ? "-ts" : ""}`, { stdio: "inherit" });

  process.chdir(projectName);
  console.log(chalk.cyan(`\n📂 Switched to project folder: ${projectName}\n`));

  const allOptionGroups: { [key: string]: Record<string, string> } = {
    Styling: stylingOptions,
    State: stateOptions,
    Routing: routingOptions,
    Utilities: utilityOptions,
    Testing: testingOptions,
    Linting: lintingOptions,
    Components: componentOptions,
    Env: envOptions,
    DevTools: devToolsOptions,
  };

  const packagesToInstall: string[] = [];


  for (const [category, options] of Object.entries(allOptionGroups)) {
    const { selection } = await safePrompt([
      { type: "checkbox", name: "selection", message: `Choose ${category} options:`, choices: Object.keys(options) },
    ]);
    (selection as string[]).forEach((pkg: string) => {
      const cmd = options[pkg];
      if (cmd && cmd.trim() !== "") packagesToInstall.push(cmd);
    });
  }

  if (packagesToInstall.length > 0) {
    console.log(chalk.green(`\n📦 Installing npm packages...\n`));
    execSync(`npm install ${packagesToInstall.join(' ')}`, { stdio: 'inherit', shell: os.platform() === 'win32' ? 'cmd.exe' : '/bin/sh' });
  }

  for (const [name, fileOrDirPath] of Object.entries(shellCommands)) {
    if (!fileOrDirPath) continue;
    const paths = fileOrDirPath.split(' ');

    paths.forEach(p => {
      const fullPath = path.resolve(process.cwd(), p);
      const dir = path.dirname(fullPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (p.includes('.') && !fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, '');
      }
    });
  }

  const { extras } = await safePrompt([
    { type: "checkbox", name: "extras", message: "Extra actions:", choices: ["Git Initialization", "Start Dev Server"] },
  ]);

  if (extras.includes("Git Initialization")) {
    console.log(chalk.green(`\n🐙 Initializing Git repository...\n`));
    execSync("git init", { stdio: "inherit", shell: os.platform() === 'win32' ? 'cmd.exe' : '/bin/sh' });
  }

  if (extras.includes("Start Dev Server")) {
    console.log(chalk.green(`\n🚀 Starting development server...\n`));
    execSync("npm run dev", { stdio: 'inherit', shell: os.platform() === 'win32' ? 'cmd.exe' : '/bin/sh' });
  }

  console.log(chalk.magenta(`\n✨ Project setup complete!`));
}

process.on('SIGINT', () => {
  console.log(chalk.yellow('\n⛔ CLI interrupted. You can run it again anytime!'));
  process.exit(0);
});

runCLI();
