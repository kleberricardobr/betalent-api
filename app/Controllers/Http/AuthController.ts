import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class AuthController {
 //Dado um email e senha, realiza o login retornando um token
  public async login({ request, auth }: HttpContextContract) {
    const { email, password } = request.all();

    const token = await auth.attempt(email, password, {
        expiresIn: '60m'
    });

    return token;
  }
}
