/* global fusionCountersBox, fusion */
( function( jQuery ) {

	'use strict';

	jQuery.fn.awbAnimateCounterBoxes = function() {
		if ( 'IntersectionObserver' in window ) {
			jQuery.each( fusion.getObserverSegmentation( jQuery( this ) ), function( index ) {
				var options            = fusion.getAnimationIntersectionData( index ),
					counterBoxObserver = new IntersectionObserver( function( entries, observer ) {
						jQuery.each( entries, function( key, entry ) {
							var counterBox         = jQuery( entry.target ),
								countValue         = counterBox.data( 'value' ),
								countDirection     = counterBox.data( 'direction' ),
								delimiter          = counterBox.data( 'delimiter' ),
								fromValue          = 0,
								toValue            = countValue,
								counterBoxSpeed    = fusionCountersBox.counter_box_speed,
								counterBoxInterval = Math.round( fusionCountersBox.counter_box_speed / 100 );

							if ( fusion.shouldObserverEntryAnimate( entry, observer ) ) {
								if ( ! delimiter ) {
									delimiter = '';
								}

								if ( 'down' === countDirection ) {
									fromValue = countValue;
									toValue = 0;
								}

								counterBox.countTo( {
									from: fromValue,
									to: toValue,
									refreshInterval: counterBoxInterval,
									speed: counterBoxSpeed,
									formatter: function( value, formatOptions ) {
										value = value.toFixed( formatOptions.decimals );
										value = value.replace( /\B(?=(\d{3})+(?!\d))/g, delimiter );

										if ( '-0' === value ) {
											value = 0;
										}

										return value;
									}
								} );

								counterBoxObserver.unobserve( entry.target );
							}
						} );
					}, options );

				// Observe.
				jQuery( this ).find( '.display-counter' ).each( function() {
					counterBoxObserver.observe( this );
				} );
			} );
		} else {
			jQuery( this ).find( '.display-counter' ).each( function() {
				jQuery( this ).text( jQuery( this ).data( 'value' ) );
			} );
		}
	};
}( jQuery ) );


jQuery( window ).on( 'load fusion-element-render-fusion-counters_box fusion-element-render-fusion_counter_box', function( $, cid ) {
	var targetEl = 'undefined' !== typeof cid ? jQuery( 'div[data-cid="' + cid + '"]' ) : jQuery( '.fusion-counter-box' );

	targetEl.awbAnimateCounterBoxes();
} );

