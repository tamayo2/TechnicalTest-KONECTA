import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";


const prisma = new PrismaClient();

async function main() {
    await prisma.user.upsert({
        where: { email: "admin@bank.com" },
        update: {},
        create: {
            name: "Admin",
            email: "admin@bank.com",
            role: "ADMIN",
            passwordHash: await bcrypt.hash("Admin123", 10),
        },
    });

    await prisma.user.upsert({
        where: { email: "asesor@bank.com" },
        update: {},
        create: {
            name: "Asesor",
            email: "asesor@bank.com",
            role: "ADVISOR",
            passwordHash: await bcrypt.hash("Asesor123", 10),
        },
    });

    console.log("Seed OK");
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => prisma.$disconnect());
