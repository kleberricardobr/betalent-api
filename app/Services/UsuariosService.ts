import UsuarioDto from "App/Dto/UsuarioDto";
import Usuario from "App/Models/Usuario";

export class UsuariosService {
  private usuarioDto: UsuarioDto;

  constructor(dto: UsuarioDto) {
    this.usuarioDto = dto;
  }

  public async create(): Promise<Usuario> {
    return Usuario.create(this.usuarioDto);
  }
}
