/* global Modernizr, fusionTabVars */
( function( jQuery ) {

	'use strict';

	// Change active tab when a link containing a tab ID is clicked; on and off page
	jQuery.fn.fusionSwitchTabOnLinkClick = function( $customID ) {

		var $linkHash,
			$linkID;

		// The custom_id is used for on page links

		if ( $customID ) {
			$linkHash = $customID;
		} else {
			$linkHash = ( '#_' === document.location.hash.substring( 0, 2 ) ) ? document.location.hash.replace( '#_', '#' ) : document.location.hash;
		}
		$linkID = ( '#_' === $linkHash.substring( 0, 2 ) ) ? $linkHash.split( '#_' )[ 1 ] : $linkHash.split( '#' )[ 1 ];

		if ( $linkHash && jQuery( this ).find( '.nav-tabs li a[href="' + $linkHash + '"]' ).length ) {
			jQuery( this ).find( '.nav-tabs li' ).removeClass( 'active' );
			jQuery( this ).find( '.nav-tabs li a[href="' + $linkHash + '"]' ).parent().addClass( 'active' );

			jQuery( this ).find( '.tab-content .tab-pane' ).removeClass( 'in' ).removeClass( 'active' );
			jQuery( this ).find( '.tab-content .tab-pane[id="' + $linkID  + '"]' ).addClass( 'in' ).addClass( 'active' );
		}

		if ( $linkHash && jQuery( this ).find( '.nav-tabs li a[id="' + $linkID + '"]' ).length ) {
			jQuery( this ).find( '.nav-tabs li' ).removeClass( 'active' );
			jQuery( this ).find( '.nav-tabs li a[id="' + $linkID + '"]' ).parent().addClass( 'active' );

			jQuery( this ).find( '.tab-content .tab-pane' ).removeClass( 'in' ).removeClass( 'active' );
			jQuery( this ).find( '.tab-content .tab-pane[id="' + jQuery( this ).find( '.nav-tabs li a[id="' + $linkID + '"]' ).attr( 'href' ).split( '#' )[ 1 ] + '"]' ).addClass( 'in' ).addClass( 'active' );
		}

	};
}( jQuery ) );

