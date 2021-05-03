const _ = require('lodash');
const { getIndex } = require('./utils');
const express = require('express');
const app = express();
const httpServer = require('http').Server(app);
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const io = require('socket.io')(httpServer, {
	cors: {
		origin: '*',
	},
});
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const PUZZLES_COUNT = 1000;
const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_KEY
);

const getSession = async (id) => {
	const { data, error } = await supabase
		.from('Sessions')
		.select('*')
		.eq('SessionID', id);
	return _.head(data);
};
const getPuzzle = async (id) => {
	const { data: Puzzles } = await supabase
		.from('Puzzles')
		.select('*')
		.eq('PuzzleID', id);
	return _.head(Puzzles);
};
const setupExpress = () => {
	app.use(cors());
	app.get('/puzzle/:id', async (req, res) => {
		const sessionID = req.params.id;
		const currentSession = await getSession(sessionID);
		let puzzle, state;
		if (!currentSession) {
			const randomIndex = Math.floor(Math.random() * PUZZLES_COUNT);
			const { Original } = await getPuzzle(randomIndex);
			await supabase.from('Sessions').insert([
				{
					SessionID: sessionID,
					PuzzleID: randomIndex,
					State: [...Original].map((value) => ({
						value,
						isValid: true,
					})),
				},
			]);

			puzzle = [...Original];
			state = [...Original].map((value) => ({
				value,
				isValid: true,
			}));
		} else {
			const { PuzzleID, State } = currentSession;
			const { Original } = await getPuzzle(PuzzleID);
			puzzle = [...Original];
			state = [...State];
		}

		res.send({ puzzle, state });
	});

	httpServer.listen(4000, () => {
		console.log('listening on *:4000');
	});
};

const UserInteractions = (socket) => {
	socket.on('cell-position', (position) => {
		const { userID, row, col, sessionID } = JSON.parse(position);

		io.to(sessionID).emit('cell-position', { userID, row, col });
	});
	socket.on('cell-populate', async (info) => {
		const { userID, row, col, value, sessionID } = JSON.parse(info);

		const { PuzzleID, State } = await getSession(sessionID);
		const { Solution } = await getPuzzle(PuzzleID);

		const selectedIndex = getIndex(row, col);

		const isValid =
			Solution[selectedIndex] === value || Solution[selectedIndex] === 0;

		let stagingSet = [...State];
		stagingSet[selectedIndex] = { value: value, isValid };

		const gameWin =
			JSON.stringify(Solution) ===
			JSON.stringify([...stagingSet].map(({ value }) => value));

		io.to(sessionID).emit('cell-populate', {
			userID,
			row,
			col,
			value,
			valid: isValid,
			gameWin,
		});
		await supabase
			.from('Sessions')
			.update({ State: stagingSet })
			.eq('SessionID', sessionID);
	});
};
const PuzzleManagement = (socket) => {
	socket.on('join-game', (info) => {
		const { userID, sessionID } = JSON.parse(info);
		socket.join(sessionID);
	});
};
const startServer = () => {
	io.on('connection', (socket) => {
		console.log('a user connected');

		UserInteractions(socket);
		PuzzleManagement(socket);

		socket.on('disconnect', () => {
			console.log('a user disconnected');
		});
	});
};

const init = () => {
	setupExpress();
	startServer();
};

init();
