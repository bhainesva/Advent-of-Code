import { load } from "./helpers.js";
import R from 'ramda';

const evl = (calls, board) => {
	for (let i = 0; i < calls.length; i++) {
		const call = calls[i];
		for (let r = 0; r < board.length; r++) {
			board[r] = board[r].map(x => x === call ? 0-x : x)
		}

		if (winning(board)) return {turn: i, score: score(board) * call}
	}

	return {turn: -1, score: 0}
}

const score = board => {
	const s = board.flat().filter(x => x > 0).reduce((tot, val) => tot + val, 0)
	return s
}

const winning = (board) => {
	for (const row of board) {
		if (R.all(x => x < 0, row)) {
			return true
		}
	}

	for (let col = 0; col < board[0].length; col++) {
		if (R.all(x => x < 0, getCol(col, board))) {
			return true
		}
	}

	return false;
}

const getCol = (i, board) => {
	return board.map((v) => v[i]);
}

const run = (arr) => {
	const draws = arr[0].split(',').map(Number);
	let minTurn = -1;
	let bestScore = 0;
	for (let i = 1; i < arr.length; i++) {
		const board = arr[i].trim().split('\n').map(x => x.trim().split(/\s+/).map(Number))
		const s = evl(draws, board);
		if (minTurn === -1 || s.turn < minTurn) {
			minTurn = s.turn;
			bestScore = s.score;
		}
	}

	return bestScore;
}

load("4.txt", '\n\n')
	.then(run)
	.then(console.log);