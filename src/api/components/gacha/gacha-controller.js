const GachaService = require('./gacha-service');

class GachaController {
  constructor() {
    this.service = new GachaService();
  }

  async doGacha(req, res) {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const prize = await this.service.doGacha(userId);
      if (prize) {
        res.json({ message: 'Congratulations! You won:', prize: prize.name });
      } else {
        res.json({ message: 'No prize won this time. Try again!' });
      }
    } catch (error) {
      if (error.message === 'Daily gacha limit exceeded') {
        res.status(429).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getHistory(req, res) {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const history = await this.service.getUserHistory(userId);
      res.json({ history });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getPrizes(req, res) {
    try {
      const prizes = await this.service.getRemainingPrizes();
      res.json({ prizes });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getWinners(req, res) {
    try {
      const winners = await this.service.getWinners();
      res.json({ winners });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = GachaController;
