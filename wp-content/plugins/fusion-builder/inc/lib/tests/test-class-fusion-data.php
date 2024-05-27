<?php

class Test_Class_Fusion_Data extends WP_UnitTestCase {

	/**
	 * Test fusion_social_icons.
	 */
	public function test_fusion_social_icons() {
		$this->assertTrue( is_array( Fusion_Data::fusion_social_icons() ) );
		$this->assertTrue( ! empty( Fusion_Data::fusion_social_icons( false ) ) );
		$this->assertTrue( isset( Fusion_Data::fusion_social_icons()['custom'] ) );
		$this->assertTrue( ! isset( Fusion_Data::fusion_social_icons( false )['custom'] ) );

		$icons = Fusion_Data::fusion_social_icons();
		foreach ( $icons as $k => $v ) {
			$this->assertTrue( is_string( $v ) && ! empty( $v ) );
		}

		$icons = Fusion_Data::fusion_social_icons( true, true );
		foreach ( $icons as $k => $v ) {
			$this->assertTrue( is_array( $v ) && isset( $v['label'] ) && ! empty( $v['label'] ) && isset( $v['color'] ) );
		}
	}

	/**
	 * Test old_icons.
	 */
	public function test_old_icons() {
		$this->assertTrue( is_array( Fusion_Data::old_icons() ) && ! empty( Fusion_Data::old_icons() ) );
	}

	/**
	 * Test standard_fonts.
	 */
	public function test_standard_fonts() {
		$this->assertTrue( is_array( Fusion_Data::standard_fonts() ) && ! empty( Fusion_Data::standard_fonts() ) );
	}

	/**
	 * Test font_weights.
	 */
	public function test_font_weights() {
		$this->assertTrue( is_array( Fusion_Data::font_weights() ) && ! empty( Fusion_Data::font_weights() ) );
	}

	/**
	 * Test color_theme.
	 */
	public function test_color_theme() {
		$this->assertTrue( is_array( Fusion_Data::color_theme( '' ) ) && empty( Fusion_Data::color_theme( '' ) ) );
		$this->assertTrue( is_array( Fusion_Data::color_theme( 'dark' ) ) && ! empty( Fusion_Data::color_theme( 'dark' ) ) );
	}
}
