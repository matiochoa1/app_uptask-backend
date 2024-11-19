import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExists } from "../middleware/project";
import { validateTaskExistsAndBelongsToProject } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";

const router = Router();

router.use(authenticate); // agrega el middleware de autenticacion a todas las rutas

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

/* Routes para las tareas */
router.param("projectId", validateProjectExists); // Middleware que valida si el proyecto existe y se asegura que exista antes de continuar
router.param("taskId", validateTaskExistsAndBelongsToProject); // Middleware que valida si la tarea existe y se asegura que exista antes de continuar
// Crear una tarea
router.post(
	"/:projectId/tasks",
	body("taskName")
		.notEmpty()
		.withMessage("El nombre de la tarea es obligatorio"),
	body("description")
		.notEmpty()
		.withMessage("La descripcion de la tarea es obligatoria"),
	handleInputErrors,
	TaskController.createTask
);

// Obtener todas las tareas de un proyecto
router.get("/:projectId/tasks", TaskController.getProjectTasks);

// Obtener una tarea por id
router.get(
	"/:projectId/tasks/:taskId",
	param("taskId").isMongoId().withMessage("El id no es valido"),
	handleInputErrors,
	TaskController.getTaskById
);

//  Actualizar una tarea

router.put(
	"/:projectId/tasks/:taskId",
	param("taskId").isMongoId().withMessage("El id no es valido"),
	body("taskName")
		.notEmpty()
		.withMessage("El nombre de la tarea es obligatorio"),
	body("description")
		.notEmpty()
		.withMessage("La descripcion de la tarea es obligatoria"),
	handleInputErrors,
	TaskController.updateTask
);

// Eliminar una tarea

router.delete(
	"/:projectId/tasks/:taskId",
	param("taskId").isMongoId().withMessage("El id no es valido"),
	handleInputErrors,
	TaskController.deleteTask
);

// Actualizar el estado de una tarea

router.post(
	"/:projectId/tasks/:taskId/status",
	param("taskId").isMongoId().withMessage("El id no es valido"),
	body("status")
		.notEmpty()
		.isIn(["PENDING", "ON_HOLD", "IN_PROGRESS", "UNDER_REVIEW", "COMPLETED"])
		.withMessage("El estado no es valido"),
	handleInputErrors,
	TaskController.updateTaskStatus
);

// Routes para el equipo del proyecto

router.post(
	"/:projectId/team/find",
	body("email")
		.isEmail()
		.toLowerCase()
		.trim()
		.withMessage("El email no es valido"),
	handleInputErrors,
	TeamMemberController.findMemberByEmail
);

router.get("/:projectId/team", TeamMemberController.getProjectTeam);

router.post(
	"/:projectId/team",
	body("id").isMongoId().withMessage("El id no es valido"),
	handleInputErrors,
	TeamMemberController.addMemberById
);

router.delete(
	"/:projectId/team/:userId",
	param("userId").isMongoId().withMessage("El id no es valido"),
	handleInputErrors,
	TeamMemberController.removeMemberById
);

export default router;
