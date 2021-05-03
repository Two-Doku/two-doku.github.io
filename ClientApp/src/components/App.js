import React, { useState } from 'react';
import classnames from 'classnames';
import { Container, Menu } from 'semantic-ui-react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Introduction from './Home/Home';
import ROUTES from 'constants/routes';
import Twodoku from './Sudoku/Twodoku';

const TabsMetadata = [{ label: 'Home', route: ROUTES.HOME }];
const tabStyles = 'font-sans text-2xl font-light';
const activeTabStyles = 'font-sans text-3xl font-normal';
const App = () => {
	const [activeTab, setActiveTab] = useState(ROUTES.HOME);
	const handleItemClick = (e, { name }) => setActiveTab(name);

	return (
		<Router>
			<Container>
				<Menu pointing secondary>
					{TabsMetadata.map(({ label, route }, idx) => (
						<Link to={`/${route}`} key={`tab_${idx}`}>
							<Menu.Item
								name={route}
								active={activeTab === route}
								onClick={handleItemClick}
							>
								<span
									className={classnames(tabStyles, {
										[activeTabStyles]: activeTab === route,
									})}
								>
									{label}
								</span>
							</Menu.Item>
						</Link>
					))}
				</Menu>

				<Switch>
					<Route path={`/${ROUTES.GAME}/:gameId`}>
						<Twodoku />
					</Route>
					<Route path="/" exact>
						<Introduction />
					</Route>
				</Switch>
			</Container>
		</Router>
	);
};

export default App;
