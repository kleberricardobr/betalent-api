import { BaseModel, belongsTo, BelongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import Cliente from "./Cliente";

export default class Endereco extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public logradouro: string;

  @column()
  public numero: string;

  @column()
  public cep: string;

  @column()
  public cidade: string;

  @column()
  public estado: string;

  @belongsTo(() => Cliente)
  public cliente: BelongsTo<typeof Cliente>;

  @column({ serializeAs: null })
  public clienteId: number;
}
