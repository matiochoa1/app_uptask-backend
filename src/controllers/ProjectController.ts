import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
	// metodo estatico para que no se pueda instanciar
	static createProject = async (req: Request, res: Response) => {
		const project = new Project(req.body);

		try {
			await project.save(); // Guardamos el proyecto en la base de datos
			res.send("Proyecto creado");
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
}
