
const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Conexión con la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'tu_usuario', // Reemplaza con tu usuario de MySQL
  password: 'tu_contraseña', // Reemplaza con tu contraseña
  database: 'tu_base_de_datos' // Reemplaza con el nombre de la base de datos
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

// Configuramos el servidor para recibir peticiones en formato JSON
app.use(express.json());

// Ruta para obtener todos los juegos
app.get('/api/juegos', (req, res) => {
  const query = `
    SELECT juegos.id, juegos.titulo, juegos.descripcion, juegos.precio, juegos.imagen_url, juegos.ubicacion
    FROM juegos
  `;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los juegos' });
    }
    res.json(results);
  });
});

// Ruta para obtener juegos filtrados por plataforma
app.get('/api/juegos/plataforma/:plataforma_id', (req, res) => {
  const { plataforma_id } = req.params;
  const query = `
    SELECT juegos.id, juegos.titulo, juegos.descripcion, juegos.precio, juegos.imagen_url, juegos.ubicacion
    FROM juegos
    JOIN juego_plataforma ON juegos.id = juego_plataforma.juego_id
    WHERE juego_plataforma.plataforma_id = ?
  `;
  db.query(query, [plataforma_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los juegos filtrados' });
    }
    res.json(results);
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
