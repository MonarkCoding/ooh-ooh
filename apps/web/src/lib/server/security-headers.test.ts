import { describe, expect, it } from 'vitest';
import { applySecurityHeaders } from './security-headers';

describe('applySecurityHeaders', () => {
	it('ajoute les en-têtes de sécurité', () => {
		const headers = new Headers();
		applySecurityHeaders(headers);
		expect(headers.get('X-Content-Type-Options')).toBe('nosniff');
		expect(headers.get('X-Frame-Options')).toBe('DENY');
		expect(headers.get('Strict-Transport-Security')).toContain('max-age=');
	});

	it('ne remplace pas un en-tête déjà défini par une route', () => {
		const headers = new Headers({ 'Referrer-Policy': 'no-referrer' });
		applySecurityHeaders(headers);
		expect(headers.get('Referrer-Policy')).toBe('no-referrer');
	});
});
