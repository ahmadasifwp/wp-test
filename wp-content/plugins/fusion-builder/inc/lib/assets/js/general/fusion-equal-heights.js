/* global Modernizr, fusionEqualHeightVars */
( function( jQuery ) {

	'use strict';

	// Max height for columns and content boxes.
	jQuery.fn.equalHeights = function( minHeight, maxHeight ) {
		var tallest,
			$portfolioWrapper = jQuery( this ).parents().find( '.fusion-portfolio-wrapper' ),

			// Don't select nested column's children (if regular column).
			centeredSelector  = ! jQuery( this ).closest( '.fusion-row' ).hasClass( 'fusion-builder-row-inner' ) ? '.fusion-column-content-centered:not(.fusion-builder-row-inner .fusion-column-content-centered)' : '.fusion-column-content-centered';

		minHeight = minHeight || 0;
		tallest   = minHeight;

		this.each( function() {
			jQuery( this ).css( { 'min-height': '0', height: 'auto' } );
			jQuery( this ).find( centeredSelector ).css( { 'min-height': '0', height: 'auto' }  );
		} );

		if ( ( Modernizr.mq( 'only screen and (min-width: ' + ( parseInt( fusionEqualHeightVars.content_break_point, 10 ) + 1 ) + 'px)' ) || Modernizr.mq( 'only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait)' ) ) ) {
			if ( jQuery( this ).parents( '#main' ).length && jQuery( 'body' ).hasClass( 'tax-portfolio_category' ) ) {
				return;
			}

			this.each( function() {
				tallest = Math.max( jQuery( this ).outerHeight(), tallest );
			} );

			if ( maxHeight ) {
				tallest = Math.min( maxHeight, tallest );
			}

			return this.each( function() {
				var newHeight = tallest,
					$centeredElement = jQuery( this ).find( centeredSelector );

				// If newHeight is 0, then there is no content in any of the columns. Set the empty column param, so that bg images can be scaled correctly
				if ( 0 === parseInt( newHeight, 10 ) ) {
					jQuery( this ).attr( 'data-empty-column', 'true' );
				}

				// Needed for vertically centered columns
				if ( $centeredElement.length ) {
					newHeight = tallest - ( jQuery( this ).outerHeight() - jQuery( this ).height() );
				}

				jQuery( this ).css( 'min-height', newHeight );
				if ( $centeredElement.length ) {
					$centeredElement.css( 'min-height', newHeight );
				}

				// Adjust column spacer height if in FEB mode.
				if ( jQuery( 'body' ).hasClass( 'fusion-builder-live' ) && ! jQuery( this ).parent().hasClass( 'fusion-column-no-min-height' ) && jQuery( this ).parent().is( ':visible' ) ) {
					jQuery( this ).parent().next( '.fusion-column-spacer' ).height( newHeight );
				}
			} );
		}

		// Fix for #867.
		if ( $portfolioWrapper.data( 'isotope' ) && ! $portfolioWrapper.data( 'relayout' ) ) {
			$portfolioWrapper.isotope( 'layout' );
			$portfolioWrapper.data( 'relayout', true );
		}

	};
}( jQuery ) );
