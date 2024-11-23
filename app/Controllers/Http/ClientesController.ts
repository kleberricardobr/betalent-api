import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ClienteDto from "App/Dto/ClienteDto";
import Cliente from "App/Models/Cliente";
import { ClientesService } from "App/Services/ClientesService";

export default class ClientesController {

  public async store({ request, response }: HttpContextContract) {
    const body = request.body();    
    const clienteDto = await ClienteDto.create(body);    
    
    const svc = new ClientesService(clienteDto);
    const cliente = await svc.create();

    response.status(201);
    return {
      message: "Cliente cadastrado com sucesso!",
      data: cliente,
    };
  }

  public async destroy({ request, response }: HttpContextContract) {
    const id: number = request.param("id");
    const cliente = await Cliente.find(id);
    if (cliente === null) {
      response.status(404);
      return {
        message: "Cliente não encontrado!",
      };
    }

    await cliente.delete();
    response.status(204);
  }

  public async index({ response }: HttpContextContract) {
    response.status(200);
    return {
      clientes: await ClientesService.getAll(),
    };
  }

  public async update({ request, response }: HttpContextContract) {
    const clienteId = request.param("id");
    const body = request.body();

    const cliente = await Cliente.find(clienteId);
    if (cliente === null) {
      response.status(404);
      return {
        message: "Cliente não encontrado!",
      };
    }

    const clienteDto = await ClienteDto.update({ ...body, id: clienteId });
    const svc = new ClientesService(clienteDto);
    await svc.update(cliente);

    response.status(201);
    return {
      message: "Cliente atualizado com sucesso!",
      data: cliente,
    };
  }

  public async show({ request, response }: HttpContextContract) {
    const cliente = await ClientesService.getById(
      request.param("id"),
      request.qs()
    );

    if (cliente === null) {
      response.status(404);
      return {
        message: "Cliente não encontrado",
      };
    }

    response.status(200);
    return cliente;
  }
}
