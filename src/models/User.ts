import mongoose, { Schema, Document } from "mongoose";

// Definimos el modelo de usuario que se va a guardar en la base de datos
export interface IUser extends Document {
	email: string;
	password: string;
	name: string;
	confirmed: boolean;
}

// definimos el esquema
export const UserSchema: Schema = new Schema({
	email: {
		type: String,
		required: true,
		lowercase: true, // para evitar que se repita el email
		unique: true, // verificamos que  el email sea unico
	},
	password: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	confirmed: {
		type: Boolean,
		default: false, // por defecto el usuario no esta confirmado, debe confirmar su correo
	},
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
