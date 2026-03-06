import { webAuth } from "@repo/auth/auth";
import { toNextJsHandler } from "@repo/auth/next-js";

export const { GET, POST } = toNextJsHandler(webAuth);
