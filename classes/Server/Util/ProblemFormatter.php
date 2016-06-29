<?php

namespace WeBWorK\Server\Util;

/**
 * Problem formatting utilities.
 */
class ProblemFormatter {
	public function clean( $text ) {
		$parsed = $this->generate_placeholders( $text );
		$parsed['text'] = $this->remove_script_tags( $parsed['text'] );
		$parsed['text'] = str_replace( '<span class="MathJax_Preview">[math]</span>', '', $parsed['text'] );

		$parsed['text'] = trim( $parsed['text'] );

		// <P>(1 point)
		// @todo Does this happen in all questions?
		$parsed['text'] = preg_replace( '/^<[pP][ >][^>]*>\([0-9]+ points?\)/', '', $parsed['text'] );

		// Tag cleanup.
		$parsed['text'] = preg_replace( '|<br/?>|i', "\r\r", $parsed['text'] );
		$parsed['text'] = preg_replace( '|</?[pbi]>|i', '', $parsed['text'] );

		return $parsed;
	}

	public function remove_script_tags( $text ) {
		$text = preg_replace( '|<script type="text[^>]+>[^<]+</script>|', '', $text );
		return $text;
	}

	public function generate_placeholders( $text ) {
		$retval = array(
			'text' => '',
			'maths' => array(),
			'inputs' => array(),
		);

		$clean_text = $text;

		$regex = '|<script type="math/tex[^>]+>(.*?)</script>|';
		if ( preg_match_all( $regex, $text, $matches ) ) {
			$matches_wrapped   = $matches[0];
			$matches_unwrapped = $matches[1];

			foreach ( $matches_wrapped as $key => $mw ) {
				$clean_text = str_replace( $mw, '{{{math_' . $key . '}}}', $clean_text );
			}

			foreach ( $matches_wrapped as $key => $mw ) {
				if ( false !== strpos( $mw, 'mode=display' ) ) {
					$display = 'block';
				} else {
					$display = 'inline';
				}

				$retval['maths'][ $key ] = array(
					'math' => $matches_unwrapped[ $key ],
					'display' => $display,
				);
			}
		}

		$regex = '|<input[^>]+>|';
		if ( preg_match_all( $regex, $text, $matches ) ) {
			$matched_inputs = $matches[0];

			$inputs = array();
			foreach ( $matched_inputs as $key => $mi ) {

				$type = 'text';
				$regex = '|type=[\'"]?([^\'" ]+)|';
				if ( preg_match( $regex, $mi, $match ) ) {
					$type = $match[1];
					if ( 'hidden' === $type ) {
						$clean_text = str_replace( $mi, '', $clean_text );
						continue;
					}
				}

				$value = '';
				$regex = '|value=[\'"]?([^\'" ]+)|';
				if ( preg_match( $regex, $mi, $match ) ) {
					$value = $match[1];
				}

				$retval['inputs'][ $key ] = array(
					'type' => $type,
					'value' => $value,
				);

				$clean_text = str_replace( $mi, '{{{input_' . $key . '}}}', $clean_text );
			}
		}

		$retval['text'] = $clean_text;

		return $retval;
	}
}