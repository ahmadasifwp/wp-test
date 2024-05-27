/* global Modernizr, generateSwiperCarousel, fusionResizeCrossfadeImagesContainer, calcSelectArrowDimensions */
jQuery( document ).ready( function() {

	// Open sliding bar on page load if .open-on-load class is present.
	if ( jQuery( '.fusion-sliding-bar-area.open-on-load' ).length ) {
		slidingBarHandling();
		jQuery( '.fusion-sliding-bar-area' ).removeClass( 'open-on-load' );
	}

	// Listen for ESC key and close sliding bar if needed.
	jQuery( document ).on( 'keydown', function( e ) {
		if ( 27 === e.keyCode && jQuery( 'body' ).hasClass( 'fusion-sliding-bar-active' ) && ! jQuery( 'body' ).hasClass( 'modal-open' ) ) {
			slidingBarHandling();
		}
	} );

	// If the toggle is not in main menu, the mobile toggle needs to be set to triangle.
	if ( 'menu' !== jQuery( '.fusion-sliding-bar-area' ).data( 'toggle' ) ) {

		// Mobile mode.
		if ( Modernizr.mq( 'only screen and (max-width: ' + jQuery( '.fusion-sliding-bar-area' ).data( 'breakpoint' ) + 'px)' ) ) {
			jQuery( '.fusion-sliding-bar-area' ).removeClass( 'fusion-sliding-bar-toggle-' + jQuery( '.fusion-sliding-bar-area' ).data( 'toggle' ) );
			jQuery( '.fusion-sliding-bar-area' ).addClass( 'fusion-sliding-bar-toggle-triangle' );
		} else {

			// Desktop mode.
			jQuery( '.fusion-sliding-bar-area' ).removeClass( 'fusion-sliding-bar-toggle-triangle' );
			jQuery( '.fusion-sliding-bar-area' ).addClass( 'fusion-sliding-bar-toggle-' + jQuery( '.fusion-sliding-bar-area' ).data( 'toggle' ) );
		}

		jQuery( window ).on( 'fusion-resize-horizontal', function() {

			// Mobile mode.
			if ( Modernizr.mq( 'only screen and (max-width: ' + jQuery( '.fusion-sliding-bar-area' ).data( 'breakpoint' ) + 'px)' ) ) {
				jQuery( '.fusion-sliding-bar-area' ).removeClass( 'fusion-sliding-bar-toggle-' + jQuery( '.fusion-sliding-bar-area' ).data( 'toggle' ) );
				jQuery( '.fusion-sliding-bar-area' ).addClass( 'fusion-sliding-bar-toggle-triangle' );
			} else {

				// Desktop mode.
				jQuery( '.fusion-sliding-bar-area' ).removeClass( 'fusion-sliding-bar-toggle-triangle' );
				jQuery( '.fusion-sliding-bar-area' ).addClass( 'fusion-sliding-bar-toggle-' + jQuery( '.fusion-sliding-bar-area' ).data( 'toggle' ) );
			}
		} );
	}
} );

jQuery( window ).on( 'load', function() {

	// Handle the sliding bar toggle click.
	jQuery( document.body ).on( 'click', '.fusion-sb-toggle, .awb-icon-sliding-bar, .fusion-sb-close, .avada-sliding-toggle, .awb-menu__sliding-toggle', function( e ) {
		e.preventDefault();

		slidingBarHandling();
	} );
} );

