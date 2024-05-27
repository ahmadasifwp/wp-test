/* global avadaParallaxFooterVars, Modernizr */
( function( jQuery ) {

	'use strict';

	// Initialize parallax footer
	jQuery.fn.fusion_footer_parallax = function() {
		var $footer = jQuery( this ),
			$main   = jQuery( '#main' ),
			$sliderHeight,
			$footerHeight,
			bodyTopMargin = 0,
			bodyBottomMargin = 0,
			footerCss        = {},
			mainCss          = {};

		if ( ! $footer.length ) {
			return;
		}

		// Needed timeout for dynamic footer content
		setTimeout( function() {
			var $wrapperHeight = ( 'fixed' === $footer.css( 'position' ) ) ? jQuery( '#wrapper' ).outerHeight() : jQuery( '#wrapper' ).outerHeight() - $footer.outerHeight();

			if ( jQuery( 'body' ).hasClass( 'layout-boxed-mode' ) && ! jQuery( 'body' ).hasClass( 'fusion-top-header' ) ) {
				bodyTopMargin    = jQuery( 'body' ).offset().top;
				bodyBottomMargin = jQuery( 'body' ).outerHeight( true ) - jQuery( 'body' ).outerHeight() - bodyTopMargin;
			}

			// On desktops, when the footer is smaller in height than the viewport, enable parallax footer effect
			if ( $footer.outerHeight() + bodyBottomMargin < jQuery( window ).height() && $wrapperHeight > jQuery( window ).height() && ( 'top' === avadaParallaxFooterVars.header_position || ( 'top' !== avadaParallaxFooterVars.header_position && jQuery( window ).height() > jQuery( '.side-header-wrapper' ).height() ) ) && ( Modernizr.mq( 'only screen and (min-width:'  + parseInt( avadaParallaxFooterVars.side_header_break_point, 10 ) + 'px)' ) && ! Modernizr.mq( 'only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait)' ) && ! Modernizr.mq( 'only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape)' ) ) ) {
				if ( jQuery( 'body' ).hasClass( 'layout-boxed-mode' ) ) {
					footerCss = {
						'margin-left': 'auto',
						'margin-right': 'auto',
						padding: '',
						'max-width': 'var(--site_width)'
					};
				} else {
					footerCss = {
						margin: '',
						padding: '',
						'max-width': ''
					};
				}

				if ( jQuery( 'body' ).hasClass( 'layout-boxed-mode' ) && ! jQuery( 'body' ).hasClass( 'fusion-top-header' ) ) {
					footerCss.bottom = bodyBottomMargin;
				}

				// Update footer CSS.
				$footer.css( footerCss );

				mainCss[ 'margin-bottom' ] = $footer.outerHeight() + bodyBottomMargin;

				if ( 1 <= jQuery( '.tfs-slider' ).length && 1 == jQuery( '.tfs-slider' ).data( 'parallax' ) && $footer.hasClass( 'fusion-footer-parallax' ) ) {
					$sliderHeight = jQuery( '.tfs-slider' ).closest( '#sliders-container' ).outerHeight();
					$footerHeight = $footer.outerHeight();
					if ( $sliderHeight > $footerHeight ) {
						mainCss[ 'min-height' ] = $sliderHeight + 10;
					} else if ( $footerHeight > $sliderHeight ) {
						mainCss[ 'min-height' ] = $footerHeight + 10;
					}
				}

				$footer.addClass( 'awb-footer-fixed' );
				// Update #main CSS.
				$main.css( mainCss );

			// On mobiles, or when the footer is larger in height than the viewport, the footer will be relative.
			} else {
				$footer.css( {
					margin: '0',
					padding: '0',
					bottom: 0,
					'max-width': ''
				} );
				$main.css( {
					'margin-bottom': '',
					'min-height': ''
				} );

				$footer.removeClass( 'awb-footer-fixed' );
			}
		}, 200 );
	};
}( jQuery ) );

jQuery( window ).on( 'load', function() {

	// Handle parallax footer
	jQuery( '.fusion-footer-parallax' ).fusion_footer_parallax();

	jQuery( window ).on( 'fusion-resize-vertical fusion-parallax-footer-refresh', function() {
		jQuery( '.fusion-footer-parallax' ).fusion_footer_parallax();
	} );
} );
