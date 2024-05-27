/* global fusion, avadaWooCommerceVars, calcSelectArrowDimensions, Modernizr, generateSwiperCarousel, fusionInitPostFlexSlider, avadaAddQuantityBoxes, productBackgroundColor, productBackgroundColorLightness, wc_add_to_cart_variation_params, quickViewNonce, fusionResizeCrossfadeImagesContainer */
/* eslint no-unused-vars: 0 */
/* eslint no-useless-escape: 0 */
function fusionCalcWoocommerceTabsLayout( $tabSelector ) {
	jQuery( $tabSelector ).each( function() {
		var $menuWidth     = jQuery( this ).parent().width(),
			$menuItems     = jQuery( this ).find( 'li' ).length,
			$mod           = $menuWidth % $menuItems,
			$itemWidth     = ( $menuWidth - $mod ) / $menuItems,
			$lastItemWidth = $menuWidth - ( $itemWidth * ( $menuItems - 1 ) );

		jQuery( this ).css( 'width', $menuWidth + 'px' );
		jQuery( this ).find( 'li' ).css( 'width', $itemWidth + 'px' );
		jQuery( this ).find( 'li:last' ).css( 'width', $lastItemWidth + 'px' ).addClass( 'no-border-right' );
	} );
}

// Resize crossfade images and square to be the largest image and also vertically centered
jQuery( window ).on( 'load', function() {

	// Make sure position of #wrapper and sticky header are correct when WooCommerce demo store notice is dismissed.
	jQuery( '.woocommerce-store-notice__dismiss-link' ).on( 'click', function() {
		var adminbarHeight = fusion.getAdminbarHeight();

		jQuery( '#wrapper' ).css( 'margin-top', '' );
		jQuery( '.fusion-header' ).css( 'top', adminbarHeight );
	} );

	jQuery( '.variations_form' ).find( '.variations .single_variation_wrap .woocommerce-variation-description' ).remove();

	if ( 'function' === typeof jQuery.fn.equalHeights && 0 < jQuery( '.double-sidebars.woocommerce .social-share > li' ).length ) {
		jQuery( '.double-sidebars.woocommerce .social-share > li' ).equalHeights();
	}

	if ( jQuery( '.adsw-attribute-option' ).length ) {
		jQuery( 'body' ).on( 'show_variation', '.variations_form', function() {
			jQuery( '.product-type-variable .variations_form > .single_variation_wrap .woocommerce-variation-price' ).css( 'display', 'inline-block' );
			jQuery( '.product-type-variable .variations_form > .single_variation_wrap .woocommerce-variation-price .price' ).css( 'margin-top', '0' );
			jQuery( '.product-type-variable .variations_form > .single_variation_wrap .woocommerce-variation-availability' ).css( 'display', 'inline-block' );
		} );
	}
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

	jQuery( '.fusion-update-cart, a[href="#updateCart"]' ).on( 'click', function( e ) {
		e.preventDefault();
		jQuery( '.cart .actions > .button' ).trigger( 'click' );
		return false;
	} );

	jQuery( '.fusion-apply-coupon' ).on( 'click', function( e ) {
		e.preventDefault();
		jQuery( '.cart .actions .coupon #coupon_code' ).val( jQuery( '#avada_coupon_code' ).val() );
		jQuery( '.cart .actions .coupon .button' ).trigger( 'click' );
	} );

	if ( jQuery( '.woocommerce-store-notice' ).length && jQuery( '.woocommerce-store-notice' ).is( ':visible' ) && ! jQuery( '.fusion-top-frame' ).is( ':visible' ) ) {
		jQuery( '#wrapper' ).css( 'margin-top', jQuery( '.woocommerce-store-notice' ).outerHeight() );
		if ( 0 < jQuery( '#slidingbar-area' ).outerHeight() ) {
			jQuery( '.header-wrapper' ).css( 'margin-top', '0' );
		}
		if ( jQuery( '.sticky-header' ).length ) {
			jQuery( '.sticky-header' ).css( 'margin-top', jQuery( '.woocommerce-store-notice' ).outerHeight() );
		}
	}

	jQuery( '.catalog-ordering .orderby .current-li a' ).html( jQuery( '.catalog-ordering .orderby ul li.current a' ).html() );
	jQuery( '.catalog-ordering .sort-count .current-li a' ).html( jQuery( '.catalog-ordering .sort-count ul li.current a' ).html() );
	jQuery( '.woocommerce .avada-myaccount-data th.woocommerce-orders-table__cell-order-actions' ).text( avadaWooCommerceVars.order_actions );

	jQuery( 'body.rtl .avada-myaccount-data .my_account_orders .woocommerce-orders-table__cell-order-status' ).each( function() {
		jQuery( this ).css( 'text-align', 'right' );
	} );

	jQuery( '.woocommerce input' ).each( function() {
		if ( ! jQuery( this ).has( '#coupon_code' ) ) {
			name = jQuery( this ).attr( 'id' );
			jQuery( this ).attr( 'placeholder', jQuery( this ).parent().find( 'label[for=' + name + ']' ).text() );
		}
	} );

	if ( jQuery( '.woocommerce #reviews #comments .comment_container .comment-text' ).length ) {
		jQuery( '.woocommerce #reviews #comments .comment_container' ).append( '<div class="clear"></div>' );
	}

	jQuery( '.woocommerce-tabs #comments > h2' ).each( function() {
		var $commentsHeading = jQuery( this ).replaceWith( function() {
			return '<h3>' + jQuery( this ).html() + '</h3>';
		} );
	} );

	if ( 'block' === jQuery( 'body .sidebar' ).css( 'display' ) ) {
		fusionCalcWoocommerceTabsLayout( '.woocommerce-tabs .tabs-horizontal' );
	}

	jQuery( '.sidebar .products,.fusion-footer-widget-area .products,#slidingbar-area .products' ).each( function() {
		jQuery( this ).removeClass( 'products-4' );
		jQuery( this ).removeClass( 'products-3' );
		jQuery( this ).removeClass( 'products-2' );
		jQuery( this ).addClass( 'products-1' );
	} );

	// Woocommerce nested products plugin support
	jQuery( '.subcategory-products' ).each( function() {
		jQuery( this ).addClass( 'products-' + avadaWooCommerceVars.woocommerce_shop_page_columns );
	} );

	jQuery( '.woocommerce-tabs ul.tabs li a' ).off( 'click' );
	jQuery( 'body' ).on( 'click', '.woocommerce-tabs > ul.tabs li a', function() {

		var tab         = jQuery( this ),
			tabsWrapper = tab.closest( '.woocommerce-tabs' );

		jQuery( 'ul.tabs li', tabsWrapper ).removeClass( 'active' );
		jQuery( '> div.panel', tabsWrapper ).hide();
		jQuery( 'div' + tab.attr( 'href' ), tabsWrapper ).show();
		tab.parent().addClass( 'active' );

		return false;
	} );

	// If using one page, use the checkout_error to change scroll.
	if ( ! jQuery( '.continue-checkout' ).length ) {
		jQuery( document ).on( 'checkout_error', function() {
			var $adminBarHeight     = fusion.getAdminbarHeight(),
				$headerDivChildren  = jQuery( '.fusion-header-wrapper' ).find( 'div' ),
				$stickyHeaderHeight = 0;

			jQuery( 'html, body' ).stop();

			$headerDivChildren.each( function() {
				if ( 'fixed' === jQuery( this ).css( 'position' ) ) {
					$stickyHeaderHeight = jQuery( this ).height();
				}
			} );
			if ( jQuery( '.woocommerce-error' ).length ) {
				jQuery( 'html, body' ).animate( { scrollTop: jQuery( '.woocommerce-error' ).offset().top - $adminBarHeight - $stickyHeaderHeight }, 500 );
			}
		} );
	}

	jQuery( 'body' ).on( 'click', '.woocommerce-checkout-nav a,.continue-checkout', function( e ) {
		var $adminBarHeight     = fusion.getAdminbarHeight(),
			$headerDivChildren  = jQuery( '.fusion-header-wrapper' ).find( 'div' ),
			$stickyHeaderHeight = 0,
			$dataName,
			$name,
			$scrollAnchor;

		$headerDivChildren.each( function() {
			if ( 'fixed' === jQuery( this ).css( 'position' ) ) {
				$stickyHeaderHeight = jQuery( this ).height();
			}
		} );

		e.preventDefault();
		jQuery( '.avada-checkout-error' ).parent().remove();

		if ( 0 < jQuery( '.validate-required:visible' ).length ) {

			jQuery.each( jQuery( '.validate-required:visible' ), function( index, element ) {

				var input = jQuery( element ).find( ':input' );

				// Radio type included, because the WooCommerce validation function fails to recognize input on radios.
				if ( 'hidden' === input.attr( 'type' ) || 'radio' === input.attr( 'type' ) ) {
					jQuery( element ).addClass( 'woocommerce-validated' );
				} else {
					input.trigger( 'change' );
				}
			} );
		}

		jQuery( '.woocommerce' ).trigger( 'avada_checkout_continue_field_validation' );

		if ( ! jQuery( '.woocommerce .woocommerce-billing-fields, .woocommerce .woocommerce-shipping-fields, .woocommerce .woocommerce-account-fields' ).find( '.input-text, select, input:checkbox' ).closest( '.validate-required:not(.woocommerce-validated)' ).is( ':visible' ) ) {

			$dataName = jQuery( this ).attr( 'data-name' );
			$name     = $dataName;

			if ( 'order_review' === $dataName ) {
				$name = '#' + $dataName;
			} else {
				$name = '.' + $dataName;
			}

			jQuery( 'form.checkout .col-1, form.checkout .col-2, form.checkout #order_review_heading, form.checkout #order_review' ).hide();

			jQuery( 'form.checkout' ).find( $name ).fadeIn();
			if ( 'order_review' === $name ) {
				jQuery( 'form.checkout' ).find( '#order_review_heading ' ).fadeIn();
			}

			jQuery( '.woocommerce-checkout-nav li' ).removeClass( 'is-active' );
			jQuery( '.woocommerce-checkout-nav' ).find( '[data-name=' + $dataName + ']' ).parent().addClass( 'is-active' );

			if ( jQuery( this ).hasClass( 'continue-checkout' ) && 0 < jQuery( window ).scrollTop() ) {
				if ( jQuery( '.woo-tabs-horizontal' ).length ) {
					$scrollAnchor = jQuery( '.woocommerce-checkout-nav' );
				} else {
					$scrollAnchor = jQuery( '.woocommerce-content-box.avada-checkout' );
				}

				jQuery( 'html, body' ).animate( { scrollTop: $scrollAnchor.offset().top - $adminBarHeight - $stickyHeaderHeight }, 500 );
			}
		} else {
			jQuery( '.woocommerce .avada-checkout .woocommerce-checkout' ).prepend( '<ul class="woocommerce-error"><li class="avada-checkout-error">' + avadaWooCommerceVars.woocommerce_checkout_error + '</li><ul>' );

			jQuery( document.body ).trigger( 'avada_checkout_error', [ avadaWooCommerceVars.woocommerce_checkout_error ] );

			if ( 0 < jQuery( '.woocommerce-error' ).length ) {
				jQuery( 'html, body' ).animate( { scrollTop: jQuery( '.woocommerce-error' ).offset().top - $adminBarHeight - $stickyHeaderHeight }, 500 );
			}
		}

		// Set heights of select arrows correctly
		calcSelectArrowDimensions();
	} );

	// Ship to a different address toggle
	jQuery( 'body' ).on( 'click', 'input[name=ship_to_different_address]',
		function() {
			if ( jQuery( this ).is( ':checked' ) ) {
				setTimeout( function() {

					// Set heights of select arrows correctly
					calcSelectArrowDimensions();
				}, 1 );
			}
		}
	);

	if ( Modernizr.mq( 'only screen and (max-width: 479px)' ) ) {
		jQuery( '.overlay-full.layout-text-left .slide-excerpt p' ).each( function() {
			var excerpt     = jQuery( this ).html(),
				wordArray   = excerpt.split( /[\s\.\?]+/ ), // Split based on regular expression for spaces
				maxWords    = 10, // Max number of words
				$totalWords = wordArray.length, // Current total of words
				newString   = '',
				l;

			// Roll back the textarea value with the words that it had previously before the maximum was reached
			if ( $totalWords > maxWords + 1 ) {
				for ( l = 0; l < maxWords; l++ ) {
					newString += wordArray[ l ] + ' ';
				}
				jQuery( this ).html( newString );
			}
		} );
	}

	// Fix for #7449.
	jQuery( '.wc-tabs li' ).on( 'click', function() {
		var $tab = jQuery( this ).attr( 'aria-controls' );
		setTimeout( function() {

			// Image carousel.
			if ( jQuery( '#' + $tab ).find( '.awb-carousel' ).length && 'function' === typeof generateSwiperCarousel ) {
				generateSwiperCarousel();
			}

			// Gallery.
			jQuery( '#' + $tab ).find( '.fusion-gallery' ).each( function() {
				jQuery( this ).isotope();
			} );

			// Blog.
			jQuery( '#' + $tab ).find( '.fusion-blog-shortcode' ).each( function() {
				jQuery( this ).find( '.fusion-blog-layout-grid' ).isotope();
			} );

			// Make WooCommerce shortcodes work.
			jQuery( '#' + $tab ).find( '.crossfade-images' ).each(	function() {
				fusionResizeCrossfadeImagesContainer( jQuery( this ) );
			} );

			// Flip Boxes.
			if ( 'function' === typeof jQuery.fn.fusionCalcFlipBoxesHeight ) {
				jQuery( '#' + $tab ).find( '.flip-box-inner-wrapper' ).each( function() {
					jQuery( this ).fusionCalcFlipBoxesHeight();
				} );
			}

			// Portfolio.
			jQuery( '#' + $tab ).find( '.fusion-portfolio' ).each( function() {
				jQuery( this ).find( '.fusion-portfolio-wrapper' ).isotope();
			} );

			// Google maps.
			if ( 'function' === typeof jQuery.fn.reinitializeGoogleMap ) {
				jQuery( '#' + $tab ).find( '.shortcode-map' ).each( function() {
					jQuery( this ).reinitializeGoogleMap();
				} );
			}
		}, 150 );
	} );

} );