jQuery( document ).on( 'ready fusion-element-render-fusion_tabs', function( event, cid ) {
	var $targetEl = 'undefined' !== typeof cid ? jQuery( 'div[data-cid="' + cid + '"]' ).find( '.fusion-tabs' ) :  jQuery( '.fusion-tabs' ),
		$navTabs  = 'undefined' !== typeof cid ? jQuery( 'div[data-cid="' + cid + '"]' ).find( '.nav-tabs li' ) :  jQuery( '.nav-tabs li' );

	$targetEl.each( function() {
		jQuery( this ).fusionSwitchTabOnLinkClick();
	} );

	function scrollToTabStart( element ) {
		// Disable in live editor.
		if ( jQuery( element ).parents( '.fusion-builder-live-element' ).length || ! element ) {
			return;
		}

		const navOffset       = jQuery( element ).parents( '.fusion-tabs' ).children( '.nav' ).outerHeight();
		const elementPosition = element ? element.getBoundingClientRect().top : null;
		const paddingTop      = parseInt( window.getComputedStyle( element, null ).paddingTop );
		let stickyOffset      = parseInt( jQuery( element ).parents( '.fusion-tabs' ).css( '--awb-sticky-tabs-offset' ) );
		stickyOffset          = isNaN( stickyOffset ) ? 0 : stickyOffset;

		const offsetPosition  = elementPosition ? Math.floor( elementPosition + window.pageYOffset - stickyOffset - navOffset - paddingTop ) : 0;

		if ( offsetPosition < jQuery( window ).scrollTop() ) {
			window.scrollTo( {
				top: offsetPosition,
				behavior: 'smooth'
			} );
		}
	}
	//On Click Event
	$navTabs.on( 'click', function( e ) {

		var clickedTab           = jQuery( this ),
			tabWrapper           = clickedTab.parents( '.fusion-tabs' ),
			tabContentToActivate = clickedTab.find( '.tab-link' ).attr( 'href' ),
			activeTab            = tabWrapper.find( tabContentToActivate ),
			navTabsHeight,
			isToggle = tabWrapper.hasClass( 'mobile-mode-toggle' ) && clickedTab.parents( '.nav' ).hasClass( 'fusion-mobile-tab-nav' );

			if ( !isToggle ) {
				tabWrapper.find( '.nav li' ).removeClass( 'active' );
			}
			tabWrapper.find( '.nav li a' ).attr( 'tabindex', '-1' );
			clickedTab.children().removeAttr( 'tabindex' );

		if ( activeTab.find( '.fusion-woo-slider' ).length ) {
			navTabsHeight = 0;
			if ( tabWrapper.hasClass( 'horizontal-tabs' ) ) {
				navTabsHeight = tabWrapper.find( '.nav' ).height();
			}
			tabWrapper.height( tabWrapper.find( '.tab-content' ).outerHeight( true ) + navTabsHeight );
		}

		// Reinitialize dynamic content.
		setTimeout( function() {

			// Trigger init for dynamic content.
			jQuery( window ).trigger( 'fusion-dynamic-content-render', activeTab );

			// Make premium sliders, other elements and nicescroll work.
			window.dispatchEvent( new Event( 'fusion-resize-horizontal', { 'bubbles': true, 'cancelable': true } ) );
			jQuery( window ).trigger( 'fusion-resize-vertical' );
			jQuery( window ).trigger( 'resize' );
		}, 350 );

		// Scroll to top of content if sticky tabs enabled.
		if ( tabWrapper.hasClass( 'sticky-tabs' ) && Modernizr.mq( 'only screen and (min-width: ' + ( fusionTabVars.content_break_point - 1 ) + 'px)' ) ) {
			scrollToTabStart( tabWrapper.find( '.tab-pane.active' )[ 0 ] );
		}
		if ( tabWrapper.hasClass( 'mobile-sticky-tabs' ) && Modernizr.mq( 'only screen and (max-width: ' + fusionTabVars.content_break_point + 'px)' ) ) {
			scrollToTabStart( tabWrapper.find( '.tab-pane.active' )[ 0 ] );
		}

		e.preventDefault();
	} );

	if ( 'undefined' !== typeof cid ) {
		const targetTab = jQuery( 'div[data-cid="' + cid + '"]' ).find( '.nav:not(.fusion-mobile-tab-nav) li.active' ).length ? jQuery( 'div[data-cid="' + cid + '"]' ).find( '.nav:not(.fusion-mobile-tab-nav) li.active' ) : $navTabs.first();
		targetTab.trigger( 'click' );
		targetTab.addClass( 'active' );
	}

	if ( Modernizr.mq( 'only screen and (max-width: ' + fusionTabVars.content_break_point + 'px)' ) ) {
		jQuery( '.tabs-vertical' ).addClass( 'tabs-horizontal' ).removeClass( 'tabs-vertical' );
	}

	jQuery( window ).on( 'resize', function() {
		if ( Modernizr.mq( 'only screen and (max-width: ' + fusionTabVars.content_break_point + 'px)' ) ) {
			jQuery( '.tabs-vertical' ).addClass( 'tabs-original-vertical' );
			jQuery( '.tabs-vertical' ).addClass( 'tabs-horizontal' ).removeClass( 'tabs-vertical' );
		} else {
			jQuery( '.tabs-original-vertical' ).removeClass( 'tabs-horizontal' ).addClass( 'tabs-vertical' );
		}
	} );

	// Detect sticky tabs.
	const stickyObserver = new IntersectionObserver( function( entries ) {
		entries.forEach( ( entry ) => {
			// no intersection with screen
			if ( 0 === entry.intersectionRatio ) {
				jQuery( entry.target ).next( '.fusion-tabs' ).addClass( 'is-stuck' );
			} else if ( 1 === entry.intersectionRatio ) {
				jQuery( entry.target ).next( '.fusion-tabs' ).removeClass( 'is-stuck' );
			}
		} );

	}, { threshold: [ 0, 1 ] } );
	const stickyHelper = document.querySelector( '.fusion-tabs-sticky-helper' );
	if ( stickyHelper ) {
		stickyObserver.observe( stickyHelper );
	}

} );

jQuery( window ).on( 'load', function() {

	// Initialize Bootstrap Tabs
	// Initialize vertical tabs content container height
	if ( jQuery( '.vertical-tabs' ).length ) {
		jQuery( '.vertical-tabs .tab-content .tab-pane' ).each( function() {

			var videoWidth;

			if ( jQuery( this ).parents( '.vertical-tabs' ).hasClass( 'clean' ) ) {
				jQuery( this ).css( 'min-height', jQuery( '.vertical-tabs .nav-tabs' ).outerHeight() - 10 );
			} else {
				jQuery( this ).css( 'min-height', jQuery( '.vertical-tabs .nav-tabs' ).outerHeight() );
			}

			if ( jQuery( this ).find( '.video-shortcode' ).length ) {
				videoWidth = parseInt( jQuery( this ).find( '.fusion-video' ).css( 'max-width' ).replace( 'px', '' ), 10 );
				jQuery( this ).css( {
					float: 'none',
					'max-width': videoWidth + 60
				} );
			}
		} );
	}

	jQuery( window ).on( 'resize', function() {
		if ( jQuery( '.vertical-tabs' ).length ) {
			jQuery( '.vertical-tabs .tab-content .tab-pane' ).css( 'min-height', jQuery( '.vertical-tabs .nav-tabs' ).outerHeight() );
		}
	} );

} );

jQuery( window ).on( 'load fusion-sticky-change fusion-resize-horizontal', fusionInitStickyTabs );
function fusionInitStickyTabs() {
	if ( 'object' === typeof window.fusion && 'function' === typeof window.fusion.getHeight ) {
		jQuery( '.sticky-tabs[data-sticky-offset]' ).each( function() {
			jQuery( this )[ 0 ].style.setProperty( '--awb-sticky-tabs-offset', ( window.fusion.getHeight( jQuery( this ).attr( 'data-sticky-offset' ) ) + window.fusion.getAdminbarHeight() ) + 'px' );
		} );
	}
}
