import 'dotenv/config';
import pkg from "@prisma/client";
const { PrismaClient, Prisma } = pkg;

export const prisma = new PrismaClient();
export { PrismaClient, Prisma };
export default prisma;
