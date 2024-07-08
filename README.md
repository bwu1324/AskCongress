# AskCongress

## About

Congressional App Challenge 2021 submission. A web application for online discourse with members of Congress.

## Built With

* Node.js
* EJS
* MongoDB


## Running with Docker

### Prerequisites 

* Docker
* Docker Compose

### Building and Running Container

1. Create a copy of `template.env` and name it `.env`
2. Update `.env` configuration
3. Start the container
    ```
    docker compose up -d
    ```
4. Access the application at `localhost:8080`
  
## Developing Locally

### Prerequisites

* Node.js (Tested with Node 18)
* MongoDB server

### Starting the Application

1. Setup a mongoDB server by creating a database with the following collections: `Users`, `Threads`, `Comments`
2. Create an index for the threads collection: `{ title: 'text', body: 'text' }`.
3. Install dependencies
    ```bash
    npm install
    ```
4. Create a copy of `template.env` and name it `.env`
5. Update `.env` configuration
6. Start server
    ```bash
    node run.js
    ```
