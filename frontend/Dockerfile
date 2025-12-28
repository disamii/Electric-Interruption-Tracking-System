# Use Node official image for dev
FROM node:22.14.0

WORKDIR /app
# Inside Dockerfile before npm install
RUN rm -rf node_modules 

# Copy package files and install deps
COPY package.json  ./
RUN npm install --legacy-peer-deps

# Copy all source code
COPY . /app

# Expose Vite dev server port
EXPOSE 5173

# Start the Vite dev server (npm run dev)
CMD ["npm", "run", "dev"]
