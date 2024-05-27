( function( jQuery ) {
	'use strict';

    jQuery( onDocumentLoading );

    function onDocumentLoading() {
        jQuery( '[data-awb-toggle-image-hotspot-popover="true"]' ).popover( { html: true } );
        jQuery( '[data-awb-toggle-image-hotspot-popover="true"]' ).on( 'keypress', popoverKeyHandler );
    }

    /**
     * Allow the popover to be shown for keyboard-only disabled users.
     */
    function popoverKeyHandler( event ) {
        var keyPressed = event.which;
        var spaceKey = 32;
        var enterKey = 13;

        var dataTrigger = jQuery( event.target ).attr( 'data-trigger' );
        var canBeShownViaFocus = ( dataTrigger && -1 !== dataTrigger.indexOf( 'focus' ) );
        if ( canBeShownViaFocus ) {
            return;
        }

        if ( keyPressed === spaceKey ) {
            // Prevent space scrolling.
            event.preventDefault();
            jQuery( event.target ).trigger( 'click' );
        }

        if ( keyPressed === enterKey ) {
            jQuery( event.target ).trigger( 'click' );
        }
    }

}( jQuery ) );
