/* global fusion */
( function( jQuery ) {

	'use strict';

	/**
	 * Intersection observer for info circles.
	 *
	 * @since 3.9
	 * @return {void}
	 */
	jQuery.fn.awbAnimateInfoCircles = function() {

		// Intersection observer to init Info Circles..
		if ( 'IntersectionObserver' in window ) {
			jQuery.each( fusion.getObserverSegmentation( jQuery( this ) ), function( index ) {

				const options = fusion.getAnimationIntersectionData( index ),
					infoCirclesObserver = new IntersectionObserver( function( entries, observer ) {

						jQuery.each( entries, function( key, entry ) {
							if ( fusion.shouldObserverEntryAnimate( entry, observer ) ) {

								// Init Info Circles.
								setTimeout( function() {
									jQuery( entry.target ).awbInitInfoCircles();
								}, 600 );

								infoCirclesObserver.unobserve( entry.target );
							}
						} );

					}, options );

				// Observer.
				jQuery( this ).each( function() {
					infoCirclesObserver.observe( this );
				} );
			} );
		} else {

			// If no observer available, init Info Circles.
			setTimeout( function() {
				jQuery( this ).awbInitInfoCircles();
			}, 600 );
		}
	};


	/**
	 * Inits info circles.
	 *
	 * @since 3.9
	 * @return {void}
	 */
	jQuery.fn.awbInitInfoCircles = function() {
		const wrapper    = jQuery( this ),
			circles      = wrapper.find( '.awb-circles-info-tab-link' ),
			iconsWrapper = ! wrapper.hasClass( 'icons-on-outer-circle' ) ? wrapper.find( '.awb-circles-info-content-wrapper' ) : wrapper.find( '.awb-circles-info-wrapper' ),
			parent       = iconsWrapper[ 0 ].getBoundingClientRect(),
			isAuto       = wrapper.data( 'auto-rotation' ),
			autoTime     = wrapper.data( 'auto-rotation-time' ),
			pauseOnHover = wrapper.data( 'pause-on-hover' );

		var timer      = jQuery( this ).data( 'timer' ),
			activation = wrapper.data( 'activation-type' );

		// Spread icons.
		Array.from( circles ).reverse().forEach( function ( circle, index ) {
				const angle     = index * ( 360 / circles.length ),
					parentWidth = parent.width / 2,
					angleValue  = angle * Math.PI,
					xAxis       = parseFloat( parentWidth * Math.cos( angleValue / 180 ) ).toFixed( 5 ),
					yAxis       = parseFloat( parentWidth * Math.sin( angleValue / 180 ) ).toFixed( 5 );

				jQuery( circle ).css( 'transform', 'translate3d(' + xAxis + 'px,' + yAxis + 'px,0)' );
		} );

		// Click and hover activation.
		if ( 'undefined' !== typeof activation ) {

			// Unbind event.
			jQuery( this ).find( '.awb-circles-info-tab-link span' ).off( 'click mouseover' );


			if ( jQuery( 'body' ).hasClass( 'fusion-builder-live' ) && 'mouseover' === activation ) {
				activation += ' click';
			}

			// Bind event.
			jQuery.each( jQuery( this ).find( '.awb-circles-info-tab-link' ), function() {
				jQuery( this ).find( 'span' ).on( activation, function( event ) {
					const element = jQuery( event.target ).closest( '.awb-circles-info-tab-link' );
					jQuery( element ).awbToggleInfoCircle();
					event.preventDefault();
				} );
			} );

			// Activate first.
			if ( ! jQuery( this ).find( '.awb-circles-info-tab-link.active' ).length ) {
				jQuery( this ).find( '.awb-circles-info-tab-link' ).first().awbToggleInfoCircle();
			} else {
				jQuery( this ).find( '.awb-circles-info-tab-link.active' ).awbToggleInfoCircle();
			}
		}

		// Auto rotation.
		if ( 'undefined' !== typeof isAuto && 'yes' === isAuto ) {

			// Activate first.
			if ( ! jQuery( this ).find( '.awb-circles-info-tab-link.active' ).length ) {
				awbAddInfoCircleClasses( wrapper, jQuery( this ).find( '.awb-circles-info-tab-link' ).first().data( 'id' ) );
			} else {
				awbAddInfoCircleClasses( wrapper, jQuery( this ).find( '.awb-circles-info-tab-link.active' ).data( 'id' ) );
			}

			// Clear interval to prevent multiple.
			clearInterval( timer );

			if ( 'undefined' !== typeof pauseOnHover && 'yes' === pauseOnHover ) {
				wrapper.off( 'mouseenter mouseleave' );
				wrapper.hover(
					function() { // Mouse enter.
						wrapper.addClass( 'pause' );
					}, function() { // Mouse leave.
						wrapper.removeClass( 'pause' );
					}
				);
			}

			// The timer.
			timer = awbInfoCirclesTimer( wrapper, autoTime );
			wrapper.data( 'timer', timer );
		} else {

			// Clear Interval.
			clearInterval( timer );
		}
	};

	/**
	 * Toggle info circles.
	 *
	 * @since 3.9
	 * @return {void}
	 */
	jQuery.fn.awbToggleInfoCircle = function() {
		const parent = jQuery( this ).closest( '.awb-circles-info' ),
			element = jQuery( this ).closest( '.awb-circles-info-tab-link' ).attr( 'data-id' );

		// Remove classes.
		awbRemoveInfoCircleClass( parent );

		// Add Classes.
		awbAddInfoCircleClasses( parent, element );
	};

	/**
	 * Info circles auto rotation timer.
	 *
	 * @since 3.9
	 * @param {Object} wrapper  - The wrapper object.
	 * @param {int}    autoTime - The interval time.
	 * @return {int}
	 */
	const awbInfoCirclesTimer = function( wrapper, autoTime ) {
		var timer = setInterval( function() {
			var current,
				angle;

			if ( wrapper.hasClass( 'pause' ) ) {
				return;
			}

			if ( wrapper.find( '.awb-circles-info-tab-link.active' ).next().length ) {
				current = wrapper.find( '.awb-circles-info-tab-link.active' ).data( 'id' );
				wrapper.find( '.awb-circles-info-tab-link.active' ).next().find( 'span' ).awbToggleInfoCircle();
			} else {
				current = 0;
				wrapper.find( '.awb-circles-info-tab-link' ).first().find( 'span' ).awbToggleInfoCircle();
			}

			angle = current * 36;

			wrapper.find( '.awb-circles-info-icons-wrapper i' ).css( 'transform', 'rotate(' + ( 360 - angle ) + 'deg)' );
			wrapper.find( '.awb-circles-info-icons-wrapper' ).css( 'transform', 'rotate(' + ( angle ) + 'deg) ' );
		}, autoTime );

		return timer;
	};

	/**
	 * Removes active classes.
	 *
	 * @since 3.9
	 * @param {Object} parent  - The parent wrapper object.
	 * @return {void}
	 */
	const awbRemoveInfoCircleClass = function( parent ) {
		parent.find( '.awb-circles-info-tab-link' ).removeClass( 'active' );
		parent.find( '.awb-circle-info' ).removeClass( 'active' );
	};

	/**
	 * Adds active classes.
	 *
	 * @since 3.9
	 * @param {Object} parent  - The parent wrapper object.
	 * @param {int}    element - The current element ID.
	 * @return {void}
	 */
	const awbAddInfoCircleClasses =  function( parent, element ) {
		parent.find( '.awb-circles-info-tab-link[data-id="' + element + '"]' ).addClass( 'active' );
		parent.find( '.awb-circle-info[data-id="' + element + '"]' ).addClass( 'active' );
	};
}( jQuery ) );


jQuery( window ).on( 'load resize fusion-element-render-fusion_circles_info', function( event, cid ) {
	const targetEl = 'undefined' !== typeof cid ? jQuery( 'div[data-cid="' + cid + '"]' ).find( '.awb-circles-info' ) : jQuery( '.awb-circles-info' );
	targetEl.awbAnimateInfoCircles();
} );

jQuery( document ).ready( function() {

	// Circles info link.
	jQuery( '.awb-circle-info.link-area-box' ).on( 'click', function() {
		if ( jQuery( this ).data( 'link' ) ) {
			if ( '_blank' === jQuery( this ).data( 'link-target' ) ) {
				window.open( jQuery( this ).data( 'link' ), '_blank' );
				jQuery( this ).find( '.awb-circles-info-title a' ).removeAttr( 'href' );
			} else if ( ! jQuery( 'body' ).hasClass( 'fusion-builder-live' ) ) {

				if ( '#' === jQuery( this ).data( 'link' ).substring( 0, 1 ) ) {
					jQuery( this ).fusion_scroll_to_anchor_target();
				} else {
					window.location = jQuery( this ).data( 'link' );
				}
			}
			jQuery( this ).find( '.awb-circles-info-title a' ).attr( 'target', '' );
		}
	} );
} );
