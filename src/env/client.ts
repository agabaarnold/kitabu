import { createEnv } from "@t3-oss/env-core";

export const clientEnv = createEnv({
	client: {},
	clientPrefix: "VITE_",
	runtimeEnv: import.meta.env,
	emptyStringAsUndefined: true,
});
