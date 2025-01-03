import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
	// metodo estatico para que no se pueda instanciar
	static createProject = async (req: Request, res: Response) => {
		const project = new Project(req.body);

		// asigna un manager
		project.manager = req.user.id;

		try {
			await project.save(); // Guardamos el proyecto en la base de datos
			res.send("Proyecto Creado Correctamente");
		} catch (error) {
			console.log(error);
		}
	};

	static getAllProjects = async (req: Request, res: Response) => {
		try {
			const projects = await Project.find({
				$or: [
					{ manager: { $in: req.user.id } },
					{ team: { $in: req.user.id } },
				], // esto permite que solo se muestren los proyectos del usuario que esta logueado
			}); // Buscamos todos los proyectos o registros

			res.json(projects);
		} catch (error) {
			console.log(error);
		}
	};

	static getProjectById = async (req: Request, res: Response) => {
		const { id } = req.params;
		try {
			const project = await Project.findById(id)
				.populate("tasks")
				.select("-__v");

			if (!project) {
				const error = new Error("Proyecto No Encontrado");
				return res.status(404).json({ error: error.message });
			}

			if (
				project.manager.toString() !== req.user.id.toString() &&
				!project.team.includes(req.user.id)
			) {
				const error = new Error("Acceso Denegado");
				return res.status(401).json({ error: error.message });
			} // esto es para que solo el manager del proyecto pueda verlo

			res.json(project);
		} catch (error) {
			console.log(error);
		}
	};

	static updateProject = async (req: Request, res: Response) => {
		const { projectName, clientName, projectDescription } = req.body;

		try {
			req.project.projectName = projectName;
			req.project.clientName = clientName;
			req.project.projectDescription = projectDescription;

			await req.project.save();

			res.send("Proyecto Actualizado Correctamente");
		} catch (error) {
			console.log(error);
		}
	};

	static deleteProject = async (req: Request, res: Response) => {
		try {
			await req.project.deleteOne();

			res.send(`El proyecto ha sido eliminado`);
		} catch (error) {
			console.log(error);
		}
	};
}
