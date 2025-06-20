## Getting Started

### Prerequisites

- Node.js 18+
- Yarn
- Docker (optional, for PostgreSQL)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd qa-challenge
```

2. Install dependencies:

```bash
yarn install
```

3. Start the PostgreSQL database (using Docker):

```bash
yarn setup:db
# Or using Docker Compose
yarn docker-compose:up
```

4. Start the backend:

```bash
yarn backend
```

5. Start the frontend:

```bash
yarn frontend
```

6. Access the application at http://localhost:3000

