/* global fusionProductGridVars */
( function( jQuery ) {
	'use strict';

	jQuery( window ).on( 'load fusion-element-render-fusion_woo_product_grid', function( event, cid ) { // eslint-disable-line no-unused-vars
		// Setup infinite scroll for each blog instance; main blog page and blog shortcodes.
		jQuery( '.fusion-products-container-infinite' ).each( function( index ) {
			// Set the correct container for products shortcode infinite scroll.
			var $blogInfiniteContainer = jQuery( this ),
				postClass                = 'product',
				$currentPage             = 1,
				$parentWrapperClasses,
				$fusionPostsContainer,
				$loadMoreButton;

			// If more than one blog shortcode is on the page, make sure the infinite scroll selectors are correct.
			$parentWrapperClasses = '';
			if ( $blogInfiniteContainer.closest( '.fusion-woo-product-grid' ).length ) {
				$parentWrapperClasses = '.' + $blogInfiniteContainer.parents( '.fusion-woo-product-grid' ).attr( 'class' ).replace( /\ /g, '.' ) + ' '; // eslint-disable-line no-useless-escape
			}

			// Infite scroll for products.
			jQuery( $blogInfiniteContainer ).infinitescroll( {

				navSelector: $parentWrapperClasses + '.woocommerce-pagination',

				// Selector for the paged navigation (it will be hidden).
				nextSelector: $parentWrapperClasses + '.woocommerce-pagination .next',

				// Selector for the NEXT link (to page 2).
				itemSelector: $parentWrapperClasses + 'li.' + postClass,

				// Selector for all items you'll retrieve.
				loading: {
					finishedMsg: fusionProductGridVars.infinite_finished_msg,
					msg: jQuery( '<div class="fusion-loading-container fusion-clearfix"><div class="fusion-loading-spinner"><div class="fusion-spinner-1"></div><div class="fusion-spinner-2"></div><div class="fusion-spinner-3"></div></div><div class="fusion-loading-msg">' + fusionProductGridVars.infinite_blog_text + '</div>' )
				},

				maxPage: ( $blogInfiniteContainer.data( 'pages' ) ) ? $blogInfiniteContainer.data( 'pages' ) : undefined,

				infid: 'pcg' + index,

				errorCallback: function() {

					// If this is an equal heights blog, clear the set element height on resize for correct isotope positioning.
					$blogInfiniteContainer.find( '.fusion-post-grid' ).css( 'height', '' );
				}
			}, function( posts ) { // eslint-disable-line no-unused-vars

				// Hide the load more button, if the currently loaded page is already the last page
				$fusionPostsContainer = $blogInfiniteContainer;

				if ( $fusionPostsContainer.data( 'pages' ) == $currentPage ) { // jshint ignore:line
					$fusionPostsContainer.parent().find( '.fusion-loading-container' ).hide();
					$fusionPostsContainer.parent().find( '.fusion-load-more-button' ).hide();
				}

				// Trigger resize so that any parallax sections below get recalculated.
				setTimeout( function() {
					jQuery( window ).trigger( 'resize', [ false ] );
				}, 500 );

				// Reinitialize element animations.
				if ( jQuery.isFunction( jQuery.fn.initElementAnimations ) ) {
					jQuery( window ).initElementAnimations();
				}

				$currentPage++;
			} );

			// Setup infinite scroll manual loading.
			if ( ( jQuery( $blogInfiniteContainer ).hasClass( 'fusion-product-archive' ) && 'load_more_button' === fusionProductGridVars.pagination_type ) ||
				jQuery( $blogInfiniteContainer ).hasClass( 'fusion-products-container-load-more' )
			) {
				jQuery( $blogInfiniteContainer ).infinitescroll( 'unbind' );

				// Load more posts button click.
				if ( jQuery( $blogInfiniteContainer ).hasClass( 'fusion-product-archive' ) ) {
					$loadMoreButton = jQuery( $blogInfiniteContainer ).parent().find( '.fusion-load-more-button' );
				} else {
					$loadMoreButton = jQuery( $blogInfiniteContainer ).parents( '.fusion-product-archive' ).find( '.fusion-load-more-button' );
				}

				$loadMoreButton.on( 'click', function( e ) {
					e.preventDefault();

					// Use the retrieve method to get the next set of posts
					jQuery( $blogInfiniteContainer ).infinitescroll( 'retrieve' );
				} );
			}

			// Hide the load more button, if there is only one page
			$fusionPostsContainer = $blogInfiniteContainer;

			if ( 1 === parseInt( $fusionPostsContainer.data( 'pages' ), 10 ) ) {
				$fusionPostsContainer.parent().find( '.fusion-loading-container' ).hide();
				$fusionPostsContainer.parent().find( '.fusion-load-more-button' ).hide();
			}
		} );

	} );
}( jQuery ) );
