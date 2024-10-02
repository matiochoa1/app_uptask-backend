import { Router } from "express";
import { body } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.post(
	"/",
	body("projectName")
		.notEmpty()
		.withMessage("El nombre del proyecto es obligatorio"),
	body("clientName")
		.notEmpty()
		.withMessage("El nombre del cliente es obligatorio"),
	body("projectDescription")
		.notEmpty()
		.withMessage("La descripcion del proyecto es obligatoria"),
	handleInputErrors, // si pasa la validacion del middleware, entonces llama a la funcion del controlador
	ProjectController.createProject
);

router.get("/", ProjectController.getAllProjects);

export default router;
