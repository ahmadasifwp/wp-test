/* global fusionLightboxVars */
/*******************************************
 Avada Lightbox
 *
 * @package		Avada
 * @author		ThemeFusion
 * @link		https://avada.com
 * @copyright	ThemeFusion
 ********************************************/

/* eslint no-unused-vars: */

window.avadaLightBox = {};

if ( undefined === window.$ilInstances ) {
	window.$ilInstances = {};
}

/**
 * Used in callbacks.
 *
 * @return {void}
 */
function avadaLightBoxInitializeLightbox() {
	if ( window.$ilInstances ) {
		jQuery.each( window.$ilInstances, function( i, lightbox ) {
			window.$ilInstances[ i ].destroy();
		} );
	}
	window.avadaLightBox.initialize_lightbox();
}

// Manipulate pretty photo content.
window.avadaLightBox.initialize_lightbox = function() {
	'use strict';

	if ( 1 === Number( fusionLightboxVars.status_lightbox ) ) {

		// For old prettyPhoto instances initialize caption and titles.
		window.avadaLightBox.set_title_and_caption();

		// Activate lightbox now.
		window.avadaLightBox.activate_lightbox();
	}
};

// Activate lightbox.
window.avadaLightBox.activate_lightbox = function( $wrapper ) {
	'use strict';

	var $groupsArr = [],
		$tiledGalleryCounter,
		lightboxInstanceCounter = 1;

	// Default value for optional $gallery variable
	if ( 'undefined' === typeof $wrapper ) {
		$wrapper = jQuery( 'body' );
	}

	$wrapper.find( '[data-rel^="prettyPhoto["], [rel^="prettyPhoto["], [data-rel^="iLightbox["], [rel^="iLightbox["]' ).each( function() {

		var $imageFormats     = [ 'bmp', 'gif', 'jpeg', 'jpg', 'png', 'tiff', 'tif', 'jfif', 'jpe', 'svg', 'mp4', 'ogg', 'webm', 'webp' ],
			$imageFormatsMask = 0,
			$href             = jQuery( this ).attr( 'href' ),
			$i,
			$regExp,
			$match,
			$dataRel,
			$rel;

		// Fix for #1738
		if ( 'undefined' === typeof $href ) {
			$href = '';
		}

		// Loop through the image extensions array to see if we have an image link
		for ( $i = 0; $i < $imageFormats.length; $i++ ) {
			$imageFormatsMask += String( $href ).toLowerCase().indexOf( '.' + $imageFormats[ $i ] );
		}

		// Check for Vimeo URL
		$regExp = /http(s?):\/\/(www\.)?vimeo.com\/(\d+)/;
		$match  = $href.match( $regExp );
		if ( $match ) {
			$imageFormatsMask = 1;
		}

		// Check for Youtube URL
		$regExp =  /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/; // eslint-disable-line no-useless-escape
		$match  = $href.match( $regExp );
		if ( $match ) {
			$imageFormatsMask = 1;
		}

		// If no image extension was found add the no lightbox class
		if ( $imageFormats.length * -1 === parseInt( $imageFormatsMask, 10 ) ) {
			jQuery( this ).addClass( 'fusion-no-lightbox' );

			// If no image is set, the lightbox shouldn't be used.
			jQuery( this ).removeAttr( 'data-rel rel' );
		}

		if ( ! jQuery( this ).hasClass( 'fusion-no-lightbox' ) ) {
			$dataRel = this.getAttribute( 'data-rel' );
			if ( null != $dataRel ) {
				if ( -1 === jQuery.inArray( $dataRel, $groupsArr ) ) {
					$groupsArr.push( $dataRel );
				}
			}

			$rel = this.getAttribute( 'data-rel' );
			if ( null != $rel ) {

				// For WP galleries make sure each has its own lightbox gallery
				if ( jQuery( this ).parents( '.gallery' ).length ) {
					$rel = $rel.replace( 'postimages', jQuery( this ).parents( '.gallery' ).attr( 'id' ) );
					jQuery( this ).attr( 'data-rel', $rel );
				}

				if ( -1 === jQuery.inArray( $rel, $groupsArr ) ) {
					$groupsArr.push( $rel );
				}
			}
		}
	} );

	// Special setup for jetpack tiled gallery
	$tiledGalleryCounter = 1;
	$wrapper.find( '.tiled-gallery' ).each( function() {
		jQuery( this ).find( '.tiled-gallery-item > a' ).each( function() {
			var $dataRel = this.getAttribute( 'data-rel' );
			if ( null == $dataRel ) {
				$dataRel = 'iLightbox[tiled-gallery-' + $tiledGalleryCounter + ']';
				jQuery( this ).attr( 'data-rel', $dataRel );
			}

			if ( -1 === jQuery.inArray( $dataRel, $groupsArr ) ) {
				$groupsArr.push( $dataRel );
			}
		} );

		$tiledGalleryCounter++;
	} );

	// Activate lightbox for galleries
	jQuery.each( $groupsArr, function( $i, $groupName ) {
		lightboxInstanceCounter++;
		// For groups with only one single image, disable the slideshow play button
		if ( 1 === jQuery( '[data-rel="' + $groupName + '"], [rel="' + $groupName + '"]' ).length ) {
			window.$ilInstances[ $groupName ] = jQuery( '[data-rel="' + $groupName + '"], [rel="' + $groupName + '"]' ).iLightBox( window.avadaLightBox.prepare_options( $groupName, false ) );
		} else {
			window.$ilInstances[ $groupName ] = jQuery( '[data-rel="' + $groupName + '"], [rel="' + $groupName + '"]' ).iLightBox( window.avadaLightBox.prepare_options( $groupName ) );
		}
	} );

	// Activate lightbox for single instances
	$wrapper.find( 'a[rel="prettyPhoto"], a[data-rel="prettyPhoto"], a[rel="iLightbox"], a[data-rel="iLightbox"]' ).each( function() {
		var $singleHref = jQuery( this ).attr( 'href' );
		if ( '' !== $singleHref && 'undefined' !== typeof $singleHref ) { // Fix for 1382.
			window.$ilInstances[ 'single_' + lightboxInstanceCounter ] = jQuery( this ).iLightBox( window.avadaLightBox.prepare_options( 'single' ) );
			lightboxInstanceCounter++;
		}
	} );

	// Activate lightbox for single lightbox links
	$wrapper.find( '#lightbox-link, .lightbox-link, .fusion-lightbox-link' ).each( function() {
		var $singleHref = jQuery( this ).attr( 'href' );
		if ( '' !== $singleHref && 'undefined' !== typeof $singleHref ) { // Fix for 1382.
			window.$ilInstances[ 'single_' + lightboxInstanceCounter ] = jQuery( this ).iLightBox( window.avadaLightBox.prepare_options( 'single' ) );
			lightboxInstanceCounter++;
		}
	} );

	// Activate lightbox for images within the post content
	if ( fusionLightboxVars.lightbox_post_images ) {
		$wrapper.find( '.type-post .post-content a, #posts-container .post .post-content a, .fusion-blog-shortcode .post .post-content a, .type-avada_portfolio .project-content a, .fusion-portfolio .fusion-portfolio-wrapper .fusion-post-content, .summary-container .post-content a, .woocommerce-tabs .post-content a' ).has( 'img' ).each( function() {

			// Make sure the lightbox is only used for image links and not for links to external pages
			var $imageFormats     = [ 'bmp', 'gif', 'jpeg', 'jpg', 'png', 'tiff', 'tif', 'jfif', 'jpe', 'svg', 'mp4', 'ogg', 'webm', 'webp' ],
				$imageFormatsMask = 0,
				$i;

			// Loop through the image extensions array to see if we have an image link
			for ( $i = 0; $i < $imageFormats.length; $i++ ) {
				$imageFormatsMask += String( jQuery( this ).attr( 'href' ) ).toLowerCase().indexOf( '.' + $imageFormats[ $i ] );
			}

			// If no image extension was found add the no lightbox class
			if ( $imageFormats.length * -1 === parseInt( $imageFormatsMask, 10 ) ) {
				jQuery( this ).addClass( 'fusion-no-lightbox' );

				// If no image is set, the lightbox shouldn't be used.
				jQuery( this ).removeAttr( 'data-rel rel' );
			}

			if ( -1 === String( jQuery( this ).attr( 'rel' ) ).indexOf( 'prettyPhoto' ) && -1 === String( jQuery( this ).attr( 'data-rel' ) ).indexOf( 'prettyPhoto' ) && -1 === String( jQuery( this ).attr( 'rel' ) ).indexOf( 'iLightbox' ) && -1 === String( jQuery( this ).attr( 'data-rel' ) ).indexOf( 'iLightbox' ) && ! jQuery( this ).hasClass( 'fusion-no-lightbox' ) ) {
				jQuery( this ).attr( 'data-caption', jQuery( this ).parent().find( 'p.wp-caption-text' ).text() );

				window.$ilInstances[ 'single_' + lightboxInstanceCounter ] = jQuery( this ).iLightBox( window.avadaLightBox.prepare_options( 'post' ) );
				lightboxInstanceCounter++;
			}
		} );
	}
};

