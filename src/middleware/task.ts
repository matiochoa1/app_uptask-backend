import type { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/Task";

declare global {
	namespace Express {
		interface Request {
			task: ITask;
		}
	}
}

export async function validateTaskExistsAndBelongsToProject(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const taskId = req.params.taskId;

		const task = await Task.findById(taskId);

		if (!task) {
			const error = new Error("Accion no valida");
			res.status(404).json({ message: error.message });
		}

		if (task.project.toString() !== req.project.id) {
			const error = new Error("La tarea no pertenece al proyecto");
			res.status(400).json({ message: error.message });
		}

		req.task = task;

		next();
	} catch (error) {
		res
			.status(500)
			.json({ error: "Hubo un error en la validación de la tarea" });
	}
}
