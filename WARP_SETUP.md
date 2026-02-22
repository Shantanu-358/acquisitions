# Warp Optimization for Acquisitions Project

This document outlines the Warp terminal optimizations set up for this Node.js/Express API project.

## Quick Setup

1. **Load PowerShell aliases** (for Windows):

   ```powershell
   . .\.warp_aliases.ps1
   ```

2. **Run development setup script**:
   ```powershell
   .\scripts\dev-setup.ps1
   ```

## Available Commands

### Development

- `dev` - Start development server with file watching
- `lint` - Run ESLint
- `lintfix` - Run ESLint with auto-fix
- `format` - Format code with Prettier
- `formatcheck` - Check code formatting

### Database Operations

- `dbgen` - Generate Drizzle migrations
- `dbmigrate` - Run database migrations
- `dbstudio` - Open Drizzle Studio

### Git Workflow

- `gs` - Git status
- `ga` - Git add
- `gc` - Git commit
- `gp` - Git push
- `gl` - Git log (one line)
- `gd` - Git diff

### Navigation Shortcuts

- `srcdir` - Navigate to src directory
- `cdconfig()` - Navigate to src/config
- `cdctrl()` - Navigate to src/controllers
- `cdmodel()` - Navigate to src/models
- `cdroute()` - Navigate to src/routes
- `cdserv()` - Navigate to src/services
- `cdutil()` - Navigate to src/utils
- `cdval()` - Navigate to src/validations

## Project Structure Overview

```
acquisitions/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Express middleware
│   ├── models/         # Drizzle ORM models
│   ├── routes/         # Route definitions
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   ├── validations/    # Zod validation schemas
│   ├── app.js          # Express app setup
│   ├── index.js        # Entry point
│   └── server.js       # Server configuration
├── drizzle/            # Database migrations
├── logs/               # Application logs
└── scripts/            # Development scripts
```

## Workflow Recommendations

### Daily Development

1. `dev` - Start development server
2. Make your changes
3. `check-all` - Run linting and formatting checks
4. `fix-all` - Auto-fix any issues
5. `gs` - Check git status
6. `ga .` - Stage changes
7. `gc -m "Your commit message"` - Commit
8. `gp` - Push to remote

### Database Changes

1. Modify models in `src/models/`
2. `dbgen` - Generate migrations
3. `dbmigrate` - Apply migrations
4. `dbstudio` - Verify changes in Drizzle Studio

## Tips for Warp Usage

1. **Use command history**: Warp's intelligent command history helps with frequently used commands
2. **Command completion**: Take advantage of Warp's auto-completion for file paths and commands
3. **Multiple terminals**: Use Warp's tab feature to manage different tasks (dev server, database, git operations)
4. **Workflows**: Create custom workflows in Warp for common development tasks

## Environment Variables

Make sure to set up your `.env` file with:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (default: 3000)
- Any other project-specific variables

## Troubleshooting

- **PowerShell execution policy**: If scripts don't run, try:

  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

- **Node modules issues**: Run `npm ci` to clean install dependencies

- **Database connection**: Ensure your `.env` file has the correct `DATABASE_URL`

- **Port conflicts**: Change the `PORT` in your `.env` file if the default port is in use
