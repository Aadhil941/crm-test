import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('customers', (table) => {
    // Primary key - UUID
    table.uuid('account_id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    
    // Required fields
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).notNullable();
    table.string('email', 255).notNullable().unique();
    
    // Optional fields
    table.string('phone_number', 20).nullable();
    table.string('address', 255).nullable();
    table.string('city', 100).nullable();
    table.string('state', 100).nullable();
    table.string('country', 100).nullable();
    
    // Auto-generated timestamp
    table.timestamp('date_created').defaultTo(knex.fn.now()).notNullable();
    
    // Indexes
    table.index('email', 'idx_customers_email');
    table.index('date_created', 'idx_customers_date_created');
    table.index(['first_name', 'last_name'], 'idx_customers_name');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('customers');
}



