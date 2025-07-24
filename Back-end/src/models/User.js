import { Schema } from 'mongoose';

// schema model User
// Index pour les recherches
// Middleware pour hasher le mot de passe avant sauvegarde(bycrypt)
// Méthode pour comparer les mots de passe
// Méthode pour exclure le mot de passe des réponses JSON
// Virtual pour l'ID sans underscore