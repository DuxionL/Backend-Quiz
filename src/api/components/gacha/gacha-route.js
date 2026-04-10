const express = require('express');
const GachaController = require('./gacha-controller');

const router = express.Router();
const controller = new GachaController();

// Initialize prizes on startup
controller.service.initializePrizes();

router.post('/', (req, res) => controller.doGacha(req, res));
router.get('/history', (req, res) => controller.getHistory(req, res));
router.get('/prizes', (req, res) => controller.getPrizes(req, res));
router.get('/winners', (req, res) => controller.getWinners(req, res));

module.exports = router;
