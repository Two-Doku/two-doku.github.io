import React, { useCallback, useEffect, useState } from 'react';
import Cell from 'components/Sudoku/Cell';
import { useSocketContext } from 'contexts/WithSocketContext';
import { useUserContext } from 'contexts/WithUserProfile';
import { isEmpty, isNil } from 'lodash-es';
import { getHighlightedIndexSet } from 'utils/sudoku';
import InputSelection from 'components/Sudoku/InputSelection';
import { Divider } from 'semantic-ui-react';
import Results from './Results/ResultsPopup';
import STATE from 'constants/state';
import { useHistory } from 'react-router';
import ROUTES from 'constants/routes';
import { v4 as uuidv4 } from 'uuid';

const MISTAKE_MAX = 6;
const Grid = ({ id, originalSet, currentState }) => {
	const [puzzleSet, setPuzzleSet] = useState([]);
	const [currentTile, setCurrentTile] = useState([]);
	const [mistakeCount, setMistakeCount] = useState(0);
	const [gameState, setGameState] = useState(STATE.PROGRESS);
	const [socket] = useSocketContext();
	const [userID] = useUserContext();
	const history = useHistory();
	useEffect(() => {
		setPuzzleSet(
			[...currentState].map(({ value, isValid }, i) => ({
				value,
				isOriginal: originalSet[i] > 0,
				isValid,
			}))
		);
	}, [originalSet, currentState]);

	useEffect(() => {
		socket.on('cell-position', (receivedData) => {
			const {
				userID: serverUser,
				row: serverRow,
				col: serverCol,
			} = receivedData;

			if (serverUser !== userID) {
				const currentIndex = (serverRow - 1) * 9 + (serverCol - 1);
				setPuzzleSet((puzzle) => {
					return puzzle.map((cell, idx) => ({
						...cell,
						playerOther: currentIndex === idx,
					}));
				});
			}
		});
		socket.on('cell-populate', (receivedData) => {
			const {
				userID: serverUser,
				row: serverRow,
				col: serverCol,
				value: serverValue,
				valid,
				gameWin,
			} = receivedData;
			const currentIndex = (serverRow - 1) * 9 + (serverCol - 1);
			if (gameWin) {
				setGameState(STATE.WIN);
			}
			if (!valid && serverUser === userID) {
				setMistakeCount((count) => count + 1);
			}
			setPuzzleSet((puzzle) => {
				const cpy = [...puzzle];
				cpy[currentIndex]['value'] = serverValue;
				cpy[currentIndex]['isValid'] = valid;
				return cpy;
			});
		});
	}, [userID, socket]);
	useEffect(() => {
		if (mistakeCount >= MISTAKE_MAX) {
			setGameState(STATE.LOSE);
		}
	}, [mistakeCount]);
	useEffect(() => {
		if (!isEmpty(currentTile)) {
			const [row, col] = currentTile;
			const highlightSet = getHighlightedIndexSet(row, col);
			const currentIdx = (row - 1) * 9 + (col - 1);
			setPuzzleSet((puzzle) =>
				puzzle.map((tile, idx) => ({
					...tile,
					highlight: highlightSet.has(idx) && idx !== currentIdx,
				}))
			);
		} else {
			setPuzzleSet((puzzle) =>
				puzzle.map((tile, idx) => ({
					...tile,
					highlight: false,
				}))
			);
		}
	}, [currentTile]);
	const handleCellClick = useCallback(
		(row, col) => {
			if (isNil(row) && isNil(col)) {
				setCurrentTile([]);
				return;
			}
			socket.emit(
				'cell-position',
				JSON.stringify({ userID, row, col, sessionID: id })
			);
			setCurrentTile(() => [row, col]);
		},
		[socket, userID, id]
	);

	const handleValueSelect = useCallback(
		(value) => {
			const [row, col] = currentTile;
			if (isEmpty(currentTile)) return;

			const currentIndex = (row - 1) * 9 + (col - 1);
			if (
				puzzleSet[currentIndex]['isOriginal'] ||
				puzzleSet[currentIndex]['value'] === value
			)
				return;
			setPuzzleSet((puzzle) => {
				const cpy = [...puzzle];
				cpy[currentIndex]['value'] = value;
				return cpy;
			});
			socket.emit(
				'cell-populate',
				JSON.stringify({ userID, row, col, value, sessionID: id })
			);
		},
		[currentTile, puzzleSet, socket, userID, id]
	);

	const handleExit = () => {
		history.push(`/${ROUTES.HOME}`);
	};
	const handlePlayAgain = () => {
		setGameState(STATE.PROGRESS);
		setMistakeCount(0);
		history.push(`/${ROUTES.GAME}/${uuidv4()}`);
	};
	return (
		<>
			<div className="flex justify-start mb-3">
				<span className="text-xl font-semibold bg-red-100 px-2 py-1 text-red-800">
					Mistake Count: {mistakeCount}/{MISTAKE_MAX}
				</span>
			</div>
			<InputSelection onClick={handleValueSelect} />
			<Divider />

			{/* Sudoku Board */}
			<div className="flex justify-center">
				<div className=" w-5/6 grid grid-cols-9 px-10">
					{puzzleSet.map(
						({ value, highlight, playerOther, isOriginal, isValid }, idx) => (
							<Cell
								key={`Tile_${idx}`}
								value={value}
								row={Math.floor(idx / 9) + 1}
								col={(idx % 9) + 1}
								highlight={highlight}
								onClick={handleCellClick}
								onKeyPress={handleValueSelect}
								playerOther={playerOther}
								original={isOriginal}
								invalid={!isValid}
							/>
						)
					)}
				</div>
			</div>
			<Results
				open
				state={gameState}
				onExit={handleExit}
				onPlayAgain={handlePlayAgain}
			/>
		</>
	);
};
export default Grid;
