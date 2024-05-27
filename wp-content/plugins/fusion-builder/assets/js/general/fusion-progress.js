/* global fusion */
( function( jQuery ) {

	'use strict';

	jQuery.fn.awbAnimateProgressBar = function() {
		if ( 'IntersectionObserver' in window ) {
			jQuery.each( fusion.getObserverSegmentation( jQuery( this ) ), function( index ) {
				var options           = fusion.getAnimationIntersectionData( index ),
					progressBarObserver = new IntersectionObserver( function( entries, observer ) {
						jQuery.each( entries, function( key, entry ) {
							if ( fusion.shouldObserverEntryAnimate( entry, observer ) ) {
								jQuery( entry.target ).find( '.progress' ).css( 'width', function() {
									return jQuery( this ).attr( 'aria-valuenow' ) + '%';
								} );

								progressBarObserver.unobserve( entry.target );
							}
						} );
					}, options );

				// Observe.
				jQuery( this ).each( function() {
					progressBarObserver.observe( this );
				} );
			} );
		} else {
			jQuery( this ).find( '.progress' ).css( 'width', function() {
				return jQuery( this ).attr( 'aria-valuenow' ) + '%';
			} );
		}
	};
}( jQuery ) );


jQuery( window ).on( 'load fusion-element-render-fusion_progress', function( event, cid ) {
	var targetEl = 'undefined' !== typeof cid ? jQuery( 'div[data-cid="' + cid + '"]' ).find( '.fusion-progressbar' ) : jQuery( '.fusion-progressbar' );

	targetEl.awbAnimateProgressBar();
} );
