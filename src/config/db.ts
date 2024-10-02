import mongoose from "mongoose";
import colors from "colors";
import { exit } from "node:process";

export const connectDB = async () => {
	try {
		const { connection } = await mongoose.connect(process.env.DATABASE_URL);
		const url = `${connection.host}:${connection.port}`;
		console.log(colors.bgGreen.bold(`MongoDB Connected: ${url}`));
	} catch (error) {
		console.log(colors.bgRed.bold(`Error al conectar la DB: ${error.message}`));
		exit(1); // 0 es que el programa tiene que terminar pero todo esta bien, el 1 es que el programa tiene que terminar y algo salio mal
	}
};
