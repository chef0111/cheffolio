#!/usr/bin/env bun

import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import ts from "typescript";

const ROOT = join(import.meta.dir, "..");
const SRC_ROOT = resolve(ROOT, "src");
const SKIP_DIRS = new Set(["node_modules", "dist", ".git", "media"]);
const SOURCE = /\.(ts|tsx|mts)$/;

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) {
      continue;
    }
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(path)));
      continue;
    }
    if (SOURCE.test(entry.name)) {
      files.push(path);
    }
  }
  return files;
}

function resolveSource(fromFile: string, spec: string): string | null {
  if (!spec.startsWith(".")) {
    return null;
  }
  const base = resolve(dirname(fromFile), spec);
  const candidates = extname(base)
    ? [base]
    : [`${base}.ts`, `${base}.tsx`, `${base}.mts`, join(base, "index.ts")];
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      const rel = relative(SRC_ROOT, candidate);
      if (rel.startsWith(`..${sep}`) || rel.startsWith("..")) {
        return null;
      }
      return rel.replaceAll("\\", "/").replace(/\.(ts|tsx|mts)$/, "");
    }
  }
  return null;
}

function rewriteFile(source: string, file: string): string {
  const scriptKind = file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, scriptKind);
  const edits: Array<{ start: number; end: number; next: string }> = [];

  function visit(node: ts.Node): void {
    let literal: ts.StringLiteral | null = null;
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      literal = node.moduleSpecifier;
    } else if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments[0] &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      literal = node.arguments[0];
    }

    if (literal) {
      const inner = resolveSource(file, literal.text);
      if (inner) {
        edits.push({
          start: literal.getStart(sf) + 1,
          end: literal.getEnd() - 1,
          next: `#/${inner}`,
        });
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sf);
  if (edits.length === 0) {
    return source;
  }
  edits.sort((a, b) => b.start - a.start);
  let next = source;
  for (const edit of edits) {
    next = next.slice(0, edit.start) + edit.next + next.slice(edit.end);
  }
  return next;
}

const files = await walk(ROOT);
let changed = 0;
for (const file of files) {
  const before = await readFile(file, "utf8");
  const after = rewriteFile(before, file);
  if (after === before) {
    continue;
  }
  await writeFile(file, after);
  changed += 1;
}

console.log(`rewrote ${changed} files`);