function slidingBarHandling() {
	var slidingBarArea = jQuery( '.fusion-sliding-bar-area' ),
		slidingBar = slidingBarArea.children( '.fusion-sliding-bar' ),
		isOpen = slidingBarArea.hasClass( 'open' );

	// Collapse the bar if it is open.
	if ( isOpen ) {
		slidingBarArea.removeClass( 'open' );
		jQuery( '.awb-icon-sliding-bar, .awb-menu__sliding-toggle' ).removeClass( 'fusion-main-menu-icon-active' );
		jQuery( 'body' ).removeClass( 'fusion-sliding-bar-active' );

		if ( slidingBarArea.hasClass( 'fusion-sliding-bar-position-top' ) || slidingBarArea.hasClass( 'fusion-sliding-bar-position-bottom' ) ) {
			slidingBar.slideUp( 240, 'easeOutQuad' );
		}
	} else if ( ! jQuery( this ).hasClass( 'fusion-sb-close' ) ) {
		slidingBarArea.addClass( 'open' );
		jQuery( '.awb-icon-sliding-bar, .awb-menu__sliding-toggle' ).addClass( 'fusion-main-menu-icon-active' );
		jQuery( 'body' ).addClass( 'fusion-sliding-bar-active' );

		// Expand the bar.
		if ( slidingBarArea.hasClass( 'fusion-sliding-bar-position-top' ) || slidingBarArea.hasClass( 'fusion-sliding-bar-position-bottom' ) ) {
			slidingBar.slideDown( 240, 'easeOutQuad' );
		}

		// Reinitialize dynamic content.
		setTimeout( function() {

			// Google maps.
			if ( 'function' === typeof jQuery.fn.reinitializeGoogleMap ) {
				slidingBar.find( '.shortcode-map' ).each( function() {
					jQuery( this ).reinitializeGoogleMap();
				} );
			}

			// Image Carousels.
			if ( slidingBar.find( '.awb-carousel' ).length && 'function' === typeof generateSwiperCarousel ) {
				generateSwiperCarousel();
			}

			// Portfolio.
			slidingBar.find( '.fusion-portfolio' ).each( function() {
				var $portfolioWrapper   = jQuery( this ).find( '.fusion-portfolio-wrapper' ),
					$portfolioWrapperID = $portfolioWrapper.attr( 'id' );

				// Done for multiple instances of portfolio shortcode. Isotope needs ids to distinguish between instances.
				if ( $portfolioWrapperID ) {
					$portfolioWrapper = jQuery( '#' + $portfolioWrapperID );
				}

				$portfolioWrapper.isotope();
			} );

			// Gallery.
			slidingBar.find( '.fusion-gallery' ).each( function() {
				jQuery( this ).isotope();
			} );

			// Flip Boxes
			if ( 'function' === typeof jQuery.fn.fusionCalcFlipBoxesHeight ) {
				slidingBar.find( '.fusion-flip-boxes' ).not( '.equal-heights' ).find( '.flip-box-inner-wrapper' ).each( function() {
					jQuery( this ).fusionCalcFlipBoxesHeight();
				} );
			}

			if ( 'function' === typeof jQuery.fn.fusionCalcFlipBoxesEqualHeights ) {
				slidingBar.find( '.fusion-flip-boxes.equal-heights' ).each( function() {
					jQuery( this ).fusionCalcFlipBoxesEqualHeights();
				} );
			}

			// Columns.
			if ( 'function' === typeof jQuery.fn.equalHeights ) {
				slidingBar.find( '.fusion-fullwidth.fusion-equal-height-columns' ).each( function() {
					jQuery( this ).find( '.fusion-layout-column .fusion-column-wrapper' ).equalHeights();
				} );
			}

			// Make WooCommerce shortcodes work.
			slidingBar.find( '.crossfade-images' ).each(    function() {
				fusionResizeCrossfadeImagesContainer( jQuery( this ) );
			} );

			// Blog.
			slidingBar.find( '.fusion-blog-shortcode' ).each( function() {
				jQuery( this ).find( '.fusion-blog-layout-grid' ).isotope();
			} );

			// Select arrows.
			if ( 'function' === typeof calcSelectArrowDimensions ) {
				calcSelectArrowDimensions();
			}

			// Make premium sliders, other elements
			jQuery( window ).trigger( 'resize' );
		}, 350 );
	}
}
