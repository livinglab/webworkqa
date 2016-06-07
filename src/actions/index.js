import fetch from 'isomorphic-fetch'

export const TOGGLE_VOTE = 'TOGGLE_VOTE';
export const toggleVote = (itemId, voteType) => {
	return {
		type: TOGGLE_VOTE,
		payload: {
			itemId,
			voteType
		}
	}
}

export const REQUEST_PROBLEM = 'REQUEST_PROBLEM';
export const requestProblem = (problemId) => {
	return {
		type: REQUEST_PROBLEM,
		problemId
	}
}

export const RECEIVE_PROBLEM = 'RECEIVE_PROBLEM';
export const receiveProblem = (problemId, json) => {
	return {
		type: RECEIVE_PROBLEM,
		problemId,
		problemData: json.problem,
		questions: json.questions,
		questionsById: json.questionsById
	}
}

export function fetchProblem( problemId ) {
	return function ( dispatch ) {
		// Inform app that the request has begun.
		dispatch( requestProblem );

		return fetch( `http://boone.cool/wpmaster/wp-json/webwork/v1/problems/${problemId}`)
			.then( response => response.json() )
			.then( json => dispatch( receiveProblem( problemId, json ) ) )
	}
}
