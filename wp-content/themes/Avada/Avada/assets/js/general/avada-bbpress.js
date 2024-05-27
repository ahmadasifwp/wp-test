/* global avadaBbpressVars */
jQuery( window ).on( 'load', function() {
	jQuery( '.bbp-template-notice' ).each( function() {
		var html = '',
			icon = '';

		if ( jQuery( this ).hasClass( 'info' ) ) {
			jQuery( this ).attr( 'class', 'fusion-alert alert notice alert-info' );
			icon = 'fa-info-circle';
		} else {
			jQuery( this ).attr( 'class', 'fusion-alert alert notice alert-warning' );
			icon = 'fa-cog';
		}

		jQuery( this ).addClass( 'fusion-alert-' + avadaBbpressVars.alert_box_text_align );

		if ( 'capitalize' === avadaBbpressVars.alert_box_text_transform ) {
			jQuery( this ).addClass( 'fusion-alert-capitalize' );
		}

		if ( 'yes' === avadaBbpressVars.alert_box_dismissable ) {
			jQuery( this ).addClass( 'alert-dismissable' );
			html = '<button class="close toggle-alert" aria-hidden="true" data-dismiss="alert" type="button" aria-label="Close">&times;</button>';
		}

		if ( 'yes' === avadaBbpressVars.alert_box_shadow ) {
			jQuery( this ).addClass( 'alert-shadow' );
		}

		jQuery( this ).css( 'border-width', parseInt( avadaBbpressVars.alert_border_size, 10 ) + 'px' );

		jQuery( this ).children( 'tt' ).contents().unwrap();
		jQuery( this ).children( 'p' ).contents().unwrap();

		html += '<div class="fusion-alert-content-wrapper"><span class="alert-icon"><i class="fa-lg fa ' + icon + '" aria-hidden="true"></i></span><span class="fusion-alert-content">' + jQuery( this ).html() + '</span>';

		jQuery( this ).html( html );

		jQuery( this ).children( '.close' ).on( 'click', function( e ) {
			e.preventDefault();

			jQuery( this ).parent().slideUp();
		} );
	} );

	jQuery( '.bbp-login-form' ).each( function() {
		jQuery( this ).children( 'tt' ).contents().unwrap();
	} );
} );
