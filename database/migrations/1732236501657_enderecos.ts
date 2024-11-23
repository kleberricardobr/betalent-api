import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Enderecos extends BaseSchema {
  protected tableName = "enderecos";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("logradouro", 80).notNullable();
      table.string("numero", 10).notNullable();
      table.string("cep", 15).notNullable();
      table.string("cidade", 35).notNullable();
      table.string("estado", 2).notNullable();
      table
        .integer("cliente_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("clientes")
        .onDelete("CASCADE");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
