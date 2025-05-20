# Installation guide for this project

- You can clone this project in git bash command panel by going to suitable folder (cd command, pwd command, ls command), then:
- git clone https://github.com/lohikrme/docker-express-backend

- After that assuming you want the project to run as a container, open the src folder with command panel and run
- docker-compose up

- That will automatically build the containers u need (database and node application), install dependencies with npm install, and also, copy the source code into the containers. You can turn off the containers with e.g docker-compose down or in git bash control + C.

- If you make changes to the containers, remember to rebuild them with:
- docker-compose up --build

- This will add the changes as new "layers" to the containers.
