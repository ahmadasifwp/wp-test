/* global wc_single_product_params */

jQuery( window ).on( 'load fusion-element-render-fusion_tb_woo_product_images fusion-reinit-single-post-slideshow', function( event ) {
	var imageThumbs,
		variation,
		link;

	// Re-init Woo flexslider on partial refresh. This is done both for native and Avada galleries.
	if ( ( 'fusion-element-render-fusion_tb_woo_product_images' === event.type || 'fusion-reinit-single-post-slideshow' === event.type )  && 'function' === typeof jQuery.fn.wc_product_gallery ) {
		jQuery( '.woocommerce-product-gallery' ).each( function() {
			var builderElementWrapper = jQuery( this ).closest( '.fusion-woo-product-images' );

			if ( builderElementWrapper.length ) {
				wc_single_product_params.zoom_enabled = parseInt( builderElementWrapper.attr( 'data-zoom_enabled' ) );
				wc_single_product_params.photoswipe_enabled = parseInt( builderElementWrapper.attr( 'data-photoswipe_enabled' ) );
			}

			jQuery( this ).trigger( 'wc-product-gallery-before-init', [ this, wc_single_product_params ] );

			jQuery( this ).wc_product_gallery( wc_single_product_params );

			jQuery( this ).trigger( 'wc-product-gallery-after-init', [ this, wc_single_product_params ] );

		} );
	}

	if ( jQuery( '.avada-product-gallery' ).length ) {
		window.sources = [];

		jQuery( 'body' ).on( 'click', '.woocommerce-product-gallery__image .zoomImg', function() {

			if ( 'ontouchstart' in document.documentElement || navigator.msMaxTouchPoints ) {
				link = jQuery( this ).siblings( '.avada-product-gallery-lightbox-trigger' );

				if ( link.hasClass( 'hover' ) ) {
					link.removeClass( 'hover' );
					link.trigger( 'click' );
					return false;
				}
				jQuery( '.woocommerce-product-gallery__image' ).find( '.avada-product-gallery-lightbox-trigger' ).removeClass( 'hover' );
				link.addClass( 'hover' );
				return true;

			}
			jQuery( this ).siblings( '.avada-product-gallery-lightbox-trigger' ).trigger( 'click' );

		} );

		jQuery( 'body' ).on( 'click', function( e ) {
			if ( ! jQuery( e.target ).hasClass( 'woocommerce-product-gallery__image' ) ) {
				jQuery( '.avada-product-gallery-lightbox-trigger' ).removeClass( 'hover' );
			}
		} );

		// Set because of the flexslider script timeout of 100.
		setTimeout( function() {
			initAvadaWoocommerProductGallery();
		}, 100 );

		imageThumbs = ( jQuery( '.flex-control-nav' ).find( 'img' ).length ) ? jQuery( '.flex-control-nav' ).find( 'img' ) : jQuery( '<img class="fusion-main-image-thumb">' ).attr( 'src', jQuery( '.flex-viewport' ).find( '.flex-active-slide' ).data( 'thumb' ) );

		jQuery( '.flex-viewport' ).find( '.flex-active-slide' ).addClass( 'fusion-main-image' );
		jQuery( '.flex-control-nav' ).find( 'li:eq(0) img' ).addClass( 'fusion-main-image-thumb' );

		// Trigger the variation form change on init, needed if a default variation is set.
		if ( 'load' === event.type && 'undefined' === typeof wc_additional_variation_images_local ) {
			setTimeout( function() {
				jQuery( 'body' ).find( '.variations_form .variations select' ).trigger( 'change.wc-variation-form' );
			}, 100 );
		}

		jQuery( 'body' ).on( 'found_variation.wc-variation-form', '.variations_form', function( scopedEvent, variationParam ) {
			variation = variationParam;

			// Check if variations are AJAX loaded due to number of variations > 30.
			if ( false === jQuery( this ).data( 'product_variations' ) ) {
				variationsChange( imageThumbs, variation, jQuery( this ) );
			}
		} );

		// Make sure the variation image is also changed in the thumbs carousel and for lightbox.
		if ( false !== jQuery( '.variations_form' ).data( 'product_variations' ) ) {
			jQuery( 'body' ).on( 'change.wc-variation-form', '.variations_form .variations select', function() {
				variationsChange( imageThumbs, variation, jQuery( this ).closest( '.variations_form' ) );
			} );
		}
	}
} );

