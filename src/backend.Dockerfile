# 19th may 2025
# Dockerfile.backend
# lohikrme

# Use image of Node 22
FROM node:22

# The working directory inside the container
WORKDIR /usr/src

# Copy the package.jsons to be able to install dependencies
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy (from) (to), basically copy all files of current folder (except dockerignored) to /usr/src
COPY . .

# Sovelluksen portti (ei pakollinen, mutta hyvä dokumentoida)
EXPOSE 3000

# Oletuskomento voidaan yliajaa docker-compose.yamlissa
CMD ["npm", "run", "start"]
