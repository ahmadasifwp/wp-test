/* global fusion, fusionAnimationsVars, cssua */
( function( jQuery ) {

	'use strict';
	window.awbAnimationObservers = {};

	jQuery.fn.initElementAnimations = function() {

		// Remove all observers, needed for re init.
		jQuery.each( window.awbAnimationObservers, function( index, observerArray ) {
			jQuery.each( observerArray[ 0 ], function( elementIndex, element ) {
				observerArray[ 1 ].unobserve( element );
			} );

			delete window.awbAnimationObservers[ index ];
		} );

		// CSS Animations.
		if ( 'IntersectionObserver' in window ) {
			jQuery.each( fusion.getObserverSegmentation( jQuery( '.fusion-animated' ) ), function( index ) {
				var options           = fusion.getAnimationIntersectionData( index ),
					animationObserver = new IntersectionObserver( function( entries, observer ) { // eslint-disable-line no-unused-vars
						jQuery.each( entries, function( key, entry ) {
							var self = jQuery( entry.target ),
								animationType,
								animationDuration,
								animationDelay,
								currentElement,
								totalTime = 0,
								maximumRatio,
								show;

							if ( entry.isIntersecting ) {
								show = true;

								if ( 0 !== options.threshold ) {
									if ( jQuery( window ).height() < self.outerHeight() ) {
										maximumRatio = jQuery( window ).height() / self.outerHeight();

										if ( maximumRatio > entry.intersectionRatio ) {
											show = false;
										}
									} else if ( 1 > entry.intersectionRatio ) {
										show = false;
									}
								}

								if ( show ) {

									// This code is executed for each appeared element.
									if ( ! self.parents( '.fusion-delayed-animation' ).length ) {
										self.css( 'visibility', 'visible' );

										animationType     = self.data( 'animationtype' );
										animationDuration = self.data( 'animationduration' );
										animationDelay    = self.data( 'animationdelay' );

										self.addClass( animationType );

										if ( animationDuration ) {
											self.css( 'animation-duration', animationDuration + 's' );
											totalTime += animationDuration * 1000;
										}

										if ( animationDelay ) {
											self.css( 'animation-delay', animationDelay + 's' );
											totalTime += animationDelay * 1000;
										}

										// Remove the animation class, when the animation is finished.
										// This is done to prevent conflicts with image hover effects.
										if ( totalTime ) {
											currentElement = self;
											setTimeout( function() {
												currentElement.removeClass( animationType );
											}, totalTime );
										}
									}

									// Unobserve.
									animationObserver.unobserve( entry.target );
								}
							}
						} );
					}, options );

				// Observe.
				jQuery( this ).each( function() {
					animationObserver.observe( this );
				} );

				// Add to global observer object.
				window.awbAnimationObservers[ index ] = [ this, animationObserver ];
			} );
		} else {
			jQuery( '.fusion-animated' ).each( function() {
				if ( ! jQuery( this ).parents( '.fusion-delayed-animation' ).length ) {
					jQuery( this ).css( 'visibility', 'visible' );
				}
			} );
		}
	};
}( jQuery ) );

function fusionSetAnimationData( event ) {
	if ( 'off' === fusionAnimationsVars.status_css_animations || ( cssua.ua.mobile && 'desktop_and_mobile' !== fusionAnimationsVars.status_css_animations ) ) {
		jQuery( 'body' ).addClass( 'dont-animate' ).removeClass( 'do-animate' );
	} else {
		jQuery( 'body' ).addClass( 'do-animate' ).removeClass( 'dont-animate' );
		if ( 'undefined' !== typeof event && 'undefined' !== typeof event.data.custom ) {
			jQuery( window ).initElementAnimations();
		}
	}
}
jQuery( document ).ready( function() {
	fusionSetAnimationData();
} );

jQuery( window ).on( 'load', function() {

	// Disable animations in live builder mode.
	if ( jQuery( 'body' ).hasClass( 'fusion-builder-live' ) ) {
		return;
	}

	// Initialize element animations.
	setTimeout( function() {
		jQuery( window ).initElementAnimations();
	}, 300 );
} );

jQuery( window ).on( 'CSSAnimations', { custom: true }, fusionSetAnimationData );
