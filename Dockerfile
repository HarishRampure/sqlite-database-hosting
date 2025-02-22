# ---- 1) Builder Stage ----
    FROM node:18 AS builder

    # Set the working directory
    WORKDIR /app
    
    # Copy package.json and package-lock.json (if present)
    COPY package*.json ./
    
    # Install all dependencies (using npm ci if you have a package-lock.json)
    # This ensures reproducible installs and is typically faster
    RUN npm ci
    
    # Copy the entire application code
    COPY . .
    
    # Build the Next.js application
    RUN npm run build
    
    
    # ---- 2) Production Stage ----
    FROM node:18 AS production
    
    # Set the working directory
    WORKDIR /app
    
    # Copy package.json (and lock file if needed)
    COPY --from=builder /app/package*.json ./
    
    # Copy node_modules from builder (so we don’t reinstall in production)
    COPY --from=builder /app/node_modules ./node_modules
    
    # Copy only the necessary files/folders for running the app
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/src ./src
    COPY --from=builder /app/next.config.ts ./next.config.ts
    COPY --from=builder /app/tailwind.config.ts ./tailwind.config.ts
    COPY --from=builder /app/postcss.config.mjs ./postcss.config.mjs
    
    # (Optional) If you prefer to run in 'production' mode inside the container
    ENV NODE_ENV=production
    
    # Expose the desired port
    EXPOSE 3000
    
    # Launch Next.js in production mode
    CMD ["npm", "run", "start"]
    