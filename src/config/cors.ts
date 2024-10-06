import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
	origin: function (origin, callback) {
		const whitelist = [process.env.FRONTEND_URL];

		if (whitelist.includes(origin)) {
			callback(null, true); // primer parametro es el error y el segundo es el resultado
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true,
};
