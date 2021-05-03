import React, { useCallback } from 'react';
import classnames from 'classnames';
import { isNumber, noop } from 'lodash';
import PropTypes from 'prop-types';

const boxStyle =
	'border border-gray-300 cursor-pointer text-center py-2 md:py-7  focus:outline-none';
const hoverStyle = 'hover:bg-green-100';
const horDividerStyle = 'border-l-4';
const verDividerStyle = 'border-t-4';
const highlightStyle = 'bg-blue-100';
const playerOtherHighlightStyle = 'bg-yellow-100';
const playerInputStyle = 'text-green-500';
const invalidStyle = 'text-red-500 bg-pink-100';

const NumberCell = ({
	value,
	row,
	col,
	highlight,
	onHover,
	onClick,
	onKeyPress,
	playerOther,
	original,
	invalid,
}) => {
	const procureEntry = useCallback(
		(val) => {
			const entry = parseInt(val);
			if (isNumber(entry) && entry > 0) {
				onKeyPress(entry);
			}
		},
		[onKeyPress]
	);
	return (
		<div
			className={classnames(`${boxStyle}`, {
				[horDividerStyle]: col % 3 === 1 && col !== 1,
				[verDividerStyle]: row % 3 === 1 && row !== 1,
				[highlightStyle]: highlight && !playerOther && !invalid,
				[playerOtherHighlightStyle]: playerOther && !invalid,
				[playerInputStyle]: !original && !invalid,
				[invalidStyle]: invalid,
				[hoverStyle]: !invalid,
			})}
			onMouseEnter={() => onHover(row, col)}
			onMouseLeave={() => onHover()}
			onClick={() => onClick(row, col)}
			tabIndex="0"
			onKeyPress={({ key }) => procureEntry(key)}
		>
			<div>
				<span className="text-3xl">{value ? value : <br />}</span>
			</div>
		</div>
	);
};
NumberCell.propTypes = {
	value: PropTypes.number.isRequired,
	row: PropTypes.number.isRequired,
	col: PropTypes.number.isRequired,
	highlight: PropTypes.bool,
	onHover: PropTypes.func,
	onClick: PropTypes.func,
	onKeyPress: PropTypes.func,
	playerOther: PropTypes.bool,
	original: PropTypes.bool,
	invalid: PropTypes.bool,
};
NumberCell.defaultProps = {
	onHover: noop,
	onClick: noop,
	onKeyPress: noop,
};
export default NumberCell;