function getVariationsValues( variationForm ) {
	var variations = 0,
		chosen     = 0;

	jQuery( variationForm ).find( '.variations' ).find( 'select' ).each( function() {
		var value  = jQuery( this ).val() || '';

		if ( 0 < value.length ) {
			chosen++;
		}

		variations++;
	} );

	return {
		variations: variations,
		chosen: chosen
	};

}

function variationsChange( imageThumbs, variation, variationForm ) {
	var sources = window.sources,
		firstSource = 'undefined' !== typeof sources[ 0 ] ? sources[ 0 ] : false,
		variationImage,
		variationSelects = getVariationsValues( variationForm ),
		galleryHasImage,
		slideToImage,
		galleryWrapper,
		flexWrapper,
		mainImage,
		productImg,
		productLink,
		zoomImage,
		lightboxTrigger,
		mainThumb;

	variationImage = ( 'undefined' !== typeof variation && variation.image && variation.image.gallery_thumbnail_src && 1 < variation.image.gallery_thumbnail_src.length ) ? variation.image.gallery_thumbnail_src : firstSource;

	if ( variationSelects.variations !== variationSelects.chosen ) {
		jQuery( variationForm ).trigger( 'update_variation_values' );
		jQuery( variationForm ).trigger( 'reset_data' );

		variationImage = firstSource;

		variationsImageReset( imageThumbs );

		return;
	}

	if ( 'undefined' !== typeof variation && variation.image && variation.image.src && 1 < variation.image.src.length && ! variation.is_composited ) {

		galleryWrapper   = imageThumbs.closest( '.woocommerce-product-gallery' );
		flexWrapper      = galleryWrapper.children( '.flex-viewport' );
		mainImage        = flexWrapper.find( '.fusion-main-image' ).length ? flexWrapper.find( '.fusion-main-image' ) : flexWrapper.find( '.woocommerce-product-gallery__image' );
		productImg       = mainImage.find( '.wp-post-image' );
		productLink      = mainImage.find( 'a' ).eq( 0 );
		zoomImage        = mainImage.find( '> img' );
		lightboxTrigger  = mainImage.find( '.avada-product-gallery-lightbox-trigger' );
		mainThumb        = galleryWrapper.find( '.fusion-main-image-thumb' );

		// See if the gallery has an image with the same original src as the image we want to switch to.
		galleryHasImage = imageThumbs.filter( '[data-o_src="' + variation.image.gallery_thumbnail_src + '"]' ).length;

		// If the gallery has the image, reset the images. We'll scroll to the correct one.
		if ( galleryHasImage ) {
			variationsImageReset( imageThumbs );
		}

		// See if gallery has a matching image we can slide to.
		slideToImage = -1 < jQuery.inArray( variation.image.gallery_thumbnail_src, sources );

		// If the gallery has the image, reset the images. We'll scroll to the correct one.
		if ( ! slideToImage || productImg.attr( 'src' ) !== variation.image.src ) {
		//if ( ! slideToImage ) {
			imageThumbs.each( function() {
				if ( ! jQuery( this ).hasClass( 'fusion-main-image-thumb' ) ) {
					jQuery( this ).attr( 'src', sources[ jQuery( this ).data( 'index' ) ] );
				} else {
					jQuery( this ).attr( 'src', variationImage );

					jQuery( this ).parent().trigger( 'click' );

					if ( variationSelects.variations === variationSelects.chosen ) {
						productImg.wc_set_variation_attr( 'src', variation.image.src );
						productImg.wc_set_variation_attr( 'height', variation.image.src_h );
						productImg.wc_set_variation_attr( 'width', variation.image.src_w );
						productImg.wc_set_variation_attr( 'srcset', variation.image.srcset );
						productImg.wc_set_variation_attr( 'sizes', variation.image.sizes );
						productImg.wc_set_variation_attr( 'title', variation.image.title );
						productImg.wc_set_variation_attr( 'alt', variation.image.alt );
						productImg.wc_set_variation_attr( 'data-src', variation.image.full_src );
						productImg.wc_set_variation_attr( 'data-large_image', variation.image.full_src );
						productImg.wc_set_variation_attr( 'data-large_image_width', variation.image.full_src_w );
						productImg.wc_set_variation_attr( 'data-large_image_height', variation.image.full_src_h );
						productLink.wc_set_variation_attr( 'href', variation.image.full_src );
						zoomImage.wc_set_variation_attr( 'src', variation.image.full_src );
						lightboxTrigger.wc_set_variation_attr( 'href', variation.image.src );

						if ( 'undefined' !== typeof variation.image.title ) {
							lightboxTrigger.wc_set_variation_attr( 'data-title', variation.image.title );
							lightboxTrigger.data( 'title', variation.image.title );
						}

						if ( 'undefined' !== typeof variation.image.caption ) {
							lightboxTrigger.wc_set_variation_attr( 'data-caption', variation.image.caption );
							lightboxTrigger.data( 'caption', variation.image.caption );
						}

						mainThumb.wc_set_variation_attr( 'src', variation.image.gallery_thumbnail_src );

					} else {
						variationsImageReset( imageThumbs );
					}
				}
			} );
		}
	}

	// Refresh the lightbox
	window.avadaLightBox.refresh_lightbox();

	setTimeout( function() {
		window.avadaLightBox.refresh_lightbox();
	}, 500 );

	setTimeout( function() {
		window.avadaLightBox.refresh_lightbox();
	}, 1500 );
}

