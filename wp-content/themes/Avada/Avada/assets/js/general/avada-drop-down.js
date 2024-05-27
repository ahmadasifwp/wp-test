/* global calcSelectArrowDimensions, avadaSelectVars */
jQuery( window ).on( 'load fusion-element-render-fusion_tb_woo_cart  fusion-element-render-fusion_tb_woo_checkout_tabs  fusion-element-render-fusion_tb_woo_checkout_billing fusion-element-render-fusion_tb_woo_checkout_shipping fusion-element-render-fusion_woo_cart_shipping', function() {
	addAvadaSelectStyles();

	jQuery( window ).on( 'DestoryAvadaSelect', removeAvadaSelectStyles );
	jQuery( window ).on( 'AddAvadaSelect', addAvadaSelectStyles );
} );

/**
 * Adds avada select styles.
 *
 * @since 2.0.0
 * @return {void}
 */
function addAvadaSelectStyles() {

	if ( ! Number( avadaSelectVars.avada_drop_down ) ) {
		return;
	}

	if ( jQuery( '.tribe-tickets-order_status-row select' ).length ) {
		jQuery( '.tribe-tickets-order_status-row select' ).addClass( 'avada-select' );
		jQuery( '.tribe-tickets-order_status-row select' ).wrap( '<div class="avada-select-parent"></div>' ).after( '<div class="select-arrow">&#xe61f;</div>' );

		jQuery( '.tribe-ticket-quantity' ).on( 'change', function() {
			setTimeout( function() {
				calcSelectArrowDimensions();
			}, 1 );
		} );
	}

	if ( jQuery( '.tribe-block__tickets__item__attendee__fields__form select' ).length ) {
		jQuery( '.tribe-block__tickets__item__attendee__fields__form select' ).wrap( '<div class="avada-select-parent"></div>' ).after( '<div class="select-arrow">&#xe61f;</div>' );
	}

	jQuery( '.woocommerce-billing-fields, .woocommerce-shipping-fields' ).addClass( 'avada-select' );

	if ( jQuery( '.woocommerce.widget_product_categories select' ).length ) {
		jQuery( '.woocommerce.widget_product_categories select' ).wrap( '<p class="avada-select-parent"></p>' ).after( '<div class="select-arrow">&#xe61f;</div>' );
	}

	jQuery( '.cart-collaterals select#calc_shipping_country, .widget_layered_nav select' ).wrap( '<p class="avada-select-parent"></p>' ).after( '<div class="select-arrow">&#xe61f;</div>' );
	jQuery( '.cart-collaterals select#calc_shipping_state' ).after( '<div class="select-arrow">&#xe61f;</div>' );

	setTimeout( function() {

		// Billing address - Only add styling if woocommerce enhanced country selects are disabled
		if ( ! jQuery( '#billing_country_field .chosen-container' ).length && ! jQuery( '#billing_country_field .select2-container' ).length ) {

			// Wrap the country select
			jQuery( '#billing_country_field select.country_select' ).wrap( '<p class="avada-select-parent"></p>' ).after( '<span class="select-arrow">&#xe61f;</span>' );

			// If there is a state select for the initially selected country, wrap it
			if ( jQuery( '#billing_state_field select.state_select' ).length && ! jQuery( '#billing_state_field .chosen-container' ).length && ! jQuery( '#billing_state_field .select2-container' ).length ) {
				jQuery( '#billing_state_field' ).addClass( 'avada-select-parent' ).append( '<div class="select-arrow">&#xe61f;</div>' );
			}

			// When the country is changed
			jQuery( '#billing_country' ).on( 'change', function() {

				// Timeout is needed that woocommerce js can kick in first
				setTimeout( function() {

					// If the new country has no state field at all or if it is just an input, undo custom styles
					if ( jQuery( '#billing_state_field input#billing_state' ).length || jQuery( '#billing_state_field' ).is( ':hidden' ) ) {
						jQuery( '#billing_state_field .select-arrow' ).remove();
						jQuery( '#billing_state_field' ).removeClass( 'avada-select-parent' );
					}

					// If the new country has a state select
					if ( jQuery( '#billing_state_field select.state_select' ).length ) {

						// Add the correct wrapper class (always needed due to woocommerce classes reset)
						jQuery( '#billing_state_field' ).addClass( 'avada-select-parent' );

						// If the last country wasn't already having a state select, add the arrow container and calculate dimensions
						if ( ! jQuery( '#billing_state_field .select-arrow' ).length ) {
							jQuery( '#billing_state_field' ).append( '<div class="select-arrow">&#xe61f;</div>' );

							calcSelectArrowDimensions();
						}
					}
				}, 1 );
			} );
		}

		// Shipping address - Only add styling if woocommerce enhanced country selects are disabled
		if ( ! jQuery( '#shipping_country_field .chosen-container' ).length && ! jQuery( '#shipping_country_field .select2-container' ).length ) {
			jQuery( '#shipping_country_field select.country_select' ).wrap( '<p class="avada-select-parent"></p>' ).after( '<span class="select-arrow">&#xe61f;</span>' );

			// If there is a state select for the initially selected country, wrap it
			if ( jQuery( '#shipping_state_field select.state_select' ).length ) {
				jQuery( '#shipping_state_field' ).addClass( 'avada-select-parent' ).append( '<div class="select-arrow">&#xe61f;</div>' );
			}

			jQuery( '#shipping_country' ).on( 'change', function() {

				// Timeout is needed that woocommerce js can kick in first
				setTimeout( function() {

					// If the new country has no state field at all or if it is just an input, undo custom styles
					if ( jQuery( '#shipping_state_field input#shipping_state' ).length || jQuery( '#shipping_state_field' ).is( ':hidden' ) ) {
						jQuery( '#shipping_state_field .select-arrow' ).remove();
						jQuery( '#shipping_state_field' ).removeClass( 'avada-select-parent' );
					}

					// If the new country has a state select
					if ( jQuery( '#shipping_state_field select.state_select' ).length ) {

						// Add the correct wrapper class (always needed due to woocommerce classes reset)
						jQuery( '#shipping_state_field' ).addClass( 'avada-select-parent' );

						// If the last country wasn't already having a state select, add the arrow container and calculate dimensions
						if ( ! jQuery( '#shipping_state_field .select-arrow' ).length ) {
							jQuery( '#shipping_state_field' ).append( '<div class="select-arrow">&#xe61f;</div>' );

							calcSelectArrowDimensions();
						}
					}
				}, 1 );
			} );
		}
	}, 1 );

	jQuery( '#calc_shipping_country' ).on( 'change', function() {

		// Timeout is needed that woocommerce js can kick in first
		setTimeout( function() {

			if ( jQuery( '.avada-shipping-calculator-form select#calc_shipping_state' ).length && ! jQuery( '.avada-shipping-calculator-form #calc_shipping_state' ).parent().find( '.select-arrow' ).length ) {
				jQuery( '.avada-shipping-calculator-form select#calc_shipping_state' ).after( '<div class="select-arrow">&#xe61f;</div>' );
			}

			if ( jQuery( '.avada-shipping-calculator-form input#calc_shipping_state' ).length || jQuery( '.avada-shipping-calculator-form #calc_shipping_state_field .select2' ).length ) {
				jQuery( '.avada-shipping-calculator-form #calc_shipping_state' ).parent().children( '.select-arrow' ).remove();
			}

			calcSelectArrowDimensions();
		}, 1 );
	} );

	// Wrap variation forms select and add arrow.
	jQuery( 'table.variations select, .variations-table select, .product-addon select' ).filter( ':not(.yith_wccl_custom)' ).wrap( '<div class="avada-select-parent"></div>' );
	jQuery( '<div class="select-arrow">&#xe61f;</div>' ).appendTo( 'table.variations .avada-select-parent, .variations-table .avada-select-parent, .product-addon .avada-select-parent' );

	// Wrap cf7 select and add arrow.
	jQuery( '.wpcf7-select:not([multiple])' ).wrap( '<div class="wpcf7-select-parent"></div>' );
	jQuery( '<div class="select-arrow">&#xe61f;</div>' ).appendTo( '.wpcf7-select-parent' );

	// Wrap woo and bbpress select and add arrow.
	jQuery( '#bbp_stick_topic_select, #bbp_topic_status_select, #bbp_forum_id, #bbp_destination_topic, #wpfc_sermon_sorting select' ).wrap( '<div class="avada-select-parent"></div>' ).after( '<div class="select-arrow">&#xe61f;</div>' );

	jQuery( '.variations_form select' ).on( 'change', function() {
		if ( jQuery( '.product #slider' ).length && 1 < jQuery( '.product #slider .slides li' ).length ) {
			jQuery( '.product #slider' ).flexslider( 0 );
		}
	} );

	calcSelectArrowDimensions();
}

/**
 * Removes avada select styles.
 *
 * @since 2.0.0
 * @return {void}
 */
function removeAvadaSelectStyles() {

	if ( ( Number( avadaSelectVars.avada_drop_down ) ) ) {
		return;
	}

	jQuery( 'select' ).each( function() {
		var classCount;
		if ( jQuery( this ).parent().is( '.avada-select-parent' ) ) {
			classCount = jQuery( this ).closest( '.avada-select-parent' ).attr( 'class' ).split( ' ' );
			if ( 1 === classCount.length ) {
				jQuery( this ).unwrap();
			} else {
				jQuery( this ).closest( '.avada-select-parent' ).removeClass( 'avada-select-parent' );
			}
		}
	} );

	jQuery( 'select' ).removeClass( 'avada-select avada-select-parent wpcf7-select-parent' );
	jQuery( '.select-arrow' ).remove();

}
