export const logger = {
  info: (message: string, meta: any = {}) => {
    console.log(JSON.stringify({ level: 'info', message, ...redact(meta), timestamp: new Date().toISOString() }));
  },
  warn: (message: string, meta: any = {}) => {
    console.warn(JSON.stringify({ level: 'warn', message, ...redact(meta), timestamp: new Date().toISOString() }));
  },
  error: (message: string, meta: any = {}) => {
    console.error(JSON.stringify({ level: 'error', message, ...redact(meta), timestamp: new Date().toISOString() }));
  }
};

function redact(meta: any): any {
  const redacted = { ...meta };
  const sensitiveKeys = ['password', 'token', 'authorization', 'secret'];
  for (const key of Object.keys(redacted)) {
    if (sensitiveKeys.includes(key.toLowerCase())) {
      redacted[key] = '[REDACTED]';
    } else if (typeof redacted[key] === 'object' && redacted[key] !== null) {
      redacted[key] = redact(redacted[key]);
    }
  }
  return redacted;
}
