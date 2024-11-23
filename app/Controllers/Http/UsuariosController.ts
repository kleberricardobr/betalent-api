import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UsuarioDto from "App/Dto/UsuarioDto";
import { UsuariosService } from "App/Services/UsuariosService";

export default class UsuariosController {
  public async store({ request, response }: HttpContextContract) {
    const usuarioDto = await UsuarioDto.create(request.body());
    const svc = new UsuariosService(usuarioDto);

    const usuario = await svc.create();
    response.status(201);
    return {
      message: "Usuario cadastrado com sucesso!",
      data: usuario,
    };
  }
}
