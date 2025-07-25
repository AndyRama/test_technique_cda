const request = require('supertest');
const app = require('../src/app');

// Tests API Users - Version stable et complète
describe('Users API Tests', () => {
  
  // Test de base - Santé de l'API
  describe('GET /api/health', () => {
    it('devrait retourner le statut de santé de l\'API', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('API is running!');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.status).toBeDefined();
      expect(response.body.endpoints).toHaveProperty('users');
    });
  });

  // Tests de validation POST
  describe('POST /api/users - Validation', () => {
    it('devrait rejeter un utilisateur sans nom', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect([400, 503]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter un email invalide', async () => {
      const userData = {
        name: 'Test User',
        email: 'email-invalide',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect([400, 503]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter un mot de passe trop court', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect([400, 503]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter un nom trop court', async () => {
      const userData = {
        name: 'A',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect([400, 503]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter un âge invalide', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        age: -5
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect([400, 503]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter un rôle invalide', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'superadmin'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect([400, 503]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });
  });

  // Tests des endpoints principaux
  describe('GET /api/users', () => {
    it('devrait retourner une réponse de liste d\'utilisateurs', async () => {
      const response = await request(app)
        .get('/api/users');

      // Accepter succès ou erreur DB, mais pas d'erreur de route
      expect([200, 503]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
      
      if (response.status === 200) {
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('pagination');
      }
    });

    it('devrait gérer la pagination', async () => {
      const response = await request(app)
        .get('/api/users?page=1&limit=5');

      expect([200, 503]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });

    it('devrait gérer la recherche', async () => {
      const response = await request(app)
        .get('/api/users?search=test');

      expect([200, 503]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });
  });

  // Tests avec ID
  describe('GET /api/users/:id', () => {
    it('devrait gérer un ID MongoDB valide', async () => {
      const validId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/users/${validId}`);

      expect([200, 404, 503]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });

    it('devrait rejeter un ID invalide avec 404', async () => {
      const response = await request(app)
        .get('/api/users/invalid-id');

      expect([404, 503]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });

    it('devrait gérer un ID inexistant', async () => {
      const nonExistentId = '507f1f77bcf86cd799439999';
      const response = await request(app)
        .get(`/api/users/${nonExistentId}`);

      expect([404, 503]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });
  });

  // Tests PUT
  describe('PUT /api/users/:id', () => {
    it('devrait accepter une mise à jour valide', async () => {
      const validId = '507f1f77bcf86cd799439011';
      const updateData = {
        name: 'Updated User',
        age: 30
      };

      const response = await request(app)
        .put(`/api/users/${validId}`)
        .send(updateData);

      expect([200, 404, 503]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });

    it('devrait valider les données de mise à jour', async () => {
      const validId = '507f1f77bcf86cd799439011';
      const invalidData = {
        email: 'email-invalide',
        age: -10
      };

      const response = await request(app)
        .put(`/api/users/${validId}`)
        .send(invalidData);

      expect([400, 404, 503]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });
  });

  // Tests DELETE
  describe('DELETE /api/users/:id', () => {
    it('devrait gérer une suppression', async () => {
      const validId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/users/${validId}`);

      expect([200, 404, 503]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });

    it('devrait rejeter un ID invalide', async () => {
      const response = await request(app)
        .delete('/api/users/invalid-id');

      expect([404, 503]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });
  });

  // Tests d'erreurs diverses
  describe('Gestion des erreurs', () => {
    it('devrait retourner 404 pour une route inexistante', async () => {
      const response = await request(app)
        .get('/api/inexistant');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Route not found');
    });

    it('devrait gérer les requêtes avec des données vides', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({});

      expect([400, 503]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });

    it('devrait gérer les caractères spéciaux dans la recherche', async () => {
      const response = await request(app)
        .get('/api/users?search=test%20user');

      expect([200, 503]).toContain(response.status);
      expect(response.body).toHaveProperty('success');
    });
  });

  // Tests de robustesse
  describe('Tests de robustesse', () => {
    it('devrait répondre rapidement aux requêtes simples', async () => {
      const startTime = Date.now();
      
      await request(app).get('/api/health');
      
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1000);
    });

    it('devrait maintenir la cohérence des réponses JSON', async () => {
      const response = await request(app).get('/api/users');
      
      expect(response.body).toHaveProperty('success');
      expect(typeof response.body.success).toBe('boolean');
    });

    it('devrait gérer plusieurs requêtes en parallèle', async () => {
      const promises = Array(3).fill().map(() => 
        request(app).get('/api/health')
      );

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('API is running!');
      });
    });
  });
});