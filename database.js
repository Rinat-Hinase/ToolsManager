const sqlite3 = require('sqlite3').verbose();

// Ruta de la base de datos
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conexión exitosa con la base de datos.');
    }
});

module.exports = db;
