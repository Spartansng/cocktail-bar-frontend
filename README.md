# Cocktail Bar Frontend

Interface React pour la gestion des commandes d'un bar a cocktails.

## Prerequis

- Node.js 20+
- npm

## Installation

```bash
npm install
```

## Configuration

Copier `.env.example` en `.env` et adapter les valeurs :

```bash
cp .env.example .env
```

| Variable | Description | Defaut |
|---|---|---|
| VITE_API_URL | URL de l'API backend | http://localhost:3000/api |

## Lancement

```bash
npm run dev
```

## Tests

```bash
npm test
```

## Build

```bash
npm run build
```

## Docker

```bash
docker build -t cocktail-bar-frontend .
docker run -p 80:80 cocktail-bar-frontend
```

## Structure

```
src/
  api/          # Client API (fetch wrapper)
  context/      # AuthContext (JWT, user, login/logout)
  components/   # Composants reutilisables (Navbar, CocktailCard, etc.)
  pages/
    client/     # Pages publiques (carte, detail, commande, suivi)
    admin/      # Pages admin (login, dashboard, gestion)
  utils/        # Validations (identifiant, mot de passe)
```
