import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateSixDigitToken } from "../utils/token";
import Token from "../models/Token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;
      // Prevenir duplicados
      const userExists = await User.findOne({ email }); // buscara un usuario con el email que se envio en el body
      if (userExists) {
        const error = new Error("El usuario ya existe");
        res.status(409).send({ error: error.message }); // 409 es un error de conflicto
        return;
      }

      // Crear el usuario
      const user = new User(req.body);

      // Encriptar la contraseña
      user.password = await hashPassword(password);

      // Generar un token de confirmacion
      const token = new Token();
      token.token = generateSixDigitToken();
      token.user = user.id;

      // enviar el correo
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.send("Cuenta creada, revisa tu correo para confirmarla");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExists = await Token.findOne({ token });

      if (!tokenExists) {
        const error = new Error("El token no es valido");
        res.status(403).json({ error: error.message }); // 403 es un error de acceso denegado
      }

      const user = await User.findById(tokenExists.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
      res.send("Cuenta confirmada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error("El usuario no existe");
        return res.status(404).json({ error: error.message }); // 404 es un error de no encontrado
      }

      if (!user.confirmed) {
        const token = new Token();
        token.user = user.id;
        token.token = generateSixDigitToken();

        await token.save();

        // enviar el correo
        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        const error = new Error(
          "La cuenta no ha sido confirmada, hemos enviado un nuevo correo de confirmacion"
        );
        return res.status(401).json({ error: error.message }); // 401 es un error de no autorizado
      }

      // Revisar password
      const passwordMatch = await checkPassword(password, user.password);

      if (!passwordMatch) {
        const error = new Error("El password es incorrecto");
        return res.status(401).json({ error: error.message }); // 401 es un error de no autorizado
      }

      // Generar el JWT
      const token = generateJWT({ id: user.id });

      res.send(token);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      // Usuario existe
      const user = await User.findOne({ email }); // buscara un usuario con el email que se envio en el body
      if (!user) {
        const error = new Error("El usuario no esta registrado");
        res.status(404).send({ error: error.message }); // 404 es un error de no encontrado
        return;
      }

      if (user.confirmed) {
        const error = new Error("El usuario ya esta confirmado");
        res.status(409).send({ error: error.message }); // 409 es un error de conflicto
        return;
      }

      // Generar un token de confirmacion
      const token = new Token();
      token.token = generateSixDigitToken();
      token.user = user.id;

      // enviar el correo
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.send("Se envio un nuevo token de confirmacion a tu correo");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      // Usuario existe
      const user = await User.findOne({ email }); // buscara un usuario con el email que se envio en el body
      if (!user) {
        const error = new Error("El usuario no esta registrado");
        res.status(404).send({ error: error.message }); // 404 es un error de no encontrado
        return;
      }

      // Generar un token de confirmacion
      const token = new Token();
      token.token = generateSixDigitToken();
      token.user = user.id;
      await token.save();

      // enviar el correo
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      res.send("Revisa tu correo para reestablecer tu contraseña");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExists = await Token.findOne({ token });

      if (!tokenExists) {
        const error = new Error("El token no es valido");
        res.status(403).json({ error: error.message }); // 403 es un error de acceso denegado
      }

      res.send("Token valido, define tu nueva contraseña");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      const tokenExists = await Token.findOne({ token });

      if (!tokenExists) {
        const error = new Error("El token no es valido");
        res.status(403).json({ error: error.message }); // 403 es un error de acceso denegado
      }

      const user = await User.findById(tokenExists.user);
      user.password = await hashPassword(password);

      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

      res.send("La contraseña se actualizo correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static getUser = async (req: Request, res: Response) => {
    res.json(req.user);
  };

  static updateProfile = async (req: Request, res: Response) => {
    const { name, email } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists && userExists.id.toString() !== req.user.id.toString()) {
      const error = new Error("Ese email ya esta registrado");
      return res.status(409).json({ error: error.message });
    }

    req.user.name = name;
    req.user.email = email;

    try {
      await req.user.save();
      res.send("Perfil Actualizado Correctamente!");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static updateCurrentUserPassword = async (req: Request, res: Response) => {
    const { current_password, password } = req.body;

    const user = await User.findById(req.user.id);

    const isPasswordValid = await checkPassword(
      current_password,
      user.password
    );

    if (!isPasswordValid) {
      const error = new Error("La contraseña actual no es correcta");
      return res.status(403).json({ error: error.message }); // 403 es un error de acceso denegado
    }

    try {
      user.password = await hashPassword(password);

      await user.save();

      res.send("La contraseña se actualizo correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static checkPassword = async (req: Request, res: Response) => {
    const { password } = req.body;

    const user = await User.findById(req.user.id);

    const isPasswordValid = await checkPassword(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("La contraseña no es correcta");
      return res.status(401).json({ error: error.message }); // 401 es un error de no autorizado
    }

    res.send("La contraseña es correcta");
  };
}
