import { neon } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// -- NeonDB (production) --
// const sql = neon(process.env["DATABASE_URL"]!);
// export const db = drizzle(sql, { schema });

// -- Local Postgres (testing) --
import { drizzle } from "drizzle-orm/node-postgres";
export const db = drizzle(process.env["DATABASE_URL"]!, { schema });
