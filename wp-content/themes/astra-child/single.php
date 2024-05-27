<?php
/**
 * The template for displaying all single posts.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package Astra
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
get_header();

// Displaying the number of post views inside single.php file
if ( have_posts() ) : while ( have_posts() ) : the_post();
    // Display the view count
    $view_count = get_post_views( get_the_ID() );
    echo '<div > VIEWS:' . $view_count . '</div>';
endwhile; endif;

// custom meta field display
function custom_meta_to_single_post_meta($meta_data) {
    global $post;
    $featured_image = get_the_post_thumbnail($post->ID, 'thumbnail', );
    $custom_field_value = get_post_meta($post->ID, 'meta-text', true);
    $meta_data .= "<div style='width:200px;' > . $featured_image . </div> ";
    $meta_data .= '<div class="entry-meta"> TEACHER NAME: ' . esc_html($custom_field_value) . '</div>';
    return $meta_data;
}
add_filter('astra_single_post_meta', 'custom_meta_to_single_post_meta');
?>
<?php if ( astra_page_layout() == 'left-sidebar' ) : ?>
	

	<?php get_sidebar(); ?>

    <?php endif ?>
    
<div id="primary" <?php astra_primary_class(); ?>>


    <?php astra_primary_content_top(); ?>
    
    
    <?php astra_content_loop(); ?>

    <div class="custom-sidebar">
    <?php dynamic_sidebar('sidebar-1'); ?>

</div>
     
    <?php astra_primary_content_bottom(); ?>
    

</div><!-- #primary -->

<?php if ( astra_page_layout() == 'right-sidebar' ) : ?>

	<?php get_sidebar(); ?>

<?php endif ?>
<?php get_footer(); ?>







