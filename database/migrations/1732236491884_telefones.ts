import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Telefones extends BaseSchema {
  protected tableName = "telefones";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("numero", 15).notNullable();
      table
        .integer("cliente_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("clientes")
        .onDelete("CASCADE");
      table.unique(["cliente_id", "numero"]);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
