export type ConvertNpmCommandResult = {
  bun: string;
  pnpm: string;
  npm: string;
  yarn: string;
};

export function convertNpmCommand(npmCommand: string): ConvertNpmCommandResult {
  if (npmCommand.startsWith('npm install')) {
    return {
      npm: npmCommand,
      yarn: npmCommand.replaceAll('npm install', 'yarn add'),
      pnpm: npmCommand.replaceAll('npm install', 'pnpm add'),
      bun: npmCommand.replaceAll('npm install', 'bun add'),
    };
  }

  if (npmCommand.startsWith('npx create-')) {
    return {
      npm: npmCommand,
      yarn: npmCommand.replace('npx create-', 'yarn create '),
      pnpm: npmCommand.replace('npx create-', 'pnpm create '),
      bun: npmCommand.replace('npx', 'bunx --bun'),
    };
  }

  if (npmCommand.startsWith('npm create')) {
    return {
      npm: npmCommand,
      yarn: npmCommand.replace('npm create', 'yarn create'),
      pnpm: npmCommand.replace('npm create', 'pnpm create'),
      bun: npmCommand.replace('npm create', 'bun create'),
    };
  }

  if (npmCommand.startsWith('npx')) {
    return {
      npm: npmCommand,
      yarn: npmCommand.replace('npx', 'yarn dlx'),
      pnpm: npmCommand.replace('npx', 'pnpm dlx'),
      bun: npmCommand.replace('npx', 'bunx --bun'),
    };
  }

  if (npmCommand.startsWith('npm run')) {
    return {
      npm: npmCommand,
      yarn: npmCommand.replace('npm run', 'yarn'),
      pnpm: npmCommand.replace('npm run', 'pnpm'),
      bun: npmCommand.replace('npm run', 'bun'),
    };
  }

  return {
    npm: npmCommand,
    yarn: npmCommand,
    pnpm: npmCommand,
    bun: npmCommand,
  };
}
