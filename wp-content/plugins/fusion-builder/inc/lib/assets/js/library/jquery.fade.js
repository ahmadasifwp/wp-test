( function( jQuery ) {

	'use strict';

	// Fusion scroller plugin to change css while scrolling
	jQuery.fn.fusionScroller = function( options ) {
		var settings = jQuery.extend({
				type: 'opacity',
				offset: 0,
				endOffset: ''
			}, options ),
		    divs = jQuery( this );

		divs.each( function() {
			var offset,
			    height,
			    endOffset,
			    currentElement = this;

			jQuery( window ).on( 'scroll', function() {

				var st,
				    diff,
				    diffPercentage,
				    opacity,
				    blur;

				offset = jQuery( currentElement ).offset().top;
				if ( jQuery( 'body' ).hasClass( 'admin-bar' ) ) {
					offset = jQuery( currentElement ).offset().top - jQuery( '#wpadminbar' ).outerHeight();
				}
				if ( 0 < settings.offset ) {
					offset = jQuery( currentElement ).offset().top - settings.offset;
				}
				height = jQuery( currentElement ).outerHeight();

				endOffset = offset + height;
				if ( settings.endOffset && jQuery( settings.endOffset ).length ) {
					endOffset = jQuery( settings.endOffset ).offset().top;
				}

				st = jQuery( this ).scrollTop();

				if ( st >= offset && st <= endOffset ) {
					diff = endOffset - st;
					diffPercentage = ( diff / height ) * 100;

					if ( 'opacity' === settings.type ) {
						opacity = ( diffPercentage / 100 ) * 1;
						jQuery( currentElement ).css({
							'opacity': opacity
						});
					} else if ( 'blur' === settings.type ) {
						diffPercentage = 100 - diffPercentage;
						blur = 'blur(' + ( ( diffPercentage / 100 ) * 50 ) + 'px)';
						jQuery( currentElement ).css({
							'-webkit-filter': blur,
							'-ms-filter': blur,
							'-o-filter': blur,
							'-moz-filter': blur,
							'filter': blur
						});
					} else if ( 'fading_blur' === settings.type ) {
						opacity = ( diffPercentage / 100 ) * 1;
						diffPercentage = 100 - diffPercentage;
						blur = 'blur(' + ( ( diffPercentage / 100 ) * 50 ) + 'px)';
						jQuery( currentElement ).css({
							'-webkit-filter': blur,
							'-ms-filter': blur,
							'-o-filter': blur,
							'-moz-filter': blur,
							'filter': blur,
							'opacity': opacity
						});
					}
				}

				if ( st < offset ) {
					if ( 'opacity' === settings.type ) {
						jQuery( currentElement ).css({
							'opacity': 1
						});
					} else if ( 'blur' === settings.type ) {
						blur = 'blur(0px)';
						jQuery( currentElement ).css({
							'-webkit-filter': blur,
							'-ms-filter': blur,
							'-o-filter': blur,
							'-moz-filter': blur,
							'filter': blur
						});
					} else if ( 'fading_blur' === settings.type ) {
						blur = 'blur(0px)';
						jQuery( currentElement ).css({
							'opacity': 1,
							'-webkit-filter': blur,
							'-ms-filter': blur,
							'-o-filter': blur,
							'-moz-filter': blur,
							'filter': blur
						});
					}
				}
			});
		});
	};
})( jQuery );
