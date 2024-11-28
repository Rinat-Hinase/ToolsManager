const { app, BrowserWindow } = require('electron');
const sqlite3 = require('sqlite3').verbose();
const { ipcMain } = require('electron');
const path = require('path');

let mainWindow;

// Conexión a la base de datos
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conexión exitosa con la base de datos.');
    }
});

//Crear producto
const fs = require('fs'); // Para manejar el sistema de archivos
ipcMain.handle('crear-producto', async (event, formData) => {
  try {
    let imagePath = null;

    if (formData.imagen) {
      const base64Data = formData.imagen.replace(/^data:image\/\w+;base64,/, ''); // Remover el prefijo Base64
      const buffer = Buffer.from(base64Data, 'base64');
      const fileName = `${Date.now()}_${formData.nombre.replace(/\s+/g, '_')}.png`; // Nombre único para la imagen
      imagePath = path.join(__dirname, 'uploads', fileName);

      if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
        fs.mkdirSync(path.join(__dirname, 'uploads'));
      }

      fs.writeFileSync(imagePath, buffer);
    }

    const query = `INSERT INTO Productos (nombre, codigo_barras, precio_publico, unidad_venta, id_categoria, marca, descripcion, imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      formData.nombre,
      formData.codigoBarras || null,
      parseFloat(formData.precioVenta) || 0.0,
      formData.unidadVenta,
      formData.categoria || null,
      formData.marca || null,
      formData.descripcion || null,
      imagePath || null,
    ];

    await new Promise((resolve, reject) => {
      db.run(query, values, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    return { success: true };
  } catch (error) {
    console.error('Error al insertar el producto:', error);
    return { success: false, message: error.message };
  }
});

ipcMain.handle('get-producto-detalle', (event, id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT p.id_producto, p.nombre, p.codigo_barras, p.existencias, 
                   p.precio_publico, p.iva, c.nombre AS categoria, 
                   p.descripcion, 
                   REPLACE(p.imagen, '${path.join(__dirname, 'uploads')}${path.sep}', '') AS imagen_url
            FROM Productos p
            LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
            WHERE p.id_producto = ?
        `;

        db.get(query, [id], (err, row) => {
            if (err) {
                console.error('Error al obtener detalles del producto:', err.message);
                reject(err);
            } else if (!row) {
                console.error('No se encontró el producto con el ID proporcionado:', id);
                reject(new Error('Producto no encontrado.'));
            } else {
                // Enviar solo el nombre del archivo en `imagen_url`
                resolve(row);
            }
        });
    });
});



// Eliminar un producto
ipcMain.handle('eliminar-producto', (event, id) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM Productos WHERE id_producto = ?`;

        db.run(query, [id], function (err) {
            if (err) {
                console.error('Error al eliminar el producto:', err.message);
                reject({ success: false, message: err.message });
            } else {
                resolve({ success: true });
            }
        });
    });
});

ipcMain.handle('get-products', (event) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT p.id_producto, p.nombre, p.codigo_barras, p.existencias, 
                   p.precio_publico, c.nombre AS categoria
            FROM Productos p
            LEFT JOIN Categorias c ON p.id_categoria = c.id_categoria
        `;

        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Error al obtener productos:', err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
});

// Listar categorías
ipcMain.handle('get-categorias', (event) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT id_categoria, nombre FROM Categorias`;
        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Error al obtener categorías:', err.message);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
});

// Crear nueva categoría
ipcMain.handle('crear-categoria', (event, nuevaCategoria) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO Categorias (nombre) VALUES (?)`;
        db.run(query, [nuevaCategoria], function (err) {
            if (err) {
                console.error('Error al crear categoría:', err.message);
                reject({ success: false, message: err.message });
            } else {
                resolve({ success: true });
            }
        });
    });
});


const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        enableRemoteModule: false,
        nodeIntegration: false,

    },
  });

  mainWindow.loadURL('http://localhost:3000');

  // Evento cuando se cierra la ventana
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};
// Evento cuando la aplicación está lista
app.on('ready', createMainWindow);

// Salir cuando todas las ventanas están cerradas
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});


const express = require('express');
const expressApp = express(); // Renombrar la instancia de Express

// Servir el directorio de imágenes
expressApp.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configurar Express para que escuche en un puerto
const PORT = 3001; // Cambia este puerto si es necesario
expressApp.listen(PORT, () => {
  console.log(`Servidor de imágenes disponible en http://localhost:${PORT}/uploads`);
});

