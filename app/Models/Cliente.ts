import { BaseModel, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Telefone from './Telefone'
import Endereco from './Endereco'
import Venda from './Venda'

export default class Cliente extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nome: string

  @column()
  public cpf: string  

  @hasMany(() => Telefone, {
    foreignKey: 'clienteId',
  })
  public telefones: HasMany<typeof Telefone>  

  @hasOne(() => Endereco, {
    foreignKey: 'clienteId',
  })
  public endereco: HasOne<typeof Endereco>

  @hasMany(() => Venda, {
    foreignKey: 'clienteId',
  })
  public vendas: HasMany<typeof Venda>  
}
