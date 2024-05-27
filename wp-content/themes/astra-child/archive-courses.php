<?php
/**
 * The template for displaying archive of Reviews
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Dosth
 */
get_header();
?>
<div class="content-container">
    <h1 class="page-title"><?php post_type_archive_title(); ?></h1>    

            <?php if ( have_posts() ): ?>
                <?php while( have_posts() ): ?>
                    <?php the_post(); ?>
                        <blockquote>
                            <footer>
                                <cite><?php the_title(); ?></cite>

                            </footer>
                        </blockquote>
                <?php endwhile; ?>
                <?php the_posts_pagination(); ?>
            <?php else: ?>
            <?php endif; ?>
      
</div>
<?php get_footer(); ?>