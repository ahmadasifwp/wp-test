/* global fusion */
( function( jQuery ) {

	'use strict';

	// Handle the cycling.
	function slideTestimonials( testimonials, navigationChildren ) {
		var firstSlide   = testimonials.children( '.review' ).first(),
			currentSlide = testimonials.children( '.active-testimonial' ),
			nextSlide;

		if ( currentSlide.length ) {
			currentSlide.removeClass( 'active-testimonial' );
			nextSlide = currentSlide.next();

			if ( nextSlide.length ) {
				nextSlide.addClass( 'active-testimonial' );
			} else {
				firstSlide.addClass( 'active-testimonial' );
			}
		} else {
			firstSlide.addClass( 'active-testimonial' );
		}

		testimonials.css( 'height', testimonials.children( '.active-testimonial' ).height() );

		if ( navigationChildren.length ) {
			navigationChildren.removeClass( 'activeSlide' );
			navigationChildren.eq( testimonials.children().index( testimonials.children( '.active-testimonial' ) ) ).addClass( 'activeSlide' );
		}
	}

	jQuery.fn.initTestimonials = function() {
		if ( 'IntersectionObserver' in window ) {
			jQuery( this ).each( function() {
				var options             = fusion.getAnimationIntersectionData( jQuery( this ) ),
					testimonialObserver = new IntersectionObserver( function( entries, observer ) { // eslint-disable-line no-unused-vars
						setupTestimonials( entries, testimonialObserver );
					}, options );

				// Observe.
				jQuery( this ).each( function() {
					testimonialObserver.observe( this );
				} );
			} );
		} else {
			jQuery( this ).each( function() {
				setupTestimonials( jQuery( this ), false );
			} );
		}

		function setupTestimonials( entries, testimonialObserver ) {
			jQuery.each( entries, function( key, entry ) {
				var intersection        = 'IntersectionObserver' in window ? true : false,
					testimonials        = intersection ? jQuery( entry.target ) : jQuery( entry ),
					wrapper             = testimonials.parent(),
					navigation          = wrapper.children( '.testimonial-pagination' ),
					navigationChildren  = navigation.length ? navigation.children() : {};

				if ( ( intersection && entry.isIntersecting ) || ! intersection ) {
					testimonials.css( 'height', testimonials.children( '.active-testimonial' ).height() );

					// Cycling, if set in options.
					if ( wrapper.data( 'speed' ) ) {
						wrapper.attr( 'data-interval', setInterval( function() {
							slideTestimonials( testimonials, navigationChildren );
						}, wrapper.data( 'speed' ) ) );
					}

					// Handle navigation click.
					if ( navigationChildren.length ) {
						navigationChildren.on( 'click', function( e ) {
							e.preventDefault();

							// Remove the active slide class and set to current.
							navigationChildren.removeClass( 'activeSlide' );
							jQuery( this ).addClass( 'activeSlide' );

							// Remove the active testimonial class, set to current, and set height.
							testimonials.children().removeClass( 'active-testimonial' ).eq( navigationChildren.index( jQuery( this ) ) ).addClass( 'active-testimonial' );
							testimonials.css( 'height', testimonials.children( '.active-testimonial' ).height() );

							// Clear last intervall and set new.
							if ( wrapper.data( 'speed' ) ) {
								clearInterval( parseInt( wrapper.attr( 'data-interval' ) ) );

								wrapper.attr( 'data-interval', setInterval( function() {
									slideTestimonials( testimonials, navigationChildren );
								}, wrapper.data( 'speed' ) ) );
							}
						} );
					}

					if ( intersection ) {
						testimonialObserver.unobserve( entry.target );
					}
				}
			} );
		}
	};
}( jQuery ) );


jQuery( window ).on( 'load fusion-element-render-fusion_testimonials', function( $, cid ) {
	var testimonials = 'undefined' !== typeof cid ? jQuery( 'div[data-cid="' + cid + '"]' ).find( '.reviews' ) : jQuery( '.fusion-testimonials .reviews' );
	if ( 'undefined' !== typeof cid && ! testimonials.length ) {
		testimonials = jQuery( 'div[data-cid="' + cid + '"]' ).parents( '.fusion-testimonials' ).first().find( '.reviews' );
	}

	testimonials.initTestimonials();

	jQuery( window ).on( 'fusion-resize-horizontal', function() {
		jQuery( '.fusion-testimonials .reviews' ).each( function() {
			jQuery( this ).css( 'height', jQuery( this ).children( '.active-testimonial' ).height() );
		} );
	} );
} );

jQuery( window ).on( 'fusion-dynamic-content-render', function( event, parent ) {
	var $reInitElems = jQuery( parent ).find( '.fusion-testimonials .reviews' );

	if ( 0 < $reInitElems.length ) {
		$reInitElems.each( function() {
			jQuery( this ).css( 'height', jQuery( this ).children( '.active-testimonial' ).height() );
		} );
	}
} );
