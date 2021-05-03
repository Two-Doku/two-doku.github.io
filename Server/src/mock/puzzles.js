const fs = require('fs');
const parse = require('csv-parse');
const path = require('path');

const inputPath = `${__dirname}/sudoku.csv`;

const getPuzzleRepository = async () => {
	return new Promise((resolve, reject) => {
		const SudokuPuzzles = [];
		fs.createReadStream(inputPath)
			.pipe(parse({ from: 2 }))
			.on('data', (row) =>
				SudokuPuzzles.push({
					puzzle: row[0],
					solution: row[1],
				})
			)
			.on('end', () => resolve(SudokuPuzzles));
	});
};
module.exports = { getPuzzleRepository };
