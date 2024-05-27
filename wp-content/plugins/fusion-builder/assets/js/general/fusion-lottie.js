/* global fusion */
( function( jQuery ) {
	'use strict';

	jQuery( window ).on( 'load fusion-element-render-fusion_lottie', function( event, cid ) {
		var $elements = 'undefined' !== typeof cid ? jQuery( 'div[data-cid="' + cid + '"]' ).find( '.fusion-lottie-animation' ) : jQuery( '.fusion-lottie-animation' );

		$elements.each( function() {
			const 	$element 	= jQuery( this ),
					player 		= $element.find( 'lottie-player' )[ 0 ],
					path   	= $element.attr( 'data-path' ),
					trigger   	= $element.attr( 'data-trigger' ),
					scroll_relative_to   	= $element.attr( 'data-scroll_relative_to' ),
					scroll_element   	= $element.attr( 'data-scroll_element' ),
					cursor_direction   	= $element.attr( 'data-cursor_direction' );

			let startPoint	= $element.attr( 'data-start_point' ),
				endPoint	= $element.attr( 'data-end_point' );

			player.load( path );

			jQuery( player ).off();
			$element.off();

			jQuery( player ).on( 'load', function () {
				const lottieEngine = player.getLottie();
				const totalFrames = lottieEngine.totalFrames;

				endPoint = endPoint && 100 < endPoint && endPoint > startPoint ? parseInt( ( totalFrames / 100 ) * endPoint )  : totalFrames;
				startPoint = startPoint ? parseInt( ( totalFrames / 100 ) * startPoint )  : 0;

				if ( 0 != startPoint || endPoint != totalFrames ) {
					lottieEngine.playSegments( [ startPoint, endPoint ], true );
				}

				if ( 'none' === trigger ) {
					player.play();
				} else if ( 'click' === trigger ) {
					$element.on( 'click', function() {
						player.play();
					} );
				} else if ( 'toggle' === trigger ) {
					$element.on( 'click', function() {
						player.togglePlay();
					} );
				} else if ( 'hover' === trigger ) {
					$element.on( 'mouseenter', function() {
						player.play();
					} );
					$element.on( 'mouseleave', function() {
						player.pause();
					} );
				} else if ( 'scroll' === trigger ) {
					if ( 'page' === scroll_relative_to ) {
						// get initial position.
						const initPosition = parseInt( getScrollPercent() );
						player.seek( initPosition + '%' );

						// On scroll event.
						jQuery( window ).on( 'scroll', function() {
							const percentageValue = parseInt( getScrollPercent() );
							player.seek( percentageValue + '%' );
						} );

					} else {
						// eslint-disable-next-line no-lonely-if
						if ( window.LottieInteractivity ) {
							const scrollOptions = {
								player,
								mode: 'scroll',
								actions: [
									{
										visibility: [ 0, 1 ],
										type: 'seek',
										frames: [ startPoint, endPoint ]
									}
								]
							};

							if ( 'element' === scroll_relative_to && '' !== scroll_element ) {
								scrollOptions.container = scroll_element;
							}

							window.LottieInteractivity.create( scrollOptions );
						}
					}
				} else if ( 'cursor' === trigger ) {
					// eslint-disable-next-line no-lonely-if
					if ( window.LottieInteractivity ) {
						let position = { x: [ 0, 1 ], y: [ -1, 2 ] };
						if ( 'vertical' === cursor_direction ) {
							position = { x: [ -1, 2 ], y: [ 0, 1 ] };
						} else if ( 'both' === cursor_direction ) {
							position = { x: [ 0, 1 ], y: [ 0, 1 ] };
						}
						const cursorOptions = {
							player,
							mode: 'cursor',
							actions: [
								{
									position,
									type: 'seek',
									frames: [ startPoint, endPoint ]
								}
							]
						};
						window.LottieInteractivity.create( cursorOptions );
					}
				} else if ( 'IntersectionObserver' in window ) {
						jQuery.each( fusion.getObserverSegmentation( $element ), function( index ) {
							var options        = fusion.getAnimationIntersectionData( index ),
								lottieObserver = new IntersectionObserver( function( entries, observer ) {
									jQuery.each( entries, function( key, entry ) {
										if ( fusion.shouldObserverEntryAnimate( entry, observer ) ) {
											player.play();

											// Unobserve.
											lottieObserver.unobserve( entry.target );
										}
									} );
								}, options );

							// Observe.
							jQuery( this ).each( function() {
								lottieObserver.observe( this );
							} );
						} );
				} else {
						jQuery( this ).each( function() {
							player.play();
						} );
				}

			} );
			} );

	} );

	/** Utils */
	function getScrollPercent() {
		var h = document.documentElement,
		b = document.body,
		st = 'scrollTop',
		sh = 'scrollHeight';
		return ( h[ st ] || b[ st ] ) / ( ( h[ sh ] || b[ sh ] ) - h.clientHeight ) * 100;
	}

}( jQuery ) );
