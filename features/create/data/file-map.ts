export type FileMap = Record<string, string>;

export const CREATE_FILE_MAP: FileMap = {
  'package.json': `{
  "name": "my-gb-app",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  },
  "dependencies": {
    "next": "16.0.0",
    "react": "19.0.0",
    "react-dom": "19.0.0"
  }
}
`,
  'app/layout.tsx': `export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
  'app/page.tsx': `export default function HomePage() {
  return <main>Hello from my-gb-app</main>;
}
`,
  'lib/utils.ts': `export function cn(...inputs: Array<string | undefined>) {
  return inputs.filter(Boolean).join(' ');
}
`,
};

export function defaultSelectedPath(paths: readonly string[]): string | null {
  if (paths.includes('package.json')) {
    return 'package.json';
  }
  const sorted = [...paths].sort();
  return sorted[0] ?? null;
}
