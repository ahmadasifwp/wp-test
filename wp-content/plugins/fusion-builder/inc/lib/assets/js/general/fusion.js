/* global Modernizr, fusionJSVars */
/* eslint getter-return: off */
/* jshint -W098 */
/**
 * A collection of utilities.
 *
 * @since 2.0
 */
var fusion = {

	fusionResizeWidth: 0,
	fusionResizeHeight: 0,
	currentPostID: null,

	/**
	 * Converts a value to bool.
	 * Used to accomodate all cases in the fusion options-network.
	 *
	 * @since 2.0
	 * @param {string|number|boolean} val - The value.
	 * @return {boolean} - The value as bool.
	 */
	toBool: function( val ) {
		return ( 1 === val || '1' === val || true === val || 'true' === val || 'on' === val );
	},

	// Some functions take a variable number of arguments, or a few expected
	// arguments at the beginning and then a variable number of values to operate
	// on. This helper accumulates all remaining arguments past the function’s
	// argument length (or an explicit `startIndex`), into an array that becomes
	// the last argument. Similar to ES6’s "rest parameter".
	restArguments: function( func, startIndex ) {
		startIndex = null == startIndex ? func.length - 1 : +startIndex;
		return function() {
			var length = Math.max( arguments.length - startIndex, 0 ),
				rest = Array( length ),
				index = 0,
				args;
			for ( ; index < length; index++ ) {
				rest[ index ] = arguments[ index + startIndex ];
			}
			switch ( startIndex ) {
			case 0: return func.call( this, rest );
			case 1: return func.call( this, arguments[ 0 ], rest );
			case 2: return func.call( this, arguments[ 0 ], arguments[ 1 ], rest );
			}
			args = Array( startIndex + 1 );
			for ( index = 0; index < startIndex; index++ ) {
				args[ index ] = arguments[ index ];
			}
			args[ startIndex ] = rest;
			return func.apply( this, args );
		};
	},

	// Returns a function, that, as long as it continues to be invoked, will not
	// be triggered. The function will be called after it stops being called for
	// N milliseconds. If `immediate` is passed, trigger the function on the
	// leading edge, instead of the trailing.
	debounce: function( func, wait, immediate ) {
		var timeout,
			result,
			self = this,
			later,
			debounced,
			callNow;

		later = function( context, args ) {
			timeout = null;
			if ( args ) {
				result = func.apply( context, args );
			}
		};

		debounced = this.restArguments( function( args ) {
			if ( timeout ) {
				clearTimeout( timeout );
			}

			if ( immediate ) {
				callNow = ! timeout;
				timeout = setTimeout( later, wait );
				if ( callNow ) {
					result = func.apply( this, args );
				}
			} else {
				timeout = self.delay( later, wait, this, args );
			}

			return result;
		} );

		debounced.cancel = function() {
			clearTimeout( timeout );
			timeout = null;
		};

		return debounced;
	},

	isSmall: function() {
		return Modernizr.mq( 'only screen and (max-width:' + fusionJSVars.visibility_small + 'px)' );
	},

	isMedium: function() {
		return Modernizr.mq( 'only screen and (min-width:' + ( parseInt( fusionJSVars.visibility_small ) + 1 ) + 'px) and (max-width:' + parseInt( fusionJSVars.visibility_medium ) + 'px)' );
	},

	isLarge: function() {
		return Modernizr.mq( 'only screen and (min-width:' + ( parseFloat( fusionJSVars.visibility_medium ) + 1 ) + 'px)' );
	},

	// Decide whether to pass on callback to here or not.
	getHeight: function( heightInput, margins ) {
		var computedHeight = 0;

		// Number, no unit.
		if ( 'number' === typeof heightInput ) {
			computedHeight = heightInput;
		} else if ( 'string' === typeof heightInput && ( heightInput.includes( '.' ) || heightInput.includes( '#' ) ) ) {
			margins = 'undefined' !== typeof margins ? margins : false;
			jQuery( heightInput ).each( function() {
				computedHeight = computedHeight + jQuery( this ).outerHeight( margins );
			} );
		} else {
			computedHeight = parseFloat( heightInput );
		}

		return computedHeight;
	},

	getAdminbarHeight: function() {
		var height = ( jQuery( '#wpadminbar' ).length ) ? parseInt( jQuery( '#wpadminbar' ).height() ) : 0;

		height += ( jQuery( '.fusion-fixed-top' ).length ) ? parseInt( jQuery( '.fusion-fixed-top' ).height() ) : 0;

		return height;
	},

	// https://api.jquery.com/jquery.iswindow/
	isWindow: function( obj ) {
		return null != obj && obj === obj.window;
	},

	getObserverSegmentation: function( object ) {
		var returnObject = {};

		object.each( function() {
			if ( ! jQuery( this ).data( 'animationoffset' ) ) {
				jQuery( this ).attr( 'data-animationoffset', 'top-into-view' );
			}
		} );

		returnObject = {
			'top-into-view': object.filter( '[data-animationoffset="top-into-view"]' ),
			'top-mid-of-view': object.filter( '[data-animationoffset="top-mid-of-view"]' ),
			'bottom-in-view': object.filter( '[data-animationoffset="bottom-in-view"]' )
		};

		jQuery.each( returnObject, function( index, elements ) {
			if ( ! elements.length ) {
				delete returnObject[ index ];
			}
		} );

		// Needed when data-animationoffset is not set at all, e.g. in case of progress bars.
		if ( 0 === Object.keys( returnObject ).length ) {
			returnObject[ 'top-into-view' ] = object;
		}

		return returnObject;
	},

	getAnimationIntersectionData: function( offset ) {
		var offsetString = '',
			root         = null,
			threshold    = 0, // Element top hits bottom of viewport.
			rootMargin   = '0px 0px 0px 0px',
			options;

		if ( 'string' === typeof offset ) {
			offsetString = offset;
		} else if ( 'undefined' !== typeof offset.data( 'animationoffset' ) ) {
			offsetString = offset.data( 'animationoffset' );
		}

		if ( 'top-mid-of-view' === offsetString ) {
			rootMargin = '0px 0px -50% 0px';
		} else if ( 'bottom-in-view' === offsetString ) {
			threshold = [ 0, 0.2, 0.4, 0.6, 0.7, 0.8, 0.9, 1 ];
		}

		options = {
			root: root,
			rootMargin: rootMargin,
			threshold: threshold
		};

		return options;
	},

	shouldObserverEntryAnimate: function( entry, observer ) {
		var animate              = false,
			maxIntersectionRatio = 1,
			thresholds;

		if ( 1 < observer.thresholds.length ) {
			if ( entry.boundingClientRect.height > entry.rootBounds.height ) {
				maxIntersectionRatio = entry.rootBounds.height / entry.boundingClientRect.height;

				thresholds = observer.thresholds.filter( function( value ) {
					return value >= entry.intersectionRatio && value <= maxIntersectionRatio;
				} );

				if ( ! thresholds.length ) {
					animate = true;
				}

			} else if ( entry.isIntersecting && 1 === entry.intersectionRatio ) {
				animate = true;
			}

		} else if ( entry.isIntersecting ) {
			animate = true;
		}

		return animate;
	},

	getCurrentPostID: function() {

		if ( null === this.currentPostID ) {
			this.currentPostID = 'undefined' !== typeof jQuery( 'body' ).data( 'awb-post-id' ) ? jQuery( 'body' ).data( 'awb-post-id' ) : 0;
		}

		return this.currentPostID;
	}
};

