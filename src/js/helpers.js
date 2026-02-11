
export function formatAny(value, indent = 0) {
    const pad = '  '.repeat(indent);

    if (value === null) return `${pad}null`;
    if (value === undefined) return `${pad}undefined`;

    const t = typeof value;

    if (t !== 'object') {
        return `${pad}${String(value)}`;
    }

    if (Array.isArray(value)) {
        if (value.length === 0) return `${pad}[]`;
        return value.map((v, i) => `${pad}[${i}]:\n${formatAny(v, indent + 1)}`).join('\n');
    }

    const keys = Object.keys(value);
    if (keys.length === 0) return `${pad}{}`;

    return keys
        .map(k => `${pad}${k}:\n${formatAny(value[k], indent + 1)}`)
        .join('\n');
}

export function fetcherrors(errorCode) {
    switch (errorCode) {
        case 404:
            return 'Not found'
        case 500:
            return 'Internal Server Error'
        case 'response_ko':
            return 'There was no response from the server'
        case 'no_items':
            return 'We could not find any items'
        default:
            return 'There was an error'
    }
}

export function escapeHtml(str) {
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}