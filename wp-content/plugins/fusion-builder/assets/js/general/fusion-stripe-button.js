/* global fusionStripeButtonVars */
( function( jQuery ) {
	'use strict';

	function addLoadingIndicator( $form ) {
		$form.find( 'button[type="submit"]' ).addClass( 'fusion-button-submitting' );
	}

	function removeLoadingIndicator( $form ) {
		$form.find( 'button[type="submit"]' ).removeClass( 'fusion-button-submitting' );
	}

	jQuery( document.body ).on( 'submit', '.awb-stripe-button-form', function( event ) {
		var $form = jQuery( this );
		event.preventDefault();

		$form.find( '.awb-stripe-button-response' ).hide();
		addLoadingIndicator( $form );

		// Check for empty product name and price.
		if ( '' === $form.find( '[name="product_name"]' ).val() || '' === $form.find( '[name="product_price"]' ).val() ) {
			$form.find( '.awb-stripe-button-response-error .fusion-alert-content' ).html( fusionStripeButtonVars.productEmptyText ).end()
			.find( '.awb-stripe-button-response-error' ).slideDown( 300 );
			removeLoadingIndicator( $form );
			return true;
		}

		jQuery.ajax( {
			type: 'POST',
			url: fusionStripeButtonVars.ajax_url,
			data: {
				action: 'awb_stripe_button_submit',
				nonce: window.fusionStripeButtonVars.nonce,
				data: jQuery( this ).serialize()
			},
			dataType: 'json',
			beforeSend: function() {
				$form.find( 'button[type="submit"] .fusion-button-text' ).text( $form.data( 'button-process-text' ) );
			},
			success: function( resp ) {
				var code = resp.response.code,
					result = resp.body && JSON.parse( resp.body );

				switch ( code ) {
					case 200:
						window.open( result.url, $form.data( 'target' ) );
						break;

					default:
						$form.find( '.awb-stripe-button-response-error .fusion-alert-content' ).html( result.error.message ).end()
						.find( '.awb-stripe-button-response-error' ).slideDown( 300 );
						break;
				}

				removeLoadingIndicator( $form );
			}
		} );
	} );

}( jQuery ) );
