import ClienteDto from "App/Dto/ClienteDto";
import db, { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import Logger from "@ioc:Adonis/Core/Logger";
import Cliente from "App/Models/Cliente";
import Telefone from "App/Models/Telefone";
import Endereco from "App/Models/Endereco";
import Venda from "App/Models/Venda";
import { Exception } from "@adonisjs/core/build/standalone";

export class ClientesService {
  private clienteDto: ClienteDto;

  constructor(clienteDto: ClienteDto) {
    this.clienteDto = clienteDto;
  }

  public async create(): Promise<Cliente> {
    const trx = await db.transaction();
    try {
      const cliente = await Cliente.create(this.clienteDto, { client: trx });

      await this.cadastrarTelefones(this.clienteDto, cliente.id, trx);

      if (this.clienteDto.endereco !== undefined) {
        await Endereco.create(
          { ...this.clienteDto.endereco, clienteId: cliente.id },
          { client: trx }
        );
      }

      await trx.commit();

      await cliente.preload("endereco");
      await cliente.preload("telefones");

      return cliente;
    } catch (error) {
      await trx.rollback();
      Logger.error(`Erro ao cadastrar cliente: ${error}`);
      throw new Error("Erro ao cadastrar cliente");
    }
  }

  public async update(cliente: Cliente) {
    const trx = await db.transaction();
    try {
      cliente.useTransaction(trx);
      await cliente.fill({ ...this.clienteDto, id: cliente.id }).save();

      const telefones = await Telefone.findBy("clienteId", cliente.id);
      telefones?.useTransaction(trx);
      await telefones?.delete();
      await this.cadastrarTelefones(this.clienteDto, cliente.id, trx);

      const endereco = await Endereco.findBy("clienteId", cliente.id);
      endereco?.useTransaction(trx);
      await endereco?.delete();
      await Endereco.create(
        { ...this.clienteDto.endereco, clienteId: cliente.id },
        { client: trx }
      );

      await trx.commit();

      await cliente.refresh();
      await cliente.preload("endereco");
      await cliente.preload("telefones");

      return cliente;
    } catch (error) {
      await trx.rollback();
      Logger.error(`Erro ao atualizar cliente: ${error}`);
      throw new Error("Erro ao atualizar cliente");
    }
  }

  public static async getById(
    id: number,
    filter: Record<string, any>
  ): Promise<Cliente | null> {
    const queryMes = filter["mes"] || 0;
    const queryAno = filter["ano"] || 0;

    if(isNaN(queryMes) || isNaN(queryAno))  {           
        throw new Exception("Utilizar números para filtrar mês e/ou ano de venda", 400);              
    }

    const cliente = await Cliente.query()
      .where("id", id)
      .preload("endereco")
      .preload("telefones")
      .first();

    if (cliente === null) {
      return null;
    }

    const vendas = await Venda.query()
      .select(
        "vendas.data_venda",
        "vendas.total",
        "vendas.quantidade",
        "produtos.descricao",
        "produtos.codigo_barras"
      )
      .innerJoin("produtos", "produtos.id", "vendas.produto_id")
      .whereRaw("(month(vendas.data_venda) = ? or ? = 0)", [queryMes, queryMes])
      .whereRaw("(year(vendas.data_venda) = ? or ? = 0)", [queryAno, queryAno])
      .where("clienteId", id);

    cliente.$pushRelated("vendas", vendas);
    return cliente;
  }

  public static async getAll() {
    return Cliente.query()
      .preload("endereco")
      .preload("telefones")
      .orderBy("id");
  }  

  private async cadastrarTelefones(
    dto: ClienteDto,
    clienteId: number,
    transaction?: TransactionClientContract
  ) {
    for (let i = 0; i < dto.telefones.length; i++) {
      await Telefone.create(
        {
          numero: dto.telefones[i].numero,
          clienteId: clienteId,
        },
        { client: transaction }
      );
    }
  }
}
