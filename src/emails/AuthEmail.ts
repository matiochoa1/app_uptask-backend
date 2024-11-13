import { transporter } from "../config/nodemailer";

interface IEmail {
	email: string;
	name: string;
	token: string;
}

export class AuthEmail {
	static sendConfirmationEmail = async (user: IEmail) => {
		// Enviar el correo
		const info = await transporter.sendMail({
			from: "UpTask admin@uptask.com",
			to: user.email,
			subject: "UpTask - Confirma tu cuenta",
			text: "UpTask - Confirma tu cuenta",
			html: `<p>Hola ${user.name}, has creado tu cuenta en UpTask, ya casi esta todo listo. Solo falta confirmar tu cuenta</p>
                <pVisita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
                <p>E ingresa el codigo: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos.</p>
            `,
		});

		console.log("Mensaje enviado", info.messageId);
	};

	static sendPasswordResetToken = async (user: IEmail) => {
		const info = await transporter.sendMail({
			from: "UpTask admin@uptask.com",
			to: user.email,
			subject: "UpTask - Reestablece tu contraseña",
			text: "UpTask - Reestablece tu contraseña",
			html: `<p>Hola ${user.name}, has solicitado reestablecer tu contraseña</p>
				<p>Visita el siguiente enlace:</p>
				<a href="${process.env.FRONTEND_URL}/auth/reset-password">Reestablecer contraseña</a>
				<p>E ingresa el siguiente token: <b>${user.token}</b></p>
				<p>Este token expira en 10 minutos</p>
				`,
		});
	};
}
