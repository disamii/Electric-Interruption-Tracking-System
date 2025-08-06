# Use Node image
FROM node:18

# Set work directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build production (optional)
RUN npm run build

# Expose port (adjust if needed)
EXPOSE 3000

# Run dev server (adjust for your project)
CMD ["npm", "start"]
