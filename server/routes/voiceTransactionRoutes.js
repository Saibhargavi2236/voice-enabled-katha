const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createVoiceDraft,
  confirmVoiceTransaction
} = require("../controllers/voiceTransactionController");

const router = express.Router();

router.post(
    "/draft",
    authMiddleware,
    roleMiddleware("SHOPKEEPER"),
    createVoiceDraft
);
router.post(
    "/confirm",
    authMiddleware,
    roleMiddleware("SHOPKEEPER"),
    confirmVoiceTransaction
);

module.exports = router;