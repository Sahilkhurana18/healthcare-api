const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    for (const key of ['DATABASE_URL', 'JWT_SECRET']) {
      if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
    }
    await sequelize.authenticate();
    await sequelize.sync(); // creates tables if missing
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
})();
