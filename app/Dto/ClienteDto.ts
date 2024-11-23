import { validator, schema, rules } from "@ioc:Adonis/Core/Validator";

interface TelefoneDtoProps {
  numero: string;
}

interface EnderecoDtoProps {
  logradouro: string;
  numero: string;
  cep: string;
  cidade: string;
  estado: string;
}

interface ClienteDtoProps {
  nome: string;
  cpf: string;
  telefones?: TelefoneDtoProps[];
  endereco?: EnderecoDtoProps;
}

export default class ClienteDto {
  readonly nome: string;
  readonly cpf: string;
  readonly telefones: TelefoneDtoProps[];
  readonly endereco?: EnderecoDtoProps;

  private constructor(clienteDtoProps: ClienteDtoProps) {
    this.nome = clienteDtoProps.nome;
    this.cpf = clienteDtoProps.cpf;
    this.endereco = clienteDtoProps.endereco;
    this.telefones = clienteDtoProps.telefones || [];
  }

  private static async updateOrCreate(data: object, update: boolean = false) {
    const id = update ? data["id"] : undefined;

    const payload = await validator.validate({
      schema: this.rules(id),
      data: {
        ...data,
        cpf: data["cpf"]?.replace(/[^\d]/g, ""),
      },
    });

    return new ClienteDto(payload);
  }

  public static async update(data: object) {
    return this.updateOrCreate(data, true);
  }

  public static async create(data: object) {
    return this.updateOrCreate(data);
  }

  public static rules(id?: number) {
    const obj = {
      nome: schema.string([rules.maxLength(200)]),
      cpf: schema.string([
        rules.maxLength(11),
        rules.unique({
          table: "clientes",
          column: "cpf",
          whereNot: {
            id: id || -1,
          },
        }),
      ]),
      telefones: schema
        .array()
        .members(
          schema
            .object()
            .members({ numero: schema.string([rules.maxLength(15)]) })
        ),
      endereco: schema.object().members({
        logradouro: schema.string([rules.maxLength(18)]),
        numero: schema.string([rules.maxLength(10)]),
        cep: schema.string([rules.maxLength(15)]),
        cidade: schema.string([rules.maxLength(35)]),
        estado: schema.string([rules.maxLength(2)]),
      }),
    };

    return schema.create(obj);
  }
}
