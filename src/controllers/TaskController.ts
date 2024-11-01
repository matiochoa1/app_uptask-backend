import type { Request, Response } from "express";
import Task from "../models/Task";

export class TaskController {
	static createTask = async (req: Request, res: Response) => {
		try {
			const task = new Task(req.body);
			task.project = req.project.id;
			req.project.tasks.push(task.id); //  Agregamos la tarea al proyecto - relacion a la colección de tareas en MongoDB

			await Promise.allSettled([task.save(), req.project.save()]); // Guardamos la tarea y el proyecto, es un arreglo de promesas

			res.send("Tarea creada correctamente");
		} catch (error) {
			res.status(500).json({ message: "Hubo un error al crear la tarea" });
		}
	};

	static getProjectTasks = async (req: Request, res: Response) => {
		try {
			const tasks = await Task.find({ project: req.project.id }).populate(
				"project"
			);
			res.send(tasks);
		} catch (error) {
			res.status(500).json({ message: "Hubo un error al obtener las tareas" });
		}
	};

	static getTaskById = async (req: Request, res: Response) => {
		try {
			const task = await Task.findById(req.params.taskId)
				.populate("project")
				.select("-__v");

			res.json(task);
		} catch (error) {
			res.status(500).json({ message: "Hubo un error al obtener la tarea" });
		}
	};

	static updateTask = async (req: Request, res: Response) => {
		try {
			const { taskId } = req.params;

			const task = await Task.findById(taskId);

			// Actualizamos la tarea
			task.taskName = req.body.taskName;
			task.description = req.body.description;

			await task.save();

			res.send("Tarea actualizada correctamente");
		} catch (error) {
			res.status(500).json({ message: "Hubo un error al actualizar la tarea" });
		}
	};

	static deleteTask = async (req: Request, res: Response) => {
		try {
			const { taskId } = req.params;

			const task = await Task.findById(taskId);

			req.project.tasks = req.project.tasks.filter(
				(task) => task.toString() !== taskId
			);

			Promise.allSettled([task.deleteOne(), req.project.save()]);

			res.send(`Tarea eliminada correctamente: ${task.taskName}`);
		} catch (error) {
			res.send(500).json({ message: "Hubo un error al eliminar la tarea" });
		}
	};

	static updateTaskStatus = async (req: Request, res: Response) => {
		try {
			const { taskId } = req.params;

			const task = await Task.findById(taskId);

			// Actualizamos el estado de la tarea
			task.status = req.body.status;

			await task.save();
			res.send(`El nuevo estado es: ${task.status}`);
		} catch (error) {
			res
				.status(500)
				.json({ message: "Hubo un error al actualizar el estado de la tarea" });
		}
	};
}
