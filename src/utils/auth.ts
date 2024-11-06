import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
	// Hash Password
	const salt = await bcrypt.genSalt(10); // Funcion para generar un hash unico por cada contraseña, mientras mayor el numero mas random pero mas lento
	return await bcrypt.hash(password, salt); // Cifrar la contraseña
};
