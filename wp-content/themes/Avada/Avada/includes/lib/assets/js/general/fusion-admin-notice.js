/* global fusionAdminNoticesNonce, ajaxurl */
( function() {

	// Shorthand for ready event.
	jQuery( function() {

		// Dimiss notice.
		jQuery( '.notice.fusion-is-dismissible button.notice-dismiss' ).on( 'click', function( event ) {
			var $this  = jQuery( this ),
				data   = $this.parent().data(),
				dismissAction = 'undefined' !== $this.parent().attr( 'id' ) && 'avada-data-notice' === $this.parent().attr( 'id' ) ? 'fusion_dismiss_data_notice' : 'fusion_dismiss_admin_notice';

			// Disable default behavior.
			event.preventDefault();

			// Make ajax request.
			jQuery.post( ajaxurl, {
				data: data,
				action: dismissAction,
				nonce: fusionAdminNoticesNonce.nonce
			} );
		} );
		jQuery( '#avada-data-notice.notice.fusion-is-dismissible .avada-send-data' ).on( 'click', function( event ) {
			var $this = jQuery( this ),
				data  = $this.parent().data();

			event.preventDefault();
			$this.attr( 'disabled', 'disabled' );

			// Make ajax request.
			jQuery.post( ajaxurl, {
				data: data,
				action: 'fusion_send_site_data',
				nonce: fusionAdminNoticesNonce.nonce
			} )
				.done( function( response ) {

					jQuery( '#avada-data-notice .avada-data-response' ).fadeIn();
					if ( 'undefined' !== response.status && 'success' === response.status ) {
						jQuery( '#avada-data-notice .data-success-response' ).fadeIn();
						jQuery( '#avada-data-notice .data-error-response' ).hide();
						setTimeout( function() {
							jQuery( '#avada-data-notice' ).hide();
						}, 2000 );

					} else {
						jQuery( '#avada-data-notice .data-error-response' ).fadeIn();
						jQuery( '#avada-data-notice .data-succuess-response' ).hide();
						$this.removeAttr( 'disabled' );
					}
				} );
		} );
	} );
}( jQuery ) );
