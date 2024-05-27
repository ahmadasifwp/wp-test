/* global google */
( function( jQuery ) {

	'use strict';

	// Reinitialize google map; needed when maps are loaded inside of hidden containers
	jQuery.fn.reinitializeGoogleMap = function() {
		var fusionMapObject = jQuery( this ).data( 'plugin_fusion_maps' ),
			map,
			center,
			markers,
			i;

		if ( fusionMapObject ) {
			map     = fusionMapObject.map;
			center  = map.getCenter();
			markers = fusionMapObject.markers;

			google.maps.event.trigger( map, 'resize' );
			map.setCenter( center );
			if ( markers ) {
				for ( i = 0; i < markers.length; i++ ) {
					google.maps.event.trigger( markers[ i ], 'click' );
					google.maps.event.trigger( markers[ i ], 'click' );
				}
			}
		}
	};
}( jQuery ) );


jQuery( window ).on( 'fusion-dynamic-content-render', function( event, parent ) {
	var $reInitElems = jQuery( parent ).find( '.shortcode-map' );

	if ( 0 < $reInitElems.length ) {
		$reInitElems.each( function() {
			jQuery( this ).reinitializeGoogleMap();
		} );
	}
} );
