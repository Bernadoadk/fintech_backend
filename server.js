const express = require("express");
const connectDB = require("./config");
const paymentRoutes = require("./routes");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use("/api", paymentRoutes);

// Connexion à la base de données
connectDB();

// Démarrer le serveur SEULEMENT si on n'est pas en test
if (process.env.NODE_ENV !== "test") {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
}

module.exports = app; // Exportation pour Jest
