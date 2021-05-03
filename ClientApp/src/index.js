import React from 'react';
import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';
import App from 'components/App';
import WithSocketIO from 'contexts/WithSocketContext';
import WithUser from 'contexts/WithUserProfile';
import reportWebVitals from './reportWebVitals';
import 'semantic-ui-css/semantic.min.css';
import './index.css';

const socket = io('http://localhost:4000');

ReactDOM.render(
	<React.StrictMode>
		<WithUser>
			<WithSocketIO socket={socket}>
				<App />
			</WithSocketIO>
		</WithUser>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
