export type ConvertNpmCommandResult = {
  bun: string;
  pnpm: string;
  npm: string;
  yarn: string;
};

export function convertNpmCommand(npmCommand: string): ConvertNpmCommandResult {
  if (npmCommand.startsWith('npm install')) {
    return {
      bun: npmCommand.replaceAll('npm install', 'bun add'),
      pnpm: npmCommand.replaceAll('npm install', 'pnpm add'),
      npm: npmCommand,
      yarn: npmCommand.replaceAll('npm install', 'yarn add'),
    };
  }

  if (npmCommand.startsWith('npx create-')) {
    return {
      bun: npmCommand.replace('npx', 'bunx --bun'),
      pnpm: npmCommand.replace('npx create-', 'pnpm create '),
      npm: npmCommand,
      yarn: npmCommand.replace('npx create-', 'yarn create '),
    };
  }

  if (npmCommand.startsWith('npm create')) {
    return {
      bun: npmCommand.replace('npm create', 'bun create'),
      pnpm: npmCommand.replace('npm create', 'pnpm create'),
      npm: npmCommand,
      yarn: npmCommand.replace('npm create', 'yarn create'),
    };
  }

  if (npmCommand.startsWith('npx')) {
    return {
      bun: npmCommand.replace('npx', 'bunx --bun'),
      pnpm: npmCommand.replace('npx', 'pnpm dlx'),
      npm: npmCommand,
      yarn: npmCommand.replace('npx', 'yarn dlx'),
    };
  }

  if (npmCommand.startsWith('npm run')) {
    return {
      bun: npmCommand.replace('npm run', 'bun'),
      pnpm: npmCommand.replace('npm run', 'pnpm'),
      npm: npmCommand,
      yarn: npmCommand.replace('npm run', 'yarn'),
    };
  }

  return {
    bun: npmCommand,
    pnpm: npmCommand,
    npm: npmCommand,
    yarn: npmCommand,
  };
}
