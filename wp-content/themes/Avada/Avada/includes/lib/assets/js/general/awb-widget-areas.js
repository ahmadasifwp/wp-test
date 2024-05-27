/* global fusion, Modernizr, avadaSidebarsVars, fusionGetStickyOffset */
jQuery( document ).ready( function() {
	var sidebar1Float,
		topOffset = calcStickySidebarOffset();

	// Sidebar Position
	if ( 1 <= jQuery( '#sidebar-2' ).length ) {
		sidebar1Float = jQuery( '#sidebar' ).css( 'float' );
		jQuery( 'body' ).addClass( 'sidebar-position-' + sidebar1Float );
	}

	setStickySidebarStatus( topOffset );

	jQuery( window ).on( 'fusion-resize-vertical', function() {
		fusionReSettStickySidebarStatus();
	} );
} );

function fusionReSettStickySidebarStatus() {
	setStickySidebarStatus( calcStickySidebarOffset() );
}

function setStickySidebarStatus( topOffset ) {
	var mediaQuerySidebarBreakpoint = Modernizr.mq( 'only screen and (max-width:' + avadaSidebarsVars.sidebar_break_point + 'px)' );

	// Desktop mode.
	if ( ! mediaQuerySidebarBreakpoint && Math.floor( jQuery( '#content' ).height() ) >= Math.floor( jQuery( '#main' ).height() ) ) {
		if ( ! jQuery( '.fusion-sidebar-left.fusion-sticky-sidebar .fusion-sidebar-inner-content' ).hasClass( 'fusion-sidebar-stuck' ) ) {
			jQuery( '.fusion-sidebar-left.fusion-sticky-sidebar .fusion-sidebar-inner-content' ).stick_in_parent( {
				parent: '#main > .fusion-row',
				sticky_class: 'fusion-sidebar-stuck',
				bottoming: true,
				spacer: false,
				offset_top: topOffset
			} ).on( 'sticky_kit:stick', function( event ) {
				var stickySidebarLeft = jQuery( event.target );
				if ( jQuery( 'body' ).hasClass( 'double-sidebars' ) ) {
					stickySidebarLeft.css( 'margin-left', '0' );
					stickySidebarLeft.parent().css( {
						'margin-left': stickySidebarLeft.data( 'margin' ),
						width: stickySidebarLeft.data( 'width' )
					} );
				}

				// Avada Builder Live Shortcut positioning.
				if ( stickySidebarLeft.parent().children( '.fusion-panel-shortcuts-wrapper' ).length ) {
					stickySidebarLeft.parent().removeClass( 'fusion-panel-customizable-needs-positioned' );
					stickySidebarLeft.prepend( stickySidebarLeft.parent().children( '.fusion-panel-shortcuts-wrapper' ) );
				}
			} ).on( 'sticky_kit:unstick', function( event ) {
				var stickySidebarLeft = jQuery( event.target );
				if ( jQuery( 'body' ).hasClass( 'double-sidebars' ) ) {
					stickySidebarLeft.css( 'margin-left', stickySidebarLeft.data( 'margin' ) );
				}

				// Avada Builder Live Shortcut positioning.
				if ( stickySidebarLeft.children( '.fusion-panel-shortcuts-wrapper' ).length ) {
					stickySidebarLeft.parent().addClass( 'fusion-panel-customizable-needs-positioned' );
					stickySidebarLeft.parent().prepend( stickySidebarLeft.children( '.fusion-panel-shortcuts-wrapper' ) );
				}
			} );
		}

		if ( ! jQuery( '.fusion-sidebar-right.fusion-sticky-sidebar .fusion-sidebar-inner-content' ).hasClass( 'fusion-sidebar-stuck' ) ) {
			jQuery( '.fusion-sidebar-right.fusion-sticky-sidebar .fusion-sidebar-inner-content' ).stick_in_parent( {
				parent: '#main > .fusion-row',
				sticky_class: 'fusion-sidebar-stuck',
				bottoming: true,
				spacer: false,
				offset_top: topOffset
			} ).on( 'sticky_kit:stick', function( event ) {
				var stickySidebarRight = jQuery( event.target );

				if ( jQuery( 'body' ).hasClass( 'double-sidebars' ) ) {
					stickySidebarRight.css( 'margin-left', '0' );
					stickySidebarRight.parent().css( {
						'margin-left': stickySidebarRight.data( 'margin' ),
						width: stickySidebarRight.data( 'width' )
					} );
				}

				// Avada Builder Live SHortcut positioning.
				if ( stickySidebarRight.parent().children( '.fusion-panel-shortcuts-wrapper' ).length ) {
					stickySidebarRight.parent().removeClass( 'fusion-panel-customizable-needs-positioned' );
					stickySidebarRight.prepend( stickySidebarRight.parent().children( '.fusion-panel-shortcuts-wrapper' ) );
				}
			} ).on( 'sticky_kit:unstick', function( event ) {
				var stickySidebarRight = jQuery( event.target );

				if ( jQuery( 'body' ).hasClass( 'double-sidebars' ) ) {
					stickySidebarRight.css( 'margin-left', stickySidebarRight.data( 'margin' ) );
				}

				// Avada Builder Live SHortcut positioning.
				if ( stickySidebarRight.children( '.fusion-panel-shortcuts-wrapper' ).length ) {
					stickySidebarRight.parent().addClass( 'fusion-panel-customizable-needs-positioned' );
					stickySidebarRight.parent().prepend( stickySidebarRight.children( '.fusion-panel-shortcuts-wrapper' ) );
				}
			} );
		}

		// Mobile mode.
	} else {
		jQuery( '.fusion-sidebar-left.fusion-sticky-sidebar .fusion-sidebar-inner-content' ).trigger( 'sticky_kit:detach' );
		jQuery( '.fusion-sidebar-right.fusion-sticky-sidebar .fusion-sidebar-inner-content' ).trigger( 'sticky_kit:detach' );
	}
}

function calcStickySidebarOffset() {
	var topOffset    = fusion.getAdminbarHeight() + 50,
		customOffset = false;

	// Custom header handling.
	if ( jQuery( '.fusion-tb-header' ).length && 'function' === typeof fusionGetStickyOffset ) {
		customOffset = fusionGetStickyOffset();
		if ( customOffset ) {
			return customOffset + topOffset;
		}
		return topOffset;
	}

	// Top header and sticky header being activated.
	if ( 'top' === avadaSidebarsVars.header_position && avadaSidebarsVars.header_sticky && jQuery( '.fusion-header' ).length ) {

		// Header v4 or v5 need special cheks.
		if ( 'v4' === avadaSidebarsVars.header_layout || 'v5' === avadaSidebarsVars.header_layout ) {

			// Only menu will be sticky.
			if ( 'menu_only' === avadaSidebarsVars.header_sticky_type2_layout ) {
				topOffset += jQuery( '.fusion-secondary-main-menu' ).height();

				// Menu and logo area will be sticky, no shrinking.
			} else {
				topOffset += jQuery( '.fusion-sticky-header-wrapper' ).height();
			}
		} else if ( avadaSidebarsVars.sticky_header_shrinkage ) { // Sticky can be shrinked.
			topOffset += 66;
		} else { // Sticky has fixed height.
			topOffset += jQuery( '.fusion-header' ).height();
		}
	}
	return topOffset;
}
