# Player Activity Tracker - Node.js + PostgreSQL + Docker

This project tracks players, the games they play and their scores using a PostgreSQL database,
served with a Node.js/Express backend and managed through Docker and pgAdmin.

## Technologies Used

- **Node.js** + **Express.js** (API Server)
- **PostgreSQL** (Relational Database)
- **Docker** (Environment and Container Management)
- **pgAdmin 4** (Database GUI)
- **SQL** (Schema, seed data, and queries)
- **VS Code** + **SQLTools** (Query and dev)

## Project Structure

| File                  | Purpose
|-----------------------|------------------------------------------
| `docker-compose.yml`  | Defines the Postgres database and pgAdmin containers.
| `index.js`            | Initializes the Express.js server and sets up the API routes with queries.
| `schema.sql`          | SQL file to create the database tables.
| `seed.sql`            | SQL file to insert test data.
| `README.md`           | This documention!

## API Endpoints

| Method                | Endpoint              | Description
|-----------------------|-----------------------|--------------------------------
| Get                   | /playerscores         | Lists players, games they played, and their scores
| Get                   | /top3                 | Lists the top 3 players by total score
| Get                   | /nogame               | Lists any player that has not played any game
| Get                   | /populargenres        | Lists the genres in descending order of popularity
| Get                   | /newplayers           | Lists players that have joined in the last 5 years
| Get                   | /favouritegames       | Lists the most popular game for each player