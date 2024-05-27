/* global Vimeo */
jQuery( document ).ready( function() { // Start document_ready_1

	// Enable autoplaying videos when not in a modal
	jQuery( '.fusion-video' ).each( function() {
		if ( ! jQuery( this ).parents( '.fusion-modal' ).length && 1 == jQuery( this ).data( 'autoplay' ) && jQuery( this ).is( ':visible' ) ) { // jshint ignore:line
			jQuery( this ).find( 'iframe' ).each( function() {
				var $el = jQuery( this );
				var newSrc;
				var isYtLazyLoadedLocationChanged = false;

				if ( $el.attr( 'data-orig-src' ) ) {
					isYtLazyLoadedLocationChanged = true;
				}

				if ( isYtLazyLoadedLocationChanged ) {
					newSrc = $el.attr( 'data-orig-src' ).replace( 'autoplay=0', 'autoplay=1' );
					$el[ 0 ].contentWindow.location.replace( newSrc );
				} else {
					$el.attr( 'src', $el.attr( 'src' ).replace( 'autoplay=0', 'autoplay=1' ) );
				}

			} );
		}
	} );

	// Video resize
	jQuery( window ).on( 'resize', function() {

		var iframes = document.querySelectorAll( 'iframe' ),
			player,
			i,
			length = iframes.length,
			func   = 'pauseVideo';

		// Stop autoplaying youtube video when not visible on resize.
		jQuery( '.fusion-youtube' ).each( function() {
			if ( ! jQuery( this ).is( ':visible' ) && ( ! jQuery( this ).parents( '.fusion-modal' ).length || jQuery( this ).parents( '.fusion-modal' ).is( ':visible' ) ) ) {
				jQuery( this ).find( 'iframe' ).each( function() {
					this.contentWindow.postMessage( '{"event":"command","func":"' + func + '","args":""}', '*' );
				} );
			}
		} );

		// Stop autoplaying vimeo video when not visible on resize.
		if ( 'undefined' !== typeof Vimeo ) {
			for ( i = 0; i < length; i++ ) {
				if ( 'undefined' !== typeof iframes[ i ].src && -1 < iframes[ i ].src.toLowerCase().indexOf( 'vimeo' ) && ! jQuery( iframes[ i ] ).is( ':visible' ) && ( ! jQuery( iframes[ i ] ).data( 'privacy-src' ) || ! jQuery( iframes[ i ] ).hasClass( 'fusion-hidden' ) ) && ( ! jQuery( iframes[ i ] ).parents( '.fusion-modal' ).length || jQuery( iframes[ i ] ).parents( '.fusion-modal' ).is( ':visible' ) ) ) {
					player = new Vimeo.Player( iframes[ i ] );
					player.pause();
				}
			}
		}
	} );

	jQuery( window ).on( 'fusion-element-render-fusion_youtube fusion-element-render-fusion_vimeo', function( event, cid ) {
		var $targetEl = 'undefined' !== typeof cid ? jQuery( 'div[data-cid="' + cid + '"]' ) :  jQuery( 'body' );
		$targetEl.find( '.full-video, .video-shortcode, .wooslider .slide-content' ).fitVids();
	} );
} );

jQuery( window ).on( 'fusion-dynamic-content-render', function( event, parent ) {
	var $reInitElems = jQuery( parent ).find( '.fusion-youtube' ).find( 'iframe' );

	// Autoplay youtube videos, if the params have been set accordingly in the video shortcodes.
	if ( 0 < $reInitElems.length ) {
		$reInitElems.each( function() {
			var func;
			if ( 1 === jQuery( this ).closest( '.fusion-video' ).data( 'autoplay' ) || 'true' === jQuery( this ).closest( '.fusion-video' ).data( 'autoplay' ) ) {
				jQuery( this ).closest( '.fusion-video' ).data( 'autoplay', 'false' );

				func = 'playVideo';
				this.contentWindow.postMessage( '{"event":"command","func":"' + func + '","args":""}', '*' );
			}
		} );
	}

	// Autoplay vimeo videos, if the params have been set accordingly in the video shortcodes.
	$reInitElems = jQuery( parent ).find( '.fusion-vimeo' ).find( 'iframe' );
	if ( 0 < $reInitElems.length ) {
		$reInitElems.each( function() {
			if ( 1 === jQuery( this ).closest( '.fusion-video' ).data( 'autoplay' ) || 'true' === jQuery( this ).closest( '.fusion-video' ).data( 'autoplay' ) ) {
				jQuery( this ).closest( '.fusion-video' ).data( 'autoplay', 'false' );

				new Vimeo.Player( jQuery( this )[ 0 ] ).play();
			}
		} );
	}
} );
