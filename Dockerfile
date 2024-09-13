# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port 3000 (the default for Next.js)
EXPOSE 3000

# Accept the DATABASE_URL as a build argument
ARG DATABASE_URL

# Make the DATABASE_URL available to Prisma during the build
ENV DATABASE_URL=${DATABASE_URL}

# Run Prisma generate and migration steps with DATABASE_URL set explicitly
RUN DATABASE_URL=${DATABASE_URL} npx prisma generate

CMD DATABASE_URL=${DATABASE_URL} npx prisma migrate deploy && npm run seed && npm run start


