/* global fusionEventsVars, imagesLoaded */
/* eslint no-useless-escape: 0 */

jQuery( window ).on( 'load', function() {
	if ( 'function' === typeof jQuery.fn.equalHeights ) {

		// Equal Heights Elements.
		jQuery( window ).on( 'fusion-resize-horizontal', function() {
			jQuery( '.fusion-events-shortcode' ).each( function() {
				jQuery( this ).find( '.fusion-events-meta' ).equalHeights();
			} );
		} );
	}
} );

jQuery( window ).on( 'load fusion-element-render-fusion_events', function( event, cid ) {
	var targetElementSelector = 'undefined' !== typeof cid ? 'div[data-cid="' + cid + '"] .fusion-events-shortcode' : '.fusion-events-shortcode';

	if ( 'function' === typeof jQuery.fn.equalHeights ) {

		// Equal Heights Elements
		jQuery( targetElementSelector ).each( function() {
			jQuery( this ).find( '.fusion-events-meta' ).equalHeights();
		} );
	}

	// Load more and infinite scroll.
	jQuery( targetElementSelector + '.fusion-events-pagination-infinite, ' + targetElementSelector + '.fusion-events-pagination-load-more-button' ).each( function( index ) {
		var $eventsInfiniteScrollContainer        = jQuery( this ),
			$eventsInfiniteScrollContainerClasses = '.' + $eventsInfiniteScrollContainer.attr( 'class' ).replace( /\ /g, '.' ).replace( /.fusion\-events\-[a-zA-Z]+\-sidebar/g, '' ).replace( '.fusion-masonry-has-vertical', '' ) + ' ',
			$eventsInfiniteScrollPages            = $eventsInfiniteScrollContainer.find( '.fusion-events-wrapper' ).data( 'pages' ),
			$isotopeVars = {
				layoutMode: 'packery',
				itemSelector: '.fusion-events-post',
				isOriginLeft: jQuery( 'body.rtl' ).length ? false : true
			};

		$eventsInfiniteScrollContainer.find( '.fusion-events-wrapper' ).isotope( $isotopeVars );

		// Initialize the infinite scroll object.
		$eventsInfiniteScrollContainer.children( '.fusion-events-wrapper' ).infinitescroll( {
			navSelector: $eventsInfiniteScrollContainerClasses + '.fusion-infinite-scroll-trigger',

			// Selector for the paged navigation (it will be hidden).
			nextSelector: $eventsInfiniteScrollContainerClasses + '.pagination-next',

			// Selector for the NEXT link (to page 2).
			itemSelector: $eventsInfiniteScrollContainerClasses + 'div.pagination .current, ' + $eventsInfiniteScrollContainerClasses + ' .fusion-events-post',

			// Selector for all items you'll retrieve.
			loading: {
				finishedMsg: fusionEventsVars.infinite_finished_msg,
				msg: jQuery( '<div class="fusion-loading-container fusion-clearfix"><div class="fusion-loading-spinner"><div class="fusion-spinner-1"></div><div class="fusion-spinner-2"></div><div class="fusion-spinner-3"></div></div><div class="fusion-loading-msg">' + fusionEventsVars.infinite_blog_text + '</div>' )
			},

			maxPage: ( $eventsInfiniteScrollPages ) ? $eventsInfiniteScrollPages : undefined,

			infid: 'e' + index,

			errorCallback: function() {

				// If this is an equal heights events, clear the set element height on resize for correct isotope positioning.
				$eventsInfiniteScrollContainer.find( '.fusion-events-post' ).css( 'height', '' );

				$eventsInfiniteScrollContainer.find( '.fusion-events-wrapper' ).isotope( $isotopeVars );
			}

		}, function( $posts ) {

			if ( jQuery().isotope ) {

				$posts   = jQuery( $posts );

				// Hide posts while loading.
				$posts.hide();

				// Make sure images are loaded before the posts get shown.
				imagesLoaded( $posts, function() {
					var $placeholderImages,
						$videos,
						$currentPage;

					// Fade in placeholder images.
					$placeholderImages = jQuery( $posts ).find( '.fusion-placeholder-image' );
					$placeholderImages.parents( '.fusion-events-content-wrapper, .fusion-image-wrapper' ).animate( { opacity: 1 } );

					// Fade in videos.
					$videos = jQuery( $posts ).find( '.fusion-video' );
					$videos.each( function() {
						jQuery( this ).animate( { opacity: 1 } );
						jQuery( this ).parents( '.fusion-events-content-wrapper' ).animate( { opacity: 1 } );
					} );

					$videos.fitVids();

					// Portfolio Images Loaded Check.
					window.$events_images_index = 0;
					jQuery( $posts ).imagesLoaded().progress( function( $instance, $image ) {
						if ( 1 <= jQuery( $image.img ).parents( '.fusion-events-content-wrapper' ).length ) {
							jQuery( $image.img, $placeholderImages ).parents( '.fusion-events-content-wrapper' ).delay( 100 * window.$events_images_index ).animate( {
								opacity: 1
							} );
						} else {
							jQuery( $image.img, $placeholderImages ).parents( '.fusion-image-wrapper' ).delay( 100 * window.$events_images_index ).animate( {
								opacity: 1
							} );
						}

						window.$events_images_index++;
					} );

					$posts.fadeIn();

					// If this is an equal heights events, clear the set element height on resize for correct isotope positioning.
					$eventsInfiniteScrollContainer.find( '.fusion-events-post' ).css( 'height', '' );

					// Trigger isotope for correct positioning.
					$eventsInfiniteScrollContainer.find( '.fusion-events-wrapper' ).isotope( 'appended', $posts );

					// Trigger fitvids.
					$posts.each( function() {
						jQuery( this ).find( '.full-video, .video-shortcode, .wooslider .slide-content' ).fitVids();
					} );

					// Refresh the scrollspy script for one page layouts.
					jQuery( '[data-spy="scroll"]' ).each( function() {
						jQuery( this ).scrollspy( 'refresh' );
					} );

					// Hide the load more button, if the currently loaded page is already the last page.
					$currentPage = $eventsInfiniteScrollContainer.find( '.current' ).html();
					$eventsInfiniteScrollContainer.find( '.current' ).remove();

					if ( $eventsInfiniteScrollPages == $currentPage ) { // jshint ignore:line
						$eventsInfiniteScrollContainer.find( '.fusion-loading-container' ).hide();
						$eventsInfiniteScrollContainer.find( '.fusion-load-more-button' ).hide();
					}

					window.dispatchEvent( new Event( 'fusion-resize-horizontal', { 'bubbles': true, 'cancelable': true } ) );

					setTimeout( function() {
						$eventsInfiniteScrollContainer.find( '.fusion-events-wrapper' ).isotope();
					}, 250 );
				} );
			}
		} );

		// Setup infinite scroll manual loading.
		if ( $eventsInfiniteScrollContainer.hasClass( 'fusion-events-pagination-load-more-button' ) ) {
			$eventsInfiniteScrollContainer.find( '.fusion-events-wrapper' ).infinitescroll( 'unbind' );

			$eventsInfiniteScrollContainer.find( '.fusion-load-more-button' ).on( 'click', function( e ) {
				e.preventDefault();

				// Use the retrieve method to get the next set of posts.
				$eventsInfiniteScrollContainer.find( '.fusion-events-wrapper' ).infinitescroll( 'retrieve' );
			} );
		}
	} );
} );
