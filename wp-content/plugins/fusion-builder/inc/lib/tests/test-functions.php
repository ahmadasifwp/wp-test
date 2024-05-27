<?php

class Test_Functions extends WP_UnitTestCase {

	/**
	 * Test fusion_calc_color_brightness.
	 */
	public function test_fusion_calc_color_brightness() {
		$this->assertEquals( 255, fusion_calc_color_brightness( '#ffffff' ) );
		$this->assertEquals( 255, fusion_calc_color_brightness( '#fff' ) );
		$this->assertEquals( 255, fusion_calc_color_brightness( 'fff' ) );
		$this->assertEquals( 255, fusion_calc_color_brightness( 'rgba(255,255,255,1)' ) );
		$this->assertEquals( 0, fusion_calc_color_brightness( '#000000' ) );
		$this->assertEquals( 0, fusion_calc_color_brightness( '#000' ) );
		$this->assertEquals( 0, fusion_calc_color_brightness( '000' ) );
		$this->assertEquals( 0, fusion_calc_color_brightness( 'rgba(0,0,0,1)' ) );
	}

	/**
	 * Test fusion_link_pages_link.
	 */
	public function test_fusion_link_pages_link() {
		$this->assertEquals( '', fusion_link_pages_link( '', 1 ) );
		$this->assertEquals( '<span class="current"></span>', fusion_link_pages_link( '', null ) );
	}

	/**
	 * Test fusion_get_user_locale.
	 */
	public function test_fusion_get_user_locale() {
		$this->assertEquals( fusion_get_user_locale(), get_user_locale() );
	}

	/**
	 * Test fusion_is_color_transparent.
	 */
	public function test_fusion_is_color_transparent() {
		$this->assertTrue( fusion_is_color_transparent( 'transparent' ) );
		$this->assertTrue( fusion_is_color_transparent( '   transparent    ' ) );
		$this->assertTrue( fusion_is_color_transparent( 'rgba(0,0,0,0' ) );
		$this->assertTrue( fusion_is_color_transparent( '   rgba(0,0,0,0)          ' ) );
		$this->assertFalse( fusion_is_color_transparent( '#fff' ) );
		$this->assertFalse( fusion_is_color_transparent( 'red' ) );
		$this->assertFalse( fusion_is_color_transparent( 'rgb(10,48,139' ) );
	}
}
