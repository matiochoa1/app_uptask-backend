import mongoose, { Schema, Document, Types } from "mongoose";

export interface IToken extends Document {
	token: string;
	user: Types.ObjectId;
	createdAt: Date;
}

export const tokenSchema: Schema = new Schema({
	token: {
		type: String,
		required: true,
	},
	user: {
		type: Types.ObjectId,
		ref: "User",
	},
	createdAt: {
		type: Date,
		default: Date.now, // Establece la fecha actual por defecto
		expires: "10m", // El token expirará después de 1 hora (3600 segundos)
	},
});

const Token = mongoose.model<IToken>("Token", tokenSchema);
export default Token;
