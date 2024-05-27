/* global fusion */
( function( jQuery ) {

	'use strict';

	jQuery.fn.awbAnimateContentBoxes = function() {
		if ( 'IntersectionObserver' in window ) {
			jQuery.each( fusion.getObserverSegmentation( jQuery( '.fusion-content-boxes.content-boxes-timeline-layout, .fusion-content-boxes.fusion-delayed-animation' ) ), function( index ) {
				var options              = fusion.getAnimationIntersectionData( index ),
					contentBoxesObserver = new IntersectionObserver( function( entries, observer ) {
						jQuery.each( entries, function( key, entry ) {
							var contentBoxes = jQuery( entry.target ),
								delay        = 0,
								animationType,
								animationDuration;

							if ( fusion.shouldObserverEntryAnimate( entry, observer ) ) {
								contentBoxes.find( '.content-box-column' ).each( function() {
									var contentBox = jQuery( this ),
										target     = contentBox.find( '.fusion-animated' );

									setTimeout( function() {
										target.css( 'visibility', 'visible' );

										// This code is executed for each appeared element.
										animationType     = target.data( 'animationtype' );
										animationDuration = target.data( 'animationduration' );

										target.addClass( animationType );

										if ( animationDuration ) {
											target.css( 'animation-duration', animationDuration + 's' );
										}

										if ( contentBoxes.hasClass( 'content-boxes-timeline-horizontal' ) || contentBoxes.hasClass( 'content-boxes-timeline-vertical' ) ) {
											contentBox.addClass( 'fusion-appear' );
										}

										setTimeout( function() {
											target.removeClass( animationType );
										}, animationDuration * 1000 );
									}, delay );

									delay += parseInt( contentBoxes.attr( 'data-animation-delay' ), 10 );
								} );

								contentBoxesObserver.unobserve( entry.target );
							}
						} );
					}, options );

				// Observe.
				jQuery( this ).each( function() {
					contentBoxesObserver.observe( this );
				} );
			} );
		} else {
			jQuery( '.fusion-content-boxes.content-boxes-timeline-layout .content-box-column .fusion-animated, .fusion-content-boxes.fusion-delayed-animation .content-box-column .fusion-animated' ).each( function() {
				var contentBoxes = jQuery( this ).closest( '.fusion-content-boxes' );

				if ( contentBoxes.hasClass( 'content-boxes-timeline-horizontal' ) || contentBoxes.hasClass( 'content-boxes-timeline-vertical' ) ) {
					contentBoxes.find( '.content-box-column' ).addClass( 'fusion-appear' );
				}

				jQuery( this ).css( 'visibility', 'visible' );
			} );
		}
	};
}( jQuery ) );

jQuery( window ).on( 'load', function() {
	if ( 'function' === typeof jQuery.fn.equalHeights ) {
		jQuery( '.content-boxes-icon-boxed' ).each( function() {
			jQuery( this ).find( '.content-box-column .content-wrapper-boxed' ).equalHeights();
			jQuery( this ).find( '.content-box-column .content-wrapper-boxed' ).css( 'overflow', 'visible' );
		} );

		jQuery( window ).on( 'fusion-resize-horizontal', function() {
			jQuery( '.content-boxes-icon-boxed' ).each( function() {
				jQuery( this ).find( '.content-box-column .content-wrapper-boxed' ).equalHeights();
				jQuery( this ).find( '.content-box-column .content-wrapper-boxed' ).css( 'overflow', 'visible' );
			} );
		} );

		jQuery( '.content-boxes-clean-vertical' ).each( function() {
			jQuery( this ).find( '.content-box-column .col' ).equalHeights();
			jQuery( this ).find( '.content-box-column .col' ).css( 'overflow', 'visible' );
		} );

		jQuery( window ).on( 'fusion-resize-horizontal', function() {
			jQuery( '.content-boxes-clean-vertical' ).each( function() {
				jQuery( this ).find( '.content-box-column .col' ).equalHeights();
				jQuery( this ).find( '.content-box-column .col' ).css( 'overflow', 'visible' );
			} );
		} );

		jQuery( '.content-boxes-clean-horizontal' ).each( function() {
			jQuery( this ).find( '.content-box-column .col' ).equalHeights();
			jQuery( this ).find( '.content-box-column .col' ).css( 'overflow', 'visible' );
		} );

		jQuery( window ).on( 'fusion-resize-horizontal', function() {
			jQuery( '.content-boxes-clean-horizontal' ).each( function() {
				jQuery( this ).find( '.content-box-column .col' ).equalHeights();
				jQuery( this ).find( '.content-box-column .col' ).css( 'overflow', 'visible' );
			} );
		} );
	}
} );

jQuery( document ).ready( function() {

	// Content Boxes Link Area
	jQuery( '.link-area-box' ).on( 'click', function() {
		if ( jQuery( this ).data( 'link' ) ) {
			if ( '_blank' === jQuery( this ).data( 'link-target' ) ) {
				window.open( jQuery( this ).data( 'link' ), '_blank' );
				jQuery( this ).find( '.heading-link' ).removeAttr( 'href' );
				jQuery( this ).find( '.fusion-read-more' ).removeAttr( 'href' );
			} else if ( ! jQuery( 'body' ).hasClass( 'fusion-builder-live' ) ) {

				if ( '#' === jQuery( this ).data( 'link' ).substring( 0, 1 ) ) {
					jQuery( this ).fusion_scroll_to_anchor_target();
				} else {
					window.location = jQuery( this ).data( 'link' );
				}
			}
			jQuery( this ).find( '.heading-link' ).attr( 'target', '' );
			jQuery( this ).find( '.fusion-read-more' ).attr( 'target', '' );
		}
	} );

	// Clean Horizontal and Vertical
	jQuery( '.link-type-button' ).each( function() {
		var $buttonHeight;
		if ( 1 <= jQuery( this ).parents( '.content-boxes-clean-vertical' ).length ) {
			$buttonHeight = jQuery( '.fusion-read-more-button' ).outerHeight();
			jQuery( this ).find( '.fusion-read-more-button' ).css( 'top', $buttonHeight / 2 );
		}
	} );

	jQuery( '.link-area-link-icon .fusion-read-more-button, .link-area-link-icon .fusion-read-more, .link-area-link-icon .heading' ).on( 'mouseenter', function() {
		jQuery( this ).parents( '.link-area-link-icon' ).addClass( 'link-area-link-icon-hover' );
	} );
	jQuery( '.link-area-link-icon .fusion-read-more-button, .link-area-link-icon .fusion-read-more, .link-area-link-icon .heading' ).on( 'mouseleave', function() {
		jQuery( this ).parents( '.link-area-link-icon' ).removeClass( 'link-area-link-icon-hover' );
	} );

	jQuery( '.link-area-box' ).on( 'mouseenter', function() {
		jQuery( this ).addClass( 'link-area-box-hover' );
	} );
	jQuery( '.link-area-box' ).on( 'mouseleave', function() {
		jQuery( this ).removeClass( 'link-area-box-hover' );
	} );

	// Content Boxes Timeline Design.
	jQuery( window ).awbAnimateContentBoxes();
} );
