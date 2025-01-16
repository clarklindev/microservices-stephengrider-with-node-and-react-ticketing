# Use an official Node.js image
FROM node:18-alpine
# Install pnpm
RUN npm install -g pnpm
# Set working directory
WORKDIR /app
# Copy package.json and pnpm-lock.yaml (pnpm's lockfile)
COPY package.json pnpm-lock.yaml ./
# Install dependencies with pnpm (OMIT DEV)
RUN pnpm install --prod
# Copy the rest of the application code
COPY . .

# Run the app
CMD ["pnpm", "run", "dev"]