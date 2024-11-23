import { validator, schema, rules } from "@ioc:Adonis/Core/Validator";

interface VendaDtoProps {
  quantidade: number;
  clienteId: number;
  codigoBarras: string;
}

export default class VendaDto {
  readonly quantidade: number;
  readonly clienteId: number;
  readonly codigoBarras: string;

  private constructor(dto: VendaDtoProps) {
    this.quantidade = dto.quantidade;
    this.clienteId = dto.clienteId;
    this.codigoBarras = dto.codigoBarras;
  }

  public static async create(data: object) {
    const payload = await validator.validate({
      schema: this.rules(),
      data: data,
    });

    return new VendaDto(payload);
  }

  public static rules() {
    return schema.create({
      quantidade: schema.number([rules.unsigned(), rules.notIn([0])]),
      clienteId: schema.number([rules.unsigned()]),
      codigoBarras: schema.string(),
    });
  }
}
