/* global fusion */
( function( jQuery ) {

	'use strict';

	// Creates the highlights and rotation effects for the title element.
	jQuery.fn.awbAnimateTitleHighlightsAndRotations = function() {
		if ( 'IntersectionObserver' in window ) {
			jQuery.each( fusion.getObserverSegmentation( jQuery( this ) ), function( index ) {
				var options       = fusion.getAnimationIntersectionData( index ),
					titleObserver = new IntersectionObserver( function( entries, observer ) {
						jQuery.each( entries, function( key, entry ) {
							var titleWrapper = jQuery( entry.target );

							if ( fusion.shouldObserverEntryAnimate( entry, observer ) ) {
								if ( jQuery( titleWrapper ).hasClass( 'fusion-title-rotating' ) ) {
									jQuery( titleWrapper ).animateTitleRotations();
								}

								if ( jQuery( titleWrapper ).hasClass( 'fusion-title-highlight' ) ) {
									jQuery( titleWrapper ).animateTitleHighlights();
								}

								titleObserver.unobserve( entry.target );
							}
						} );
					}, options );

				// Observe.
				jQuery( this ).each( function() {
					titleObserver.observe( this );
				} );
			} );
		} else {
			jQuery( this ).each( function() {
				var titleWrapper = jQuery( this );

				if ( jQuery( titleWrapper ).hasClass( 'fusion-title-rotating' ) ) {
					jQuery( titleWrapper ).animateTitleRotations();
				}

				if ( jQuery( titleWrapper ).hasClass( 'fusion-title-highlight' ) ) {
					jQuery( titleWrapper ).animateTitleHighlights();
				}
			} );
		}
	};

	jQuery.fn.animateTitleRotations = function() {
		var titleWrapper        = jQuery( this ),
			textsWrapper        = titleWrapper.find( '.fusion-animated-texts-wrapper' ),
			loopAnimation       = titleWrapper.hasClass( 'fusion-loop-on' ),
			parentAnimationTime = jQuery( titleWrapper ).closest( '[data-animationduration]' ).data( 'animationduration' ),
			initialDelay        = 'undefined' !== typeof parentAnimationTime ? parseFloat( parentAnimationTime ) * 200 : 0;

		textsWrapper.removeData( 'textillate' );
		jQuery( titleWrapper ).find( '.fusion-textillate' ).remove();

		if ( ! jQuery( titleWrapper ).is( '.fusion-title-typeIn,.fusion-title-clipIn' ) ) {
			textsWrapper.awbAnimatedTitleRotationWidth();
		}

		textsWrapper.textillate( {
			selector: '.fusion-animated-texts',
			type: textsWrapper.attr( 'data-length' ),
			minDisplayTime: textsWrapper.attr( 'data-minDisplayTime' ),
			loop: loopAnimation,
			initialDelay: initialDelay
		} );
	};

	jQuery.fn.animateTitleHighlights = function() {
		var titleWrapper     = jQuery( this ),
			highlightEffects = {
				circle: [ 'M344.6,40.1c0,0-293-3.4-330.7,40.3c-5.2,6-3.5,15.3,3.3,19.4c65.8,39,315.8,42.3,451.2-3 c6.3-2.1,12-6.1,16-11.4C527.9,27,242,16.1,242,16.1' ],
				underline_zigzag: [ 'M6.1,133.6c0,0,173.4-20.6,328.3-14.5c154.8,6.1,162.2,8.7,162.2,8.7s-262.6-4.9-339.2,13.9 c0,0,113.8-6.1,162.9,6.9' ],
				x: [ 'M25.8,37.1c0,0,321.2,56.7,435.5,82.3', 'M55.8,108.7c0,0,374-78.3,423.6-76.3' ],
				strikethrough: [ 'M22.2,93.2c0,0,222.1-11.3,298.8-15.8c84.2-4.9,159.1-4.7,159.1-4.7' ],
				curly: [ 'M9.4,146.9c0,0,54.4-60.2,102.1-11.6c42.3,43.1,84.3-65.7,147.3,0.9c37.6,39.7,79.8-52.6,123.8-14.4 c68.6,59.4,107.2-7,107.2-7' ],
				diagonal_bottom_left: [ 'M6.5,127.1C10.6,126.2,316.9,24.8,497,23.9' ],
				diagonal_top_left: [ 'M7.2,28.5c0,0,376.7,64.4,485.2,93.4' ],
				double: [ 'M21.7,145.7c0,0,192.2-33.7,456.3-14.6', 'M13.6,28.2c0,0,296.2-22.5,474.9-5.4' ],
				double_underline: [ 'M10.3,130.6c0,0,193.9-24.3,475.2-11.2', 'M38.9,148.9c0,0,173.8-35.3,423.3-11.8' ],
				underline: [ 'M8.1,146.2c0,0,240.6-55.6,479-13.8' ]
			},
			allPaths         = highlightEffects[ jQuery( titleWrapper ).data( 'highlight' ) ],
			currentPath      = jQuery(),
			highlightSVG;

		if ( 'object' === typeof allPaths ) {
			allPaths.forEach( function ( current ) {
				currentPath = currentPath.add( jQuery( '<path>', { d: current } ) );
			} );
		}

		highlightSVG = jQuery( '<svg>', {
			xmlns: 'http://www.w3.org/2000/svg',
			viewBox: '0 0 500 150',
			preserveAspectRatio: 'none'
		} ).html( currentPath );

		jQuery( titleWrapper ).find( '.fusion-highlighted-text-wrapper svg' ).remove();
		jQuery( titleWrapper ).find( '.fusion-highlighted-text' ).after( highlightSVG[ 0 ].outerHTML );
	};

	// Claculate the width of the rotational elemens in animated titles.
	jQuery.fn.awbAnimatedTitleRotationWidth = function() {

		var textsWrapper     = jQuery( this ),
			animationWrapper = textsWrapper.find( '.fusion-animated-texts' ),
			animatedFontSize = 0,
			width            = 0,
			isHidden         = false;

		animatedFontSize = parseInt( textsWrapper.find( '.fusion-animated-text' ).css( 'font-size' ) );
		animatedFontSize = animatedFontSize * 0.6;

		if ( ! animationWrapper.is( ':visible' ) ) {
			isHidden = true;
			animationWrapper.show();
		}

		jQuery( textsWrapper ).find( '.fusion-animated-text' ).each( function () {
			var currentWidth = jQuery( this ).width();

			if ( currentWidth > width ) {
				width = currentWidth;
			}
		} );

		if ( isHidden ) {
			animationWrapper.hide();
		}

		textsWrapper.css( 'width', width + animatedFontSize );
	};

	// Recalcs the rotation animation title width.
	jQuery.fn.awbAnimatedTitleRotationWidthRecalc = function() {
		jQuery( this ).each( function() {

			// Recalculate rotation animation width on resize.
			if ( ! jQuery( this ).is( '.fusion-title-typeIn,.fusion-title-clipIn' ) ) {
				jQuery( this ).find( '.fusion-animated-texts-wrapper' ).awbAnimatedTitleRotationWidth();
			}
		} );
	};
}( jQuery ) );

jQuery( window ).on( 'load', function() {

	// Do the highlight and rotation animation.
	setTimeout( function() {
		jQuery( '.fusion-title-rotating, .fusion-title-highlight' ).awbAnimateTitleHighlightsAndRotations();
	}, 400 );

	jQuery( window ).on( 'fusion-resize-horizontal', function() {
		jQuery( '.fusion-title-rotating' ).awbAnimatedTitleRotationWidthRecalc();
	} );

} );

jQuery( window ).on( 'fusion-column-resized fusion-element-render-fusion_title', function( $, cid ) {
	var titles = jQuery( 'div[data-cid="' + cid + '"]' ).find( '.fusion-title-rotating, .fusion-title-highlight' );

	if ( titles.length ) {
		titles.awbAnimateTitleHighlightsAndRotations();
		titles.awbAnimatedTitleRotationWidthRecalc();
	}
} );
