-- Crear la tabla Usuarios
CREATE TABLE Usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    contrasena TEXT NOT NULL,
    rol TEXT NOT NULL
);

-- Crear la tabla Categorías
CREATE TABLE Categorias (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT
);

-- Crear la tabla Productos
CREATE TABLE Productos (
    id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    codigo_barras TEXT UNIQUE,
    sku TEXT,
    unidad_venta TEXT,
    id_categoria INTEGER,
    marca TEXT,
    descripcion TEXT,
    existencias INTEGER,
    cantidad_minima INTEGER,
    precio_publico REAL,
    precio_compra REAL,
    iva REAL,
    ieps REAL,
    FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria)
);

-- Crear la tabla Proveedores
CREATE TABLE Proveedores (
    id_proveedor INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    contacto TEXT,
    telefono TEXT,
    email TEXT UNIQUE
);

-- Crear la tabla Clientes
CREATE TABLE Clientes (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT,
    telefono TEXT,
    email TEXT UNIQUE,
    comentarios TEXT
);

-- Crear la tabla Ventas
CREATE TABLE Ventas (
    id_venta INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER,
    fecha TEXT NOT NULL,
    total REAL NOT NULL,
    metodo_pago TEXT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente)
);

-- Crear la tabla DetalleVentas
CREATE TABLE DetalleVentas (
    id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venta INTEGER,
    id_producto INTEGER,
    cantidad INTEGER NOT NULL,
    precio_unitario REAL NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES Ventas(id_venta),
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);

-- Crear la tabla Compras
CREATE TABLE Compras (
    id_compra INTEGER PRIMARY KEY AUTOINCREMENT,
    id_proveedor INTEGER,
    fecha TEXT NOT NULL,
    total REAL NOT NULL,
    estado TEXT NOT NULL,
    FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id_proveedor)
);

-- Crear la tabla Caja
CREATE TABLE Caja (
    id_movimiento INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL, -- 'Ingreso' o 'Egreso'
    monto REAL NOT NULL,
    motivo TEXT,
    fecha TEXT NOT NULL,
    realizado_por TEXT
);

-- Insertar datos en la tabla Categorías
INSERT INTO Categorias (nombre, descripcion) VALUES
('Herramientas', 'Artículos de ferretería y construcción'),
('Iluminación', 'Productos relacionados con iluminación'),
('Limpieza', 'Productos para el aseo y mantenimiento');

-- Insertar datos en la tabla Productos
INSERT INTO Productos (nombre, codigo_barras, sku, unidad_venta, id_categoria, marca, descripcion, existencias, cantidad_minima, precio_publico, precio_compra, iva, ieps)
VALUES
('Aerosol WD-40', '890123456789', 'SKU1234', 'Unidad', 1, 'WD-40', 'Lubricante multiusos', 597, 10, 155.00, 70.00, 16.0, 0.0),
('Cinta Métrica Truper', '890123456790', 'SKU1235', 'Unidad', 1, 'Truper', 'Cinta métrica de 5 metros', 46, 5, 28.50, 15.00, 16.0, 0.0),
('Martillo Truper', '890123456791', 'SKU1236', 'Unidad', 1, 'Truper', 'Martillo de 16 oz', 10, 2, 19.95, 10.00, 16.0, 0.0);

-- Insertar datos en la tabla Proveedores
INSERT INTO Proveedores (nombre, contacto, telefono, email) VALUES
('Proveedor de Herramientas', 'Pedro Pérez', '+523513070403', 'herramientas@proveedores.com'),
('Proveedor de Iluminación', 'Luis López', '+523513070404', 'iluminacion@proveedores.com'),
('Proveedor de Limpieza', 'Ana García', '+523513070405', 'limpieza@proveedores.com');

-- Insertar datos en la tabla Clientes
INSERT INTO Clientes (nombre, apellido, telefono, email, comentarios) VALUES
('Juan', 'Hernández', '+522364872345', 'juan.hernandez@gmail.com', 'Cliente frecuente.'),
('María', 'Pérez', '+522367890123', 'maria.perez@gmail.com', 'Prefiere pagos en efectivo.');

-- Insertar datos en la tabla Ventas
INSERT INTO Ventas (id_cliente, fecha, total, metodo_pago) VALUES
(1, '2024-11-22', 150.00, 'Efectivo'),
(2, '2024-11-22', 75.00, 'Tarjeta');

-- Insertar datos en la tabla Caja
INSERT INTO Caja (tipo, monto, motivo, fecha, realizado_por) VALUES
('Ingreso', 150.00, 'Venta realizada', '2024-11-22', 'Juan Pérez'),
('Egreso', 50.00, 'Pago de servicios', '2024-11-22', 'Ana López');
