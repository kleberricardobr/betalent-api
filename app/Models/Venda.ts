import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Produto from './Produto'
import Cliente from './Cliente'

export default class Venda extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column.dateTime({ autoCreate: true })
  public dataVenda: DateTime  

  @column()
  public quantidade: number

  @column()
  public total: number

  @column({columnName: "descricao"})
  public produtoDescricao: string

  @column({columnName: "codigo_barras"})
  public produtoCodigo: string

  @column({serializeAs: null})
  public clienteId: number

  @column({serializeAs: null})
  public produtoId: number

  @belongsTo(() => Produto)
  public produto: BelongsTo<typeof Produto>

  @belongsTo(() => Cliente)
  public cliente: BelongsTo<typeof Cliente>;  
}
