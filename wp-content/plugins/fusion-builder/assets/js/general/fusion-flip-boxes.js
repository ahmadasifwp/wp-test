( function( jQuery ) {

	'use strict';

	// Set flip boxes equal front/back height
	jQuery.fn.fusionCalcFlipBoxesHeight = function() {
		var flipBox = jQuery( this ),
			flipBoxFront = flipBox.find( '.flip-box-front' ),
			flipBoxBack  = flipBox.find( '.flip-box-back' ),
			frontHeight,
			backHeight;

		flipBox.css( 'min-height', '' );
		flipBoxFront.css( 'position', '' );
		flipBoxBack.css( 'bottom', '' );

		frontHeight = flipBoxFront.outerHeight();
		backHeight = flipBoxBack.outerHeight();

		setTimeout( function() {
			if ( frontHeight > backHeight ) {
				flipBox.css( 'min-height', frontHeight );

			} else {
				flipBox.css( 'min-height', backHeight );
			}

			flipBoxFront.css( 'position', 'absolute' );
			flipBoxBack.css( 'bottom', '0' );

		}, 100 );
	};

	jQuery.fn.fusionCalcFlipBoxesEqualHeights = function() {
		var flipBoxes  = jQuery( this ),
			maxHeights = [],
			maxHeight;

		flipBoxes.find( '.flip-box-inner-wrapper' ).each( function() {
			var flipBox = jQuery( this ),
				flipBoxFront = flipBox.find( '.flip-box-front' ),
				flipBoxBack  = flipBox.find( '.flip-box-back' );

			flipBox.css( 'min-height', '' );
			flipBoxFront.css( 'position', '' );
			flipBoxBack.css( 'bottom', '' );

			maxHeights.push( Math.max( flipBoxFront.outerHeight(), flipBoxBack.outerHeight() ) );
		} );

		maxHeight = Math.max.apply( null, maxHeights );

		flipBoxes.find( '.flip-box-inner-wrapper' ).each( function() {
			var flipBox = jQuery( this ),
				flipBoxFront = flipBox.find( '.flip-box-front' ),
				flipBoxBack  = flipBox.find( '.flip-box-back' );

			flipBox.css( 'min-height', maxHeight );
			flipBoxFront.css( 'position', 'absolute' );
			flipBoxBack.css( 'bottom', '0' );
		} );
	};

}( jQuery ) );

jQuery( window ).on( 'load', function() {

	// Flip Boxes.
	jQuery( '.fusion-flip-boxes.equal-heights' ).each( function() {
		jQuery( this ).fusionCalcFlipBoxesEqualHeights();
	} );

	jQuery( '.fusion-flip-boxes' ).not( '.equal-heights' ).find( '.flip-box-inner-wrapper' ).each( function() {
		jQuery( this ).fusionCalcFlipBoxesHeight();
	} );

	jQuery( window ).on( 'fusion-resize-horizontal', function() {
		jQuery( '.fusion-flip-boxes.equal-heights' ).each( function() {
			jQuery( this ).fusionCalcFlipBoxesEqualHeights();
		} );

		jQuery( '.fusion-flip-boxes' ).not( '.equal-heights' ).find( '.flip-box-inner-wrapper' ).each( function() {
			jQuery( this ).fusionCalcFlipBoxesHeight();
		} );
	} );
} );

jQuery( window ).on( 'fusion-element-render-fusion_flip_box fusion-column-resized', function( event, cid ) {
	var $equalElements,
		$elements,
		$wrapperElement;

	if ( 'undefined' !== typeof event.type && 'fusion-column-resized' === event.type ) {
		$equalElements  = jQuery( 'div[data-cid="' + cid + '"] .fusion-flip-boxes.equal-heights' );
		$elements       = jQuery( 'div[data-cid="' + cid + '"] .fusion-flip-boxes' ).not( '.equal-heights' ).find( '.flip-box-inner-wrapper' );
		$wrapperElement = jQuery( 'div[data-cid="' + cid + '"] .fusion-flip-box' );
	} else {
		$equalElements  = jQuery( 'div[data-cid="' + cid + '"]' ).closest( '.fusion-flip-boxes.equal-heights' );
		$elements       = jQuery( 'div[data-cid="' + cid + '"]' ).closest( '.fusion-flip-boxes' ).not( '.equal-heights' ).find( '.flip-box-inner-wrapper' );
		$wrapperElement = jQuery( 'div[data-cid="' + cid + '"]' ).find( '.fusion-flip-box' );
	}

	$equalElements.each( function() {
		jQuery( this ).fusionCalcFlipBoxesEqualHeights();
	} );

	$elements.each( function() {
		jQuery( this ).fusionCalcFlipBoxesHeight();
	} );

	$wrapperElement.mouseover( function() {
		jQuery( this ).addClass( 'hover' );
	} );
	$wrapperElement.mouseout( function() {
		jQuery( this ).removeClass( 'hover' );
	} );
} );

jQuery( window ).on( 'fusion-dynamic-content-render', function( event, parent ) {
	var $reInitElems = jQuery( parent ).find( '.fusion-flip-boxes' ).not( '.equal-heights' ).find( '.flip-box-inner-wrapper' );

	if ( 0 < $reInitElems.length ) {
		$reInitElems.each( function() {
			jQuery( this ).fusionCalcFlipBoxesHeight();
		} );
	}

	$reInitElems = jQuery( parent ).find( '.fusion-flip-boxes.equal-heights' );
	if ( 0 < $reInitElems.length ) {
		$reInitElems.each( function() {
			jQuery( this ).fusionCalcFlipBoxesEqualHeights();
		} );
	}
} );
