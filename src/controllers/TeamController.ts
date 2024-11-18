import type { Request, Response } from "express";
import User from "../models/User";
import Project from "../models/Project";

export class TeamMemberController {
	static findMemberByEmail = async (req: Request, res: Response) => {
		const { email } = req.body;

		// Buscar el usuario
		const user = await User.findOne({ email }).select("id email name");

		if (!user) {
			const error = new Error("El usuario no existe");
			res.status(404).send({ error: error.message });
		}

		res.json({ user });
	};

	static getProjectTeam = async (req: Request, res: Response) => {
		const project = await Project.findById(req.project.id).populate({
			path: "team",
			select: "id email name",
		});

		res.json({ team: project.team });
	};

	static addMemberById = async (req: Request, res: Response) => {
		const { id } = req.body;

		// Buscar el usuario
		const user = await User.findById(id).select("id");

		if (!user) {
			const error = new Error("El usuario no existe");
			res.status(404).send({ error: error.message });
		}

		if (
			req.project.team.some((team) => team.toString() === user.id.toString())
		) {
			const error = new Error("El usuario ya esta en el equipo");
			return res.status(409).send({ error: error.message });
		}

		req.project.team.push(user.id);
		await req.project.save();

		res.send("Usuario agregado al equipo exitosamente");
	};

	static removeMemberById = async (req: Request, res: Response) => {
		const { id } = req.body;

		// Buscar el usuario en el proyecto
		if (!req.project.team.some((team) => team.toString() === id)) {
			const error = new Error("El usuario no existe en el proyecto");
			return res.status(409).send({ error: error.message });
		}
		// Utilizamos el metodo filter para extraer todos los elementos que no sean iguales al id que se quiere eliminar
		req.project.team = req.project.team.filter(
			(teamMember) => teamMember.toString() !== id
		);

		await req.project.save();

		res.send("Usuario eliminado exitosamente");
	};
}
