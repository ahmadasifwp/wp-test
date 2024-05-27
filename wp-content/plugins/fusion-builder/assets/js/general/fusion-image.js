( function( jQuery ) {

	/*
	* Setup the image zoom for images.
	*
	*/
	jQuery.fn.fusionImageMagnify = function() {

		// Image magnify
		var $magnify        = jQuery( this ),
			magnifyImg      = $magnify.attr( 'data-magnify-img' ),
			magnifyDuration = $magnify.attr( 'data-magnify-duration' ),
			imgSrc			= '';

		// In case of lazy loading get original source
		if ( $magnify.find( 'img' ).hasClass( 'lazyload' ) ) {
			imgSrc	= $magnify.find( 'img' ).attr( 'data-orig-src' );
		} else {
			imgSrc	= $magnify.find( 'img' ).attr( 'src' );
		}
		magnifyImg      = 'undefined' === typeof magnifyImg || '' === magnifyImg ? imgSrc : magnifyImg;
		magnifyDuration = 'undefined' === typeof magnifyDuration || '' === magnifyDuration ? 120 : parseInt( magnifyDuration );
		$magnify.zoom(
		{
			url: magnifyImg,
			duration: magnifyDuration,
			touch: false,
			magnify: 1
		} );
	};

	// Image scroll
	jQuery.fn.fusionImageScroll = function() {
		var $scroll       = jQuery( this ),
			frameHeight   = $scroll.attr( 'data-scroll-height' ),
			scrollSpeed   = $scroll.attr( 'data-scroll-speed' ),
			$image        = $scroll.find( 'img' ),
			imageHeight   = $image.height(),
			translate     = '';

		frameHeight   = 'undefined' === typeof frameHeight || '' === frameHeight ? $scroll.height() : frameHeight;
		translate     = frameHeight - imageHeight;
		if ( 'undefined' === typeof translate || 0 <= translate ) {
			return;
		}
		$scroll.on( 'mouseenter', function() {
			$image.css( { 'transform': 'translateY( ' + translate + 'px)', 'transition': 'all ' + scrollSpeed + 's linear' } );
		} );
		$scroll.on( 'mouseleave', function() {
			$image.css( { 'transform': 'translateY( 0px )', 'transition': 'all ' + scrollSpeed + 's linear' } );
		} );
	};

}( jQuery ) );

// Image magnify and scroll.
jQuery( window ).on( 'load', function() {
	jQuery( '.fusion-image-element .has-image-magnify' ).each( function() {
		jQuery( this ).fusionImageMagnify();
	} );
	jQuery( '.fusion-image-element .has-image-scroll' ).each( function() {
		jQuery( this ).fusionImageScroll();
	} );
} );

// Live editor.
jQuery( window ).on( 'fusion-element-render-fusion_imageframe', function( event, cid ) {
	const $element = jQuery( 'div[data-cid="' + cid + '"]' );

	// Init image magnify.
	jQuery( $element.find( '.has-image-magnify' ) ).fusionImageMagnify();

	// Init image scroll.
	jQuery( $element.find( '.has-image-scroll' ) ).fusionImageScroll();
} );
