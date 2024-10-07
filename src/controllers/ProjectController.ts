import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
	// metodo estatico para que no se pueda instanciar
	static createProject = async (req: Request, res: Response) => {
		const project = new Project(req.body);

		try {
			await project.save(); // Guardamos el proyecto en la base de datos
			res.send("Proyecto Creado Correctamente");
		} catch (error) {
			console.log(error);
		}
	};

	static getAllProjects = async (req: Request, res: Response) => {
		try {
			const projects = await Project.find(); // Buscamos todos los proyectos o registros
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
				res.status(404).json({ error: error.message });
			}

			res.json(project);
		} catch (error) {
			console.log(error);
		}
	};

	static updateProject = async (req: Request, res: Response) => {
		const { id } = req.params;
		const { projectName, clientName, projectDescription } = req.body;

		try {
			const project = await Project.findById(id);

			if (!project) {
				const error = new Error("Proyecto No Encontrado");
				res.status(404).json({ error: error.message });
			}

			project.projectName = projectName;
			project.clientName = clientName;
			project.projectDescription = projectDescription;

			await project.save();

			await project.save();

			res.send("Proyecto Actualizado Correctamente");
		} catch (error) {
			console.log(error);
		}
	};

	static deleteProject = async (req: Request, res: Response) => {
		const { id } = req.params;
		try {
			const project = await Project.findByIdAndDelete(id);

			if (!project) {
				const error = new Error("Proyecto No Encontrado");
				res.status(404).json({ error: error.message });
			}

			res.send(`Proyecto: ${id} ha sido eliminado`);
		} catch (error) {
			console.log(error);
		}
	};
}