function variationsImageReset( imageThumbs ) {
	var galleryWrapper   = imageThumbs.closest( '.woocommerce-product-gallery' ),
		flexWrapper      = galleryWrapper.children( '.flex-viewport' ),
		mainImage        = flexWrapper.find( '.fusion-main-image' ).length ? flexWrapper.find( '.fusion-main-image' ) : flexWrapper.find( '.woocommerce-product-gallery__image' ),
		productImg       = mainImage.find( '.wp-post-image' ),
		productLink      = mainImage.find( 'a' ).eq( 0 ),
		zoomImage        = mainImage.find( '> img' ),
		lightboxTrigger  = mainImage.find( '.avada-product-gallery-lightbox-trigger' ),
		mainThumb        = galleryWrapper.find( '.fusion-main-image-thumb' );

	productImg.wc_reset_variation_attr( 'src' );
	productImg.wc_reset_variation_attr( 'width' );
	productImg.wc_reset_variation_attr( 'height' );
	productImg.wc_reset_variation_attr( 'srcset' );
	productImg.wc_reset_variation_attr( 'sizes' );
	productImg.wc_reset_variation_attr( 'title' );
	productImg.wc_reset_variation_attr( 'alt' );
	productImg.wc_reset_variation_attr( 'data-src' );
	productImg.wc_reset_variation_attr( 'data-large_image' );
	productImg.wc_reset_variation_attr( 'data-large_image_width' );
	productImg.wc_reset_variation_attr( 'data-large_image_height' );
	productLink.wc_reset_variation_attr( 'href' );
	zoomImage.wc_reset_variation_attr( 'src' );
	lightboxTrigger.wc_reset_variation_attr( 'href' );
	lightboxTrigger.wc_reset_variation_attr( 'data-title' );
	lightboxTrigger.wc_reset_variation_attr( 'data-caption' );

	if ( undefined !== lightboxTrigger.attr( 'data-o_data-title' ) ) {
		lightboxTrigger.data( 'title', lightboxTrigger.attr( 'data-o_data-title' ) );
	}

	if ( undefined !== lightboxTrigger.attr( 'data-o_data-caption' ) ) {
		lightboxTrigger.data( 'titcaptionle', lightboxTrigger.attr( 'data-o_data-caption' ) );
	}

	mainThumb.wc_reset_variation_attr( 'src' );

	// Refresh the lightbox
	window.avadaLightBox.refresh_lightbox();

	setTimeout( function() {
		window.avadaLightBox.refresh_lightbox();
	}, 500 );

	setTimeout( function() {
		window.avadaLightBox.refresh_lightbox();
	}, 1500 );
}