fusion.delay = fusion.restArguments( function( func, wait, args ) {
	return setTimeout( function() {
		return func.apply( null, args );
	}, wait );
} );

fusion.ready = function( fn ) {

	// Sanity check.
	if ( 'function' !== typeof fn ) {
		return;
	}

	// If document is already loaded, run method.
	if ( 'complete' === document.readyState ) {
		return fn();
	}

	// Otherwise, wait until document is loaded
	document.addEventListener( 'DOMContentLoaded', fn, false );
};

/**
 * Set the global fusionResponsiveTypographyPassiveSupported.
 *
 * @since 2.2.0
 * @return {void}
 */
fusion.passiveSupported = function() {
	var passiveSupported, options;

	if ( 'undefined' === typeof fusion.supportsPassive ) {
		try {
			options = {
				get passive() {
					passiveSupported = true;
				}
			};

			window.addEventListener( 'test', options, options );
			window.removeEventListener( 'test', options, options );
		} catch ( err ) {
			passiveSupported = false;
		}
		fusion.supportsPassive = passiveSupported ? { passive: true } : false;
	}
	return fusion.supportsPassive;
};

/**
 * Get an array of elements.
 *
 * @param {string|object} elements - The elements we're querying.
 * @return {Array}
 */
fusion.getElements = function( elements ) {
	var els = [];

	// Sanity check: If nothing is defined early exit.
	if ( ! elements ) {
		return [];
	}

	if ( 'object' === typeof elements ) {
		Object.keys( elements ).forEach( function( i ) {
			if ( Element.prototype.isPrototypeOf( elements[ i ] ) ) {
				els.push( elements[ i ] );
			}
		} );
	} else if ( 'string' === typeof elements ) {
		// Get the elements array.
		els = document.querySelectorAll( elements );

		// We're using Array.prototype.slice because we'll need to run forEach later
		// and NodeList.forEach is not supported in IE.
		els = Array.prototype.slice.call( els );
	}
	return els;
};

/**
 * Add polyfill for Element.closest() method.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
 */
if ( ! Element.prototype.matches ) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
if ( ! Element.prototype.closest ) {
	Element.prototype.closest = function( s ) {
		var el = this;
		do {
			if ( el.matches( s ) ) {
				return el;
			}
			el = el.parentElement || el.parentNode;
		} while ( null !== el && 1 === el.nodeType );
		return null;
	};
}

jQuery( document ).ready( function() {
	var _fusionResize;

	// .on( 'ready' ) is removed from jQuery 3.0+, but we need syntax for live builder.
	if ( 'undefined' === typeof jQuery.migrateVersion && 2 < parseInt( jQuery.fn.jquery ) ) {
		jQuery( window.document ).triggerHandler( 'ready' );
	}

	_fusionResize = fusion.debounce( function() {
		if ( fusion.fusionResizeWidth !== jQuery( window ).width() ) {
			window.dispatchEvent( new Event( 'fusion-resize-horizontal', { 'bubbles': true, 'cancelable': true } ) );
			fusion.fusionResizeWidth = jQuery( window ).width();
		}

		if ( fusion.fusionResizeHeight !== jQuery( window ).height() ) {
			jQuery( window ).trigger( 'fusion-resize-vertical' );
			fusion.fusionResizeHeight = jQuery( window ).height();
		}
	}, 250 );

	fusion.fusionResizeWidth  = jQuery( window ).width();
	fusion.fusionResizeHeight = jQuery( window ).height();

	jQuery( window ).on( 'resize', _fusionResize );
} );
