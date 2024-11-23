import { validator, schema, rules } from "@ioc:Adonis/Core/Validator";

interface UsuarioDtoProps {
  email: string;
  password: string;
}

export default class UsuarioDto {
  readonly email: string;
  readonly password: string;

  private constructor(dto: UsuarioDtoProps) {
    this.email = dto.email;
    this.password = dto.password;
  }

  public static async create(data: object) {
    const payload = await validator.validate({
      schema: this.rules(),
      data: data,
    });

    return new UsuarioDto(payload);
  }

  public static rules() {
    const obj = {
      email: schema.string([
        rules.maxLength(255),
        rules.unique({
          table: "usuarios",
          column: "email",
          caseInsensitive: true,
        }),
      ]),
      password: schema.string([rules.maxLength(180)]),
    };

    return schema.create(obj);
  }
}
