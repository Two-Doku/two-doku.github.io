import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

const LoadingOverlay = ({ text, size }) => {
	return (
		<Dimmer active inverted>
			<Loader size={size} inverted>
				{text}
			</Loader>
		</Dimmer>
	);
};
LoadingOverlay.defaultProps = {
	text: 'Loading',
	size: 'medium',
};
export default LoadingOverlay;
