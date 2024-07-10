# Conference Room Booking Docker Compose Setup

![alt text](/docs//swagger.png 'Title')

This repository contains a Docker Compose setup for Mongo and NestJS app.

## Prerequisites

Before you get started, ensure that you have the following prerequisites installed on your system:

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/erdoganoksuz/conference-room-booking.git
   ```

2. Navigate to the project directory:

   ```bash
   cd conference-room-booking
   ```

3. Build and run the Docker containers using Docker Compose:
   ```bash
   docker-compose -p conference-room-booking-app up --build
   ```
4. Your Conference Room Booking Service will now be accessible:
   - Service: http://localhost:3000
   - Database UI(Mongo Express): http://localhost:8081/
     (username: mexpress password: mexpress)

![alt text](/docs//mongo-express.png 'Title')

## API Documentation (Swagger)

You can access the Swagger API documentation by visiting the following URL:

- Swagger API Documentation: http://localhost:3000/api

## Configuration

The `.env `file in the conference-room-booking folder contains configuration options for the Nest.js application. Update this file to configure database connections, and other environment-specific settings.

## Stopping the Containers

To stop and remove the Docker containers, press Ctrl + C in the terminal where Docker Compose is running, and then run the following command:

```bash
docker-compose down
```

## Documentation

![alt text](/docs//documentation.png 'Title')

This project uses compodoc for documentation.

- Documentation: http://localhost:8080

```bash
# development
$ npm run start

# generate documentation
$ npm run doc
```

## Test

```bash
# install
$ npm run install

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Without Docker Installation

Before installation, ensure MongoDB is installed and that you have correctly set the environment variables in your `.env` file.

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Docker Compose Video

Take a look to `docs` folder for docker compose video.

- https://github.com/erdoganoksuz/conference-room-booking/blob/master/docs/docker-compose.mp4


https://github.com/erdoganoksuz/conference-room-booking/assets/13199681/6909bf52-5a61-497c-b1f1-631482d87e94



## Full Demo Video

Take a look to `docs` folder for full demo video.

- https://github.com/erdoganoksuz/conference-room-booking/blob/master/docs/full-demo.mp4


https://github.com/erdoganoksuz/conference-room-booking/assets/13199681/52ad3f20-3812-4f5e-ba35-d5a66a3fa6e4


