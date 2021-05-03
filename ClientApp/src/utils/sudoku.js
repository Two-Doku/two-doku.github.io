const getHighlightedIndexSet = (row, col) => {
	const rowSet = Array.from(Array(9)).map((pos, idx) => col - 1 + idx * 9);
	const colSet = Array.from(Array(9)).map((pos, idx) => idx + (row - 1) * 9);
	const boxSet = [];

	return new Set([...rowSet, ...colSet, ...boxSet]);
};
export { getHighlightedIndexSet };
