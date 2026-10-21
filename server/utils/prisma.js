// Shared Prisma client - every module imports this SAME instance.
import pkg from "@prisma/client";
const { PrismaClient, Prisma } = pkg;

const prisma = new PrismaClient();

export default prisma;
export { prisma, PrismaClient, Prisma };
