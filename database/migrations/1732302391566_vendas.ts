import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Vendas extends BaseSchema {
  protected tableName = 'vendas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.dateTime('data_venda').notNullable()
      table.double('quantidade').notNullable().unsigned()
      table.double('total').notNullable().unsigned()
      table
      .integer("cliente_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("clientes")
      .onDelete("CASCADE");      
      table
      .integer("produto_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("produtos");      
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
