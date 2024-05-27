<?php
/**
 * Template Name: Blog
 *
 * This template is used to display a page to show all posts.
 */

get_header(); // Header ko load karein.
?>

<section class="footer_section">
  <div class="container">
    <p>
      <?php
        $latest_posts_args = array(
          'posts_per_page' => 5, // Change the number of posts displayed if needed
          'post_status'    => 'publish', // Retrieve only published posts
        );

        $latest_posts = get_posts($latest_posts_args);

        if ($latest_posts) {
          foreach ($latest_posts as $post) {
            setup_postdata($post); // Set up post data for use in the loop
            ?>
            <article>
            <a href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>">
		<?php the_post_thumbnail(); ?>
	</a>
              <h2><?php the_title(); ?></h2>
              <div><?php the_content(); ?></div>
            </article>
            <?php
          }
          wp_reset_postdata(); // Reset post data
        } else {
          echo 'No posts found';
        }
      ?>
    </p>
  </div>
</section>


<?php
get_footer(); // Footer ko load karein.
?>
