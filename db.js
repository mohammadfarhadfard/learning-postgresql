const Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.pg_User,
    host: process.env.pg_Host,
    database: process.env.pg_Database,
    password: process.env.pg_Password,
    port: process.env.pg_Port
});

module.exports = pool;