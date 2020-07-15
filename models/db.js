let knex = require('knex');

module.exports = knex({
    client: 'pg', // pg, mssql, etc

    connection: {
        database:    'monkeiam',
        host:        'XXX.XXX.XXX.XXX',
        password:    'password',
        user:        'postgres',
        dateStrings: true
    }
});