// For old prettyPhoto instances initialize caption and titles]
window.avadaLightBox.set_title_and_caption = function() {
	'use strict';

	jQuery( 'a[rel^="prettyPhoto"], a[data-rel^="prettyPhoto"]' ).each( function() {
		if ( ! jQuery( this ).attr( 'data-caption' ) ) {

			if ( ! jQuery( this ).attr( 'title' ) ) {
				jQuery( this ).attr( 'data-caption', jQuery( this ).parents( '.gallery-item' ).find( '.gallery-caption' ).text() );
			} else {
				jQuery( this ).attr( 'data-caption', jQuery( this ).attr( 'title' ) );
			}
		}

		if ( ! jQuery( this ).attr( 'data-title' ) ) {
			jQuery( this ).attr( 'data-title', jQuery( this ).find( 'img' ).attr( 'alt' ) );
		}
	} );

	jQuery( 'a[rel^="iLightbox"], a[data-rel^="iLightbox"]' ).each( function() {
		if ( ! jQuery( this ).attr( 'data-caption' ) ) {
			jQuery( this ).attr( 'data-caption', jQuery( this ).parents( '.gallery-item' ).find( '.gallery-caption' ).text() );
		}
	} );
};

/**
 * Prepare_options set data for page options.
 */
window.avadaLightBox.prepare_options = function( $linkID, $gallery ) {
	'use strict';

	var $showSpeed,
		$startPaused = true,
		$ilightboxArgs;

	// Default value for optional $gallery variable
	if ( 'undefined' === typeof $gallery ) {
		$gallery  = fusionLightboxVars.lightbox_gallery;
		$startPaused = ! ( true === fusionLightboxVars.lightbox_autoplay || 'true' === fusionLightboxVars.lightbox_autoplay || 1 === fusionLightboxVars.lightbox_autoplay || '1' === fusionLightboxVars.lightbox_autoplay );
	}

	$showSpeed     = { fast: 100, slow: 800, normal: 400 };
	$ilightboxArgs = {
		skin: fusionLightboxVars.lightbox_skin,
		smartRecognition: false,
		minScale: 0.075,
		show: {
			title: fusionLightboxVars.lightbox_title,
			speed: $showSpeed[ fusionLightboxVars.lightbox_animation_speed.toLowerCase() ]
		},
		path: fusionLightboxVars.lightbox_path,
		controls: {
			slideshow: $gallery,
			arrows: fusionLightboxVars.lightbox_arrows
		},
		slideshow: {
			pauseTime: fusionLightboxVars.lightbox_slideshow_speed,
			pauseOnHover: false,
			startPaused: $startPaused
		},
		overlay: {
			opacity: fusionLightboxVars.lightbox_opacity
		},
		caption: {
			start: fusionLightboxVars.lightbox_desc,
			show: '',
			hide: ''
		},
		isMobile: true,
		callback: {
			onShow: function( api, position ) { // jshint ignore:line
				var iFrame = jQuery( api.currentElement ).find( 'iframe[src*="youtube.com"]' );

				jQuery( '.ilightbox-container iframe[src*="youtube.com"]' ).not( iFrame ).each( function() {
					this.contentWindow.postMessage( '{"event":"command","func":"pauseVideo","args":""}', '*' );
				} );

				jQuery( api.currentElement ).trapFocus();
			},
			onAfterChange: function( api ) {
				var iFrame    = jQuery( api.currentElement ).find( 'iframe[src*="youtube.com"]' ),
					iFrameSrc = ( iFrame.length ) ? iFrame.attr( 'src' ) : '';

				jQuery( '.ilightbox-container iframe[src*="youtube.com"]' ).not( iFrame ).each( function() {
					this.contentWindow.postMessage( '{"event":"command","func":"pauseVideo","args":""}', '*' );
				} );

				if ( iFrame.length && -1 !== iFrameSrc.indexOf( 'autoplay=1' ) ) {
					iFrame[ 0 ].contentWindow.postMessage( '{"event":"command","func":"playVideo","args":""}', '*' );
				}
			},
			onHide: function( api ) {
				jQuery( document ).off( '.fusionLightbox' );
			}
		}
	};

	// For social sharing.
	if ( fusionLightboxVars.lightbox_social ) {
		$ilightboxArgs.social = {
			buttons: fusionLightboxVars.lightbox_social_links
		};
	}

	// For deep linking
	if ( ( Number( fusionLightboxVars.lightbox_deeplinking ) ) ) {
		$ilightboxArgs.linkId = $linkID;
	}

	$ilightboxArgs.text = window.fusionLightboxVars.l10n;

	return $ilightboxArgs;
};

