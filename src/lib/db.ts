import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function createClient(): PrismaClient | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  try {
    const adapter = new PrismaPg({ connectionString: url });
    return new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development"
          ? ["error", "warn"]
          : ["error"],
    });
  } catch {
    return null;
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | null | undefined;
};

// Lazy getter — evaluated on first access, after dotenv has run
export function getPrisma(): PrismaClient | null {
  if (globalForPrisma.prisma === undefined) {
    globalForPrisma.prisma = createClient();
  }
  return globalForPrisma.prisma;
}

/** @deprecated Use getPrisma() in sync scripts. For Next.js server components this still works because Next sets env at startup. */
export const prisma: PrismaClient | null =
  typeof globalForPrisma.prisma !== "undefined"
    ? globalForPrisma.prisma
    : createClient();
