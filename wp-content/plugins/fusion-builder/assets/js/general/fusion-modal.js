/* global Vimeo, fusionOnloadCallback */
function getScrollBarWidth() {
	var $outer = jQuery( '<div>' ).css( { visibility: 'hidden', width: 100, overflow: 'scroll' } ).appendTo( 'body' ),
		$widthWithScroll = jQuery( '<div>' ).css( { width: '100%' } ).appendTo( $outer ).outerWidth();
	$outer.remove();
	return 100 - $widthWithScroll;
}
jQuery( window ).on( 'load', function() { // Start window_load_1

	var scrollbarWidth = parseFloat( getScrollBarWidth() );

	// Initialize Bootstrap Modals
	jQuery( '.fusion-modal' ).each( function() {

		// Changed from #wrapper to body.
		if ( ! jQuery( this ).parent( '.fusion-builder-element-content' ).length ) {
			jQuery( 'body' ).append( jQuery( this ) );
		}
	} );
	jQuery( '.fusion-modal' ).bind( 'hidden.bs.modal', function() {

		jQuery( 'html' ).css( 'overflow', '' );
		if ( 0 !== scrollbarWidth ) {
			if ( jQuery( 'body' ).hasClass( 'layout-boxed-mode' ) ) {
				jQuery( '#sliders-container .main-flex[data-parallax="1"]' ).css( 'margin-left', function( index, curValue ) {
					return parseFloat( curValue ) + ( scrollbarWidth / 2 )  + 'px';
				} );
			}
			jQuery( 'body, .fusion-is-sticky .fusion-header, .fusion-is-sticky .fusion-secondary-main-menu, #sliders-container .main-flex[data-parallax="1"], #wpadminbar, .fusion-footer.fusion-footer-parallax' ).css( 'padding-right', '' );
		}
	} );

	jQuery( '.fusion-modal' ).bind( 'show.bs.modal', function() {
		var modalWindow,
			fixedSelectors =  'body, .fusion-is-sticky .fusion-header, .fusion-is-sticky .fusion-secondary-main-menu, #sliders-container .main-flex[data-parallax="1"], #wpadminbar, .fusion-footer.fusion-footer-parallax';

		jQuery( 'html' ).css( 'overflow', 'visible' );
		if ( 0 !== scrollbarWidth ) {
			if ( jQuery( 'body' ).hasClass( 'layout-boxed-mode' ) ) {
				fixedSelectors =  'body, #wpadminbar';
				jQuery( '#sliders-container .main-flex[data-parallax="1"]' ).css( 'margin-left', function( index, curValue ) {
					return parseFloat( curValue ) - ( scrollbarWidth / 2 )  + 'px';
				} );
			}
			jQuery( fixedSelectors ).css( 'padding-right', function( index, curValue ) {
				return parseFloat( curValue ) + scrollbarWidth  + 'px';
			} );
		}
		modalWindow = jQuery( this );

		// Reinitialize dynamic content.
		setTimeout( function() {

			// Trigger init for dynamic content.
			jQuery( window ).trigger( 'fusion-dynamic-content-render', modalWindow );

			// Make premium sliders, other elements and nicescroll work.
			jQuery( window ).trigger( 'resize', [ 'modal-open' ] );

			// Activate recaptcha if exists
			if ( 'function' === typeof fusionOnloadCallback ) {
				fusionOnloadCallback();
			}
		}, 350 );
	} );

	if ( 1 == jQuery( '#sliders-container .tfs-slider' ).data( 'parallax' ) ) { // jshint ignore:line
		jQuery( '.fusion-modal' ).css( 'top', jQuery( '.header-wrapper' ).height() );
	}

	// Stop videos and audio in modals when closed.
	jQuery( '.fusion-modal' ).each( function() {
		jQuery( this ).on( 'hide.bs.modal', function() {

			// Youtube
			jQuery( this ).find( '.fusion-youtube iframe' ).each( function() {
				var func = 'pauseVideo';
				this.contentWindow.postMessage( '{"event":"command","func":"' + func + '","args":""}', '*' );
			} );

			// Vimeo
			jQuery( this ).find( '.fusion-vimeo iframe' ).each( function() {
				new Vimeo.Player( this ).pause();
			} );

			// Self-hosted videos.
			jQuery( this ).find( 'video' ).each( function() {
				jQuery( this ).get( 0 ).pause();
			} );

			// Audio.
			jQuery( this ).find( '.mejs-audio' ).each( function() {
				jQuery( this ).find( '.mejs-playpause-button.mejs-pause button' ).trigger( 'click' );
			} );
		} );
	} );

	jQuery( '[data-toggle=modal]' ).on( 'click', function( e ) {
		e.preventDefault();
	} );

	jQuery( '.fusion-modal-text-link' ).on( 'click', function( e ) {
		e.preventDefault();
	} );
} );

jQuery( document ).ready( function() {
	jQuery( '.fusion-modal' ).on( 'shown.bs.modal', function() {
		var modalWindow = jQuery( this );
		modalWindow.find( '.shortcode-map' ).each( function() {
			jQuery( this ).reinitializeGoogleMap();
		} );
	} );
} );
