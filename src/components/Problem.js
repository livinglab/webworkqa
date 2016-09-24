import React, { Component } from 'react';
import ProblemStatsContainer from '../containers/ProblemStatsContainer'
import ProblemSummary from '../components/ProblemSummary'
import QuestionFormContainer from '../containers/QuestionFormContainer'
import QuestionSortDropdownContainer from '../containers/QuestionSortDropdownContainer'
import QuestionList from '../components/QuestionList'

export default class Problem extends Component {
	componentWillMount() {
		const { onComponentWillMount } = this.props
		const { problemId } = this.props
		onComponentWillMount( problemId )
	}

	componentDidMount() {
		// This is so amazing it makes me want to wrap up my programming career
		setTimeout( function() {
			if ( ! document.hasOwnProperty( 'webwork_initialized' ) ) {
				document.webwork_scaffold_init()
				document.webwork_initialized = true
			}
		}, 1000 );
	}

	render() {
		const { problems, problemId, questionsById, userCanAskQuestion } = this.props

		const problem = problems[problemId]

		const questionFormElement = userCanAskQuestion ? <QuestionFormContainer problemId={problemId} /> : ''

		let problemTitle = 'Another Math Problem'
		if ( problem && problem.hasOwnProperty( 'problemSet' ) ) {
			problemTitle = 'Problem: ' + problem.problemSet
		}

		return (
			<div className="ww-problem">
				<h2 className="ww-header">{problemTitle}</h2>

				<div className="problem-topmatter">
					<ProblemStatsContainer />
					<ProblemSummary problemId={problemId} problem={problem} />
				</div>

				{questionFormElement}

				<div className="problem-questions">
					<QuestionSortDropdownContainer
					  itemType='problem'
					  problemId={problemId}
					/>
					<QuestionList questionsById={questionsById} />
				</div>
			</div>
		);
	}
}
