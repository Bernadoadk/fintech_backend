# API Paiements (Paystack / Flutterwave)

## Installation
1. Clonez le projet :
    git clone <repo_url> cd fintech-backend

2. Installez les dépendances :
    npm install

3. Configurez l’environnement :
    - Ajoutez vos clés API Paystack/Flutterwave

4. Démarrez le serveur :
    npm start


## Endpoints
    - **POST /api/payments/initiate** :
    {
        "amount": 5000,
        "email": "client@example.com"
    }
    - **GET /api/payments/verify?transaction_id=<id>** :
    {
        "success": true,
        "data": {
            "tx_ref": "tx-123456789",
            "payment_link": "https://checkout.flutterwave.com/tx-123456789"
        }
    }

## Tests
    npm test