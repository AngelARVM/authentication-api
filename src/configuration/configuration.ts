export const ORMConfig = () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      url: process.env.DB_URL,
      synchronize: true,
      retryAttempts: 5,
      name: 'default',
      database: 'postgres',
      "logging": true,
      retryAttemps: 1
    }
});

