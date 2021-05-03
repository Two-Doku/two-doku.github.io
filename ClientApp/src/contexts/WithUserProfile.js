import React, { useContext, useState } from 'react';

const UserContext = React.createContext();
const useUserContext = () => {
	const value = useContext(UserContext);
	return value;
};
const WithUser = ({ children }) => {
	const [userName, setUserName] = useState(null);
	const userID = Math.floor(Math.random() * 100);
	return (
		<UserContext.Provider value={[userID, userName, setUserName]}>
			{children}
		</UserContext.Provider>
	);
};

export { WithUser as default, useUserContext };
