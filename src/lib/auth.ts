import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth/minimal";
import { admin, haveIBeenPwned } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { db } from "../db";
import { schema } from "../db/schema";

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: "pg", schema, usePlural: true }),
	emailAndPassword: {
		enabled: true,
	},
	rateLimit: { enabled: true, storage: "database" },
	plugins: [admin(), passkey(), haveIBeenPwned(), tanstackStartCookies()],
});
