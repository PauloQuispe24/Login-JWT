function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`La variable de entorno ${name} no está definida.`);
  }
  return value;
}

function getPort(): number {
  const value = process.env.PORT;
  if (!value) {
    return 3000;
  }
  const port = Number(value);
  if (Number.isNaN(port)) {
    throw new Error("Port debe ser un número.");
  }
  return port;
}

export const env = {
  JWT_SECRET: getRequiredEnv("JWT_SECRET"),
  MONGO_URI: getRequiredEnv("MONGO_URI"),
  PORT: getPort(),
};
