export function normalizeEnvValue(rawValue: string | undefined) {
  if (!rawValue) {
    return undefined;
  }

  const value = rawValue.trim();

  if (!value) {
    return undefined;
  }

  const first = value[0];
  const last = value[value.length - 1];

  if (
    value.length >= 2 &&
    ((first === '"' && last === '"') ||
      (first === "'" && last === "'") ||
      (first === "`" && last === "`"))
  ) {
    const unquoted = value.slice(1, -1).trim();
    return unquoted || undefined;
  }

  return value;
}

export function getEnvValue(key: string) {
  return normalizeEnvValue(process.env[key]);
}

export function getEnvPrivateKey(key: string) {
  return getEnvValue(key)?.replace(/\\n/g, "\n");
}
