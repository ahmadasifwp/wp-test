( function( jQuery ) {
	'use strict';

    // Open Live chat with dynamic data.
    jQuery( 'a[href="#hubspot-open-chat"]' ).on( 'click', function ( event ) {
        event.preventDefault();
        if ( window.HubSpotConversations ) {
            window.HubSpotConversations.widget.open();
        }
    } );
}( jQuery ) );
