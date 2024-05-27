/* global fusion, avadaSideHeaderVars, Modernizr */
jQuery( document ).ready( function() {
	fusionSideHeaderScroll();

	jQuery( window ).on( 'resize', function() {
		fusionSideHeaderScroll();
	} );
} );

function moveSideHeaderStylingDivs() {
	var topScroll          = jQuery( window ).scrollTop(),
		mainBottomInView   = jQuery( '#main' ).offset().top + jQuery( '#main' ).outerHeight(),
		footerBottomInView = jQuery( '.fusion-footer' ).offset().top + jQuery( '.fusion-footer' ).outerHeight(),
		trigger            = footerBottomInView,
		adminbarHeight     = fusion.getAdminbarHeight(),
		windowHeight       = jQuery( window ).height() - adminbarHeight,
		scrolledPx         = topScroll + windowHeight - footerBottomInView,
		bodyBottomMargin   = jQuery( 'body' ).outerHeight( true ) - jQuery( 'body' ).height() - jQuery( 'body' ).offset().top;

	if ( 'footer_parallax_effect' === avadaSideHeaderVars.footer_special_effects ) {
		trigger    = mainBottomInView;
		scrolledPx = topScroll + windowHeight - mainBottomInView;
	}

	if ( topScroll + windowHeight >= trigger ) {

		if ( scrolledPx <= bodyBottomMargin ) {
			jQuery( '.side-header-background-image, .side-header-background-color, .side-header-border' ).height( 'calc(100vh - ' + adminbarHeight + 'px - ' + scrolledPx  + 'px)' );
		} else if ( scrolledPx > bodyBottomMargin ) {
			jQuery( '.side-header-background-image, .side-header-background-color, .side-header-border' ).height( 'calc(100vh - ' + adminbarHeight + 'px - ' + bodyBottomMargin  + 'px)' );
		}

	} else {
		jQuery( '.side-header-background-image, .side-header-background-color, .side-header-border' ).height( '100vh' );
	}
}

function fusionSideHeaderScroll() {
	var mediaQueryIpad = Modernizr.mq( 'only screen and (min-device-width: 768px) and (max-device-width: 1366px) and (orientation: portrait)' ) ||  Modernizr.mq( 'only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape)' ),
		mediaQueryMobileHeader = Modernizr.mq( 'only screen and (max-width:' + avadaSideHeaderVars.side_header_break_point + 'px)' ),
		footerSpecialEffect = avadaSideHeaderVars.footer_special_effects,
		stickParent = 'body',
		sideHeaderWrapperHeight,
		wrapperHeight = jQuery( '#wrapper' ).height(),
		sideHeaderStylingContainers = jQuery( '.side-header-background-image, .side-header-background-color, .side-header-border' ),
		viewport = jQuery( '.fusion-top-frame' ).is( ':visible' ) ? jQuery( window ).height() - jQuery( '.fusion-top-frame' ).height() - jQuery( '.fusion-bottom-frame' ).height() : jQuery( window ).height(),
		bottoming;

	if ( jQuery( 'body' ).hasClass( 'layout-boxed-mode' ) && ! jQuery( 'body' ).hasClass( 'fusion-top-header' ) && ! jQuery( '.fusion-top-frame' ).is( ':visible' ) ) {
		stickParent = '#boxed-wrapper';
	} else if ( jQuery( '.fusion-top-frame' ).is( ':visible' ) ) {
		if ( ! mediaQueryMobileHeader ) {
			jQuery( '.side-header-wrapper' ).css( 'paddingTop', jQuery( '.fusion-top-frame' ).height() );
			jQuery( '.side-header-wrapper' ).css( 'paddingBottom', jQuery( '.fusion-bottom-frame' ).height() + 20 );
			jQuery( '#side-header' ).css( 'marginTop', -jQuery( '.fusion-top-frame' ).height() );
		} else {
			jQuery( '.side-header-wrapper' ).css( 'paddingTop', '' );
			jQuery( '.side-header-wrapper' ).css( 'paddingBottom', '' );
			jQuery( '#side-header' ).css( 'marginTop', '' );
		}
	}

	if ( ! mediaQueryIpad && 'footer_sticky' !== footerSpecialEffect ) {
		if ( mediaQueryMobileHeader ) {
			if ( jQuery( '#side-header' ).hasClass( 'fusion-side-header-sticky' ) ) {
				jQuery( '.side-header-wrapper, .side-header-background-image, .side-header-background-color, .side-header-border' ).trigger( 'sticky_kit:detach' );

				jQuery( '#side-header' ).removeClass( 'fusion-side-header-sticky' );
			}
		} else {
			bottoming = false;
			if ( jQuery( window ).height() < jQuery( '.side-header-wrapper' ).height() ) {
				bottoming = true;
			}

			// Check if content and side header content are both smaller in height than the viewport.
			sideHeaderWrapperHeight = jQuery( '.side-header-wrapper' ).outerHeight();
			if ( viewport > wrapperHeight && viewport > sideHeaderWrapperHeight ) {
				sideHeaderWrapperHeight = wrapperHeight > sideHeaderWrapperHeight ? wrapperHeight : sideHeaderWrapperHeight;

				jQuery( '.side-header-background-image, .side-header-background-color, .side-header-border' ).height( sideHeaderWrapperHeight );
			} else {
				jQuery( '.side-header-background-image, .side-header-background-color, .side-header-border' ).height( '100vh' );

				// Only needed when site header fits in the viewport.
				if ( jQuery( window ).height() > jQuery( '.side-header-wrapper' ).height() ) {
					jQuery( window ).on( 'scroll', function() {
						window.requestAnimationFrame( moveSideHeaderStylingDivs );
					} );
				}
			}

			if ( ! jQuery( '#side-header' ).hasClass( 'fusion-side-header-sticky' ) ) {
				jQuery( '.side-header-wrapper, .side-header-background-image, .side-header-background-color, .side-header-border' ).trigger( 'sticky_kit:detach' );

				jQuery( '.side-header-wrapper, .side-header-background-image, .side-header-background-color, .side-header-border' ).stick_in_parent( {
					parent: stickParent,
					sticky_class: 'fusion-side-header-stuck',
					bottoming: bottoming,
					offset_top: fusion.getAdminbarHeight()
				} );

				jQuery( '#side-header' ).addClass( 'fusion-side-header-sticky' );
			}
		}

	} else {
		jQuery( '#side-header' ).trigger( 'sticky_kit:detach' );
		jQuery( '.side-header-wrapper' ).trigger( 'sticky_kit:detach' );

		if ( mediaQueryIpad ) {
			jQuery( '.side-header-background-image, .side-header-background-color, .side-header-border' ).height( wrapperHeight  + 'px' );

			setTimeout( function() {
				jQuery( '.side-header-background-image, .side-header-background-color, .side-header-border' ).height( jQuery( '#wrapper' ).height()  + 'px' );
			}, 1000 );
		}
	}

	if ( 'footer_sticky' === footerSpecialEffect ) {
		if ( ! mediaQueryMobileHeader ) {
			if ( jQuery( '.side-header-wrapper' ).height() > viewport || ( jQuery( 'body' ).hasClass( 'layout-boxed-mode' ) && jQuery( 'body' ).hasClass( 'side-header-right' ) ) ) {
				jQuery( '#side-header' ).css( 'position', 'absolute' );
				sideHeaderStylingContainers.css( 'position', 'fixed' );
			} else {
				jQuery( '#side-header' ).css( 'position', 'fixed' );
				sideHeaderStylingContainers.css( 'position', 'absolute' );
			}
		}
	}
}
