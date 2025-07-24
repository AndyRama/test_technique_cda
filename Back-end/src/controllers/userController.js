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

module.exports = {
  createUser
}
