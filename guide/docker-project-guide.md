# Guide to create Node.js backend and MySQL database with docker

## The complete process in a nutshell
To create a backend software from the beginning, one should follow next steps:
1. Database can be installed locally on pc or by using Docker. In this example, I will first make a `compose.yaml` file and run it only to make a database, and later enlarge the compose file to also contain the Node application.
2. The code of application must be made first. The development is not done inside a container. When code is updated, a new container must be made and old one deleted.
3. After application is ready to start running, update the `compose.yaml` file to also contain the Node application.
4. Please note that we could also do the development with separate Dockerfiles. But using compose is more common in the industry. The benefitg of separate Dockerfiles would be that we could clearly make a separate database and a separate Node application or any other application. Personally I favor separate files at least for the initial development phase, and just connecting the separate containers into same Docker network, but for this demo project I will immediately use the `compose.yaml` file.

## Step 1: creating the database using `compose.yaml`
- At this first phase, I will create a simple MySQL database using `compose.yaml`. 
- image will select the latest mysql version
- giving the container a name helps to access it via command panel
- environment defines the environmental variables
- ports are used so that the first port is host machine, the second port is
  inside the container
- volume defines a permanent storage for data
- and the docker-entrypoint-initdb command runs the `database.sql` file allowing to create needed tables automatically for the container
- here is `database.sql` content:
  
```sql
# database.sql
CREATE TABLE Parrots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    species VARCHAR(50),
    name VARCHAR(50),
    age int,
    illness VARCHAR(50),
    favorite_food VARCHAR(100)
);
```

- and here is the `compose.yaml` file content so far:
  
```yaml
# compose.yaml
services:
  db:
    image: mysql:latest
    container_name: parrots_db_container
    environment:
      MYSQL_ROOT_PASSWORD: P0llyWantsCracker
      MYSQL_DATABASE: parrots_db
      MYSQL_USER: user
      MYSQL_PASSWORD: Kraak12345
    ports:
      - "3333:3306"
    volumes: 
      - parrots_db_data:/var/lib/mysql
      - ./db/database.sql:/docker-entrypoint-initdb.d/database.sql

volumes:
  parrots_db_data:
```

- Now we go to see inside the docker whether the datatable has been created (use command panel that can be in interactive mode, e.g windows cmd rather than git bash):

<img src="./images/dockerexec-1.png" alt="container in interactive state 1" width="550"><br>
<img src="./images/dockerexec-2.png" alt="container in interactive state 2" width="450"><br>
<img src="./images/dockerexec-3.png" alt="container in interactive state 3" width="500">

## Step 2: installing Node to system
- The system must have Node installed.
- Node is a library that allows running javascript in the backend.
- It also contains the npm, which is a package manager system.
- For this project I use Node version 22.11 LTS, but other 22 is also ok
- https://nodejs.org/en/download/

## Step 3: installing Node dependencies
- This demo backend is quite simple. It has connection to MySQL database, and CRUD operators for parrots.
- To create the backend, start by going with git bash command panel to a suitable folder. Make sure to use a separate and clearly named folder. Then run following commands:
  - `npm init -y`
  - `npm install express mysql dotenv nodemon helmet`
- express is a lightweight backend, mysql library is needed to support mysql
- dotenv allows using .env file to store data
- nodemon makes development easier by restarting service every time code is changed
- helmet is easy middleware to increase safety

<img src="./images/installdependencies.png" alt="installing Node dependencies" width="550"> 

## Step 4: basic CRUD backend application with database connection
The application will follow typical folder structure of:
- `src/db/dbconfig.js` (connection to database)
- `src/db/parrots.js` (services to handle parrots datatable)
- `src/index.js` (the main express application for backend endpoints)

The dbconfig will be done using "Pool" of mysql2 library. The pool allows multiple simultaneous connections, ensuring scalability. [Source: https://www.geeksforgeeks.org/how-to-connect-to-a-mysql-database-using-the-mysql2-package-in-node-js/](https://www.geeksforgeeks.org/how-to-connect-to-a-mysql-database-using-the-mysql2-package-in-node-js/)
  
<img src="./images/image.png" alt="installing Node dependencies" width="350"> 
<img src="./images/image-1.png" alt="installing Node dependencies" width="350"> 
- 

## Step 5: container for backend application
- We must create a suitable Dockerfile that contains a lightweight Node image
- And then also update the `compose.yaml` file, so that it will use for example the environmental variables
- To not install dependencies twice (straight from file tree and via npm install), use a `.dockerignore` file:

```
# .dockerignore
node_modules
```

- Next here is example `backend.Dockerfile` that contains node22 image:

```bash
# backend.Dockerfile

# Use image of Node 22
FROM node:22

# The working directory inside the container
WORKDIR /usr/src

# Copy the package.jsons to be able to install dependencies
COPY package*.json ./

# Install the dependencies
RUn npm install

# Copy (from) (to), basically copy all files of current folder (except
dockerignored) to /usr/src
COPY . .

# Port
EXPOSE 3000

# This can be overridden in compose.yaml
CMD ["npm", "run", "start"]
```

- And here is the updated part of `compose.yaml` file:
  
```yaml
    ports:
      - "3333:3306"
    volumes:
      - parrots_db_data:/var/lib/mysql
      - ./db/database.sql:/docker-entrypoint-initdb.d/database.sql

api:
  build:
    context: .
    dockerfile: backend.Dockerfile
  container_name: parrots_api_container
  ports:
    - "3000:3000"
  depends_on:
    - db
  env_file:
    - .env
  working_dir: /usr/src
  command: ["npm", "run", "start"]

volumes:
  parrots_db_data:
```

## Step 6: test the functionality of both containers simultaneously
To test the functionality, we simply run both containers, and make sure no local instances are run the same time, and then if we can with e.g Postman make successful requests to the backend application which will update the database, it was successful
