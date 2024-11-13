import { Router } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";

const router = Router(); // definiremos todas las rutas de usuario desde crear cuenta, restablecer contraseña, etc

router.post(
	"/create-account",
	body("name").notEmpty().withMessage("El nombre es obligatorio"),
	body("password")
		.isLength({ min: 8 })
		.withMessage("El password debe tener al menos 8 caracteres"),
	body("password_confirmation").custom((value, { req }) => {
		if (value != req.body.password) {
			throw new Error("Los passwords no coinciden");
		}

		return true;
	}),
	body("email").isEmail().withMessage("Email no valido"),
	handleInputErrors,
	AuthController.createAccount
);

router.post(
	"/confirm-account",
	body("token").notEmpty().withMessage("El token es obligatorio"),
	handleInputErrors,
	AuthController.confirmAccount
);

router.post(
	"/login",
	body("email").isEmail().withMessage("Email no valido"),
	body("password").notEmpty().withMessage("El password no puede ir vacio"),
	handleInputErrors,
	AuthController.login
);

router.post(
	"/request-code",
	body("email").isEmail().withMessage("Email no valido"),
	handleInputErrors,
	AuthController.requestConfirmationCode
);

router.post(
	"/reset-password",
	body("email").isEmail().withMessage("Email no valido"),
	handleInputErrors,
	AuthController.forgotPassword
);

export default router;
