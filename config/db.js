const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    // DİKKAT: Burası 'u976935047_otel' olmalı (Hata mesajında 'otelsitesi' yazmışsın)
    user: 'u976935047_otel',         
    password: '1kpm@+g:H',           
    database: 'u976935047_otelsitesi', 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();