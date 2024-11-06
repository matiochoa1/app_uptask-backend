import type { Request, Response } from "express";

import User from "../models/User";
import { hashPassword } from "../utils/auth";

export class AuthController {
	static createAccount = async (req: Request, res: Response) => {
		try {
			const { password, email } = req.body;
			// Prevenir duplicados
			const userExists = await User.findOne({ email }); // buscara un usuario con el email que se envio en el body
			if (userExists) {
				const error = new Error("El usuario ya existe");
				return res.status(409).send({ error: error.message }); // 409 es un error de conflicto
			}

			// Crear el usuario
			const user = new User(req.body);

			user.password = await hashPassword(password);

			await user.save();

			res.send("Cuenta creada, revisa tu correo para confirmarla");
		} catch (error) {
			res.status(500).json({ error: "Hubo un error" });
		}
	};
}
