/* global fusion, fusionWooNoticesVars, avadaWooCommerceVars */
( function( jQuery ) {
	'use strict';

	var fusion_woo_notices_frontend = {
		scrollTo: function() {
			var $adminBarHeight = 0,
				$headerDivChildren,
				$stickyHeaderHeight = 0;

			// Scroll also needs to be corrected since that is done by Woo in this case.
			$adminBarHeight     = fusion.getAdminbarHeight(),
			$headerDivChildren  = jQuery( '.fusion-header-wrapper' ).find( 'div' ),
			$stickyHeaderHeight = 0;

			$headerDivChildren.each( function() {
				if ( 'fixed' === jQuery( this ).css( 'position' ) ) {
					$stickyHeaderHeight = jQuery( this ).height();
				}
			} );

			// Stop animation which was triggered by Woo.
			jQuery( 'html, body' ).stop();

			// Animate to our error message.
			jQuery( 'html, body' ).animate( { scrollTop: jQuery( '.woocommerce-error, .woocommerce-message, .woocommerce-info' ).offset().top - $adminBarHeight - $stickyHeaderHeight }, 500 );
		}
	};

	jQuery( 'form.checkout' ).on( 'checkout_place_order', function() {
		if ( Boolean( fusionWooNoticesVars.login_required ) && ! fusionWooNoticesVars.is_logged_in ) {
			fusion_woo_notices_frontend.scrollTo();
			return false;
		}
	} );

	jQuery( document.body ).on( 'checkout_error avada_checkout_error', function( e, error_message ) {
		var tmpl,
			$adminBarHeight = 0,
			$headerDivChildren,
			$stickyHeaderHeight = 0,
			formFieldsLength = 0,
			genericErrorMsg = 'undefined' !== typeof avadaWooCommerceVars ? avadaWooCommerceVars.woocommerce_checkout_error : '';

		if ( jQuery( '.fusion-woo-notices-tb .woocommerce-notices-wrapper' ).length ) {

			if ( 'checkout_error' === e.type && 'undefined' !== typeof error_message ) {

				// Error message is HTML (<ul>) string, coming from Woo.
				tmpl = jQuery( error_message.replace( /<li>/g, '<li class="avada-checkout-error">' ) );

				// Make sure validation error class are added.
				tmpl.find( 'li[data-id]' ).each( function() {
					jQuery( '#' + jQuery( this ).data( 'id' ) + '_field' ).addClass( 'woocommerce-invalid woocommerce-invalid-required-field' );
				} );

				// Use generic error message and collect different type of errors.
				if ( 1 < tmpl.find( 'li' ).length ) {
					tmpl.find( 'li' ).each( function() {
						if ( jQuery( this )[ 0 ].hasAttribute( 'data-id' ) ) {
							formFieldsLength++;
							jQuery( this ).remove();
						}
					} );
				}

				if ( 0 < formFieldsLength ) {
					tmpl.append( '<li class="avada-checkout-error">' + genericErrorMsg + '</li>' );
				}

				// Scroll also needs to be corrected since that is done by Woo in this case.
				$adminBarHeight     = fusion.getAdminbarHeight(),
				$headerDivChildren  = jQuery( '.fusion-header-wrapper' ).find( 'div' ),
				$stickyHeaderHeight = 0;

				$headerDivChildren.each( function() {
					if ( 'fixed' === jQuery( this ).css( 'position' ) ) {
						$stickyHeaderHeight = jQuery( this ).height();
					}
				} );
			} else {

				if ( 'undefined' === typeof error_message ) {
					error_message = genericErrorMsg;
				}

				// Error message is plain string.
				tmpl = jQuery( '<ul class="woocommerce-error"><li class="avada-checkout-error">' + error_message + '</li><ul>' );
			}

			tmpl.find( 'li' ).each( function() {
				jQuery( this ).wrapInner( '<span class="wc-notices-text"></span>' ).prepend( fusionWooNoticesVars.error_icon );
			} );

			// Remove any previously added error message, including message added by Woo.
			jQuery( '.woocommerce-NoticeGroup-checkout, .woocommerce-error, .woocommerce-message' ).remove();

			// Add our own error message.
			jQuery( '.fusion-woo-notices-tb .woocommerce-notices-wrapper' ).prepend( tmpl[ 0 ].outerHTML );

			// Remove default Woo error and scroll to one we added.
			if ( 'checkout_error' === e.type ) {

				// Stop animation which was triggered by Woo.
				jQuery( 'html, body' ).stop();

				// Animate to our error message.
				jQuery( 'html, body' ).animate( { scrollTop: jQuery( '.woocommerce-error' ).offset().top - $adminBarHeight - $stickyHeaderHeight }, 500 );
			}
		}
	} ).on( 'applied_coupon_in_checkout removed_coupon_in_checkout', function( e, message ) { // eslint-disable-line no-unused-vars
		var form = 'applied_coupon_in_checkout' === e.type ? 'form.checkout_coupon' : 'form.woocommerce-checkout',
			message_type = 'success',
			$wc_messages = jQuery( form ).prev(),
			$woo_notices = jQuery( '.fusion-woo-notices-tb .woocommerce-notices-wrapper' );

		if ( $wc_messages.hasClass( 'woocommerce-error' ) ) {
			message_type = 'error';
		} else if ( $wc_messages.hasClass( 'woocommerce-info' ) ) {
			message_type = 'notice';
		}

		if ( $woo_notices.length && $wc_messages.length ) {
			if ( 'error' === message_type ) {
				$wc_messages.find( 'li' ).each( function() {
					jQuery( this ).wrapInner( '<span class="wc-notices-text"></span>' ).prepend( fusionWooNoticesVars.error_icon );
				} );
			} else {
				$wc_messages.wrapInner( '<span class="wc-notices-text"></span>' ).prepend( fusionWooNoticesVars[ message_type + '_icon' ] );
			}
			$woo_notices.prepend( $wc_messages );

			// scroll to position.
			fusion_woo_notices_frontend.scrollTo();
		}
	} ).on( 'applied_coupon removed_coupon', function( e, code ) { // eslint-disable-line no-unused-vars
		var $woo_notices = jQuery( '.fusion-woo-notices-tb .woocommerce-notices-wrapper' ),
			message_type = 'success';

		if ( $woo_notices.find( '.woocommerce-error' ).length ) {
			message_type = 'error';
		} else if ( $woo_notices.find( '.woocommerce-info' ).length ) {
			message_type = 'notice';
		}

		if ( 'error' === message_type ) {
			$woo_notices.find( 'li' ).each( function() {
				jQuery( this ).wrapInner( '<span class="wc-notices-text"></span>' ).prepend( fusionWooNoticesVars.error_icon );
			} );
		} else {
			$woo_notices.find( '.woocommerce-message, .woocommerce-info' ).wrapInner( '<span class="wc-notices-text"></span>' ).prepend( fusionWooNoticesVars[ message_type + '_icon' ] );
		}

		// scroll to position.
		fusion_woo_notices_frontend.scrollTo();
	} ).on( 'updated_checkout payment_method_selected', function( e, code ) { // eslint-disable-line no-unused-vars
		// Check if there woo notices element and remove other notice wrapper.
		if ( jQuery( '.fusion-woo-notices-tb .woocommerce-notices-wrapper' ).length ) {
			jQuery( '.woocommerce-notices-wrapper' ).filter( function() {
				return 0 === jQuery( this ).closest( '.fusion-woo-notices-tb' ).length;
			} ).remove();
		}
	} );

}( jQuery ) );
