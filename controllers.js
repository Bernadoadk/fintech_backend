const axios = require("axios");
const Payment = require("./models");
require("dotenv").config();

// Headers avec la clé secrète Flutterwave
const headers = {
    Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
    "Content-Type": "application/json"
};

// Endpoint pour initier un paiement avec Flutterwave
exports.initiatePayment = async (req, res) => {
    try {
        const { amount, email } = req.body;
        const tx_ref = `tx-${Date.now()}`;

        console.log("➡️ Envoi de la requête à Flutterwave...");

        const payload = {
            tx_ref,
            amount,
            currency: "NGN",
            redirect_url: "https://your-redirect-url.com/success",
            payment_options: "card,banktransfer",
            customer: { email }
        };

        const response = await axios.post("https://api.flutterwave.com/v3/payments", payload, {
            headers: {
                Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
                "Content-Type": "application/json"
            }
        });

        console.log("✅ Réponse Flutterwave :", response.data);

        if (response.data.status !== "success") {
            throw new Error("Échec de l'initialisation du paiement");
        }

        // 🔹 Enregistre `tx_ref` en base de données (au lieu de `id`)
        const transaction = new Payment({
            transaction_id: tx_ref, // 🔹 Enregistre `tx_ref`
            amount,
            status: "pending"
        });
        await transaction.save();

        res.json({ success: true, data: { link: response.data.data.link, tx_ref } });
    } catch (error) {
        console.error("❌ Erreur Flutterwave :", error.response?.data || error.message);
        res.status(500).json({ success: false, message: "Erreur lors de l'initialisation du paiement" });
    }
};


// Endpoint pour vérifier un paiement avec Flutterwave
exports.verifyPayment = async (req, res) => {
    try {
        const { transaction_id } = req.query; // transaction_id = tx_ref ici

        console.log(`Vérification du paiement pour tx_ref: ${transaction_id}`);

        // 🔹 Étape 1 : Récupérer l'ID Flutterwave depuis `tx_ref`
        const responseList = await axios.get(`https://api.flutterwave.com/v3/transactions?tx_ref=${transaction_id}`, {
            headers: {
                Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
            }
        });

        if (!responseList.data.data || responseList.data.data.length === 0) {
            return res.json({ success: false, message: "Aucune transaction trouvée pour ce tx_ref" });
        }

        const flutterwaveId = responseList.data.data[0].id; // Récupère l'ID réel

        // 🔹 Étape 2 : Vérifier la transaction avec cet `id`
        const response = await axios.get(`https://api.flutterwave.com/v3/transactions/${flutterwaveId}/verify`, {
            headers: {
                Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
            }
        });

        console.log("✅ Réponse de la vérification :", response.data);

        if (response.data.status !== "success") {
            return res.json({ success: false, message: "Transaction non trouvée ou invalide" });
        }

        const paymentData = response.data.data;

        // 🔹 Mise à jour du statut en base de données
        const payment = await Payment.findOneAndUpdate(
            { transaction_id: transaction_id },
            { status: paymentData.status },
            { new: true }
        );

        res.json({ success: true, data: payment });
    } catch (error) {
        console.error("❌ Erreur lors de la vérification :", error.response?.data || error.message);
        res.status(500).json({ success: false, message: "Erreur lors de la vérification du paiement" });
    }
};
