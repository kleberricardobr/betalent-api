import VendaDto from "App/Dto/VendaDto";
import VendaException from "App/Exceptions/VendaException";
import Cliente from "App/Models/Cliente";
import Produto from "App/Models/Produto";
import Venda from "App/Models/Venda";

export class VendasService {
  private vendaDto: VendaDto;

  constructor(dto) {
    this.vendaDto = dto;
  }

  public async create(): Promise<Venda> {
    const cliente = await Cliente.find(this.vendaDto.clienteId);
    if (cliente === null) {
      throw new VendaException(
        `Cliente (id: ${this.vendaDto.clienteId}) não encontrado.`,
        404
      );
    }

    const produto = await Produto.findBy(
      "codigo_barras",
      this.vendaDto.codigoBarras
    );
    if (produto === null) {
      throw new VendaException(
        `Produto (codigoBarras: ${this.vendaDto.codigoBarras}) não encontrado.`,
        404
      );
    }

    return Venda.create({
      quantidade: this.vendaDto.quantidade,
      produtoId: produto.id,
      clienteId: cliente.id,
      total: this.vendaDto.quantidade * produto.preco,
    });
  }
}
