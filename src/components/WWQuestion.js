import React from 'react';
import WWScoreDialog from './WWScoreDialog';
import WWResponseList from './WWResponseList';
import connectToVoteGetter from './ConnectToVoteGetter'

var WWQuestion = React.createClass({
	render: function() {
		const { title, content } = this.props.question
		const responses = []
		const { score, myvote } = this.props;
		const onVoteChange = function() {}

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
			<li style={styles.li}>
				<WWScoreDialog
					score={score}
					myvote={myvote}
					onVoteChange={onVoteChange}
				/>

				<div className="ww-question-content" style={styles.wwQuestionContent}>
					{content}

					<WWResponseList responses={responses} />
				</div>
			</li>
		);
	}
});


// Make a vote getter.
WWQuestion = connectToVoteGetter( WWQuestion );

export default WWQuestion;
