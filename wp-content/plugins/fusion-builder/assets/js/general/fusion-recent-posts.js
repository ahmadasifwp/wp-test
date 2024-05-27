/* global fusionRecentPostsVars, imagesLoaded, fusionInitPostFlexSlider */
/* eslint no-useless-escape: 0 */

jQuery( window ).on( 'load', function() {

	// Setup infinite scroll for each recent posts element.
	jQuery( '.fusion-recent-posts-infinite .fusion-columns' ).each( function( index ) {

		// Set the correct container for recent posts infinite scroll.
		var recentPostsInfiniteContainer = jQuery( this ),
			recentPostsWrapper = recentPostsInfiniteContainer.parent(),
			recentPostsWrapperClasses = '.' + recentPostsWrapper.attr( 'class' ).replace( /\ /g, '.' ) + ' ',
			originalPosts        = jQuery( this ).find( '.fusion-column' ),
			currentPage,
			loadMoreButton,
			galleryName;

		jQuery( recentPostsInfiniteContainer ).infinitescroll( {

			navSelector: recentPostsWrapperClasses + '.fusion-infinite-scroll-trigger',

			// Selector for the paged navigation (it will be hidden).
			nextSelector: recentPostsWrapperClasses + 'a.pagination-next',

			// Selector for the NEXT link (to page 2).
			itemSelector: recentPostsWrapperClasses + 'div.pagination .current, ' + recentPostsWrapperClasses + 'article.post',

			// Selector for all items you'll retrieve.
			loading: {
				finishedMsg: fusionRecentPostsVars.infinite_finished_msg,
				msg: jQuery( '<div class="fusion-loading-container fusion-clearfix"><div class="fusion-loading-spinner"><div class="fusion-spinner-1"></div><div class="fusion-spinner-2"></div><div class="fusion-spinner-3"></div></div><div class="fusion-loading-msg">' + fusionRecentPostsVars.infinite_loading_text + '</div>' )
			},

			maxPage: ( recentPostsWrapper.data( 'pages' ) ) ? recentPostsWrapper.data( 'pages' ) : undefined,

			infid: 'rp' + index,

			errorCallback: function() { // eslint-disable-line no-empty-function
			}
		}, function( posts ) {

			jQuery( posts ).hide();

			// Add and fade in new posts when all images are loaded
			imagesLoaded( posts, function() {
				jQuery( posts ).fadeIn();
			} );

			// Init flexslider for newly added posts.
			fusionInitPostFlexSlider();

			// Trigger fitvids
			jQuery( posts ).each( function() {
				jQuery( this ).find( '.full-video, .video-shortcode, .wooslider .slide-content' ).fitVids();
			} );

			// Hide the load more button, if the currently loaded page is already the last page.
			currentPage = recentPostsWrapper.find( '.current' ).html();
			recentPostsWrapper.find( '.current' ).remove();

			if ( recentPostsWrapper.data( 'pages' ) == currentPage ) { // jshint ignore:line
				recentPostsWrapper.find( '.fusion-loading-container' ).hide();
				recentPostsWrapper.find( '.fusion-load-more-button' ).hide();
			}

			// Activate lightbox for the newly added posts.
			if ( jQuery( posts ).find( '.fusion-rollover-gallery' ).length ) {
				if ( 'individual' === fusionRecentPostsVars.lightbox_behavior || ! originalPosts.find( '.fusion-rollover-gallery' ).length ) {
					window.avadaLightBox.activate_lightbox( jQuery( posts ) );

					originalPosts = recentPostsInfiniteContainer.find( '.post' );
				} else {
					galleryName   = originalPosts.find( '.fusion-rollover-gallery' ).first().data( 'rel' );
					originalPosts = recentPostsInfiniteContainer.find( '.post' );

					if ( 'undefined' !== typeof window.$ilInstances[ galleryName ] ) {
						window.$ilInstances[ galleryName ].destroy();
						delete window.$ilInstances[ galleryName ];

						window.avadaLightBox.activate_lightbox( originalPosts );
					}
				}

				// Refresh the lightbox, needed in any case.
				window.avadaLightBox.refresh_lightbox();
			}

			// Trigger resize so that any parallax sections below get recalculated.
			setTimeout( function() {
				jQuery( window ).trigger( 'resize', [ false ] );
			}, 500 );

			// Reinitialize element animations.
			if ( jQuery.isFunction( jQuery.fn.initElementAnimations ) ) {
				jQuery( window ).initElementAnimations();
			}
		} );

		// Setup infinite scroll manual loading
		if ( jQuery( recentPostsWrapper ).hasClass( 'fusion-recent-posts-load-more' ) ) {
			jQuery( recentPostsInfiniteContainer ).infinitescroll( 'unbind' );

			// Load more posts button click.
			loadMoreButton = jQuery( recentPostsWrapper ).find( '.fusion-load-more-button' );

			loadMoreButton.on( 'click', function( e ) {
				e.preventDefault();

				// Use the retrieve method to get the next set of posts.
				jQuery( recentPostsInfiniteContainer ).infinitescroll( 'retrieve' );

			} );
		}

		// Hide the load more button, if there is only one page.
		if ( 1 === parseInt( recentPostsWrapper.data( 'pages' ), 10 ) ) {
			recentPostsWrapper.find( '.fusion-loading-container' ).hide();
			recentPostsWrapper.find( '.fusion-load-more-button' ).hide();
		}
	} );
} );
