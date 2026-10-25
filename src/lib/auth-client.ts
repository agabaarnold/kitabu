import { passkeyClient } from "@better-auth/passkey/client";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { auth } from "./auth";

export const authClient = createAuthClient({
	plugins: [
		adminClient(),
		passkeyClient(),
		inferAdditionalFields<typeof auth>(),
	],
});
