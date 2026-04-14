const { GachaPrize, GachaAttempt } = require('../../../models');

class GachaRepository {
  async getPrizes() {
    return GachaPrize.find({});
  }

  async getPrizeById(id) {
    return GachaPrize.findOne({ id });
  }

  async updatePrizeRemaining(id, remaining) {
    return GachaPrize.findOneAndUpdate({ id }, { remaining }, { new: true });
  }

  async updatePrizeById(id, data) {
    return GachaPrize.findOneAndUpdate({ id }, data, { new: true });
  }

  async createAttempt(userId, prizeId = null) {
    const attempt = new GachaAttempt({ userId, prizeWon: prizeId });
    return attempt.save();
  }

  async getUserAttemptsToday(userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return GachaAttempt.find({
      userId,
      date: { $gte: today, $lt: tomorrow },
    });
  }

  async getUserHistory(userId) {
    return GachaAttempt.find({ userId })
      .populate('prizeWon')
      .sort({ date: -1 });
  }

  async getAllAttemptsWithPrizes() {
    return GachaAttempt.find({ prizeWon: { $ne: null } }).populate('prizeWon');
  }
}

module.exports = GachaRepository;
