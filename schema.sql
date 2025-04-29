CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    join_date DATE
);

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    genre VARCHAR(50) NOT NULL
);

CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    player_id INT NOT NULL REFERENCES players(id),
    game_id INT NOT NULL REFERENCES games(id),
    score INT NOT NULL,
    date_played DATE NOT NULL
);