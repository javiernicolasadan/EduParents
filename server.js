const app = require("./app");
const mongoose = require("mongoose");

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("Base de datos:", mongoose.connection.name);
    console.log("Estado de la conexión:", mongoose.connection.readyState);
    console.log("Conectado a MongoDB correctamente");

    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error detallado:", err.message);
    console.error("Código:", err.code);
    console.error("Error conectando a MongoDB:", err);
  });
