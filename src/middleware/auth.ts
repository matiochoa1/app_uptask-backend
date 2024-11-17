import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

declare global {
	namespace Express {
		interface Request {
			user?: IUser; // agregamos el tipo de dato que va a tener el usuario desde nuestro interface
		}
	}
}

export const authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const bearer = req.headers.authorization; // guardamos el token en el Bearer Token que viene en el header de la petición

	if (!bearer) {
		const error = new Error("No autorizado");

		res.status(401).json({ error: error.message });
	}

	const [, token] = bearer.split(" "); // aplicamos array destructuring para separar el Bearer del token

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify es un metodo de jwt que verifica si el token es valido

		// si el token es valido, entonces decodificamos el token y obtenemos el id del usuario para buscarlo en la base de datos
		if (typeof decoded === "object" && decoded.id) {
			const user = await User.findById(decoded.id).select("_id name email");

			if (user) {
				req.user = user;
			} else {
				res.status(500).json({ error: "Usuario no encontrado" });
			}
		}
	} catch (error) {
		res.status(500).json({ error: "Token no valido" });
	}

	next();
};
