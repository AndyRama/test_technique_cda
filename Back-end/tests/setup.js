// Configuration Jest - Charge .env.test automatiquement
const dotenv = require('dotenv');

// IMPORTANT: Charger .env.test AVANT tout
dotenv.config({ path: '.env.test' });

// Forcer NODE_ENV
process.env.NODE_ENV = 'test';

// Timeout pour tests
jest.setTimeout(30000);

// Nettoyage après chaque test
afterEach(() => {
  jest.clearAllMocks();
});

console.log('Tests configurés avec .env.test');
console.log('MongoDB:', process.env.MONGODB_URI?.includes('localhost') ? 'Local' : 'Atlas');
console.log('Port:', process.env.PORT);