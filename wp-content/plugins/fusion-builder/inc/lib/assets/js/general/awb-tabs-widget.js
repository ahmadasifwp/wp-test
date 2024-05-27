jQuery( document ).on( 'ready fusion-widget-render-Fusion_Widget_Tabs', function() {

	// On Click Event.
	jQuery( '.fusion-tabs-widget .fusion-tabs-nav li a' ).on( 'click', function( e ) {
		var tabToActivate = jQuery( this ).data( 'link' );

		e.preventDefault();

		// Remove all 'active' classes and add to next active tab.
		jQuery( this ).parents( '.fusion-tabs-nav' ).find( 'li' ).removeClass( 'active' );
		jQuery( this ).parent().addClass( 'active' ); // Add 'active' class to selected tab

		// Hide all tab content areas and then show next active.
		jQuery( this ).parents( '.fusion-tabs-widget' ).find( '.fusion-tab-content' ).hide();
		jQuery( this ).parents( '.fusion-tabs-widget' ).find( '.fusion-tab-content[data-name="' + tabToActivate + '"]' ).fadeIn();
	} );
} );
