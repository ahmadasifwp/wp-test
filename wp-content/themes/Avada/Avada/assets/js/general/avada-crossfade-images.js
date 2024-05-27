function fusionResizeCrossfadeImagesContainer( $container ) {
	var $biggestHeight = 0;

	$container.find( 'img' ).each( function() {
		var $imgHeight = jQuery( this ).height();

		if ( $imgHeight > $biggestHeight ) {
			$biggestHeight = $imgHeight;
		}
	} );

	$container.css( 'height', $biggestHeight );
}

// Resize crossfade images and square to be the largest image and also vertically centered
jQuery( window ).on( 'load', function() {

	jQuery( window ).on( 'resize',
		function() {
			jQuery( '.crossfade-images' ).each(
				function() {
					fusionResizeCrossfadeImagesContainer( jQuery( this ) );
				}
			);
		}
	);

	jQuery( '.crossfade-images' ).each( function() {
		fusionResizeCrossfadeImagesContainer( jQuery( this ) );
	} );

} );
