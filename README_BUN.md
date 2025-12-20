# Bun Setup and Usage Guide

This project uses Bun as the JavaScript runtime instead of Node.js. Here's how to work with this project using Bun.

## Prerequisites

1. Install Bun: https://bun.sh/docs/installation

## Getting Started

1. Install dependencies:
   ```bash
   bun install
   ```

2. Add new dependencies:
   ```bash
   bun add package-name
   ```

3. Run the development server:
   ```bash
   bun dev
   ```

4. Build for production:
   ```bash
   bun run build
   ```

5. Start production server:
   ```bash
   bun start
   ```

## Bun Advantages in This Project

1. **Faster Startup**: The Next.js development server starts significantly faster with Bun
2. **Better Performance**: Bun's JavaScriptCore engine offers better performance for server-side operations
3. **Built-in TypeScript Support**: No need for separate TypeScript compilation step
4. **Improved I/O**: Database operations and file system operations are more efficient
5. **Single Runtime**: Bun handles both the runtime and package manager, reducing complexity

## Working with Authentication

When implementing the authentication system described in `AUTHENTICATION_IMPLEMENTATION.md`:

1. Install dependencies with Bun:
   ```bash
   bun add bcryptjs jsonwebtoken mysql2
   ```

2. Run development server:
   ```bash
   bun dev
   ```

3. The application will be available at http://localhost:3000

## Troubleshooting

If you encounter any issues:

1. Make sure you're using Bun commands instead of npm/yarn
2. Clear Bun's cache if needed:
   ```bash
   bun pm cache rm
   ```
3. Reinstall dependencies:
   ```bash
   rm -rf node_modules .next
   bun install
   ```