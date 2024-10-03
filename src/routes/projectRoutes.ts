import { Router } from "express";
import { body, param } from "express-validator";
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

router.get(
	"/:id",
	param("id").isMongoId().withMessage("El id no es valido"),
	handleInputErrors,
	ProjectController.getProjectById
);

router.put(
	"/:id",
	param("id").isMongoId().withMessage("El id no es valido"),
	body("projectName")
		.notEmpty()
		.withMessage("El nombre del proyecto es obligatorio"),
	body("clientName")
		.notEmpty()
		.withMessage("El nombre del cliente es obligatorio"),
	body("projectDescription")
		.notEmpty()
		.withMessage("La descripcion del proyecto es obligatoria"),
	handleInputErrors,
	ProjectController.updateProject
);

router.delete(
	"/:id",
	param("id").isMongoId().withMessage("ID no valido"),
	handleInputErrors,
	ProjectController.deleteProject
);

export default router;
