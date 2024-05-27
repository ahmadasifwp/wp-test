/* global define, cssua, fusionJSVars, Modernizr */
/**
 * requestAnimationFrame polyfill
 *
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 * requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 * requestAnimationFrame polyfill under MIT license
 */
( function( global ) {

	( function() {

		var lastTime = 0;

		if ( global.requestAnimationFrame ) {
			return;
		}

		// Chrome <= 23, Safari <= 6.1, Blackberry 10
		if ( global.webkitRequestAnimationFrame ) {
			global.requestAnimationFrame = global.webkitRequestAnimationFrame;
			global.cancelAnimationFrame  = global.webkitCancelAnimationFrame || global.webkitCancelRequestAnimationFrame;
		}

		// IE <= 9, Android <= 4.3, very old/rare browsers
		global.requestAnimationFrame = function( callback ) {
			var currTime   = new Date().getTime(),
				timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) ),
				id = global.setTimeout( function() {
					callback( currTime + timeToCall );
				}, timeToCall );

			lastTime = currTime + timeToCall;

			// Return the id for cancellation capabilities.
			return id;

		};

		global.cancelAnimationFrame = function( id ) {
			clearTimeout( id );
		};

	}() );

	if ( 'function' === typeof define ) {
		define( function() {
			return global.requestAnimationFrame;
		} );
	}

}( window ) );

// Don't re-initialize our variables since that can delete existing values
if ( 'undefined' === typeof window._fusionImageParallaxImages ) {
	window._fusionImageParallaxImages = [];
}

