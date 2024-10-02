import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator"; // funcion para obtener el resultado de una validacion

export const handleInputErrors = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let errors = validationResult(req);

	if (!errors.isEmpty()) {
		res.status(400).json({ errors: errors.array() });
		return;
	}

	next();
};
