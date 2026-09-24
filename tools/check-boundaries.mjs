#!/usr/bin/env node
/**
 * Vérifie l'isolation des modules de jeu (voir docs/ARCHITECTURE.md §4) :
 * un jeu n'importe que ses propres fichiers et les paquets autorisés, et ne
 * déclare aucune autre dépendance.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ALLOWED_PACKAGES = new Set(['@ooh/game-sdk', '@ooh/ui', 'zod', 'svelte']);

const SOURCE_FILE = /\.(?:[cm]?[jt]s|svelte)$/;
const IGNORED_DIRS = new Set(['node_modules', '.svelte-kit', 'build', 'dist', 'coverage']);
const IMPORT_PATTERNS = [
	/\bimport\s+(?:type\s+)?(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]/g,
	/\bexport\s+(?:type\s+)?[^'"]*?\s+from\s+['"]([^'"]+)['"]/g,
	/\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
	/\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g
];

/** Nom du paquet d'un spécificateur nu (`@scope/nom/sous-chemin` → `@scope/nom`). */
export function packageName(specifier) {
	const parts = specifier.split('/');
	return specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
}

export function extractImports(source) {
	const found = new Set();
	for (const pattern of IMPORT_PATTERNS) {
		for (const match of source.matchAll(pattern)) found.add(match[1]);
	}
	return [...found];
}

function* walk(dir) {
	for (const entry of readdirSync(dir)) {
		if (IGNORED_DIRS.has(entry)) continue;
		const path = join(dir, entry);
		if (statSync(path).isDirectory()) yield* walk(path);
		else if (SOURCE_FILE.test(entry)) yield path;
	}
}

/** @returns {string[]} liste des violations, vide si le jeu est conforme. */
export function checkGame(gameDir) {
	const violations = [];
	const root = resolve(gameDir);
	const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

	for (const field of ['dependencies', 'devDependencies', 'peerDependencies']) {
		for (const dep of Object.keys(pkg[field] ?? {})) {
			if (!ALLOWED_PACKAGES.has(dep) && !(field === 'devDependencies' && isToolingDep(dep))) {
				violations.push(`package.json : dépendance interdite « ${dep} » (${field})`);
			}
		}
	}

	for (const file of walk(root)) {
		const rel = relative(root, file);
		for (const specifier of extractImports(readFileSync(file, 'utf8'))) {
			if (specifier.startsWith('.') || specifier.startsWith('/')) {
				const target = resolve(dirname(file), specifier);
				if (target !== root && !target.startsWith(root + sep)) {
					violations.push(`${rel} : import hors du module « ${specifier} »`);
				}
			} else if (specifier.startsWith('node:')) {
				violations.push(`${rel} : module Node interdit « ${specifier} »`);
			} else if (!ALLOWED_PACKAGES.has(packageName(specifier))) {
				violations.push(`${rel} : import interdit « ${specifier} »`);
			}
		}
	}
	return violations;
}

/** Outillage de développement autorisé (jamais embarqué dans le code du jeu). */
function isToolingDep(dep) {
	return dep === 'typescript' || dep === 'vitest';
}

function main() {
	const gamesDir = fileURLToPath(new URL('../games', import.meta.url));
	let failures = 0;
	for (const game of readdirSync(gamesDir)) {
		const dir = join(gamesDir, game);
		if (!statSync(dir).isDirectory()) continue;
		for (const violation of checkGame(dir)) {
			console.error(`✗ games/${game}/${violation}`);
			failures++;
		}
	}
	if (failures > 0) {
		console.error(`\n${failures} violation(s) des frontières de modules.`);
		process.exit(1);
	}
	console.warn('✓ Frontières des modules de jeu respectées.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
