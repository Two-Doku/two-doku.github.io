import { isEmpty } from 'lodash';
import React, { useState, useRef } from 'react';
import classnames from 'classnames';
import { Icon, Modal } from 'semantic-ui-react';

const baseButtonStyle =
	'p-2 px-6 border rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 mr-3';
const closeButtonStyle =
	'bg-red-400 hover:bg-red-500 focus:ring-red-500 text-white';
const startButtonStyle =
	'bg-blue-400 hover:bg-blue-500 focus:ring-blue-500 text-white';
const disabledButtonStyle = 'bg-gray-200 text-gray-500';
const inputSyle =
	'px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-md border-0 shadow outline-none focus:outline-none focus:ring w-full mr-4';

const copyText = ({ current }) => {
	current.select();
	current.setSelectionRange(0, 99999);
	document.execCommand('copy');
};
const InvitationPopup = ({ open, onClose, onStart, uuid, disableClose }) => {
	const [username, setUsername] = useState('');
	const inviteUrlInputRef = useRef();
	return (
		<Modal
			dimmer={'blurring'}
			open={open}
			closeOnEscape={!disableClose}
			closeOnDimmerClick={!disableClose}
			onClose={onClose}
			size="small"
			centered
		>
			<Modal.Header>Send your partner the URL to this page:</Modal.Header>
			<Modal.Content>
				<div>
					<div className="mb-3 pt-0">
						<label className="block uppercase text-blueGray-600 text-sm font-bold mb-2">
							URL (Copy this)
						</label>
						<div className="flex justify-between">
							<input
								id="inviteURL"
								ref={inviteUrlInputRef}
								type="text"
								placeholder="URL"
								className={inputSyle}
								readOnly="readonly"
								value={`${window.location}start/${uuid}`}
							/>
							<div className="flex justify-center py-2">
								<Icon
									onClick={() => copyText(inviteUrlInputRef)}
									name="copy outline"
									size="large"
									className="cursor-pointer hover:text-blue-300"
								/>
							</div>
						</div>
					</div>
					<div className="mb-3 pt-0">
						<label className="block uppercase text-blueGray-600 text-sm font-bold mb-2">
							Username
						</label>
						<input
							type="text"
							placeholder="Username"
							className={inputSyle}
							value={username}
							onChange={({ target }) => setUsername(target.value)}
						/>
					</div>
				</div>
			</Modal.Content>
			<Modal.Actions>
				<div className="pb-2">
					<button
						className={classnames(`${closeButtonStyle} ${baseButtonStyle}`, {
							hidden: disableClose,
						})}
						onClick={onClose}
					>
						Close
					</button>
					<button
						className={classnames(`${baseButtonStyle}`, {
							[startButtonStyle]: !isEmpty(username),
							[disabledButtonStyle]: isEmpty(username),
						})}
						onClick={() => onStart(username)}
						disabled={isEmpty(username)}
					>
						Start
					</button>
				</div>
			</Modal.Actions>
		</Modal>
	);
};
export default InvitationPopup;
