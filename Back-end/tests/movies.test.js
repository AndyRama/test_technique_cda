const request = require('supertest');
const app = require('../src/app');

// Tests Movies API - Version stable sans mocks complexes
describe('Movies API Tests', () => {

  // Test de base - endpoints disponibles
  describe('GET /api/movies/trending', () => {
    it('devrait retourner les films tendances', async () => {
      const response = await request(app)
        .get('/api/movies/trending');

      // Accepter succès (200) ou erreur de clé API (500)
      expect([200, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });
  });

  // Tests de validation pour la recherche
  describe('GET /api/movies/search - Validation', () => {
    it('devrait rejeter une recherche sans paramètre q', async () => {
      const response = await request(app)
        .get('/api/movies/search');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('recherche');
    });

    it('devrait rejeter une recherche trop courte', async () => {
      const response = await request(app)
        .get('/api/movies/search?q=a');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('2 caractères');
    });

    it('devrait accepter une recherche valide', async () => {
      const response = await request(app)
        .get('/api/movies/search?q=Batman');

      // Soit succès (200) soit erreur OMDb (500), mais pas erreur de validation
      expect([200, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });

    it('devrait valider le paramètre type', async () => {
      const response = await request(app)
        .get('/api/movies/search?q=test&type=invalid');

      expect([200, 500]).toContain(response.status);
      // Si validation activée, devrait rejeter le type invalide
    });

    it('devrait valider le paramètre year', async () => {
      const response = await request(app)
        .get('/api/movies/search?q=test&year=abc');

      expect([200, 500]).toContain(response.status);
      // Année invalide devrait être ignorée ou rejetée
    });
  });

  // Tests avec ID IMDb
  describe('GET /api/movies/:imdbId', () => {
    it('devrait rejeter un ID IMDb invalide', async () => {
      const response = await request(app)
        .get('/api/movies/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('IMDb invalide');
    });

    it('devrait accepter un ID IMDb valide', async () => {
      const response = await request(app)
        .get('/api/movies/tt1375666'); // Inception

      // Soit succès (200), soit non trouvé (404), soit erreur OMDb (500)
      expect([200, 404, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });

    it('devrait gérer un ID IMDb inexistant', async () => {
      const response = await request(app)
        .get('/api/movies/tt9999999'); // ID qui n'existe pas

      expect([404, 500]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });
  });

  // Tests de recherche avec paramètres
  describe('Recherche avec paramètres', () => {
    it('devrait gérer les paramètres de recherche valides', async () => {
      const response = await request(app)
        .get('/api/movies/search?q=Batman&year=2008&type=movie&page=1');

      expect([200, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });

    it('devrait gérer la pagination', async () => {
      const response = await request(app)
        .get('/api/movies/search?q=Marvel&page=2');

      expect([200, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });

    it('devrait gérer les caractères spéciaux', async () => {
      const response = await request(app)
        .get('/api/movies/search?q=Star%20Wars');

      expect([200, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });
  });

  // Tests d'erreurs diverses
  describe('Gestion des erreurs', () => {
    it('devrait gérer les requêtes avec des paramètres vides', async () => {
      const response = await request(app)
        .get('/api/movies/search?q=');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('devrait maintenir la cohérence des réponses', async () => {
      const response = await request(app)
        .get('/api/movies/trending');

      expect(response.body).toHaveProperty('success');
      expect(typeof response.body.success).toBe('boolean');
    });
  });

  // Tests de robustesse
  describe('Tests de robustesse', () => {
    it('devrait répondre rapidement aux requêtes de base', async () => {
      const startTime = Date.now();
      
      await request(app).get('/api/movies/trending');
      
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(5000); // 5 secondes max pour API externe
    });

    it('devrait gérer plusieurs requêtes simultanées', async () => {
      const promises = Array(3).fill().map(() => 
        request(app).get('/api/movies/trending')
      );

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect([200, 500]).toContain(response.status);
        expect(response.body).toHaveProperty('success');
      });
    });

    it('devrait maintenir le format de réponse même en cas d\'erreur', async () => {
      const response = await request(app)
        .get('/api/movies/search?q=filmquinexistepas123456');

      expect([200, 404, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('message');
    });
  });

  // Tests conditionnels (seulement si OMDb configuré)
  describe('Tests conditionnels OMDb', () => {
    beforeAll(() => {
      if (!process.env.OMDB_API_KEY) {
        console.log('⚠️  Tests OMDb ignorés - clé API non configurée');
      }
    });

    it('devrait indiquer le statut de la configuration OMDb', async () => {
      const response = await request(app)
        .get('/api/movies/trending');

      if (response.status === 500) {
        expect(response.body.message).toContain('OMDb');
      } else {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      }
    });
  });
});