import mongoose from "mongoose";
import { Schema, Document, PopulatedDoc, Types } from "mongoose"; // Definimos el tipo de datos de la colección y el tipo de datos de los campos
import { ITask } from "./Task";
import { IUser } from "./User";

export interface IProject extends Document {
	// hereda todo el tipado de Document y ademas pertenece al tipado de typescript
	projectName: string;
	clientName: string;
	projectDescription: string;
	tasks: PopulatedDoc<ITask & Document>[]; // Array de tareas - Tipado de mongoose - relacion a la colección de tareas
	manager: PopulatedDoc<IUser & Document>;
	team: PopulatedDoc<IUser & Document>[];
}

// Definimos el esquema de la colección - Esto es de mongoose
const ProjectSchema: Schema = new Schema(
	{
		projectName: {
			type: String,
			required: true,
			trim: true, // quita los espacios al inicio y al final - ejemplo: "  hola  " -> "hola"
		},
		clientName: {
			type: String,
			required: true,
			trim: true,
		},
		projectDescription: {
			type: String,
			required: true,
			trim: true,
		},
		tasks: [
			{
				type: Types.ObjectId,
				ref: "Task", // Referencia a la colección de tareas en MongoDB - relacion al modelo
			},
		],
		manager: {
			type: Types.ObjectId,
			ref: "User",
		},
		team: [
			{
				type: Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true }
); // registra el tiempo de creacion y actualizacion

const Project = mongoose.model<IProject>("Project", ProjectSchema); // Creamos el modelo de la colección y le pasamos el esquema
export default Project;
