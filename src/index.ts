#!/usr/bin/env node
import inquirer from "inquirer";
import { execSync } from "node:child_process";
import chalk from "chalk";

type Category = "Styling" | "State Management" | "Testing" | "UI Components";

const options: Record<Category, Record<string, string>> = {
  "Styling": {
    TailwindCSS: "npm i -D tailwindcss postcss autoprefixer && npx tailwindcss init -p",
    "Styled Components": "npm i styled-components",
    Emotion: "npm i @emotion/react @emotion/styled",
  },
  "State Management": {
    Redux: "npm i @reduxjs/toolkit react-redux",
    Zustand: "npm i zustand",
    Recoil: "npm i recoil",
    Jotai: "npm i jotai",
  },
  "Testing": {
    Jest: "npm i -D jest @types/jest ts-jest",
    Vitest: "npm i -D vitest",
    Cypress: "npm i -D cypress",
  },
  "UI Components": {
    "Material UI": "npm i @mui/material @emotion/react @emotion/styled",
    Shadcn: "npx shadcn-ui init",
    Radix: "npm i @radix-ui/react-accordion @radix-ui/react-dialog",
    Mantine: "npm i @mantine/core @mantine/hooks",
  },
};

async function runWizard() {
  console.log(chalk.cyan("\n🚀 Welcome to Stack Wizard!\n"));

  const { category } = await inquirer.prompt([
    {
      type: "list",
      name: "category",
      message: "Choose a category:",
      choices: Object.keys(options),
    },
  ]);

  const { pkgs } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "pkgs",
      message: `Choose ${category} packages (space to select):`,
      choices: Object.keys(options[category as Category]),
    },
  ]);

  for (const pkg of pkgs) {
    const command = options[category as Category][pkg];
    console.log(chalk.green(`\n📦 Installing ${pkg}...\n`));
    try {
      execSync(command, { stdio: "inherit" });
      console.log(chalk.green(`✅ ${pkg} installed successfully!\n`));
    } catch {
      console.error(chalk.red(`❌ Failed to install ${pkg}\n`));
    }
  }
}

runWizard();
