import path from 'path';

function quotedRelative(filenames) {
  return filenames
    .map((f) => `"${path.relative(process.cwd(), f).replaceAll('\\', '/')}"`)
    .join(' ');
}

const lintStagedConfig = {
  'apps/web/**/*.{js,jsx,ts,tsx}': [
    (filenames) =>
      `eslint --config apps/web/eslint.config.mjs --fix ${quotedRelative(filenames)}`,
    'prettier --write',
  ],
  'packages/create-gb-app/**/*.{js,ts,tsx}': [
    (filenames) =>
      `eslint --config packages/create-gb-app/eslint.config.mjs --fix ${quotedRelative(filenames)}`,
  ],
  '*.mdx': 'prettier --write',
};

export default lintStagedConfig;
