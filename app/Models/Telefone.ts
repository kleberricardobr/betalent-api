import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import Cliente from "./Cliente";

export default class Telefone extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @belongsTo(() => Cliente)
  public cliente: BelongsTo<typeof Cliente>;

  @column()
  public numero: string;

  @column({ serializeAs: null })
  public clienteId: number;
}
