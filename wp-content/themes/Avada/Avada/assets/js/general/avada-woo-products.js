/* global avadaWooCommerceVars, calcSelectArrowDimensions, Modernizr, fusionInitPostFlexSlider, avadaAddQuantityBoxes, productBackgroundColor, productBackgroundColorLightness, wc_add_to_cart_variation_params, quickViewNonce, productQuickViewSingleURL */
/* eslint no-unused-vars: 0 */
/* eslint no-useless-escape: 0 */

// Resize crossfade images and square to be the largest image and also vertically centered
jQuery( window ).on( 'load', function() {

	// Make the onsale badge also work on products without image.
	jQuery( '.product-images' ).each(
		function() {
			if ( ! jQuery( this ).find( 'img' ).length && jQuery( this ).find( '.onsale' ).length ) {
				jQuery( this ).css( 'min-height', '45px' );
			}
		}
	);

} );

jQuery( document ).ready( function() {
	var name,
		$titleSep,
		$titleSepClassString,
		$titleMainSepClassString,
		$headingOrientation,
		i,
		quickViewInterval,
		previewImageInterval;

	jQuery( 'body' ).on( 'click', '.add_to_cart_button.ajax_add_to_cart:not(.disabled)', function() {
		var $parentEl    = jQuery( this ).closest( '.product, li, .swiper-slide' ),
			$cartLoading = $parentEl.find( '.cart-loading' ),
			isCard       = $parentEl.hasClass( 'post-card' ),
			$rollover    = isCard ? $parentEl.find( '.fusion-image-wrapper' ) : false;

		if ( $rollover ) {
			$rollover.addClass( 'hover' );
		}
		$cartLoading.find( 'i' ).removeClass( 'awb-icon-check-square-o' ).addClass( 'awb-icon-spinner' );
		$cartLoading.fadeIn();
		setTimeout( function() {
			$cartLoading.find( 'i' ).hide().removeClass( 'awb-icon-spinner' ).addClass( 'awb-icon-check-square-o' ).fadeIn();
			$cartLoading.closest( '.fusion-clean-product-image-wrapper, li' ).addClass( 'fusion-item-in-cart' );
			if ( $rollover ) {
				$rollover.removeClass( 'hover' );
			}
		}, 2000 );
	} );

	jQuery( 'body' ).on( 'should_send_ajax_request.adding_to_cart', function( e, $button ) {
		if ( jQuery( $button ).hasClass( 'disabled' ) ) {
			return false;
		}

		return true;
	} );

	jQuery( 'body' ).on( 'mouseenter mouseleave', '.products .product, .fusion-woo-slider .swiper-slide, .post-card.product', function( event ) {
		var cartLoading = jQuery( this ).find( '.cart-loading' );

		if ( cartLoading.find( 'i' ).hasClass( 'awb-icon-check-square-o' ) ) {
			if ( 'mouseenter' === event.type ) {
				cartLoading.fadeIn();
			} else {
				cartLoading.fadeOut();
			}
		}
	} );

	$titleSep                = avadaWooCommerceVars.title_style_type.split( ' ' );
	$titleSepClassString     = '';
	$titleMainSepClassString = '';
	$headingOrientation      = 'title-heading-left';

	for ( i = 0; i < $titleSep.length; i++ ) {
		$titleSepClassString += ' sep-' + $titleSep[ i ];
	}

	if ( -1 < $titleSepClassString.indexOf( 'underline' ) ) {
		$titleMainSepClassString = $titleSepClassString;
	}

	if ( jQuery( 'body' ).hasClass( 'rtl' ) ) {
		$headingOrientation = 'title-heading-right';
	}

	jQuery( '.woocommerce.single-product .related.products > h2' ).each( function() {
		var $relatedHeading = jQuery( this ).replaceWith( function() {
			return '<div class="fusion-title title' + $titleSepClassString + '"><h' + avadaWooCommerceVars.related_products_heading_size + ' class="' + $headingOrientation + '">' + jQuery( this ).html() + '</h' + avadaWooCommerceVars.related_products_heading_size + '><span class="awb-title-spacer"></span><div class="title-sep-container"><div class="title-sep' + $titleSepClassString + ' "></div></div></div>';
		} );
	} );

	jQuery( '.woocommerce.single-product .upsells.products > h2' ).each( function() {
		var $relatedHeading = jQuery( this ).replaceWith( function() {
			return '<div class="fusion-title title' + $titleSepClassString + '"><h3 class="' + $headingOrientation + '">' + jQuery( this ).html() + '</h3><span class="awb-title-spacer"></span><div class="title-sep-container"><div class="title-sep' + $titleSepClassString + ' "></div></div></div>';
		} );
	} );

	jQuery( '.products-6 li, .products-5 li, .products-4 li, .products-3 li, .products-2 li' ).removeClass( 'last' );

	jQuery( 'body' ).on( 'click', '.fusion-quick-view', function( e ) {
		var quickViewOverlay         = jQuery( '.fusion-woocommerce-quick-view-overlay' ),
			quickViewContainer       = jQuery( '.fusion-woocommerce-quick-view-container' ),
			quickViewPreviewImage    = quickViewContainer.find( '.fusion-wqv-preview-image' ),
			quickViewContent         = quickViewContainer.find( '.fusion-wqv-content' ),
			closeButton              = quickViewContainer.find( '.fusion-wqv-close' ),
			loader                   = quickViewContainer.find( '.fusion-wqv-loader' ),
			productId                = jQuery( this ).data( 'product-id' ),
			productTag               = jQuery( this ).closest( '.product' ),
			productElement           = productTag.length ? productTag : jQuery( this ).closest( '.fusion-carousel-item' ),
			productImage             = productElement.find( '.wp-post-image' ),
			productOnSale            = productElement.find( '.onsale' ),
			productSoldOut           = productElement.find( '.fusion-out-of-stock' ),
			productTitle             = productElement.find( '.product-title' ).length ? productElement.find( '.product-title' ) : productElement.find( '.fusion-rollover-title' ),
			productPrice             = productElement.find( '.fusion-price-rating' ).length ? productElement.find( '.fusion-price-rating' ) : productElement.find( '.price' ).first(),
			productImageAspectRatio  = parseInt( productImage.height(), 10 ) / parseInt( productImage.width(), 10 ),
			detailsButton,
			quickViewContainerCoords = {},
			quickViewContainerFullyAnimated = false,
			hasImage = true,
			reviewHash = '';

		e.preventDefault();

		// Close quick view on esc press.
		jQuery( 'body' ).addClass( 'fusion-wqv-open' );
		jQuery( '.fusion-wqv-open' ).on( 'keydown', function( event ) {
			if ( 27 === event.keyCode ) {
				jQuery( '.fusion-wqv-close button' ).trigger( 'click' );
			}
		} );

		// If no product ID could be retrieved, return.
		if ( 'undefined' === typeof productId ) {
			return;
		}

		// Retrieve product title from data attribute.
		if ( 0 === productTitle.length && 'undefined' !== typeof jQuery( this ).data( 'product-title' ) ) {
			productTitle = jQuery( '<p>' + jQuery( this ).data( 'product-title' ) + '</p>' );
		}

		// Remove old product markup.
		quickViewContent.empty();

		// Remove old loader markup.
		loader.find( '.entry-title, .star-rating, .price' ).empty();

		// Make sure modal and overlay are above sticky header and parallax footer is still correct.
		if ( jQuery( '.fusion-footer-parallax' ).length ) {
			jQuery( '#main' ).css( 'z-index', 'auto' );

			if ( 'fixed' === jQuery( '.fusion-footer-parallax' ).css( 'position' ) ) {
				jQuery( '.fusion-footer-parallax' ).css( 'z-index', '-1' );

				if ( jQuery( '#sliders-container' ).find( '.tfs-slider[data-parallax="1"]' ).length ) {
					jQuery( '#sliders-container' ).css( 'z-index', 'auto' );
				}
			}
		}

		// Show main container and preview image.
		quickViewContainer.stop().fadeIn( '200' );
		quickViewPreviewImage.fadeIn( '200' ).html( productImage.clone() );

		// Fade overlay in.
		quickViewOverlay.stop().fadeIn( '400' );

		if ( productOnSale.length || productSoldOut.length ) {
			quickViewPreviewImage.prepend( '<div class="fusion-woo-badges-wrapper"></div>' );

			// Add sold out badge.
			if ( productSoldOut.length ) {
				quickViewContainer.addClass( 'outofstock' );
				quickViewPreviewImage.find( '.fusion-woo-badges-wrapper' ).append( productSoldOut.clone() );
			}

			// Add sale badge.
			if ( productOnSale.length ) {
				quickViewPreviewImage.find( '.fusion-woo-badges-wrapper' ).append( productOnSale.clone() );
			}
		}

		// Hide product.
		productElement.find( '> span, > a, > div' ).fadeTo( '200', '0' );
		productElement.addClass( 'fusion-faded-out' );

		// Position container and preview image.
		if ( 0 === productImage.length ) {
			productImage = jQuery( e.currentTarget );
			if ( 'undefined' !== typeof productImage.data( 'image-height' ) ) {
				productImageAspectRatio  = parseInt( productImage.data( 'image-height' ), 10 ) / parseInt( productImage.data( 'image-width' ), 10 );
				quickViewContainerCoords.startWidth  = productImage.data( 'image-width' );
				quickViewContainerCoords.startHeight = productImage.data( 'image-height' );
			} else {
				hasImage = false;
				quickViewContainerCoords.startWidth  = 400;
				quickViewContainerCoords.startHeight = 400;
			}
		} else {
			quickViewContainerCoords.startWidth  = productImage.width();
			quickViewContainerCoords.startHeight = productImage.height();
		}
		quickViewContainerCoords.startTop    = productImage.offset().top - jQuery( window ).scrollTop();
		quickViewContainerCoords.startLeft   = productImage.offset().left;
		quickViewContainerCoords.endWidth    = 400;

		// Landscape image.
		if ( 1.77 < 1 / productImageAspectRatio ) {
			quickViewContainerCoords.endWidth = 500;
		}

		// Portrait image.
		if ( 1.77 < productImageAspectRatio ) {
			quickViewContainerCoords.endWidth = 300;
		}

		// Calc end coords of container with image but without contents.
		quickViewContainerCoords.endHeight  = Math.floor( quickViewContainerCoords.endWidth / quickViewContainerCoords.startWidth * quickViewContainerCoords.startHeight );
		quickViewContainerCoords.endTop     = Math.round( ( jQuery( window ).height() - quickViewContainerCoords.endHeight ) / 2 );
		quickViewContainerCoords.endLeft    = Math.round( ( jQuery( window ).width() - quickViewContainerCoords.endWidth ) / 2 );
		quickViewContainerCoords.finalWidth = Math.round( quickViewContainerCoords.endWidth + 500 );

		if ( 500 > jQuery( window ).width() - quickViewContainerCoords.endWidth ) {
			quickViewContainerCoords.finalWidth = Math.round( jQuery( window ).width() - 20 );
		}
		quickViewContainerCoords.finalLeft  = Math.round( ( jQuery( window ).width() - quickViewContainerCoords.finalWidth ) / 2 );

		// Set coords for container.
		quickViewContainer.css( {
			'top': quickViewContainerCoords.startTop,
			'left': quickViewContainerCoords.startLeft,
			'width': quickViewContainerCoords.startWidth,
            'height': quickViewContainerCoords.startHeight,
			'background-color': avadaWooCommerceVars.shop_page_bg_color
		} );

		// Set max width and height for the preview image.
        quickViewPreviewImage.css( {
			'max-width': quickViewContainerCoords.startWidth > quickViewContainerCoords.endWidth ? '100%' : quickViewContainerCoords.endWidth,
			'max-height': quickViewContainerCoords.startWidth > quickViewContainerCoords.endWidth ? 'auto' : quickViewContainerCoords.endHeight
		} );

		// Remove top margin for classic layout.
		quickViewPreviewImage.find( 'img' ).removeAttr( 'style' );

		setTimeout( function() {

			// Animate position and size of the container.
			quickViewContainer.animate( {
				'top': quickViewContainerCoords.endTop + 'px',
				'left': quickViewContainerCoords.endLeft + 'px',
				'width': quickViewContainerCoords.endWidth + 'px',
				'height': quickViewContainerCoords.endHeight + 'px'
			}, 800, 'easeInOutCubic', function() {
				if ( quickViewContainerCoords.startWidth > quickViewContainerCoords.endWidth ) {
					quickViewPreviewImage.css( {
						'max-width': quickViewContainerCoords.endWidth,
						'max-height': quickViewContainerCoords.endHeight
					} );
				}
			} );

		}, 200 );

		setTimeout( function() {

			// Animate to final position and size of the container, incl. contents.
			quickViewContainer.animate( {
				'left': quickViewContainerCoords.finalLeft + 'px',
				'width': quickViewContainerCoords.finalWidth + 'px'
			}, 600, 'easeInOutCubic', function() {
				jQuery( this ).addClass( 'complete' );
				jQuery( this ).css( 'top', '' );
				jQuery( this ).css( 'left', '' );
			} );
		}, 	1000 );

		setTimeout( function() {

			// Show close button.
			closeButton.fadeIn( '300' );

			// Set color of close button.
			if ( 40 > avadaWooCommerceVars.shop_page_bg_color_lightness ) {
				closeButton.find( 'button' ).addClass( 'light' );
			}

			quickViewContainerFullyAnimated = true;

			// Only do preloader stuff, if AJAX has not completed yet.
			if ( ! quickViewContainer.hasClass( 'fusion-quick-view-loaded' ) ) {

				// Add title to loader, if available.
				if ( productTitle.length ) {
					loader.find( '.entry-title' ).html( productTitle.text() );

					if ( parseFloat( avadaWooCommerceVars.post_title_font_size ) < parseFloat( loader.find( '.entry-title' ).css( 'font-size' ) ) ) {
						loader.find( '.entry-title' ).css( 'font-size', parseFloat( avadaWooCommerceVars.post_title_font_size ) + 'px' );
					}
				}

				// Add price / rating to loader, if available.
				if ( productPrice.length ) {
					loader.find( '.star-rating' ).show();

					if ( productPrice.hasClass( 'fusion-price-rating' ) ) {
						loader.find( '.fusion-price-rating' ).html( productPrice.children().clone() );
					} else {
						loader.find( '.fusion-price-rating .price' ).html( productPrice.clone() );
						if ( productElement.find( '.star-rating' ).length ) {
							loader.find( '.fusion-price-rating .star-rating' ).html( productElement.find( '.star-rating' ).first().html() );
						}
					}

					if ( loader.find( '.star-rating' ).is( ':empty' ) ) {
						loader.find( '.star-rating' ).hide();
					}
				}

				// Position loader and show.
				loader.css( 'left', 'calc(100% - ' + Math.round( ( quickViewContainerCoords.finalWidth - quickViewContainerCoords.endWidth ) / 2 ) + 'px)' );
				loader.stop().fadeTo( '300', '1' );
			}
		}, 1600 );

		// Get the actual product data and markup.
		jQuery.post( avadaWooCommerceVars.ajaxurl, {
			action: 'fusion_quick_view_load',
			nonce: quickViewNonce,
			product: jQuery( this ).data( 'product-id' )
		}, function( response ) {

			// Add the WooCommerce cart variation script localizations.
			if ( 'undefined' === typeof wc_add_to_cart_variation_params ) {
				response += '<script type="text/javascript">var wc_add_to_cart_variation_params = {};</script>';
			} else {
				response += '<script type="text/javascript">var wc_add_to_cart_variation_params = ' + JSON.stringify( wc_add_to_cart_variation_params ) + ';</script>';
			}

			// Add the quick view loaded class.
			quickViewContainer.addClass( 'fusion-quick-view-loaded' );

			quickViewInterval = setInterval( function() {

				if ( quickViewContainerFullyAnimated ) {

					// Add the animation class.
					quickViewContainer.addClass( 'fusion-animate-content fusion-quick-view-loaded' );

					// Show the main content area.
					quickViewContainer.find( '.fusion-wqv-content' ).show();

					setTimeout( function() {
						// Add the new product markup to the quick view container.
						quickViewContent.html( response );

						// For post card compatibility.
						if ( ! hasImage && quickViewContent.find( '.woocommerce-product-gallery .wp-post-image' ).length ) {
							quickViewPreviewImage.fadeIn( '200' ).html( quickViewContent.find( '.woocommerce-product-gallery .wp-post-image' ).first().clone() );
							quickViewContainerCoords.endHeight = quickViewPreviewImage.find( 'img' ).height();

							quickViewContainer.animate( {
								'height': quickViewContainerCoords.endHeight + 'px'
							}, 800, 'easeInOutCubic' );
						}

						// Set some dimensions according to the available space.
						quickViewContent.find( '.woocommerce-product-gallery' ).css( 'width', quickViewContainerCoords.endWidth + 'px' );
						quickViewContent.find( '.product' ).not( '.bundled_product' ).css( 'max-height', quickViewContainerCoords.endHeight + 'px' );

						// Set background color to the one of the product.
						if ( 'undefined' !== typeof productBackgroundColor ) {
							quickViewContainer.css( 'background-color', productBackgroundColor );

							// Set color of close button.
							if ( 40 > productBackgroundColorLightness ) {
								closeButton.find( 'button' ).addClass( 'light' );
							}
						}

						// Set full URL for review link.
						if ( 'undefined' !== typeof productQuickViewSingleURL ) {
							if ( quickViewContainer.find( '.woocommerce-review-link' ).length ) {
								reviewHash = quickViewContainer.find( '.woocommerce-review-link' ).prop( 'hash' );
								quickViewContainer.find( '.woocommerce-review-link' ).prop( 'href', productQuickViewSingleURL + reviewHash ).addClass( 'avada-noscroll' );
							}
						}

						// Hide the loader.
						loader.stop().fadeTo( '300', '0' );

						// Fade content in.
						quickViewContainer.find( '.entry-summary' ).animate( {
							'opacity': '1'
						}, 500, 'easeInOutCubic', function() {
							jQuery( this ).scrollTop( 0 );
						} );

						// Animate content in.
						quickViewContainer.find( '.entry-summary' ).children().animate( {
							'padding-top': '0'
						}, 500, 'easeInOutCubic' );

					}, 400 );

					setTimeout( function() {

						// Fade details button in.
						detailsButton = quickViewContainer.find( '.fusion-button-view-details' );

						detailsButton.css( 'top', detailsButton.height() );
						detailsButton.animate( {
							'opacity': '1',
							'top': '0'
						}, 200, 'easeInOutCubic' );
					}, 	700 );

					setTimeout( function() {

						// Remove the animation class.
						quickViewContainer.removeClass( 'fusion-animate-content' );

						// WooCommerce Bundled Products plugin, JS initialization.
						jQuery( 'body' ).trigger( 'quick-view-displayed' );
					}, 900 );

					setTimeout( function() {
						// Slideshow.
						fusionInitPostFlexSlider();

						// Select boxes.
						jQuery( window ).trigger( 'AddAvadaSelect' );

						// Variations.
						if ( 'undefined' !== typeof wc_add_to_cart_variation_params ) {
							jQuery( '.variations_form' ).each( function() {
								jQuery( this ).wc_variation_form();
							} );
						}

						// Quantity boxes.
						avadaAddQuantityBoxes();
					}, 400 );

					previewImageInterval = setInterval( function() {
						if ( 10 > Math.abs( quickViewContainer.find( '.flex-active-slide' ).width() - quickViewContainer.find( '.fusion-wqv-preview-image' ).width() ) ) {

							// Hide the preview image.
							quickViewContainer.find( '.fusion-wqv-preview-image' ).fadeOut( '400' );

							clearInterval( previewImageInterval );
						}
					}, 500 );

					// Clear the main AJAX complete intervall.
					clearInterval( quickViewInterval );
				}
			}, 25 );
		} );
	} );

	jQuery( '.fusion-wqv-close button' ).on( 'click', function() {
		var quickViewContainer = jQuery( this ).closest( '.fusion-woocommerce-quick-view-container' );

		quickViewContainer.removeClass( 'fusion-quick-view-loaded' );

		// Clear the loading intervals.
		clearInterval( quickViewInterval );
		clearInterval( previewImageInterval );

		// Remove quick view esc key binding and body class.
		jQuery( '.fusion-wqv-open' ).off( 'keydown' );
		jQuery( 'body' ).removeClass( 'fusion-wqv-open' );

		// Fade out overlay.
		jQuery( '.fusion-woocommerce-quick-view-overlay' ).fadeOut( '400' );

		// Animate quick view container to half size and fade out.
		quickViewContainer.stop().animate( {
			'width': quickViewContainer.width() / 2,
			'height': quickViewContainer.height() / 2,
			'opacity': '0'
		}, 300, 'easeInOutCubic', function() {
			jQuery( this ).hide();
			jQuery( this ).removeAttr( 'style' );
			jQuery( this ).removeClass( 'complete' );
			jQuery( this ).find( '.fusion-wqv-preview-image' ).removeAttr( 'style' );
			jQuery( this ).find( '.entry-title' ).removeAttr( 'style' );

			// Remove parallax footer z-index adjustments.
			if ( jQuery( '.fusion-footer-parallax' ).length ) {
				jQuery( '#main' ).css( 'z-index', '' );
				jQuery( '.fusion-footer-parallax' ).css( 'z-index', '' );
				jQuery( '#sliders-container' ).css( 'z-index', '' );
			}
		} );

		// Show close button.
		quickViewContainer.find( '.fusion-wqv-close' ).fadeOut( '300' );

		// Fade main product contents back in.
		jQuery( '.fusion-faded-out' ).find( '> span, > a, > div' ).fadeTo( '300', '1', function() {
			jQuery( this ).css( 'opacity', '' );
		} );

		// Remove faded class from main product.
		jQuery( '.fusion-faded-out' ).removeClass( 'fusion-faded-out' );
	} );

	// Close quick view on outside click.
	jQuery( document ).on( 'click', '.fusion-woocommerce-quick-view-overlay', function( event ) {
		jQuery( '.fusion-wqv-close button' ).trigger( 'click' );
	} );

	// Post card cart: update quantity
	jQuery( document ).on( 'change', '.fusion-post-card-cart .qty', function( event ) {
		if ( 'undefined' !== typeof this.value ) {
			jQuery( event.target ).closest( '.fusion-post-card-cart' ).find( '.ajax_add_to_cart' ).attr( 'data-quantity', this.value );
		}
	} );

	// Resize quick view modal.
	jQuery( window ).on( 'resize', function( event ) {
		var quickViewContainer = jQuery( '.fusion-woocommerce-quick-view-container' ),
			galleryWidth       = quickViewContainer.find( '.woocommerce-product-gallery' ).width(),
			windowWidth        = jQuery( window ).width();

		// Early return if quick view is not open.
		if ( ! jQuery( 'body' ).hasClass( 'fusion-wqv-open' ) ) {
			return;
		}

		// If quick view modal is smaller than viewport.
		if ( quickViewContainer.width() < windowWidth - 20 ) {

			// If the full final width is smaller than the viewprt.
			if ( galleryWidth + 500 <= windowWidth - 20 ) {
				quickViewContainer.width( galleryWidth + 500 );
			} else {
				quickViewContainer.width( windowWidth - 20 );
			}
		} else {
			quickViewContainer.width( windowWidth - 20 );
		}
	} );
} );


// WooCommerce Product Filters plugin.
jQuery( window ).on( 'wcpf_after_ajax_filtering', function() {
	var urlParams = new URLSearchParams( window.location.search );

	jQuery( '.catalog-ordering' ).find( 'a' ).each( function() {
		var query = jQuery( this ).attr( 'href' ),
			param;

		if ( 'undefined' !== typeof query ) {
			for ( param of urlParams.entries() ) {
				if ( -1 === query.indexOf( param[ 0 ] ) ) {
					query += '&' + param[ 0 ] + '=' + param[ 1 ];
				}
			}

			jQuery( this ).attr( 'href', query );
		}
	} );
} );
