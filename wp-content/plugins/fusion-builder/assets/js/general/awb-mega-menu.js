/**
 * Fix the megamenu-width.
 *
 * @since 3.0
 * @param {Element} el - The element.
 * @return {void}
 */
var awbMegamenuPosition = function( $megamenuWrapper ) {
	var $nav              = $megamenuWrapper.closest( 'nav' ),
		navDirection      = $nav.hasClass( 'awb-menu_column' ) ? 'column' : 'row',
		expand            = $nav.hasClass( 'awb-menu_expand-right' ) ? 'right' : 'left',
		oppExpand         = 'right' === expand ? 'left' : 'right',
		widthType         = $megamenuWrapper.attr( 'data-width' ),
		viewportWidth     = jQuery( window ).width(),
		$li               = $megamenuWrapper.closest( 'li' ),
		megaWidth         = $megamenuWrapper.outerWidth(),
		gap               = viewportWidth - megaWidth,
		addMargin         = jQuery( '#wrapper' ).css( 'margin' ).includes( '0px auto' ) ? false : true,
		position          = {},
		spaces            = {},
		offsetCorrection,
		liLeftOffset;

	// Early exit if flyout.
	if ( $nav.hasClass( 'awb-menu_flyout' ) ) {
		return;
	}

	// Mobile mode.
	if ( $nav.hasClass( 'collapse-enabled' ) ) {
		return;
	}

	// If the mega menu wrapper is larger than or equal to the viewport, treat it as if viewport.
	if ( megaWidth >= viewportWidth ) {
		widthType = 'viewport';
	}

	offsetCorrection = jQuery( '#icon-bar' ).length ? jQuery( '#icon-bar' ).outerWidth() : jQuery( '#wrapper' ).outerWidth( addMargin ) - jQuery( '#wrapper' ).width();

	if ( ! $nav.is( ':visible' ) ) {
		$nav.css( 'display', 'block' );
		liLeftOffset = $li.offset().left - offsetCorrection;
		$nav.css( 'display', '' );
	} else {
		liLeftOffset = $li.offset().left - offsetCorrection;
	}

	if ( 'row' === navDirection ) {
		// Site width or viewport try to center them in the viewport.
		if ( 'site_width' === widthType || 'viewport' === widthType ) {
			$megamenuWrapper.css( {
				left: ( ( -1 * liLeftOffset ) + ( gap / 2 ) ),
				right: 'auto'
			} );

		// Custom width, try to position to the side that is chosen in the menu, but moved if it overflows viewport.
		} else {
			spaces = {
				right: viewportWidth - liLeftOffset,
				left: liLeftOffset + $li.outerWidth()
			};

			// Have enough space in the direction we want.
			if ( spaces[ expand ] > megaWidth ) {
				position[ oppExpand ] = 0;
				position[ expand ]    = 'auto';

			// Have enough space in the opposite direction (maybe undesired, in which case we can skip this).
			} else if ( spaces[ oppExpand ] > megaWidth ) {
				position[ expand ]    = 0;
				position[ oppExpand ] = 'auto';

			// Not enough to either, will be a mix.
			} else {
				position[ oppExpand ] = -1 * ( megaWidth - spaces[ expand ] );
				position[ expand ]    = 'auto';
			}
			$megamenuWrapper.css( position );
		}
	} else {
		spaces = {
			right: viewportWidth - ( liLeftOffset + $li.outerWidth( true ) ),
			left: liLeftOffset
		};
		// Place to the side, max is available space, minus space between main and sub.
		$megamenuWrapper[ 0 ].style.setProperty( '--awb-megamenu-maxwidth', ( ( spaces[ expand ] - ( $megamenuWrapper.outerWidth( true ) - megaWidth ) ) + 'px' ) );
		position[ oppExpand ] = '100%';
		position[ expand ]    = 'auto';
		$megamenuWrapper.css( position );
	}
};

/**
 * Handle repositioning megamenus while resizing.
 *
 * @since 3.0
 */
jQuery( window ).on( 'fusion-resize-horizontal awb-position-megamenus load', function() {
	var scrollWidth = ( window.avadaGetScrollBarWidth() - 1 ) + 'px';

	// Set var.
	jQuery( 'body' )[ 0 ].style.setProperty( '--awb-scrollbar-width', scrollWidth );

	jQuery( '.awb-menu .awb-menu__mega-wrap' ).each( function() {
		awbMegamenuPosition( jQuery( this ) );
	} );
} );