function initAvadaWoocommerProductGallery() {
	jQuery( '.avada-product-gallery' ).each( function() {
		var imageGallery    = jQuery( this ),
			galleryWrapper  = imageGallery.closest( '.avada-single-product-gallery-wrapper' ),
			thumbsContainer = imageGallery.find( '.flex-control-thumbs' ),
			imageThumbs     = ( thumbsContainer.find( 'img' ).length ) ? thumbsContainer.find( 'img' ) : undefined,
			maxHeight;

		// Initialize the flexslider thumb sources, needed in on load event.
		if ( 'undefined' !== typeof imageThumbs ) {
			imageThumbs.each( function( index ) {
				jQuery( this ).data( 'index', index );
				window.sources.push( jQuery( this ).attr( 'src' ) );
			} );
		} else {
			window.sources.push( imageGallery.find( '.flex-viewport .flex-active-slide' ).data( 'thumb' ) );
		}

		// Move the gallery nav to the correct container for positioning.
		galleryWrapper.find( '.flex-viewport' ).append( imageGallery.find( '.flex-direction-nav' ) );

		// Handle badges.
		if ( galleryWrapper.hasClass( 'avada-product-images-thumbnails-top' ) || galleryWrapper.hasClass( 'avada-product-images-thumbnails-right' ) || galleryWrapper.hasClass( 'avada-product-images-thumbnails-left' ) ) {

			// Legacy.
			if ( galleryWrapper.children( '.onsale' ).length ) {
				galleryWrapper.find( '.flex-viewport' ).prepend( galleryWrapper.children( '.onsale' ) );
			}

			// Woo Product Images.
			if ( galleryWrapper.children( '.fusion-woo-badges-wrapper' ).length ) {
				galleryWrapper.find( '.flex-viewport' ).prepend( galleryWrapper.children( '.fusion-woo-badges-wrapper' ) );
			}
		}

		if ( galleryWrapper.hasClass( 'avada-product-images-thumbnails-top' ) || galleryWrapper.hasClass( 'avada-product-images-thumbnails-bottom' ) ) {

			// Size the image gallery thumbnails correctly.
			sizeGalleryThumbnails( imageGallery );
			jQuery( window ).on( 'resize', function() {
				sizeGalleryThumbnails( imageGallery );
			} );

			imageGallery.on( 'click touchstart', '.flex-control-thumbs li', function() {
				var nextThumb = jQuery( this );

				moveProductImageThumbs( imageGallery, nextThumb, 'next' );
			} );

			imageGallery.find( '.flex-direction-nav li a' ).on( 'click touchstart', function() {
				var nextThumb = jQuery( this ).parents( '.avada-product-gallery' ).find( '.flex-control-thumbs img.flex-active' );

				if ( nextThumb.offset().left + nextThumb.outerWidth() > imageGallery.offset().left + imageGallery.outerWidth() ) {

					if ( jQuery( this ).hasClass( 'flex-next' ) ) {
						moveProductImageThumbs( imageGallery, nextThumb, 'next' );
					} else {
						moveProductImageThumbs( imageGallery, nextThumb, 'prev' );
					}
				}
			} );

			maxHeight = Math.max.apply( null, thumbsContainer.find( 'li' ).map( function() {
				return jQuery( this ).height();
			} ).get() );

			// Remove the min height setting from the gallery images.
			jQuery( '.woocommerce-product-gallery__image' ).css( 'min-height', '' );

			thumbsContainer.animate( { opacity: 1 }, 500 );

			// Make sure the thumbs container has the height of the largest thumb.
			thumbsContainer.wrap( '<div class="avada-product-gallery-thumbs-wrapper"></div>' );
			thumbsContainer.parent().css( 'height', maxHeight );
		}

		jQuery( window ).trigger( 'resize' );
	} );
}

