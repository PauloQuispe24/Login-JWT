function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`La variable de entorno ${value} no está definida.`);
  }
  return value;
}

export const env = { JWT_SECRET: getRequiredEnv("JWT_SECRET") };
