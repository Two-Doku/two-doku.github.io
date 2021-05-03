import React from 'react';

const optionValues = Array.from(Array(9)).map((_, idx) => idx + 1);

const inputNumStyle =
	'text-4xl sm:text-5xl  text-blue-400 cursor-pointer font-semibold hover:text-blue-700';

const InputSelection = ({ onClick }) => {
	return (
		<div className="flex justify-center">
			<div className="w-5/6 grid grid-cols-9">
				{optionValues.map((val) => (
					<div key={`val_${val}`} className="text-center">
						<span className={inputNumStyle} onClick={() => onClick(val)}>
							{val}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};
export default InputSelection;
