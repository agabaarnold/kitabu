import { index, snakeCase } from "drizzle-orm/pg-core";

export const users = snakeCase.table("users", (t) => ({
	id: t.text().primaryKey(),
	name: t.text().notNull(),
	email: t.text().notNull().unique(),
	emailVerified: t.boolean().default(false).notNull(),
	image: t.text(),
	createdAt: t.timestamp().notNull(),
	updatedAt: t
		.timestamp()
		.$onUpdate(() => new Date())
		.notNull(),
	role: t.text(),
	banned: t.boolean().default(false),
	banReason: t.text(),
	banExpires: t.timestamp(),
}));

export const sessions = snakeCase.table(
	"sessions",
	(t) => ({
		id: t.text().primaryKey(),
		expiresAt: t.timestamp().notNull(),
		token: t.text().notNull().unique(),
		createdAt: t.timestamp().notNull(),
		updatedAt: t
			.timestamp()
			.$onUpdate(() => new Date())
			.notNull(),
		ipAddress: t.text(),
		userAgent: t.text(),
		userId: t
			.text()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		impersonatedBy: t.text(),
	}),
	(table) => [index("sessions_userId_idx").on(table.userId)],
);

export const accounts = snakeCase.table(
	"accounts",
	(t) => ({
		id: t.text().primaryKey(),
		accountId: t.text().notNull(),
		providerId: t.text().notNull(),
		userId: t
			.text()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		accessToken: t.text(),
		refreshToken: t.text(),
		idToken: t.text(),
		accessTokenExpiresAt: t.timestamp(),
		refreshTokenExpiresAt: t.timestamp(),
		scope: t.text(),
		password: t.text(),
		createdAt: t.timestamp().notNull(),
		updatedAt: t
			.timestamp()
			.$onUpdate(() => new Date())
			.notNull(),
	}),
	(table) => [index("accounts_userId_idx").on(table.userId)],
);

export const verifications = snakeCase.table(
	"verifications",
	(t) => ({
		id: t.text().primaryKey(),
		identifier: t.text().notNull(),
		value: t.text().notNull(),
		expiresAt: t.timestamp().notNull(),
		createdAt: t.timestamp().notNull(),
		updatedAt: t
			.timestamp()
			.$onUpdate(() => new Date())
			.notNull(),
	}),
	(table) => [index("verifications_identifier_idx").on(table.identifier)],
);

export const passkeys = snakeCase.table(
	"passkeys",
	(t) => ({
		id: t.text().primaryKey(),
		name: t.text(),
		publicKey: t.text().notNull(),
		userId: t
			.text()
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		credentialID: t.text().notNull(),
		counter: t.integer().notNull(),
		deviceType: t.text().notNull(),
		backedUp: t.boolean().notNull(),
		transports: t.text(),
		createdAt: t.timestamp(),
		aaguid: t.text(),
	}),
	(table) => [
		index("passkeys_userId_idx").on(table.userId),
		index("passkeys_credentialID_idx").on(table.credentialID),
	],
);

export const rateLimits = snakeCase.table("rate_limits", (t) => ({
	id: t.text().primaryKey(),
	key: t.text("key").notNull().unique(),
	count: t.integer().notNull(),
	lastRequest: t.bigint({ mode: "number" }).notNull(),
}));
