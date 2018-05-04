import { connect } from 'react-redux'
import Uploader from '../components/Uploader'
import { addAttachment, addAttachmentToItem } from '../actions/app'

const mapStateToProps = (state, ownProps) => {
	const { attachments, formData, questions, responses } = state


	return {}
	/*
	return {
		content,
		isCollapsed,
		isPending,
		problemHasQuestions,
		problemText,
		tried
	}
	*/
}

const mapDispatchToProps = (dispatch, ownProps) => {
	let frame
	return {
		onUploadClick: () => {
			if ( frame ) {
				frame.open()
				return
			}

			frame = wp.media({
				title: 'Attach Files',
				button: {
					close: false,
					reset: false,
					text: 'Insert'
				},
				multiple: true,
			});

			// Rename tabs.
			frame.on( 'router:render:browse', function( routerView ) {
				routerView.set({
					upload: {
						text: 'Upload Files',
						priority: 20
					},
					browse: {
						text: 'My Uploaded Files',
						priority: 40
					}
				});
			}, frame )

			frame.views.ready = function() {
				const toolbarView = frame.views.get('.media-frame-toolbar')[0]
				const modal = frame.modal
				const library = frame.library
				let sidebar

				toolbarView.controller.on('select',function() {
					var selected = frame.state().get('selection')

					// Set up alt tag protection.
					let hasAltText = true
					selected.each(function(item){
						if ( ! hasAltText ) {
							return
						}

						hasAltText = 0 !== item.attributes.alt.length
					})

					if ( hasAltText ) {
						// When insert button is clicked, insert shortcode into content.
						selected.map( function( attData ) {
							// Redundant for attachments of saved posts, but needed for non-upload inserts.
							dispatch( addAttachment( attData ) )
							dispatch( addAttachmentToItem( ownProps.formId, ownProps.fieldName, attData ) )
						} )

						toolbarView.$el.find('.alt-tag-warning').remove()
						sidebar.$el.find('label.setting[data-setting="alt"]').removeClass('has-error')

						modal.close()
						frame.reset()
					} else {
						const warning = '<p id="alt-tag-warning" class="alt-tag-warning">You must supply alt text before inserting this image.</p>'
						toolbarView.$el.find('#alt-tag-warning').remove()
						toolbarView.$el.find('.media-toolbar-primary').append(warning)
						sidebar = frame.views.get('.media-frame-content')[0].sidebar
						sidebar.$el.find('label.setting[data-setting="alt"]').addClass('has-error')
					}
				})
			}

			// On successful upload, add new attachment to the `attachments` store.
			var uploaderView = frame.views.get('.media-frame-uploader')[0]
			uploaderView.on('ready', function() {
				uploaderView.uploader.success = function( attData ) {
					dispatch( addAttachment( attData ) )
				}
			})

			frame.open()
		},
	}
}

const UploaderContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Uploader)

export default UploaderContainer
