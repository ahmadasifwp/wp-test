/* global Modernizr, fusionBgImageVars */
( function( jQuery ) {

	'use strict';

	// Set the bg image dimensions of an empty column as data attributes
	jQuery.fn.fusion_set_bg_img_dims = function() {
		jQuery( this ).each( function() {

			var backgroundImage,
				imageHeight,
				imageWidth,
				defaultColumnCompare  = '<div class="fusion-clearfix"></div>',
				centeredColumnCompare = '<div class="fusion-column-content-centered"><div class="fusion-column-content"></div></div><div class="fusion-clearfix"></div>',
				$el                   = jQuery( this ),
				innerHtml             = $el.html();

				innerHtml = 'string' === typeof innerHtml ? innerHtml.trim() : '';

			if ( ( defaultColumnCompare === innerHtml || '' === innerHtml || centeredColumnCompare === innerHtml.replace( /\s/g, '' ) || ( jQuery( 'body' ).hasClass( 'fusion-builder-live' ) &&  0 < jQuery( this ).closest( '.fusion-builder-live-editor' ).length && 1 > jQuery( this ).find( '.fusion-builder-live-element' ).length ) ) && jQuery( this ).data( 'bg-url' ) ) {

				if ( ! $el.attr( 'data-bg-height' ) || ! $el.attr( 'data-bg-width' ) ) {
					// For background image we need to setup the image object to get the natural heights
					backgroundImage     = new Image();
					backgroundImage.src = $el.data( 'bg-url' );
					backgroundImage.onload = function() {
						imageHeight = parseInt( backgroundImage.naturalHeight, 10 );
						imageWidth  = parseInt( backgroundImage.naturalWidth, 10 );

						// Set the dimensions if unset.
						if ( imageHeight && imageWidth ) {
							$el.attr( 'data-bg-height', imageHeight );
							$el.attr( 'data-bg-width', imageWidth );
						}
					};
				}
			}
		} );
	};

	// Calculate the correct aspect ratio respecting height of an empty column with bg image
	jQuery.fn.fusion_calculate_empty_column_height = function() {

		jQuery( this ).each( function() {

			var $el         = jQuery( this ),
				$column     = $el.closest( '.fusion-layout-column' ),
				flexStretch = false,
				innerHtml   = $el.html(),
				imageHeight,
				imageWidth,
				containerWidth,
				widthRatio,
				calculatedContainerHeight;

			// Legacy column with vertically centered content.
			if ( $el.hasClass( 'fusion-flex-column-wrapper-legacy' ) && 0 < $el.children( '.fusion-column-content-centered' ).length  ) {
				innerHtml = $el.find( '.fusion-column-content-centered > .fusion-column-content' ).html();
			}

			innerHtml = 'string' === typeof innerHtml ? innerHtml.trim() : '';

			if ( $el.closest( '.fusion-flex-container' ).length ) {
				if ( $el.parent().hasClass( 'fusion-flex-align-self-stretch' ) || ( $el.closest( '.fusion-flex-align-items-stretch' ).length && ! $el.parent().is( '[class^="fusion-flex-align-self-"' ) ) ) {
					flexStretch = true;
				}
			}

			if ( ( $el.parents( '.fusion-equal-height-columns' ).length && ( Modernizr.mq( 'only screen and (max-width: ' + fusionBgImageVars.content_break_point + 'px)' ) || true === $el.data( 'empty-column' ) ) ) || ! $el.parents( '.fusion-equal-height-columns' ).length ) {
				if ( ( ( $el.parent().hasClass( 'fusion-column-wrapper' ) && 2 === $el.parent().children().length ) || ! $el.parent().hasClass( 'fusion-column-wrapper' ) ) && ( '<div class="fusion-clearfix"></div>' === innerHtml || '' === innerHtml || ( jQuery( 'body' ).hasClass( 'fusion-builder-live' ) &&  0 < $el.closest( '.fusion-builder-live-editor' ).length && 1 > $el.find( '.fusion-builder-live-element' ).length ) ) ) {
					imageHeight               = $el.data( 'bg-height' );
					imageWidth                = $el.data( 'bg-width' );
					containerWidth            = $el.outerWidth();
					widthRatio                = containerWidth / imageWidth;
					calculatedContainerHeight = imageHeight * widthRatio;

					// Flex stretch and not stacked.
					if ( flexStretch && 1 < Math.abs( $column.outerWidth() - $column.parent().width() ) ) {
						$el.css( 'min-height', '0' );
						if ( jQuery( 'html' ).hasClass( 'ua-edge' ) ) {
							$el.parent().css( 'min-height', '0' );
						}
						return;
					}
					$el.css( 'min-height', calculatedContainerHeight );

					if ( jQuery( 'html' ).hasClass( 'ua-edge' ) ) {
						$el.parent().css( 'min-height', calculatedContainerHeight );
					}
				} else {
					$el.css( 'min-height', '0' );

					if ( jQuery( 'html' ).hasClass( 'ua-edge' ) ) {
						$el.parent().css( 'min-height', '0' );
					}
				}
			}
		} );
	};

	function fusionCalcEmptyColumnHeights() {
		// Check if the Edge markup is there.
		if ( jQuery( '.fusion-layout-column > .fusion-column-wrapper > .fusion-column-wrapper' ).length ) {
			jQuery( '.fusion-layout-column > .fusion-column-wrapper > .fusion-column-wrapper' ).fusion_calculate_empty_column_height();
		} else {
			jQuery( '.fusion-layout-column > .fusion-column-wrapper' ).fusion_calculate_empty_column_height();
		}
	}

	jQuery( window ).on( 'load', function() {

		setTimeout( function() {
			fusionCalcEmptyColumnHeights();
		}, 100 );

		jQuery( '.fusion-layout-column .fusion-column-wrapper' ).fusion_set_bg_img_dims();

		jQuery( window ).on( 'fusion-resize-horizontal fusion-live-editor-updated', function() {
			setTimeout( function() {
				fusionCalcEmptyColumnHeights();
			}, 500 );
		} );

	} );
}( jQuery ) );

