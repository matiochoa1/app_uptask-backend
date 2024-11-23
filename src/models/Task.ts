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
	completedBy: {
		user: Types.ObjectId;
		status: TaskStatus;
	}[];
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
		completedBy: [
			{
				user: {
					type: Types.ObjectId,
					ref: "User",
					default: null, // Por defecto no hay usuario que complete la tarea, se puede cambiar a null para indicar que la tarea no ha sido completada aún. Aquí se podría agregar un modelo de usuario en lugar de un ObjectId para una relación más profunda.  // Tipado de mongoose con referencia a un usuario en MongoDB - relacion al modelo de usuario.
				},
				status: {
					type: String,
					enum: Object.values(TaskStatus),
					default: TaskStatus.PENDING,
				},
			},
		],
	},
	{ timestamps: true }
); // registra el tiempo de creacion y actualizacion

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
