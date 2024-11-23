import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Produto extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true, serializeAs: 'criado_em' })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'ultima_atualizacao'})
  public updatedAt: DateTime

  @column()
  public descricao: string

  @column()
  public preco: number

  @column({serializeAs: 'codigo_barras'})
  public codigoBarras: string
}
