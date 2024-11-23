import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Produtos extends BaseSchema {
  protected tableName = 'produtos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true)
      table.string('descricao', 100).notNullable().unique()
      table.string('codigo_barras', 30).notNullable().unique()
      table.double('preco').unsigned().notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
