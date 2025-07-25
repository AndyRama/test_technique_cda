const express = require('express');
const { body } = require('express-validator');
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

// Validation middleware pour la création d'utilisateur
const validateUserCreation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Veuillez entrer un email valide'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('age')
    .optional()
    .isInt({ min: 0, max: 120 })
    .withMessage('L\'âge doit être un nombre entre 0 et 120'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Le rôle doit être "user" ou "admin"')
];

// Validation middleware pour la mise à jour d'utilisateur
const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Veuillez entrer un email valide'),
  body('age')
    .optional()
    .isInt({ min: 0, max: 120 })
    .withMessage('L\'âge doit être un nombre entre 0 et 120'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Le rôle doit être "user" ou "admin"'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive doit être un booléen')
];

// Routes CRUD - UNE SEULE DE CHAQUE
router.post('/', validateUserCreation, createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', validateUserUpdate, updateUser);
router.delete('/:id', deleteUser);

module.exports = router;