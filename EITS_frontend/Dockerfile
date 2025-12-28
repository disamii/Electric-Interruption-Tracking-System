FROM node:18
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (do NOT skip optional for esbuild)
RUN npm install

# Install Rollup binary if needed
RUN npm install @rollup/rollup-linux-x64-gnu

# Copy project files
COPY . .

# Build production
RUN npm run build

# Expose Vite port
EXPOSE 5173

# Run dev server
CMD ["npm", "run", "dev"]
