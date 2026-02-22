# Acquisitions API - Project Rules

## Tech Stack

- **Runtime**: Node.js 22 (ES Modules)
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL with Neon Database
- **ORM**: Drizzle ORM with Drizzle Kit
- **Authentication**: JWT with bcrypt password hashing
- **Security**: Helmet, CORS, ArcJet protection
- **Validation**: Zod schemas
- **Logging**: Winston with Morgan middleware
- **Containerization**: Docker with multi-stage builds
- **Code Quality**: ESLint + Prettier

## Architecture Patterns

- **MVC Structure**: Controllers, Models, Services separation
- **Path Mapping**: Use import aliases (`#config/*`, `#controllers/*`, etc.)
- **Middleware-First**: Security, logging, validation applied globally
- **Service Layer**: Business logic isolated from controllers
- **Environment-Based Configuration**: `.env` files for different stages

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Run with Docker
npm run dev:docker
```

### Code Quality

```bash
# Lint code
npm run lint
npm run lint:fix

# Format code
npm run format
npm run format:check
```

### Database Operations

```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Open Drizzle Studio
npm run db:studio
```

## Code Standards

### File Structure

- Controllers: Handle HTTP requests/responses only
- Services: Contain business logic
- Models: Define database schemas with Drizzle
- Routes: Define API endpoints
- Middleware: Reusable request processing
- Utils: Helper functions
- Validations: Zod schemas for input validation

### Import Conventions

- Use ES module imports (`import/export`)
- Leverage path aliases (`#config/*`, `#controllers/*`, etc.)
- Import dependencies at the top
- Group imports: external → internal → relative

### Error Handling

- Use try-catch blocks in controllers
- Return consistent error responses
- Log errors with Winston
- Validate inputs with Zod schemas

### Security Requirements

- Use Helmet for security headers
- Apply CORS configuration
- Hash passwords with bcrypt
- Validate JWT tokens
- Use ArcJet for advanced protection
- Never commit secrets to Git

### Environment Variables

- Use `.env` files for configuration
- Separate environments: development, production
- Required variables: `DATABASE_URL`, JWT secrets
- Use `dotenv/config` for loading

### Database Guidelines

- Use Drizzle ORM for all database operations
- Define schemas in `src/models/`
- Generate migrations with `npm run db:generate`
- Use prepared statements for queries
- Handle database errors gracefully

### API Design

- RESTful endpoint design
- Consistent response format
- Proper HTTP status codes
- Input validation on all endpoints
- Rate limiting and security middleware

### Docker Usage

- Multi-stage builds for production
- Non-root user for security
- Proper layer caching
- Environment-specific compose files

## Testing Guidelines

- Test files in `tests/` directory
- Use Jest testing globals
- Test controllers, services, and utilities
- Mock database interactions
- Validate API responses

## Deployment

- Production: `npm run prod:docker`
- Environment variables via `.env.production`
- Database migrations before deployment
- Health checks and logging enabled

## Dependencies Management

- Lock versions with `package-lock.json`
- Regular security updates
- Separate dev and production dependencies
- Use exact versions for critical packages

## Git Workflow

- Commit staged changes only
- Use conventional commit messages
- Never commit `.env` files
- Keep `.gitignore` updated
- Branch protection for main branch
