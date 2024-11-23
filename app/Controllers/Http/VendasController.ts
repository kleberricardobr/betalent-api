import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import VendaDto from "App/Dto/VendaDto";
import {  VendasService } from "App/Services/VendasService";

export default class VendasController {
  public async store({ request, response }: HttpContextContract) {
    const dto = await VendaDto.create(request.body());
    const svc = new VendasService(dto);

    const venda = await svc.create();

    response.status(201);
    return {
      message: "Venda registrada com sucesso!",
      data: venda,
    };
  }
}