function sizeGalleryThumbnails( imageGallery ) {
	var galleryWidth   = imageGallery.width(),
		thumbs         = imageGallery.find( '.flex-control-thumbs li' ),
		thumbColumns   = imageGallery.data( 'columns' ),
		numberOfThumbs = thumbs.length,
		thumbWidth;

	// Set the width of the thumbs.
	thumbWidth = ( galleryWidth - ( ( thumbColumns - 1 ) * 8 ) ) / thumbColumns;
	thumbs.css( 'width', thumbWidth );

	// Set .flex-control-thumbs width.
	imageGallery.find( '.flex-control-thumbs' ).css( 'width', ( ( numberOfThumbs * thumbWidth ) + ( ( numberOfThumbs - 1 ) * 8 ) ) + 'px' );
}

function moveProductImageThumbs( gallery, currentThumb, direction ) {
	var thumbsContainer   = gallery.find( '.flex-control-thumbs' ),
		thumbs            = thumbsContainer.find( 'li' ),
		thumbColumns      = gallery.data( 'columns' ),
		thumbWidth        = thumbsContainer.find( 'li' ).outerWidth(),
		galleryLeft       = gallery.offset().left,
		currentThumbIndex = Math.floor( ( currentThumb.offset().left - galleryLeft ) / thumbWidth ),
		leftOffsets       = [],
		thumbsContainerNewLeft,
		scrollableElements;

	if ( thumbs.length > thumbColumns ) {

		if ( 'next' === direction ) {

			if ( currentThumbIndex < thumbs.length - ( currentThumbIndex + 1 ) ) {

				// If there are enough thumbs, move the clicked thumb to first pos.
				thumbsContainerNewLeft  = currentThumb.position().left * -1;
			} else {

				// If there is less thumbs than needed to scroll into view, just scroll the amount that is there.
				scrollableElements = thumbs.length - thumbColumns;
				thumbsContainerNewLeft = jQuery( thumbs.get( scrollableElements ) ).position().left * -1;
			}

			thumbsContainer.stop( true, true ).animate( {
				left: thumbsContainerNewLeft
			}, { queue: false, duration: 500, easing: 'easeInOutQuad', complete: function() {

				jQuery( this ).find( 'li' ).each( function() {
					leftOffsets.push( jQuery( this ).offset().left );
				} );

				jQuery( this ).find( 'li' ).each( function( index ) {
					if ( leftOffsets[ index ] < galleryLeft ) {
						jQuery( this ).appendTo( thumbsContainer );
					}
				} );

				jQuery( this ).css( 'left', '0' );
			} } );

		} else {
			thumbsContainerNewLeft  = ( thumbWidth + 8 ) * -1;

			currentThumb.parent().prependTo( thumbsContainer );
			thumbsContainer.css( 'left', thumbsContainerNewLeft );

			thumbsContainer.stop( true, true ).animate( {
				left: 0
			}, { queue: false, duration: 500, easing: 'easeInOutQuad' } );
		}
	}
}
jQuery( function() {
	// Remove flexslider clones from lightbox.
	jQuery( '.avada-product-gallery' ).find( '.clone' ).find( '.avada-product-gallery-lightbox-trigger' ).addClass( 'fusion-no-lightbox' ).removeAttr( 'data-rel' );

	// Remove the Woo native magnifying glass svg.
	setTimeout( function() {
		jQuery( '.woocommerce-product-gallery__trigger' ).empty();
	}, 10 );
} );
