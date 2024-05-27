<?php
// add child theme  
add_action( 'wp_enqueue_scripts','add_child_theme');

function add_child_theme() {
	wp_enqueue_style(  
		get_stylesheet_uri()
	);
}
// add meta boxes 
add_action('add_meta_boxes', 'add_custom_meta_box');
function add_custom_meta_box() {
    add_meta_box(
        'custom_meta_box', // ID attribute of metabox
        'Custom Meta Box', // Title of metabox visible to user
        'show_custom_meta_box', // The callback that renders the content of the metabox
        'courses', // The screen or post type on which to show the metabox
        'normal', // The context within the screen where the boxes should display
        'high' // The priority within the context where the boxes should show
    );
}
function show_custom_meta_box() {
    global $post;
    // Use nonce for verification to secure the data being saved
    wp_nonce_field(basename(__FILE__), 'custom_meta_box_nonce');
    // Begin the field table and loop
    echo '<table class="form-table">';
    echo '<tr>';
    echo '<th><label for="meta-text">TEACHER NAME</label></th>';
    echo '<td>';
    echo '<input type="text" name="meta-text" id="meta-text" value="' . get_post_meta($post->ID, 'meta-text', true) . '" size="25" />';
    echo '<br /><span class="description">Enter a custom text.</span>';
    echo '</td>';
    echo '</tr>';
    // Add more fields as needed
    echo '</table>';
}
add_action('save_post', 'save_custom_meta_box_data');
function save_custom_meta_box_data($post_id) {
    // Verify nonce
    if (!isset($_POST['custom_meta_box_nonce']) || !wp_verify_nonce($_POST['custom_meta_box_nonce'], basename(__FILE__))) {
        return $post_id;
    }
    // Check autosave
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return $post_id;
    }
    // Check permissions
    if ('page' === $_POST['post_type']) {
        if (!current_user_can('edit_page', $post_id)) {
            return $post_id;
        }
    } elseif (!current_user_can('edit_post', $post_id)) {
        return $post_id;
    }

    // Save the custom field data
    if (isset($_POST['meta-text'])) {
        update_post_meta($post_id, 'meta-text', sanitize_text_field($_POST['meta-text']));
    }
    // Add more fields as needed
}
 
// Get Post Views Counter for the single blog posts. This function is called in single.php file
function get_post_views( $postID, $count_init = 0, $reset = false ) {
	$count_key = 'cx_post_views';

	if ( ! is_numeric( $postID ) || $postID <= 0 ) {
		error_log( 'get_post_views: invalid post ID' );
		return false;
	}

	if ( ! is_bool( $reset ) ) {
		error_log( 'get_post_views: invalid reset parameter' );
		return false;
	}

	$count = get_post_meta( $postID, $count_key, true );

	if ( $count == '' ) {
		$count = $count_init;
		update_post_meta( $postID, $count_key, $count );
	} else {
		if ( $count_init > $count ) {
			update_post_meta( $postID, $count_key, $count_init );
			$count = $count_init;
		} elseif ( ! $reset ) {
			$count++;
			update_post_meta( $postID, $count_key, $count );
		}
	}

	if ( $reset ) {
		$count = 0;
		update_post_meta( $postID, $count_key, $count );
	}
	return $count;
}



// custom post type show in admin
function custom_post_type() {
	register_post_type('courses',
		array(
			'labels'      => array(
				'name'          => __( 'Courses', 'textdomain' ),
				'singular_name' => __( 'Course', 'textdomain' ),
			),
			'public'      => true,
			'has_archive' => true,
			'rewrite'     => array( 'slug' => 'courses' ), // custom slug
            'supports'    => array( 'title', 'editor', 'thumbnail' ), // Add 'thumbnail' to support featured images
		)
	);
}
add_action('init', 'custom_post_type');

// add taxonomy departments in custom post type courses
add_action( 'init', 'register_custom_taxonomies' );

function register_custom_taxonomies() {
    $taxonomies = array(
        'campus' => array(
            'name'              => 'Campuses',
            'singular_name'     => 'Campus',
            'slug'              => 'campus',
        ),
        'department' => array(
            'name'              => 'Departments',
            'singular_name'     => 'Department',
            'slug'              => 'department',
        ),
        // Add more taxonomies here
    );

    foreach ( $taxonomies as $taxonomy => $details ) {
        $labels = array(
            'name'              => _x( $details['name'], 'taxonomy general name' ),
            'singular_name'     => _x( $details['singular_name'], 'taxonomy singular name' ),
            'search_items'      => __( 'Search ' . $details['name'] ),
            'all_items'         => __( 'All ' . $details['name'] ),
            'parent_item'       => __( 'Parent ' . $details['singular_name'] ),
            'parent_item_colon' => __( 'Parent ' . $details['singular_name'] . ':' ),
            'edit_item'         => __( 'Edit ' . $details['singular_name'] ),
            'update_item'       => __( 'Update ' . $details['singular_name'] ),
            'add_new_item'      => __( 'Add New ' . $details['singular_name'] ),
            'new_item_name'     => __( 'New ' . $details['singular_name'] . ' Name' ),
            'menu_name'         => __( $details['singular_name'] ),
        );

        $args = array(
            'hierarchical'      => true,
            'labels'            => $labels,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'rewrite'           => array( 'slug' => $details['slug'] ),
        );

        register_taxonomy( $taxonomy, array( 'courses','post' ), $args );
    }
}












