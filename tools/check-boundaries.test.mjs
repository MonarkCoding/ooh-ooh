import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { checkGame, extractImports, packageName } from './check-boundaries.mjs';

let root;

function makeGame(files, pkg = { dependencies: { '@ooh/game-sdk': 'workspace:*' } }) {
	root = mkdtempSync(join(tmpdir(), 'ooh-boundaries-'));
	const game = join(root, 'games', 'demo');
	mkdirSync(join(game, 'src'), { recursive: true });
	writeFileSync(join(game, 'package.json'), JSON.stringify(pkg));
	for (const [name, content] of Object.entries(files))
		writeFileSync(join(game, 'src', name), content);
	return game;
}

afterEach(() => {
	if (root) rmSync(root, { recursive: true, force: true });
	root = undefined;
});

describe('extractImports', () => {
	it('détecte les imports statiques, dynamiques, de type et les réexports', () => {
		const source = `
			import a from 'a';
			import type { B } from "b";
			import 'c';
			export { d } from './d.js';
			const e = await import('e');
		`;
		expect(extractImports(source).sort()).toEqual(['./d.js', 'a', 'b', 'c', 'e']);
	});
});

describe('packageName', () => {
	it('extrait le nom du paquet', () => {
		expect(packageName('@ooh/ui/Button.svelte')).toBe('@ooh/ui');
		expect(packageName('svelte/transition')).toBe('svelte');
	});
});

describe('checkGame', () => {
	it('accepte un module conforme', () => {
		const game = makeGame({
			'a.ts': `import { defineManifest } from '@ooh/game-sdk';\nimport { z } from 'zod';\nimport { b } from './b.js';`,
			'b.ts': `export const b = 1;`
		});
		expect(checkGame(game)).toEqual([]);
	});

	it.each([
		['un autre jeu', `import x from '@ooh/game-bluff-quiz';`],
		['le cœur de la plateforme', `import x from '@ooh/core';`],
		['la base de données', `import x from '@ooh/db';`],
		['un chemin relatif hors du module', `import x from '../../other/src/x.js';`],
		['un module Node', `import fs from 'node:fs';`]
	])('refuse un import vers %s', (_label, source) => {
		expect(checkGame(makeGame({ 'a.ts': source }))).toHaveLength(1);
	});

	it('refuse une dépendance non autorisée dans package.json', () => {
		const game = makeGame({}, { dependencies: { pg: '^8.0.0' } });
		expect(checkGame(game)).toEqual([expect.stringContaining('pg')]);
	});
});
