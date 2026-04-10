module.exports = (db) =>
  db.model(
    'GachaAttempt',
    db.Schema({
      userId: { type: String, required: true },
      date: { type: Date, default: Date.now },
      prizeWon: {
        type: db.Schema.Types.ObjectId,
        ref: 'GachaPrize',
        default: null,
      },
    })
  );
