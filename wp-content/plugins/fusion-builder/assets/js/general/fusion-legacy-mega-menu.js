/* global fusionNavSubmenuDirection */

/**
/**
 * Fix the megamenu-width.
 *
 * @since 3.0
 * @param {Element} el - The element.
 * @return {void}
 */
var fusionNavMegamenuPosition = function( el ) {
	var $el          = jQuery( el ),
		$nav         = $el.closest( 'nav' ),
		navDirection = $nav.hasClass( 'awb-menu_column' ) ? 'column' : 'row';

	// Early exit if flyout.
	if ( $nav.hasClass( 'awb-menu_flyout' ) ) {
		return;
	}

	if ( ! $el.find( '.fusion-megamenu-wrapper' ) || ! $el.closest( '.awb-menu' ).length ) {
		return;
	}

	$nav.removeClass( 'mega-menu-loading' );

	// Mobile mode.
	if ( $nav.hasClass( 'collapse-enabled' ) ) {
		$el.find( '.fusion-megamenu-wrapper' ).each( function( i, megamenuWrapper ) {
			jQuery( megamenuWrapper ).css( 'left', 0 );
		} );
		return;
	}

	$el.find( '.fusion-megamenu-wrapper' ).each( function( i, megamenuWrapper ) {
		var $megamenuWrapper    = jQuery( megamenuWrapper ),
			$liItem             = $megamenuWrapper.closest( 'li.fusion-megamenu-menu' ),
			$megamenuHolder     = $megamenuWrapper.find( '.fusion-megamenu-holder' ),
			$referenceFusionRow = $megamenuWrapper.closest( '.fusion-row' ),
			liItemPosition,
			liItemRightEdge,
			megamenuWrapperPosition,
			megamenuWrapperWidth,
			referenceFusionRowWidth,
			referenceFusionRowPosition,
			referenceFusionRowLeftEdge,
			referenceFusionRowRightEdge,
			isRTL = jQuery( 'body' ).hasClass( 'rtl' );

		if ( 'row' === navDirection ) {
			if ( $megamenuWrapper.hasClass( 'fusion-megamenu-fullwidth' ) ) {
				if ( isRTL ) {
					$megamenuWrapper.css( 'right', 'auto' );
				}

				window.avadaScrollBarWidth = window.avadaGetScrollBarWidth();
				if ( window.avadaScrollBarWidth ) {
					$megamenuWrapper.css( 'width', 'calc(' + $megamenuHolder.width() + ' - ' + window.avadaGetScrollBarWidth() + 'px)' );
				}

				$megamenuWrapper.offset( { left: ( jQuery( window ).width() - $megamenuWrapper.outerWidth() ) / 2 } );
			} else if ( $referenceFusionRow.length ) {
				referenceFusionRowWidth     = $referenceFusionRow.width();
				referenceFusionRowPosition  = $referenceFusionRow.offset();
				referenceFusionRowLeftEdge  = ( 'undefined' !== typeof referenceFusionRowPosition ) ? referenceFusionRowPosition.left : 0;
				referenceFusionRowRightEdge = referenceFusionRowLeftEdge + referenceFusionRowWidth;
				liItemPosition              = $liItem.offset();
				megamenuWrapperWidth        = $megamenuWrapper.outerWidth();
				liItemRightEdge             = liItemPosition.left + $liItem.outerWidth();
				megamenuWrapperPosition     = 0;

				/**
				 * Check if the megamenu is larger than the main nav.
				 * There are separate calculations for RTL & LTR layouts
				 * because we need to account for direction and left/right viewport overflows.
				 */
				if ( ! isRTL && liItemPosition.left + megamenuWrapperWidth > referenceFusionRowRightEdge ) {

					// Viewport width.
					if ( megamenuWrapperWidth === jQuery( window ).width() ) {
						megamenuWrapperPosition = -1 * liItemPosition.left;
					} else if ( megamenuWrapperWidth > referenceFusionRowWidth ) {

						// Menu is larger than site width (thus must be custom width).
						megamenuWrapperPosition = referenceFusionRowLeftEdge - liItemPosition.left + ( ( referenceFusionRowWidth - megamenuWrapperWidth ) / 2 );
					} else {
						megamenuWrapperPosition = -1 * ( liItemPosition.left - ( referenceFusionRowRightEdge - megamenuWrapperWidth ) );
					}
					$megamenuWrapper.css( 'left', megamenuWrapperPosition );
				} else if ( isRTL && liItemRightEdge - megamenuWrapperWidth < referenceFusionRowLeftEdge ) {

					// Viewport width.
					if ( megamenuWrapperWidth === jQuery( window ).width() ) {
						megamenuWrapperPosition = liItemRightEdge - megamenuWrapperWidth;
					} else if ( megamenuWrapperWidth > referenceFusionRowWidth ) {

						// Menu is larger than site width (thus must be custom width).
						megamenuWrapperPosition = liItemRightEdge - referenceFusionRowRightEdge + ( ( referenceFusionRowWidth - megamenuWrapperWidth ) / 2 );
					} else {
						megamenuWrapperPosition = -1 * ( megamenuWrapperWidth - ( liItemRightEdge - referenceFusionRowLeftEdge ) );
					}
					$megamenuWrapper.css( 'right', megamenuWrapperPosition );
				}
			}
		} else {
			$megamenuWrapper.css( 'top', 0 );
			$megamenuWrapper.css(
				$nav.hasClass( 'expand-left' ) ? 'right' : 'left',
				'100%'
			);
		}
	} );

	setTimeout( function() {
		$nav.removeClass( 'mega-menu-loaded' );
	}, 50 );

};

var fusionMegaMenuNavRunAll = function() {
	var megaMenus = jQuery( '.awb-menu_em-hover.awb-menu_desktop:not( .awb-menu_flyout ) .fusion-megamenu-menu' );

	megaMenus.each( function( ) {
		fusionNavSubmenuDirection( this );
	} );

	// Note that submenu click mode is handled in fusionNavClickExpandSubmenuBtn.
	megaMenus.on( 'mouseenter focusin', function() {
		fusionNavMegamenuPosition( this );
	} );

	jQuery( window ).trigger( 'fusion-position-menus' );

};

/**
 * Handle events on the live-builder.
 *
 * @since 3.0
 */
jQuery( window ).on( 'fusion-element-render-fusion_menu load', function() {
	fusionMegaMenuNavRunAll();
} );

/**
 * Handle repositioning megamenus while resizing.
 *
 * @since 3.0
 */
jQuery( window ).on( 'fusion-resize-horizontal fusion-position-menus', function() {
	jQuery( '.awb-menu .fusion-megamenu-wrapper' ).each( function( i, el ) {
		fusionNavMegamenuPosition( jQuery( el ).parent() );
	} );
} );
