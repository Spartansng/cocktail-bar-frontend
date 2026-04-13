const IDENTIFIER_REGEX = /^[a-zA-Z0-9]{8,12}$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{12,64}$/;

export function validateIdentifier(identifiant) {
  return IDENTIFIER_REGEX.test(identifiant);
}

export function validatePassword(password) {
  return PASSWORD_REGEX.test(password);
}

export function getIdentifierError(identifiant) {
  if (!identifiant) return 'Identifiant requis';
  if (!validateIdentifier(identifiant)) {
    return 'Identifiant invalide (8-12 caractères alphanumériques)';
  }
  return null;
}

export function getPasswordError(password) {
  if (!password) return 'Mot de passe requis';
  if (!validatePassword(password)) {
    return 'Mot de passe invalide (12-64 chars, 1 majuscule, 1 chiffre, 1 spécial)';
  }
  return null;
}
