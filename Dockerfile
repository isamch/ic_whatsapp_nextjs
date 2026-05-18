FROM node:20

# Install Chromium and its dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libxss1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Build the Next.js app
RUN npm run build

# Start the application
ENV PORT=8080
EXPOSE 8080

CMD ["npm", "run", "start"]
