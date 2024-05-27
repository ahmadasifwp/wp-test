/**
 * Swiper 8.4.2
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * https://swiperjs.com
 *
 * Copyright 2014-2022 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: October 6, 2022
 */

( function ( global, factory ) {
	'object' === typeof exports && 'undefined' !== typeof module ? module.exports = factory()
		: 'function' === typeof define && define.amd ? define( factory )
			: ( global = 'undefined' !== typeof globalThis ? globalThis : global || self, global.Swiper = factory() );
}( this, ( function () {
	'use strict';

	/**
     * SSR Window 4.0.2
     * Better handling for window object in SSR environment
     * https://github.com/nolimits4web/ssr-window
     *
     * Copyright 2021, Vladimir Kharlampidi
     *
     * Licensed under MIT
     *
     * Released on: December 13, 2021
     */

	/* eslint-disable no-param-reassign */
	function isObject$1( obj ) {
		return null !== obj && 'object' === typeof obj && 'constructor' in obj && obj.constructor === Object;
	}

	function extend$1( target, src ) {
		if ( target === void 0 ) {
			target = {};
		}

		if ( src === void 0 ) {
			src = {};
		}

		Object.keys( src ).forEach( ( key ) => {
			if ( 'undefined' === typeof target[ key ] ) {
				target[ key ] = src[ key ];
			} else if ( isObject$1( src[ key ] ) && isObject$1( target[ key ] ) && 0 < Object.keys( src[ key ] ).length ) {
				extend$1( target[ key ], src[ key ] );
			}
		} );
	}

	const ssrDocument = {
		body: {},

		addEventListener() {},

		removeEventListener() {},

		activeElement: {
			blur() {},

			nodeName: ''
		},

		querySelector() {
			return null;
		},

		querySelectorAll() {
			return [];
		},

		getElementById() {
			return null;
		},

		createEvent() {
			return {
				initEvent() {}

			};
		},

		createElement() {
			return {
				children: [],
				childNodes: [],
				style: {},

				setAttribute() {},

				getElementsByTagName() {
					return [];
				}

			};
		},

		createElementNS() {
			return {};
		},

		importNode() {
			return null;
		},

		location: {
			hash: '',
			host: '',
			hostname: '',
			href: '',
			origin: '',
			pathname: '',
			protocol: '',
			search: ''
		}
	};

	function getDocument() {
		const doc = 'undefined' !== typeof document ? document : {};
		extend$1( doc, ssrDocument );
		return doc;
	}

	const ssrWindow = {
		document: ssrDocument,
		navigator: {
			userAgent: ''
		},
		location: {
			hash: '',
			host: '',
			hostname: '',
			href: '',
			origin: '',
			pathname: '',
			protocol: '',
			search: ''
		},
		history: {
			replaceState() {},

			pushState() {},

			go() {},

			back() {}

		},
		CustomEvent: function CustomEvent() {
			return this;
		},

		addEventListener() {},

		removeEventListener() {},

		getComputedStyle() {
			return {
				getPropertyValue() {
					return '';
				}

			};
		},

		Image() {},

		Date() {},

		screen: {},

		setTimeout() {},

		clearTimeout() {},

		matchMedia() {
			return {};
		},

		requestAnimationFrame( callback ) {
			if ( 'undefined' === typeof setTimeout ) {
				callback();
				return null;
			}

			return setTimeout( callback, 0 );
		},

		cancelAnimationFrame( id ) {
			if ( 'undefined' === typeof setTimeout ) {
				return;
			}

			clearTimeout( id );
		}

	};

	function getWindow() {
		const win = 'undefined' !== typeof window ? window : {};
		extend$1( win, ssrWindow );
		return win;
	}

	/**
     * Dom7 4.0.4
     * Minimalistic JavaScript library for DOM manipulation, with a jQuery-compatible API
     * https://framework7.io/docs/dom7.html
     *
     * Copyright 2022, Vladimir Kharlampidi
     *
     * Licensed under MIT
     *
     * Released on: January 11, 2022
     */
	/* eslint-disable no-proto */

	function makeReactive( obj ) {
		const proto = obj.__proto__;
		Object.defineProperty( obj, '__proto__', {
			get() {
				return proto;
			},

			set( value ) {
				proto.__proto__ = value;
			}

		} );
	}

	class Dom7 extends Array {
		constructor( items ) {
			if ( 'number' === typeof items ) {
				super( items );
			} else {
				super( ...( items || [] ) );
				makeReactive( this );
			}
		}

	}

	function arrayFlat( arr ) {
		if ( arr === void 0 ) {
			arr = [];
		}

		const res = [];
		arr.forEach( ( el ) => {
			if ( Array.isArray( el ) ) {
				res.push( ...arrayFlat( el ) );
			} else {
				res.push( el );
			}
		} );
		return res;
	}

	function arrayFilter( arr, callback ) {
		return Array.prototype.filter.call( arr, callback );
	}

	function arrayUnique( arr ) {
		const uniqueArray = [];

		for ( let i = 0; i < arr.length; i += 1 ) {
			if ( -1 === uniqueArray.indexOf( arr[ i ] ) ) {
				uniqueArray.push( arr[ i ] );
			}
		}

		return uniqueArray;
	}


	function qsa( selector, context ) {
		if ( 'string' !== typeof selector ) {
			return [ selector ];
		}

		const a = [];
		const res = context.querySelectorAll( selector );

		for ( let i = 0; i < res.length; i += 1 ) {
			a.push( res[ i ] );
		}

		return a;
	}

	function $( selector, context ) {
		const window = getWindow();
		const document = getDocument();
		let arr = [];

		if ( !context && selector instanceof Dom7 ) {
			return selector;
		}

		if ( !selector ) {
			return new Dom7( arr );
		}

		if ( 'string' === typeof selector ) {
			const html = selector.trim();

			if ( 0 <= html.indexOf( '<' ) && 0 <= html.indexOf( '>' ) ) {
				let toCreate = 'div';
				if ( 0 === html.indexOf( '<li' ) ) {
					toCreate = 'ul';
				}
				if ( 0 === html.indexOf( '<tr' ) ) {
					toCreate = 'tbody';
				}
				if ( 0 === html.indexOf( '<td' ) || 0 === html.indexOf( '<th' ) ) {
					toCreate = 'tr';
				}
				if ( 0 === html.indexOf( '<tbody' ) ) {
					toCreate = 'table';
				}
				if ( 0 === html.indexOf( '<option' ) ) {
					toCreate = 'select';
				}
				const tempParent = document.createElement( toCreate );
				tempParent.innerHTML = html;

				for ( let i = 0; i < tempParent.childNodes.length; i += 1 ) {
					arr.push( tempParent.childNodes[ i ] );
				}
			} else {
				arr = qsa( selector.trim(), context || document );
			} // arr = qsa(selector, document);

		} else if ( selector.nodeType || selector === window || selector === document ) {
			arr.push( selector );
		} else if ( Array.isArray( selector ) ) {
			if ( selector instanceof Dom7 ) {
				return selector;
			}
			arr = selector;
		}

		return new Dom7( arrayUnique( arr ) );
	}

	$.fn = Dom7.prototype; // eslint-disable-next-line

	function addClass() {
		for ( var _len = arguments.length, classes = new Array( _len ), _key = 0; _key < _len; _key++ ) {
			classes[ _key ] = arguments[ _key ];
		}

		const classNames = arrayFlat( classes.map( ( c ) => c.split( ' ' ) ) );
		this.forEach( ( el ) => {
			el.classList.add( ...classNames );
		} );
		return this;
	}

	function removeClass() {
		for ( var _len2 = arguments.length, classes = new Array( _len2 ), _key2 = 0; _key2 < _len2; _key2++ ) {
			classes[ _key2 ] = arguments[ _key2 ];
		}

		const classNames = arrayFlat( classes.map( ( c ) => c.split( ' ' ) ) );
		this.forEach( ( el ) => {
			el.classList.remove( ...classNames );
		} );
		return this;
	}

	function toggleClass() {
		for ( var _len3 = arguments.length, classes = new Array( _len3 ), _key3 = 0; _key3 < _len3; _key3++ ) {
			classes[ _key3 ] = arguments[ _key3 ];
		}

		const classNames = arrayFlat( classes.map( ( c ) => c.split( ' ' ) ) );
		this.forEach( ( el ) => {
			classNames.forEach( ( className ) => {
				el.classList.toggle( className );
			} );
		} );
	}

	function hasClass() {
		for ( var _len4 = arguments.length, classes = new Array( _len4 ), _key4 = 0; _key4 < _len4; _key4++ ) {
			classes[ _key4 ] = arguments[ _key4 ];
		}

		const classNames = arrayFlat( classes.map( ( c ) => c.split( ' ' ) ) );
		return 0 < arrayFilter( this, ( el ) => 0 < classNames.filter( ( className ) => el.classList.contains( className ) ).length ).length;
	}

	function attr( attrs, value ) {
		if ( 1 === arguments.length && 'string' === typeof attrs ) {
			// Get attr
			if ( this[ 0 ] ) {
				return this[ 0 ].getAttribute( attrs );
			}
			return undefined;
		} // Set attrs


		for ( let i = 0; i < this.length; i += 1 ) {
			if ( 2 === arguments.length ) {
				// String
				this[ i ].setAttribute( attrs, value );
			} else {
				// Object
				for ( const attrName in attrs ) {
					this[ i ][ attrName ] = attrs[ attrName ];
					this[ i ].setAttribute( attrName, attrs[ attrName ] );
				}
			}
		}

		return this;
	}

	function removeAttr( attr ) {
		for ( let i = 0; i < this.length; i += 1 ) {
			this[ i ].removeAttribute( attr );
		}

		return this;
	}

	function transform( transform ) {
		for ( let i = 0; i < this.length; i += 1 ) {
			this[ i ].style.transform = transform;
		}

		return this;
	}

	function transition$1( duration ) {
		for ( let i = 0; i < this.length; i += 1 ) {
			this[ i ].style.transitionDuration = 'string' !== typeof duration ? `${duration}ms` : duration;
		}

		return this;
	}

	function on() {
		for ( var _len5 = arguments.length, args = new Array( _len5 ), _key5 = 0; _key5 < _len5; _key5++ ) {
			args[ _key5 ] = arguments[ _key5 ];
		}

		let [ eventType, targetSelector, listener, capture ] = args;

		if ( 'function' === typeof args[ 1 ] ) {
			[ eventType, listener, capture ] = args;
			targetSelector = undefined;
		}

		if ( !capture ) {
			capture = false;
		}

		function handleLiveEvent( e ) {
			const target = e.target;
			if ( !target ) {
				return;
			}
			const eventData = e.target.dom7EventData || [];

			if ( 0 > eventData.indexOf( e ) ) {
				eventData.unshift( e );
			}

			if ( $( target ).is( targetSelector ) ) {
				listener.apply( target, eventData );
			} else {
          const parents = $(target).parents(); // eslint-disable-line

				for ( let k = 0; k < parents.length; k += 1 ) {
					if ( $( parents[ k ] ).is( targetSelector ) ) {
						listener.apply( parents[ k ], eventData );
					}
				}
			}
		}

		function handleEvent( e ) {
			const eventData = e && e.target ? e.target.dom7EventData || [] : [];

			if ( 0 > eventData.indexOf( e ) ) {
				eventData.unshift( e );
			}

			listener.apply( this, eventData );
		}

		const events = eventType.split( ' ' );
		let j;

		for ( let i = 0; i < this.length; i += 1 ) {
			const el = this[ i ];

			if ( !targetSelector ) {
				for ( j = 0; j < events.length; j += 1 ) {
					const event = events[ j ];
					if ( !el.dom7Listeners ) {
						el.dom7Listeners = {};
					}
					if ( !el.dom7Listeners[ event ] ) {
						el.dom7Listeners[ event ] = [];
					}
					el.dom7Listeners[ event ].push( {
						listener,
						proxyListener: handleEvent
					} );
					el.addEventListener( event, handleEvent, capture );
				}
			} else {
				// Live events
				for ( j = 0; j < events.length; j += 1 ) {
					const event = events[ j ];
					if ( !el.dom7LiveListeners ) {
						el.dom7LiveListeners = {};
					}
					if ( !el.dom7LiveListeners[ event ] ) {
						el.dom7LiveListeners[ event ] = [];
					}
					el.dom7LiveListeners[ event ].push( {
						listener,
						proxyListener: handleLiveEvent
					} );
					el.addEventListener( event, handleLiveEvent, capture );
				}
			}
		}

		return this;
	}

	function off() {
		for ( var _len6 = arguments.length, args = new Array( _len6 ), _key6 = 0; _key6 < _len6; _key6++ ) {
			args[ _key6 ] = arguments[ _key6 ];
		}

		let [ eventType, targetSelector, listener, capture ] = args;

		if ( 'function' === typeof args[ 1 ] ) {
			[ eventType, listener, capture ] = args;
			targetSelector = undefined;
		}

		if ( !capture ) {
			capture = false;
		}
		const events = eventType.split( ' ' );

		for ( let i = 0; i < events.length; i += 1 ) {
			const event = events[ i ];

			for ( let j = 0; j < this.length; j += 1 ) {
				const el = this[ j ];
				let handlers;

				if ( !targetSelector && el.dom7Listeners ) {
					handlers = el.dom7Listeners[ event ];
				} else if ( targetSelector && el.dom7LiveListeners ) {
					handlers = el.dom7LiveListeners[ event ];
				}

				if ( handlers && handlers.length ) {
					for ( let k = handlers.length - 1; 0 <= k; k -= 1 ) {
						const handler = handlers[ k ];

						if ( listener && handler.listener === listener ) {
							el.removeEventListener( event, handler.proxyListener, capture );
							handlers.splice( k, 1 );
						} else if ( listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener ) {
							el.removeEventListener( event, handler.proxyListener, capture );
							handlers.splice( k, 1 );
						} else if ( !listener ) {
							el.removeEventListener( event, handler.proxyListener, capture );
							handlers.splice( k, 1 );
						}
					}
				}
			}
		}

		return this;
	}

	function trigger() {
		const window = getWindow();

		for ( var _len9 = arguments.length, args = new Array( _len9 ), _key9 = 0; _key9 < _len9; _key9++ ) {
			args[ _key9 ] = arguments[ _key9 ];
		}

		const events = args[ 0 ].split( ' ' );
		const eventData = args[ 1 ];

		for ( let i = 0; i < events.length; i += 1 ) {
			const event = events[ i ];

			for ( let j = 0; j < this.length; j += 1 ) {
				const el = this[ j ];

				if ( window.CustomEvent ) {
					const evt = new window.CustomEvent( event, {
						detail: eventData,
						bubbles: true,
						cancelable: true
					} );
					el.dom7EventData = args.filter( ( data, dataIndex ) => 0 < dataIndex );
					el.dispatchEvent( evt );
					el.dom7EventData = [];
					delete el.dom7EventData;
				}
			}
		}

		return this;
	}

	function transitionEnd$1( callback ) {
		const dom = this;

		function fireCallBack( e ) {
			if ( e.target !== this ) {
				return;
			}
			callback.call( this, e );
			dom.off( 'transitionend', fireCallBack );
		}

		if ( callback ) {
			dom.on( 'transitionend', fireCallBack );
		}

		return this;
	}

	function outerWidth( includeMargins ) {
		if ( 0 < this.length ) {
			if ( includeMargins ) {
				const styles = this.styles();
				return this[ 0 ].offsetWidth + parseFloat( styles.getPropertyValue( 'margin-right' ) ) + parseFloat( styles.getPropertyValue( 'margin-left' ) );
			}

			return this[ 0 ].offsetWidth;
		}

		return null;
	}

	function outerHeight( includeMargins ) {
		if ( 0 < this.length ) {
			if ( includeMargins ) {
				const styles = this.styles();
				return this[ 0 ].offsetHeight + parseFloat( styles.getPropertyValue( 'margin-top' ) ) + parseFloat( styles.getPropertyValue( 'margin-bottom' ) );
			}

			return this[ 0 ].offsetHeight;
		}

		return null;
	}

	function offset() {
		if ( 0 < this.length ) {
			const window = getWindow();
			const document = getDocument();
			const el = this[ 0 ];
			const box = el.getBoundingClientRect();
			const body = document.body;
			const clientTop = el.clientTop || body.clientTop || 0;
			const clientLeft = el.clientLeft || body.clientLeft || 0;
			const scrollTop = el === window ? window.scrollY : el.scrollTop;
			const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
			return {
				top: box.top + scrollTop - clientTop,
				left: box.left + scrollLeft - clientLeft
			};
		}

		return null;
	}

	function styles() {
		const window = getWindow();
		if ( this[ 0 ] ) {
			return window.getComputedStyle( this[ 0 ], null );
		}
		return {};
	}

	function css( props, value ) {
		const window = getWindow();
		let i;

		if ( 1 === arguments.length ) {
			if ( 'string' === typeof props ) {
				// .css('width')
				if ( this[ 0 ] ) {
					return window.getComputedStyle( this[ 0 ], null ).getPropertyValue( props );
				}
			} else {
				// .css({ width: '100px' })
				for ( i = 0; i < this.length; i += 1 ) {
					for ( const prop in props ) {
						this[ i ].style[ prop ] = props[ prop ];
					}
				}

				return this;
			}
		}

		if ( 2 === arguments.length && 'string' === typeof props ) {
			// .css('width', '100px')
			for ( i = 0; i < this.length; i += 1 ) {
				this[ i ].style[ props ] = value;
			}

			return this;
		}

		return this;
	}

	function each( callback ) {
		if ( !callback ) {
			return this;
		}
		this.forEach( ( el, index ) => {
			callback.apply( el, [ el, index ] );
		} );
		return this;
	}

	function filter( callback ) {
		const result = arrayFilter( this, callback );
		return $( result );
	}

	function html( html ) {
		if ( 'undefined' === typeof html ) {
			return this[ 0 ] ? this[ 0 ].innerHTML : null;
		}

		for ( let i = 0; i < this.length; i += 1 ) {
			this[ i ].innerHTML = html;
		}

		return this;
	}

	function text( text ) {
		if ( 'undefined' === typeof text ) {
			return this[ 0 ] ? this[ 0 ].textContent.trim() : null;
		}

		for ( let i = 0; i < this.length; i += 1 ) {
			this[ i ].textContent = text;
		}

		return this;
	}

	function is( selector ) {
		const window = getWindow();
		const document = getDocument();
		const el = this[ 0 ];
		let compareWith;
		let i;
		if ( !el || 'undefined' === typeof selector ) {
			return false;
		}

		if ( 'string' === typeof selector ) {
			if ( el.matches ) {
				return el.matches( selector );
			}
			if ( el.webkitMatchesSelector ) {
				return el.webkitMatchesSelector( selector );
			}
			if ( el.msMatchesSelector ) {
				return el.msMatchesSelector( selector );
			}
			compareWith = $( selector );

			for ( i = 0; i < compareWith.length; i += 1 ) {
				if ( compareWith[ i ] === el ) {
					return true;
				}
			}

			return false;
		}

		if ( selector === document ) {
			return el === document;
		}

		if ( selector === window ) {
			return el === window;
		}

		if ( selector.nodeType || selector instanceof Dom7 ) {
			compareWith = selector.nodeType ? [ selector ] : selector;

			for ( i = 0; i < compareWith.length; i += 1 ) {
				if ( compareWith[ i ] === el ) {
					return true;
				}
			}

			return false;
		}

		return false;
	}

	function index() {
		let child = this[ 0 ];
		let i;

		if ( child ) {
			i = 0; // eslint-disable-next-line

			while ( null !== ( child = child.previousSibling ) ) {
				if ( 1 === child.nodeType ) {
					i += 1;
				}
			}

			return i;
		}

		return undefined;
	}

	function eq( index ) {
		if ( 'undefined' === typeof index ) {
			return this;
		}
		const length = this.length;

		if ( index > length - 1 ) {
			return $( [] );
		}

		if ( 0 > index ) {
			const returnIndex = length + index;
			if ( 0 > returnIndex ) {
				return $( [] );
			}
			return $( [ this[ returnIndex ] ] );
		}

		return $( [ this[ index ] ] );
	}

	function append() {
		let newChild;
		const document = getDocument();

		for ( let k = 0; k < arguments.length; k += 1 ) {
			newChild = 0 > k || arguments.length <= k ? undefined : arguments[ k ];

			for ( let i = 0; i < this.length; i += 1 ) {
				if ( 'string' === typeof newChild ) {
					const tempDiv = document.createElement( 'div' );
					tempDiv.innerHTML = newChild;

					while ( tempDiv.firstChild ) {
						this[ i ].appendChild( tempDiv.firstChild );
					}
				} else if ( newChild instanceof Dom7 ) {
					for ( let j = 0; j < newChild.length; j += 1 ) {
						this[ i ].appendChild( newChild[ j ] );
					}
				} else {
					this[ i ].appendChild( newChild );
				}
			}
		}

		return this;
	}

	function prepend( newChild ) {
		const document = getDocument();
		let i;
		let j;

		for ( i = 0; i < this.length; i += 1 ) {
			if ( 'string' === typeof newChild ) {
				const tempDiv = document.createElement( 'div' );
				tempDiv.innerHTML = newChild;

				for ( j = tempDiv.childNodes.length - 1; 0 <= j; j -= 1 ) {
					this[ i ].insertBefore( tempDiv.childNodes[ j ], this[ i ].childNodes[ 0 ] );
				}
			} else if ( newChild instanceof Dom7 ) {
				for ( j = 0; j < newChild.length; j += 1 ) {
					this[ i ].insertBefore( newChild[ j ], this[ i ].childNodes[ 0 ] );
				}
			} else {
				this[ i ].insertBefore( newChild, this[ i ].childNodes[ 0 ] );
			}
		}

		return this;
	}

	function next( selector ) {
		if ( 0 < this.length ) {
			if ( selector ) {
				if ( this[ 0 ].nextElementSibling && $( this[ 0 ].nextElementSibling ).is( selector ) ) {
					return $( [ this[ 0 ].nextElementSibling ] );
				}

				return $( [] );
			}

			if ( this[ 0 ].nextElementSibling ) {
				return $( [ this[ 0 ].nextElementSibling ] );
			}
			return $( [] );
		}

		return $( [] );
	}

	function nextAll( selector ) {
		const nextEls = [];
		let el = this[ 0 ];
		if ( !el ) {
			return $( [] );
		}

		while ( el.nextElementSibling ) {
        const next = el.nextElementSibling; // eslint-disable-line

			if ( selector ) {
				if ( $( next ).is( selector ) ) {
					nextEls.push( next );
				}
			} else {
				nextEls.push( next );
			}

			el = next;
		}

		return $( nextEls );
	}

	function prev( selector ) {
		if ( 0 < this.length ) {
			const el = this[ 0 ];

			if ( selector ) {
				if ( el.previousElementSibling && $( el.previousElementSibling ).is( selector ) ) {
					return $( [ el.previousElementSibling ] );
				}

				return $( [] );
			}

			if ( el.previousElementSibling ) {
				return $( [ el.previousElementSibling ] );
			}
			return $( [] );
		}

		return $( [] );
	}

	function prevAll( selector ) {
		const prevEls = [];
		let el = this[ 0 ];
		if ( !el ) {
			return $( [] );
		}

		while ( el.previousElementSibling ) {
        const prev = el.previousElementSibling; // eslint-disable-line

			if ( selector ) {
				if ( $( prev ).is( selector ) ) {
					prevEls.push( prev );
				}
			} else {
				prevEls.push( prev );
			}

			el = prev;
		}

		return $( prevEls );
	}

	function parent( selector ) {
      const parents = []; // eslint-disable-line

		for ( let i = 0; i < this.length; i += 1 ) {
			if ( null !== this[ i ].parentNode ) {
				if ( selector ) {
					if ( $( this[ i ].parentNode ).is( selector ) ) {
						parents.push( this[ i ].parentNode );
					}
				} else {
					parents.push( this[ i ].parentNode );
				}
			}
		}

		return $( parents );
	}

	function parents( selector ) {
      const parents = []; // eslint-disable-line

		for ( let i = 0; i < this.length; i += 1 ) {
        let parent = this[i].parentNode; // eslint-disable-line

			while ( parent ) {
				if ( selector ) {
					if ( $( parent ).is( selector ) ) {
						parents.push( parent );
					}
				} else {
					parents.push( parent );
				}

				parent = parent.parentNode;
			}
		}

		return $( parents );
	}

	function closest( selector ) {
      let closest = this; // eslint-disable-line

		if ( 'undefined' === typeof selector ) {
			return $( [] );
		}

		if ( !closest.is( selector ) ) {
			closest = closest.parents( selector ).eq( 0 );
		}

		return closest;
	}

	function find( selector ) {
		const foundElements = [];

		for ( let i = 0; i < this.length; i += 1 ) {
			const found = this[ i ].querySelectorAll( selector );

			for ( let j = 0; j < found.length; j += 1 ) {
				foundElements.push( found[ j ] );
			}
		}

		return $( foundElements );
	}

	function children( selector ) {
      const children = []; // eslint-disable-line

		for ( let i = 0; i < this.length; i += 1 ) {
			const childNodes = this[ i ].children;

			for ( let j = 0; j < childNodes.length; j += 1 ) {
				if ( !selector || $( childNodes[ j ] ).is( selector ) ) {
					children.push( childNodes[ j ] );
				}
			}
		}

		return $( children );
	}

	function remove() {
		for ( let i = 0; i < this.length; i += 1 ) {
			if ( this[ i ].parentNode ) {
				this[ i ].parentNode.removeChild( this[ i ] );
			}
		}

		return this;
	}

	const Methods = {
		addClass,
		removeClass,
		hasClass,
		toggleClass,
		attr,
		removeAttr,
		transform,
		transition: transition$1,
		on,
		off,
		trigger,
		transitionEnd: transitionEnd$1,
		outerWidth,
		outerHeight,
		styles,
		offset,
		css,
		each,
		html,
		text,
		is,
		index,
		eq,
		append,
		prepend,
		next,
		nextAll,
		prev,
		prevAll,
		parent,
		parents,
		closest,
		find,
		children,
		filter,
		remove
	};
	Object.keys( Methods ).forEach( ( methodName ) => {
		Object.defineProperty( $.fn, methodName, {
			value: Methods[ methodName ],
			writable: true
		} );
	} );

	function deleteProps( obj ) {
		const object = obj;
		Object.keys( object ).forEach( ( key ) => {
			try {
				object[ key ] = null;
			} catch ( e ) { // no getter for object
			}

			try {
				delete object[ key ];
			} catch ( e ) { // something got wrong
			}
		} );
	}

	function nextTick( callback, delay ) {
		if ( delay === void 0 ) {
			delay = 0;
		}

		return setTimeout( callback, delay );
	}

	function now() {
		return Date.now();
	}

	function getComputedStyle$1( el ) {
		const window = getWindow();
		let style;

		if ( window.getComputedStyle ) {
			style = window.getComputedStyle( el, null );
		}

		if ( !style && el.currentStyle ) {
			style = el.currentStyle;
		}

		if ( !style ) {
			style = el.style;
		}

		return style;
	}

	function getTranslate( el, axis ) {
		if ( axis === void 0 ) {
			axis = 'x';
		}

		const window = getWindow();
		let matrix;
		let curTransform;
		let transformMatrix;
		const curStyle = getComputedStyle$1( el );

		if ( window.WebKitCSSMatrix ) {
			curTransform = curStyle.transform || curStyle.webkitTransform;

			if ( 6 < curTransform.split( ',' ).length ) {
				curTransform = curTransform.split( ', ' ).map( ( a ) => a.replace( ',', '.' ) ).join( ', ' );
			} // Some old versions of Webkit choke when 'none' is passed; pass
			// empty string instead in this case


			transformMatrix = new window.WebKitCSSMatrix( 'none' === curTransform ? '' : curTransform );
		} else {
			transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue( 'transform' ).replace( 'translate(', 'matrix(1, 0, 0, 1,' );
			matrix = transformMatrix.toString().split( ',' );
		}

		if ( 'x' === axis ) {
			// Latest Chrome and webkits Fix
			if ( window.WebKitCSSMatrix ) {
				curTransform = transformMatrix.m41;
			} // Crazy IE10 Matrix
			else if ( 16 === matrix.length ) {
				curTransform = parseFloat( matrix[ 12 ] );
			} // Normal Browsers
			else {
				curTransform = parseFloat( matrix[ 4 ] );
			}
		}

		if ( 'y' === axis ) {
			// Latest Chrome and webkits Fix
			if ( window.WebKitCSSMatrix ) {
				curTransform = transformMatrix.m42;
			} // Crazy IE10 Matrix
			else if ( 16 === matrix.length ) {
				curTransform = parseFloat( matrix[ 13 ] );
			} // Normal Browsers
			else {
				curTransform = parseFloat( matrix[ 5 ] );
			}
		}

		return curTransform || 0;
	}

	function isObject( o ) {
		return 'object' === typeof o && null !== o && o.constructor && 'Object' === Object.prototype.toString.call( o ).slice( 8, -1 );
	}

	function isNode( node ) {
		// eslint-disable-next-line
      if (typeof window !== 'undefined' && typeof window.HTMLElement !== 'undefined') {
			return node instanceof HTMLElement;
		}

		return node && ( 1 === node.nodeType || 11 === node.nodeType );
	}

	function extend() {
		const to = Object( 0 >= arguments.length ? undefined : arguments[ 0 ] );
		const noExtend = [ '__proto__', 'constructor', 'prototype' ];

		for ( let i = 1; i < arguments.length; i += 1 ) {
			const nextSource = 0 > i || arguments.length <= i ? undefined : arguments[ i ];

			if ( nextSource !== undefined && null !== nextSource && !isNode( nextSource ) ) {
				const keysArray = Object.keys( Object( nextSource ) ).filter( ( key ) => 0 > noExtend.indexOf( key ) );

				for ( let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1 ) {
					const nextKey = keysArray[ nextIndex ];
					const desc = Object.getOwnPropertyDescriptor( nextSource, nextKey );

					if ( desc !== undefined && desc.enumerable ) {
						if ( isObject( to[ nextKey ] ) && isObject( nextSource[ nextKey ] ) ) {
							if ( nextSource[ nextKey ].__swiper__ ) {
								to[ nextKey ] = nextSource[ nextKey ];
							} else {
								extend( to[ nextKey ], nextSource[ nextKey ] );
							}
						} else if ( !isObject( to[ nextKey ] ) && isObject( nextSource[ nextKey ] ) ) {
							to[ nextKey ] = {};

							if ( nextSource[ nextKey ].__swiper__ ) {
								to[ nextKey ] = nextSource[ nextKey ];
							} else {
								extend( to[ nextKey ], nextSource[ nextKey ] );
							}
						} else {
							to[ nextKey ] = nextSource[ nextKey ];
						}
					}
				}
			}
		}

		return to;
	}

	function setCSSProperty( el, varName, varValue ) {
		el.style.setProperty( varName, varValue );
	}

	function animateCSSModeScroll( _ref ) {
		const {
			swiper,
			targetPosition,
			side
		} = _ref;
		const window = getWindow();
		const startPosition = -swiper.translate;
		let startTime = null;
		let time;
		const duration = swiper.params.speed;
		swiper.wrapperEl.style.scrollSnapType = 'none';
		window.cancelAnimationFrame( swiper.cssModeFrameID );
		const dir = targetPosition > startPosition ? 'next' : 'prev';

		const isOutOfBound = ( current, target ) => 'next' === dir && current >= target || 'prev' === dir && current <= target;

		const animate = () => {
			time = new Date().getTime();

			if ( null === startTime ) {
				startTime = time;
			}

			const progress = Math.max( Math.min( ( time - startTime ) / duration, 1 ), 0 );
			const easeProgress = 0.5 - Math.cos( progress * Math.PI ) / 2;
			let currentPosition = startPosition + easeProgress * ( targetPosition - startPosition );

			if ( isOutOfBound( currentPosition, targetPosition ) ) {
				currentPosition = targetPosition;
			}

			swiper.wrapperEl.scrollTo( {
				[ side ]: currentPosition
			} );

			if ( isOutOfBound( currentPosition, targetPosition ) ) {
				swiper.wrapperEl.style.overflow = 'hidden';
				swiper.wrapperEl.style.scrollSnapType = '';
				setTimeout( () => {
					swiper.wrapperEl.style.overflow = '';
					swiper.wrapperEl.scrollTo( {
						[ side ]: currentPosition
					} );
				} );
				window.cancelAnimationFrame( swiper.cssModeFrameID );
				return;
			}

			swiper.cssModeFrameID = window.requestAnimationFrame( animate );
		};

		animate();
	}

	let support;

	function calcSupport() {
		const window = getWindow();
		const document = getDocument();
		return {
			smoothScroll: document.documentElement && 'scrollBehavior' in document.documentElement.style,
			touch: !!( 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch ),
			passiveListener: ( function checkPassiveListener() {
				let supportsPassive = false;

				try {
					const opts = Object.defineProperty( {}, 'passive', {
						// eslint-disable-next-line
              get() {
							supportsPassive = true;
						}

					} );
					window.addEventListener( 'testPassiveListener', null, opts );
				} catch ( e ) { // No support
				}

				return supportsPassive;
			}() ),
			gestures: ( function checkGestures() {
				return 'ongesturestart' in window;
			}() )
		};
	}

	function getSupport() {
		if ( !support ) {
			support = calcSupport();
		}

		return support;
	}

	let deviceCached;

	function calcDevice( _temp ) {
		const {
			userAgent
		} = _temp === void 0 ? {} : _temp;
		const support = getSupport();
		const window = getWindow();
		const platform = window.navigator.platform;
		const ua = userAgent || window.navigator.userAgent;
		const device = {
			ios: false,
			android: false
		};
		const screenWidth = window.screen.width;
		const screenHeight = window.screen.height;
      const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line

		let ipad = ua.match( /(iPad).*OS\s([\d_]+)/ );
		const ipod = ua.match( /(iPod)(.*OS\s([\d_]+))?/ );
		const iphone = !ipad && ua.match( /(iPhone\sOS|iOS)\s([\d_]+)/ );
		const windows = 'Win32' === platform;
		let macos = 'MacIntel' === platform; // iPadOs 13 fix

		const iPadScreens = [ '1024x1366', '1366x1024', '834x1194', '1194x834', '834x1112', '1112x834', '768x1024', '1024x768', '820x1180', '1180x820', '810x1080', '1080x810' ];

		if ( !ipad && macos && support.touch && 0 <= iPadScreens.indexOf( `${screenWidth}x${screenHeight}` ) ) {
			ipad = ua.match( /(Version)\/([\d.]+)/ );
			if ( !ipad ) {
				ipad = [ 0, 1, '13_0_0' ];
			}
			macos = false;
		} // Android


		if ( android && !windows ) {
			device.os = 'android';
			device.android = true;
		}

		if ( ipad || iphone || ipod ) {
			device.os = 'ios';
			device.ios = true;
		} // Export object


		return device;
	}

	function getDevice( overrides ) {
		if ( overrides === void 0 ) {
			overrides = {};
		}

		if ( !deviceCached ) {
			deviceCached = calcDevice( overrides );
		}

		return deviceCached;
	}

	let browser;

	function calcBrowser() {
		const window = getWindow();

		function isSafari() {
			const ua = window.navigator.userAgent.toLowerCase();
			return 0 <= ua.indexOf( 'safari' ) && 0 > ua.indexOf( 'chrome' ) && 0 > ua.indexOf( 'android' );
		}

		return {
			isSafari: isSafari(),
			isWebView: ( /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i ).test( window.navigator.userAgent )
		};
	}

	function getBrowser() {
		if ( !browser ) {
			browser = calcBrowser();
		}

		return browser;
	}

	function Resize( _ref ) {
		const {
			swiper,
			on,
			emit
		} = _ref;
		const window = getWindow();
		let observer = null;
		let animationFrame = null;

		const resizeHandler = () => {
			if ( !swiper || swiper.destroyed || !swiper.initialized ) {
				return;
			}
			emit( 'beforeResize' );
			emit( 'resize' );
		};

		const createObserver = () => {
			if ( !swiper || swiper.destroyed || !swiper.initialized ) {
				return;
			}
			observer = new ResizeObserver( ( entries ) => {
				animationFrame = window.requestAnimationFrame( () => {
					const {
						width,
						height
					} = swiper;
					let newWidth = width;
					let newHeight = height;
					entries.forEach( ( _ref2 ) => {
						const {
							contentBoxSize,
							contentRect,
							target
						} = _ref2;
						if ( target && target !== swiper.el ) {
							return;
						}
						newWidth = contentRect ? contentRect.width : ( contentBoxSize[ 0 ] || contentBoxSize ).inlineSize;
						newHeight = contentRect ? contentRect.height : ( contentBoxSize[ 0 ] || contentBoxSize ).blockSize;
					} );

					if ( newWidth !== width || newHeight !== height ) {
						resizeHandler();
					}
				} );
			} );
			observer.observe( swiper.el );
		};

		const removeObserver = () => {
			if ( animationFrame ) {
				window.cancelAnimationFrame( animationFrame );
			}

			if ( observer && observer.unobserve && swiper.el ) {
				observer.unobserve( swiper.el );
				observer = null;
			}
		};

		const orientationChangeHandler = () => {
			if ( !swiper || swiper.destroyed || !swiper.initialized ) {
				return;
			}
			emit( 'orientationchange' );
		};

		on( 'init', () => {
			if ( swiper.params.resizeObserver && 'undefined' !== typeof window.ResizeObserver ) {
				createObserver();
				return;
			}

			window.addEventListener( 'resize', resizeHandler );
			window.addEventListener( 'orientationchange', orientationChangeHandler );
		} );
		on( 'destroy', () => {
			removeObserver();
			window.removeEventListener( 'resize', resizeHandler );
			window.removeEventListener( 'orientationchange', orientationChangeHandler );
		} );
	}

	function Observer( _ref ) {
		const {
			swiper,
			extendParams,
			on,
			emit
		} = _ref;
		const observers = [];
		const window = getWindow();

		const attach = function ( target, options ) {
			if ( options === void 0 ) {
				options = {};
			}

			const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
			const observer = new ObserverFunc( ( mutations ) => {
				// The observerUpdate event should only be triggered
				// once despite the number of mutations.  Additional
				// triggers are redundant and are very costly
				if ( 1 === mutations.length ) {
					emit( 'observerUpdate', mutations[ 0 ] );
					return;
				}

				const observerUpdate = function observerUpdate() {
					emit( 'observerUpdate', mutations[ 0 ] );
				};

				if ( window.requestAnimationFrame ) {
					window.requestAnimationFrame( observerUpdate );
				} else {
					window.setTimeout( observerUpdate, 0 );
				}
			} );
			observer.observe( target, {
				attributes: 'undefined' === typeof options.attributes ? true : options.attributes,
				childList: 'undefined' === typeof options.childList ? true : options.childList,
				characterData: 'undefined' === typeof options.characterData ? true : options.characterData
			} );
			observers.push( observer );
		};

		const init = () => {
			if ( !swiper.params.observer ) {
				return;
			}

			if ( swiper.params.observeParents ) {
				const containerParents = swiper.$el.parents();

				for ( let i = 0; i < containerParents.length; i += 1 ) {
					attach( containerParents[ i ] );
				}
			} // Observe container


			attach( swiper.$el[ 0 ], {
				childList: swiper.params.observeSlideChildren
			} ); // Observe wrapper

			attach( swiper.$wrapperEl[ 0 ], {
				attributes: false
			} );
		};

		const destroy = () => {
			observers.forEach( ( observer ) => {
				observer.disconnect();
			} );
			observers.splice( 0, observers.length );
		};

		extendParams( {
			observer: false,
			observeParents: false,
			observeSlideChildren: false
		} );
		on( 'init', init );
		on( 'destroy', destroy );
	}

	/* eslint-disable no-underscore-dangle */
	var eventsEmitter = {
		on( events, handler, priority ) {
			const self = this;
			if ( !self.eventsListeners || self.destroyed ) {
				return self;
			}
			if ( 'function' !== typeof handler ) {
				return self;
			}
			const method = priority ? 'unshift' : 'push';
			events.split( ' ' ).forEach( ( event ) => {
				if ( !self.eventsListeners[ event ] ) {
					self.eventsListeners[ event ] = [];
				}
				self.eventsListeners[ event ][ method ]( handler );
			} );
			return self;
		},

		once( events, handler, priority ) {
			const self = this;
			if ( !self.eventsListeners || self.destroyed ) {
				return self;
			}
			if ( 'function' !== typeof handler ) {
				return self;
			}

			function onceHandler() {
				self.off( events, onceHandler );

				if ( onceHandler.__emitterProxy ) {
					delete onceHandler.__emitterProxy;
				}

				for ( var _len = arguments.length, args = new Array( _len ), _key = 0; _key < _len; _key++ ) {
					args[ _key ] = arguments[ _key ];
				}

				handler.apply( self, args );
			}

			onceHandler.__emitterProxy = handler;
			return self.on( events, onceHandler, priority );
		},

		onAny( handler, priority ) {
			const self = this;
			if ( !self.eventsListeners || self.destroyed ) {
				return self;
			}
			if ( 'function' !== typeof handler ) {
				return self;
			}
			const method = priority ? 'unshift' : 'push';

			if ( 0 > self.eventsAnyListeners.indexOf( handler ) ) {
				self.eventsAnyListeners[ method ]( handler );
			}

			return self;
		},

		offAny( handler ) {
			const self = this;
			if ( !self.eventsListeners || self.destroyed ) {
				return self;
			}
			if ( !self.eventsAnyListeners ) {
				return self;
			}
			const index = self.eventsAnyListeners.indexOf( handler );

			if ( 0 <= index ) {
				self.eventsAnyListeners.splice( index, 1 );
			}

			return self;
		},

		off( events, handler ) {
			const self = this;
			if ( !self.eventsListeners || self.destroyed ) {
				return self;
			}
			if ( !self.eventsListeners ) {
				return self;
			}
			events.split( ' ' ).forEach( ( event ) => {
				if ( 'undefined' === typeof handler ) {
					self.eventsListeners[ event ] = [];
				} else if ( self.eventsListeners[ event ] ) {
					self.eventsListeners[ event ].forEach( ( eventHandler, index ) => {
						if ( eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler ) {
							self.eventsListeners[ event ].splice( index, 1 );
						}
					} );
				}
			} );
			return self;
		},

		emit() {
			const self = this;
			if ( !self.eventsListeners || self.destroyed ) {
				return self;
			}
			if ( !self.eventsListeners ) {
				return self;
			}
			let events;
			let data;
			let context;

			for ( var _len2 = arguments.length, args = new Array( _len2 ), _key2 = 0; _key2 < _len2; _key2++ ) {
				args[ _key2 ] = arguments[ _key2 ];
			}

			if ( 'string' === typeof args[ 0 ] || Array.isArray( args[ 0 ] ) ) {
				events = args[ 0 ];
				data = args.slice( 1, args.length );
				context = self;
			} else {
				events = args[ 0 ].events;
				data = args[ 0 ].data;
				context = args[ 0 ].context || self;
			}

			data.unshift( context );
			const eventsArray = Array.isArray( events ) ? events : events.split( ' ' );
			eventsArray.forEach( ( event ) => {
				if ( self.eventsAnyListeners && self.eventsAnyListeners.length ) {
					self.eventsAnyListeners.forEach( ( eventHandler ) => {
						eventHandler.apply( context, [ event, ...data ] );
					} );
				}

				if ( self.eventsListeners && self.eventsListeners[ event ] ) {
					self.eventsListeners[ event ].forEach( ( eventHandler ) => {
						eventHandler.apply( context, data );
					} );
				}
			} );
			return self;
		}

	};

	function updateSize() {
		const swiper = this;
		let width;
		let height;
		const $el = swiper.$el;

		if ( 'undefined' !== typeof swiper.params.width && null !== swiper.params.width ) {
			width = swiper.params.width;
		} else {
			width = $el[ 0 ].clientWidth;
		}

		if ( 'undefined' !== typeof swiper.params.height && null !== swiper.params.height ) {
			height = swiper.params.height;
		} else {
			height = $el[ 0 ].clientHeight;
		}

		if ( 0 === width && swiper.isHorizontal() || 0 === height && swiper.isVertical() ) {
			return;
		} // Subtract paddings


		width = width - parseInt( $el.css( 'padding-left' ) || 0, 10 ) - parseInt( $el.css( 'padding-right' ) || 0, 10 );
		height = height - parseInt( $el.css( 'padding-top' ) || 0, 10 ) - parseInt( $el.css( 'padding-bottom' ) || 0, 10 );
		if ( Number.isNaN( width ) ) {
			width = 0;
		}
		if ( Number.isNaN( height ) ) {
			height = 0;
		}
		Object.assign( swiper, {
			width,
			height,
			size: swiper.isHorizontal() ? width : height
		} );
	}

	function updateSlides() {
		const swiper = this;

		function getDirectionLabel( property ) {
			if ( swiper.isHorizontal() ) {
				return property;
			} // prettier-ignore


			return {
				'width': 'height',
				'margin-top': 'margin-left',
				'margin-bottom ': 'margin-right',
				'margin-left': 'margin-top',
				'margin-right': 'margin-bottom',
				'padding-left': 'padding-top',
				'padding-right': 'padding-bottom',
				'marginRight': 'marginBottom'
			}[ property ];
		}

		function getDirectionPropertyValue( node, label ) {
			return parseFloat( node.getPropertyValue( getDirectionLabel( label ) ) || 0 );
		}

		const params = swiper.params;
		const {
			$wrapperEl,
			size: swiperSize,
			rtlTranslate: rtl,
			wrongRTL
		} = swiper;
		const isVirtual = swiper.virtual && params.virtual.enabled;
		const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
		const slides = $wrapperEl.children( `.${swiper.params.slideClass}` );
		const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
		let snapGrid = [];
		const slidesGrid = [];
		const slidesSizesGrid = [];
		let offsetBefore = params.slidesOffsetBefore;

		if ( 'function' === typeof offsetBefore ) {
			offsetBefore = params.slidesOffsetBefore.call( swiper );
		}

		let offsetAfter = params.slidesOffsetAfter;

		if ( 'function' === typeof offsetAfter ) {
			offsetAfter = params.slidesOffsetAfter.call( swiper );
		}

		const previousSnapGridLength = swiper.snapGrid.length;
		const previousSlidesGridLength = swiper.slidesGrid.length;
		let spaceBetween = params.spaceBetween;
		let slidePosition = -offsetBefore;
		let prevSlideSize = 0;
		let index = 0;

		if ( 'undefined' === typeof swiperSize ) {
			return;
		}

		if ( 'string' === typeof spaceBetween && 0 <= spaceBetween.indexOf( '%' ) ) {
			spaceBetween = parseFloat( spaceBetween.replace( '%', '' ) ) / 100 * swiperSize;
		}

		swiper.virtualSize = -spaceBetween; // reset margins

		if ( rtl ) {
			slides.css( {
				marginLeft: '',
				marginBottom: '',
				marginTop: ''
			} );
		} else {
			slides.css( {
				marginRight: '',
				marginBottom: '',
				marginTop: ''
			} );
		} // reset cssMode offsets

		if ( params.centeredSlides && params.cssMode ) {
			setCSSProperty( swiper.wrapperEl, '--swiper-centered-offset-before', '' );
			setCSSProperty( swiper.wrapperEl, '--swiper-centered-offset-after', '' );
		}

		const gridEnabled = params.grid && 1 < params.grid.rows && swiper.grid;

		if ( gridEnabled ) {
			swiper.grid.initSlides( slidesLength );
		} // Calc slides


		let slideSize;
		const shouldResetSlideSize = 'auto' === params.slidesPerView && params.breakpoints && 0 < Object.keys( params.breakpoints ).filter( ( key ) => 'undefined' !== typeof params.breakpoints[ key ].slidesPerView ).length;

		for ( let i = 0; i < slidesLength; i += 1 ) {
			slideSize = 0;
			const slide = slides.eq( i );

			if ( gridEnabled ) {
				swiper.grid.updateSlide( i, slide, slidesLength, getDirectionLabel );
			}

        if (slide.css('display') === 'none') continue; // eslint-disable-line

			if ( 'auto' === params.slidesPerView ) {
				if ( shouldResetSlideSize ) {
					slides[ i ].style[ getDirectionLabel( 'width' ) ] = '';
				}

				const slideStyles = getComputedStyle( slide[ 0 ] );
				const currentTransform = slide[ 0 ].style.transform;
				const currentWebKitTransform = slide[ 0 ].style.webkitTransform;

				if ( currentTransform ) {
					slide[ 0 ].style.transform = 'none';
				}

				if ( currentWebKitTransform ) {
					slide[ 0 ].style.webkitTransform = 'none';
				}

				if ( params.roundLengths ) {
					slideSize = swiper.isHorizontal() ? slide.outerWidth( true ) : slide.outerHeight( true );
				} else {
					// eslint-disable-next-line
            const width = getDirectionPropertyValue(slideStyles, 'width');
					const paddingLeft = getDirectionPropertyValue( slideStyles, 'padding-left' );
					const paddingRight = getDirectionPropertyValue( slideStyles, 'padding-right' );
					const marginLeft = getDirectionPropertyValue( slideStyles, 'margin-left' );
					const marginRight = getDirectionPropertyValue( slideStyles, 'margin-right' );
					const boxSizing = slideStyles.getPropertyValue( 'box-sizing' );

					if ( boxSizing && 'border-box' === boxSizing ) {
						slideSize = width + marginLeft + marginRight;
					} else {
						const {
							clientWidth,
							offsetWidth
						} = slide[ 0 ];
						slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + ( offsetWidth - clientWidth );
					}
				}

				if ( currentTransform ) {
					slide[ 0 ].style.transform = currentTransform;
				}

				if ( currentWebKitTransform ) {
					slide[ 0 ].style.webkitTransform = currentWebKitTransform;
				}

				if ( params.roundLengths ) {
					slideSize = Math.floor( slideSize );
				}
			} else {
				slideSize = ( swiperSize - ( params.slidesPerView - 1 ) * spaceBetween ) / params.slidesPerView;
				if ( params.roundLengths ) {
					slideSize = Math.floor( slideSize );
				}

				if ( slides[ i ] ) {
					slides[ i ].style[ getDirectionLabel( 'width' ) ] = `${slideSize}px`;
				}
			}

			if ( slides[ i ] ) {
				slides[ i ].swiperSlideSize = slideSize;
			}

			slidesSizesGrid.push( slideSize );

			if ( params.centeredSlides ) {
				slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
				if ( 0 === prevSlideSize && 0 !== i ) {
					slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
				}
				if ( 0 === i ) {
					slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
				}
				if ( Math.abs( slidePosition ) < 1 / 1000 ) {
					slidePosition = 0;
				}
				if ( params.roundLengths ) {
					slidePosition = Math.floor( slidePosition );
				}
				if ( 0 === index % params.slidesPerGroup ) {
					snapGrid.push( slidePosition );
				}
				slidesGrid.push( slidePosition );
			} else {
				if ( params.roundLengths ) {
					slidePosition = Math.floor( slidePosition );
				}
				if ( 0 === ( index - Math.min( swiper.params.slidesPerGroupSkip, index ) ) % swiper.params.slidesPerGroup ) {
					snapGrid.push( slidePosition );
				}
				slidesGrid.push( slidePosition );
				slidePosition = slidePosition + slideSize + spaceBetween;
			}

			swiper.virtualSize += slideSize + spaceBetween;
			prevSlideSize = slideSize;
			index += 1;
		}

		swiper.virtualSize = Math.max( swiper.virtualSize, swiperSize ) + offsetAfter;

		if ( rtl && wrongRTL && ( 'slide' === params.effect || 'coverflow' === params.effect ) ) {
			$wrapperEl.css( {
				width: `${swiper.virtualSize + params.spaceBetween}px`
			} );
		}

		if ( params.setWrapperSize ) {
			$wrapperEl.css( {
				[ getDirectionLabel( 'width' ) ]: `${swiper.virtualSize + params.spaceBetween}px`
			} );
		}

		if ( gridEnabled ) {
			swiper.grid.updateWrapperSize( slideSize, snapGrid, getDirectionLabel );
		} // Remove last grid elements depending on width


		if ( !params.centeredSlides ) {
			const newSlidesGrid = [];

			for ( let i = 0; i < snapGrid.length; i += 1 ) {
				let slidesGridItem = snapGrid[ i ];
				if ( params.roundLengths ) {
					slidesGridItem = Math.floor( slidesGridItem );
				}

				if ( snapGrid[ i ] <= swiper.virtualSize - swiperSize ) {
					newSlidesGrid.push( slidesGridItem );
				}
			}

			snapGrid = newSlidesGrid;

			if ( 1 < Math.floor( swiper.virtualSize - swiperSize ) - Math.floor( snapGrid[ snapGrid.length - 1 ] ) ) {
				snapGrid.push( swiper.virtualSize - swiperSize );
			}
		}

		if ( 0 === snapGrid.length ) {
			snapGrid = [ 0 ];
		}

		if ( 0 !== params.spaceBetween ) {
			const key = swiper.isHorizontal() && rtl ? 'marginLeft' : getDirectionLabel( 'marginRight' );
			slides.filter( ( _, slideIndex ) => {
				if ( !params.cssMode ) {
					return true;
				}

				if ( slideIndex === slides.length - 1 ) {
					return false;
				}

				return true;
			} ).css( {
				[ key ]: `${spaceBetween}px`
			} );
		}

		if ( params.centeredSlides && params.centeredSlidesBounds ) {
			let allSlidesSize = 0;
			slidesSizesGrid.forEach( ( slideSizeValue ) => {
				allSlidesSize += slideSizeValue + ( params.spaceBetween ? params.spaceBetween : 0 );
			} );
			allSlidesSize -= params.spaceBetween;
			const maxSnap = allSlidesSize - swiperSize;
			snapGrid = snapGrid.map( ( snap ) => {
				if ( 0 > snap ) {
					return -offsetBefore;
				}
				if ( snap > maxSnap ) {
					return maxSnap + offsetAfter;
				}
				return snap;
			} );
		}

		if ( params.centerInsufficientSlides ) {
			let allSlidesSize = 0;
			slidesSizesGrid.forEach( ( slideSizeValue ) => {
				allSlidesSize += slideSizeValue + ( params.spaceBetween ? params.spaceBetween : 0 );
			} );
			allSlidesSize -= params.spaceBetween;

			if ( allSlidesSize < swiperSize ) {
				const allSlidesOffset = ( swiperSize - allSlidesSize ) / 2;
				snapGrid.forEach( ( snap, snapIndex ) => {
					snapGrid[ snapIndex ] = snap - allSlidesOffset;
				} );
				slidesGrid.forEach( ( snap, snapIndex ) => {
					slidesGrid[ snapIndex ] = snap + allSlidesOffset;
				} );
			}
		}

		Object.assign( swiper, {
			slides,
			snapGrid,
			slidesGrid,
			slidesSizesGrid
		} );

		if ( params.centeredSlides && params.cssMode && !params.centeredSlidesBounds ) {
			setCSSProperty( swiper.wrapperEl, '--swiper-centered-offset-before', `${-snapGrid[ 0 ]}px` );
			setCSSProperty( swiper.wrapperEl, '--swiper-centered-offset-after', `${swiper.size / 2 - slidesSizesGrid[ slidesSizesGrid.length - 1 ] / 2}px` );
			const addToSnapGrid = -swiper.snapGrid[ 0 ];
			const addToSlidesGrid = -swiper.slidesGrid[ 0 ];
			swiper.snapGrid = swiper.snapGrid.map( ( v ) => v + addToSnapGrid );
			swiper.slidesGrid = swiper.slidesGrid.map( ( v ) => v + addToSlidesGrid );
		}

		if ( slidesLength !== previousSlidesLength ) {
			swiper.emit( 'slidesLengthChange' );
		}

		if ( snapGrid.length !== previousSnapGridLength ) {
			if ( swiper.params.watchOverflow ) {
				swiper.checkOverflow();
			}
			swiper.emit( 'snapGridLengthChange' );
		}

		if ( slidesGrid.length !== previousSlidesGridLength ) {
			swiper.emit( 'slidesGridLengthChange' );
		}

		if ( params.watchSlidesProgress ) {
			swiper.updateSlidesOffset();
		}

		if ( !isVirtual && !params.cssMode && ( 'slide' === params.effect || 'fade' === params.effect ) ) {
			const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
			const hasClassBackfaceClassAdded = swiper.$el.hasClass( backFaceHiddenClass );

			if ( slidesLength <= params.maxBackfaceHiddenSlides ) {
				if ( !hasClassBackfaceClassAdded ) {
					swiper.$el.addClass( backFaceHiddenClass );
				}
			} else if ( hasClassBackfaceClassAdded ) {
				swiper.$el.removeClass( backFaceHiddenClass );
			}
		}
	}

	function updateAutoHeight( speed ) {
		const swiper = this;
		const activeSlides = [];
		const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
		let newHeight = 0;
		let i;

		if ( 'number' === typeof speed ) {
			swiper.setTransition( speed );
		} else if ( true === speed ) {
			swiper.setTransition( swiper.params.speed );
		}

		const getSlideByIndex = ( index ) => {
			if ( isVirtual ) {
				return swiper.slides.filter( ( el ) => parseInt( el.getAttribute( 'data-swiper-slide-index' ), 10 ) === index )[ 0 ];
			}

			return swiper.slides.eq( index )[ 0 ];
		}; // Find slides currently in view


		if ( 'auto' !== swiper.params.slidesPerView && 1 < swiper.params.slidesPerView ) {
			if ( swiper.params.centeredSlides ) {
				( swiper.visibleSlides || $( [] ) ).each( ( slide ) => {
					activeSlides.push( slide );
				} );
			} else {
				for ( i = 0; i < Math.ceil( swiper.params.slidesPerView ); i += 1 ) {
					const index = swiper.activeIndex + i;
					if ( index > swiper.slides.length && !isVirtual ) {
						break;
					}
					activeSlides.push( getSlideByIndex( index ) );
				}
			}
		} else {
			activeSlides.push( getSlideByIndex( swiper.activeIndex ) );
		} // Find new height from highest slide in view


		for ( i = 0; i < activeSlides.length; i += 1 ) {
			if ( 'undefined' !== typeof activeSlides[ i ] ) {
				const height = activeSlides[ i ].offsetHeight;
				newHeight = height > newHeight ? height : newHeight;
			}
		} // Update Height


		if ( newHeight || 0 === newHeight ) {
			swiper.$wrapperEl.css( 'height', `${newHeight}px` );
		}
	}

	function updateSlidesOffset() {
		const swiper = this;
		const slides = swiper.slides;

		for ( let i = 0; i < slides.length; i += 1 ) {
			slides[ i ].swiperSlideOffset = swiper.isHorizontal() ? slides[ i ].offsetLeft : slides[ i ].offsetTop;
		}
	}

	function updateSlidesProgress( translate ) {
		if ( translate === void 0 ) {
			translate = this && this.translate || 0;
		}

		const swiper = this;
		const params = swiper.params;
		const {
			slides,
			rtlTranslate: rtl,
			snapGrid
		} = swiper;
		if ( 0 === slides.length ) {
			return;
		}
		if ( 'undefined' === typeof slides[ 0 ].swiperSlideOffset ) {
			swiper.updateSlidesOffset();
		}
		let offsetCenter = -translate;
		if ( rtl ) {
			offsetCenter = translate;
		} // Visible Slides

		slides.removeClass( params.slideVisibleClass );
		swiper.visibleSlidesIndexes = [];
		swiper.visibleSlides = [];

		for ( let i = 0; i < slides.length; i += 1 ) {
			const slide = slides[ i ];
			let slideOffset = slide.swiperSlideOffset;

			if ( params.cssMode && params.centeredSlides ) {
				slideOffset -= slides[ 0 ].swiperSlideOffset;
			}

			const slideProgress = ( offsetCenter + ( params.centeredSlides ? swiper.minTranslate() : 0 ) - slideOffset ) / ( slide.swiperSlideSize + params.spaceBetween );
			const originalSlideProgress = ( offsetCenter - snapGrid[ 0 ] + ( params.centeredSlides ? swiper.minTranslate() : 0 ) - slideOffset ) / ( slide.swiperSlideSize + params.spaceBetween );
			const slideBefore = -( offsetCenter - slideOffset );
			const slideAfter = slideBefore + swiper.slidesSizesGrid[ i ];
			const isVisible = 0 <= slideBefore && slideBefore < swiper.size - 1 || 1 < slideAfter && slideAfter <= swiper.size || 0 >= slideBefore && slideAfter >= swiper.size;

			if ( isVisible ) {
				swiper.visibleSlides.push( slide );
				swiper.visibleSlidesIndexes.push( i );
				slides.eq( i ).addClass( params.slideVisibleClass );
			}

			slide.progress = rtl ? -slideProgress : slideProgress;
			slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
		}

		swiper.visibleSlides = $( swiper.visibleSlides );
	}

	function updateProgress( translate ) {
		const swiper = this;

		if ( 'undefined' === typeof translate ) {
			const multiplier = swiper.rtlTranslate ? -1 : 1; // eslint-disable-next-line

			translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
		}

		const params = swiper.params;
		const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
		let {
			progress,
			isBeginning,
			isEnd
		} = swiper;
		const wasBeginning = isBeginning;
		const wasEnd = isEnd;

		if ( 0 === translatesDiff ) {
			progress = 0;
			isBeginning = true;
			isEnd = true;
		} else {
			progress = ( translate - swiper.minTranslate() ) / translatesDiff;
			isBeginning = 0 >= progress;
			isEnd = 1 <= progress;
		}

		Object.assign( swiper, {
			progress,
			isBeginning,
			isEnd
		} );
		if ( params.watchSlidesProgress || params.centeredSlides && params.autoHeight ) {
			swiper.updateSlidesProgress( translate );
		}

		if ( isBeginning && !wasBeginning ) {
			swiper.emit( 'reachBeginning toEdge' );
		}

		if ( isEnd && !wasEnd ) {
			swiper.emit( 'reachEnd toEdge' );
		}

		if ( wasBeginning && !isBeginning || wasEnd && !isEnd ) {
			swiper.emit( 'fromEdge' );
		}

		swiper.emit( 'progress', progress );
	}

	function updateSlidesClasses() {
		const swiper = this;
		const {
			slides,
			params,
			$wrapperEl,
			activeIndex,
			realIndex
		} = swiper;
		const isVirtual = swiper.virtual && params.virtual.enabled;
		slides.removeClass( `${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}` );
		let activeSlide;

		if ( isVirtual ) {
			activeSlide = swiper.$wrapperEl.find( `.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]` );
		} else {
			activeSlide = slides.eq( activeIndex );
		} // Active classes


		activeSlide.addClass( params.slideActiveClass );

		if ( params.loop ) {
			// Duplicate to all looped slides
			if ( activeSlide.hasClass( params.slideDuplicateClass ) ) {
				$wrapperEl.children( `.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]` ).addClass( params.slideDuplicateActiveClass );
			} else {
				$wrapperEl.children( `.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]` ).addClass( params.slideDuplicateActiveClass );
			}
		} // Next Slide


		let nextSlide = activeSlide.nextAll( `.${params.slideClass}` ).eq( 0 ).addClass( params.slideNextClass );

		if ( params.loop && 0 === nextSlide.length ) {
			nextSlide = slides.eq( 0 );
			nextSlide.addClass( params.slideNextClass );
		} // Prev Slide


		let prevSlide = activeSlide.prevAll( `.${params.slideClass}` ).eq( 0 ).addClass( params.slidePrevClass );

		if ( params.loop && 0 === prevSlide.length ) {
			prevSlide = slides.eq( -1 );
			prevSlide.addClass( params.slidePrevClass );
		}

		if ( params.loop ) {
			// Duplicate to all looped slides
			if ( nextSlide.hasClass( params.slideDuplicateClass ) ) {
				$wrapperEl.children( `.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr( 'data-swiper-slide-index' )}"]` ).addClass( params.slideDuplicateNextClass );
			} else {
				$wrapperEl.children( `.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr( 'data-swiper-slide-index' )}"]` ).addClass( params.slideDuplicateNextClass );
			}

			if ( prevSlide.hasClass( params.slideDuplicateClass ) ) {
				$wrapperEl.children( `.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr( 'data-swiper-slide-index' )}"]` ).addClass( params.slideDuplicatePrevClass );
			} else {
				$wrapperEl.children( `.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr( 'data-swiper-slide-index' )}"]` ).addClass( params.slideDuplicatePrevClass );
			}
		}

		swiper.emitSlidesClasses();
	}

	function updateActiveIndex( newActiveIndex ) {
		const swiper = this;
		const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
		const {
			slidesGrid,
			snapGrid,
			params,
			activeIndex: previousIndex,
			realIndex: previousRealIndex,
			snapIndex: previousSnapIndex
		} = swiper;
		let activeIndex = newActiveIndex;
		let snapIndex;

		if ( 'undefined' === typeof activeIndex ) {
			for ( let i = 0; i < slidesGrid.length; i += 1 ) {
				if ( 'undefined' !== typeof slidesGrid[ i + 1 ] ) {
					if ( translate >= slidesGrid[ i ] && translate < slidesGrid[ i + 1 ] - ( slidesGrid[ i + 1 ] - slidesGrid[ i ] ) / 2 ) {
						activeIndex = i;
					} else if ( translate >= slidesGrid[ i ] && translate < slidesGrid[ i + 1 ] ) {
						activeIndex = i + 1;
					}
				} else if ( translate >= slidesGrid[ i ] ) {
					activeIndex = i;
				}
			} // Normalize slideIndex


			if ( params.normalizeSlideIndex ) {
				if ( 0 > activeIndex || 'undefined' === typeof activeIndex ) {
					activeIndex = 0;
				}
			}
		}

		if ( 0 <= snapGrid.indexOf( translate ) ) {
			snapIndex = snapGrid.indexOf( translate );
		} else {
			const skip = Math.min( params.slidesPerGroupSkip, activeIndex );
			snapIndex = skip + Math.floor( ( activeIndex - skip ) / params.slidesPerGroup );
		}

		if ( snapIndex >= snapGrid.length ) {
			snapIndex = snapGrid.length - 1;
		}

		if ( activeIndex === previousIndex ) {
			if ( snapIndex !== previousSnapIndex ) {
				swiper.snapIndex = snapIndex;
				swiper.emit( 'snapIndexChange' );
			}

			return;
		} // Get real index


		const realIndex = parseInt( swiper.slides.eq( activeIndex ).attr( 'data-swiper-slide-index' ) || activeIndex, 10 );
		Object.assign( swiper, {
			snapIndex,
			realIndex,
			previousIndex,
			activeIndex
		} );
		swiper.emit( 'activeIndexChange' );
		swiper.emit( 'snapIndexChange' );

		if ( previousRealIndex !== realIndex ) {
			swiper.emit( 'realIndexChange' );
		}

		if ( swiper.initialized || swiper.params.runCallbacksOnInit ) {
			swiper.emit( 'slideChange' );
		}
	}

	function updateClickedSlide( e ) {
		const swiper = this;
		const params = swiper.params;
		const slide = $( e ).closest( `.${params.slideClass}` )[ 0 ];
		let slideFound = false;
		let slideIndex;

		if ( slide ) {
			for ( let i = 0; i < swiper.slides.length; i += 1 ) {
				if ( swiper.slides[ i ] === slide ) {
					slideFound = true;
					slideIndex = i;
					break;
				}
			}
		}

		if ( slide && slideFound ) {
			swiper.clickedSlide = slide;

			if ( swiper.virtual && swiper.params.virtual.enabled ) {
				swiper.clickedIndex = parseInt( $( slide ).attr( 'data-swiper-slide-index' ), 10 );
			} else {
				swiper.clickedIndex = slideIndex;
			}
		} else {
			swiper.clickedSlide = undefined;
			swiper.clickedIndex = undefined;
			return;
		}

		if ( params.slideToClickedSlide && swiper.clickedIndex !== undefined && swiper.clickedIndex !== swiper.activeIndex ) {
			swiper.slideToClickedSlide();
		}
	}

	var update = {
		updateSize,
		updateSlides,
		updateAutoHeight,
		updateSlidesOffset,
		updateSlidesProgress,
		updateProgress,
		updateSlidesClasses,
		updateActiveIndex,
		updateClickedSlide
	};

	function getSwiperTranslate( axis ) {
		if ( axis === void 0 ) {
			axis = this.isHorizontal() ? 'x' : 'y';
		}

		const swiper = this;
		const {
			params,
			rtlTranslate: rtl,
			translate,
			$wrapperEl
		} = swiper;

		if ( params.virtualTranslate ) {
			return rtl ? -translate : translate;
		}

		if ( params.cssMode ) {
			return translate;
		}

		let currentTranslate = getTranslate( $wrapperEl[ 0 ], axis );
		if ( rtl ) {
			currentTranslate = -currentTranslate;
		}
		return currentTranslate || 0;
	}

	function setTranslate( translate, byController ) {
		const swiper = this;
		const {
			rtlTranslate: rtl,
			params,
			$wrapperEl,
			wrapperEl,
			progress
		} = swiper;
		let x = 0;
		let y = 0;
		const z = 0;

		if ( swiper.isHorizontal() ) {
			x = rtl ? -translate : translate;
		} else {
			y = translate;
		}

		if ( params.roundLengths ) {
			x = Math.floor( x );
			y = Math.floor( y );
		}

		if ( params.cssMode ) {
			wrapperEl[ swiper.isHorizontal() ? 'scrollLeft' : 'scrollTop' ] = swiper.isHorizontal() ? -x : -y;
		} else if ( !params.virtualTranslate ) {
			$wrapperEl.transform( `translate3d(${x}px, ${y}px, ${z}px)` );
		}

		swiper.previousTranslate = swiper.translate;
		swiper.translate = swiper.isHorizontal() ? x : y; // Check if we need to update progress

		let newProgress;
		const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

		if ( 0 === translatesDiff ) {
			newProgress = 0;
		} else {
			newProgress = ( translate - swiper.minTranslate() ) / translatesDiff;
		}

		if ( newProgress !== progress ) {
			swiper.updateProgress( translate );
		}

		swiper.emit( 'setTranslate', swiper.translate, byController );
	}

	function minTranslate() {
		return -this.snapGrid[ 0 ];
	}

	function maxTranslate() {
		return -this.snapGrid[ this.snapGrid.length - 1 ];
	}

	function translateTo( translate, speed, runCallbacks, translateBounds, internal ) {
		if ( translate === void 0 ) {
			translate = 0;
		}

		if ( speed === void 0 ) {
			speed = this.params.speed;
		}

		if ( runCallbacks === void 0 ) {
			runCallbacks = true;
		}

		if ( translateBounds === void 0 ) {
			translateBounds = true;
		}

		const swiper = this;
		const {
			params,
			wrapperEl
		} = swiper;

		if ( swiper.animating && params.preventInteractionOnTransition ) {
			return false;
		}

		const minTranslate = swiper.minTranslate();
		const maxTranslate = swiper.maxTranslate();
		let newTranslate;
		if ( translateBounds && translate > minTranslate ) {
			newTranslate = minTranslate;
		} else if ( translateBounds && translate < maxTranslate ) {
			newTranslate = maxTranslate;
		} else {
			newTranslate = translate;
		} // Update progress

		swiper.updateProgress( newTranslate );

		if ( params.cssMode ) {
			const isH = swiper.isHorizontal();

			if ( 0 === speed ) {
				wrapperEl[ isH ? 'scrollLeft' : 'scrollTop' ] = -newTranslate;
			} else {
				if ( !swiper.support.smoothScroll ) {
					animateCSSModeScroll( {
						swiper,
						targetPosition: -newTranslate,
						side: isH ? 'left' : 'top'
					} );
					return true;
				}

				wrapperEl.scrollTo( {
					[ isH ? 'left' : 'top' ]: -newTranslate,
					behavior: 'smooth'
				} );
			}

			return true;
		}

		if ( 0 === speed ) {
			swiper.setTransition( 0 );
			swiper.setTranslate( newTranslate );

			if ( runCallbacks ) {
				swiper.emit( 'beforeTransitionStart', speed, internal );
				swiper.emit( 'transitionEnd' );
			}
		} else {
			swiper.setTransition( speed );
			swiper.setTranslate( newTranslate );

			if ( runCallbacks ) {
				swiper.emit( 'beforeTransitionStart', speed, internal );
				swiper.emit( 'transitionStart' );
			}

			if ( !swiper.animating ) {
				swiper.animating = true;

				if ( !swiper.onTranslateToWrapperTransitionEnd ) {
					swiper.onTranslateToWrapperTransitionEnd = function transitionEnd( e ) {
						if ( !swiper || swiper.destroyed ) {
							return;
						}
						if ( e.target !== this ) {
							return;
						}
						swiper.$wrapperEl[ 0 ].removeEventListener( 'transitionend', swiper.onTranslateToWrapperTransitionEnd );
						swiper.$wrapperEl[ 0 ].removeEventListener( 'webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd );
						swiper.onTranslateToWrapperTransitionEnd = null;
						delete swiper.onTranslateToWrapperTransitionEnd;

						if ( runCallbacks ) {
							swiper.emit( 'transitionEnd' );
						}
					};
				}

				swiper.$wrapperEl[ 0 ].addEventListener( 'transitionend', swiper.onTranslateToWrapperTransitionEnd );
				swiper.$wrapperEl[ 0 ].addEventListener( 'webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd );
			}
		}

		return true;
	}

	var translate = {
		getTranslate: getSwiperTranslate,
		setTranslate,
		minTranslate,
		maxTranslate,
		translateTo
	};

	function setTransition( duration, byController ) {
		const swiper = this;

		if ( !swiper.params.cssMode ) {
			swiper.$wrapperEl.transition( duration );
		}

		swiper.emit( 'setTransition', duration, byController );
	}

	function transitionEmit( _ref ) {
		const {
			swiper,
			runCallbacks,
			direction,
			step
		} = _ref;
		const {
			activeIndex,
			previousIndex
		} = swiper;
		let dir = direction;

		if ( !dir ) {
			if ( activeIndex > previousIndex ) {
				dir = 'next';
			} else if ( activeIndex < previousIndex ) {
				dir = 'prev';
			} else {
				dir = 'reset';
			}
		}

		swiper.emit( `transition${step}` );

		if ( runCallbacks && activeIndex !== previousIndex ) {
			if ( 'reset' === dir ) {
				swiper.emit( `slideResetTransition${step}` );
				return;
			}

			swiper.emit( `slideChangeTransition${step}` );

			if ( 'next' === dir ) {
				swiper.emit( `slideNextTransition${step}` );
			} else {
				swiper.emit( `slidePrevTransition${step}` );
			}
		}
	}

	function transitionStart( runCallbacks, direction ) {
		if ( runCallbacks === void 0 ) {
			runCallbacks = true;
		}

		const swiper = this;
		const {
			params
		} = swiper;
		if ( params.cssMode ) {
			return;
		}

		if ( params.autoHeight ) {
			swiper.updateAutoHeight();
		}

		transitionEmit( {
			swiper,
			runCallbacks,
			direction,
			step: 'Start'
		} );
	}

	function transitionEnd( runCallbacks, direction ) {
		if ( runCallbacks === void 0 ) {
			runCallbacks = true;
		}

		const swiper = this;
		const {
			params
		} = swiper;
		swiper.animating = false;
		if ( params.cssMode ) {
			return;
		}
		swiper.setTransition( 0 );
		transitionEmit( {
			swiper,
			runCallbacks,
			direction,
			step: 'End'
		} );
	}

	var transition = {
		setTransition,
		transitionStart,
		transitionEnd
	};

	function slideTo( index, speed, runCallbacks, internal, initial ) {
		if ( index === void 0 ) {
			index = 0;
		}

		if ( speed === void 0 ) {
			speed = this.params.speed;
		}

		if ( runCallbacks === void 0 ) {
			runCallbacks = true;
		}

		if ( 'number' !== typeof index && 'string' !== typeof index ) {
			throw new Error( `The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index}] given.` );
		}

		if ( 'string' === typeof index ) {

			/**
         * The `index` argument converted from `string` to `number`.
         * @type {number}
         */
			const indexAsNumber = parseInt( index, 10 );

			/**
         * Determines whether the `index` argument is a valid `number`
         * after being converted from the `string` type.
         * @type {boolean}
         */

			const isValidNumber = isFinite( indexAsNumber );

			if ( !isValidNumber ) {
				throw new Error( `The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.` );
			} // Knowing that the converted `index` is a valid number,
			// we can update the original argument's value.


			index = indexAsNumber;
		}

		const swiper = this;
		let slideIndex = index;
		if ( 0 > slideIndex ) {
			slideIndex = 0;
		}
		const {
			params,
			snapGrid,
			slidesGrid,
			previousIndex,
			activeIndex,
			rtlTranslate: rtl,
			wrapperEl,
			enabled
		} = swiper;

		if ( swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial ) {
			return false;
		}

		const skip = Math.min( swiper.params.slidesPerGroupSkip, slideIndex );
		let snapIndex = skip + Math.floor( ( slideIndex - skip ) / swiper.params.slidesPerGroup );
		if ( snapIndex >= snapGrid.length ) {
			snapIndex = snapGrid.length - 1;
		}
		const translate = -snapGrid[ snapIndex ]; // Normalize slideIndex

		if ( params.normalizeSlideIndex ) {
			for ( let i = 0; i < slidesGrid.length; i += 1 ) {
				const normalizedTranslate = -Math.floor( translate * 100 );
				const normalizedGrid = Math.floor( slidesGrid[ i ] * 100 );
				const normalizedGridNext = Math.floor( slidesGrid[ i + 1 ] * 100 );

				if ( 'undefined' !== typeof slidesGrid[ i + 1 ] ) {
					if ( normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - ( normalizedGridNext - normalizedGrid ) / 2 ) {
						slideIndex = i;
					} else if ( normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext ) {
						slideIndex = i + 1;
					}
				} else if ( normalizedTranslate >= normalizedGrid ) {
					slideIndex = i;
				}
			}
		} // Directions locks


		if ( swiper.initialized && slideIndex !== activeIndex ) {
			if ( !swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate() ) {
				return false;
			}

			if ( !swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate() ) {
				if ( ( activeIndex || 0 ) !== slideIndex ) {
					return false;
				}
			}
		}

		if ( slideIndex !== ( previousIndex || 0 ) && runCallbacks ) {
			swiper.emit( 'beforeSlideChangeStart' );
		} // Update progress


		swiper.updateProgress( translate );
		let direction;
		if ( slideIndex > activeIndex ) {
			direction = 'next';
		} else if ( slideIndex < activeIndex ) {
			direction = 'prev';
		} else {
			direction = 'reset';
		} // Update Index

		if ( rtl && -translate === swiper.translate || !rtl && translate === swiper.translate ) {
			swiper.updateActiveIndex( slideIndex ); // Update Height

			if ( params.autoHeight ) {
				swiper.updateAutoHeight();
			}

			swiper.updateSlidesClasses();

			if ( 'slide' !== params.effect ) {
				swiper.setTranslate( translate );
			}

			if ( 'reset' !== direction ) {
				swiper.transitionStart( runCallbacks, direction );
				swiper.transitionEnd( runCallbacks, direction );
			}

			return false;
		}

		if ( params.cssMode ) {
			const isH = swiper.isHorizontal();
			const t = rtl ? translate : -translate;

			if ( 0 === speed ) {
				const isVirtual = swiper.virtual && swiper.params.virtual.enabled;

				if ( isVirtual ) {
					swiper.wrapperEl.style.scrollSnapType = 'none';
					swiper._immediateVirtual = true;
				}

				wrapperEl[ isH ? 'scrollLeft' : 'scrollTop' ] = t;

				if ( isVirtual ) {
					requestAnimationFrame( () => {
						swiper.wrapperEl.style.scrollSnapType = '';
						swiper._swiperImmediateVirtual = false;
					} );
				}
			} else {
				if ( !swiper.support.smoothScroll ) {
					animateCSSModeScroll( {
						swiper,
						targetPosition: t,
						side: isH ? 'left' : 'top'
					} );
					return true;
				}

				wrapperEl.scrollTo( {
					[ isH ? 'left' : 'top' ]: t,
					behavior: 'smooth'
				} );
			}

			return true;
		}

		swiper.setTransition( speed );
		swiper.setTranslate( translate );
		swiper.updateActiveIndex( slideIndex );
		swiper.updateSlidesClasses();
		swiper.emit( 'beforeTransitionStart', speed, internal );
		swiper.transitionStart( runCallbacks, direction );

		if ( 0 === speed ) {
			swiper.transitionEnd( runCallbacks, direction );
		} else if ( !swiper.animating ) {
			swiper.animating = true;

			if ( !swiper.onSlideToWrapperTransitionEnd ) {
				swiper.onSlideToWrapperTransitionEnd = function transitionEnd( e ) {
					if ( !swiper || swiper.destroyed ) {
						return;
					}
					if ( e.target !== this ) {
						return;
					}
					swiper.$wrapperEl[ 0 ].removeEventListener( 'transitionend', swiper.onSlideToWrapperTransitionEnd );
					swiper.$wrapperEl[ 0 ].removeEventListener( 'webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd );
					swiper.onSlideToWrapperTransitionEnd = null;
					delete swiper.onSlideToWrapperTransitionEnd;
					swiper.transitionEnd( runCallbacks, direction );
				};
			}

			swiper.$wrapperEl[ 0 ].addEventListener( 'transitionend', swiper.onSlideToWrapperTransitionEnd );
			swiper.$wrapperEl[ 0 ].addEventListener( 'webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd );
		}

		return true;
	}

	function slideToLoop( index, speed, runCallbacks, internal ) {
		if ( index === void 0 ) {
			index = 0;
		}

		if ( speed === void 0 ) {
			speed = this.params.speed;
		}

		if ( runCallbacks === void 0 ) {
			runCallbacks = true;
		}

		if ( 'string' === typeof index ) {

			/**
         * The `index` argument converted from `string` to `number`.
         * @type {number}
         */
			const indexAsNumber = parseInt( index, 10 );

			/**
         * Determines whether the `index` argument is a valid `number`
         * after being converted from the `string` type.
         * @type {boolean}
         */

			const isValidNumber = isFinite( indexAsNumber );

			if ( !isValidNumber ) {
				throw new Error( `The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.` );
			} // Knowing that the converted `index` is a valid number,
			// we can update the original argument's value.


			index = indexAsNumber;
		}

		const swiper = this;
		let newIndex = index;

		if ( swiper.params.loop ) {
			newIndex += swiper.loopedSlides;
		}

		return swiper.slideTo( newIndex, speed, runCallbacks, internal );
	}

	/* eslint no-unused-vars: "off" */
	function slideNext( speed, runCallbacks, internal ) {
		if ( speed === void 0 ) {
			speed = this.params.speed;
		}

		if ( runCallbacks === void 0 ) {
			runCallbacks = true;
		}

		const swiper = this;
		const {
			animating,
			enabled,
			params
		} = swiper;
		if ( !enabled ) {
			return swiper;
		}
		let perGroup = params.slidesPerGroup;

		if ( 'auto' === params.slidesPerView && 1 === params.slidesPerGroup && params.slidesPerGroupAuto ) {
			perGroup = Math.max( swiper.slidesPerViewDynamic( 'current', true ), 1 );
		}

		const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;

		if ( params.loop ) {
			if ( animating && params.loopPreventsSlide ) {
				return false;
			}
			swiper.loopFix(); // eslint-disable-next-line

			swiper._clientLeft = swiper.$wrapperEl[ 0 ].clientLeft;
		}

		if ( params.rewind && swiper.isEnd ) {
			return swiper.slideTo( 0, speed, runCallbacks, internal );
		}

		return swiper.slideTo( swiper.activeIndex + increment, speed, runCallbacks, internal );
	}

	/* eslint no-unused-vars: "off" */
	function slidePrev( speed, runCallbacks, internal ) {
		if ( speed === void 0 ) {
			speed = this.params.speed;
		}

		if ( runCallbacks === void 0 ) {
			runCallbacks = true;
		}

		const swiper = this;
		const {
			params,
			animating,
			snapGrid,
			slidesGrid,
			rtlTranslate,
			enabled
		} = swiper;
		if ( !enabled ) {
			return swiper;
		}

		if ( params.loop ) {
			if ( animating && params.loopPreventsSlide ) {
				return false;
			}
			swiper.loopFix(); // eslint-disable-next-line

			swiper._clientLeft = swiper.$wrapperEl[ 0 ].clientLeft;
		}

		const translate = rtlTranslate ? swiper.translate : -swiper.translate;

		function normalize( val ) {
			if ( 0 > val ) {
				return -Math.floor( Math.abs( val ) );
			}
			return Math.floor( val );
		}

		const normalizedTranslate = normalize( translate );
		const normalizedSnapGrid = snapGrid.map( ( val ) => normalize( val ) );
		let prevSnap = snapGrid[ normalizedSnapGrid.indexOf( normalizedTranslate ) - 1 ];

		if ( 'undefined' === typeof prevSnap && params.cssMode ) {
			let prevSnapIndex;
			snapGrid.forEach( ( snap, snapIndex ) => {
				if ( normalizedTranslate >= snap ) {
					// prevSnap = snap;
					prevSnapIndex = snapIndex;
				}
			} );

			if ( 'undefined' !== typeof prevSnapIndex ) {
				prevSnap = snapGrid[ 0 < prevSnapIndex ? prevSnapIndex - 1 : prevSnapIndex ];
			}
		}

		let prevIndex = 0;

		if ( 'undefined' !== typeof prevSnap ) {
			prevIndex = slidesGrid.indexOf( prevSnap );
			if ( 0 > prevIndex ) {
				prevIndex = swiper.activeIndex - 1;
			}

			if ( 'auto' === params.slidesPerView && 1 === params.slidesPerGroup && params.slidesPerGroupAuto ) {
				prevIndex = prevIndex - swiper.slidesPerViewDynamic( 'previous', true ) + 1;
				prevIndex = Math.max( prevIndex, 0 );
			}
		}

		if ( params.rewind && swiper.isBeginning ) {
			const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
			return swiper.slideTo( lastIndex, speed, runCallbacks, internal );
		}

		return swiper.slideTo( prevIndex, speed, runCallbacks, internal );
	}

	/* eslint no-unused-vars: "off" */
	function slideReset( speed, runCallbacks, internal ) {
		if ( speed === void 0 ) {
			speed = this.params.speed;
		}

		if ( runCallbacks === void 0 ) {
			runCallbacks = true;
		}

		const swiper = this;
		return swiper.slideTo( swiper.activeIndex, speed, runCallbacks, internal );
	}

	/* eslint no-unused-vars: "off" */
	function slideToClosest( speed, runCallbacks, internal, threshold ) {
		if ( speed === void 0 ) {
			speed = this.params.speed;
		}

		if ( runCallbacks === void 0 ) {
			runCallbacks = true;
		}

		if ( threshold === void 0 ) {
			threshold = 0.5;
		}

		const swiper = this;
		let index = swiper.activeIndex;
		const skip = Math.min( swiper.params.slidesPerGroupSkip, index );
		const snapIndex = skip + Math.floor( ( index - skip ) / swiper.params.slidesPerGroup );
		const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;

		if ( translate >= swiper.snapGrid[ snapIndex ] ) {
			// The current translate is on or after the current snap index, so the choice
			// is between the current index and the one after it.
			const currentSnap = swiper.snapGrid[ snapIndex ];
			const nextSnap = swiper.snapGrid[ snapIndex + 1 ];

			if ( translate - currentSnap > ( nextSnap - currentSnap ) * threshold ) {
				index += swiper.params.slidesPerGroup;
			}
		} else {
			// The current translate is before the current snap index, so the choice
			// is between the current index and the one before it.
			const prevSnap = swiper.snapGrid[ snapIndex - 1 ];
			const currentSnap = swiper.snapGrid[ snapIndex ];

			if ( translate - prevSnap <= ( currentSnap - prevSnap ) * threshold ) {
				index -= swiper.params.slidesPerGroup;
			}
		}

		index = Math.max( index, 0 );
		index = Math.min( index, swiper.slidesGrid.length - 1 );
		return swiper.slideTo( index, speed, runCallbacks, internal );
	}

	function slideToClickedSlide() {
		const swiper = this;
		const {
			params,
			$wrapperEl
		} = swiper;
		const slidesPerView = 'auto' === params.slidesPerView ? swiper.slidesPerViewDynamic() : params.slidesPerView;
		let slideToIndex = swiper.clickedIndex;
		let realIndex;

		if ( params.loop ) {
			if ( swiper.animating ) {
				return;
			}
			realIndex = parseInt( $( swiper.clickedSlide ).attr( 'data-swiper-slide-index' ), 10 );

			if ( params.centeredSlides ) {
				if ( slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2 ) {
					swiper.loopFix();
					slideToIndex = $wrapperEl.children( `.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})` ).eq( 0 ).index();
					nextTick( () => {
						swiper.slideTo( slideToIndex );
					} );
				} else {
					swiper.slideTo( slideToIndex );
				}
			} else if ( slideToIndex > swiper.slides.length - slidesPerView ) {
				swiper.loopFix();
				slideToIndex = $wrapperEl.children( `.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})` ).eq( 0 ).index();
				nextTick( () => {
					swiper.slideTo( slideToIndex );
				} );
			} else {
				swiper.slideTo( slideToIndex );
			}
		} else {
			swiper.slideTo( slideToIndex );
		}
	}

	var slide = {
		slideTo,
		slideToLoop,
		slideNext,
		slidePrev,
		slideReset,
		slideToClosest,
		slideToClickedSlide
	};

	function loopCreate() {
		const swiper = this;
		const document = getDocument();
		const {
			params,
			$wrapperEl
		} = swiper; // Remove duplicated slides

		const $selector = 0 < $wrapperEl.children().length ? $( $wrapperEl.children()[ 0 ].parentNode ) : $wrapperEl;
		$selector.children( `.${params.slideClass}.${params.slideDuplicateClass}` ).remove();
		let slides = $selector.children( `.${params.slideClass}` );

		if ( params.loopFillGroupWithBlank ) {
			const blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;

			if ( blankSlidesNum !== params.slidesPerGroup ) {
				for ( let i = 0; i < blankSlidesNum; i += 1 ) {
					const blankNode = $( document.createElement( 'div' ) ).addClass( `${params.slideClass} ${params.slideBlankClass}` );
					$selector.append( blankNode );
				}

				slides = $selector.children( `.${params.slideClass}` );
			}
		}

		if ( 'auto' === params.slidesPerView && !params.loopedSlides ) {
			params.loopedSlides = slides.length;
		}
		swiper.loopedSlides = Math.ceil( parseFloat( params.loopedSlides || params.slidesPerView, 10 ) );
		swiper.loopedSlides += params.loopAdditionalSlides;

		if ( swiper.loopedSlides > slides.length && swiper.params.loopedSlidesLimit ) {
			swiper.loopedSlides = slides.length;
		}

		const prependSlides = [];
		const appendSlides = [];
		slides.each( ( el, index ) => {
			const slide = $( el );
			slide.attr( 'data-swiper-slide-index', index );
		} );

		for ( let i = 0; i < swiper.loopedSlides; i += 1 ) {
			const index = i - Math.floor( i / slides.length ) * slides.length;
			appendSlides.push( slides.eq( index )[ 0 ] );
			prependSlides.unshift( slides.eq( slides.length - index - 1 )[ 0 ] );
		}

		for ( let i = 0; i < appendSlides.length; i += 1 ) {
			$selector.append( $( appendSlides[ i ].cloneNode( true ) ).addClass( params.slideDuplicateClass ) );
		}

		for ( let i = prependSlides.length - 1; 0 <= i; i -= 1 ) {
			$selector.prepend( $( prependSlides[ i ].cloneNode( true ) ).addClass( params.slideDuplicateClass ) );
		}
	}

	function loopFix() {
		const swiper = this;
		swiper.emit( 'beforeLoopFix' );
		const {
			activeIndex,
			slides,
			loopedSlides,
			allowSlidePrev,
			allowSlideNext,
			snapGrid,
			rtlTranslate: rtl
		} = swiper;
		let newIndex;
		swiper.allowSlidePrev = true;
		swiper.allowSlideNext = true;
		const snapTranslate = -snapGrid[ activeIndex ];
		const diff = snapTranslate - swiper.getTranslate(); // Fix For Negative Oversliding

		if ( activeIndex < loopedSlides ) {
			newIndex = slides.length - loopedSlides * 3 + activeIndex;
			newIndex += loopedSlides;
			const slideChanged = swiper.slideTo( newIndex, 0, false, true );

			if ( slideChanged && 0 !== diff ) {
				swiper.setTranslate( ( rtl ? -swiper.translate : swiper.translate ) - diff );
			}
		} else if ( activeIndex >= slides.length - loopedSlides ) {
			// Fix For Positive Oversliding
			newIndex = -slides.length + activeIndex + loopedSlides;
			newIndex += loopedSlides;
			const slideChanged = swiper.slideTo( newIndex, 0, false, true );

			if ( slideChanged && 0 !== diff ) {
				swiper.setTranslate( ( rtl ? -swiper.translate : swiper.translate ) - diff );
			}
		}

		swiper.allowSlidePrev = allowSlidePrev;
		swiper.allowSlideNext = allowSlideNext;
		swiper.emit( 'loopFix' );
	}

	function loopDestroy() {
		const swiper = this;
		const {
			$wrapperEl,
			params,
			slides
		} = swiper;
		$wrapperEl.children( `.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}` ).remove();
		slides.removeAttr( 'data-swiper-slide-index' );
	}

	var loop = {
		loopCreate,
		loopFix,
		loopDestroy
	};

	function setGrabCursor( moving ) {
		const swiper = this;
		if ( swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode ) {
			return;
		}
		const el = 'container' === swiper.params.touchEventsTarget ? swiper.el : swiper.wrapperEl;
		el.style.cursor = 'move';
		el.style.cursor = moving ? 'grabbing' : 'grab';
	}

	function unsetGrabCursor() {
		const swiper = this;

		if ( swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode ) {
			return;
		}

		swiper[ 'container' === swiper.params.touchEventsTarget ? 'el' : 'wrapperEl' ].style.cursor = '';
	}

	var grabCursor = {
		setGrabCursor,
		unsetGrabCursor
	};

	function closestElement( selector, base ) {
		if ( base === void 0 ) {
			base = this;
		}

		function __closestFrom( el ) {
			if ( !el || el === getDocument() || el === getWindow() ) {
				return null;
			}
			if ( el.assignedSlot ) {
				el = el.assignedSlot;
			}
			const found = el.closest( selector );

			if ( !found && !el.getRootNode ) {
				return null;
			}

			return found || __closestFrom( el.getRootNode().host );
		}

		return __closestFrom( base );
	}

	function onTouchStart( event ) {
		const swiper = this;
		const document = getDocument();
		const window = getWindow();
		const data = swiper.touchEventsData;
		const {
			params,
			touches,
			enabled
		} = swiper;
		if ( !enabled ) {
			return;
		}

		if ( swiper.animating && params.preventInteractionOnTransition ) {
			return;
		}

		if ( !swiper.animating && params.cssMode && params.loop ) {
			swiper.loopFix();
		}

		let e = event;
		if ( e.originalEvent ) {
			e = e.originalEvent;
		}
		let $targetEl = $( e.target );

		if ( 'wrapper' === params.touchEventsTarget ) {
			if ( !$targetEl.closest( swiper.wrapperEl ).length ) {
				return;
			}
		}

		data.isTouchEvent = 'touchstart' === e.type;
		if ( !data.isTouchEvent && 'which' in e && 3 === e.which ) {
			return;
		}
		if ( !data.isTouchEvent && 'button' in e && 0 < e.button ) {
			return;
		}
		if ( data.isTouched && data.isMoved ) {
			return;
		} // change target el for shadow root component

		const swipingClassHasValue = !!params.noSwipingClass && '' !== params.noSwipingClass; // eslint-disable-next-line

		const eventPath = event.composedPath ? event.composedPath() : event.path;

		if ( swipingClassHasValue && e.target && e.target.shadowRoot && eventPath ) {
			$targetEl = $( eventPath[ 0 ] );
		}

		const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
		const isTargetShadow = !!( e.target && e.target.shadowRoot ); // use closestElement for shadow root element to get the actual closest for nested shadow root element

		if ( params.noSwiping && ( isTargetShadow ? closestElement( noSwipingSelector, $targetEl[ 0 ] ) : $targetEl.closest( noSwipingSelector )[ 0 ] ) ) {
			swiper.allowClick = true;
			return;
		}

		if ( params.swipeHandler ) {
			if ( !$targetEl.closest( params.swipeHandler )[ 0 ] ) {
				return;
			}
		}

		touches.currentX = 'touchstart' === e.type ? e.targetTouches[ 0 ].pageX : e.pageX;
		touches.currentY = 'touchstart' === e.type ? e.targetTouches[ 0 ].pageY : e.pageY;
		const startX = touches.currentX;
		const startY = touches.currentY; // Do NOT start if iOS edge swipe is detected. Otherwise iOS app cannot swipe-to-go-back anymore

		const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
		const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;

		if ( edgeSwipeDetection && ( startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold ) ) {
			if ( 'prevent' === edgeSwipeDetection ) {
				event.preventDefault();
			} else {
				return;
			}
		}

		Object.assign( data, {
			isTouched: true,
			isMoved: false,
			allowTouchCallbacks: true,
			isScrolling: undefined,
			startMoving: undefined
		} );
		touches.startX = startX;
		touches.startY = startY;
		data.touchStartTime = now();
		swiper.allowClick = true;
		swiper.updateSize();
		swiper.swipeDirection = undefined;
		if ( 0 < params.threshold ) {
			data.allowThresholdMove = false;
		}

		if ( 'touchstart' !== e.type ) {
			let preventDefault = true;

			if ( $targetEl.is( data.focusableElements ) ) {
				preventDefault = false;

				if ( 'SELECT' === $targetEl[ 0 ].nodeName ) {
					data.isTouched = false;
				}
			}

			if ( document.activeElement && $( document.activeElement ).is( data.focusableElements ) && document.activeElement !== $targetEl[ 0 ] ) {
				document.activeElement.blur();
			}

			const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;

			if ( ( params.touchStartForcePreventDefault || shouldPreventDefault ) && !$targetEl[ 0 ].isContentEditable ) {
				e.preventDefault();
			}
		}

		if ( swiper.params.freeMode && swiper.params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode ) {
			swiper.freeMode.onTouchStart();
		}

		swiper.emit( 'touchStart', e );
	}

	function onTouchMove( event ) {
		const document = getDocument();
		const swiper = this;
		const data = swiper.touchEventsData;
		const {
			params,
			touches,
			rtlTranslate: rtl,
			enabled
		} = swiper;
		if ( !enabled ) {
			return;
		}
		let e = event;
		if ( e.originalEvent ) {
			e = e.originalEvent;
		}

		if ( !data.isTouched ) {
			if ( data.startMoving && data.isScrolling ) {
				swiper.emit( 'touchMoveOpposite', e );
			}

			return;
		}

		if ( data.isTouchEvent && 'touchmove' !== e.type ) {
			return;
		}
		const targetTouch = 'touchmove' === e.type && e.targetTouches && ( e.targetTouches[ 0 ] || e.changedTouches[ 0 ] );
		const pageX = 'touchmove' === e.type ? targetTouch.pageX : e.pageX;
		const pageY = 'touchmove' === e.type ? targetTouch.pageY : e.pageY;

		if ( e.preventedByNestedSwiper ) {
			touches.startX = pageX;
			touches.startY = pageY;
			return;
		}

		if ( !swiper.allowTouchMove ) {
			if ( !$( e.target ).is( data.focusableElements ) ) {
				swiper.allowClick = false;
			}

			if ( data.isTouched ) {
				Object.assign( touches, {
					startX: pageX,
					startY: pageY,
					currentX: pageX,
					currentY: pageY
				} );
				data.touchStartTime = now();
			}

			return;
		}

		if ( data.isTouchEvent && params.touchReleaseOnEdges && !params.loop ) {
			if ( swiper.isVertical() ) {
				// Vertical
				if ( pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate() ) {
					data.isTouched = false;
					data.isMoved = false;
					return;
				}
			} else if ( pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate() ) {
				return;
			}
		}

		if ( data.isTouchEvent && document.activeElement ) {
			if ( e.target === document.activeElement && $( e.target ).is( data.focusableElements ) ) {
				data.isMoved = true;
				swiper.allowClick = false;
				return;
			}
		}

		if ( data.allowTouchCallbacks ) {
			swiper.emit( 'touchMove', e );
		}

		if ( e.targetTouches && 1 < e.targetTouches.length ) {
			return;
		}
		touches.currentX = pageX;
		touches.currentY = pageY;
		const diffX = touches.currentX - touches.startX;
		const diffY = touches.currentY - touches.startY;
		if ( swiper.params.threshold && Math.sqrt( diffX ** 2 + diffY ** 2 ) < swiper.params.threshold ) {
			return;
		}

		if ( 'undefined' === typeof data.isScrolling ) {
			let touchAngle;

			if ( swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX ) {
				data.isScrolling = false;
			} else {
				// eslint-disable-next-line
          if (diffX * diffX + diffY * diffY >= 25) {
					touchAngle = Math.atan2( Math.abs( diffY ), Math.abs( diffX ) ) * 180 / Math.PI;
					data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
				}
			}
		}

		if ( data.isScrolling ) {
			swiper.emit( 'touchMoveOpposite', e );
		}

		if ( 'undefined' === typeof data.startMoving ) {
			if ( touches.currentX !== touches.startX || touches.currentY !== touches.startY ) {
				data.startMoving = true;
			}
		}

		if ( data.isScrolling ) {
			data.isTouched = false;
			return;
		}

		if ( !data.startMoving ) {
			return;
		}

		swiper.allowClick = false;

		if ( !params.cssMode && e.cancelable ) {
			e.preventDefault();
		}

		if ( params.touchMoveStopPropagation && !params.nested ) {
			e.stopPropagation();
		}

		if ( !data.isMoved ) {
			if ( params.loop && !params.cssMode ) {
				swiper.loopFix();
			}

			data.startTranslate = swiper.getTranslate();
			swiper.setTransition( 0 );

			if ( swiper.animating ) {
				swiper.$wrapperEl.trigger( 'webkitTransitionEnd transitionend' );
			}

			data.allowMomentumBounce = false; // Grab Cursor

			if ( params.grabCursor && ( true === swiper.allowSlideNext || true === swiper.allowSlidePrev ) ) {
				swiper.setGrabCursor( true );
			}

			swiper.emit( 'sliderFirstMove', e );
		}

		swiper.emit( 'sliderMove', e );
		data.isMoved = true;
		let diff = swiper.isHorizontal() ? diffX : diffY;
		touches.diff = diff;
		diff *= params.touchRatio;
		if ( rtl ) {
			diff = -diff;
		}
		swiper.swipeDirection = 0 < diff ? 'prev' : 'next';
		data.currentTranslate = diff + data.startTranslate;
		let disableParentSwiper = true;
		let resistanceRatio = params.resistanceRatio;

		if ( params.touchReleaseOnEdges ) {
			resistanceRatio = 0;
		}

		if ( 0 < diff && data.currentTranslate > swiper.minTranslate() ) {
			disableParentSwiper = false;
			if ( params.resistance ) {
				data.currentTranslate = swiper.minTranslate() - 1 + ( -swiper.minTranslate() + data.startTranslate + diff ) ** resistanceRatio;
			}
		} else if ( 0 > diff && data.currentTranslate < swiper.maxTranslate() ) {
			disableParentSwiper = false;
			if ( params.resistance ) {
				data.currentTranslate = swiper.maxTranslate() + 1 - ( swiper.maxTranslate() - data.startTranslate - diff ) ** resistanceRatio;
			}
		}

		if ( disableParentSwiper ) {
			e.preventedByNestedSwiper = true;
		} // Directions locks


		if ( !swiper.allowSlideNext && 'next' === swiper.swipeDirection && data.currentTranslate < data.startTranslate ) {
			data.currentTranslate = data.startTranslate;
		}

		if ( !swiper.allowSlidePrev && 'prev' === swiper.swipeDirection && data.currentTranslate > data.startTranslate ) {
			data.currentTranslate = data.startTranslate;
		}

		if ( !swiper.allowSlidePrev && !swiper.allowSlideNext ) {
			data.currentTranslate = data.startTranslate;
		} // Threshold


		if ( 0 < params.threshold ) {
			if ( Math.abs( diff ) > params.threshold || data.allowThresholdMove ) {
				if ( !data.allowThresholdMove ) {
					data.allowThresholdMove = true;
					touches.startX = touches.currentX;
					touches.startY = touches.currentY;
					data.currentTranslate = data.startTranslate;
					touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
					return;
				}
			} else {
				data.currentTranslate = data.startTranslate;
				return;
			}
		}

		if ( !params.followFinger || params.cssMode ) {
			return;
		} // Update active index in free mode

		if ( params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress ) {
			swiper.updateActiveIndex();
			swiper.updateSlidesClasses();
		}

		if ( swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode ) {
			swiper.freeMode.onTouchMove();
		} // Update progress


		swiper.updateProgress( data.currentTranslate ); // Update translate

		swiper.setTranslate( data.currentTranslate );
	}

	function onTouchEnd( event ) {
		const swiper = this;
		const data = swiper.touchEventsData;
		const {
			params,
			touches,
			rtlTranslate: rtl,
			slidesGrid,
			enabled
		} = swiper;
		if ( !enabled ) {
			return;
		}
		let e = event;
		if ( e.originalEvent ) {
			e = e.originalEvent;
		}

		if ( data.allowTouchCallbacks ) {
			swiper.emit( 'touchEnd', e );
		}

		data.allowTouchCallbacks = false;

		if ( !data.isTouched ) {
			if ( data.isMoved && params.grabCursor ) {
				swiper.setGrabCursor( false );
			}

			data.isMoved = false;
			data.startMoving = false;
			return;
		} // Return Grab Cursor


		if ( params.grabCursor && data.isMoved && data.isTouched && ( true === swiper.allowSlideNext || true === swiper.allowSlidePrev ) ) {
			swiper.setGrabCursor( false );
		} // Time diff


		const touchEndTime = now();
		const timeDiff = touchEndTime - data.touchStartTime; // Tap, doubleTap, Click

		if ( swiper.allowClick ) {
			const pathTree = e.path || e.composedPath && e.composedPath();
			swiper.updateClickedSlide( pathTree && pathTree[ 0 ] || e.target );
			swiper.emit( 'tap click', e );

			if ( 300 > timeDiff && 300 > touchEndTime - data.lastClickTime ) {
				swiper.emit( 'doubleTap doubleClick', e );
			}
		}

		data.lastClickTime = now();
		nextTick( () => {
			if ( !swiper.destroyed ) {
				swiper.allowClick = true;
			}
		} );

		if ( !data.isTouched || !data.isMoved || !swiper.swipeDirection || 0 === touches.diff || data.currentTranslate === data.startTranslate ) {
			data.isTouched = false;
			data.isMoved = false;
			data.startMoving = false;
			return;
		}

		data.isTouched = false;
		data.isMoved = false;
		data.startMoving = false;
		let currentPos;

		if ( params.followFinger ) {
			currentPos = rtl ? swiper.translate : -swiper.translate;
		} else {
			currentPos = -data.currentTranslate;
		}

		if ( params.cssMode ) {
			return;
		}

		if ( swiper.params.freeMode && params.freeMode.enabled ) {
			swiper.freeMode.onTouchEnd( {
				currentPos
			} );
			return;
		} // Find current slide


		let stopIndex = 0;
		let groupSize = swiper.slidesSizesGrid[ 0 ];

		for ( let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup ) {
			const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

			if ( 'undefined' !== typeof slidesGrid[ i + increment ] ) {
				if ( currentPos >= slidesGrid[ i ] && currentPos < slidesGrid[ i + increment ] ) {
					stopIndex = i;
					groupSize = slidesGrid[ i + increment ] - slidesGrid[ i ];
				}
			} else if ( currentPos >= slidesGrid[ i ] ) {
				stopIndex = i;
				groupSize = slidesGrid[ slidesGrid.length - 1 ] - slidesGrid[ slidesGrid.length - 2 ];
			}
		}

		let rewindFirstIndex = null;
		let rewindLastIndex = null;

		if ( params.rewind ) {
			if ( swiper.isBeginning ) {
				rewindLastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
			} else if ( swiper.isEnd ) {
				rewindFirstIndex = 0;
			}
		} // Find current slide size


		const ratio = ( currentPos - slidesGrid[ stopIndex ] ) / groupSize;
		const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

		if ( timeDiff > params.longSwipesMs ) {
			// Long touches
			if ( !params.longSwipes ) {
				swiper.slideTo( swiper.activeIndex );
				return;
			}

			if ( 'next' === swiper.swipeDirection ) {
				if ( ratio >= params.longSwipesRatio ) {
					swiper.slideTo( params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment );
				} else {
					swiper.slideTo( stopIndex );
				}
			}

			if ( 'prev' === swiper.swipeDirection ) {
				if ( ratio > 1 - params.longSwipesRatio ) {
					swiper.slideTo( stopIndex + increment );
				} else if ( null !== rewindLastIndex && 0 > ratio && Math.abs( ratio ) > params.longSwipesRatio ) {
					swiper.slideTo( rewindLastIndex );
				} else {
					swiper.slideTo( stopIndex );
				}
			}
		} else {
			// Short swipes
			if ( !params.shortSwipes ) {
				swiper.slideTo( swiper.activeIndex );
				return;
			}

			const isNavButtonTarget = swiper.navigation && ( e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl );

			if ( !isNavButtonTarget ) {
				if ( 'next' === swiper.swipeDirection ) {
					swiper.slideTo( null !== rewindFirstIndex ? rewindFirstIndex : stopIndex + increment );
				}

				if ( 'prev' === swiper.swipeDirection ) {
					swiper.slideTo( null !== rewindLastIndex ? rewindLastIndex : stopIndex );
				}
			} else if ( e.target === swiper.navigation.nextEl ) {
				swiper.slideTo( stopIndex + increment );
			} else {
				swiper.slideTo( stopIndex );
			}
		}
	}

	function onResize() {
		const swiper = this;
		const {
			params,
			el
		} = swiper;
		if ( el && 0 === el.offsetWidth ) {
			return;
		} // Breakpoints

		if ( params.breakpoints ) {
			swiper.setBreakpoint();
		} // Save locks


		const {
			allowSlideNext,
			allowSlidePrev,
			snapGrid
		} = swiper; // Disable locks on resize

		swiper.allowSlideNext = true;
		swiper.allowSlidePrev = true;
		swiper.updateSize();
		swiper.updateSlides();
		swiper.updateSlidesClasses();

		if ( ( 'auto' === params.slidesPerView || 1 < params.slidesPerView ) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides ) {
			swiper.slideTo( swiper.slides.length - 1, 0, false, true );
		} else {
			swiper.slideTo( swiper.activeIndex, 0, false, true );
		}

		if ( swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused ) {
			swiper.autoplay.run();
		} // Return locks after resize


		swiper.allowSlidePrev = allowSlidePrev;
		swiper.allowSlideNext = allowSlideNext;

		if ( swiper.params.watchOverflow && snapGrid !== swiper.snapGrid ) {
			swiper.checkOverflow();
		}
	}

	function onClick( e ) {
		const swiper = this;
		if ( !swiper.enabled ) {
			return;
		}

		if ( !swiper.allowClick ) {
			if ( swiper.params.preventClicks ) {
				e.preventDefault();
			}

			if ( swiper.params.preventClicksPropagation && swiper.animating ) {
				e.stopPropagation();
				e.stopImmediatePropagation();
			}
		}
	}

	function onScroll() {
		const swiper = this;
		const {
			wrapperEl,
			rtlTranslate,
			enabled
		} = swiper;
		if ( !enabled ) {
			return;
		}
		swiper.previousTranslate = swiper.translate;

		if ( swiper.isHorizontal() ) {
			swiper.translate = -wrapperEl.scrollLeft;
		} else {
			swiper.translate = -wrapperEl.scrollTop;
		} // eslint-disable-next-line


		if ( 0 === swiper.translate ) {
			swiper.translate = 0;
		}
		swiper.updateActiveIndex();
		swiper.updateSlidesClasses();
		let newProgress;
		const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

		if ( 0 === translatesDiff ) {
			newProgress = 0;
		} else {
			newProgress = ( swiper.translate - swiper.minTranslate() ) / translatesDiff;
		}

		if ( newProgress !== swiper.progress ) {
			swiper.updateProgress( rtlTranslate ? -swiper.translate : swiper.translate );
		}

		swiper.emit( 'setTranslate', swiper.translate, false );
	}

	let dummyEventAttached = false;

	function dummyEventListener() {}

	const events = ( swiper, method ) => {
		const document = getDocument();
		const {
			params,
			touchEvents,
			el,
			wrapperEl,
			device,
			support
		} = swiper;
		const capture = !!params.nested;
		const domMethod = 'on' === method ? 'addEventListener' : 'removeEventListener';
		const swiperMethod = method; // Touch Events

		if ( !support.touch ) {
			el[ domMethod ]( touchEvents.start, swiper.onTouchStart, false );
			document[ domMethod ]( touchEvents.move, swiper.onTouchMove, capture );
			document[ domMethod ]( touchEvents.end, swiper.onTouchEnd, false );
		} else {
			const passiveListener = 'touchstart' === touchEvents.start && support.passiveListener && params.passiveListeners ? {
				passive: true,
				capture: false
			} : false;
			el[ domMethod ]( touchEvents.start, swiper.onTouchStart, passiveListener );
			el[ domMethod ]( touchEvents.move, swiper.onTouchMove, support.passiveListener ? {
				passive: false,
				capture
			} : capture );
			el[ domMethod ]( touchEvents.end, swiper.onTouchEnd, passiveListener );

			if ( touchEvents.cancel ) {
				el[ domMethod ]( touchEvents.cancel, swiper.onTouchEnd, passiveListener );
			}
		} // Prevent Links Clicks


		if ( params.preventClicks || params.preventClicksPropagation ) {
			el[ domMethod ]( 'click', swiper.onClick, true );
		}

		if ( params.cssMode ) {
			wrapperEl[ domMethod ]( 'scroll', swiper.onScroll );
		} // Resize handler


		if ( params.updateOnWindowResize ) {
			swiper[ swiperMethod ]( device.ios || device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate', onResize, true );
		} else {
			swiper[ swiperMethod ]( 'observerUpdate', onResize, true );
		}
	};

	function attachEvents() {
		const swiper = this;
		const document = getDocument();
		const {
			params,
			support
		} = swiper;
		swiper.onTouchStart = onTouchStart.bind( swiper );
		swiper.onTouchMove = onTouchMove.bind( swiper );
		swiper.onTouchEnd = onTouchEnd.bind( swiper );

		if ( params.cssMode ) {
			swiper.onScroll = onScroll.bind( swiper );
		}

		swiper.onClick = onClick.bind( swiper );

		if ( support.touch && !dummyEventAttached ) {
			document.addEventListener( 'touchstart', dummyEventListener );
			dummyEventAttached = true;
		}

		events( swiper, 'on' );
	}

	function detachEvents() {
		const swiper = this;
		events( swiper, 'off' );
	}

	var events$1 = {
		attachEvents,
		detachEvents
	};

	const isGridEnabled = ( swiper, params ) => swiper.grid && params.grid && 1 < params.grid.rows;

	function setBreakpoint() {
		const swiper = this;
		const {
			activeIndex,
			initialized,
			loopedSlides = 0,
			params,
			$el
		} = swiper;
		const breakpoints = params.breakpoints;
		if ( !breakpoints || breakpoints && 0 === Object.keys( breakpoints ).length ) {
			return;
		} // Get breakpoint for window width and update parameters

		const breakpoint = swiper.getBreakpoint( breakpoints, swiper.params.breakpointsBase, swiper.el );
		if ( !breakpoint || swiper.currentBreakpoint === breakpoint ) {
			return;
		}
		const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[ breakpoint ] : undefined;
		const breakpointParams = breakpointOnlyParams || swiper.originalParams;
		const wasMultiRow = isGridEnabled( swiper, params );
		const isMultiRow = isGridEnabled( swiper, breakpointParams );
		const wasEnabled = params.enabled;

		if ( wasMultiRow && !isMultiRow ) {
			$el.removeClass( `${params.containerModifierClass}grid ${params.containerModifierClass}grid-column` );
			swiper.emitContainerClasses();
		} else if ( !wasMultiRow && isMultiRow ) {
			$el.addClass( `${params.containerModifierClass}grid` );

			if ( breakpointParams.grid.fill && 'column' === breakpointParams.grid.fill || !breakpointParams.grid.fill && 'column' === params.grid.fill ) {
				$el.addClass( `${params.containerModifierClass}grid-column` );
			}

			swiper.emitContainerClasses();
		} // Toggle navigation, pagination, scrollbar


		[ 'navigation', 'pagination', 'scrollbar' ].forEach( ( prop ) => {
			const wasModuleEnabled = params[ prop ] && params[ prop ].enabled;
			const isModuleEnabled = breakpointParams[ prop ] && breakpointParams[ prop ].enabled;

			if ( wasModuleEnabled && !isModuleEnabled ) {
				swiper[ prop ].disable();
			}

			if ( !wasModuleEnabled && isModuleEnabled ) {
				swiper[ prop ].enable();
			}
		} );
		const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
		const needsReLoop = params.loop && ( breakpointParams.slidesPerView !== params.slidesPerView || directionChanged );

		if ( directionChanged && initialized ) {
			swiper.changeDirection();
		}

		extend( swiper.params, breakpointParams );
		const isEnabled = swiper.params.enabled;
		Object.assign( swiper, {
			allowTouchMove: swiper.params.allowTouchMove,
			allowSlideNext: swiper.params.allowSlideNext,
			allowSlidePrev: swiper.params.allowSlidePrev
		} );

		if ( wasEnabled && !isEnabled ) {
			swiper.disable();
		} else if ( !wasEnabled && isEnabled ) {
			swiper.enable();
		}

		swiper.currentBreakpoint = breakpoint;
		swiper.emit( '_beforeBreakpoint', breakpointParams );

		if ( needsReLoop && initialized ) {
			swiper.loopDestroy();
			swiper.loopCreate();
			swiper.updateSlides();
			swiper.slideTo( activeIndex - loopedSlides + swiper.loopedSlides, 0, false );
		}

		swiper.emit( 'breakpoint', breakpointParams );
	}

	function getBreakpoint( breakpoints, base, containerEl ) {
		if ( base === void 0 ) {
			base = 'window';
		}

		if ( !breakpoints || 'container' === base && !containerEl ) {
			return undefined;
		}
		let breakpoint = false;
		const window = getWindow();
		const currentHeight = 'window' === base ? window.innerHeight : containerEl.clientHeight;
		const points = Object.keys( breakpoints ).map( ( point ) => {
			if ( 'string' === typeof point && 0 === point.indexOf( '@' ) ) {
				const minRatio = parseFloat( point.substr( 1 ) );
				const value = currentHeight * minRatio;
				return {
					value,
					point
				};
			}

			return {
				value: point,
				point
			};
		} );
		points.sort( ( a, b ) => parseInt( a.value, 10 ) - parseInt( b.value, 10 ) );

		for ( let i = 0; i < points.length; i += 1 ) {
			const {
				point,
				value
			} = points[ i ];

			if ( 'window' === base ) {
				if ( window.matchMedia( `(min-width: ${value}px)` ).matches ) {
					breakpoint = point;
				}
			} else if ( value <= containerEl.clientWidth ) {
				breakpoint = point;
			}
		}

		return breakpoint || 'max';
	}

	var breakpoints = {
		setBreakpoint,
		getBreakpoint
	};

	function prepareClasses( entries, prefix ) {
		const resultClasses = [];
		entries.forEach( ( item ) => {
			if ( 'object' === typeof item ) {
				Object.keys( item ).forEach( ( classNames ) => {
					if ( item[ classNames ] ) {
						resultClasses.push( prefix + classNames );
					}
				} );
			} else if ( 'string' === typeof item ) {
				resultClasses.push( prefix + item );
			}
		} );
		return resultClasses;
	}

	function addClasses() {
		const swiper = this;
		const {
			classNames,
			params,
			rtl,
			$el,
			device,
			support
		} = swiper; // prettier-ignore

		const suffixes = prepareClasses( [
			'initialized', params.direction, {
				'pointer-events': !support.touch
			}, {
				'free-mode': swiper.params.freeMode && params.freeMode.enabled
			}, {
				'autoheight': params.autoHeight
			}, {
				'rtl': rtl
			}, {
				'grid': params.grid && 1 < params.grid.rows
			}, {
				'grid-column': params.grid && 1 < params.grid.rows && 'column' === params.grid.fill
			}, {
				'android': device.android
			}, {
				'ios': device.ios
			}, {
				'css-mode': params.cssMode
			}, {
				'centered': params.cssMode && params.centeredSlides
			}, {
				'watch-progress': params.watchSlidesProgress
			}
		], params.containerModifierClass );
		classNames.push( ...suffixes );
		$el.addClass( [ ...classNames ].join( ' ' ) );
		swiper.emitContainerClasses();
	}

	function removeClasses() {
		const swiper = this;
		const {
			$el,
			classNames
		} = swiper;
		$el.removeClass( classNames.join( ' ' ) );
		swiper.emitContainerClasses();
	}

	var classes = {
		addClasses,
		removeClasses
	};

	function loadImage( imageEl, src, srcset, sizes, checkForComplete, callback ) {
		const window = getWindow();
		let image;

		function onReady() {
			if ( callback ) {
				callback();
			}
		}

		const isPicture = $( imageEl ).parent( 'picture' )[ 0 ];

		if ( !isPicture && ( !imageEl.complete || !checkForComplete ) ) {
			if ( src ) {
				image = new window.Image();
				image.onload = onReady;
				image.onerror = onReady;

				if ( sizes ) {
					image.sizes = sizes;
				}

				if ( srcset ) {
					image.srcset = srcset;
				}

				if ( src ) {
					image.src = src;
				}
			} else {
				onReady();
			}
		} else {
			// image already loaded...
			onReady();
		}
	}

	function preloadImages() {
		const swiper = this;
		swiper.imagesToLoad = swiper.$el.find( 'img' );

		function onReady() {
			if ( 'undefined' === typeof swiper || null === swiper || !swiper || swiper.destroyed ) {
				return;
			}
			if ( swiper.imagesLoaded !== undefined ) {
				swiper.imagesLoaded += 1;
			}

			if ( swiper.imagesLoaded === swiper.imagesToLoad.length ) {
				if ( swiper.params.updateOnImagesReady ) {
					swiper.update();
				}
				swiper.emit( 'imagesReady' );
			}
		}

		for ( let i = 0; i < swiper.imagesToLoad.length; i += 1 ) {
			const imageEl = swiper.imagesToLoad[ i ];
			swiper.loadImage( imageEl, imageEl.currentSrc || imageEl.getAttribute( 'src' ), imageEl.srcset || imageEl.getAttribute( 'srcset' ), imageEl.sizes || imageEl.getAttribute( 'sizes' ), true, onReady );
		}
	}

	var images = {
		loadImage,
		preloadImages
	};

	function checkOverflow() {
		const swiper = this;
		const {
			isLocked: wasLocked,
			params
		} = swiper;
		const {
			slidesOffsetBefore
		} = params;

		if ( slidesOffsetBefore ) {
			const lastSlideIndex = swiper.slides.length - 1;
			const lastSlideRightEdge = swiper.slidesGrid[ lastSlideIndex ] + swiper.slidesSizesGrid[ lastSlideIndex ] + slidesOffsetBefore * 2;
			swiper.isLocked = swiper.size > lastSlideRightEdge;
		} else {
			swiper.isLocked = 1 === swiper.snapGrid.length;
		}

		if ( true === params.allowSlideNext ) {
			swiper.allowSlideNext = !swiper.isLocked;
		}

		if ( true === params.allowSlidePrev ) {
			swiper.allowSlidePrev = !swiper.isLocked;
		}

		if ( wasLocked && wasLocked !== swiper.isLocked ) {
			swiper.isEnd = false;
		}

		if ( wasLocked !== swiper.isLocked ) {
			swiper.emit( swiper.isLocked ? 'lock' : 'unlock' );
		}
	}

	var checkOverflow$1 = {
		checkOverflow
	};

	var defaults = {
		init: true,
		direction: 'horizontal',
		touchEventsTarget: 'wrapper',
		initialSlide: 0,
		speed: 300,
		cssMode: false,
		updateOnWindowResize: true,
		resizeObserver: true,
		nested: false,
		createElements: false,
		enabled: true,
		focusableElements: 'input, select, option, textarea, button, video, label',
		// Overrides
		width: null,
		height: null,
		//
		preventInteractionOnTransition: false,
		// ssr
		userAgent: null,
		url: null,
		// To support iOS's swipe-to-go-back gesture (when being used in-app).
		edgeSwipeDetection: false,
		edgeSwipeThreshold: 20,
		// Autoheight
		autoHeight: false,
		// Set wrapper width
		setWrapperSize: false,
		// Virtual Translate
		virtualTranslate: false,
		// Effects
		effect: 'slide',
		// 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
		// Breakpoints
		breakpoints: undefined,
		breakpointsBase: 'window',
		// Slides grid
		spaceBetween: 0,
		slidesPerView: 1,
		slidesPerGroup: 1,
		slidesPerGroupSkip: 0,
		slidesPerGroupAuto: false,
		centeredSlides: false,
		centeredSlidesBounds: false,
		slidesOffsetBefore: 0,
		// in px
		slidesOffsetAfter: 0,
		// in px
		normalizeSlideIndex: true,
		centerInsufficientSlides: false,
		// Disable swiper and hide navigation when container not overflow
		watchOverflow: true,
		// Round length
		roundLengths: false,
		// Touches
		touchRatio: 1,
		touchAngle: 45,
		simulateTouch: true,
		shortSwipes: true,
		longSwipes: true,
		longSwipesRatio: 0.5,
		longSwipesMs: 300,
		followFinger: true,
		allowTouchMove: true,
		threshold: 0,
		touchMoveStopPropagation: false,
		touchStartPreventDefault: true,
		touchStartForcePreventDefault: false,
		touchReleaseOnEdges: false,
		// Unique Navigation Elements
		uniqueNavElements: true,
		// Resistance
		resistance: true,
		resistanceRatio: 0.85,
		// Progress
		watchSlidesProgress: false,
		// Cursor
		grabCursor: false,
		// Clicks
		preventClicks: true,
		preventClicksPropagation: true,
		slideToClickedSlide: false,
		// Images
		preloadImages: true,
		updateOnImagesReady: true,
		// loop
		loop: false,
		loopAdditionalSlides: 0,
		loopedSlides: null,
		loopedSlidesLimit: true,
		loopFillGroupWithBlank: false,
		loopPreventsSlide: true,
		// rewind
		rewind: false,
		// Swiping/no swiping
		allowSlidePrev: true,
		allowSlideNext: true,
		swipeHandler: null,
		// '.swipe-handler',
		noSwiping: true,
		noSwipingClass: 'swiper-no-swiping',
		noSwipingSelector: null,
		// Passive Listeners
		passiveListeners: true,
		maxBackfaceHiddenSlides: 10,
		// NS
		containerModifierClass: 'swiper-',
		// NEW
		slideClass: 'swiper-slide',
		slideBlankClass: 'swiper-slide-invisible-blank',
		slideActiveClass: 'swiper-slide-active',
		slideDuplicateActiveClass: 'swiper-slide-duplicate-active',
		slideVisibleClass: 'swiper-slide-visible',
		slideDuplicateClass: 'swiper-slide-duplicate',
		slideNextClass: 'swiper-slide-next',
		slideDuplicateNextClass: 'swiper-slide-duplicate-next',
		slidePrevClass: 'swiper-slide-prev',
		slideDuplicatePrevClass: 'swiper-slide-duplicate-prev',
		wrapperClass: 'swiper-wrapper',
		// Callbacks
		runCallbacksOnInit: true,
		// Internals
		_emitClasses: false
	};

	function moduleExtendParams( params, allModulesParams ) {
		return function extendParams( obj ) {
			if ( obj === void 0 ) {
				obj = {};
			}

			const moduleParamName = Object.keys( obj )[ 0 ];
			const moduleParams = obj[ moduleParamName ];

			if ( 'object' !== typeof moduleParams || null === moduleParams ) {
				extend( allModulesParams, obj );
				return;
			}

			if ( 0 <= [ 'navigation', 'pagination', 'scrollbar' ].indexOf( moduleParamName ) && true === params[ moduleParamName ] ) {
				params[ moduleParamName ] = {
					auto: true
				};
			}

			if ( !( moduleParamName in params && 'enabled' in moduleParams ) ) {
				extend( allModulesParams, obj );
				return;
			}

			if ( true === params[ moduleParamName ] ) {
				params[ moduleParamName ] = {
					enabled: true
				};
			}

			if ( 'object' === typeof params[ moduleParamName ] && !( 'enabled' in params[ moduleParamName ] ) ) {
				params[ moduleParamName ].enabled = true;
			}

			if ( !params[ moduleParamName ] ) {
				params[ moduleParamName ] = {
					enabled: false
				};
			}
			extend( allModulesParams, obj );
		};
	}

	/* eslint no-param-reassign: "off" */
	const prototypes = {
		eventsEmitter,
		update,
		translate,
		transition,
		slide,
		loop,
		grabCursor,
		events: events$1,
		breakpoints,
		checkOverflow: checkOverflow$1,
		classes,
		images
	};
	const extendedDefaults = {};

	class Swiper {
		constructor() {
			let el;
			let params;

			for ( var _len = arguments.length, args = new Array( _len ), _key = 0; _key < _len; _key++ ) {
				args[ _key ] = arguments[ _key ];
			}

			if ( 1 === args.length && args[ 0 ].constructor && 'Object' === Object.prototype.toString.call( args[ 0 ] ).slice( 8, -1 ) ) {
				params = args[ 0 ];
			} else {
				[ el, params ] = args;
			}

			if ( !params ) {
				params = {};
			}
			params = extend( {}, params );
			if ( el && !params.el ) {
				params.el = el;
			}

			if ( params.el && 1 < $( params.el ).length ) {
				const swipers = [];
				$( params.el ).each( ( containerEl ) => {
					const newParams = extend( {}, params, {
						el: containerEl
					} );
					swipers.push( new Swiper( newParams ) );
				} ); // eslint-disable-next-line no-constructor-return

				return swipers;
			} // Swiper Instance


			const swiper = this;
			swiper.__swiper__ = true;
			swiper.support = getSupport();
			swiper.device = getDevice( {
				userAgent: params.userAgent
			} );
			swiper.browser = getBrowser();
			swiper.eventsListeners = {};
			swiper.eventsAnyListeners = [];
			swiper.modules = [ ...swiper.__modules__ ];

			if ( params.modules && Array.isArray( params.modules ) ) {
				swiper.modules.push( ...params.modules );
			}

			const allModulesParams = {};
			swiper.modules.forEach( ( mod ) => {
				mod( {
					swiper,
					extendParams: moduleExtendParams( params, allModulesParams ),
					on: swiper.on.bind( swiper ),
					once: swiper.once.bind( swiper ),
					off: swiper.off.bind( swiper ),
					emit: swiper.emit.bind( swiper )
				} );
			} ); // Extend defaults with modules params

			const swiperParams = extend( {}, defaults, allModulesParams ); // Extend defaults with passed params

			swiper.params = extend( {}, swiperParams, extendedDefaults, params );
			swiper.originalParams = extend( {}, swiper.params );
			swiper.passedParams = extend( {}, params ); // add event listeners

			if ( swiper.params && swiper.params.on ) {
				Object.keys( swiper.params.on ).forEach( ( eventName ) => {
					swiper.on( eventName, swiper.params.on[ eventName ] );
				} );
			}

			if ( swiper.params && swiper.params.onAny ) {
				swiper.onAny( swiper.params.onAny );
			} // Save Dom lib


			swiper.$ = $; // Extend Swiper

			Object.assign( swiper, {
				enabled: swiper.params.enabled,
				el,
				// Classes
				classNames: [],
				// Slides
				slides: $(),
				slidesGrid: [],
				snapGrid: [],
				slidesSizesGrid: [],

				// isDirection
				isHorizontal() {
					return 'horizontal' === swiper.params.direction;
				},

				isVertical() {
					return 'vertical' === swiper.params.direction;
				},

				// Indexes
				activeIndex: 0,
				realIndex: 0,
				//
				isBeginning: true,
				isEnd: false,
				// Props
				translate: 0,
				previousTranslate: 0,
				progress: 0,
				velocity: 0,
				animating: false,
				// Locks
				allowSlideNext: swiper.params.allowSlideNext,
				allowSlidePrev: swiper.params.allowSlidePrev,
				// Touch Events
				touchEvents: ( function touchEvents() {
					const touch = [ 'touchstart', 'touchmove', 'touchend', 'touchcancel' ];
					const desktop = [ 'pointerdown', 'pointermove', 'pointerup' ];
					swiper.touchEventsTouch = {
						start: touch[ 0 ],
						move: touch[ 1 ],
						end: touch[ 2 ],
						cancel: touch[ 3 ]
					};
					swiper.touchEventsDesktop = {
						start: desktop[ 0 ],
						move: desktop[ 1 ],
						end: desktop[ 2 ]
					};
					return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
				}() ),
				touchEventsData: {
					isTouched: undefined,
					isMoved: undefined,
					allowTouchCallbacks: undefined,
					touchStartTime: undefined,
					isScrolling: undefined,
					currentTranslate: undefined,
					startTranslate: undefined,
					allowThresholdMove: undefined,
					// Form elements to match
					focusableElements: swiper.params.focusableElements,
					// Last click time
					lastClickTime: now(),
					clickTimeout: undefined,
					// Velocities
					velocities: [],
					allowMomentumBounce: undefined,
					isTouchEvent: undefined,
					startMoving: undefined
				},
				// Clicks
				allowClick: true,
				// Touches
				allowTouchMove: swiper.params.allowTouchMove,
				touches: {
					startX: 0,
					startY: 0,
					currentX: 0,
					currentY: 0,
					diff: 0
				},
				// Images
				imagesToLoad: [],
				imagesLoaded: 0
			} );
			swiper.emit( '_swiper' ); // Init

			if ( swiper.params.init ) {
				swiper.init();
			} // Return app instance
			// eslint-disable-next-line no-constructor-return


			return swiper;
		}

		enable() {
			const swiper = this;
			if ( swiper.enabled ) {
				return;
			}
			swiper.enabled = true;

			if ( swiper.params.grabCursor ) {
				swiper.setGrabCursor();
			}

			swiper.emit( 'enable' );
		}

		disable() {
			const swiper = this;
			if ( !swiper.enabled ) {
				return;
			}
			swiper.enabled = false;

			if ( swiper.params.grabCursor ) {
				swiper.unsetGrabCursor();
			}

			swiper.emit( 'disable' );
		}

		setProgress( progress, speed ) {
			const swiper = this;
			progress = Math.min( Math.max( progress, 0 ), 1 );
			const min = swiper.minTranslate();
			const max = swiper.maxTranslate();
			const current = ( max - min ) * progress + min;
			swiper.translateTo( current, 'undefined' === typeof speed ? 0 : speed );
			swiper.updateActiveIndex();
			swiper.updateSlidesClasses();
		}

		emitContainerClasses() {
			const swiper = this;
			if ( !swiper.params._emitClasses || !swiper.el ) {
				return;
			}
			const cls = swiper.el.className.split( ' ' ).filter( ( className ) => 0 === className.indexOf( 'swiper' ) || 0 === className.indexOf( swiper.params.containerModifierClass ) );
			swiper.emit( '_containerClasses', cls.join( ' ' ) );
		}

		getSlideClasses( slideEl ) {
			const swiper = this;
			if ( swiper.destroyed ) {
				return '';
			}
			return slideEl.className.split( ' ' ).filter( ( className ) => 0 === className.indexOf( 'swiper-slide' ) || 0 === className.indexOf( swiper.params.slideClass ) ).join( ' ' );
		}

		emitSlidesClasses() {
			const swiper = this;
			if ( !swiper.params._emitClasses || !swiper.el ) {
				return;
			}
			const updates = [];
			swiper.slides.each( ( slideEl ) => {
				const classNames = swiper.getSlideClasses( slideEl );
				updates.push( {
					slideEl,
					classNames
				} );
				swiper.emit( '_slideClass', slideEl, classNames );
			} );
			swiper.emit( '_slideClasses', updates );
		}

		slidesPerViewDynamic( view, exact ) {
			if ( view === void 0 ) {
				view = 'current';
			}

			if ( exact === void 0 ) {
				exact = false;
			}

			const swiper = this;
			const {
				params,
				slides,
				slidesGrid,
				slidesSizesGrid,
				size: swiperSize,
				activeIndex
			} = swiper;
			let spv = 1;

			if ( params.centeredSlides ) {
				let slideSize = slides[ activeIndex ].swiperSlideSize;
				let breakLoop;

				for ( let i = activeIndex + 1; i < slides.length; i += 1 ) {
					if ( slides[ i ] && !breakLoop ) {
						slideSize += slides[ i ].swiperSlideSize;
						spv += 1;
						if ( slideSize > swiperSize ) {
							breakLoop = true;
						}
					}
				}

				for ( let i = activeIndex - 1; 0 <= i; i -= 1 ) {
					if ( slides[ i ] && !breakLoop ) {
						slideSize += slides[ i ].swiperSlideSize;
						spv += 1;
						if ( slideSize > swiperSize ) {
							breakLoop = true;
						}
					}
				}
			} else {
				// eslint-disable-next-line
          if (view === 'current') {
					for ( let i = activeIndex + 1; i < slides.length; i += 1 ) {
						const slideInView = exact ? slidesGrid[ i ] + slidesSizesGrid[ i ] - slidesGrid[ activeIndex ] < swiperSize : slidesGrid[ i ] - slidesGrid[ activeIndex ] < swiperSize;

						if ( slideInView ) {
							spv += 1;
						}
					}
				} else {
					// previous
					for ( let i = activeIndex - 1; 0 <= i; i -= 1 ) {
						const slideInView = slidesGrid[ activeIndex ] - slidesGrid[ i ] < swiperSize;

						if ( slideInView ) {
							spv += 1;
						}
					}
				}
			}

			return spv;
		}

		update() {
			const swiper = this;
			if ( !swiper || swiper.destroyed ) {
				return;
			}
			const {
				snapGrid,
				params
			} = swiper; // Breakpoints

			if ( params.breakpoints ) {
				swiper.setBreakpoint();
			}

			swiper.updateSize();
			swiper.updateSlides();
			swiper.updateProgress();
			swiper.updateSlidesClasses();

			function setTranslate() {
				const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
				const newTranslate = Math.min( Math.max( translateValue, swiper.maxTranslate() ), swiper.minTranslate() );
				swiper.setTranslate( newTranslate );
				swiper.updateActiveIndex();
				swiper.updateSlidesClasses();
			}

			let translated;

			if ( swiper.params.freeMode && swiper.params.freeMode.enabled ) {
				setTranslate();

				if ( swiper.params.autoHeight ) {
					swiper.updateAutoHeight();
				}
			} else {
				if ( ( 'auto' === swiper.params.slidesPerView || 1 < swiper.params.slidesPerView ) && swiper.isEnd && !swiper.params.centeredSlides ) {
					translated = swiper.slideTo( swiper.slides.length - 1, 0, false, true );
				} else {
					translated = swiper.slideTo( swiper.activeIndex, 0, false, true );
				}

				if ( !translated ) {
					setTranslate();
				}
			}

			if ( params.watchOverflow && snapGrid !== swiper.snapGrid ) {
				swiper.checkOverflow();
			}

			swiper.emit( 'update' );
		}

		changeDirection( newDirection, needUpdate ) {
			if ( needUpdate === void 0 ) {
				needUpdate = true;
			}

			const swiper = this;
			const currentDirection = swiper.params.direction;

			if ( !newDirection ) {
				// eslint-disable-next-line
          newDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
			}

			if ( newDirection === currentDirection || 'horizontal' !== newDirection && 'vertical' !== newDirection ) {
				return swiper;
			}

			swiper.$el.removeClass( `${swiper.params.containerModifierClass}${currentDirection}` ).addClass( `${swiper.params.containerModifierClass}${newDirection}` );
			swiper.emitContainerClasses();
			swiper.params.direction = newDirection;
			swiper.slides.each( ( slideEl ) => {
				if ( 'vertical' === newDirection ) {
					slideEl.style.width = '';
				} else {
					slideEl.style.height = '';
				}
			} );
			swiper.emit( 'changeDirection' );
			if ( needUpdate ) {
				swiper.update();
			}
			return swiper;
		}

		changeLanguageDirection( direction ) {
			const swiper = this;
			if ( swiper.rtl && 'rtl' === direction || !swiper.rtl && 'ltr' === direction ) {
				return;
			}
			swiper.rtl = 'rtl' === direction;
			swiper.rtlTranslate = 'horizontal' === swiper.params.direction && swiper.rtl;

			if ( swiper.rtl ) {
				swiper.$el.addClass( `${swiper.params.containerModifierClass}rtl` );
				swiper.el.dir = 'rtl';
			} else {
				swiper.$el.removeClass( `${swiper.params.containerModifierClass}rtl` );
				swiper.el.dir = 'ltr';
			}

			swiper.update();
		}

		mount( el ) {
			const swiper = this;
			if ( swiper.mounted ) {
				return true;
			} // Find el

			const $el = $( el || swiper.params.el );
			el = $el[ 0 ];

			if ( !el ) {
				return false;
			}

			el.swiper = swiper;

			const getWrapperSelector = () => `.${( swiper.params.wrapperClass || '' ).trim().split( ' ' ).join( '.' )}`;

			const getWrapper = () => {
				if ( el && el.shadowRoot && el.shadowRoot.querySelector ) {
					const res = $( el.shadowRoot.querySelector( getWrapperSelector() ) ); // Children needs to return slot items

					res.children = ( options ) => $el.children( options );

					return res;
				}

				if ( !$el.children ) {
					return $( $el ).children( getWrapperSelector() );
				}

				return $el.children( getWrapperSelector() );
			}; // Find Wrapper


			let $wrapperEl = getWrapper();

			if ( 0 === $wrapperEl.length && swiper.params.createElements ) {
				const document = getDocument();
				const wrapper = document.createElement( 'div' );
				$wrapperEl = $( wrapper );
				wrapper.className = swiper.params.wrapperClass;
				$el.append( wrapper );
				$el.children( `.${swiper.params.slideClass}` ).each( ( slideEl ) => {
					$wrapperEl.append( slideEl );
				} );
			}

			Object.assign( swiper, {
				$el,
				el,
				$wrapperEl,
				wrapperEl: $wrapperEl[ 0 ],
				mounted: true,
				// RTL
				rtl: 'rtl' === el.dir.toLowerCase() || 'rtl' === $el.css( 'direction' ),
				rtlTranslate: 'horizontal' === swiper.params.direction && ( 'rtl' === el.dir.toLowerCase() || 'rtl' === $el.css( 'direction' ) ),
				wrongRTL: '-webkit-box' === $wrapperEl.css( 'display' )
			} );
			return true;
		}

		init( el ) {
			const swiper = this;
			if ( swiper.initialized ) {
				return swiper;
			}
			const mounted = swiper.mount( el );
			if ( false === mounted ) {
				return swiper;
			}
			swiper.emit( 'beforeInit' ); // Set breakpoint

			if ( swiper.params.breakpoints ) {
				swiper.setBreakpoint();
			} // Add Classes


			swiper.addClasses(); // Create loop

			if ( swiper.params.loop ) {
				swiper.loopCreate();
			} // Update size


			swiper.updateSize(); // Update slides

			swiper.updateSlides();

			if ( swiper.params.watchOverflow ) {
				swiper.checkOverflow();
			} // Set Grab Cursor


			if ( swiper.params.grabCursor && swiper.enabled ) {
				swiper.setGrabCursor();
			}

			if ( swiper.params.preloadImages ) {
				swiper.preloadImages();
			} // Slide To Initial Slide


			if ( swiper.params.loop ) {
				swiper.slideTo( swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit, false, true );
			} else {
				swiper.slideTo( swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true );
			} // Attach events


			swiper.attachEvents(); // Init Flag

			swiper.initialized = true; // Emit

			swiper.emit( 'init' );
			swiper.emit( 'afterInit' );
			return swiper;
		}

		destroy( deleteInstance, cleanStyles ) {
			if ( deleteInstance === void 0 ) {
				deleteInstance = true;
			}

			if ( cleanStyles === void 0 ) {
				cleanStyles = true;
			}

			const swiper = this;
			const {
				params,
				$el,
				$wrapperEl,
				slides
			} = swiper;

			if ( 'undefined' === typeof swiper.params || swiper.destroyed ) {
				return null;
			}

			swiper.emit( 'beforeDestroy' ); // Init Flag

			swiper.initialized = false; // Detach events

			swiper.detachEvents(); // Destroy loop

			if ( params.loop ) {
				swiper.loopDestroy();
			} // Cleanup styles


			if ( cleanStyles ) {
				swiper.removeClasses();
				$el.removeAttr( 'style' );
				$wrapperEl.removeAttr( 'style' );

				if ( slides && slides.length ) {
					slides.removeClass( [ params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass ].join( ' ' ) ).removeAttr( 'style' ).removeAttr( 'data-swiper-slide-index' );
				}
			}

			swiper.emit( 'destroy' ); // Detach emitter events

			Object.keys( swiper.eventsListeners ).forEach( ( eventName ) => {
				swiper.off( eventName );
			} );

			if ( false !== deleteInstance ) {
				swiper.$el[ 0 ].swiper = null;
				deleteProps( swiper );
			}

			swiper.destroyed = true;
			return null;
		}

		static extendDefaults( newDefaults ) {
			extend( extendedDefaults, newDefaults );
		}

		static get extendedDefaults() {
			return extendedDefaults;
		}

		static get defaults() {
			return defaults;
		}

		static installModule( mod ) {
			if ( !Swiper.prototype.__modules__ ) {
				Swiper.prototype.__modules__ = [];
			}
			const modules = Swiper.prototype.__modules__;

			if ( 'function' === typeof mod && 0 > modules.indexOf( mod ) ) {
				modules.push( mod );
			}
		}

		static use( module ) {
			if ( Array.isArray( module ) ) {
				module.forEach( ( m ) => Swiper.installModule( m ) );
				return Swiper;
			}

			Swiper.installModule( module );
			return Swiper;
		}

	}

	Object.keys( prototypes ).forEach( ( prototypeGroup ) => {
		Object.keys( prototypes[ prototypeGroup ] ).forEach( ( protoMethod ) => {
			Swiper.prototype[ protoMethod ] = prototypes[ prototypeGroup ][ protoMethod ];
		} );
	} );
	Swiper.use( [ Resize, Observer ] );

	/* eslint-disable consistent-return */
	function Keyboard( _ref ) {
		const {
			swiper,
			extendParams,
			on,
			emit
		} = _ref;
		const document = getDocument();
		const window = getWindow();
		swiper.keyboard = {
			enabled: false
		};
		extendParams( {
			keyboard: {
				enabled: false,
				onlyInViewport: true,
				pageUpDown: true
			}
		} );

		function handle( event ) {
			if ( !swiper.enabled ) {
				return;
			}
			const {
				rtlTranslate: rtl
			} = swiper;
			let e = event;
			if ( e.originalEvent ) {
				e = e.originalEvent;
			} // jquery fix

			const kc = e.keyCode || e.charCode;
			const pageUpDown = swiper.params.keyboard.pageUpDown;
			const isPageUp = pageUpDown && 33 === kc;
			const isPageDown = pageUpDown && 34 === kc;
			const isArrowLeft = 37 === kc;
			const isArrowRight = 39 === kc;
			const isArrowUp = 38 === kc;
			const isArrowDown = 40 === kc; // Directions locks

			if ( !swiper.allowSlideNext && ( swiper.isHorizontal() && isArrowRight || swiper.isVertical() && isArrowDown || isPageDown ) ) {
				return false;
			}

			if ( !swiper.allowSlidePrev && ( swiper.isHorizontal() && isArrowLeft || swiper.isVertical() && isArrowUp || isPageUp ) ) {
				return false;
			}

			if ( e.shiftKey || e.altKey || e.ctrlKey || e.metaKey ) {
				return undefined;
			}

			if ( document.activeElement && document.activeElement.nodeName && ( 'input' === document.activeElement.nodeName.toLowerCase() || 'textarea' === document.activeElement.nodeName.toLowerCase() ) ) {
				return undefined;
			}

			if ( swiper.params.keyboard.onlyInViewport && ( isPageUp || isPageDown || isArrowLeft || isArrowRight || isArrowUp || isArrowDown ) ) {
				let inView = false; // Check that swiper should be inside of visible area of window

				if ( 0 < swiper.$el.parents( `.${swiper.params.slideClass}` ).length && 0 === swiper.$el.parents( `.${swiper.params.slideActiveClass}` ).length ) {
					return undefined;
				}

				const $el = swiper.$el;
				const swiperWidth = $el[ 0 ].clientWidth;
				const swiperHeight = $el[ 0 ].clientHeight;
				const windowWidth = window.innerWidth;
				const windowHeight = window.innerHeight;
				const swiperOffset = swiper.$el.offset();
				if ( rtl ) {
					swiperOffset.left -= swiper.$el[ 0 ].scrollLeft;
				}
				const swiperCoord = [ [ swiperOffset.left, swiperOffset.top ], [ swiperOffset.left + swiperWidth, swiperOffset.top ], [ swiperOffset.left, swiperOffset.top + swiperHeight ], [ swiperOffset.left + swiperWidth, swiperOffset.top + swiperHeight ] ];

				for ( let i = 0; i < swiperCoord.length; i += 1 ) {
					const point = swiperCoord[ i ];

					if ( 0 <= point[ 0 ] && point[ 0 ] <= windowWidth && 0 <= point[ 1 ] && point[ 1 ] <= windowHeight ) {
              if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line

						inView = true;
					}
				}

				if ( !inView ) {
					return undefined;
				}
			}

			if ( swiper.isHorizontal() ) {
				if ( isPageUp || isPageDown || isArrowLeft || isArrowRight ) {
					if ( e.preventDefault ) {
						e.preventDefault();
					} else {
						e.returnValue = false;
					}
				}

				if ( ( isPageDown || isArrowRight ) && !rtl || ( isPageUp || isArrowLeft ) && rtl ) {
					swiper.slideNext();
				}
				if ( ( isPageUp || isArrowLeft ) && !rtl || ( isPageDown || isArrowRight ) && rtl ) {
					swiper.slidePrev();
				}
			} else {
				if ( isPageUp || isPageDown || isArrowUp || isArrowDown ) {
					if ( e.preventDefault ) {
						e.preventDefault();
					} else {
						e.returnValue = false;
					}
				}

				if ( isPageDown || isArrowDown ) {
					swiper.slideNext();
				}
				if ( isPageUp || isArrowUp ) {
					swiper.slidePrev();
				}
			}

			emit( 'keyPress', kc );
			return undefined;
		}

		function enable() {
			if ( swiper.keyboard.enabled ) {
				return;
			}
			$( document ).on( 'keydown', handle );
			swiper.keyboard.enabled = true;
		}

		function disable() {
			if ( !swiper.keyboard.enabled ) {
				return;
			}
			$( document ).off( 'keydown', handle );
			swiper.keyboard.enabled = false;
		}

		on( 'init', () => {
			if ( swiper.params.keyboard.enabled ) {
				enable();
			}
		} );
		on( 'destroy', () => {
			if ( swiper.keyboard.enabled ) {
				disable();
			}
		} );
		Object.assign( swiper.keyboard, {
			enable,
			disable
		} );
	}

	/* eslint-disable consistent-return */
	function Mousewheel( _ref ) {
		const {
			swiper,
			extendParams,
			on,
			emit
		} = _ref;
		const window = getWindow();
		extendParams( {
			mousewheel: {
				enabled: false,
				releaseOnEdges: false,
				invert: false,
				forceToAxis: false,
				sensitivity: 1,
				eventsTarget: 'container',
				thresholdDelta: null,
				thresholdTime: null
			}
		} );
		swiper.mousewheel = {
			enabled: false
		};
		let timeout;
		let lastScrollTime = now();
		let lastEventBeforeSnap;
		const recentWheelEvents = [];

		function normalize( e ) {
			// Reasonable defaults
			const PIXEL_STEP = 10;
			const LINE_HEIGHT = 40;
			const PAGE_HEIGHT = 800;
			let sX = 0;
			let sY = 0; // spinX, spinY

			let pX = 0;
			let pY = 0; // pixelX, pixelY
			// Legacy

			if ( 'detail' in e ) {
				sY = e.detail;
			}

			if ( 'wheelDelta' in e ) {
				sY = -e.wheelDelta / 120;
			}

			if ( 'wheelDeltaY' in e ) {
				sY = -e.wheelDeltaY / 120;
			}

			if ( 'wheelDeltaX' in e ) {
				sX = -e.wheelDeltaX / 120;
			} // side scrolling on FF with DOMMouseScroll


			if ( 'axis' in e && e.axis === e.HORIZONTAL_AXIS ) {
				sX = sY;
				sY = 0;
			}

			pX = sX * PIXEL_STEP;
			pY = sY * PIXEL_STEP;

			if ( 'deltaY' in e ) {
				pY = e.deltaY;
			}

			if ( 'deltaX' in e ) {
				pX = e.deltaX;
			}

			if ( e.shiftKey && !pX ) {
				// if user scrolls with shift he wants horizontal scroll
				pX = pY;
				pY = 0;
			}

			if ( ( pX || pY ) && e.deltaMode ) {
				if ( 1 === e.deltaMode ) {
					// delta in LINE units
					pX *= LINE_HEIGHT;
					pY *= LINE_HEIGHT;
				} else {
					// delta in PAGE units
					pX *= PAGE_HEIGHT;
					pY *= PAGE_HEIGHT;
				}
			} // Fall-back if spin cannot be determined


			if ( pX && !sX ) {
				sX = 1 > pX ? -1 : 1;
			}

			if ( pY && !sY ) {
				sY = 1 > pY ? -1 : 1;
			}

			return {
				spinX: sX,
				spinY: sY,
				pixelX: pX,
				pixelY: pY
			};
		}

		function handleMouseEnter() {
			if ( !swiper.enabled ) {
				return;
			}
			swiper.mouseEntered = true;
		}

		function handleMouseLeave() {
			if ( !swiper.enabled ) {
				return;
			}
			swiper.mouseEntered = false;
		}

		function animateSlider( newEvent ) {
			if ( swiper.params.mousewheel.thresholdDelta && newEvent.delta < swiper.params.mousewheel.thresholdDelta ) {
				// Prevent if delta of wheel scroll delta is below configured threshold
				return false;
			}

			if ( swiper.params.mousewheel.thresholdTime && now() - lastScrollTime < swiper.params.mousewheel.thresholdTime ) {
				// Prevent if time between scrolls is below configured threshold
				return false;
			} // If the movement is NOT big enough and
			// if the last time the user scrolled was too close to the current one (avoid continuously triggering the slider):
			//   Don't go any further (avoid insignificant scroll movement).


			if ( 6 <= newEvent.delta && 60 > now() - lastScrollTime ) {
				// Return false as a default
				return true;
			} // If user is scrolling towards the end:
			//   If the slider hasn't hit the latest slide or
			//   if the slider is a loop and
			//   if the slider isn't moving right now:
			//     Go to next slide and
			//     emit a scroll event.
			// Else (the user is scrolling towards the beginning) and
			// if the slider hasn't hit the first slide or
			// if the slider is a loop and
			// if the slider isn't moving right now:
			//   Go to prev slide and
			//   emit a scroll event.


			if ( 0 > newEvent.direction ) {
				if ( ( !swiper.isEnd || swiper.params.loop ) && !swiper.animating ) {
					swiper.slideNext();
					emit( 'scroll', newEvent.raw );
				}
			} else if ( ( !swiper.isBeginning || swiper.params.loop ) && !swiper.animating ) {
				swiper.slidePrev();
				emit( 'scroll', newEvent.raw );
			} // If you got here is because an animation has been triggered so store the current time


			lastScrollTime = new window.Date().getTime(); // Return false as a default

			return false;
		}

		function releaseScroll( newEvent ) {
			const params = swiper.params.mousewheel;

			if ( 0 > newEvent.direction ) {
				if ( swiper.isEnd && !swiper.params.loop && params.releaseOnEdges ) {
					// Return true to animate scroll on edges
					return true;
				}
			} else if ( swiper.isBeginning && !swiper.params.loop && params.releaseOnEdges ) {
				// Return true to animate scroll on edges
				return true;
			}

			return false;
		}

		function handle( event ) {
			let e = event;
			let disableParentSwiper = true;
			if ( !swiper.enabled ) {
				return;
			}
			const params = swiper.params.mousewheel;

			if ( swiper.params.cssMode ) {
				e.preventDefault();
			}

			let target = swiper.$el;

			if ( 'container' !== swiper.params.mousewheel.eventsTarget ) {
				target = $( swiper.params.mousewheel.eventsTarget );
			}

			if ( !swiper.mouseEntered && !target[ 0 ].contains( e.target ) && !params.releaseOnEdges ) {
				return true;
			}
			if ( e.originalEvent ) {
				e = e.originalEvent;
			} // jquery fix

			let delta = 0;
			const rtlFactor = swiper.rtlTranslate ? -1 : 1;
			const data = normalize( e );

			if ( params.forceToAxis ) {
				if ( swiper.isHorizontal() ) {
					if ( Math.abs( data.pixelX ) > Math.abs( data.pixelY ) ) {
						delta = -data.pixelX * rtlFactor;
					} else {
						return true;
					}
				} else if ( Math.abs( data.pixelY ) > Math.abs( data.pixelX ) ) {
					delta = -data.pixelY;
				} else {
					return true;
				}
			} else {
				delta = Math.abs( data.pixelX ) > Math.abs( data.pixelY ) ? -data.pixelX * rtlFactor : -data.pixelY;
			}

			if ( 0 === delta ) {
				return true;
			}
			if ( params.invert ) {
				delta = -delta;
			} // Get the scroll positions

			let positions = swiper.getTranslate() + delta * params.sensitivity;
			if ( positions >= swiper.minTranslate() ) {
				positions = swiper.minTranslate();
			}
			if ( positions <= swiper.maxTranslate() ) {
				positions = swiper.maxTranslate();
			} // When loop is true:
			//     the disableParentSwiper will be true.
			// When loop is false:
			//     if the scroll positions is not on edge,
			//     then the disableParentSwiper will be true.
			//     if the scroll on edge positions,
			//     then the disableParentSwiper will be false.

			disableParentSwiper = swiper.params.loop ? true : !( positions === swiper.minTranslate() || positions === swiper.maxTranslate() );
			if ( disableParentSwiper && swiper.params.nested ) {
				e.stopPropagation();
			}

			if ( !swiper.params.freeMode || !swiper.params.freeMode.enabled ) {
				// Register the new event in a variable which stores the relevant data
				const newEvent = {
					time: now(),
					delta: Math.abs( delta ),
					direction: Math.sign( delta ),
					raw: event
				}; // Keep the most recent events

				if ( 2 <= recentWheelEvents.length ) {
					recentWheelEvents.shift(); // only store the last N events
				}

				const prevEvent = recentWheelEvents.length ? recentWheelEvents[ recentWheelEvents.length - 1 ] : undefined;
				recentWheelEvents.push( newEvent ); // If there is at least one previous recorded event:
				//   If direction has changed or
				//   if the scroll is quicker than the previous one:
				//     Animate the slider.
				// Else (this is the first time the wheel is moved):
				//     Animate the slider.

				if ( prevEvent ) {
					if ( newEvent.direction !== prevEvent.direction || newEvent.delta > prevEvent.delta || newEvent.time > prevEvent.time + 150 ) {
						animateSlider( newEvent );
					}
				} else {
					animateSlider( newEvent );
				} // If it's time to release the scroll:
				//   Return now so you don't hit the preventDefault.


				if ( releaseScroll( newEvent ) ) {
					return true;
				}
			} else {
				// Freemode or scrollContainer:
				// If we recently snapped after a momentum scroll, then ignore wheel events
				// to give time for the deceleration to finish. Stop ignoring after 500 msecs
				// or if it's a new scroll (larger delta or inverse sign as last event before
				// an end-of-momentum snap).
				const newEvent = {
					time: now(),
					delta: Math.abs( delta ),
					direction: Math.sign( delta )
				};
				const ignoreWheelEvents = lastEventBeforeSnap && newEvent.time < lastEventBeforeSnap.time + 500 && newEvent.delta <= lastEventBeforeSnap.delta && newEvent.direction === lastEventBeforeSnap.direction;

				if ( !ignoreWheelEvents ) {
					lastEventBeforeSnap = undefined;

					if ( swiper.params.loop ) {
						swiper.loopFix();
					}

					let position = swiper.getTranslate() + delta * params.sensitivity;
					const wasBeginning = swiper.isBeginning;
					const wasEnd = swiper.isEnd;
					if ( position >= swiper.minTranslate() ) {
						position = swiper.minTranslate();
					}
					if ( position <= swiper.maxTranslate() ) {
						position = swiper.maxTranslate();
					}
					swiper.setTransition( 0 );
					swiper.setTranslate( position );
					swiper.updateProgress();
					swiper.updateActiveIndex();
					swiper.updateSlidesClasses();

					if ( !wasBeginning && swiper.isBeginning || !wasEnd && swiper.isEnd ) {
						swiper.updateSlidesClasses();
					}

					if ( swiper.params.freeMode.sticky ) {
						// When wheel scrolling starts with sticky (aka snap) enabled, then detect
						// the end of a momentum scroll by storing recent (N=15?) wheel events.
						// 1. do all N events have decreasing or same (absolute value) delta?
						// 2. did all N events arrive in the last M (M=500?) msecs?
						// 3. does the earliest event have an (absolute value) delta that's
						//    at least P (P=1?) larger than the most recent event's delta?
						// 4. does the latest event have a delta that's smaller than Q (Q=6?) pixels?
						// If 1-4 are "yes" then we're near the end of a momentum scroll deceleration.
						// Snap immediately and ignore remaining wheel events in this scroll.
						// See comment above for "remaining wheel events in this scroll" determination.
						// If 1-4 aren't satisfied, then wait to snap until 500ms after the last event.
						clearTimeout( timeout );
						timeout = undefined;

						if ( 15 <= recentWheelEvents.length ) {
							recentWheelEvents.shift(); // only store the last N events
						}

						const prevEvent = recentWheelEvents.length ? recentWheelEvents[ recentWheelEvents.length - 1 ] : undefined;
						const firstEvent = recentWheelEvents[ 0 ];
						recentWheelEvents.push( newEvent );

						if ( prevEvent && ( newEvent.delta > prevEvent.delta || newEvent.direction !== prevEvent.direction ) ) {
							// Increasing or reverse-sign delta means the user started scrolling again. Clear the wheel event log.
							recentWheelEvents.splice( 0 );
						} else if ( 15 <= recentWheelEvents.length && 500 > newEvent.time - firstEvent.time && 1 <= firstEvent.delta - newEvent.delta && 6 >= newEvent.delta ) {
							// We're at the end of the deceleration of a momentum scroll, so there's no need
							// to wait for more events. Snap ASAP on the next tick.
							// Also, because there's some remaining momentum we'll bias the snap in the
							// direction of the ongoing scroll because it's better UX for the scroll to snap
							// in the same direction as the scroll instead of reversing to snap.  Therefore,
							// if it's already scrolled more than 20% in the current direction, keep going.
							const snapToThreshold = 0 < delta ? 0.8 : 0.2;
							lastEventBeforeSnap = newEvent;
							recentWheelEvents.splice( 0 );
							timeout = nextTick( () => {
								swiper.slideToClosest( swiper.params.speed, true, undefined, snapToThreshold );
							}, 0 ); // no delay; move on next tick
						}

						if ( !timeout ) {
							// if we get here, then we haven't detected the end of a momentum scroll, so
							// we'll consider a scroll "complete" when there haven't been any wheel events
							// for 500ms.
							timeout = nextTick( () => {
								const snapToThreshold = 0.5;
								lastEventBeforeSnap = newEvent;
								recentWheelEvents.splice( 0 );
								swiper.slideToClosest( swiper.params.speed, true, undefined, snapToThreshold );
							}, 500 );
						}
					} // Emit event


					if ( !ignoreWheelEvents ) {
						emit( 'scroll', e );
					} // Stop autoplay

					if ( swiper.params.autoplay && swiper.params.autoplayDisableOnInteraction ) {
						swiper.autoplay.stop();
					} // Return page scroll on edge positions

					if ( position === swiper.minTranslate() || position === swiper.maxTranslate() ) {
						return true;
					}
				}
			}

			if ( e.preventDefault ) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
			return false;
		}

		function events( method ) {
			let target = swiper.$el;

			if ( 'container' !== swiper.params.mousewheel.eventsTarget ) {
				target = $( swiper.params.mousewheel.eventsTarget );
			}

			target[ method ]( 'mouseenter', handleMouseEnter );
			target[ method ]( 'mouseleave', handleMouseLeave );
			target[ method ]( 'wheel', handle );
		}

		function enable() {
			if ( swiper.params.cssMode ) {
				swiper.wrapperEl.removeEventListener( 'wheel', handle );
				return true;
			}

			if ( swiper.mousewheel.enabled ) {
				return false;
			}
			events( 'on' );
			swiper.mousewheel.enabled = true;
			return true;
		}

		function disable() {
			if ( swiper.params.cssMode ) {
				swiper.wrapperEl.addEventListener( event, handle );
				return true;
			}

			if ( !swiper.mousewheel.enabled ) {
				return false;
			}
			events( 'off' );
			swiper.mousewheel.enabled = false;
			return true;
		}

		on( 'init', () => {
			if ( !swiper.params.mousewheel.enabled && swiper.params.cssMode ) {
				disable();
			}

			if ( swiper.params.mousewheel.enabled ) {
				enable();
			}
		} );
		on( 'destroy', () => {
			if ( swiper.params.cssMode ) {
				enable();
			}

			if ( swiper.mousewheel.enabled ) {
				disable();
			}
		} );
		Object.assign( swiper.mousewheel, {
			enable,
			disable
		} );
	}

	function createElementIfNotDefined( swiper, originalParams, params, checkProps ) {
		const document = getDocument();

		if ( swiper.params.createElements ) {
			Object.keys( checkProps ).forEach( ( key ) => {
				if ( !params[ key ] && true === params.auto ) {
					let element = swiper.$el.children( `.${checkProps[ key ]}` )[ 0 ];

					if ( !element ) {
						element = document.createElement( 'div' );
						element.className = checkProps[ key ];
						swiper.$el.append( element );
					}

					params[ key ] = element;
					originalParams[ key ] = element;
				}
			} );
		}

		return params;
	}

	function Navigation( _ref ) {
		const {
			swiper,
			extendParams,
			on,
			emit
		} = _ref;
		extendParams( {
			navigation: {
				nextEl: null,
				prevEl: null,
				hideOnClick: false,
				disabledClass: 'swiper-button-disabled',
				hiddenClass: 'swiper-button-hidden',
				lockClass: 'swiper-button-lock',
				navigationDisabledClass: 'swiper-navigation-disabled'
			}
		} );
		swiper.navigation = {
			nextEl: null,
			$nextEl: null,
			prevEl: null,
			$prevEl: null
		};

		function getEl( el ) {
			let $el;

			if ( el ) {
				$el = $( el );

				if ( swiper.params.uniqueNavElements && 'string' === typeof el && 1 < $el.length && 1 === swiper.$el.find( el ).length ) {
					$el = swiper.$el.find( el );
				}
			}

			return $el;
		}

		function toggleEl( $el, disabled ) {
			const params = swiper.params.navigation;

			if ( $el && 0 < $el.length ) {
				$el[ disabled ? 'addClass' : 'removeClass' ]( params.disabledClass );
				if ( $el[ 0 ] && 'BUTTON' === $el[ 0 ].tagName ) {
					$el[ 0 ].disabled = disabled;
				}

				if ( swiper.params.watchOverflow && swiper.enabled ) {
					$el[ swiper.isLocked ? 'addClass' : 'removeClass' ]( params.lockClass );
				}
			}
		}

		function update() {
			// Update Navigation Buttons
			if ( swiper.params.loop ) {
				return;
			}
			const {
				$nextEl,
				$prevEl
			} = swiper.navigation;
			toggleEl( $prevEl, swiper.isBeginning && !swiper.params.rewind );
			toggleEl( $nextEl, swiper.isEnd && !swiper.params.rewind );
		}

		function onPrevClick( e ) {
			e.preventDefault();
			if ( swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind ) {
				return;
			}
			swiper.slidePrev();
			emit( 'navigationPrev' );
		}

		function onNextClick( e ) {
			e.preventDefault();
			if ( swiper.isEnd && !swiper.params.loop && !swiper.params.rewind ) {
				return;
			}
			swiper.slideNext();
			emit( 'navigationNext' );
		}

		function init() {
			const params = swiper.params.navigation;
			swiper.params.navigation = createElementIfNotDefined( swiper, swiper.originalParams.navigation, swiper.params.navigation, {
				nextEl: 'swiper-button-next',
				prevEl: 'swiper-button-prev'
			} );
			if ( !( params.nextEl || params.prevEl ) ) {
				return;
			}
			const $nextEl = getEl( params.nextEl );
			const $prevEl = getEl( params.prevEl );

			if ( $nextEl && 0 < $nextEl.length ) {
				$nextEl.on( 'click', onNextClick );
			}

			if ( $prevEl && 0 < $prevEl.length ) {
				$prevEl.on( 'click', onPrevClick );
			}

			Object.assign( swiper.navigation, {
				$nextEl,
				nextEl: $nextEl && $nextEl[ 0 ],
				$prevEl,
				prevEl: $prevEl && $prevEl[ 0 ]
			} );

			if ( !swiper.enabled ) {
				if ( $nextEl ) {
					$nextEl.addClass( params.lockClass );
				}
				if ( $prevEl ) {
					$prevEl.addClass( params.lockClass );
				}
			}
		}

		function destroy() {
			const {
				$nextEl,
				$prevEl
			} = swiper.navigation;

			if ( $nextEl && $nextEl.length ) {
				$nextEl.off( 'click', onNextClick );
				$nextEl.removeClass( swiper.params.navigation.disabledClass );
			}

			if ( $prevEl && $prevEl.length ) {
				$prevEl.off( 'click', onPrevClick );
				$prevEl.removeClass( swiper.params.navigation.disabledClass );
			}
		}

		on( 'init', () => {
			if ( false === swiper.params.navigation.enabled ) {
				// eslint-disable-next-line
          disable();
			} else {
				init();
				update();
			}
		} );
		on( 'toEdge fromEdge lock unlock', () => {
			update();
		} );
		on( 'destroy', () => {
			destroy();
		} );
		on( 'enable disable', () => {
			const {
				$nextEl,
				$prevEl
			} = swiper.navigation;

			if ( $nextEl ) {
				$nextEl[ swiper.enabled ? 'removeClass' : 'addClass' ]( swiper.params.navigation.lockClass );
			}

			if ( $prevEl ) {
				$prevEl[ swiper.enabled ? 'removeClass' : 'addClass' ]( swiper.params.navigation.lockClass );
			}
		} );
		on( 'click', ( _s, e ) => {
			const {
				$nextEl,
				$prevEl
			} = swiper.navigation;
			const targetEl = e.target;

			if ( swiper.params.navigation.hideOnClick && !$( targetEl ).is( $prevEl ) && !$( targetEl ).is( $nextEl ) ) {
				if ( swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && ( swiper.pagination.el === targetEl || swiper.pagination.el.contains( targetEl ) ) ) {
					return;
				}
				let isHidden;

				if ( $nextEl ) {
					isHidden = $nextEl.hasClass( swiper.params.navigation.hiddenClass );
				} else if ( $prevEl ) {
					isHidden = $prevEl.hasClass( swiper.params.navigation.hiddenClass );
				}

				if ( true === isHidden ) {
					emit( 'navigationShow' );
				} else {
					emit( 'navigationHide' );
				}

				if ( $nextEl ) {
					$nextEl.toggleClass( swiper.params.navigation.hiddenClass );
				}

				if ( $prevEl ) {
					$prevEl.toggleClass( swiper.params.navigation.hiddenClass );
				}
			}
		} );

		const enable = () => {
			swiper.$el.removeClass( swiper.params.navigation.navigationDisabledClass );
			init();
			update();
		};

		const disable = () => {
			swiper.$el.addClass( swiper.params.navigation.navigationDisabledClass );
			destroy();
		};

		Object.assign( swiper.navigation, {
			enable,
			disable,
			update,
			init,
			destroy
		} );
	}

	function classesToSelector( classes ) {
		if ( classes === void 0 ) {
			classes = '';
		}

      return `.${classes.trim().replace(/([\.:!\/])/g, '\\$1') // eslint-disable-line
			.replace( / /g, '.' )}`;
	}

	function Pagination( _ref ) {
		const {
			swiper,
			extendParams,
			on,
			emit
		} = _ref;
		const pfx = 'swiper-pagination';
		extendParams( {
			pagination: {
				el: null,
				bulletElement: 'span',
				clickable: false,
				hideOnClick: false,
				renderBullet: null,
				renderProgressbar: null,
				renderFraction: null,
				renderCustom: null,
				progressbarOpposite: false,
				type: 'bullets',
				// 'bullets' or 'progressbar' or 'fraction' or 'custom'
				dynamicBullets: false,
				dynamicMainBullets: 1,
				formatFractionCurrent: ( number ) => number,
				formatFractionTotal: ( number ) => number,
				bulletClass: `${pfx}-bullet`,
				bulletActiveClass: `${pfx}-bullet-active`,
				modifierClass: `${pfx}-`,
				currentClass: `${pfx}-current`,
				totalClass: `${pfx}-total`,
				hiddenClass: `${pfx}-hidden`,
				progressbarFillClass: `${pfx}-progressbar-fill`,
				progressbarOppositeClass: `${pfx}-progressbar-opposite`,
				clickableClass: `${pfx}-clickable`,
				lockClass: `${pfx}-lock`,
				horizontalClass: `${pfx}-horizontal`,
				verticalClass: `${pfx}-vertical`,
				paginationDisabledClass: `${pfx}-disabled`
			}
		} );
		swiper.pagination = {
			el: null,
			$el: null,
			bullets: []
		};
		let bulletSize;
		let dynamicBulletIndex = 0;

		function isPaginationDisabled() {
			return !swiper.params.pagination.el || !swiper.pagination.el || !swiper.pagination.$el || 0 === swiper.pagination.$el.length;
		}

		function setSideBullets( $bulletEl, position ) {
			const {
				bulletActiveClass
			} = swiper.params.pagination;
			$bulletEl[ position ]().addClass( `${bulletActiveClass}-${position}` )[ position ]().addClass( `${bulletActiveClass}-${position}-${position}` );
		}

		function update() {
			// Render || Update Pagination bullets/items
			const rtl = swiper.rtl;
			const params = swiper.params.pagination;
			if ( isPaginationDisabled() ) {
				return;
			}
			const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
			const $el = swiper.pagination.$el; // Current/Total

			let current;
			const total = swiper.params.loop ? Math.ceil( ( slidesLength - swiper.loopedSlides * 2 ) / swiper.params.slidesPerGroup ) : swiper.snapGrid.length;

			if ( swiper.params.loop ) {
				current = Math.ceil( ( swiper.activeIndex - swiper.loopedSlides ) / swiper.params.slidesPerGroup );

				if ( current > slidesLength - 1 - swiper.loopedSlides * 2 ) {
					current -= slidesLength - swiper.loopedSlides * 2;
				}

				if ( current > total - 1 ) {
					current -= total;
				}
				if ( 0 > current && 'bullets' !== swiper.params.paginationType ) {
					current = total + current;
				}
			} else if ( 'undefined' !== typeof swiper.snapIndex ) {
				current = swiper.snapIndex;
			} else {
				current = swiper.activeIndex || 0;
			} // Types


			if ( 'bullets' === params.type && swiper.pagination.bullets && 0 < swiper.pagination.bullets.length ) {
				const bullets = swiper.pagination.bullets;
				let firstIndex;
				let lastIndex;
				let midIndex;

				if ( params.dynamicBullets ) {
					bulletSize = bullets.eq( 0 )[ swiper.isHorizontal() ? 'outerWidth' : 'outerHeight' ]( true );
					$el.css( swiper.isHorizontal() ? 'width' : 'height', `${bulletSize * ( params.dynamicMainBullets + 4 )}px` );

					if ( 1 < params.dynamicMainBullets && swiper.previousIndex !== undefined ) {
						dynamicBulletIndex += current - ( swiper.previousIndex - swiper.loopedSlides || 0 );

						if ( dynamicBulletIndex > params.dynamicMainBullets - 1 ) {
							dynamicBulletIndex = params.dynamicMainBullets - 1;
						} else if ( 0 > dynamicBulletIndex ) {
							dynamicBulletIndex = 0;
						}
					}

					firstIndex = Math.max( current - dynamicBulletIndex, 0 );
					lastIndex = firstIndex + ( Math.min( bullets.length, params.dynamicMainBullets ) - 1 );
					midIndex = ( lastIndex + firstIndex ) / 2;
				}

				bullets.removeClass( [ '', '-next', '-next-next', '-prev', '-prev-prev', '-main' ].map( ( suffix ) => `${params.bulletActiveClass}${suffix}` ).join( ' ' ) );

				if ( 1 < $el.length ) {
					bullets.each( ( bullet ) => {
						const $bullet = $( bullet );
						const bulletIndex = $bullet.index();

						if ( bulletIndex === current ) {
							$bullet.addClass( params.bulletActiveClass );
						}

						if ( params.dynamicBullets ) {
							if ( bulletIndex >= firstIndex && bulletIndex <= lastIndex ) {
								$bullet.addClass( `${params.bulletActiveClass}-main` );
							}

							if ( bulletIndex === firstIndex ) {
								setSideBullets( $bullet, 'prev' );
							}

							if ( bulletIndex === lastIndex ) {
								setSideBullets( $bullet, 'next' );
							}
						}
					} );
				} else {
					const $bullet = bullets.eq( current );
					const bulletIndex = $bullet.index();
					$bullet.addClass( params.bulletActiveClass );

					if ( params.dynamicBullets ) {
						const $firstDisplayedBullet = bullets.eq( firstIndex );
						const $lastDisplayedBullet = bullets.eq( lastIndex );

						for ( let i = firstIndex; i <= lastIndex; i += 1 ) {
							bullets.eq( i ).addClass( `${params.bulletActiveClass}-main` );
						}

						if ( swiper.params.loop ) {
							if ( bulletIndex >= bullets.length ) {
								for ( let i = params.dynamicMainBullets; 0 <= i; i -= 1 ) {
									bullets.eq( bullets.length - i ).addClass( `${params.bulletActiveClass}-main` );
								}

								bullets.eq( bullets.length - params.dynamicMainBullets - 1 ).addClass( `${params.bulletActiveClass}-prev` );
							} else {
								setSideBullets( $firstDisplayedBullet, 'prev' );
								setSideBullets( $lastDisplayedBullet, 'next' );
							}
						} else {
							setSideBullets( $firstDisplayedBullet, 'prev' );
							setSideBullets( $lastDisplayedBullet, 'next' );
						}
					}
				}

				if ( params.dynamicBullets ) {
					const dynamicBulletsLength = Math.min( bullets.length, params.dynamicMainBullets + 4 );
					const bulletsOffset = ( bulletSize * dynamicBulletsLength - bulletSize ) / 2 - midIndex * bulletSize;
					const offsetProp = rtl ? 'right' : 'left';
					bullets.css( swiper.isHorizontal() ? offsetProp : 'top', `${bulletsOffset}px` );
				}
			}

			if ( 'fraction' === params.type ) {
				$el.find( classesToSelector( params.currentClass ) ).text( params.formatFractionCurrent( current + 1 ) );
				$el.find( classesToSelector( params.totalClass ) ).text( params.formatFractionTotal( total ) );
			}

			if ( 'progressbar' === params.type ) {
				let progressbarDirection;

				if ( params.progressbarOpposite ) {
					progressbarDirection = swiper.isHorizontal() ? 'vertical' : 'horizontal';
				} else {
					progressbarDirection = swiper.isHorizontal() ? 'horizontal' : 'vertical';
				}

				const scale = ( current + 1 ) / total;
				let scaleX = 1;
				let scaleY = 1;

				if ( 'horizontal' === progressbarDirection ) {
					scaleX = scale;
				} else {
					scaleY = scale;
				}

				$el.find( classesToSelector( params.progressbarFillClass ) ).transform( `translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})` ).transition( swiper.params.speed );
			}

			if ( 'custom' === params.type && params.renderCustom ) {
				$el.html( params.renderCustom( swiper, current + 1, total ) );
				emit( 'paginationRender', $el[ 0 ] );
			} else {
				emit( 'paginationUpdate', $el[ 0 ] );
			}

			if ( swiper.params.watchOverflow && swiper.enabled ) {
				$el[ swiper.isLocked ? 'addClass' : 'removeClass' ]( params.lockClass );
			}
		}

		function render() {
			// Render Container
			const params = swiper.params.pagination;
			if ( isPaginationDisabled() ) {
				return;
			}
			const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
			const $el = swiper.pagination.$el;
			let paginationHTML = '';

			if ( 'bullets' === params.type ) {
				let numberOfBullets = swiper.params.loop ? Math.ceil( ( slidesLength - swiper.loopedSlides * 2 ) / swiper.params.slidesPerGroup ) : swiper.snapGrid.length;

				if ( swiper.params.freeMode && swiper.params.freeMode.enabled && !swiper.params.loop && numberOfBullets > slidesLength ) {
					numberOfBullets = slidesLength;
				}

				for ( let i = 0; i < numberOfBullets; i += 1 ) {
					if ( params.renderBullet ) {
						paginationHTML += params.renderBullet.call( swiper, i, params.bulletClass );
					} else {
						paginationHTML += `<${params.bulletElement} class="${params.bulletClass}"></${params.bulletElement}>`;
					}
				}

				$el.html( paginationHTML );
				swiper.pagination.bullets = $el.find( classesToSelector( params.bulletClass ) );
			}

			if ( 'fraction' === params.type ) {
				if ( params.renderFraction ) {
					paginationHTML = params.renderFraction.call( swiper, params.currentClass, params.totalClass );
				} else {
					paginationHTML = `<span class="${params.currentClass}"></span>` + ' / ' + `<span class="${params.totalClass}"></span>`;
				}

				$el.html( paginationHTML );
			}

			if ( 'progressbar' === params.type ) {
				if ( params.renderProgressbar ) {
					paginationHTML = params.renderProgressbar.call( swiper, params.progressbarFillClass );
				} else {
					paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
				}

				$el.html( paginationHTML );
			}

			if ( 'custom' !== params.type ) {
				emit( 'paginationRender', swiper.pagination.$el[ 0 ] );
			}
		}

		function init() {
			swiper.params.pagination = createElementIfNotDefined( swiper, swiper.originalParams.pagination, swiper.params.pagination, {
				el: 'swiper-pagination'
			} );
			const params = swiper.params.pagination;
			if ( !params.el ) {
				return;
			}
			let $el = $( params.el );
			if ( 0 === $el.length ) {
				return;
			}

			if ( swiper.params.uniqueNavElements && 'string' === typeof params.el && 1 < $el.length ) {
				$el = swiper.$el.find( params.el ); // check if it belongs to another nested Swiper

				if ( 1 < $el.length ) {
					$el = $el.filter( ( el ) => {
						if ( $( el ).parents( '.swiper' )[ 0 ] !== swiper.el ) {
							return false;
						}
						return true;
					} );
				}
			}

			if ( 'bullets' === params.type && params.clickable ) {
				$el.addClass( params.clickableClass );
			}

			$el.addClass( params.modifierClass + params.type );
			$el.addClass( swiper.isHorizontal() ? params.horizontalClass : params.verticalClass );

			if ( 'bullets' === params.type && params.dynamicBullets ) {
				$el.addClass( `${params.modifierClass}${params.type}-dynamic` );
				dynamicBulletIndex = 0;

				if ( 1 > params.dynamicMainBullets ) {
					params.dynamicMainBullets = 1;
				}
			}

			if ( 'progressbar' === params.type && params.progressbarOpposite ) {
				$el.addClass( params.progressbarOppositeClass );
			}

			if ( params.clickable ) {
				$el.on( 'click', classesToSelector( params.bulletClass ), function onClick( e ) {
					e.preventDefault();
					let index = $( this ).index() * swiper.params.slidesPerGroup;
					if ( swiper.params.loop ) {
						index += swiper.loopedSlides;
					}
					swiper.slideTo( index );
				} );
			}

			Object.assign( swiper.pagination, {
				$el,
				el: $el[ 0 ]
			} );

			if ( !swiper.enabled ) {
				$el.addClass( params.lockClass );
			}
		}

		function destroy() {
			const params = swiper.params.pagination;
			if ( isPaginationDisabled() ) {
				return;
			}
			const $el = swiper.pagination.$el;
			$el.removeClass( params.hiddenClass );
			$el.removeClass( params.modifierClass + params.type );
			$el.removeClass( swiper.isHorizontal() ? params.horizontalClass : params.verticalClass );
			if ( swiper.pagination.bullets && swiper.pagination.bullets.removeClass ) {
				swiper.pagination.bullets.removeClass( params.bulletActiveClass );
			}

			if ( params.clickable ) {
				$el.off( 'click', classesToSelector( params.bulletClass ) );
			}
		}

		on( 'init', () => {
			if ( false === swiper.params.pagination.enabled ) {
				// eslint-disable-next-line
          disable();
			} else {
				init();
				render();
				update();
			}
		} );
		on( 'activeIndexChange', () => {
			if ( swiper.params.loop ) {
				update();
			} else if ( 'undefined' === typeof swiper.snapIndex ) {
				update();
			}
		} );
		on( 'snapIndexChange', () => {
			if ( !swiper.params.loop ) {
				update();
			}
		} );
		on( 'slidesLengthChange', () => {
			if ( swiper.params.loop ) {
				render();
				update();
			}
		} );
		on( 'snapGridLengthChange', () => {
			if ( !swiper.params.loop ) {
				render();
				update();
			}
		} );
		on( 'destroy', () => {
			destroy();
		} );
		on( 'enable disable', () => {
			const {
				$el
			} = swiper.pagination;

			if ( $el ) {
				$el[ swiper.enabled ? 'removeClass' : 'addClass' ]( swiper.params.pagination.lockClass );
			}
		} );
		on( 'lock unlock', () => {
			update();
		} );
		on( 'click', ( _s, e ) => {
			const targetEl = e.target;
			const {
				$el
			} = swiper.pagination;

			if ( swiper.params.pagination.el && swiper.params.pagination.hideOnClick && $el && 0 < $el.length && !$( targetEl ).hasClass( swiper.params.pagination.bulletClass ) ) {
				if ( swiper.navigation && ( swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl ) ) {
					return;
				}
				const isHidden = $el.hasClass( swiper.params.pagination.hiddenClass );

				if ( true === isHidden ) {
					emit( 'paginationShow' );
				} else {
					emit( 'paginationHide' );
				}

				$el.toggleClass( swiper.params.pagination.hiddenClass );
			}
		} );

		const enable = () => {
			swiper.$el.removeClass( swiper.params.pagination.paginationDisabledClass );

			if ( swiper.pagination.$el ) {
				swiper.pagination.$el.removeClass( swiper.params.pagination.paginationDisabledClass );
			}

			init();
			render();
			update();
		};

		const disable = () => {
			swiper.$el.addClass( swiper.params.pagination.paginationDisabledClass );

			if ( swiper.pagination.$el ) {
				swiper.pagination.$el.addClass( swiper.params.pagination.paginationDisabledClass );
			}

			destroy();
		};

		Object.assign( swiper.pagination, {
			enable,
			disable,
			render,
			update,
			init,
			destroy
		} );
	}

	function Lazy( _ref ) {
		const {
			swiper,
			extendParams,
			on,
			emit
		} = _ref;
		extendParams( {
			lazy: {
				checkInView: false,
				enabled: false,
				loadPrevNext: false,
				loadPrevNextAmount: 1,
				loadOnTransitionStart: false,
				scrollingElement: '',
				elementClass: 'swiper-lazy',
				loadingClass: 'swiper-lazy-loading',
				loadedClass: 'swiper-lazy-loaded',
				preloaderClass: 'swiper-lazy-preloader'
			}
		} );
		swiper.lazy = {};
		let scrollHandlerAttached = false;
		let initialImageLoaded = false;

		function loadInSlide( index, loadInDuplicate ) {
			if ( loadInDuplicate === void 0 ) {
				loadInDuplicate = true;
			}

			const params = swiper.params.lazy;
			if ( 'undefined' === typeof index ) {
				return;
			}
			if ( 0 === swiper.slides.length ) {
				return;
			}
			const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
			const $slideEl = isVirtual ? swiper.$wrapperEl.children( `.${swiper.params.slideClass}[data-swiper-slide-index="${index}"]` ) : swiper.slides.eq( index );
			const $images = $slideEl.find( `.${params.elementClass}:not(.${params.loadedClass}):not(.${params.loadingClass})` );

			if ( $slideEl.hasClass( params.elementClass ) && !$slideEl.hasClass( params.loadedClass ) && !$slideEl.hasClass( params.loadingClass ) ) {
				$images.push( $slideEl[ 0 ] );
			}

			if ( 0 === $images.length ) {
				return;
			}
			$images.each( ( imageEl ) => {
				const $imageEl = $( imageEl );
				$imageEl.addClass( params.loadingClass );
				const background = $imageEl.attr( 'data-background' );
				const src = $imageEl.attr( 'data-src' );
				const srcset = $imageEl.attr( 'data-srcset' );
				const sizes = $imageEl.attr( 'data-sizes' );
				const $pictureEl = $imageEl.parent( 'picture' );
				swiper.loadImage( $imageEl[ 0 ], src || background, srcset, sizes, false, () => {
					if ( 'undefined' === typeof swiper || null === swiper || !swiper || swiper && !swiper.params || swiper.destroyed ) {
						return;
					}

					if ( background ) {
						$imageEl.css( 'background-image', `url("${background}")` );
						$imageEl.removeAttr( 'data-background' );
					} else {
						if ( srcset ) {
							$imageEl.attr( 'srcset', srcset );
							$imageEl.removeAttr( 'data-srcset' );
						}

						if ( sizes ) {
							$imageEl.attr( 'sizes', sizes );
							$imageEl.removeAttr( 'data-sizes' );
						}

						if ( $pictureEl.length ) {
							$pictureEl.children( 'source' ).each( ( sourceEl ) => {
								const $source = $( sourceEl );

								if ( $source.attr( 'data-srcset' ) ) {
									$source.attr( 'srcset', $source.attr( 'data-srcset' ) );
									$source.removeAttr( 'data-srcset' );
								}
							} );
						}

						if ( src ) {
							$imageEl.attr( 'src', src );
							$imageEl.removeAttr( 'data-src' );
						}
					}

					$imageEl.addClass( params.loadedClass ).removeClass( params.loadingClass );
					$slideEl.find( `.${params.preloaderClass}` ).remove();

					if ( swiper.params.loop && loadInDuplicate ) {
						const slideOriginalIndex = $slideEl.attr( 'data-swiper-slide-index' );

						if ( $slideEl.hasClass( swiper.params.slideDuplicateClass ) ) {
							const originalSlide = swiper.$wrapperEl.children( `[data-swiper-slide-index="${slideOriginalIndex}"]:not(.${swiper.params.slideDuplicateClass})` );
							loadInSlide( originalSlide.index(), false );
						} else {
							const duplicatedSlide = swiper.$wrapperEl.children( `.${swiper.params.slideDuplicateClass}[data-swiper-slide-index="${slideOriginalIndex}"]` );
							loadInSlide( duplicatedSlide.index(), false );
						}
					}

					emit( 'lazyImageReady', $slideEl[ 0 ], $imageEl[ 0 ] );

					if ( swiper.params.autoHeight ) {
						swiper.updateAutoHeight();
					}
				} );
				emit( 'lazyImageLoad', $slideEl[ 0 ], $imageEl[ 0 ] );
			} );
		}

		function load() {
			const {
				$wrapperEl,
				params: swiperParams,
				slides,
				activeIndex
			} = swiper;
			const isVirtual = swiper.virtual && swiperParams.virtual.enabled;
			const params = swiperParams.lazy;
			let slidesPerView = swiperParams.slidesPerView;

			if ( 'auto' === slidesPerView ) {
				slidesPerView = 0;
			}

			function slideExist( index ) {
				if ( isVirtual ) {
					if ( $wrapperEl.children( `.${swiperParams.slideClass}[data-swiper-slide-index="${index}"]` ).length ) {
						return true;
					}
				} else if ( slides[ index ] ) {
					return true;
				}

				return false;
			}

			function slideIndex( slideEl ) {
				if ( isVirtual ) {
					return $( slideEl ).attr( 'data-swiper-slide-index' );
				}

				return $( slideEl ).index();
			}

			if ( !initialImageLoaded ) {
				initialImageLoaded = true;
			}

			if ( swiper.params.watchSlidesProgress ) {
				$wrapperEl.children( `.${swiperParams.slideVisibleClass}` ).each( ( slideEl ) => {
					const index = isVirtual ? $( slideEl ).attr( 'data-swiper-slide-index' ) : $( slideEl ).index();
					loadInSlide( index );
				} );
			} else if ( 1 < slidesPerView ) {
				for ( let i = activeIndex; i < activeIndex + slidesPerView; i += 1 ) {
					if ( slideExist( i ) ) {
						loadInSlide( i );
					}
				}
			} else {
				loadInSlide( activeIndex );
			}

			if ( params.loadPrevNext ) {
				if ( 1 < slidesPerView || params.loadPrevNextAmount && 1 < params.loadPrevNextAmount ) {
					const amount = params.loadPrevNextAmount;
					const spv = Math.ceil( slidesPerView );
					const maxIndex = Math.min( activeIndex + spv + Math.max( amount, spv ), slides.length );
					const minIndex = Math.max( activeIndex - Math.max( spv, amount ), 0 ); // Next Slides

					for ( let i = activeIndex + spv; i < maxIndex; i += 1 ) {
						if ( slideExist( i ) ) {
							loadInSlide( i );
						}
					} // Prev Slides


					for ( let i = minIndex; i < activeIndex; i += 1 ) {
						if ( slideExist( i ) ) {
							loadInSlide( i );
						}
					}
				} else {
					const nextSlide = $wrapperEl.children( `.${swiperParams.slideNextClass}` );
					if ( 0 < nextSlide.length ) {
						loadInSlide( slideIndex( nextSlide ) );
					}
					const prevSlide = $wrapperEl.children( `.${swiperParams.slidePrevClass}` );
					if ( 0 < prevSlide.length ) {
						loadInSlide( slideIndex( prevSlide ) );
					}
				}
			}
		}

		function checkInViewOnLoad() {
			const window = getWindow();
			if ( !swiper || swiper.destroyed ) {
				return;
			}
			const $scrollElement = swiper.params.lazy.scrollingElement ? $( swiper.params.lazy.scrollingElement ) : $( window );
			const isWindow = $scrollElement[ 0 ] === window;
			const scrollElementWidth = isWindow ? window.innerWidth : $scrollElement[ 0 ].offsetWidth;
			const scrollElementHeight = isWindow ? window.innerHeight : $scrollElement[ 0 ].offsetHeight;
			const swiperOffset = swiper.$el.offset();
			const {
				rtlTranslate: rtl
			} = swiper;
			let inView = false;
			if ( rtl ) {
				swiperOffset.left -= swiper.$el[ 0 ].scrollLeft;
			}
			const swiperCoord = [ [ swiperOffset.left, swiperOffset.top ], [ swiperOffset.left + swiper.width, swiperOffset.top ], [ swiperOffset.left, swiperOffset.top + swiper.height ], [ swiperOffset.left + swiper.width, swiperOffset.top + swiper.height ] ];

			for ( let i = 0; i < swiperCoord.length; i += 1 ) {
				const point = swiperCoord[ i ];

				if ( 0 <= point[ 0 ] && point[ 0 ] <= scrollElementWidth && 0 <= point[ 1 ] && point[ 1 ] <= scrollElementHeight ) {
            if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line

					inView = true;
				}
			}

			const passiveListener = 'touchstart' === swiper.touchEvents.start && swiper.support.passiveListener && swiper.params.passiveListeners ? {
				passive: true,
				capture: false
			} : false;

			if ( inView ) {
				load();
				$scrollElement.off( 'scroll', checkInViewOnLoad, passiveListener );
			} else if ( !scrollHandlerAttached ) {
				scrollHandlerAttached = true;
				$scrollElement.on( 'scroll', checkInViewOnLoad, passiveListener );
			}
		}

		on( 'beforeInit', () => {
			if ( swiper.params.lazy.enabled && swiper.params.preloadImages ) {
				swiper.params.preloadImages = false;
			}
		} );
		on( 'init', () => {
			if ( swiper.params.lazy.enabled ) {
				if ( swiper.params.lazy.checkInView ) {
					checkInViewOnLoad();
				} else {
					load();
				}
			}
		} );
		on( 'scroll', () => {
			if ( swiper.params.freeMode && swiper.params.freeMode.enabled && !swiper.params.freeMode.sticky ) {
				load();
			}
		} );
		on( 'scrollbarDragMove resize _freeModeNoMomentumRelease', () => {
			if ( swiper.params.lazy.enabled ) {
				if ( swiper.params.lazy.checkInView ) {
					checkInViewOnLoad();
				} else {
					load();
				}
			}
		} );
		on( 'transitionStart', () => {
			if ( swiper.params.lazy.enabled ) {
				if ( swiper.params.lazy.loadOnTransitionStart || !swiper.params.lazy.loadOnTransitionStart && !initialImageLoaded ) {
					if ( swiper.params.lazy.checkInView ) {
						checkInViewOnLoad();
					} else {
						load();
					}
				}
			}
		} );
		on( 'transitionEnd', () => {
			if ( swiper.params.lazy.enabled && !swiper.params.lazy.loadOnTransitionStart ) {
				if ( swiper.params.lazy.checkInView ) {
					checkInViewOnLoad();
				} else {
					load();
				}
			}
		} );
		on( 'slideChange', () => {
			const {
				lazy,
				cssMode,
				watchSlidesProgress,
				touchReleaseOnEdges,
				resistanceRatio
			} = swiper.params;

			if ( lazy.enabled && ( cssMode || watchSlidesProgress && ( touchReleaseOnEdges || 0 === resistanceRatio ) ) ) {
				load();
			}
		} );
		on( 'destroy', () => {
			if ( !swiper.$el ) {
				return;
			}
			swiper.$el.find( `.${swiper.params.lazy.loadingClass}` ).removeClass( swiper.params.lazy.loadingClass );
		} );
		Object.assign( swiper.lazy, {
			load,
			loadInSlide
		} );
	}

	function A11y( _ref ) {
		const {
			swiper,
			extendParams,
			on
		} = _ref;
		extendParams( {
			a11y: {
				enabled: true,
				notificationClass: 'swiper-notification',
				prevSlideMessage: 'Previous slide',
				nextSlideMessage: 'Next slide',
				firstSlideMessage: 'This is the first slide',
				lastSlideMessage: 'This is the last slide',
				paginationBulletMessage: 'Go to slide {{index}}',
				slideLabelMessage: '{{index}} / {{slidesLength}}',
				containerMessage: null,
				containerRoleDescriptionMessage: null,
				itemRoleDescriptionMessage: null,
				slideRole: 'group',
				id: null
			}
		} );
		swiper.a11y = {
			clicked: false
		};
		let liveRegion = null;

		function notify( message ) {
			const notification = liveRegion;
			if ( 0 === notification.length ) {
				return;
			}
			notification.html( '' );
			notification.html( message );
		}

		function getRandomNumber( size ) {
			if ( size === void 0 ) {
				size = 16;
			}

			const randomChar = () => Math.round( 16 * Math.random() ).toString( 16 );

			return 'x'.repeat( size ).replace( /x/g, randomChar );
		}

		function makeElFocusable( $el ) {
			$el.attr( 'tabIndex', '0' );
		}

		function makeElNotFocusable( $el ) {
			$el.attr( 'tabIndex', '-1' );
		}

		function addElRole( $el, role ) {
			$el.attr( 'role', role );
		}

		function addElRoleDescription( $el, description ) {
			$el.attr( 'aria-roledescription', description );
		}

		function addElControls( $el, controls ) {
			$el.attr( 'aria-controls', controls );
		}

		function addElLabel( $el, label ) {
			$el.attr( 'aria-label', label );
		}

		function addElId( $el, id ) {
			$el.attr( 'id', id );
		}

		function addElLive( $el, live ) {
			$el.attr( 'aria-live', live );
		}

		function disableEl( $el ) {
			$el.attr( 'aria-disabled', true );
		}

		function enableEl( $el ) {
			$el.attr( 'aria-disabled', false );
		}

		function onEnterOrSpaceKey( e ) {
			if ( 13 !== e.keyCode && 32 !== e.keyCode ) {
				return;
			}
			const params = swiper.params.a11y;
			const $targetEl = $( e.target );

			if ( swiper.navigation && swiper.navigation.$nextEl && $targetEl.is( swiper.navigation.$nextEl ) ) {
				if ( !( swiper.isEnd && !swiper.params.loop ) ) {
					swiper.slideNext();
				}

				if ( swiper.isEnd ) {
					notify( params.lastSlideMessage );
				} else {
					notify( params.nextSlideMessage );
				}
			}

			if ( swiper.navigation && swiper.navigation.$prevEl && $targetEl.is( swiper.navigation.$prevEl ) ) {
				if ( !( swiper.isBeginning && !swiper.params.loop ) ) {
					swiper.slidePrev();
				}

				if ( swiper.isBeginning ) {
					notify( params.firstSlideMessage );
				} else {
					notify( params.prevSlideMessage );
				}
			}

			if ( swiper.pagination && $targetEl.is( classesToSelector( swiper.params.pagination.bulletClass ) ) ) {
				$targetEl[ 0 ].click();
			}
		}

		function updateNavigation() {
			if ( swiper.params.loop || swiper.params.rewind || !swiper.navigation ) {
				return;
			}
			const {
				$nextEl,
				$prevEl
			} = swiper.navigation;

			if ( $prevEl && 0 < $prevEl.length ) {
				if ( swiper.isBeginning ) {
					disableEl( $prevEl );
					makeElNotFocusable( $prevEl );
				} else {
					enableEl( $prevEl );
					makeElFocusable( $prevEl );
				}
			}

			if ( $nextEl && 0 < $nextEl.length ) {
				if ( swiper.isEnd ) {
					disableEl( $nextEl );
					makeElNotFocusable( $nextEl );
				} else {
					enableEl( $nextEl );
					makeElFocusable( $nextEl );
				}
			}
		}

		function hasPagination() {
			return swiper.pagination && swiper.pagination.bullets && swiper.pagination.bullets.length;
		}

		function hasClickablePagination() {
			return hasPagination() && swiper.params.pagination.clickable;
		}

		function updatePagination() {
			const params = swiper.params.a11y;
			if ( !hasPagination() ) {
				return;
			}
			swiper.pagination.bullets.each( ( bulletEl ) => {
				const $bulletEl = $( bulletEl );

				if ( swiper.params.pagination.clickable ) {
					makeElFocusable( $bulletEl );

					if ( !swiper.params.pagination.renderBullet ) {
						addElRole( $bulletEl, 'button' );
						addElLabel( $bulletEl, params.paginationBulletMessage.replace( /\{\{index\}\}/, $bulletEl.index() + 1 ) );
					}
				}

				if ( $bulletEl.is( `.${swiper.params.pagination.bulletActiveClass}` ) ) {
					$bulletEl.attr( 'aria-current', 'true' );
				} else {
					$bulletEl.removeAttr( 'aria-current' );
				}
			} );
		}

		const initNavEl = ( $el, wrapperId, message ) => {
			makeElFocusable( $el );

			if ( 'BUTTON' !== $el[ 0 ].tagName ) {
				addElRole( $el, 'button' );
				$el.on( 'keydown', onEnterOrSpaceKey );
			}

			addElLabel( $el, message );
			addElControls( $el, wrapperId );
		};

		const handlePointerDown = () => {
			swiper.a11y.clicked = true;
		};

		const handlePointerUp = () => {
			requestAnimationFrame( () => {
				requestAnimationFrame( () => {
					swiper.a11y.clicked = false;
				} );
			} );
		};

		const handleFocus = ( e ) => {
			if ( swiper.a11y.clicked ) {
				return;
			}
			const slideEl = e.target.closest( `.${swiper.params.slideClass}` );
			if ( !slideEl || !swiper.slides.includes( slideEl ) ) {
				return;
			}
			const isActive = swiper.slides.indexOf( slideEl ) === swiper.activeIndex;
			const isVisible = swiper.params.watchSlidesProgress && swiper.visibleSlides && swiper.visibleSlides.includes( slideEl );
			if ( isActive || isVisible ) {
				return;
			}

			if ( swiper.isHorizontal() ) {
				swiper.el.scrollLeft = 0;
			} else {
				swiper.el.scrollTop = 0;
			}

			swiper.slideTo( swiper.slides.indexOf( slideEl ), 0 );
		};

		const initSlides = () => {
			const params = swiper.params.a11y;

			if ( params.itemRoleDescriptionMessage ) {
				addElRoleDescription( $( swiper.slides ), params.itemRoleDescriptionMessage );
			}

			if ( params.slideRole ) {
				addElRole( $( swiper.slides ), params.slideRole );
			}

			const slidesLength = swiper.params.loop ? swiper.slides.filter( ( el ) => !el.classList.contains( swiper.params.slideDuplicateClass ) ).length : swiper.slides.length;

			if ( params.slideLabelMessage ) {
				swiper.slides.each( ( slideEl, index ) => {
					const $slideEl = $( slideEl );
					const slideIndex = swiper.params.loop ? parseInt( $slideEl.attr( 'data-swiper-slide-index' ), 10 ) : index;
					const ariaLabelMessage = params.slideLabelMessage.replace( /\{\{index\}\}/, slideIndex + 1 ).replace( /\{\{slidesLength\}\}/, slidesLength );
					addElLabel( $slideEl, ariaLabelMessage );
				} );
			}
		};

		const init = () => {
			const params = swiper.params.a11y;
			swiper.$el.append( liveRegion ); // Container

			const $containerEl = swiper.$el;

			if ( params.containerRoleDescriptionMessage ) {
				addElRoleDescription( $containerEl, params.containerRoleDescriptionMessage );
			}

			if ( params.containerMessage ) {
				addElLabel( $containerEl, params.containerMessage );
			} // Wrapper


			const $wrapperEl = swiper.$wrapperEl;
			const wrapperId = params.id || $wrapperEl.attr( 'id' ) || `swiper-wrapper-${getRandomNumber( 16 )}`;
			const live = swiper.params.autoplay && swiper.params.autoplay.enabled ? 'off' : 'polite';
			addElId( $wrapperEl, wrapperId );
			addElLive( $wrapperEl, live ); // Slide

			initSlides(); // Navigation

			let $nextEl;
			let $prevEl;

			if ( swiper.navigation && swiper.navigation.$nextEl ) {
				$nextEl = swiper.navigation.$nextEl;
			}

			if ( swiper.navigation && swiper.navigation.$prevEl ) {
				$prevEl = swiper.navigation.$prevEl;
			}

			if ( $nextEl && $nextEl.length ) {
				initNavEl( $nextEl, wrapperId, params.nextSlideMessage );
			}

			if ( $prevEl && $prevEl.length ) {
				initNavEl( $prevEl, wrapperId, params.prevSlideMessage );
			} // Pagination


			if ( hasClickablePagination() ) {
				swiper.pagination.$el.on( 'keydown', classesToSelector( swiper.params.pagination.bulletClass ), onEnterOrSpaceKey );
			} // Tab focus


			swiper.$el.on( 'focus', handleFocus, true );
			swiper.$el.on( 'pointerdown', handlePointerDown, true );
			swiper.$el.on( 'pointerup', handlePointerUp, true );
		};

		function destroy() {
			if ( liveRegion && 0 < liveRegion.length ) {
				liveRegion.remove();
			}
			let $nextEl;
			let $prevEl;

			if ( swiper.navigation && swiper.navigation.$nextEl ) {
				$nextEl = swiper.navigation.$nextEl;
			}

			if ( swiper.navigation && swiper.navigation.$prevEl ) {
				$prevEl = swiper.navigation.$prevEl;
			}

			if ( $nextEl ) {
				$nextEl.off( 'keydown', onEnterOrSpaceKey );
			}

			if ( $prevEl ) {
				$prevEl.off( 'keydown', onEnterOrSpaceKey );
			} // Pagination


			if ( hasClickablePagination() ) {
				swiper.pagination.$el.off( 'keydown', classesToSelector( swiper.params.pagination.bulletClass ), onEnterOrSpaceKey );
			} // Tab focus


			swiper.$el.off( 'focus', handleFocus, true );
			swiper.$el.off( 'pointerdown', handlePointerDown, true );
			swiper.$el.off( 'pointerup', handlePointerUp, true );
		}

		on( 'beforeInit', () => {
			liveRegion = $( `<span class="${swiper.params.a11y.notificationClass}" aria-live="assertive" aria-atomic="true"></span>` );
		} );
		on( 'afterInit', () => {
			if ( !swiper.params.a11y.enabled ) {
				return;
			}
			init();
		} );
		on( 'slidesLengthChange snapGridLengthChange slidesGridLengthChange', () => {
			if ( !swiper.params.a11y.enabled ) {
				return;
			}
			initSlides();
		} );
		on( 'fromEdge toEdge afterInit lock unlock', () => {
			if ( !swiper.params.a11y.enabled ) {
				return;
			}
			updateNavigation();
		} );
		on( 'paginationUpdate', () => {
			if ( !swiper.params.a11y.enabled ) {
				return;
			}
			updatePagination();
		} );
		on( 'destroy', () => {
			if ( !swiper.params.a11y.enabled ) {
				return;
			}
			destroy();
		} );
	}

	/* eslint no-underscore-dangle: "off" */
	function Autoplay( _ref ) {
		const {
			swiper,
			extendParams,
			on,
			emit
		} = _ref;
		let timeout;
		swiper.autoplay = {
			running: false,
			paused: false
		};
		extendParams( {
			autoplay: {
				enabled: false,
				delay: 3000,
				waitForTransition: true,
				disableOnInteraction: true,
				stopOnLastSlide: false,
				reverseDirection: false,
				pauseOnMouseEnter: false
			}
		} );

		function run() {
			if ( !swiper.size ) {
				swiper.autoplay.running = false;
				swiper.autoplay.paused = false;
				return;
			}

			const $activeSlideEl = swiper.slides.eq( swiper.activeIndex );
			let delay = swiper.params.autoplay.delay;

			if ( $activeSlideEl.attr( 'data-swiper-autoplay' ) ) {
				delay = $activeSlideEl.attr( 'data-swiper-autoplay' ) || swiper.params.autoplay.delay;
			}

			clearTimeout( timeout );
			timeout = nextTick( () => {
				let autoplayResult;

				if ( swiper.params.autoplay.reverseDirection ) {
					if ( swiper.params.loop ) {
						swiper.loopFix();
						autoplayResult = swiper.slidePrev( swiper.params.speed, true, true );
						emit( 'autoplay' );
					} else if ( !swiper.isBeginning ) {
						autoplayResult = swiper.slidePrev( swiper.params.speed, true, true );
						emit( 'autoplay' );
					} else if ( !swiper.params.autoplay.stopOnLastSlide ) {
						autoplayResult = swiper.slideTo( swiper.slides.length - 1, swiper.params.speed, true, true );
						emit( 'autoplay' );
					} else {
						stop();
					}
				} else if ( swiper.params.loop ) {
					swiper.loopFix();
					autoplayResult = swiper.slideNext( swiper.params.speed, true, true );
					emit( 'autoplay' );
				} else if ( !swiper.isEnd ) {
					autoplayResult = swiper.slideNext( swiper.params.speed, true, true );
					emit( 'autoplay' );
				} else if ( !swiper.params.autoplay.stopOnLastSlide ) {
					autoplayResult = swiper.slideTo( 0, swiper.params.speed, true, true );
					emit( 'autoplay' );
				} else {
					stop();
				}

				if ( swiper.params.cssMode && swiper.autoplay.running ) {
					run();
				} else if ( false === autoplayResult ) {
					run();
				}
			}, delay );
		}

		function start() {
			if ( 'undefined' !== typeof timeout ) {
				return false;
			}
			if ( swiper.autoplay.running ) {
				return false;
			}
			swiper.autoplay.running = true;
			emit( 'autoplayStart' );
			run();
			return true;
		}

		function stop() {
			if ( !swiper.autoplay.running ) {
				return false;
			}
			if ( 'undefined' === typeof timeout ) {
				return false;
			}

			if ( timeout ) {
				clearTimeout( timeout );
				timeout = undefined;
			}

			swiper.autoplay.running = false;
			emit( 'autoplayStop' );
			return true;
		}

		function pause( speed ) {
			if ( !swiper.autoplay.running ) {
				return;
			}
			if ( swiper.autoplay.paused ) {
				return;
			}
			if ( timeout ) {
				clearTimeout( timeout );
			}
			swiper.autoplay.paused = true;

			if ( 0 === speed || !swiper.params.autoplay.waitForTransition ) {
				swiper.autoplay.paused = false;
				run();
			} else {
				[ 'transitionend', 'webkitTransitionEnd' ].forEach( ( event ) => {
					swiper.$wrapperEl[ 0 ].addEventListener( event, onTransitionEnd );
				} );
			}
		}

		function onVisibilityChange() {
			const document = getDocument();

			if ( 'hidden' === document.visibilityState && swiper.autoplay.running ) {
				pause();
			}

			if ( 'visible' === document.visibilityState && swiper.autoplay.paused ) {
				run();
				swiper.autoplay.paused = false;
			}
		}

		function onTransitionEnd( e ) {
			if ( !swiper || swiper.destroyed || !swiper.$wrapperEl ) {
				return;
			}
			if ( e.target !== swiper.$wrapperEl[ 0 ] ) {
				return;
			}
			[ 'transitionend', 'webkitTransitionEnd' ].forEach( ( event ) => {
				swiper.$wrapperEl[ 0 ].removeEventListener( event, onTransitionEnd );
			} );
			swiper.autoplay.paused = false;

			if ( !swiper.autoplay.running ) {
				stop();
			} else {
				run();
			}
		}

		function onMouseEnter() {
			if ( swiper.params.autoplay.disableOnInteraction ) {
				stop();
			} else {
				emit( 'autoplayPause' );
				pause();
			}

			[ 'transitionend', 'webkitTransitionEnd' ].forEach( ( event ) => {
				swiper.$wrapperEl[ 0 ].removeEventListener( event, onTransitionEnd );
			} );
		}

		function onMouseLeave() {
			if ( swiper.params.autoplay.disableOnInteraction ) {
				return;
			}

			swiper.autoplay.paused = false;
			emit( 'autoplayResume' );
			run();
		}

		function attachMouseEvents() {
			if ( swiper.params.autoplay.pauseOnMouseEnter ) {
				swiper.$el.on( 'mouseenter', onMouseEnter );
				swiper.$el.on( 'mouseleave', onMouseLeave );
			}
		}

		function detachMouseEvents() {
			swiper.$el.off( 'mouseenter', onMouseEnter );
			swiper.$el.off( 'mouseleave', onMouseLeave );
		}

		on( 'init', () => {
			if ( swiper.params.autoplay.enabled ) {
				start();
				const document = getDocument();
				document.addEventListener( 'visibilitychange', onVisibilityChange );
				attachMouseEvents();
			}
		} );
		on( 'beforeTransitionStart', ( _s, speed, internal ) => {
			if ( swiper.autoplay.running ) {
				if ( internal || !swiper.params.autoplay.disableOnInteraction ) {
					swiper.autoplay.pause( speed );
				} else {
					stop();
				}
			}
		} );
		on( 'sliderFirstMove', () => {
			if ( swiper.autoplay.running ) {
				if ( swiper.params.autoplay.disableOnInteraction ) {
					stop();
				} else {
					pause();
				}
			}
		} );
		on( 'touchEnd', () => {
			if ( swiper.params.cssMode && swiper.autoplay.paused && !swiper.params.autoplay.disableOnInteraction ) {
				run();
			}
		} );
		on( 'destroy', () => {
			detachMouseEvents();

			if ( swiper.autoplay.running ) {
				stop();
			}

			const document = getDocument();
			document.removeEventListener( 'visibilitychange', onVisibilityChange );
		} );
		Object.assign( swiper.autoplay, {
			pause,
			run,
			start,
			stop
		} );
	}

	function appendSlide( slides ) {
		const swiper = this;
		const {
			$wrapperEl,
			params
		} = swiper;

		if ( params.loop ) {
			swiper.loopDestroy();
		}

		if ( 'object' === typeof slides && 'length' in slides ) {
			for ( let i = 0; i < slides.length; i += 1 ) {
				if ( slides[ i ] ) {
					$wrapperEl.append( slides[ i ] );
				}
			}
		} else {
			$wrapperEl.append( slides );
		}

		if ( params.loop ) {
			swiper.loopCreate();
		}

		if ( !params.observer ) {
			swiper.update();
		}
	}

	function prependSlide( slides ) {
		const swiper = this;
		const {
			params,
			$wrapperEl,
			activeIndex
		} = swiper;

		if ( params.loop ) {
			swiper.loopDestroy();
		}

		let newActiveIndex = activeIndex + 1;

		if ( 'object' === typeof slides && 'length' in slides ) {
			for ( let i = 0; i < slides.length; i += 1 ) {
				if ( slides[ i ] ) {
					$wrapperEl.prepend( slides[ i ] );
				}
			}

			newActiveIndex = activeIndex + slides.length;
		} else {
			$wrapperEl.prepend( slides );
		}

		if ( params.loop ) {
			swiper.loopCreate();
		}

		if ( !params.observer ) {
			swiper.update();
		}

		swiper.slideTo( newActiveIndex, 0, false );
	}

	function addSlide( index, slides ) {
		const swiper = this;
		const {
			$wrapperEl,
			params,
			activeIndex
		} = swiper;
		let activeIndexBuffer = activeIndex;

		if ( params.loop ) {
			activeIndexBuffer -= swiper.loopedSlides;
			swiper.loopDestroy();
			swiper.slides = $wrapperEl.children( `.${params.slideClass}` );
		}

		const baseLength = swiper.slides.length;

		if ( 0 >= index ) {
			swiper.prependSlide( slides );
			return;
		}

		if ( index >= baseLength ) {
			swiper.appendSlide( slides );
			return;
		}

		let newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;
		const slidesBuffer = [];

		for ( let i = baseLength - 1; i >= index; i -= 1 ) {
			const currentSlide = swiper.slides.eq( i );
			currentSlide.remove();
			slidesBuffer.unshift( currentSlide );
		}

		if ( 'object' === typeof slides && 'length' in slides ) {
			for ( let i = 0; i < slides.length; i += 1 ) {
				if ( slides[ i ] ) {
					$wrapperEl.append( slides[ i ] );
				}
			}

			newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + slides.length : activeIndexBuffer;
		} else {
			$wrapperEl.append( slides );
		}

		for ( let i = 0; i < slidesBuffer.length; i += 1 ) {
			$wrapperEl.append( slidesBuffer[ i ] );
		}

		if ( params.loop ) {
			swiper.loopCreate();
		}

		if ( !params.observer ) {
			swiper.update();
		}

		if ( params.loop ) {
			swiper.slideTo( newActiveIndex + swiper.loopedSlides, 0, false );
		} else {
			swiper.slideTo( newActiveIndex, 0, false );
		}
	}

	function removeSlide( slidesIndexes ) {
		const swiper = this;
		const {
			params,
			$wrapperEl,
			activeIndex
		} = swiper;
		let activeIndexBuffer = activeIndex;

		if ( params.loop ) {
			activeIndexBuffer -= swiper.loopedSlides;
			swiper.loopDestroy();
			swiper.slides = $wrapperEl.children( `.${params.slideClass}` );
		}

		let newActiveIndex = activeIndexBuffer;
		let indexToRemove;

		if ( 'object' === typeof slidesIndexes && 'length' in slidesIndexes ) {
			for ( let i = 0; i < slidesIndexes.length; i += 1 ) {
				indexToRemove = slidesIndexes[ i ];
				if ( swiper.slides[ indexToRemove ] ) {
					swiper.slides.eq( indexToRemove ).remove();
				}
				if ( indexToRemove < newActiveIndex ) {
					newActiveIndex -= 1;
				}
			}

			newActiveIndex = Math.max( newActiveIndex, 0 );
		} else {
			indexToRemove = slidesIndexes;
			if ( swiper.slides[ indexToRemove ] ) {
				swiper.slides.eq( indexToRemove ).remove();
			}
			if ( indexToRemove < newActiveIndex ) {
				newActiveIndex -= 1;
			}
			newActiveIndex = Math.max( newActiveIndex, 0 );
		}

		if ( params.loop ) {
			swiper.loopCreate();
		}

		if ( !params.observer ) {
			swiper.update();
		}

		if ( params.loop ) {
			swiper.slideTo( newActiveIndex + swiper.loopedSlides, 0, false );
		} else {
			swiper.slideTo( newActiveIndex, 0, false );
		}
	}

	function removeAllSlides() {
		const swiper = this;
		const slidesIndexes = [];

		for ( let i = 0; i < swiper.slides.length; i += 1 ) {
			slidesIndexes.push( i );
		}

		swiper.removeSlide( slidesIndexes );
	}

	function Manipulation( _ref ) {
		const {
			swiper
		} = _ref;
		Object.assign( swiper, {
			appendSlide: appendSlide.bind( swiper ),
			prependSlide: prependSlide.bind( swiper ),
			addSlide: addSlide.bind( swiper ),
			removeSlide: removeSlide.bind( swiper ),
			removeAllSlides: removeAllSlides.bind( swiper )
		} );
	}

	function effectInit( params ) {
		const {
			effect,
			swiper,
			on,
			setTranslate,
			setTransition,
			overwriteParams,
			perspective,
			recreateShadows,
			getEffectParams
		} = params;
		on( 'beforeInit', () => {
			if ( swiper.params.effect !== effect ) {
				return;
			}
			swiper.classNames.push( `${swiper.params.containerModifierClass}${effect}` );

			if ( perspective && perspective() ) {
				swiper.classNames.push( `${swiper.params.containerModifierClass}3d` );
			}

			const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
			Object.assign( swiper.params, overwriteParamsResult );
			Object.assign( swiper.originalParams, overwriteParamsResult );
		} );
		on( 'setTranslate', () => {
			if ( swiper.params.effect !== effect ) {
				return;
			}
			setTranslate();
		} );
		on( 'setTransition', ( _s, duration ) => {
			if ( swiper.params.effect !== effect ) {
				return;
			}
			setTransition( duration );
		} );
		on( 'transitionEnd', () => {
			if ( swiper.params.effect !== effect ) {
				return;
			}

			if ( recreateShadows ) {
				if ( !getEffectParams || !getEffectParams().slideShadows ) {
					return;
				} // remove shadows

				swiper.slides.each( ( slideEl ) => {
					const $slideEl = swiper.$( slideEl );
					$slideEl.find( '.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left' ).remove();
				} ); // create new one

				recreateShadows();
			}
		} );
		let requireUpdateOnVirtual;
		on( 'virtualUpdate', () => {
			if ( swiper.params.effect !== effect ) {
				return;
			}

			if ( !swiper.slides.length ) {
				requireUpdateOnVirtual = true;
			}

			requestAnimationFrame( () => {
				if ( requireUpdateOnVirtual && swiper.slides && swiper.slides.length ) {
					setTranslate();
					requireUpdateOnVirtual = false;
				}
			} );
		} );
	}

	function effectTarget( effectParams, $slideEl ) {
		if ( effectParams.transformEl ) {
			return $slideEl.find( effectParams.transformEl ).css( {
				'backface-visibility': 'hidden',
				'-webkit-backface-visibility': 'hidden'
			} );
		}

		return $slideEl;
	}

	function effectVirtualTransitionEnd( _ref ) {
		const {
			swiper,
			duration,
			transformEl,
			allSlides
		} = _ref;
		const {
			slides,
			activeIndex,
			$wrapperEl
		} = swiper;

		if ( swiper.params.virtualTranslate && 0 !== duration ) {
			let eventTriggered = false;
			let $transitionEndTarget;

			if ( allSlides ) {
				$transitionEndTarget = transformEl ? slides.find( transformEl ) : slides;
			} else {
				$transitionEndTarget = transformEl ? slides.eq( activeIndex ).find( transformEl ) : slides.eq( activeIndex );
			}

			$transitionEndTarget.transitionEnd( () => {
				if ( eventTriggered ) {
					return;
				}
				if ( !swiper || swiper.destroyed ) {
					return;
				}
				eventTriggered = true;
				swiper.animating = false;
				const triggerEvents = [ 'webkitTransitionEnd', 'transitionend' ];

				for ( let i = 0; i < triggerEvents.length; i += 1 ) {
					$wrapperEl.trigger( triggerEvents[ i ] );
				}
			} );
		}
	}

	function EffectFade( _ref ) {
		const {
			swiper,
			extendParams,
			on
		} = _ref;
		extendParams( {
			fadeEffect: {
				crossFade: false,
				transformEl: null
			}
		} );

		const setTranslate = () => {
			const {
				slides
			} = swiper;
			const params = swiper.params.fadeEffect;

			for ( let i = 0; i < slides.length; i += 1 ) {
				const $slideEl = swiper.slides.eq( i );
				const offset = $slideEl[ 0 ].swiperSlideOffset;
				let tx = -offset;
				if ( !swiper.params.virtualTranslate ) {
					tx -= swiper.translate;
				}
				let ty = 0;

				if ( !swiper.isHorizontal() ) {
					ty = tx;
					tx = 0;
				}

				const slideOpacity = swiper.params.fadeEffect.crossFade ? Math.max( 1 - Math.abs( $slideEl[ 0 ].progress ), 0 ) : 1 + Math.min( Math.max( $slideEl[ 0 ].progress, -1 ), 0 );
				const $targetEl = effectTarget( params, $slideEl );
				$targetEl.css( {
					opacity: slideOpacity
				} ).transform( `translate3d(${tx}px, ${ty}px, 0px)` );
			}
		};

		const setTransition = ( duration ) => {
			const {
				transformEl
			} = swiper.params.fadeEffect;
			const $transitionElements = transformEl ? swiper.slides.find( transformEl ) : swiper.slides;
			$transitionElements.transition( duration );
			effectVirtualTransitionEnd( {
				swiper,
				duration,
				transformEl,
				allSlides: true
			} );
		};

		effectInit( {
			effect: 'fade',
			swiper,
			on,
			setTranslate,
			setTransition,
			overwriteParams: () => ( {
				slidesPerView: 1,
				slidesPerGroup: 1,
				watchSlidesProgress: true,
				spaceBetween: 0,
				virtualTranslate: !swiper.params.cssMode
			} )
		} );
	}

	function createShadow( params, $slideEl, side ) {
		const shadowClass = `swiper-slide-shadow${side ? `-${side}` : ''}`;
		const $shadowContainer = params.transformEl ? $slideEl.find( params.transformEl ) : $slideEl;
		let $shadowEl = $shadowContainer.children( `.${shadowClass}` );

		if ( !$shadowEl.length ) {
			$shadowEl = $( `<div class="swiper-slide-shadow${side ? `-${side}` : ''}"></div>` );
			$shadowContainer.append( $shadowEl );
		}

		return $shadowEl;
	}

	function EffectCoverflow( _ref ) {
		const {
			swiper,
			extendParams,
			on
		} = _ref;
		extendParams( {
			coverflowEffect: {
				rotate: 50,
				stretch: 0,
				depth: 100,
				scale: 1,
				modifier: 1,
				slideShadows: true,
				transformEl: null
			}
		} );

		const setTranslate = () => {
			const {
				width: swiperWidth,
				height: swiperHeight,
				slides,
				slidesSizesGrid
			} = swiper;
			const params = swiper.params.coverflowEffect;
			const isHorizontal = swiper.isHorizontal();
			const transform = swiper.translate;
			const center = isHorizontal ? -transform + swiperWidth / 2 : -transform + swiperHeight / 2;
			const rotate = isHorizontal ? params.rotate : -params.rotate;
			const translate = params.depth; // Each slide offset from center

			for ( let i = 0, length = slides.length; i < length; i += 1 ) {
				const $slideEl = slides.eq( i );
				const slideSize = slidesSizesGrid[ i ];
				const slideOffset = $slideEl[ 0 ].swiperSlideOffset;
				const centerOffset = ( center - slideOffset - slideSize / 2 ) / slideSize;
				const offsetMultiplier = 'function' === typeof params.modifier ? params.modifier( centerOffset ) : centerOffset * params.modifier;
				let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
				let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier; // var rotateZ = 0

				let translateZ = -translate * Math.abs( offsetMultiplier );
				let stretch = params.stretch; // Allow percentage to make a relative stretch for responsive sliders

				if ( 'string' === typeof stretch && -1 !== stretch.indexOf( '%' ) ) {
					stretch = parseFloat( params.stretch ) / 100 * slideSize;
				}

				let translateY = isHorizontal ? 0 : stretch * offsetMultiplier;
				let translateX = isHorizontal ? stretch * offsetMultiplier : 0;
				let scale = 1 - ( 1 - params.scale ) * Math.abs( offsetMultiplier ); // Fix for ultra small values

				if ( 0.001 > Math.abs( translateX ) ) {
					translateX = 0;
				}
				if ( 0.001 > Math.abs( translateY ) ) {
					translateY = 0;
				}
				if ( 0.001 > Math.abs( translateZ ) ) {
					translateZ = 0;
				}
				if ( 0.001 > Math.abs( rotateY ) ) {
					rotateY = 0;
				}
				if ( 0.001 > Math.abs( rotateX ) ) {
					rotateX = 0;
				}
				if ( 0.001 > Math.abs( scale ) ) {
					scale = 0;
				}
				const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
				const $targetEl = effectTarget( params, $slideEl );
				$targetEl.transform( slideTransform );
				$slideEl[ 0 ].style.zIndex = -Math.abs( Math.round( offsetMultiplier ) ) + 1;

				if ( params.slideShadows ) {
					// Set shadows
					let $shadowBeforeEl = isHorizontal ? $slideEl.find( '.swiper-slide-shadow-left' ) : $slideEl.find( '.swiper-slide-shadow-top' );
					let $shadowAfterEl = isHorizontal ? $slideEl.find( '.swiper-slide-shadow-right' ) : $slideEl.find( '.swiper-slide-shadow-bottom' );

					if ( 0 === $shadowBeforeEl.length ) {
						$shadowBeforeEl = createShadow( params, $slideEl, isHorizontal ? 'left' : 'top' );
					}

					if ( 0 === $shadowAfterEl.length ) {
						$shadowAfterEl = createShadow( params, $slideEl, isHorizontal ? 'right' : 'bottom' );
					}

					if ( $shadowBeforeEl.length ) {
						$shadowBeforeEl[ 0 ].style.opacity = 0 < offsetMultiplier ? offsetMultiplier : 0;
					}
					if ( $shadowAfterEl.length ) {
						$shadowAfterEl[ 0 ].style.opacity = 0 < -offsetMultiplier ? -offsetMultiplier : 0;
					}
				}
			}
		};

		const setTransition = ( duration ) => {
			const {
				transformEl
			} = swiper.params.coverflowEffect;
			const $transitionElements = transformEl ? swiper.slides.find( transformEl ) : swiper.slides;
			$transitionElements.transition( duration ).find( '.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left' ).transition( duration );
		};

		effectInit( {
			effect: 'coverflow',
			swiper,
			on,
			setTranslate,
			setTransition,
			perspective: () => true,
			overwriteParams: () => ( {
				watchSlidesProgress: true
			} )
		} );
	}

	function EffectCreative( _ref ) {
		const {
			swiper,
			extendParams,
			on
		} = _ref;
		extendParams( {
			creativeEffect: {
				transformEl: null,
				limitProgress: 1,
				shadowPerProgress: false,
				progressMultiplier: 1,
				perspective: true,
				prev: {
					translate: [ 0, 0, 0 ],
					rotate: [ 0, 0, 0 ],
					opacity: 1,
					scale: 1
				},
				next: {
					translate: [ 0, 0, 0 ],
					rotate: [ 0, 0, 0 ],
					opacity: 1,
					scale: 1
				}
			}
		} );

		const getTranslateValue = ( value ) => {
			if ( 'string' === typeof value ) {
				return value;
			}
			return `${value}px`;
		};

		const setTranslate = () => {
			const {
				slides,
				$wrapperEl,
				slidesSizesGrid
			} = swiper;
			const params = swiper.params.creativeEffect;
			const {
				progressMultiplier: multiplier
			} = params;
			const isCenteredSlides = swiper.params.centeredSlides;

			if ( isCenteredSlides ) {
				const margin = slidesSizesGrid[ 0 ] / 2 - swiper.params.slidesOffsetBefore || 0;
				$wrapperEl.transform( `translateX(calc(50% - ${margin}px))` );
			}

			for ( let i = 0; i < slides.length; i += 1 ) {
				const $slideEl = slides.eq( i );
				const slideProgress = $slideEl[ 0 ].progress;
				const progress = Math.min( Math.max( $slideEl[ 0 ].progress, -params.limitProgress ), params.limitProgress );
				let originalProgress = progress;

				if ( !isCenteredSlides ) {
					originalProgress = Math.min( Math.max( $slideEl[ 0 ].originalProgress, -params.limitProgress ), params.limitProgress );
				}

				const offset = $slideEl[ 0 ].swiperSlideOffset;
				const t = [ swiper.params.cssMode ? -offset - swiper.translate : -offset, 0, 0 ];
				const r = [ 0, 0, 0 ];
				let custom = false;

				if ( !swiper.isHorizontal() ) {
					t[ 1 ] = t[ 0 ];
					t[ 0 ] = 0;
				}

				let data = {
					translate: [ 0, 0, 0 ],
					rotate: [ 0, 0, 0 ],
					scale: 1,
					opacity: 1
				};

				if ( 0 > progress ) {
					data = params.next;
					custom = true;
				} else if ( 0 < progress ) {
					data = params.prev;
					custom = true;
				} // set translate


				t.forEach( ( value, index ) => {
					t[ index ] = `calc(${value}px + (${getTranslateValue( data.translate[ index ] )} * ${Math.abs( progress * multiplier )}))`;
				} ); // set rotates

				r.forEach( ( value, index ) => {
					r[ index ] = data.rotate[ index ] * Math.abs( progress * multiplier );
				} );
				$slideEl[ 0 ].style.zIndex = -Math.abs( Math.round( slideProgress ) ) + slides.length;
				const translateString = t.join( ', ' );
				const rotateString = `rotateX(${r[ 0 ]}deg) rotateY(${r[ 1 ]}deg) rotateZ(${r[ 2 ]}deg)`;
				const scaleString = 0 > originalProgress ? `scale(${1 + ( 1 - data.scale ) * originalProgress * multiplier})` : `scale(${1 - ( 1 - data.scale ) * originalProgress * multiplier})`;
				const opacityString = 0 > originalProgress ? 1 + ( 1 - data.opacity ) * originalProgress * multiplier : 1 - ( 1 - data.opacity ) * originalProgress * multiplier;
				const transform = `translate3d(${translateString}) ${rotateString} ${scaleString}`; // Set shadows

				if ( custom && data.shadow || !custom ) {
					let $shadowEl = $slideEl.children( '.swiper-slide-shadow' );

					if ( 0 === $shadowEl.length && data.shadow ) {
						$shadowEl = createShadow( params, $slideEl );
					}

					if ( $shadowEl.length ) {
						const shadowOpacity = params.shadowPerProgress ? progress * ( 1 / params.limitProgress ) : progress;
						$shadowEl[ 0 ].style.opacity = Math.min( Math.max( Math.abs( shadowOpacity ), 0 ), 1 );
					}
				}

				const $targetEl = effectTarget( params, $slideEl );
				$targetEl.transform( transform ).css( {
					opacity: opacityString
				} );

				if ( data.origin ) {
					$targetEl.css( 'transform-origin', data.origin );
				}
			}
		};

		const setTransition = ( duration ) => {
			const {
				transformEl
			} = swiper.params.creativeEffect;
			const $transitionElements = transformEl ? swiper.slides.find( transformEl ) : swiper.slides;
			$transitionElements.transition( duration ).find( '.swiper-slide-shadow' ).transition( duration );
			effectVirtualTransitionEnd( {
				swiper,
				duration,
				transformEl,
				allSlides: true
			} );
		};

		effectInit( {
			effect: 'creative',
			swiper,
			on,
			setTranslate,
			setTransition,
			perspective: () => swiper.params.creativeEffect.perspective,
			overwriteParams: () => ( {
				watchSlidesProgress: true,
				virtualTranslate: !swiper.params.cssMode
			} )
		} );
	}

	// Swiper Class
	const modules = [ Keyboard, Mousewheel, Navigation, Pagination, Lazy, A11y, Autoplay, Manipulation, EffectFade, EffectCoverflow, EffectCreative ];
	Swiper.use( modules );

	return Swiper;

} ) ) );
