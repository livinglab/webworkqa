import React, { Component } from 'react';
import QuestionListItemContainer from '../containers/QuestionListItemContainer.js'

export default class QuestionList extends Component {
	componentWillMount() {
		const { onComponentWillMount } = this.props
		onComponentWillMount()
	}

	render() {
		const { questionIds } = this.props

		let listItems = []
		questionIds.forEach( function( questionId ) {
			listItems.push(
			  <QuestionListItemContainer
			    questionId={questionId}
			    key={questionId}
			  />
			)
		} )

		return (
			<ul className="question-list">
				{listItems}
			</ul>
		)
	}
}