const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");

let transactionRef = ""; // Stocke tx_ref

describe("Tests API Paiements avec Flutterwave", () => {
    it("Initie un paiement", async () => {
        const res = await request(app).post("/api/payments/initiate").send({
            amount: 5000,
            email: "test@example.com"
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);

        // Stocker le tx_ref pour la vérification
        transactionRef = res.body.data.tx_ref;
        expect(transactionRef).toBeDefined();
    });

    it("Vérifie un paiement avec le tx_ref généré", async () => {
        const res = await request(app).get(`/api/payments/verify?transaction_id=${transactionRef}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });

    // Fermer MongoDB après les tests
    afterAll(async () => {
        await mongoose.connection.close();
    });
});
