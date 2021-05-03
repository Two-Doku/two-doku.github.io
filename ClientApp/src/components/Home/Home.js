import React, { useState } from 'react';
import {
	Button,
	Card,
	Container,
	Divider,
	Image,
	Message,
} from 'semantic-ui-react';
import SudokuBaseEx from 'assets/sudoku_example.jpg';
import SudokuSolutionEx from 'assets/sudoku_example_1.jpg';
import InvitationPopup from './InvitationPopup';
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from 'react-router';
import { useUserContext } from 'contexts/WithUserProfile';

const Introduction = () => {
	const [showModal, setShowModal] = useState(false);
	const history = useHistory();
	const [, , setUserName] = useUserContext();
	const sessionID = uuidv4();
	const initiateGame = (userId) => {
		setUserName(userId);
		history.push(`start/${sessionID}`);
	};
	return (
		<Container>
			<Message size="big">
				<Message.Header>
					<div className="flex justify-between">
						<span className="text-3xl">Rules of Twodoku</span>
						<Button primary size="large" onClick={() => setShowModal(true)}>
							Start Game
						</Button>
					</div>
				</Message.Header>
				<Divider />
				<p>
					It's like Sudoku, but two people work together to solve a single
					puzzle!
				</p>
				<p>
					Sudoku is a number puzzle game played using 81 squares laid out on a
					9×9 grid. The grid is further broken down into 9 3×3 boxes. When you
					start a sudoku puzzle, some of the numbers will have already been
					placed. All you have to do is fill in the missing numbers by following
					some simple rules:
				</p>
				<div className="pl-20">
					<ol className="list-decimal">
						<li>
							Every box must contain each number 1-9. The boxes are 3×3 grids
							and their outlines are marked with thicker line.
						</li>
						<li>Every row must contain each number 1-9</li>
						<li>Every column must contain each number 1-9</li>
					</ol>
				</div>

				<p>
					Each sudoku board has only one solution, which means that each square
					has only one possible correct number. This allows you to use logic to
					find the correct number to place in each square. You can find the
					correct number to write either by eliminating every other number as a
					possibility or by eliminating that number as a possibility in that
					square’s shared row, column, or box.
				</p>
				<p>When you start a puzzle, it will look like something this:</p>
				<Card centered>
					<Image src={SudokuBaseEx} />
					<Card.Content>
						<Card.Description className="text-center">
							Some of the squares have values, your job is to fill in the blank
							squares.
						</Card.Description>
					</Card.Content>
				</Card>

				<p>When solved, the puzzle will look like this:</p>
				<Card centered>
					<Image src={SudokuSolutionEx} />
					<Card.Content>
						<Card.Description className="text-center">
							Notice how every row, column, and box contains every number 1-9.
						</Card.Description>
					</Card.Content>
				</Card>
				<p>
					Sudoku instructions were written by{' '}
					<a href="http://www.sudokubeginner.com/rules-of-sudoku/">
						sudokubeginner.com
					</a>
				</p>
			</Message>
			<InvitationPopup
				open={showModal}
				onClose={() => setShowModal(false)}
				onStart={initiateGame}
				uuid={sessionID}
			/>
		</Container>
	);
};
export default Introduction;
