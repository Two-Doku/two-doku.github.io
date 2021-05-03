import React, { useContext } from 'react';

const SocketContext = React.createContext();
const useSocketContext = () => {
	const value = useContext(SocketContext);
	return value;
};
const WithSocketIO = ({ socket, children }) => {
	return (
		<SocketContext.Provider value={[socket]}>{children}</SocketContext.Provider>
	);
};

export { WithSocketIO as default, useSocketContext };
