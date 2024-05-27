/* global fusionBlogVars, imagesLoaded, fusionInitPostFlexSlider */
jQuery.fn.fusionCalculateBlogEqualHeights = function() {
	var columns = 0,
		numberOfVisibleElements = jQuery( this ).find( '.fusion-post-grid:visible' ).not( '.invisible-after-ajax' ).length,
		sizes = {},
		overallHeight = 0;

	if ( 0 < numberOfVisibleElements ) {
		columns = Math.round( 1 / ( jQuery( this ).children( ':visible' ).first()[ 0 ].getBoundingClientRect().width / jQuery( this ).width() ) );
	}

	jQuery( this ).find( '.invisible-after-ajax' ).hide().removeClass( 'invisible-after-ajax' );

	// Calculate the overall height of the isotope wrapper.
	jQuery( this ).find( '.fusion-post-grid:visible' ).each( function( index ) {
		var row = Math.ceil( ( index + 1 ) / columns ),
			height = jQuery( this ).outerHeight();

		if ( 'undefined' === typeof sizes[ row ] || sizes[ row ] < height ) {
			overallHeight += sizes[ row ] < height ? height - sizes[ row ] : height;
			sizes[ row ] = height;
		}
	} );

	// Only do equal heights calcs when > 1 column (otherwise we are on mobile most likely).
	if ( 1 < columns && 1 < numberOfVisibleElements ) {
		jQuery( this ).find( '.fusion-post-grid:visible' ).each( function( index ) {
			var top = parseInt( jQuery( this ).css( 'top' ), 10 ),
				height = 0;

			if ( 1 === ( index + 1 ) % columns ) {
				if ( jQuery( this ).parent().find( '.fusion-post-grid:visible:eq(' + ( index + columns ) + ')' ).length ) {
					height = parseInt( jQuery( this ).parent().find( '.fusion-post-grid:visible:eq(' + ( index + columns ) + ')' ).css( 'top' ), 10 ) - top;
				} else {
					height = overallHeight - top;
				}
			} else {
				height = parseInt( jQuery( this ).parent().find( '.fusion-post-grid:visible:eq(' + ( index - 1 ) + ')' ).css( 'height' ), 10 );
			}

			jQuery( this ).css( 'height', height + 'px' );
		} );
	}
};

jQuery( document ).ready( function() {
	window.blogEqualHeightsResizeTimer;

	jQuery( window ).on( 'resize', function( event, fireEqualHeights ) {

		if ( 'undefined' === typeof fireEqualHeights || true === fireEqualHeights ) {

			// For all equal heights blogs clear the set element height on resize for correct isotope positioning.
			jQuery( '.fusion-blog-equal-heights' ).each( function() {
				jQuery( this ).find( '.fusion-post-grid' ).css( 'height', '' );
			} );

			// If there are equal heights blogs, trigger isotope once at the end of resize.
			if ( jQuery( '.fusion-blog-equal-heights' ).length ) {

				clearTimeout( window.blogEqualHeightsResizeTimer );
				window.blogEqualHeightsResizeTimer = setTimeout( function() {
					jQuery( '.fusion-blog-equal-heights' ).isotope();
				}, 50 );
			}
		}
	} );
} );

