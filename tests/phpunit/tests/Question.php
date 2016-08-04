<?php

/**
 * @group question
 */
class WeBWork_Tests_Question extends WeBWorK_UnitTestCase {
	public function test_successful_save_for_existing_item() {
		$q = self::factory()->question->create( array(
			'problem_id' => 15,
			'tried' => 'foo tried',
		) );

		$question = new \WeBWorK\Server\Question( $q );

		$question->set_content( 'foo' );
		$question->set_tried( 'bar tried' );
		$question->set_problem_id( 20 );

		$saved = $question->save();

		$this->assertTrue( $saved );

		$new_question = new \WeBWorK\Server\Question( $q );
		$this->assertSame( 'foo', $new_question->get_content() );
		$this->assertSame( '20', $new_question->get_problem_id() );
		$this->assertSame( 'bar tried', $new_question->get_tried() );
	}

	public function test_successful_save_for_new_item() {
		$question = new \WeBWorK\Server\Question();

		$question->set_content( 'foo' );
		$question->set_problem_id( 20 );

		$saved = $question->save();

		$this->assertTrue( $saved );

		$new_question = new \WeBWorK\Server\Question( $question->get_id() );
		$this->assertSame( 'foo', $new_question->get_content() );
		$this->assertSame( '20', $new_question->get_problem_id() );
	}

	public function test_exists_false() {
		$q = new \WeBWorK\Server\Question( 999 );
		$this->assertFalse( $q->exists() );
	}

	public function test_exists_true() {
		$q = self::factory()->question->create();

		$question = new \WeBWorK\Server\Question( $q );

		$this->assertTrue( $question->exists() );
	}

	public function test_delete_should_fail_when_question_does_not_exist() {
		$question = new \WeBWorK\Server\Question( 999 );
		$this->assertFalse( $question->exists() );

		$this->assertFalse( $question->delete() );
	}

	public function test_delete_success() {
		$q = self::factory()->question->create();

		$question = new \WeBWorK\Server\Question( $q );
		$this->assertTrue( $question->exists() );

		$this->assertTrue( $question->delete() );

		$question_2 = new \WeBWorK\Server\Question( $q );
		$this->assertFalse( $question_2->exists() );
	}

	public function test_vote_count_should_default_to_zero() {
		$q = self::factory()->question->create();

		$question = new \WeBWorK\Server\Question( $q );

		$this->assertSame( 0, $question->get_vote_count() );
	}

	public function test_vote_count() {
		$q = self::factory()->question->create_and_get();

		self::factory()->vote->create( array(
			'user_id' => 5,
			'item' => $q,
			'value' => 1,
		) );

		$this->assertSame( 1, $q->get_vote_count() );
	}

	public function test_vote_count_should_be_cached_in_meta() {
		$q = self::factory()->question->create_and_get();

		self::factory()->vote->create( array(
			'user_id' => 5,
			'item' => $q,
			'value' => 1,
		) );

		// Danger - testing implementation details :-/
		$this->assertEquals( 1, get_post_meta( $q->get_id(), 'webwork_vote_count', true ) );
	}

	public function test_deleting_vote_should_invalidate_cache() {
		$q = self::factory()->question->create_and_get();

		self::factory()->vote->create( array(
			'user_id' => 5,
			'item' => $q,
			'value' => 1,
		) );

		$v = new \WeBWorK\Server\Vote();
		$v->set_user_id( 5 );
		$v->set_item( $q );
		$v->populate();

		$v->delete();

		$this->assertSame( 0, $q->get_vote_count() );
	}

	public function test_set_post_date() {
		$q = self::factory()->question->create();

		$question = new \WeBWorK\Server\Question( $q );

		$new_date = '2015-05-05 05:05:05';
		$question->set_post_date( $new_date );

		$this->assertTrue( $question->save() );

		$question2 = new \WeBWorK\Server\Question( $q );
		$this->assertSame( $new_date, $question2->get_post_date() );
	}

	public function test_set_problem_id() {
		$q = self::factory()->question->create();

		$question = new \WeBWorK\Server\Question( $q );

		$problem_id = 'foo';
		$question->set_problem_id( $problem_id );

		$this->assertTrue( $question->save() );

		$question2 = new \WeBWorK\Server\Question( $q );
		$this->assertSame( $problem_id, $question2->get_problem_id() );
	}

	public function test_set_problem_set() {
		$q = self::factory()->question->create();

		$question = new \WeBWorK\Server\Question( $q );

		$problem_set = 'foo';
		$question->set_problem_set( $problem_set );

		$this->assertTrue( $question->save() );

		$question2 = new \WeBWorK\Server\Question( $q );
		$this->assertSame( $problem_set, $question2->get_problem_set() );
	}

	public function test_set_course() {
		$q = self::factory()->question->create();

		$question = new \WeBWorK\Server\Question( $q );

		$course = 'foo';
		$question->set_course( $course );

		$this->assertTrue( $question->save() );

		$question2 = new \WeBWorK\Server\Question( $q );
		$this->assertSame( $course, $question2->get_course() );
	}

	public function test_set_section() {
		$q = self::factory()->question->create();

		$question = new \WeBWorK\Server\Question( $q );

		$section = 'foo';
		$question->set_section( $section );

		$this->assertTrue( $question->save() );

		$question2 = new \WeBWorK\Server\Question( $q );
		$this->assertSame( $section, $question2->get_section() );
	}
}
