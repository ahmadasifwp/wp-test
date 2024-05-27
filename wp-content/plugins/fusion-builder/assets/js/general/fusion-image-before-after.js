( function( jQuery ) {
	'use strict';

	jQuery.fn.fusionImageCompare = function() {

		return this.each( function() {

			var container        = jQuery( this ),
				sliderPct            = 'undefined' !== typeof jQuery( this ).data( 'offset' ) ? jQuery( this ).data( 'offset' ) : 0.5,
				sliderOrientation    = 'undefined' !== typeof jQuery( this ).data( 'orientation' ) ? jQuery( this ).data( 'orientation' ) : 'horizontal',
				moveSliderOnHover    = 'undefined' !== typeof jQuery( this ).data( 'move-slider-on-hover' ) ? jQuery( this ).data( 'move-slider-on-hover' ) : false,
				moveWithHandleOnly   = 'undefined' !== typeof jQuery( this ).data( 'move-with-handle-only' ) ? jQuery( this ).data( 'move-with-handle-only' ) : true,
				clickToMove          = 'undefined' !== typeof jQuery( this ).data( 'click-to-move' ) ? jQuery( this ).data( 'click-to-move' ) : false,

				beforeImg            = container.find( 'img:first' ),
				afterImg             = container.find( 'img:last' ),
				slider               = container.find( '.fusion-image-before-after-handle' ),
				outerLabels          = jQuery( '.before-after-label-out-image-up-down' ),
				offsetX              = 0,
				offsetY              = 0,
				imgWidth             = 0,
				imgHeight            = 0,
				moveTarget           = '',

				// Methods
				calcOffset           = function( dimensionPct ) {
					var w = beforeImg.width();
					var h = beforeImg.height();
					return {
						w: w + 'px',
						h: h + 'px',
						cw: ( dimensionPct * w ) + 'px',
						ch: ( dimensionPct * h ) + 'px'
					};
				},
				adjustContainer = function( offset ) {
					if ( 'vertical' === sliderOrientation ) {
						beforeImg.css( 'clip', 'rect(0,' + offset.w + ',' + offset.ch + ',0)' );
						if ( ! afterImg.hasClass( 'fusion-image-before-after-before' ) ) {
							afterImg.css( 'clip', 'rect(' + offset.ch + ',' + offset.w + ',' + offset.h + ',0)' );
						}
					} else {

						beforeImg.css( 'clip', 'rect(0,' + offset.cw + ',' + offset.h + ',0)' );
						if ( ! afterImg.hasClass( 'fusion-image-before-after-before' ) ) {
							afterImg.css( 'clip', 'rect(0,' + offset.w + ',' + offset.h + ',' + offset.cw + ')' );
						}
					}
					container.css( 'height', offset.h );
					outerLabels.addClass( 'visible' );
				},
				adjustSlider = function( pct ) {
					var offset = calcOffset( pct );
					slider.css( (  'vertical' === sliderOrientation ) ? 'top' : 'left', ( 'vertical' === sliderOrientation ) ? offset.ch : offset.cw );
					adjustContainer( offset );
				},
				minMaxNumber = function( num, min, max ) {
					return Math.max( min, Math.min( max, num ) );
				},
				getSliderPercentage = function( positionX, positionY ) {
					var sliderPercentage = ( 'vertical' === sliderOrientation ) ? ( positionY - offsetY ) / imgHeight : ( positionX - offsetX ) / imgWidth;

					return minMaxNumber( sliderPercentage, 0, 1 );
				},
				onMoveStart = function( e ) {
					if ( ( ( e.distX > e.distY && e.distX < -e.distY ) || ( e.distX < e.distY && e.distX > -e.distY ) ) && 'vertical' !== sliderOrientation ) {
						e.preventDefault();
					} else if ( ( ( e.distX < e.distY && e.distX < -e.distY ) || ( e.distX > e.distY && e.distX > -e.distY ) ) && 'vertical' === sliderOrientation ) {
						e.preventDefault();
					}

					container.addClass( 'active' );

					offsetX   = container.offset().left;
					offsetY   = container.offset().top;
					imgWidth  = beforeImg.width();
					imgHeight = beforeImg.height();
				},
				onMove = function( e ) {
					if ( container.hasClass( 'active' ) ) {
						sliderPct = getSliderPercentage( e.pageX, e.pageY );
						adjustSlider( sliderPct );
					}
				},
				onMoveEnd = function() {
					container.removeClass( 'active' );
				},
				moveOnClick = function( e ) {
					var endOffset;

					offsetX   = container.offset().left;
					offsetY   = container.offset().top;
					imgWidth  = beforeImg.width();
					imgHeight = beforeImg.height();
					sliderPct = getSliderPercentage( e.pageX, e.pageY );
					endOffset = calcOffset( sliderPct );

					container.addClass( 'active' );

					if ( 'vertical' === sliderOrientation ) {
						slider.stop( true, true ).animate( {
							top: endOffset.ch
						}, {
							queue: false,
							duration: 300,
							easing: 'easeOutCubic',
							step: function( now ) {
								var percentage = now / imgHeight,
									offset = calcOffset( percentage );
								adjustContainer( offset );
							},
							complete: function() {
								container.removeClass( 'active' );
							}
						} );
					} else {
						slider.stop( true, true ).animate( {
							left: endOffset.cw
						}, {
							queue: false,
							duration: 300,
							easing: 'easeOutCubic',
							step: function( now ) {
								var percentage = now / imgWidth,
									offset = calcOffset( percentage );

								adjustContainer( offset );
							},
							complete: function() {
								container.removeClass( 'active' );
							}
						} );
					}
				};

			jQuery( window ).on( 'resize.fusion-image-before-after', function() {
				adjustSlider( sliderPct );
			} );

			moveTarget = moveWithHandleOnly ? container : slider;

			moveTarget.on( 'movestart', onMoveStart );
			moveTarget.on( 'move', onMove );
			moveTarget.on( 'moveend', onMoveEnd );

			if ( moveSliderOnHover ) {
				container.on( 'mouseenter', onMoveStart );
				container.on( 'mousemove', onMove );
				container.on( 'mouseleave', onMoveEnd );
			}

			slider.on( 'touchmove', function( e ) {
				e.preventDefault();
			} );

			container.find( 'img' ).on( 'mousedown', function( event ) {
				event.preventDefault();
			} );

			if ( clickToMove ) {
				container.on( 'click', moveOnClick );
			}

			container.addClass( 'initialized' );

			jQuery( window ).trigger( 'resize.fusion-image-before-after' );
		} );
	};
}( jQuery ) );

jQuery( window ).on( 'load', function() {
	jQuery( '.fusion-image-before-after' ).fusionImageCompare();
} );

jQuery( window ).on( 'fusion-dynamic-content-render', function( event, parent ) {
	var $reInitElems = jQuery( parent ).find( '.fusion-image-before-after' );

	if ( 0 < $reInitElems.length ) {
		$reInitElems.fusionImageCompare();
	}
} );

jQuery( document ).on( 'fusion-element-render-fusion_image_before_after fusion-column-resized', function( $, cid ) {
	jQuery( 'div[data-cid="' + cid + '"]' ).find( '.fusion-image-before-after' ).each( function() {
		jQuery.cleanData( jQuery( this ) );
	} );
	jQuery( 'div[data-cid="' + cid + '"]' ).find( '.fusion-image-before-after' ).fusionImageCompare();
} );