window.fusionEqualHeightsCids = [];
jQuery( window ).on( 'fusion-element-render-fusion_builder_column fusion-option-change-equal_height_columns fusion-content-changed', function( $, cid ) {
	var parentEl = jQuery( 'div[data-cid="' + cid + '"]' ).hasClass( 'fusion-builder-container' ) ? jQuery( 'div[data-cid="' + cid + '"]' ).find( '> .fusion-fullwidth' ) : jQuery( 'div[data-cid="' + cid + '"]' ).parents( '.fusion-fullwidth' );

	if ( -1 !== window.fusionEqualHeightsCids.indexOf( parentEl.closest( '.fusion-builder-container' ).attr( 'data-cid' ) ) ) {
		return;
	}
	window.fusionEqualHeightsCids.push( parentEl.closest( '.fusion-builder-container' ).attr( 'data-cid' ) );

	setTimeout( function() {

		if ( ! parentEl.hasClass( 'fusion-equal-height-columns' ) ) {
			parentEl.find( '.fusion-column-wrapper' ).css( 'min-height', '' );

			jQuery( '.fusion-layout-column .fusion-column-wrapper' ).fusion_set_bg_img_dims();

			// Check if the Edge markup is there.
			if ( jQuery( 'div[data-cid="' + cid + '"]' ).find( '.fusion-column-wrapper > .fusion-column-wrapper' ).length ) {
				jQuery( 'div[data-cid="' + cid + '"]' ).find( '.fusion-column-wrapper > .fusion-column-wrapper' ).fusion_calculate_empty_column_height();
			} else {
				jQuery( 'div[data-cid="' + cid + '"]' ).find( '.fusion-column-wrapper' ).fusion_calculate_empty_column_height();
			}

			window.fusionEqualHeightsCids = _.without( window.fusionEqualHeightsCids, parentEl.closest( '.fusion-builder-container' ).attr( 'data-cid' ) );
			return;
		}

		// Nested columns.
		parentEl.find( '.fusion-builder-row-inner' ).each( function() {
			jQuery( this ).find( '.fusion-layout-column > .fusion-column-wrapper' ).not( function( $index, $element ) {
				return ( jQuery( $element ).parent( '.fusion-column-wrapper' ).length || jQuery( $element ).parents( '.fusion-events-shortcode' ).length ) ? 1 : 0;
			} ).equalHeights();
		} );

		// Regular columns.
		parentEl.find( '.fusion-layout-column:not(.fusion-builder-row-inner .fusion-layout-column) > .fusion-column-wrapper' ).not( function( $index, $element ) {
			return jQuery( $element ).parents( '.fusion-column-wrapper' ).length ? 1 : 0;
		} ).equalHeights();

		// Check if the Edge markup is there.
		if ( jQuery( 'div[data-cid="' + cid + '"]' ).find( '.fusion-column-wrapper > .fusion-column-wrapper' ).length ) {
			jQuery( 'div[data-cid="' + cid + '"]' ).find( '.fusion-column-wrapper > .fusion-column-wrapper' ).fusion_calculate_empty_column_height();
		} else {
			jQuery( 'div[data-cid="' + cid + '"]' ).find( '.fusion-column-wrapper' ).fusion_calculate_empty_column_height();
		}

		window.fusionEqualHeightsCids = _.without( window.fusionEqualHeightsCids, parentEl.closest( '.fusion-builder-container' ).attr( 'data-cid' ) );
	}, 100 );
} );
