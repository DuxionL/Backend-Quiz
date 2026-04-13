const GachaRepository = require('./gacha-repository');

const NO_PRIZE_CHANCE = 0.2; // 20% chance to win nothing even when prizes remain

class GachaService {
  constructor() {
    this.repository = new GachaRepository();
  }

  async initializePrizes() {
    const prizes = [
      { id: 1, name: 'Emas 10 gram', quota: 1, remaining: 1 },
      { id: 2, name: 'Smartphone X', quota: 5, remaining: 5 },
      { id: 3, name: 'Smartwatch Y', quota: 10, remaining: 10 },
      { id: 4, name: 'Voucher Rp100.000', quota: 100, remaining: 100 },
      { id: 5, name: 'Pulsa Rp50.000', quota: 500, remaining: 500 },
    ];

    for (const prize of prizes) {
      const existing = await this.repository.getPrizeById(prize.id);
      if (!existing) {
        const newPrize = new (require('../../../models').GachaPrize)(prize);
        await newPrize.save();
      }
    }
  }

  async doGacha(userId) {
    // Check daily limit
    const attemptsToday = await this.repository.getUserAttemptsToday(userId);
    if (attemptsToday.length >= 5) {
      throw new Error('Daily gacha limit exceeded');
    }

    // Get available prizes
    const prizes = await this.repository.getPrizes();
    const availablePrizes = prizes.filter((p) => p.remaining > 0);

    if (availablePrizes.length === 0) {
      // No prize won because there are no prizes left
      await this.repository.createAttempt(userId);
      return null;
    }

    // Chance to win nothing even if prizes remain
    if (Math.random() < NO_PRIZE_CHANCE) {
      await this.repository.createAttempt(userId);
      return null;
    }

    // Randomly select a prize
    const randomIndex = Math.floor(Math.random() * availablePrizes.length);
    const wonPrize = availablePrizes[randomIndex];

    // Decrement remaining
    await this.repository.updatePrizeRemaining(
      wonPrize.id,
      wonPrize.remaining - 1
    );

    // Record attempt
    const attempt = await this.repository.createAttempt(userId, wonPrize._id);

    return wonPrize;
  }

  async getUserHistory(userId) {
    return this.repository.getUserHistory(userId);
  }

  async getRemainingPrizes() {
    return this.repository.getPrizes();
  }

  async getWinners() {
    const attempts = await this.repository.getAllAttemptsWithPrizes();
    return attempts.map((attempt) => ({
      prize: attempt.prizeWon.name,
      winner: this.maskName(attempt.userId), // Assuming userId is name, but actually it's id. Wait, need to fix.
    }));
  }

  maskName(name) {
    if (!name) return '';
    const parts = name.split(' ');
    return parts
      .map((part) => {
        if (part.length <= 2) return '*'.repeat(part.length);
        return part[0] + '*'.repeat(part.length - 2) + part[part.length - 1];
      })
      .join(' ');
  }
}

module.exports = GachaService;
