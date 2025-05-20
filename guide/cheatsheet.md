# Docker Cheatsheet

## Container Management

| **Command**               | **Action**                                |
| ---                       | ---                                       |
| `docker ps`               | show all running containers               |
| `docker ps -a`    | show all containers               |
| `docker logs CONTAINER` | show log information of a container  |
| `docker stop CONTAINER`  | stop a running container  |
| `docker start CONTAINER`  | start an existing container  |
| `docker restart CONTAINER`  | restart a running container  |
| `docker rm CONTAINER`  | delete a container  |
| `docker inspect CONTAINER`  | show detailed informatin about a container  |
| `docker exec -it CONTAINER COMMAND`  | execute a command inside a running container  |
| `docker cp CONTAINER:PATH .`  | copy a file from container to current directory on host |
| `docker stats`  | display real-time resource usage of running containers  |

`CONTAINER` can be a container's ID or name.

## Image Management

| **Command**               | **Action**                                |
| ---                       | ---                                       |
| `docker images`  | show existing images  |
| `docker pull IMAGE`  | download an image from Docker Hub  |
| `docker rmi IMAGE`  | delete an image  |
| `docker build -t IMAGE`  | create a new image from current directory  |

`IMAGE` is an image's name, such as `mysql`.

## Network Management

| **Command**               | **Action**                                |
| ---                       | ---                                       |
| `docker network create NETWORK`  | create a new Docker network  |
| `docker network ls`  | list all networks   |
| `docker network inspect NETWORK`  | show detailed information about a network  |
| `docker network rm NETWORK`  | delete a Docker network  |
| `docker run -d --network NETWORK --name CONTAINER IMAGE` | create a new container from IMAGE, assign it a name and a network, and start in the background  |

`NETWORK` is a network's name.

## Volume Management

| **Command**               | **Action**                                |
| ---                       | ---                                       |
| `docker volume create VOLUME`  | create a new volume  |
| `docker volume ls`  | list all existing volumes  |
| `docker volume inspect VOLUME`  | show detailed information about a volume  |
| `docker volume rm VOLUME`  | delete a volume  |

`VOLUME` is a volume's name.

## Docker Compose

| **Command**               | **Action**                                |
| ---                       | ---                                       |
| `docker compose up` | build, (re)create, start, and attach to all containers of the service  |
| `docker compose up -d` | as above, but start in the background  |
| `docker compose start` | start existing containers  |
| `docker compose stop` | stop running containers (when running in the background)  |
| `docker compose ps -a` | list all containers  |
| `docker compose rm` | remove stopped containers    |
| `docker compose down` | stop containers, remove containers and networks   |
