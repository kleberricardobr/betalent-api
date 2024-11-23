import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ProdutoDto from "App/Dto/ProdutoDto";
import ProdutoException from "App/Exceptions/ProdutoException";
import Produto from "App/Models/Produto";
import { ProdutosService } from "App/Services/ProdutosService";

export default class ProdutosController {
  public async store({ request, response }: HttpContextContract) {
    const dto = await ProdutoDto.create(request.body());
    const svc = new ProdutosService(dto);

    const produto = await svc.create();
    response.status(201);
    return {
      message: "Produto cadastrado com sucesso!",
      data: produto,
    };
  }

  public async update({ request, response }: HttpContextContract) {
    const produtoId = request.param("id");
    const produto = await Produto.find(produtoId);
    if (produto === null) {      
      throw new ProdutoException('Produto não encontrado!', 404);      
    }

    const dto = await ProdutoDto.update({ ...request.body(), id: produtoId });
    const svc = new ProdutosService(dto);

    await svc.update(produto);
    response.status(201);
    return {
      message: "Produto atualizado com sucesso!",
      data: produto,
    };
  }

  public async destroy({ request, response }: HttpContextContract) {    
    await ProdutosService.delete(request.param("id"));
    response.status(204);
  }

  public async index({ response }: HttpContextContract) {
    response.status(200);
    return {
      produtos: await ProdutosService.getAll(),
    };
  }

  public async show({ request, response }: HttpContextContract) {
    const produto = await ProdutosService.getById(request.param("id"));
    if (produto === null) {
      throw new ProdutoException('Produto não encontrado!', 404);
    }

    response.status(200);
    return {
      produto,
    };
  }
}
