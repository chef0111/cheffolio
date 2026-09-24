#!/usr/bin/env node

import childProcess from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const platformMap = {
  darwin: 'darwin',
  linux: 'linux',
  win32: 'windows',
};

export function packageNamesFor(options) {
  const platform = platformMap[options.platform] ?? options.platform;
  const arch = options.arch;
  const base = `create-gb-app-${platform}-${arch}`;
  const baseline = arch === 'x64' && options.avx2 === false;
  const musl = Boolean(options.musl);

  if (platform === 'linux') {
    if (musl) {
      if (arch === 'x64') {
        return baseline
          ? [`${base}-baseline-musl`, `${base}-musl`, `${base}-baseline`, base]
          : [`${base}-musl`, `${base}-baseline-musl`, base, `${base}-baseline`];
      }
      return [`${base}-musl`, base];
    }
    if (arch === 'x64') {
      return baseline
        ? [`${base}-baseline`, base, `${base}-baseline-musl`, `${base}-musl`]
        : [base, `${base}-baseline`, `${base}-musl`, `${base}-baseline-musl`];
    }
    return [base, `${base}-musl`];
  }

  if (arch === 'x64') {
    return baseline ? [`${base}-baseline`, base] : [base, `${base}-baseline`];
  }
  return [base];
}

function detectAvx2() {
  if (os.arch() !== 'x64') {
    return true;
  }
  if (os.platform() === 'linux') {
    try {
      return /(^|\s)avx2(\s|$)/i.test(fs.readFileSync('/proc/cpuinfo', 'utf8'));
    } catch {
      return null;
    }
  }
  if (os.platform() === 'darwin') {
    const leaf7 = childProcess.spawnSync(
      'sysctl',
      ['-n', 'machdep.cpu.leaf7_features'],
      {
        encoding: 'utf8',
      }
    );
    if (leaf7.status === 0) {
      return /\bAVX2\b/i.test(leaf7.stdout || '');
    }
    const features = childProcess.spawnSync(
      'sysctl',
      ['-n', 'machdep.cpu.features'],
      {
        encoding: 'utf8',
      }
    );
    if (features.status !== 0) {
      return null;
    }
    return /\bAVX2\b/i.test(features.stdout || '');
  }
  if (os.platform() === 'win32') {
    for (const exe of ['pwsh.exe', 'powershell.exe']) {
      const result = childProcess.spawnSync(
        exe,
        [
          '-NoProfile',
          '-Command',
          '[System.Runtime.Intrinsics.X86.Avx2]::IsSupported',
        ],
        { encoding: 'utf8', windowsHide: true, timeout: 5000 }
      );
      const text = (result.stdout || '').trim();
      if (/^True$/i.test(text)) {
        return true;
      }
      if (/^False$/i.test(text)) {
        return false;
      }
    }
    return null;
  }
  return null;
}

function supportsAvx2() {
  return detectAvx2() === true;
}

function isMusl() {
  if (os.platform() !== 'linux') {
    return false;
  }
  try {
    if (fs.existsSync('/etc/alpine-release')) {
      return true;
    }
  } catch {}
  try {
    const result = childProcess.spawnSync('ldd', ['--version'], {
      encoding: 'utf8',
    });
    return `${result.stdout || ''}${result.stderr || ''}`
      .toLowerCase()
      .includes('musl');
  } catch {
    return false;
  }
}

export function currentPackageNames() {
  return packageNamesFor({
    platform: os.platform(),
    arch: os.arch(),
    musl: isMusl(),
    avx2: supportsAvx2(),
  });
}

function packageRoot() {
  const here = path.basename(__dirname);
  if (here === 'script') {
    return path.join(__dirname, '..');
  }
  return __dirname;
}

function sourceBinaryName() {
  return os.platform() === 'win32' ? 'create-gb-app.exe' : 'create-gb-app';
}

function targetBinaryPath() {
  return path.join(packageRoot(), 'bin', sourceBinaryName());
}

function resolveBinary(name) {
  const packageJsonPath = require.resolve(`${name}/package.json`);
  const binaryPath = path.join(
    path.dirname(packageJsonPath),
    'bin',
    sourceBinaryName()
  );
  if (!fs.existsSync(binaryPath)) {
    throw new Error(`Binary not found at ${binaryPath}`);
  }
  return binaryPath;
}

function copyBinary(source, target) {
  if (!fs.existsSync(source)) {
    throw new Error(`Binary not found at ${source}`);
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (fs.existsSync(target)) {
    fs.unlinkSync(target);
  }
  try {
    fs.linkSync(source, target);
  } catch {
    fs.copyFileSync(source, target);
  }
  fs.chmodSync(target, 0o755);
}

function verifyBinary() {
  const result = childProcess.spawnSync(targetBinaryPath(), ['--help'], {
    encoding: 'utf8',
    stdio: 'ignore',
    windowsHide: true,
  });
  return result.status === 0;
}

export function npmCli(platform = os.platform()) {
  return platform === 'win32' ? 'npm.cmd' : 'npm';
}

function installPackage(name, packageJson) {
  const version = packageJson.optionalDependencies?.[name];
  if (!version) {
    return false;
  }
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'create-gb-app-install-'));
  try {
    const result = childProcess.spawnSync(
      npmCli(),
      [
        'install',
        '--ignore-scripts',
        '--no-save',
        '--loglevel=error',
        '--prefix',
        temp,
        `${name}@${version}`,
      ],
      { stdio: 'inherit', windowsHide: true }
    );
    if (result.status !== 0) {
      return false;
    }
    const packageDir = path.join(temp, 'node_modules', name);
    copyBinary(
      path.join(packageDir, 'bin', sourceBinaryName()),
      targetBinaryPath()
    );
    return true;
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

export function main() {
  const root = packageRoot();
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(root, 'package.json'), 'utf8')
  );
  const target = targetBinaryPath();
  for (const name of currentPackageNames()) {
    try {
      copyBinary(resolveBinary(name), target);
      if (verifyBinary()) {
        return;
      }
    } catch {
      if (installPackage(name, packageJson) && verifyBinary()) {
        return;
      }
    }
  }
  throw new Error(
    `It seems your package manager failed to install the right create-gb-app CLI package. Try manually installing ${currentPackageNames()
      .map((name) => JSON.stringify(name))
      .join(' or ')}.`
  );
}

function isDirectRun() {
  const invoked = process.argv[1]
    ? path.normalize(path.resolve(process.argv[1]))
    : '';
  const self = path.normalize(fileURLToPath(import.meta.url));
  return invoked === self;
}

if (isDirectRun()) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
