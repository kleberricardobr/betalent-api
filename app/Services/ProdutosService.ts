import ProdutoDto from "App/Dto/ProdutoDto";
import Produto from "App/Models/Produto";
import db from "@ioc:Adonis/Lucid/Database";
import ProdutoException from "App/Exceptions/ProdutoException";
import Venda from "App/Models/Venda";

export class ProdutosService {
  private produtoDto: ProdutoDto;

  constructor(dto: ProdutoDto) {
    this.produtoDto = dto;
  }

  public async create(): Promise<Produto> {
    return Produto.create(this.produtoDto);
  }

  public async update(produto: Produto) {
    await produto
      .fill({
        ...this.produtoDto,
        id: produto.id,
        createdAt: produto.createdAt,
      })
      .save();
    await produto.refresh();
  }

  public static async getAll() {
    return db
      .from("produtos")
      .select("id", "descricao", "codigo_barras", "preco")
      .orderBy("descricao");
  }

  public static async getById(id: number) {
    return Produto.find(id);
  }

  public static async delete(id: number) {
    const produto = await Produto.find(id);
    if (produto === null) {
      throw new ProdutoException("Produto não encontrado!", 404);
    }

    const vendas = await Venda.query().where("produto_id", produto.id);
    if (vendas.length > 0) {
      throw new ProdutoException("Existem vendas vinculadas ao produto!", 403);
    }

    await produto.delete();    
  }
}
