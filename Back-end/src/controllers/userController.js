const User = require('../models/User')
const { validationResult } = require('express-validator')

// @desc    Créer un nouvel utilisateur
// @route   POST /api/users
// @access  Public
const createUser = async (req, res, next) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreurs de validation',
        errors: errors.array(),
      })
    }

    const { name, email, password, age, role } = req.body

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà',
      })
    }

    // Créer l'utilisateur
    const user = new User({
      name,
      email,
      password,
      age,
      role,
    })

    await user.save()

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Récupérer tous les utilisateurs
// @route   GET /api/users
// @access  Public
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const search = req.query.search || ''

    // Construire la requête de recherche
    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {}

    const users = await User.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await User.countDocuments(searchQuery)

    res.json({
      success: true,
      data: users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Récupérer un utilisateur par ID
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
	getUserById
}
