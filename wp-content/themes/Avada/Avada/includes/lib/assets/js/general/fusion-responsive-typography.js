/* global fusionTypographyVars, fusion */
/* jshint -W014, -W098 */
/* eslint no-unused-vars: off */

// Backwards-compatibility alias.
function fusionCalculateResponsiveTypeValues( sensitivity, minFontSizeFactor, mobileBreakPoint, elements ) {
	fusionSetOriginalTypographyData( elements );
}

/**
 * Add initial styles to elements.
 *
 * @since 2.2.0
 * @param {string} elements
 * @return {void}
 */
function fusionSetOriginalTypographyData( elements ) {
	var fromFusionSlider = 'string' === typeof elements ? -1 !== elements.indexOf( 'fusion-slider' ) : false,
		els = fusion.getElements( elements );

	// Loop through all elements.
	jQuery( els ).each( function( i, el ) {
		var typographyFactor, slider, computedStyles, fontSize, lineHeight;

		typographyFactor = fusionTypographyVars.typography_factor;

		// Check if we've already done original values for this element.
		if ( el.classList.contains( 'fusion-responsive-typography-calculated' ) ) {
			if ( ! el.style.getPropertyValue( '--fontSize' ) || '' === el.style.getPropertyValue( '--fontSize' ) ) {
				el.classList.remove( 'fusion-responsive-typography-calculated' );
			}
			return;
		}

		// Don't apply changes to headings in sliders.
		if ( null !== el.closest( '.fusion-slider-revolution' ) || null !== el.closest( '.rev_slider' ) || null !== el.closest( '#layerslider-container' ) || null !== el.closest( '.ls-avada.ls-container' ) || ( null !== el.closest( '.fusion-slider-container' ) && ! fromFusionSlider ) ) {
			return;
		}

		// Get initial data.
		computedStyles = window.getComputedStyle( el );
		fontSize = computedStyles[ 'font-size' ] ? parseFloat( computedStyles[ 'font-size' ] ) : false;
		lineHeight = computedStyles[ 'line-height' ] ? parseFloat( computedStyles[ 'line-height' ] ) : false;

		// Only continue if we were able to properly get the font-size and line-height.
		if ( false !== fontSize && false !== lineHeight ) {

			// Make line-height an absolute number instead of px-based value and round value to 2-digits.
			lineHeight = Math.round( ( lineHeight / fontSize ) * 100 ) / 100;

			// Set the font-size property.
			el.style.setProperty( '--fontSize', fontSize );
			el.setAttribute( 'data-fontsize', fontSize );
			// el.setAttribute( 'data-inline-fontsize', fontSize );

			// Set the line-height.
			el.style.lineHeight = lineHeight;
			el.setAttribute( 'data-lineheight', computedStyles[ 'line-height' ] );
			// el.setAttribute( 'data-inline-lineheight', computedStyles[ 'line-height' ] );

			// Set fusionBaseFontSize once so we don't do it for every element.
			if ( ! window.fusionBaseFontSize ) {
				window.fusionBaseFontSize = getComputedStyle( document.documentElement ).getPropertyValue( '--base-font-size' );
			}

			if ( fromFusionSlider ) {
				slider = jQuery( el ).closest( '.tfs-slider' );

				if ( 'undefined' !== typeof slider.data( 'typo_factor' ) ) {
					typographyFactor = slider.data( 'typo_factor' );
				}

				// For Avada Slider set the sensitivity, as it can be different from Global Options.
				el.style.setProperty( '--typography_sensitivity', slider.data( 'typo_sensitivity' ) );
			}

			// Check if we need to override the --minFontSize var.
			if ( window.fusionBaseFontSize * typographyFactor > fontSize ) {
				el.style.setProperty( '--minFontSize', fontSize );
			}

			// Calc properties for nested ".fusion-animated-texts-wrapper" elements.
			jQuery( el.querySelectorAll( '.fusion-animated-texts-wrapper' ) ).each( function( index, animatedEl ) {
				var animatedComputedStyles = window.getComputedStyle( animatedEl ),
					animatedFontSize = animatedComputedStyles[ 'font-size' ] ? parseFloat( animatedComputedStyles[ 'font-size' ] ) : false,
					animatedLineHeight = animatedComputedStyles[ 'line-height' ] ? parseFloat( animatedComputedStyles[ 'line-height' ] ) : false;

				animatedEl.style.fontSize = ( animatedFontSize / fontSize ) + 'em';
				animatedEl.style.lineHeight = Math.round( ( animatedLineHeight / animatedFontSize ) * 100 ) / 100;
			} );

			// Add class to element.
			el.classList.add( 'fusion-responsive-typography-calculated' );
		}
	} );
}

function fusionInitTypography() {
	window.responsiveTypeElements = fusionTypographyVars.elements;
	if ( 0 < fusionTypographyVars.typography_sensitivity ) {
		fusionSetOriginalTypographyData( window.responsiveTypeElements );
	}
}

if ( document.body.classList.contains( 'fusion-builder-live' ) ) {
	window.onload = fusionInitTypography;
} else {
	fusion.ready( function() {
		fusionInitTypography();
	} );
}

document.body.addEventListener( 'fusion-typography', function( e ) {
	var heading = e.detail.heading,
		values = e.detail.values,
		els = fusion.getElements( heading ),
		computedStyles;

	jQuery( els ).each( function( i, el ) {
		computedStyles = window.getComputedStyle( el );
		if ( '' !== el.parentNode.style.fontSize && el.parentNode.classList.contains( 'fusion-title' ) ) {
			el.style.fontSize = '1em';
		} else if ( el.parentNode.getAttribute( 'data-inline-fontsize' ) && el.getAttribute( 'data-inline-fontsize' ) ) {
			el.style.fontSize = el.getAttribute( 'data-inline-fontsize' );
		} else {
			el.style.fontSize = values[ 'font-size' ];
		}

		if ( el.getAttribute( 'data-inline-lineheight' ) && el.getAttribute( 'data-inline-lineheight' ) ) {
			el.style.lineHeight = el.getAttribute( 'data-inline-lineheight' );
		} else {
			el.style.lineHeight = values[ 'line-height' ];
		}

		el.setAttribute( 'data-fontsize', parseFloat( computedStyles[ 'font-size' ] ) );
		el.style.setProperty( '--fontSize', parseFloat( computedStyles[ 'font-size' ] ) );

		// Add class to element.
		el.classList.add( 'fusion-responsive-typography-calculated' );
	} );
} );

jQuery( document ).ajaxComplete( function() {
	if ( 0 < fusionTypographyVars.typography_sensitivity ) {
		fusionSetOriginalTypographyData( window.responsiveTypeElements );
	}
} );

jQuery( window ).on( 'fusion-typography-reset', function( event, cid ) {
	var $targetEl;

	if ( 'undefined' === typeof fusionTypographyVars || 0 === parseFloat( fusionTypographyVars.typography_sensitivity ) ) {
		return;
	}

	$targetEl = jQuery( 'div[data-cid="' + cid + '"]' ).find( window.responsiveTypeElements );
	fusionSetOriginalTypographyData( $targetEl );
} );

// Set the --viewportWidth var.
document.body.style.setProperty( '--viewportWidth', window.screen.width );
window.addEventListener( 'resize', function() {
	document.body.style.setProperty( '--viewportWidth', window.screen.width );
} );
