let knex = require('knex');

module.exports = knex({
    client: 'pg', // pg, mssql, etc

    connection: {
        database:    'monkeiam',
        host:        '34.214.159.87',
        password:    'example',
        user:        'postgres',
        dateStrings: true
    }
});