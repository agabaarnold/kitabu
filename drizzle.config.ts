import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: [".env.local", ".env"] });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
	throw new Error("DATABASE_URL must be defined");
}

export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema/*.schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: dbUrl,
	},
});
