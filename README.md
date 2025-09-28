# Medisyn

Medisyn is a React + Vite prototype with an Express/MongoDB backend for managing patient data.

## Prerequisites

- Node.js 18+
- npm 9+
- A running MongoDB instance (Atlas or local)

## Environment

1. Copy `.env.example` to `.env`.
2. Update `MONGODB_URI` with your MongoDB connection string.
3. Adjust `PORT` and `VITE_API_BASE_URL` if you are hosting the API somewhere other than `http://localhost:4000`.

```
cp .env.example .env
# then edit .env
```

## Installation

```
npm install
```

## Development

Run the API server (requires the `.env` values above):

```
npm run server
```

In a separate terminal, start the Vite dev server:

```
npm run dev
```

To refresh the Mongo collection with the default AESPA patients, run:

```
npm run seed -- --reset
```

By default the frontend proxies requests to the API at the URL specified by `VITE_API_BASE_URL`.

## Accessibility

Open the new settings menu (sliders icon in the header) to enable colour-blind friendly palettes, high contrast mode, dyslexia-friendly typography, reduced motion, or larger default text. Preferences persist locally in `localStorage` and apply instantly across the interface.

## Production Build

```
npm run build
```

The bundled assets are output to `dist/`.
