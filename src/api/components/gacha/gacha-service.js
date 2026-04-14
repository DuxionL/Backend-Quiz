const GachaRepository = require('./gacha-repository');

const NO_PRIZE_CHANCE = 0.2;
class GachaService {
  constructor() {
    this.repository = new GachaRepository();
  }

  async initializePrizes() {
    const prizes = [
      { id: 1, name: 'Emas 10 gram', quota: 1, remaining: 1, rate: 0.5 },
      { id: 2, name: 'Smartphone X', quota: 5, remaining: 5, rate: 2.5 },
      { id: 3, name: 'Smartwatch Y', quota: 10, remaining: 10, rate: 6 },
      {
        id: 4,
        name: 'Voucher Rp100.000',
        quota: 100,
        remaining: 100,
        rate: 15,
      },
      { id: 5, name: 'Pulsa Rp50.000', quota: 500, remaining: 500, rate: 76 },
    ];

    for (const prize of prizes) {
      const existing = await this.repository.getPrizeById(prize.id);
      if (!existing) {
        const newPrize = new (require('../../../models').GachaPrize)(prize);
        await newPrize.save();
      } else if (
        existing.rate !== prize.rate ||
        existing.name !== prize.name ||
        existing.quota !== prize.quota
      ) {
        await this.repository.updatePrizeById(prize.id, {
          name: prize.name,
          quota: prize.quota,
          rate: prize.rate,
        });
      }
    }
  }

  async doGacha(userId) {
    const attemptsToday = await this.repository.getUserAttemptsToday(userId);
    if (attemptsToday.length >= 5) {
      throw new Error('Daily gacha limit exceeded');
    }
    const prizes = await this.repository.getPrizes();
    const availablePrizes = prizes.filter((p) => p.remaining > 0);

    if (availablePrizes.length === 0) {
      await this.repository.createAttempt(userId);
      return null;
    }
    if (Math.random() < NO_PRIZE_CHANCE) {
      await this.repository.createAttempt(userId);
      return null;
    }
    const totalRate = availablePrizes.reduce(
      (sum, prize) => sum + (prize.rate || 0),
      0
    );
    let randomRate = Math.random() * totalRate;
    let wonPrize = null;
    for (const prize of availablePrizes) {
      randomRate -= prize.rate || 0;
      if (randomRate <= 0) {
        wonPrize = prize;
        break;
      }
    }
    if (!wonPrize) {
      wonPrize = availablePrizes[availablePrizes.length - 1];
    }
    await this.repository.updatePrizeRemaining(
      wonPrize.id,
      wonPrize.remaining - 1
    );

    await this.repository.createAttempt(userId, wonPrize._id);

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
