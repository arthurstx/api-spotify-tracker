# API Spotify Backend

## 📖 About

This is the backend for a Spotify API application. It provides endpoints to interact with the Spotify API and retrieve user data, top artists, top tracks, and more.

## ✨ Features

- **Authentication**: Authenticate users with their Spotify account.
- **Top Stats**: Get the user's top artists and tracks.
- **History**: Get the history of top artists and tracks.
- **Snapshots**: Create and retrieve daily snapshots of user data.
- **User Stats**: Get user statistics.

## 🛠️ Technologies

- **[Node.js](https://nodejs.org/en/)**
- **[Fastify](https://www.fastify.io/)**
- **[Prisma](https://www.prisma.io/)**
- **[PostgreSQL](https://www.postgresql.org/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[Vitest](https://vitest.dev/)**
- **[Docker](https://www.docker.com/)**

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)
- [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/api-spotify-backend.git
```

2. Install the dependencies:

```bash
pnpm install
```

## 🗺️ Environment Variables

- `DATABASE_URL` - URL for connecting to the database
- `SPOTIFY_CLIENT_ID` - Client ID for the Spotify API
- `SPOTIFY_CLIENT_SECRET` - Client Secret of the Spotify API
- `SPOTIFY_REDIRECT_URI` - Spotify API redirect URI
- `API_BASE_URL` - Base URL of the API
- `WEB_BASE_URL` - Base URL of the web

4. Start the database using Docker:

```bash
docker-compose up -d
```

5. Run the database migrations:

```bash
pnpm prisma migrate dev
```

### Running the Application

To run the application in development mode, use the following command:

```bash
pnpm dev
```

The server will be running at `http://localhost:3333`.

## ↗️ Available Endpoints

The available endpoints are documented using Swagger. You can access the documentation at `http://localhost:3333/docs`.

### Auth

- `POST /sessions` - Authenticate a user.
- `POST /token/refresh` - Refresh an expired token.

### Catalog

- `GET /artists` - List tracked artists.
- `GET /tracks` - List tracked tracks.

### History

- `GET /history/artists/:artistId` - Get the history of a specific artist.
- `GET /history/tracks/:trackId` - Get the history of a specific track.
- `GET /history/top` - Get the top history.

### Rankings

- `GET /rankings/artists` - Get the latest top artists.
- `GET /rankings/tracks` - Get the latest top tracks.

### Snapshot

- `GET /snapshots/available` - List available snapshots.
- `GET /snapshots/:date` - Get a daily snapshot.
- `POST /snapshots/sync` - Sync top stats.
- `GET /snapshots/sync/status` - Check daily sync status.

## 🧪 Running Tests

To run the unit tests, use the following command:

```bash
pnpm test
```

To run the end-to-end tests, use the following command:

```bash
pnpm test:e2e
```

To run the tests with coverage, use the following command:

```bash
pnpm test:coverage
```
