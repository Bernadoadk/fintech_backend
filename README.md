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
    - **POST /api/payments/initiate** : Initier un paiement
    - **GET /api/payments/verify?transaction_id=<id>** : Vérifier un paiement

## Tests
    npm test