jQuery( document ).ready( function() {
	var shippingStateField = jQuery( '#calc_shipping_country' ).parents( '.avada-shipping-calculator-form' ).find( '#calc_shipping_state_field' );

	if ( shippingStateField.length ) {
		if ( 'hidden' === shippingStateField.find( '#calc_shipping_state' ).attr( 'type' ) ) {
			shippingStateField.hide();
		} else {
			shippingStateField.show();
		}
	}
} );

// Reintalize scripts after ajax.
function reinitAftarAjax() {
	jQuery( '.fusion-update-cart, a[href="#updateCart"]' ).off( 'click' );
	jQuery( '.fusion-update-cart, a[href="#updateCart"]' ).on( 'click', function( e ) {
		e.preventDefault();
		jQuery( '.cart .actions > .button' ).trigger( 'click' );
		return false;
	} );

	// Make sure cross faded images height is correct.
	setTimeout( function() {
		jQuery( '.crossfade-images' ).each(
			function() {
				fusionResizeCrossfadeImagesContainer( jQuery( this ) );
			}
		);
	}, 1000 );
}
jQuery( window ).on( 'updated_wc_div', function() {
	reinitAftarAjax();
} );

jQuery( window ).on( 'fusion-dynamic-content-render', function( event, parent ) {
	var $reInitElems = jQuery( parent ).find( '.fusion-woo-slider' );

	if ( 0 < $reInitElems.length ) {
		$reInitElems.parents( '.fusion-tabs' ).css( 'height', '' );
	}

	$reInitElems = jQuery( parent ).find( '.crossfade-images' );

	if ( 0 < $reInitElems.length ) {
		$reInitElems.each( function() {
			fusionResizeCrossfadeImagesContainer( jQuery( this ) );
		} );
	}
} );

// Need to show element not hide.
jQuery( window ).on( 'updated_wc_div', function() {
	jQuery( '.cart_totals.fusion-animated' ).removeClass( 'fusion-animated' );
} );
