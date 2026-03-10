import DOMPurify from 'dompurify';

/**
 * Sanitizes an input string to prevent Cross-Site Scripting (XSS) attacks.
 * It strips out any dangerous HTML tags or attributes (like <script> or on* events).
 * @param {string} dirtyInput The potentially malicious user input.
 * @returns {string} The cleaned, safe string.
 */
export const sanitizeInput = (dirtyInput) => {
    if (!dirtyInput) return '';
    // Use DOMPurify to strip any dangerous HTML elements/attributes, 
    // but we can allow safe text. 
    // By default, it allows safe HTML, but we can configure it to allow nothing (plain text only) if we want.
    // Here we use default safe HTML configuration to be safe while allowing standard text.
    return DOMPurify.sanitize(dirtyInput);
};
