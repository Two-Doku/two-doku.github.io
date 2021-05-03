import { useSocketContext } from 'contexts/WithSocketContext';
import { useUserContext } from 'contexts/WithUserProfile';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Header } from 'semantic-ui-react';
import Grid from './Grid';
import LoadingOverlay from 'components/Common/LoadingOverlay';
import InvitationPopup from 'components/Home/InvitationPopup';
import { isEmpty } from 'lodash';

const Twodoku = () => {
	const [data, setData] = useState({ puzzle: [], state: [] });
	const [userID, userName, setUserName] = useUserContext();
	const [showModal, setShowModal] = useState(isEmpty(userName));
	const [loading, setLoading] = useState(true);
	const { gameId: sessionID } = useParams();
	const [socket] = useSocketContext();

	useEffect(() => {
		fetch(`http://localhost:4000/puzzle/${sessionID}`)
			.then((response) => response.json())
			.then(({ puzzle: puzzleSet, state: puzzleState }) => {
				setData({
					puzzle: puzzleSet,
					state: puzzleState,
				});
				setLoading(false);
			});
		socket.emit('join-game', JSON.stringify({ userID, sessionID }));
	}, [socket, sessionID, userID]);
	return (
		<>
			<InvitationPopup
				open={showModal}
				onClose={() => setShowModal(false)}
				onStart={(user) => {
					setUserName(user);
					setShowModal(false);
				}}
				disableClose
				uuid={sessionID}
			/>
			{loading && <LoadingOverlay size={'large'} />}
			<div className="flex justify-between">
				<Header as="h1">Welcome to Twodoku</Header>
				<div>
					<span className="text-xl font-bold bg-purple-600 text-white px-2 py-1 rounded-lg">
						{userName}
					</span>
				</div>
			</div>

			<Grid
				originalSet={data.puzzle}
				currentState={data.state}
				id={sessionID}
			/>
		</>
	);
};
export default Twodoku;