// A function to refresh all items and rebind all elements.
window.avadaLightBox.refresh_lightbox = function( ) {
	'use strict';

	window.avadaLightBox.set_title_and_caption();

	jQuery.each( window.$ilInstances, function( $key, $value ) {
		if ( $value.hasOwnProperty( 'refresh' ) ) {
			$value.refresh();
		}
	} );
};

// Lightbox initialization for dynamically loaded content
jQuery( document ).ajaxComplete( function( event, xhr, settings ) {
	'use strict';

	if ( -1 === settings.url.indexOf( 'https://vimeo.com/api/oembed.json' ) ) {
		window.avadaLightBox.refresh_lightbox();
	}
} );

jQuery( window ).on( 'load', function() {
	'use strict';

	// Initialize lightbox.
	avadaLightBoxInitializeLightbox();
} );

jQuery.fn.trapFocus = function() {
	var focusableElementSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
		focusableElements         = jQuery( this ).find( focusableElementSelectors ),
		firstFocusableElement,
		lastFocusableElement;

	if ( ! focusableElements.length ) {
		return;
	}

	firstFocusableElement = focusableElements[ 0 ],
	lastFocusableElement  = focusableElements[ focusableElements.length - 1 ];

	jQuery( document ).on( 'keydown.fusionLightbox', function( e ) {
		var isTabPressed = 'Tab' === e.key || 9 === e.keyCode;

		if ( ! isTabPressed ) {
			return;
		}

		if ( e.shiftKey ) {
			if ( firstFocusableElement === document.activeElement ) {
				lastFocusableElement.focus();
				e.preventDefault();
			}
		} else if ( lastFocusableElement === document.activeElement ) {
			firstFocusableElement.focus();
			e.preventDefault();
		}
	} );

	firstFocusableElement.focus();
};
