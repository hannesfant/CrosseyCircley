const express = require('express');
const ejs = require('ejs');
const app = express();
const game = require('./lib/game')
const port = 8000;

let cur_game = 0

app.set('view engine', 'ejs');

app.get('/game', (req, res) => {
	let q = req.query;
	const gameData = game.getGame(q.game)

	if (!gameData) return res.send('Game not found<br><button onclick="location.href=\'/\'" type="button">Home</button>')

	let boardColor
	if (gameData.won == q.player) boardColor = 'green'
	else if (gameData.won == -1) boardColor = 'grey'
	else boardColor = 'red'

	let data = Object.assign(gameData, {
		player: q.player,
		game: q.game,
		boardColor
	});

	res.render('game', data);
});

app.get('/move', (req, res) => {
	let q = req.query;

	game.calculateLogic(q.game, q.player, q.i, q.j)

	res.redirect(`../game/?game=${q.game}&player=${q.player}`);
});

app.get('/', (req, res) => {
	res.render('index', {
		games: Object.keys(game.getGames())
	});
});

app.get('/new-game', (req, res, next) => {
	newId = cur_game++;
	game.createGame(newId)
	res.redirect(`game/?game=${newId}&player=0`);
});

app.listen(port, () => {
	console.log('Running...');
});