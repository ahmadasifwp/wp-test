<?php
// Dynamic footer
function custom_theme_customizer_settings($wp_customize) {
    // Add section for footer options
    $wp_customize->add_section('footer_section', array(
        'title' => __('Footer', 'custom-theme'),
        'priority' => 30,
    ));
    // Add setting for custom footer text
    $wp_customize->add_setting('custom_footer_text', array(
        'default' => '',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    // Add control for custom footer text
    $wp_customize->add_control('custom_footer_text', array(
        'label' => __('Custom Footer Text', 'custom-theme'),
        'section' => 'footer_section',
        'type' => 'text',
    ));
}
add_filter('customize_register', 'custom_theme_customizer_settings');


if ( function_exists( 'add_theme_support' ) ) {
    add_theme_support( 'post-thumbnails' );
    set_post_thumbnail_size( 150, 150, true ); // default Featured Image dimensions (cropped)

    // additional image sizes
    // delete the next line if you do not need additional image sizes
    add_image_size( 'category-thumb', 300, 9999 ); // 300 pixels wide (and unlimited height)
}

