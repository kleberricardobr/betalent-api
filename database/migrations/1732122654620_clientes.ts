import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Clientes extends BaseSchema {
  protected tableName = 'clientes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nome', 200).notNullable()
      table.string('cpf', 11).notNullable().unique()      
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