// Flexslider is handled separately in fusion-flexslider.js with other slider code.
jQuery( window ).on( 'load fusion-element-render-fusion_blog', function() {
	var lastTimelineDate,
		collapseMonthVisible;

	if ( jQuery().isotope ) {

		jQuery( '.fusion-blog-layout-grid' ).each( function() {
			var gridContainer = jQuery( this ),
				itemSelector = '.fusion-post-grid',
				layoutMode   = 'packery';

			if ( jQuery( this ).hasClass( 'fusion-blog-layout-masonry' ) ) {
				itemSelector = '.fusion-post-masonry';
			}

			if ( jQuery( this ).hasClass( 'fusion-blog-equal-heights' ) ) {
				layoutMode = 'fitRows';
			}

			if ( jQuery( this ).hasClass( 'fusion-blog-layout-masonry' ) && ! jQuery( this ).hasClass( 'fusion-blog-layout-masonry-has-vertical' ) && 0 < jQuery( this ).find( '.fusion-post-masonry:not(.fusion-grid-sizer)' ).not( '.fusion-element-landscape' ).length ) {
				jQuery( this ).addClass( 'fusion-blog-layout-masonry-has-vertical' );
			}

			if ( gridContainer.data( 'isotope' ) ) {
				gridContainer.isotope( 'destroy' );
				gridContainer.removeData( 'isotope' );
			}

			gridContainer.isotope( {
				layoutMode: layoutMode,
				itemSelector: itemSelector,
				isOriginLeft: jQuery( 'body.rtl' ).length ? false : true,
				resizable: true,
				initLayout: false
			} );

			gridContainer.on( 'layoutComplete', function( event ) {
				var parentGrid = jQuery( event.target );

				// For equal heights layouts we need to fire a resizing function after the isotope layout is complete.
				if ( parentGrid.hasClass( 'fusion-blog-equal-heights' ) ) {
					parentGrid.find( '.fusion-post-grid' ).css( 'height', '' );
					parentGrid.fusionCalculateBlogEqualHeights();
				}

				parentGrid.css( 'min-height', '' );
			} );

			gridContainer.isotope();

			setTimeout( function() {
				jQuery( window ).trigger( 'resize', [ false ] );
			}, 250 );
		} );
	}

	// Timeline vars and click events for infinite scroll
	lastTimelineDate = jQuery( '.fusion-blog-layout-timeline' ).find( '.fusion-timeline-date' ).last().text();
	collapseMonthVisible = true;

	jQuery( '.fusion-blog-layout-timeline' ).find( '.fusion-timeline-date' ).on( 'click', function() {
		jQuery( this ).next( '.fusion-collapse-month' ).slideToggle();
	} );

	jQuery( '.fusion-timeline-icon' ).find( '.awb-icon-bubbles' ).on( 'click', function() {
		if ( collapseMonthVisible ) {
			jQuery( this ).parent().next( '.fusion-blog-layout-timeline' ).find( '.fusion-collapse-month' ).slideUp();
			collapseMonthVisible = false;
		} else {
			jQuery( this ).parent().next( '.fusion-blog-layout-timeline' ).find( '.fusion-collapse-month' ).slideDown();
			collapseMonthVisible = true;
		}
	} );

	// Setup infinite scroll for each blog instance; main blog page and blog shortcodes.
	jQuery( '.fusion-posts-container-infinite' ).each( function( index ) {

		// Set the correct container for blog shortcode infinite scroll.
		var $blogInfiniteContainer = jQuery( this ),
			$originalPosts         = jQuery( this ).find( '.post' ),
			$parentWrapperClasses,
			$fusionPostsContainer,
			$currentPage,
			$loadMoreButton,
			postClass              = 'post',
			galleryName            = '';

		if ( jQuery( this ).find( '.fusion-blog-layout-timeline' ).length ) {
			$blogInfiniteContainer = jQuery( this ).find( '.fusion-blog-layout-timeline' );
		}

		// If more than one blog shortcode is on the page, make sure the infinite scroll selectors are correct.
		$parentWrapperClasses = '';
		if ( $blogInfiniteContainer.closest( '.fusion-blog-shortcode' ).length ) {
			$parentWrapperClasses = '.' + $blogInfiniteContainer.parents( '.fusion-blog-shortcode' ).attr( 'class' ).replace( /\ /g, '.' ) + ' '; // eslint-disable-line no-useless-escape
		}

		// Set the correct post class, when used for an archive element in Layout Builder.
		if ( $blogInfiniteContainer.closest( '.fusion-blog-shortcode' ).parent( '.fusion-archives-tb' ).length ) {
			postClass = $blogInfiniteContainer.closest( '.fusion-blog-shortcode' ).parent( '.fusion-archives-tb' ).data( 'infinite-post-class' );
			postClass = postClass || ''; // for search page just return empty.
		}

		// Infinite scroll for main blog page and blog shortcode.
		jQuery( $blogInfiniteContainer ).infinitescroll( {

			navSelector: $parentWrapperClasses + '.fusion-infinite-scroll-trigger',

			// Selector for the paged navigation (it will be hidden).
			nextSelector: $parentWrapperClasses + 'a.pagination-next',

			// Selector for the NEXT link (to page 2).
			itemSelector: $parentWrapperClasses + 'div.pagination .current, ' + $parentWrapperClasses + 'article' + ( '' === postClass ? '' : '.' + postClass ) + ':not( .fusion-archive-description ), ' + $parentWrapperClasses + '.fusion-collapse-month, ' + $parentWrapperClasses + '.fusion-timeline-date',

			// Selector for all items you'll retrieve.
			loading: {
				finishedMsg: fusionBlogVars.infinite_finished_msg,
				msg: jQuery( '<div class="fusion-loading-container fusion-clearfix"><div class="fusion-loading-spinner"><div class="fusion-spinner-1"></div><div class="fusion-spinner-2"></div><div class="fusion-spinner-3"></div></div><div class="fusion-loading-msg">' + fusionBlogVars.infinite_blog_text + '</div>' )
			},

			maxPage: ( $blogInfiniteContainer.data( 'pages' ) ) ? $blogInfiniteContainer.data( 'pages' ) : undefined,

			infid: 'b' + index,

			errorCallback: function() {

				// If this is an equal heights blog, clear the set element height on resize for correct isotope positioning.
				$blogInfiniteContainer.find( '.fusion-post-grid' ).css( 'height', '' );

				if ( jQuery( $blogInfiniteContainer ).hasClass( 'isotope' ) ) {
					jQuery( $blogInfiniteContainer ).isotope();
				}
			}
		}, function( posts ) {

			// Timeline layout specific actions.
			if ( jQuery( $blogInfiniteContainer ).hasClass( 'fusion-blog-layout-timeline' ) ) {

				// Check if the last already displayed moth is the same as the first newly loaded; if so, delete one label.
				if ( jQuery( posts ).first( '.fusion-timeline-date' ).text() == lastTimelineDate ) { // jshint ignore:line
					jQuery( posts ).first( '.fusion-timeline-date' ).remove();
				}

				// Set the last timeline date to lat of the currently loaded.
				lastTimelineDate = jQuery( $blogInfiniteContainer ).find( '.fusion-timeline-date' ).last().text();

				// Append newly loaded items of the same month to the container that is already there.
				jQuery( $blogInfiniteContainer ).find( '.fusion-timeline-date' ).each( function() {
					jQuery( this ).next( '.fusion-collapse-month' ).append( jQuery( this ).nextUntil( '.fusion-timeline-date', '.fusion-post-timeline' ) );
				} );

				// If all month containers are collapsed, also collapse the new ones.
				if ( ! collapseMonthVisible ) {
					setTimeout( function() {
						jQuery( $blogInfiniteContainer ).find( '.fusion-collapse-month' ).hide();
					}, 200 );
				}

				// Delete empty collapse-month containers
				setTimeout( function() {
					jQuery( $blogInfiniteContainer ).find( '.fusion-collapse-month' ).each( function() {
						if ( ! jQuery( this ).children().length ) {
							jQuery( this ).remove();
						}
					} );
				}, 10 );

				// Reset the click event for the collapse-month toggle
				jQuery( $blogInfiniteContainer ).find( '.fusion-timeline-date' ).unbind( 'click' );
				jQuery( $blogInfiniteContainer ).find( '.fusion-timeline-date' ).on( 'click', function() {
					jQuery( this ).next( '.fusion-collapse-month' ).slideToggle();
				} );
			}

			// Init flexslider for newly added posts.
			fusionInitPostFlexSlider();

			// Grid layout specific actions.
			if ( jQuery( $blogInfiniteContainer ).hasClass( 'fusion-blog-layout-grid' ) && jQuery().isotope	) {
				jQuery( posts ).hide();

				// Add and fade in new posts when all images are loaded.
				imagesLoaded( posts, function() {
					jQuery( posts ).fadeIn();

					// Relayout isotope
					if ( jQuery( $blogInfiniteContainer ).hasClass( 'isotope' ) ) {

						if ( $blogInfiniteContainer.hasClass( 'fusion-portfolio-equal-heights' ) ) {

							// If this is an equal heights blog, clear the set element height on resize for correct isotope positioning.
							$blogInfiniteContainer.find( '.fusion-post-grid' ).css( 'height', '' );
						}

						jQuery( $blogInfiniteContainer ).isotope( 'appended', jQuery( posts ) );
					}

					// Refresh the scrollspy script for one page layouts
					jQuery( '[data-spy="scroll"]' ).each( function() {
						jQuery( this ).scrollspy( 'refresh' );
					} );
				} );
			}

			// Trigger fitvids
			jQuery( posts ).each( function() {
				jQuery( this ).find( '.full-video, .video-shortcode, .wooslider .slide-content' ).fitVids();
			} );

			// Hide the load more button, if the currently loaded page is already the last page
			$fusionPostsContainer = $blogInfiniteContainer;
			if ( jQuery( $blogInfiniteContainer ).hasClass( 'fusion-blog-layout-timeline' ) ) {
				$fusionPostsContainer = jQuery( $blogInfiniteContainer ).parents( '.fusion-posts-container-infinite' );
			}

			$currentPage = $fusionPostsContainer.find( '.current' ).html();
			$fusionPostsContainer.find( '.current' ).remove();

			if ( $fusionPostsContainer.data( 'pages' ) == $currentPage ) { // jshint ignore:line
				$fusionPostsContainer.parent().find( '.fusion-loading-container' ).hide();
				$fusionPostsContainer.parent().find( '.fusion-load-more-button' ).hide();
			}

			// Activate lightbox for the newly added posts.
			if ( jQuery( posts ).find( '.fusion-rollover-gallery' ).length ) {
				if ( 'individual' === fusionBlogVars.lightbox_behavior || ! $originalPosts.find( '.fusion-rollover-gallery' ).length ) {
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
			if ( jQuery.isFunction( jQuery.fn.initElementAnimations ) ) {
				jQuery( window ).initElementAnimations();
			}
		} );

		// Setup infinite scroll manual loading.
		if ( ( jQuery( $blogInfiniteContainer ).hasClass( 'fusion-blog-archive' ) && 'load_more_button' === fusionBlogVars.blog_pagination_type ) ||
			jQuery( $blogInfiniteContainer ).hasClass( 'fusion-posts-container-load-more' ) ||
			( jQuery( $blogInfiniteContainer ).hasClass( 'fusion-blog-layout-timeline' ) && jQuery( $blogInfiniteContainer ).parent().hasClass( 'fusion-posts-container-load-more' ) )
		) {

			jQuery( $blogInfiniteContainer ).infinitescroll( 'unbind' );

			// Load more posts button click.
			if ( jQuery( $blogInfiniteContainer ).hasClass( 'fusion-blog-archive' ) ) {
				$loadMoreButton = jQuery( $blogInfiniteContainer ).parent().find( '.fusion-load-more-button' );
			} else {
				$loadMoreButton = jQuery( $blogInfiniteContainer ).parents( '.fusion-blog-archive' ).find( '.fusion-load-more-button' );
			}

			$loadMoreButton.on( 'click', function( e ) {
				e.preventDefault();

				// Use the retrieve method to get the next set of posts
				jQuery( $blogInfiniteContainer ).infinitescroll( 'retrieve' );
			} );
		}

		// Hide the load more button, if there is only one page
		$fusionPostsContainer = $blogInfiniteContainer;
		if ( jQuery( $blogInfiniteContainer ).hasClass( 'fusion-blog-layout-timeline' ) && jQuery( $blogInfiniteContainer ).parents( '.fusion-blog-layout-timeline-wrapper' ).length ) {
			$fusionPostsContainer = jQuery( $blogInfiniteContainer ).parents( '.fusion-posts-container-infinite' );
		}

		if ( 1 === parseInt( $fusionPostsContainer.data( 'pages' ), 10 ) ) {
			$fusionPostsContainer.parent().find( '.fusion-loading-container' ).hide();
			$fusionPostsContainer.parent().find( '.fusion-load-more-button' ).hide();
		}
	} );
} );
jQuery( window ).on( 'fusion-column-resized', function( $, cid ) {
	var blogElement = jQuery( 'div[data-cid="' + cid + '"]' ).find( '.fusion-blog-layout-grid' );

	if ( blogElement.data( 'isotope' ) ) {
		blogElement.isotope( 'layout' );
	}
} );

jQuery( window ).on( 'fusion-dynamic-content-render', function( event, parent ) {
	var $reInitElems = jQuery( parent ).find( '.fusion-blog-shortcode' );

	if ( 0 < $reInitElems.length ) {
		$reInitElems.each( function() {
			jQuery( this ).find( '.fusion-blog-layout-grid' ).isotope();
		} );
	}
} );
