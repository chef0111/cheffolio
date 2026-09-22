import { setFile } from "#/generate/files";
import { joinPath, libDir } from "#/generate/paths";
import type { EmitCtx } from "#/generate/types";

export function emitPrisma(ctx: EmitCtx): void {
  ctx.pkg.dependencies["@prisma/client"] = "^6.16.1";
  ctx.pkg.devDependencies.prisma = "^6.16.1";
  ctx.pkg.scripts["db:generate"] = "prisma generate";
  ctx.pkg.scripts["db:push"] = "prisma db push";

  const dbPath =
    ctx.stack.backend === "nest"
      ? "apps/server/src/db.ts"
      : joinPath(libDir(ctx.stack), "db.ts");
  const schemaPath =
    ctx.stack.backend === "nest"
      ? "apps/server/prisma/schema.prisma"
      : "prisma/schema.prisma";
  const noteUser =
    ctx.stack.auth === "none"
      ? ""
      : `
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
`;
  const noteIndex = ctx.stack.auth === "none" ? "" : "\n  @@index([userId])";
  const authModels =
    ctx.stack.auth === "better-auth"
      ? `
model User {
  id            String    @id
  name          String
  email         String
  emailVerified Boolean
  image         String?
  createdAt     DateTime
  updatedAt     DateTime
  sessions      Session[]
  accounts      Account[]
  notes         Note[]

  @@unique([email])
  @@map("user")
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String
  createdAt DateTime
  updatedAt DateTime
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@index([userId])
  @@map("session")
}

model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime
  updatedAt             DateTime

  @@index([userId])
  @@map("account")
}

model Verification {
  id         String    @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime?
  updatedAt  DateTime?

  @@index([identifier])
  @@map("verification")
}
`
      : ctx.stack.auth === "clerk"
        ? ""
        : "";

  const provider =
    ctx.stack.backend === "convex"
      ? "postgresql"
      : ctx.stack.backend === "self" || ctx.stack.backend === "nest"
        ? ctx.stack.database === "mysql"
          ? "mysql"
          : ctx.stack.database === "sqlite"
            ? "sqlite"
            : "postgresql"
        : "postgresql";

  setFile(
    ctx.files,
    dbPath,
    `import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
`,
  );

  setFile(
    ctx.files,
    schemaPath,
    `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${provider}"
  url      = env("DATABASE_URL")
}
${authModels}
model Note {
  id        String   @id @default(cuid())
  title     String
  body      String${noteUser}
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt${noteIndex}
}
`,
  );
}

