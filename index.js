import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const { Pool } = pg;
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Middleware to parse JSON bodies
app.use(express.json());

// Query which lists all players
app.get('/players', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM players');
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);        
    }
});

// Query which lists all players with the games they have played as well as their scores.
app.get('/playerscores', async (req, res) => {
    try {
        const query = `
        SELECT
            players.name AS player_name,
            games.title AS game_title,
            scores.score
        FROM scores
        INNER JOIN players ON scores.player_id = players.id
        INNER JOIN games ON scores.game_id = games.id
        ORDER BY players.name, games.title;
        `;  

        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

// Query which lists the top 3 scorers across all games.
app.get('/top3', async (req, res) => {
    try {
        const query = `
        SELECT
            players.name AS player_name,
            SUM(scores.score) AS total_score
        FROM scores
        INNER JOIN players ON scores.player_id = players.id
        GROUP BY players.name
        ORDER BY total_score DESC
        LIMIT 3;
        `;

        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Query which lists any player who has not played any game.
app.get('/nogame', async (req, res) => {
    try {
        const query = `
        SELECT
            players.name AS player_name
        FROM players
        LEFT JOIN scores ON players.id = scores.player_id
        WHERE scores.player_id IS NULL;
        `;

        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Query which lists the most popular genres among all players in descending order.
app.get('/populargenres', async (req, res) => {
    try {
        const query = `
        SELECT
            games.genre AS game_genre,
            COUNT(scores.id) AS times_played
        FROM scores
        INNER JOIN games ON scores.game_id = games.id
        GROUP BY games.genre
        ORDER BY times_played DESC;
        `;

        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Query which selects all players who have joined in the last 5 years.
app.get('/newplayers', async (req, res) => {
    try {
        const query = `
        SELECT
            name,
            join_date
        FROM players
        WHERE join_date >= (CURRENT_DATE - INTERVAL '5 years');
        `;

        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Query which lists the most popular game for each player.
app.get('/favouritegames', async(req, res) => {
    try {
        const query = `
        SELECT
            player_name,
            game_title,
            play_count
        FROM (
            SELECT 
            players.name AS player_name,
            games.title AS game_title,
            COUNT(*) AS play_count,
            ROW_NUMBER() OVER (
                PARTITION BY players.id
                ORDER BY COUNT(*) DESC
            ) AS rank
        FROM scores
        INNER JOIN players ON scores.player_id = players.id
        INNER JOIN games ON scores.game_id = games.id
        GROUP BY players.id, games.id, players.name, games.title
        ) AS ranked_games
         WHERE rank = 1;
        `;

        const result = await pool.query(query);
        res.json(result.rows)
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.listen(3000, (req, res) => {
    console.log("Server is running on port 3000.")
})