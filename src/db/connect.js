const Pool = require("pg").Pool;

const connection = new Pool({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

const connectDB = async () => {
  await connection.connect();
};

module.exports = { connectDB, connection };
