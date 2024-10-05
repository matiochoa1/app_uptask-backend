import mongoose, { Schema, Document, Types } from "mongoose";

const TaskStatus = {
	PENDING: "PENDING",
	ON_HOLD: "ON_HOLD",
	IN_PROGRESS: "IN_PROGRESS",
	UNDER_REVIEW: "UNDER_REVIEW",
	COMPLETED: "COMPLETED",
} as const; // Tipado de typescript que solo acepta los valores de la constante y no permite agregar mas valores - read only

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]; // luego de crear la constante de los estados, creamos un tipo de dato que solo acepta los valores de la constante y no permite agregar mas valores

export interface ITask extends Document {
	taskName: string;
	description: string;
	project: Types.ObjectId; // Tipado de mongoose
	status: TaskStatus;
}

export const TaskSchema: Schema = new Schema(
	{
		taskName: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		project: {
			type: Types.ObjectId,
			ref: "Project", // Referencia a la colección de proyectos en MongoDB - relacion al modelo
		},
		status: {
			type: String,
			enum: Object.values(TaskStatus),
			default: TaskStatus.PENDING,
		},
	},
	{ timestamps: true }
); // registra el tiempo de creacion y actualizacion

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
