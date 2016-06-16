import React from 'react';
import ScoreDialog from './ScoreDialog';
import ResponseList from './ResponseList';

var Question = React.createClass({
	render: function() {
		const { isCollapsed, handleToggleVote, handleToggleAccordion, itemId, myVote, score } = this.props
		const { title, content } = this.props.question
		const responses = []

		var styles = {
			li: {
				overflow: 'hidden',
				marginBottom: '15px'
			},
			wwQuestionContent: {
				paddingLeft: '50px'
			}
		};

		return (
			<li style={styles.li} className={isCollapsed ? 'question-closed' : 'question-open'}>
				<ScoreDialog
					score={score}
					myVote={myVote}
					itemId={itemId}
					handleToggleVote={handleToggleVote}
				/>

				<div className="ww-question-content" style={styles.wwQuestionContent}>
					{content}

					<ResponseList responses={responses} />
				</div>

				<a
					href="#"
					data-item-id={itemId}
					onClick={ e => { handleToggleAccordion( e.target.dataset.itemId ) } }
				>
					{isCollapsed ? 'Expand' : 'Collapse'}
				</a>
			</li>
		);
	}
});

export default Question
