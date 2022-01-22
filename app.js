// Cargamos las variables de entorno...
require("dotenv").config();

// y las bibliotecas necesarias
const express = require("express");
const mongoose = require("mongoose");
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const routes = require("./routes");

// Inicializamos Express
const app = express();

// Declaramos las constantes que contendrán las variables de entorno
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Especificamos el motor de plantillas que utilizaremos
app.set("view engine", "ejs");

// Establecemos la conexión con la base de datos
mongoose.connect(MONGO_URI);

// Inicializamos el middleware necesario para todos los endpoints
app.use(morgan("dev"));
app.use(compression());
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));

// Permitimos a Express reconocer los campos con peticiones POST
app.use(express.urlencoded({ extended: false }));

// Directorio desde donde se servirán los archivos estáticos
app.use(express.static("public"));

// Requerimos todos los endpoints declarados en ./routes/index.js
app.use(routes);

// En caso de no encontrar la ruta solicitada, devolvemos un error 404
app.use((req, res) => res.status(404).render("errors/404"));

try {
  // Iniciamos la app en el puerto definido
  app.listen(PORT);
  console.log(`> Servidor escuchando en http://localhost:${PORT}`);
} catch (error) {
  console.error(error);
  process.exit();
}
