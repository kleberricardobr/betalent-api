import { validator, schema, rules } from "@ioc:Adonis/Core/Validator";

interface ProdutoDtoProps {
  descricao: string;
  preco: number;
  codigoBarras: string;
}

export default class ProdutoDto {
  readonly descricao: string;
  readonly codigoBarras: string;
  readonly preco: number;

  private constructor(dto: ProdutoDtoProps) {
    this.codigoBarras = dto.codigoBarras;
    this.descricao = dto.descricao;
    this.preco = dto.preco;
  }

  private static async createOrUpdate(data: object, update: boolean = false) {
    const id = update ? data["id"] : undefined;

    const payload = await validator.validate({
      schema: this.rules(id),
      data: data,
    });

    return new ProdutoDto(payload);
  }

  public static async create(data: object) {
    return this.createOrUpdate(data);
  }

  public static async update(data: object) {
    return this.createOrUpdate(data, true);
  }

  public static rules(id?: number) {
    const rulesCodBaras = [
      rules.maxLength(30),
      rules.unique({
        column: "codigo_barras",
        table: "produtos",
        caseInsensitive: true,
        whereNot: {
          id: id || -1,
        },
      }),
    ];

    const rulesDescricao = [
      rules.maxLength(100),
      rules.unique({
        column: "descricao",
        table: "produtos",
        caseInsensitive: true,
        whereNot: {
          id: id || -1,
        },
      }),
    ];

    const obj = {
      codigoBarras: schema.string(rulesCodBaras),
      descricao: schema.string(rulesDescricao),
      preco: schema.number([rules.unsigned()]),
    };

    return schema.create(obj);
  }
}
