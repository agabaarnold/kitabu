import {
	accounts,
	passkeys,
	rateLimits,
	sessions,
	users,
	verifications,
} from "./auth.schema";

export const schema = {
	accounts,
	passkeys,
	rateLimits,
	sessions,
	users,
	verifications,
} as const