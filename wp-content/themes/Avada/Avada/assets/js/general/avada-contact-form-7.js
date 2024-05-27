jQuery( document ).ready( function() {

	// New spinner for WPCF7.
	jQuery( '<div class="fusion-slider-loading"></div>' ).insertAfter( '.wpcf7 .ajax-loader' );
	jQuery( '.wpcf7 .ajax-loader' ).remove();

	jQuery( '.wpcf7 > form' ).each( function() {
		jQuery( this ).on( 'wpcf7submit', function( target ) {
			var self   = this,
				status = jQuery( target.currentTarget ).data( 'status' ),
				html   = '';

			setTimeout( function() {
				jQuery( self ).find( '.wpcf7-response-output' ).each( function() {
					if ( ( 'invalid' === status || 'unaccepted' === status || 'spam' === status || 'failed' === status ) && ! jQuery( this ).find( '.alert-icon' ).length ) {
						jQuery( this ).addClass( 'fusion-alert error fusion-danger' );

						if ( jQuery( this ).hasClass( 'alert-dismissable' ) ) {
							html = '<button class="close toggle-alert" aria-hidden="true" data-dismiss="alert" type="button" aria-label="Close">&times;</button>';
						}

						html += '<div class="fusion-alert-content-wrapper"><span class="alert-icon"><i class="fa-lg fa fa-exclamation-triangle" aria-hidden="true"></i></span><span class="fusion-alert-content">' + jQuery( this ).html() + '</span>';

						jQuery( this ).html( html );
					}

					if ( 'sent' === status && ! jQuery( this ).find( '.alert-icon' ).length ) {
						jQuery( this ).addClass( 'fusion-alert success fusion-success' );

						if ( jQuery( this ).hasClass( 'alert-dismissable' ) ) {
							html = '<button class="close toggle-alert" aria-hidden="true" data-dismiss="alert" type="button" ara-label="Close">&times;</button>';
						}

						html += '<div class="fusion-alert-content-wrapper"><span class="alert-icon"><i class="fa-lg fa fa-check-circle" aria-hidden="true"></i></span><span class="fusion-alert-content">' + jQuery( this ).html() + '</span>';
						console.log( html );
						jQuery( this ).html( html );
					}
				} );

				jQuery( self ).find(  '.wpcf7-response-output.fusion-alert .close' ).on( 'click', function( e ) {
					e.preventDefault();

					jQuery( this ).parent().slideUp();
				} );
			}, 100 );
		} );
	} );
} );