( function( $, window ) {

	// Create the defaults once
	var pluginName = 'fusionImageParallax',
		defaults   = {
			direction: 'up', // Fixed
			mobileenabled: false,
			mobiledevice: false,
			width: '',
			height: '',
			align: 'center',
			opacity: '1',
			velocity: '.3',
			image: '', // The background image to use, if empty, the current background image is used
			target: '', // The element to apply the parallax to
			repeat: false,
			loopScroll: '',
			loopScrollTime: '2',
			removeOrig: false,
			complete: function() {} // eslint-disable-line no-empty-function
		};

	// The actual plugin constructor
	function Plugin( element, options ) {

		var bgPosition;

		this.element = element;

		/**
		 * The jQuery library has an extend method which merges
		 * the contents of two or more objects, storing the result in the first object.
		 * The first object is generally empty as we don't want to alter
		 * the default options for future instances of the plugin.
		 */
		this.settings = $.extend( {}, defaults, options );

		// ThemeFusion edit for Avada theme: making background position work
		bgPosition = this.settings.align.split( ' ' );
		this.settings.xpos = bgPosition[ 0 ];

		if ( 2 === bgPosition.length ) {
			this.settings.ypos = bgPosition[ 1 ];
		} else {
			this.settings.ypos = 'center';
		}

		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}

	// Avoid Plugin.prototype conflicts
	$.extend(
		Plugin.prototype, {
			init: function() {
				var elementLength;

				// Place initialization logic here
				// You already have access to the DOM element and
				// the options via the instance, e.g. this.element
				// and this.settings
				// you can add more functions like the one below and
				// call them like so: this.yourOtherFunction(this.element, this.settings).
				// console.log("xD");

				// $(window).bind( 'parallax', function() {
				// self.fusionImageParallax();
				// });

				// If there is no target, use the element as the target
				if ( '' === this.settings.target ) {
					this.settings.target = $( this.element );
				}

				// If there is no image given, use the background image if there is one
				if ( '' === this.settings.image ) {

					// If ( typeof $(this.element).css('backgroundImage') !== 'undefined' && $(this.element).css('backgroundImage').toLowerCase() !== 'none' && $(this.element).css('backgroundImage') !== '' )
					if ( 'undefined' !== typeof $( this.element ).css( 'backgroundImage' ) && '' !== $( this.element ).css( 'backgroundImage' ) ) {
						this.settings.image = $( this.element ).css( 'backgroundImage' ).replace( /url\(|\)|"|'/g, '' );
					}
				}

				// Responsive background image.
				if ( this.settings.imageMedium && Modernizr.mq( 'only screen and (max-width: ' + fusionJSVars.visibility_medium + 'px)' ) ) {
					this.settings.image = this.settings.imageMedium;
				}

				if ( this.settings.imageSmall && Modernizr.mq( 'only screen and (max-width: ' + fusionJSVars.visibility_small + 'px)' ) ) {
					this.settings.image = this.settings.imageSmall;
				}

				elementLength = window._fusionImageParallaxImages.push( this );
				jQuery( this.element ).attr( 'data-parallax-index', elementLength - 1 );

				this.setup();

				this.settings.complete();

				this.containerWidth = 0;
				this.containerHeight = 0;
			},

			setup: function() {
				if ( false !== this.settings.removeOrig ) {
					$( this.element ).remove();
				}

				this.resizeParallaxBackground();
			},

			doParallax: function() {
				var $target = this.settings.target.find( '.parallax-inner' ),
					w,
					h,
					percentageScroll,
					dist,
					translateHori,
					translateHoriSuffix,
					translateVert,
					translateVertSuffix;

				// If it's a mobile device and not told to activate on mobile, stop.
				if ( this.settings.mobiledevice && ! this.settings.mobileenabled ) {

					/*
					$target.css( {
						'width': '100%',
						'top': '0',
						'left': '0',
						'right': '0',
						'height': 'auto',
						'min-height': $target.parent().outerHeight() + 'px'
					});
					*/
					return;
				}

				// Check if the container is in the view.
				if ( ! this.isInView() ) {
					return;
				}

				// Assert a minimum of 150 pixels of height globally. Prevents the illusion of parallaxes not rendering at all in empty fields.
				$target.css( {
					minHeight: '150px'
				} );

				// Retrigger a resize if the container's size suddenly changed.
				w = this.settings.target.width() + parseInt( this.settings.target.css( 'paddingRight' ), 10 ) + parseInt( this.settings.target.css( 'paddingLeft' ), 10 );
				h = this.settings.target.height() + parseInt( this.settings.target.css( 'paddingTop' ), 10 ) + parseInt( this.settings.target.css( 'paddingBottom' ), 10 );
				if ( 0 !== this.containerWidth && 0 !== this.containerHeight && ( w !== this.containerWidth || h !== this.containerHeight ) ) {
					this.resizeParallaxBackground();
				}
				this.containerWidth = w;
				this.containerHeight = h;

				// If we don't have anything to scroll, stop
				if ( 'undefined' === typeof $target || 0 === $target.length ) {
					return;
				}

				// Compute for the parallax amount.
				percentageScroll = ( window._fusionScrollTop - this.scrollTopMin ) / ( this.scrollTopMax - this.scrollTopMin );
				dist             = this.moveMax * percentageScroll;

				if ( 'down' ===  this.settings.direction ) {
					dist *= 1.25;
				}

				// Change direction.
				if ( 'left' === this.settings.direction || 'up' === this.settings.direction ) {
					dist *= -1;
				}

				// Safari doesn't support 3d transforms, so fallback to 2d translate
				translateHori       = 'translate3d(';
				translateHoriSuffix = 'px, -2px, 0px)';
				translateVert       = 'translate3d(0, ';
				translateVertSuffix = 'px, 0)';

				if ( jQuery( 'html' ).hasClass( 'ua-safari' ) && $target.parent().find( '.fusion-section-separator' ).length ) {
					translateHori       = 'translate(';
					translateHoriSuffix = 'px, 0)';
					translateVert       = 'translate(0, ';
					translateVertSuffix = 'px)';
				}

				if ( 'no-repeat' === $target.css( 'background-repeat' ) ) {
					if ( 'down' === this.settings.direction && 0 > dist ) {
						dist = 0;
					} else if ( 'up' === this.settings.direction && 0 < dist ) {
						dist = 0;
					}  else if ( 'right' === this.settings.direction && 0 > dist ) {
						dist = 0;
					}  else if ( 'left' === this.settings.direction && 0 < dist ) {
						dist = 0;
					}
				}

				// Apply the parallax transforms
				// Use GPU here, use transition to force hardware acceleration
				if ( 'fixed' === this.settings.direction ) {

					// For fixed direction, mimic the position of the scroll since doing a position: fixed
					// inside an overflow: hidden doesn't work in Firefox
					/*
					$target.css({
						top: -this.settings.target.offset().top,
						webkitTransition: 'webkitTransform 1ms linear',
						mozTransition: 'mozTransform 1ms linear',
						msTransition: 'msTransform 1ms linear',
						oTransition: 'oTransform 1ms linear',
						transition: 'transform 1ms linear',
						webkitTransform: translateVert + window._fusionScrollTop + translateVertSuffix,
						mozTransform: translateVert + window._fusionScrollTop + translateVertSuffix,
						msTransform: translateVert + window._fusionScrollTop + translateVertSuffix,
						oTransform: translateVert + window._fusionScrollTop + translateVertSuffix,
						transform: translateVert + window._fusionScrollTop + translateVertSuffix
					});
*/
				} else if ( 'left' === this.settings.direction || 'right' === this.settings.direction ) {
					$target.css(
						{
							webkitTransform: translateHori + dist + translateHoriSuffix,
							mozTransform: translateHori + dist + translateHoriSuffix,
							msTransform: translateHori + dist + translateHoriSuffix,
							oTransform: translateHori + dist + translateHoriSuffix,
							transform: translateHori + dist + translateHoriSuffix
						}
					);
				} else {
					$target.css(
						{
							webkitTransform: translateVert + dist + translateVertSuffix,
							mozTransform: translateVert + dist + translateVertSuffix,
							msTransform: translateVert + dist + translateVertSuffix,
							oTransform: translateVert + dist + translateVertSuffix,
							transform: translateVert + dist + translateVertSuffix
						}
					);
				}
			},

			// Checks whether the container with the parallax is inside our viewport
			isInView: function() {
				var $target = this.settings.target,
					elemTop,
					elemHeight;

				if ( 'undefined' === typeof $target || 0 === $target.length ) {
					return;
				}

				elemTop    = $target.offset().top;
				elemHeight = $target.height() + parseInt( $target.css( 'paddingTop' ), 10 ) + parseInt( $target.css( 'paddingBottom' ), 10 );

				if ( elemTop + elemHeight < window._fusionScrollTop || window._fusionScrollTop + window._fusionWindowHeight < elemTop ) {
					return false;
				}

				return true;
			},

			// ThemeFusion edit for Avada theme: add overlay gradient.
			setBackgroundStyling: function( $target, gradientString ) {
				var blendMode = 'none' === this.settings.blendMode ? '' : this.settings.blendMode,
					bgColor   = this.settings.backgroundColor;

				// Responsive background color.
				if ( this.settings.backgroundColorMedium && Modernizr.mq( 'only screen and (max-width: ' + fusionJSVars.visibility_medium + 'px)' ) ) {
					bgColor = this.settings.backgroundColorMedium;
				}

				if ( this.settings.backgroundColorSmall && Modernizr.mq( 'only screen and (max-width: ' + fusionJSVars.visibility_small + 'px)' ) ) {
					bgColor = this.settings.backgroundColorSmall;
				}

				// Responsive blend mode.
				if ( this.settings.blendModeMedium && Modernizr.mq( 'only screen and (max-width: ' + fusionJSVars.visibility_medium + 'px)' ) ) {
					blendMode = this.settings.blendModeMedium;
				}

				if ( this.settings.blendModeSmall && Modernizr.mq( 'only screen and (max-width: ' + fusionJSVars.visibility_small + 'px)' ) ) {
					blendMode = this.settings.blendModeSmall;
				}

				$target.find( '.parallax-inner' ).css( {
					'background-color': bgColor,
					'background-blend-mode': blendMode
				} );

				if ( '' !== gradientString ) {
					$target.find( '.parallax-inner' ).css( {
						'background-image': gradientString
					} );
				}
			},

			// Resizes the parallax to match the container size
			resizeParallaxBackground: function() {
				var $target = this.settings.target,
					isRepeat,
					w,
					h,
					position,
					origW,
					left,
					heightCompensate,
					scrollTopMin,
					scrollTopMax,
					origH,
					top,
					gradientString = '',
					lazyLoad = false;

				if ( 'undefined' === typeof $target || 0 === $target.length || ! $target.is( ':visible' ) ) {
					return;
				}

				lazyLoad = $target.hasClass( 'lazyload' );

				// Repeat the background.
				isRepeat = 'true' === this.settings.repeat || true === this.settings.repeat || 1 === this.settings.repeat;

				// ThemeFusion edit for Avada theme: Gradient string.
				if ( '' !== this.settings.gradientStartColor || '' !== this.settings.gradientStartPosition ) {
					if ( 'linear' === this.settings.gradientType ) {
						gradientString += 'linear-gradient(' + this.settings.gradientAngle + 'deg, ';
					} else if ( 'radial' === this.settings.gradientType ) {
						gradientString += 'radial-gradient(circle at ' + this.settings.gradientRadialDirection + ', ';
					}

					gradientString += this.settings.gradientStartColor + ' ' + this.settings.gradientStartPosition + '%,';
					gradientString += this.settings.gradientEndColor + ' ' + this.settings.gradientEndPosition + '%)';

					if ( '' !== this.settings.image && 'none' !== this.settings.image ) {
						gradientString += ',url(\'' + this.settings.image + '\')';
					}

				}

				/*
				 * None, do not apply any parallax at all.
				 */
				if ( 'none' ===  this.settings.direction ) {

					// Stretch the image to fit the entire window
					w = $target.width() + parseInt( $target.css( 'paddingRight' ), 10 ) + parseInt( $target.css( 'paddingLeft' ), 10 );

					// Compute position
					position = $target.offset().left;
					if ( 'center' === this.settings.align ) {
						position = '50% 50%';
					} else if ( 'left' === this.settings.align ) {
						position = '0% 50%';
					} else if ( 'right' === this.settings.align ) {
						position = '100% 50%';
					} else if ( 'top' === this.settings.align ) {
						position = '50% 0%';
					} else if ( 'bottom' === this.settings.align ) {
						position = '50% 100%';
					}

					$target.css( {
						opacity: Math.abs( parseFloat( this.settings.opacity ) / 100 ),
						backgroundSize: 'cover',
						backgroundAttachment: 'scroll',
						backgroundPosition: position,
						backgroundRepeat: 'no-repeat'
					} );
					if ( '' !== this.settings.image && 'none' !== this.settings.image ) {
						$target.css( {
							opacity: Math.abs( parseFloat( this.settings.opacity ) / 100 ),
							backgroundImage: lazyLoad ? '' : 'url(' + this.settings.image + ')'
						} );
					}

				// Fixed, just stretch to fill up the entire container
				} else if ( 'fixed' === this.settings.direction ) {

					$target.css( {
						backgroundAttachment: 'fixed',
						backgroundRepeat: 'repeat'
					} );

					if ( '' !== this.settings.image && 'none' !== this.settings.image ) {
						$target.attr( 'style', 'background-image: url(' + this.settings.image + ') !important;' + $target.attr( 'style' ) );
					}

					/*
					 * Left & right parallax - Stretch the image to fit the height & extend the sides
					 */
				} else if ( 'left' === this.settings.direction || 'right' === this.settings.direction ) {

					// Stretch the image to fit the entire window
					w = $target.width() + parseInt( $target.css( 'paddingRight' ), 10 ) + parseInt( $target.css( 'paddingLeft' ), 10 );
					h = $target.height() + 4 + parseInt( $target.css( 'paddingTop' ), 10 ) + parseInt( $target.css( 'paddingBottom' ), 10 );

					origW = w;
					w += 400 * Math.abs( parseFloat( this.settings.velocity ) );

					// Compute left position
					left = 0;
					if ( 'right' === this.settings.direction ) {
						left -= w - origW;
					}

					if ( 1 > $target.find( '.parallax-inner' ).length ) {
						$target.prepend( '<div class="parallax-inner"></div>' );
					}

					// Apply the required styles
					$target.css( {
						position: 'relative',
						overflow: 'hidden',
						zIndex: 1,
						'background-image': 'none' // ThemeFusion edit for Avada theme: fxing background-image duplication
					} )
						.attr( 'style', $target.attr( 'style' ) ).find( '.parallax-inner' ).css( {
							pointerEvents: 'none',
							width: w,
							height: h,
							position: 'absolute',
							zIndex: -1,
							top: 0,
							left: left,
							opacity: Math.abs( parseFloat( this.settings.opacity ) / 100 ),
							backgroundPosition: isRepeat ? '0 0 ' : this.settings.xpos + ' ' + this.settings.ypos, // ThemeFusion edit for Avada theme: fxing bg position
							backgroundRepeat: isRepeat ? 'repeat' : 'no-repeat',
							backgroundSize: isRepeat ? 'auto' : 'cover' // ThemeFusion edit for Avada theme: make the bg image stretch over all container width
						} );

					if ( '' !== this.settings.image && 'none' !== this.settings.image ) {
						$target.find( '.parallax-inner' ).css( {
							opacity: Math.abs( parseFloat( this.settings.opacity ) / 100 ),
							backgroundImage: lazyLoad ? '' : 'url(' + this.settings.image + ')'
						} );

						this.setBackgroundStyling( $target, gradientString );
					}

					// Compute for the positions to save cycles
					scrollTopMin = 0;
					if ( $target.offset().top > window._fusionWindowHeight ) {
						scrollTopMin = $target.offset().top - window._fusionWindowHeight;
					}
					scrollTopMax = $target.offset().top + $target.height() + parseInt( $target.css( 'paddingTop' ), 10 ) + parseInt( $target.css( 'paddingBottom' ), 10 );

					this.moveMax = w - origW;
					this.scrollTopMin = scrollTopMin;
					this.scrollTopMax = scrollTopMax;

					/*
					 * Up & down parallax - Stretch the image to fit the width & extend vertically
					 */

				} else { // Up or down
					// We have to add a bit more to DOWN since the page is scrolling as well,
					// or else it will not be visible
					heightCompensate = 900;
					heightCompensate = jQuery( window ).height();

					// Stretch the image to fit the entire window
					w = $target.width() + parseInt( $target.css( 'paddingRight' ), 10 ) + parseInt( $target.css( 'paddingLeft' ), 10 );
					h = $target.height() + parseInt( $target.css( 'paddingTop' ), 10 ) + parseInt( $target.css( 'paddingBottom' ), 10 );
					origH = h;
					h += heightCompensate * Math.abs( parseFloat( this.settings.velocity ) );

					// Compute top position
					top = 0;
					if ( 'down' === this.settings.direction ) {
						top -= h - origH;
					}

					if ( 1 > $target.find( '.parallax-inner' ).length ) {
						$target.prepend( '<div class="parallax-inner"></div>' );
					}

					// Apply the required styles
					$target.css( {
						position: 'relative',
						overflow: 'hidden',
						zIndex: 1,
						'background-image': 'none' // ThemeFusion edit for Avada theme: fxing background-image duplication
					} )
						.attr( 'style', $target.attr( 'style' ) )
						.find( '.parallax-inner' ).css( {
							pointerEvents: 'none',
							width: w,
							height: h,
							position: 'absolute',
							zIndex: -1,
							top: top,
							left: 0,
							opacity: Math.abs( parseFloat( this.settings.opacity ) / 100 ),
							backgroundPosition: isRepeat ? '0 0 ' : this.settings.xpos + ' ' + this.settings.ypos, // ThemeFusion edit for Avada theme: fxing bg position
							backgroundRepeat: isRepeat ? 'repeat' : 'no-repeat',
							backgroundSize: isRepeat ? 'auto' : 'cover' // ThemeFusion edit for Avada theme: make the bg image stretch over all container width
						} );

					if ( '' !== this.settings.image && 'none' !== this.settings.image ) {
						$target.find( '.parallax-inner' ).css( {
							opacity: Math.abs( parseFloat( this.settings.opacity ) / 100 ),
							backgroundImage: lazyLoad ? '' : 'url(' + this.settings.image + ')'
						} );

						this.setBackgroundStyling( $target, gradientString );
					}

					// Compute for the positions to save cycles
					scrollTopMin = 0;
					if ( $target.offset().top > window._fusionWindowHeight ) {
						scrollTopMin = $target.offset().top - window._fusionWindowHeight;
					}
					scrollTopMax = $target.offset().top + $target.height() + parseInt( $target.css( 'paddingTop' ), 10 ) + parseInt( $target.css( 'paddingBottom' ), 10 );

					this.moveMax = h - origH;
					this.scrollTopMin = scrollTopMin;
					this.scrollTopMax = scrollTopMax;
				}

				if ( lazyLoad ) {
					$target.find( '.parallax-inner' ).attr( 'data-bg', this.settings.image ).addClass( 'lazyload' );
				}
			},

			// ThemeFusion edit for Avada theme: completely new mobile check.
			isMobile: function() {
				return cssua.ua.mobile;
			}
		}
	);

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[ pluginName ] = function( options ) {
		this.each( function() {
			if ( ! $.data( this, 'plugin_' + pluginName ) ) {
				$.data( this, 'plugin_' + pluginName, new Plugin( this, options ) );
			}
		} );

		// Chain jQuery functions.
		return this;
	};

}( jQuery, window, document ) );

function _fusionRefreshScroll() {
	window._fusionScrollTop  = window.pageYOffset; // $( window ).scrollTop();
	window._fusionScrollLeft = window.pageXOffset; // $( window ).scrollLeft();
}

function _fusionParallaxAll() {
	var i;

	_fusionRefreshScroll();
	for ( i = 0; i < window._fusionImageParallaxImages.length; i++ ) {
		window._fusionImageParallaxImages[ i ].doParallax();
	}
}

// ThemeFusion edit for Avada theme: moved function out of ready event
function _fusionRefreshWindow() {
	window._fusionScrollTop    = window.pageYOffset; // $( window ).scrollTop();
	window._fusionWindowHeight = jQuery( window ).height();
	window._fusionScrollLeft   = window.pageXOffset; // $( window ).scrollLeft();
	window._fusionWindowWidth  = jQuery( window ).width();
}

jQuery( document ).ready(
	function( $ ) {
		'use strict';

		$( window ).on( 'scroll touchmove touchstart touchend gesturechange', function() {
			requestAnimationFrame( _fusionParallaxAll );
		} );

		function mobileParallaxAll() {

			var i;

			_fusionRefreshScroll();
			for ( i = 0; i < window._fusionImageParallaxImages.length; i++ ) {
				window._fusionImageParallaxImages[ i ].doParallax();
			}
		}

		if ( cssua.ua.mobile ) { // Device size estimate.
			requestAnimationFrame( mobileParallaxAll );
		}

		// When the browser resizes, fix parallax size
		// Some browsers do not work if this is not performed after 1ms
		$( window ).on(
			'resize', function() {
				setTimeout(
					function() {
						_fusionRefreshWindow();
						jQuery.each(
							window._fusionImageParallaxImages, function( i, parallax ) {
								parallax.resizeParallaxBackground();
							}
						);
					}, 1
				);
			}
		);

		setTimeout(
			function() {
				_fusionRefreshWindow();
				jQuery.each(
					window._fusionImageParallaxImages, function( i, parallax ) {
						parallax.resizeParallaxBackground();
					}
				);
			}, 1
		);

		setTimeout(
			function() {
				_fusionRefreshWindow();
				jQuery.each(
					window._fusionImageParallaxImages, function( i, parallax ) {
						parallax.resizeParallaxBackground();
					}
				);
			}, 100
		);
	}
);

// ThemeFusion edit for Avada theme: needed if FusionSlider is present to recalc the dimensions
jQuery( window ).on( 'load', function() {

	setTimeout(
		function() {
			_fusionRefreshWindow();
			jQuery.each(
				window._fusionImageParallaxImages, function( i, parallax ) {
					parallax.resizeParallaxBackground();
				}
			);
		}, 1
	);

	setTimeout(
		function() {
			_fusionRefreshWindow();
			jQuery.each(
				window._fusionImageParallaxImages, function( i, parallax ) {
					parallax.resizeParallaxBackground();
				}
			);
		}, 1000
	);
} );

// @codekit-prepend "fusion-parallax.js"
// @codekit-append "fusion-video-bg.js"

jQuery( document ).on( 'ready fusion-element-render-fusion_builder_container', function( event, cid ) {
	'use strict';

	var $targetEl = 'undefined' !== typeof cid ? jQuery( 'div[data-cid="' + cid + '"]' ).find( '.fusion-bg-parallax' ) : jQuery( '.fusion-bg-parallax' );

	/*
	 * Remove video background in mobile devices.
	 */

	// Remove the video for mobile devices.
	function _isMobile() {
		return cssua.ua.mobile;
	}

	if ( _isMobile() ) {
		jQuery( '.fusion-bg-parallax.video > div' ).remove();
	}

	// Hide the placeholder
	$targetEl.next().addClass( 'bg-parallax-parent' );
	$targetEl.attr( 'style', '' ).css( 'display', 'none' );

	/*
	 * Initialize the image parallax
	 */
	$targetEl.each( function() {
		if ( cssua.ua.mobile && ! jQuery( this ).data( 'mobile-enabled' ) ) {
			return;
		}

		jQuery( this ).removeData();
		jQuery( this ).fusionImageParallax( {
			image: jQuery( this ).data( 'bg-image' ),
			imageMedium: jQuery( this ).data( 'bg-image-medium' ),
			imageSmall: jQuery( this ).data( 'bg-image-small' ),
			backgroundColor: ( 'undefined' !== typeof jQuery( this ).data( 'bg-color' ) ) ? jQuery( this ).data( 'bg-color' ) : '',
			backgroundColorMedium: ( 'undefined' !== typeof jQuery( this ).data( 'bg-color-medium' ) ) ? jQuery( this ).data( 'bg-color-medium' ) : '',
			backgroundColorSmall: ( 'undefined' !== typeof jQuery( this ).data( 'bg-color-small' ) ) ? jQuery( this ).data( 'bg-color-small' ) : '',
			blendMode: ( 'undefined' !== typeof jQuery( this ).data( 'blend-mode' ) ) ? jQuery( this ).data( 'blend-mode' ) : 'none',
			blendModeMedium: ( 'undefined' !== typeof jQuery( this ).data( 'blend-mode-medium' ) ) ? jQuery( this ).data( 'blend-mode-medium' ) : '',
			blendModeSmall: ( 'undefined' !== typeof jQuery( this ).data( 'blend-mode-small' ) ) ? jQuery( this ).data( 'blend-mode-small' ) : '',
			direction: jQuery( this ).data( 'direction' ),
			mobileenabled: jQuery( this ).data( 'mobile-enabled' ),
			mobiledevice: _isMobile(),
			bgAlpha: jQuery( this ).data( 'bg-alpha' ),
			opacity: jQuery( this ).data( 'opacity' ),
			width: jQuery( this ).data( 'bg-width' ),
			height: jQuery( this ).data( 'bg-height' ),
			velocity: jQuery( this ).data( 'velocity' ),
			align: jQuery( this ).data( 'bg-align' ),
			repeat: jQuery( this ).data( 'bg-repeat' ),
			target: jQuery( this ).next(),
			gradientType: ( 'undefined' !== typeof jQuery( this ).data( 'bg-gradient-type' ) ) ? jQuery( this ).data( 'bg-gradient-type' ) : '',
			gradientAngle: ( 'undefined' !== typeof jQuery( this ).data( 'bg-gradient-angle' ) ) ? jQuery( this ).data( 'bg-gradient-angle' ) : '',
			gradientStartColor: ( 'undefined' !== typeof jQuery( this ).data( 'bg-gradient-start-color' ) ) ? jQuery( this ).data( 'bg-gradient-start-color' ) : '',
			gradientStartPosition: ( 'undefined' !== typeof jQuery( this ).data( 'bg-gradient-start-position' ) ) ? jQuery( this ).data( 'bg-gradient-start-position' ) : '',
			gradientEndColor: ( 'undefined' !== typeof jQuery( this ).data( 'bg-gradient-end-color' ) ) ? jQuery( this ).data( 'bg-gradient-end-color' ) : '',
			gradientEndPosition: ( 'undefined' !== typeof jQuery( this ).data( 'bg-gradient-end-position' ) ) ? jQuery( this ).data( 'bg-gradient-end-position' ) : '',
			gradientRadialDirection: ( 'undefined' !== typeof jQuery( this ).data( 'bg-radial-direction' ) ) ? jQuery( this ).data( 'bg-radial-direction' ) : '',
			complete: function() { // eslint-disable-line no-empty-function
			}
		} );
	} );

	/*
	 * Initialize the video background
	 */

	// This is currently performed in the bg-video.js script FIXME

} );
