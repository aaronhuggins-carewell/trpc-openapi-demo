#!/usr/bin/env node
import { cp, stat, readFile } from 'node:fs/promises';
import { relative, resolve, join as pathJoin } from 'node:path';

interface PackageMeta {
	dependencies?: Record<string, string>;
	bundledDependencies?: true | string[];
	workspaces?: {
		nohoist?: string[];
	};
}

async function main() {
	const cwd = process.cwd();
	const canonicalPackagePath = pathJoin(cwd, 'package.json');
	const canonicalModules = pathJoin(cwd, 'node_modules');
	let unhoisted = false;

	for await (const moduleName of getModuleNames(canonicalPackagePath)) {
		if (!unhoisted) unhoisted = true;

		const canonicalModulePath = pathJoin(canonicalModules, moduleName);
		const foundModulePath = await findModulePath(moduleName, resolve(cwd, '..'));

		if (foundModulePath) {
			const relativeTarget = relative(resolve(cwd, '..'), canonicalModulePath);
			log(`Unhoisting module '${moduleName}' to path '${relativeTarget}'.`);

			await cp(foundModulePath, canonicalModulePath, {
				dereference: true,
				force: true,
				recursive: true,
			});
		}
	}

	if (!unhoisted) log('Nothing to unhoist.');
	log('Finished unhoisting.');
}

function log(...args: any[]) {
	const lead = `bundled_nohoist [${new Date().toISOString()}]:`;
	return console.log(lead, ...args);
}

async function findModulePath(name: string, relative: string, depth: number = 4): Promise<string | void> {
	const dir = pathJoin(relative, 'node_modules', name);

	if (await isResource(dir, 'directory')) {
		return dir;
	} else if (depth > 0) {
		return findModulePath(name, resolve(relative, '..'), depth - 1);
	}

	return undefined;
}

async function* getModuleNames(packagePath: string): AsyncGenerator<string, void, undefined> {
	let packageMeta: PackageMeta = {};

	if (await isResource(packagePath)) {
		const packageMetaText = await (await readFile(packagePath, 'utf8')).trim();
		if (packageMetaText[0] === '{' && packageMetaText[packageMetaText.length - 1] === '}') {
			try {
				packageMeta = JSON.parse(packageMetaText) ?? {};
			} catch {}
		}
	}

	if ('bundledDependencies' in packageMeta) {
		if (Array.isArray(packageMeta.bundledDependencies)) {
			yield* packageMeta.bundledDependencies;
			// unhoistList.push(...packageMeta.bundledDependencies);
		} else if (packageMeta.bundledDependencies === true) {
			yield* Object.keys(packageMeta.dependencies ?? {});
		}
	}

	if (
		'workspaces' in packageMeta &&
		typeof packageMeta.workspaces === 'object' &&
		packageMeta.workspaces !== null &&
		Array.isArray(packageMeta.workspaces.nohoist)
	) {
		yield* packageMeta.workspaces.nohoist;
	}
}

async function isResource(
	path: string,
	resource: 'file' | 'directory' | 'socket' | 'symbolic' = 'file',
): Promise<boolean> {
	try {
		const result = await stat(path);

		switch (resource) {
			case 'directory':
				return result.isDirectory();
			case 'socket':
				return result.isSocket();
			case 'symbolic':
				return result.isSymbolicLink();
			case 'file':
			default:
				return result.isFile();
		}
	} catch {}
	return false;
}

main().catch(log);
