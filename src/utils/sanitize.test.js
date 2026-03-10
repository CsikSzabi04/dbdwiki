import { describe, it, expect } from 'vitest';
import { sanitizeInput } from './sanitize';

describe('sanitizeInput', () => {
    it('should return an empty string if input is falsy', () => {
        expect(sanitizeInput(null)).toBe('');
        expect(sanitizeInput(undefined)).toBe('');
        expect(sanitizeInput('')).toBe('');
    });

    it('should allow normal text', () => {
        const text = 'This is a normal bio.';
        expect(sanitizeInput(text)).toBe(text);
    });

    it('should allow basic safe HTML', () => {
        const html = '<b>Bold</b> and <i>italic</i>';
        expect(sanitizeInput(html)).toBe(html);
    });

    it('should strip dangerous script tags', () => {
        const malicious = '<script>alert("xss")</script>Safe text';
        const result = sanitizeInput(malicious);
        expect(result).not.toContain('<script>');
        expect(result).not.toContain('alert');
        expect(result).toContain('Safe text');
    });

    it('should remove dangerous event handlers from tags', () => {
        const malicious = '<img src="x" onerror="alert(1)">';
        const result = sanitizeInput(malicious);
        expect(result).not.toContain('onerror');
        expect(result).toContain('<img src="x">');
    });

    it('should strip iframes', () => {
        const malicious = '<iframe src="javascript:alert(1)"></iframe>';
        const result = sanitizeInput(malicious);
        expect(result).not.toContain('iframe');
    });
});
