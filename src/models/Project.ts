import mongoose from "mongoose";
import { Schema, Document } from "mongoose"; // Definimos el tipo de datos de la colección y el tipo de datos de los campos

export type ProjectType = Document & {
	// hereda todo el tipado de Document y ademas pertenece al tipado de typescript
	projectName: string;
	clientName: string;
	projectDescription: string;
};

// Definimos el esquema de la colección - Esto es de mongoose
const ProjectSchema: Schema = new Schema({
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
});

const Project = mongoose.model<ProjectType>("Project", ProjectSchema); // Creamos el modelo de la colección y le pasamos el esquema
export default Project;
