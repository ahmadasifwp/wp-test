<?php
/**
 * FSE Photography functions and definitions
 *
 * @package fse_photography
 * @since 1.0
 */

if ( ! function_exists( 'fse_photography_support' ) ) :
	function fse_photography_support() {

		// Add support for block styles.
		add_theme_support( 'wp-block-styles' );

		// Enqueue editor styles.
		add_editor_style( 'style.css' );

	}
endif;

add_action( 'after_setup_theme', 'fse_photography_support' );

if ( ! function_exists( 'fse_photography_styles' ) ) :
	function fse_photography_styles() {
		// Register theme stylesheet.
		$fse_photography_theme_version = wp_get_theme()->get( 'Version' );

		$fse_photography_version_string = is_string( $fse_photography_theme_version ) ? $fse_photography_theme_version : false;
		wp_enqueue_style(
			'fse-photography-style',
			get_template_directory_uri() . '/style.css',
			array(),
			$fse_photography_version_string
		);
	}
endif;

add_action( 'wp_enqueue_scripts', 'fse_photography_styles' );

/* Theme Credit link */
define('FSE_PHOTOGRAPHY_BUY_NOW',__('https://www.cretathemes.com/gutenberg/photographer-wordpress-theme/','fse-photography'));
define('FSE_PHOTOGRAPHY_PRO_DEMO',__('https://www.cretathemes.com/preview/fse-photography/','fse-photography'));
define('FSE_PHOTOGRAPHY_THEME_DOC',__(' https://www.cretathemes.com/pro-guide/fse-photography/','fse-photography'));
define('FSE_PHOTOGRAPHY_SUPPORT',__('https://wordpress.org/support/theme/fse-photography','fse-photography'));
define('FSE_PHOTOGRAPHY_REVIEW',__('https://wordpress.org/support/theme/fse-photography/reviews/#new-post','fse-photography'));

// Add block patterns
require get_template_directory() . '/inc/block-patterns.php';

// Add block styles
require get_template_directory() . '/inc/block-styles.php';

// Block Filters
require get_template_directory() . '/inc/block-filters.php';

// Svg icons
require get_template_directory() . '/inc/icon-function.php';

// Get Started.
require get_template_directory() . '/inc/get-started/get-started.php';