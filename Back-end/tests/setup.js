// Configuration globale pour Jest
const dotenv = require('dotenv');

// Charger les variables d'environnement de test
dotenv.config({ path: '.env.test' });

// Forcer NODE_ENV en test
process.env.NODE_ENV = 'test';

// Configuration timeouts
jest.setTimeout(30000);

// Mock console pour des tests plus propres
const originalConsole = { ...console };

beforeAll(() => {
  // Garder seulement les erreurs importantes pendant les tests
  console.log = jest.fn();
  console.info = jest.fn();
  console.warn = jest.fn();
  // Garder console.error pour le debug
});

afterAll(() => {
  // Restaurer console après les tests
  Object.assign(console, originalConsole);
});

// Nettoyage après chaque test
afterEach(() => {
  jest.clearAllMocks();
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});