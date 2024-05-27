/**
 * Scripts in this file get added inline.
 *
 * This file is separate because we need to load it BEFORE jQuery.
 * It is therefore important to keep this vanilla-JS.
 */

 /**
 * Figure out if a nav should be on collapsed-mode or not.
 *
 * This function is using Vanilla JS instead of jQuery
 * because it needs to run immediately on the page, so before we even load jQuery.
 * If we delay it, then the menus flash before collapsing to mobile on initial load
 *
 * @since 3.0
 * @param {Element} nav - The nav element.
 * @return void
 */
var fusionNavIsCollapsed = function( nav ) {
	var resizeTimer,
        buttons;

	// Toggle the collapse-enabled class.
	if ( window.innerWidth <= nav.getAttribute( 'data-breakpoint' ) ) {
		nav.classList.add( 'collapse-enabled' );

		// New mobile and desktop mode classes.
		nav.classList.remove( 'awb-menu_desktop' );

		// Add aria-expanded prop.
		if ( ! nav.classList.contains( 'expanded' ) ) {
			nav.setAttribute( 'aria-expanded', 'false' );
			window.dispatchEvent( new Event( 'fusion-mobile-menu-collapsed', { 'bubbles': true, 'cancelable': true } ) );
		}

        buttons = nav.querySelectorAll( '.menu-item-has-children.expanded' );
        if ( buttons.length ) {
            buttons.forEach( function( button ) {
                button.querySelector( '.awb-menu__open-nav-submenu_mobile' ).setAttribute( 'aria-expanded', 'false' );
            } );
        }

	} else {

        // Close opened submenus.
        if ( null !== nav.querySelector( '.menu-item-has-children.expanded .awb-menu__open-nav-submenu_click' ) ) {
            nav.querySelector( '.menu-item-has-children.expanded .awb-menu__open-nav-submenu_click' ).click();
        }

		// If not on mobile mode, remove the "collase-enabled" class and set to expanded.
		nav.classList.remove( 'collapse-enabled' );
		nav.classList.add( 'awb-menu_desktop' );

		nav.setAttribute( 'aria-expanded', 'true' );
		if ( null !== nav.querySelector( '.awb-menu__main-ul' ) ) {
			nav.querySelector( '.awb-menu__main-ul' ).removeAttribute( 'style' );
		}
	}

	nav.classList.add( 'no-wrapper-transition' );
	clearTimeout( resizeTimer );
	resizeTimer = setTimeout( () => {
		nav.classList.remove( 'no-wrapper-transition' );
	}, 400 );

	nav.classList.remove( 'loading' );
};

/**
 * Run fusionNavIsCollapsed on all menu elements.
 *
 * @since 3.0
 * @return {void}
 */
var fusionRunNavIsCollapsed = function() {
	var menus = document.querySelectorAll( '.awb-menu' ),
		i;

	for ( i = 0; i < menus.length; i++ ) {
		fusionNavIsCollapsed( menus[ i ] );
	}
};

// Run on initial pageload
fusionRunNavIsCollapsed();

// Run on resize.
window.addEventListener( 'fusion-resize-horizontal', fusionRunNavIsCollapsed );

/**
 * Get the scrollbar-width, and set it as a global var.
 *
 * @since 3.0
 * @see https://stackoverflow.com/questions/986937/how-can-i-get-the-browsers-scrollbar-sizes
 * @return {int}
 */
function avadaGetScrollBarWidth () { // eslint-disable-line no-unused-vars
	var inner = document.createElement( 'p' ),
		outer,
		w1,
		w2;

	inner.style.width = '100%';
	inner.style.height = '200px';

	outer = document.createElement( 'div' );
	outer.style.position = 'absolute';
	outer.style.top = '0px';
	outer.style.left = '0px';
	outer.style.visibility = 'hidden';
	outer.style.width = '200px';
	outer.style.height = '150px';
	outer.style.overflow = 'hidden';
	outer.appendChild( inner );

	document.body.appendChild( outer );
	w1 = inner.offsetWidth;
	outer.style.overflow = 'scroll';
	w2 = inner.offsetWidth;
	if ( w1 == w2 ) {
		w2 = outer.clientWidth;
	}

	document.body.removeChild( outer );

	return jQuery( 'html' ).hasClass( 'awb-scroll' ) && 10 < w1 - w2 ? 10 : w1 - w2;
}
