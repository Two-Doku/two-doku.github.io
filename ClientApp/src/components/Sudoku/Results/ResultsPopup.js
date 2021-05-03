import STATE from 'constants/state';
import React from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';

const GameSuccess = () => {
	return (
		<>
			<Header icon>
				<Icon name="trophy" />
				Well Done!
			</Header>
			<Modal.Content image scrolling>
				<p className="text-center text-xl">
					You completed this Sudoku Puzzle. Would you like to play another game?
				</p>
			</Modal.Content>
		</>
	);
};

const GameFail = () => {
	return (
		<>
			<Header icon>
				<Icon name="handshake outline" />
				Oh no!
			</Header>
			<Modal.Content>
				<p className="text-center text-xl">
					Too many mistakes have been made on this Sudoku Puzzle.
				</p>
				<br />
				<p className="text-center text-xl">
					Would you like to play another game?
				</p>
			</Modal.Content>
		</>
	);
};

const Results = ({ open, state, onExit, onPlayAgain }) => {
	let ResultContent;
	switch (state) {
		case STATE.WIN:
			ResultContent = <GameSuccess />;
			break;
		case STATE.LOSE:
			ResultContent = <GameFail />;
			break;
		default:
			return <></>;
	}
	return (
		<Modal basic open={open} size="small">
			{ResultContent}
			<Modal.Actions>
				<Button basic color="red" inverted onClick={onExit}>
					<Icon name="remove" /> No
				</Button>
				<Button color="green" inverted onClick={onPlayAgain}>
					<Icon name="checkmark" /> Yes
				</Button>
			</Modal.Actions>
		</Modal>
	);
};

export default Results;
