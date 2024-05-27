/* global fusionPostCardsVars, fusion, fusionInitPostFlexSlider, imagesLoaded */
( function( jQuery ) {

	'use strict';

	jQuery.fn.awbAnimatePostCards = function() {
		if ( 'IntersectionObserver' in window ) {
			jQuery.each( fusion.getObserverSegmentation( jQuery( this ) ), function( index ) {
				var options           = fusion.getAnimationIntersectionData( index ),
					postCardsObserver = new IntersectionObserver( function( entries, observer ) {
						jQuery.each( entries, function( key, entry ) {
							var postCards         = jQuery( entry.target ),
								delay             = 0,
								animationType     = postCards.attr( 'data-animationtype' ),
								animationDuration = postCards.attr( 'data-animationduration' ),
								animationDelay    = parseInt( postCards.attr( 'data-animation-delay' ) * 1000, 10 );

							if ( fusion.shouldObserverEntryAnimate( entry, observer ) ) {
								postCards.find( '.fusion-grid-column:not([data-awb-animation-finished])' ).each( function() {
									var target = jQuery( this );

									setTimeout( function() {
										target.css( 'visibility', 'visible' );
										target.addClass( animationType );

										if ( animationDuration ) {
											target.css( '-moz-animation-duration', animationDuration + 's' );
											target.css( '-webkit-animation-duration', animationDuration + 's' );
											target.css( '-o-animation-duration', animationDuration + 's' );
											target.css( 'animation-duration', animationDuration + 's' );
										}

										setTimeout( function() {
											target.removeClass( animationType );
											target.attr( 'data-awb-animation-finished', 'true' );
										}, animationDuration * 1000 );
									}, delay );

									delay += animationDelay;
								} );

								postCardsObserver.unobserve( entry.target );
							}
						} );
					}, options );

				// Observe.
				jQuery( this ).each( function() {
					postCardsObserver.observe( this );
				} );
			} );
		} else {
			jQuery( this ).find( '.fusion-grid-column' ).each( function() {
				jQuery( this ).css( 'visibility', 'visible' );
			} );
		}
	};
}( jQuery ) );

