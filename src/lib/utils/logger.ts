import pino from "pino";

const isEdge = !!process.env.NEXT_RUNTIME && process.env.NEXT_RUNTIME !== "nodejs";
const isDev = process.env.NODE_ENV === "development";

const logger = pino(
  isDev && !isEdge
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true }
        }
      }
    : undefined
);

export default logger;
