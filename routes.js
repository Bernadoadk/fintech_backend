const express = require("express");
const { initiatePayment, verifyPayment } = require("./controllers");
const router = express.Router();

router.post("/payments/initiate", initiatePayment);
router.get("/payments/verify", verifyPayment);

module.exports = router;