// Flexslider is handled separately in fusion-flexslider.js with other slider code.
jQuery( window ).on( 'load fusion-element-render-fusion_post_cards', function() {

	// Don't run on live editor, it is separate.
	if ( ! jQuery( 'body' ).hasClass( 'fusion-builder-live-preview' ) ) {
		jQuery( '.fusion-post-cards.fusion-delayed-animation' ).awbAnimatePostCards();
	}

	// Setup infinite scroll for each blog instance; main blog page and blog shortcodes
	jQuery( '.fusion-grid-container-infinite' ).each( function( index ) {

		// Set the correct container for blog shortcode infinite scroll
		var $blogInfiniteContainer = jQuery( this ),
			$originalPosts         = jQuery( this ).find( '.post-card' ),
			$parentWrapperClasses,
			$fusionPostsContainer,
			$currentPage,
			$loadMoreButton,
			postClass              = 'post-card',
			galleryName            = '';

		// If more than one blog shortcode is on the page, make sure the infinite scroll selectors are correct
		$parentWrapperClasses = '';
		if ( $blogInfiniteContainer.closest( '.fusion-post-cards' ).length ) {
			$parentWrapperClasses = '.' + $blogInfiniteContainer.parents( '.fusion-post-cards' ).attr( 'class' ).replace( /\ /g, '.' ) + ' '; // eslint-disable-line no-useless-escape
		}

		// Infite scroll for main blog page and blog shortcode.
		jQuery( $blogInfiniteContainer ).infinitescroll( {

			navSelector: $parentWrapperClasses + '.fusion-infinite-scroll-trigger',

			// Selector for the paged navigation (it will be hidden)
			nextSelector: $parentWrapperClasses + 'a.pagination-next',

			// Selector for the NEXT link (to page 2)
			itemSelector: $parentWrapperClasses + '.' + postClass,

			// Selector for all items you'll retrieve
			loading: {
				finishedMsg: fusionPostCardsVars.infinite_finished_msg,
				msg: jQuery( '<div class="fusion-loading-container fusion-clearfix"><div class="fusion-loading-spinner"><div class="fusion-spinner-1"></div><div class="fusion-spinner-2"></div><div class="fusion-spinner-3"></div></div><div class="fusion-loading-msg">' + fusionPostCardsVars.infinite_text + '</div>' )
			},

			maxPage: ( $blogInfiniteContainer.data( 'pages' ) ) ? $blogInfiniteContainer.data( 'pages' ) : undefined,

			infid: 'pc' + index,

			errorCallback: function() {

				// If this is an equal heights blog, clear the set element height on resize for correct isotope positioning.
				$blogInfiniteContainer.find( '.fusion-post-grid' ).css( 'height', '' );
			}
		}, function( posts, opts, url ) {
			var page = url.split( '/' ),
				$posts = jQuery( posts ),
				$filters,
				$filterActiveElement,
				$filterActive;

			page = page[ page.length - 2 ];

			$filters = $blogInfiniteContainer.closest( '.fusion-post-cards' ).find( '.fusion-filters' ).find( '.fusion-filter' );

			if ( $filters.length ) {

				$filterActiveElement = $blogInfiniteContainer.closest( '.fusion-post-cards' ).find( '.fusion-filters' ).find( '.fusion-filter.fusion-active a' );
				$filterActive        = $filterActiveElement.attr( 'data-filter' ).substr( 1 );

				if ( $filterActive.length ) {
					$posts.hide();
				}
			}

			// Init flexslider for newly added posts.
			fusionInitPostFlexSlider();

			imagesLoaded( $posts, function() {

				// Make sure column IDs work.
				$posts.each( function() {
					var className;

					if ( 'undefined' !== typeof jQuery( this ).attr( 'class' ) ) {
						className = jQuery( this ).attr( 'class' ).replace( /fusion-builder-column-/g, 'fusion-builder-column-' + opts.infid + '-' + page + '-' ).replace( /fusion-builder-nested-column-/g, 'fusion-builder-nested-column-' + opts.infid + '-' + page + '-' );
						jQuery( this ).attr( 'class', className );
					}
				} );

				if ( $filters ) {

					// Loop through all filters.
					$filters.each( function() {
						var $filter     = jQuery( this ),
							$filterName = $filter.children( 'a' ).data( 'filter' ),
							$post;

						if ( $posts ) {

							// Loop through the newly loaded posts.
							$posts.each( function() {
								$post = jQuery( this );

								// Check if one of the new posts has the class of a still hidden filter.
								if ( $post.hasClass( $filterName.substr( 1 ) ) ) {
									if ( $filter.hasClass( 'fusion-hidden' ) ) {
										$filter.fadeIn( 400, function() {
											$filter.removeClass( 'fusion-hidden' );
										} );
									}
								}
							} );
						}
					} );
				}

				if ( 'undefined' !== typeof $filterActive && $filterActive.length ) {
					$posts.each( function() {
						var $post = jQuery( this );

						if ( $post.hasClass( $filterActive ) ) {
							$post.fadeIn();
						}
					} );
				} else {
					$posts.fadeIn();
				}

				if ( $blogInfiniteContainer.hasClass( 'fusion-masonry-posts-cards' ) ) {
					$blogInfiniteContainer.isotope( 'appended', $posts );
				}

				// Trigger fitvids.
				$posts.each( function() {
					jQuery( this ).find( '.full-video, .video-shortcode, .wooslider .slide-content' ).fitVids();
				} );
			} );


			// Hide the load more button, if the currently loaded page is already the last page
			$fusionPostsContainer = $blogInfiniteContainer;
			$currentPage = $fusionPostsContainer.find( '.current' ).html();
			$fusionPostsContainer.find( '.current' ).remove();

			if ( $fusionPostsContainer.data( 'pages' ) == $currentPage ) { // jshint ignore:line
				$fusionPostsContainer.parent().find( '.fusion-loading-container' ).hide();
				$fusionPostsContainer.parent().find( '.fusion-load-more-button' ).hide();
			}

			// Activate lightbox for the newly added posts.
			if ( jQuery( posts ).find( '.fusion-rollover-gallery' ).length || jQuery( posts ).find( '.fusion-lightbox' ).length ) {
				if ( 'individual' === fusionPostCardsVars.lightbox_behavior || ! $originalPosts.find( '.fusion-rollover-gallery' ).length ) {
					window.avadaLightBox.activate_lightbox( jQuery( posts ) );

					$originalPosts = $blogInfiniteContainer.find( '.post' );
				} else {
					galleryName    = $originalPosts.find( '.fusion-rollover-gallery' ).first().data( 'rel' );
					$originalPosts = $blogInfiniteContainer.find( '.post' );

					if ( 'undefined' !== typeof window.$ilInstances[ galleryName ] ) {
						window.$ilInstances[ galleryName ].destroy();
						delete window.$ilInstances[ galleryName ];

						window.avadaLightBox.activate_lightbox( $originalPosts );
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
			// Don't run on live editor, it is separate.
			if ( ! jQuery( 'body' ).hasClass( 'fusion-builder-live-preview' ) && jQuery( $parentWrapperClasses ).hasClass( 'fusion-delayed-animation' ) ) {
				jQuery( $parentWrapperClasses ).awbAnimatePostCards();
			} else if ( jQuery.isFunction( jQuery.fn.initElementAnimations ) ) {
				jQuery( window ).initElementAnimations();
			}
		} );

		// Setup infinite scroll manual loading
		if ( ( jQuery( $blogInfiniteContainer ).hasClass( 'fusion-grid-archive' ) && 'load_more_button' === fusionPostCardsVars.pagination_type ) ||
			jQuery( $blogInfiniteContainer ).hasClass( 'fusion-grid-container-load-more' )
		) {
			jQuery( $blogInfiniteContainer ).infinitescroll( 'unbind' );

			// Load more posts button click
			if ( jQuery( $blogInfiniteContainer ).hasClass( 'fusion-grid-archive' ) ) {
				$loadMoreButton = jQuery( $blogInfiniteContainer ).parent().find( '.fusion-load-more-button' );
			} else {
				$loadMoreButton = jQuery( $blogInfiniteContainer ).parents( '.fusion-grid-archive' ).find( '.fusion-load-more-button' );
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

// Handle post cards filters.
jQuery( document ).on( 'ready fusion-element-render-fusion_post_cards', function( $, cid ) {
	var $elementCheck = 'undefined' !== typeof cid ? jQuery( 'div[data-cid="' + cid + '"]' ).find( '.fusion-post-cards' ) : jQuery( '.fusion-post-cards' );
	$elementCheck.each( function() {

		// Initialize the filters and corresponding posts
		// Check if filters are displayed
		var $postCardsElement = jQuery( this ),
			$filtersWrapper   = $postCardsElement.find( '.fusion-filters' ),
			$filters,
			$filterActiveElement,
			$filterActive,
			$posts;

		// Make the posts visible
		$postCardsElement.find( 'ul' ).fadeIn();

		if ( $filtersWrapper.length ) {

			// Make filters visible
			$filtersWrapper.css( 'display', 'flex' );

			// Set needed variables
			$filters             = $filtersWrapper.find( '.fusion-filter' );
			$filterActiveElement = $filtersWrapper.find( '.fusion-active' ).children( 'a' );
			$filterActive        =  $filterActiveElement.attr( 'data-filter' ).substr( 1 );
			$posts               = jQuery( this ).find( 'ul li.post-card' );

			// Loop through filters
			if ( $filters ) {
				$filters.each( function() {
					var $filter     = jQuery( this ),
						$filterName = $filter.children( 'a' ).data( 'filter' );

					// Loop through post set
					if ( $posts ) {

						// If "All" filter is deactivated, hide posts for later check for active filter
						if ( $filterActive.length ) {
							$posts.hide();
						}

						$posts.each( function() {
							var $post = jQuery( this );

							// If a post belongs to an invisible filter, fade the filter in
							if ( $post.hasClass( $filterName.substr( 1 ) ) ) {
								if ( $filter.hasClass( 'fusion-hidden' ) ) {
									$filter.removeClass( 'fusion-hidden' );
								}
							}

							// If "All" filter is deactivated, only show the items of the first filter (which is auto activated)
							if ( $filterActive.length && $post.hasClass( $filterActive ) ) {
								$post.show();
							}
						} );
					}
				} );
			}
		}

		// Init isotope.
		if ( $postCardsElement.hasClass( 'fusion-post-cards-masonry' ) ) {

			// Remove if existing.
			if ( $postCardsElement.find( '.fusion-grid' ).data( 'isotope' ) ) {
				$postCardsElement.find( '.fusion-grid' ).isotope( 'destroy' );
				$postCardsElement.find( '.fusion-grid' ).removeData( 'isotope' );
			}

			$postCardsElement.find( '.fusion-masonry-posts-cards' ).isotope( {
				itemSelector: '.fusion-layout-column:not(.fusion_builder_column_inner)',
				layoutMode: 'packery'
			} );
		}

		// Handle the filter clicks
		$postCardsElement.find( '.fusion-filters a' ).on( 'click', function( e ) {

			var selector = jQuery( this ).attr( 'data-filter' );

			e.preventDefault();

			// Fade out the post cards posts and fade in the ones matching the selector
			if ( $postCardsElement.hasClass( 'fusion-post-cards-masonry' ) ) {
				$postCardsElement.find( '.fusion-masonry-posts-cards' ).isotope( { filter: selector } );
				jQuery( window ).trigger( 'resize' );
			} else {
				$postCardsElement.find( 'ul li.post-card' ).fadeOut();
				setTimeout( function() {
					$postCardsElement.find( 'ul li.post-card' + selector ).fadeIn();
				}, 400 );
			}

			// Set the active
			jQuery( this ).parents( '.fusion-filters' ).find( '.fusion-filter' ).removeClass( 'fusion-active' );
			jQuery( this ).parent().addClass( 'fusion-active' );
		} );
	} );
} );
