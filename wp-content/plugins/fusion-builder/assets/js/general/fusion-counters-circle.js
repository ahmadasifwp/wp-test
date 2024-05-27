/* global fusion */
( function( jQuery ) {

	'use strict';
	jQuery.fn.awbAnimateCounterCircles = function() {
		if ( 'IntersectionObserver' in window ) {
			jQuery.each( fusion.getObserverSegmentation( jQuery( this ) ), function( index ) {
				var options               = fusion.getAnimationIntersectionData( index ),
					counterCircleObserver = new IntersectionObserver( function( entries, observer ) {
						jQuery.each( entries, function( key, entry ) {
							var numberOfCircles = jQuery( entry.target ).closest( '.fusion-counters-circle' ).children().length;

							if ( fusion.shouldObserverEntryAnimate( entry, observer ) ) {
								jQuery( entry.target ).awbCalculateCircleSize( true );
								jQuery( entry.target ).awbDrawCircles();

								counterCircleObserver.unobserve( entry.target );

								if ( 1 === numberOfCircles ) {
									setTimeout( function() {
										counterCircleResizeObserver.observe( jQuery( entry.target ).parent()[ 0 ] );
									}, jQuery( entry.target ).children( '.counter-circle' ).attr( 'data-speed' ) );
								}
							}
						} );
					}, options ),
					counterCircleResizeObserver = new ResizeObserver( function( entries ) {
						jQuery.each( entries, function( key, entry ) {

							// Make sure that only currently visible circles are redrawn; important e.g. for tabs.
							if ( jQuery( entry.target ).is( ':hidden' ) ) {
								return;
							}
							jQuery( entry.target ).children().awbRedrawCircles();

						} );
					} );

				// Observe.
				jQuery( this ).children().each( function() {
					counterCircleObserver.observe( this );
				} );
			} );
		} else {
			jQuery( this ).children().each( function() {
				jQuery( this ).awbCalculateCircleSize( true );
				jQuery( this ).awbDrawCircles();
			} );
		}
	};

	jQuery.fn.awbDrawCircles = function() {
		var circle        = jQuery( this ),
			countdown     = circle.children( '.counter-circle' ).attr( 'data-countdown' ),
			filledcolor   = circle.children( '.counter-circle' ).attr( 'data-filledcolor' ),
			unfilledcolor = circle.children( '.counter-circle' ).attr( 'data-unfilledcolor' ),
			scale         = circle.children( '.counter-circle' ).attr( 'data-scale' ),
			size          = circle.children( '.counter-circle' ).attr( 'data-size' ),
			speed         = circle.children( '.counter-circle' ).attr( 'data-speed' ),
			strokesize    = circle.children( '.counter-circle' ).attr( 'data-strokesize' ),
			percentage    = circle.children( '.counter-circle' ).attr( 'data-percent-original' );

		if ( scale ) {
			scale = jQuery( 'body' ).css( 'color' );
		}

		if ( countdown ) {
			circle.children( '.counter-circle' ).attr( 'data-percent', 100 );

			circle.children( '.counter-circle' ).easyPieChart( {
				barColor: filledcolor,
				trackColor: unfilledcolor,
				scaleColor: scale,
				scaleLength: 5,
				lineCap: 'round',
				lineWidth: strokesize,
				size: size,
				rotate: 0,
				animate: {
					duration: speed,
					enabled: true
				}
			} );
			circle.children( '.counter-circle' ).data( 'easyPieChart' ).update( percentage );
		} else {
			circle.children( '.counter-circle' ).easyPieChart( {
				barColor: filledcolor,
				trackColor: unfilledcolor,
				scaleColor: scale,
				scaleLength: 5,
				lineCap: 'round',
				lineWidth: strokesize,
				size: size,
				rotate: 0,
				animate: {
					duration: speed,
					enabled: true
				}
			} );
		}
	};

	jQuery.fn.awbCalculateCircleSize = function( $animate ) {
		var counterCirclesWrapper = jQuery( this ),
			originalSize,
			fusionCountersCircleWidth,
			newSize;

		counterCirclesWrapper.attr( 'data-currentsize', counterCirclesWrapper.width() );
		counterCirclesWrapper.removeAttr( 'style' );
		counterCirclesWrapper.children().removeAttr( 'style' );
		originalSize              = counterCirclesWrapper.data( 'originalsize' );
		fusionCountersCircleWidth = counterCirclesWrapper.parent().width();

		// Overall container width is smaller than one counter circle; e.g. happens for elements in column shortcodes
		if ( fusionCountersCircleWidth < counterCirclesWrapper.data( 'currentsize' ) ) {
			newSize = fusionCountersCircleWidth;

		} else {
			newSize = originalSize;
		}

		counterCirclesWrapper.css( {
			'--awb-size': newSize + 'px'
		} );
		counterCirclesWrapper.find( '.fusion-counter-circle' ).each( function() {
			jQuery( this ).css( {
				'--awb-size': newSize + 'px',
				'--awb-font-size': ( 50 * newSize / 220 ) + 'px'
			} );
			jQuery( this ).data( 'size', newSize );
			jQuery( this ).data( 'strokesize', newSize / 220 * 11 );
			if ( ! $animate ) {
				jQuery( this ).data( 'animate', false );
			}
			jQuery( this ).attr( 'data-size', newSize );
			jQuery( this ).attr( 'data-strokesize', newSize / 220 * 11 );
		} );
	};

	jQuery.fn.awbRedrawCircles = function() {
		var counterCirclesWrapper = jQuery( this );

		counterCirclesWrapper.awbCalculateCircleSize( false );
		counterCirclesWrapper.find( 'canvas' ).remove();
		counterCirclesWrapper.find( '.counter-circle' ).removeData( 'easyPieChart' );
		counterCirclesWrapper.awbDrawCircles();
	};
}( jQuery ) );

jQuery( window ).on( 'load', function() {

	jQuery( '.fusion-counters-circle' ).awbAnimateCounterCircles();

} );
jQuery( window ).on( 'fusion-element-render-fusion_counter_circle', function( event, cid ) {
	var element = jQuery( 'div[data-cid="' + cid + '"]' );

	element.awbRedrawCircles();
} );
