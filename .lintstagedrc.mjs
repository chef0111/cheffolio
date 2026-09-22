import path from 'path';

function getRelativePath(filenames, workingDirectory = process.cwd()) {
  return filenames
    .map((f) => `"${path.relative(workingDirectory, f).replaceAll('\\', '/')}"`)
    .join(' ');
}

const lintStagedConfig = {
  'apps/web/**/*.{js,jsx,ts,tsx}': [
    (filenames) =>
      `bun run --filter web lint -- --fix ${getRelativePath(
        filenames,
        path.resolve(process.cwd(), 'apps/web')
      )}`,
    'prettier --write',
  ],
  'packages/create-gb-app/**/*.{js,ts,tsx}': [
    (filenames) =>
      `bun run --filter create-gb-app lint -- --fix ${getRelativePath(
        filenames,
        path.resolve(process.cwd(), 'packages/create-gb-app')
      )}`,
  ],
  '*.mdx': 'prettier --write',
};

export default lintStagedConfig;
