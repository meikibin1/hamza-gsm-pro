const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'u976935047_otelsitesi',         // Senin MySQL Kullanıcın
    password: '1kpm@+g:H',           // Şifren (Değişmediyse)
    database: 'u976935047_otel', // Senin Veritabanı İsmin
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();    