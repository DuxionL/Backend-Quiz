const mongoose = require('mongoose');
const { env, port } = require('./core/config');
const logger = require('./core/logger')('app');
const server = require('./core/server');

const app = server.listen(port, (err) => {
  if (err) {
    logger.fatal(err, 'Failed to start the server.');
    process.exit(1);
  } else {
    logger.info(`Server runs at port ${port} in ${env} environment`);
  }
});

process.on('uncaughtException', (err) => {
  logger.fatal(err, 'Uncaught exception.');

  // Shutdown the server gracefully
  app.close(() => process.exit(1));

  // If a graceful shutdown is not achieved after 1 second,
  // shut down the process completely
  setTimeout(() => process.abort(), 1000).unref();
  process.exit(1);
});

const connectionString = `mongodb://Duxion:MzHAaY9tvSJG87Hg@ac-pibvdib-shard-00-00.u5sw3rh.mongodb.net:27017,ac-pibvdib-shard-00-01.u5sw3rh.mongodb.net:27017,ac-pibvdib-shard-00-02.u5sw3rh.mongodb.net:27017/?ssl=true&replicaSet=atlas-ue29nr-shard-0&authSource=admin&appName=BackEdan`;

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  logger.info('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.info('Disconnected from MongoDB');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    logger.info('MongoDB connection closed due to app termination');
    process.exit(0);
  });
});
