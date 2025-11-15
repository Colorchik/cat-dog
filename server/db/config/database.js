require('dotenv').config();

// Log environment variables for debugging (don't log the actual URL for security)
const env = process.env.NODE_ENV || 'development';
console.log(`Database config - NODE_ENV: ${env}`);
console.log(`Database config - DATABASE_URL is ${process.env.DATABASE_URL ? 'set' : 'NOT SET'}`);

if (!process.env.DATABASE_URL && env === 'production') {
  console.error('WARNING: DATABASE_URL is not set in production environment!');
  console.error('Please ensure PostgreSQL database is created in Railway and DATABASE_URL is set automatically.');
}

module.exports = {
development: {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres'
},
test: {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres'
},
production: {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres'
},
};