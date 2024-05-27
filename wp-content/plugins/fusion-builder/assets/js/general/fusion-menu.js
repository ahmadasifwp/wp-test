/* global fusionNavIsCollapsed, avadaGetScrollBarWidth, fusionNavMegamenuPosition */

/**
 * Handle clicking the expand/collapse menu on buttons.
 *
 * @since 3.0
 * @param {Element} el - The element we clicked on.
 * @return {void}
 */
var fusionNavClickExpandBtn = function( el ) { // eslint-disable-line no-unused-vars
	var $nav = 'object' == typeof el && 'object' === typeof el.currentTarget ? jQuery( el.currentTarget ).parent() : jQuery( el ).parent();

	// Toglle the "expanded" class.
	$nav.toggleClass( 'expanded' );

	// Toggle the "aria-expanded" property.
	$nav.attr(
		'aria-expanded',
		( 'false' === $nav.attr( 'aria-expanded' ) ) ? 'true' : 'false'
	);

	jQuery( el ).attr(
		'aria-expanded',
		( 'false' === jQuery( el ).attr( 'aria-expanded' ) ) ? 'true' : 'false'
	);

	if ( $nav.hasClass( 'expanded' ) ) {
		$nav.find( 'ul > li' ).find( '> a, > button' ).removeAttr( 'tabindex' );
	} else {
		$nav.find( 'ul > li' ).find( '> a, > button' ).attr( 'tabindex', '-1' );
	}

	fusionNavMobilePosition( $nav[ 0 ] );
};

/**
 * Change aria-expanded status of submenu-toggles on click.
 *
 * @since 3.0
 * @param {Element} el - The element we clicked on.
 * @return {void}
 */
var fusionNavClickExpandSubmenuBtn = function( el ) { // eslint-disable-line no-unused-vars
	var isExpanded,
		$el       = 'object' == typeof el && 'object' === typeof el.target ? jQuery( el.target ) : jQuery( el ),
		$nav      = $el.closest( 'nav' ),
		$parent   = $el.parent();

	if ( ( $nav.hasClass( 'awb-menu_v-stacked' ) && ! $nav.hasClass( 'collapse-enabled' ) ) || ( $nav.hasClass( 'awb-submenu_v-stacked' ) && ! $nav.hasClass( 'collapse-enabled' ) ) ) {
		fusionVerticalSubmenuDirection( $parent, $el );
		fusionNavClickExpandBtn( $el );
		return;
	}

	if ( 'object' === typeof el.target ) {
		el.preventDefault();
	}

	// Mobile mode.
	if ( $nav.hasClass( 'collapse-enabled' ) ) {

		// Accordion mode, close out sibling ones first.
		if ( $nav.hasClass( 'awb-menu_mobile-accordion' ) ) {
			$parent.siblings( '.expanded' ).find( '.awb-menu__open-nav-submenu_mobile' ).trigger( 'click' );
		}
		$parent.children( '.fusion-megamenu-wrapper, .awb-menu__sub-ul, .deep-level' ).slideToggle( 400, function() {
			if ( 'none' === jQuery( this ).css( 'display' ) ) {
				jQuery( this ).css( 'display', '' );
			}
		} );
	} else {

		// Close any already-open item from the parent.
		$nav.find( '.awb-menu__main-li .awb-menu__open-nav-submenu_click, .awb-submenu__main-li .awb-submenu__open-nav-submenu_click' ).each( function( i, button ) {
			var $button = jQuery( button );

			if ( ! $button.parent().find( $el[ 0 ] ).length ) {
				$button.attr( 'aria-expanded', 'false' );
				$button.parent( 'li' ).removeClass( 'expanded' );
			}
		} );

		$parent.children( '.fusion-megamenu-wrapper, .awb-menu__sub-ul, .awb-submenu__sub-ul, .deep-level' ).css( 'display', '' );
	}

	// Toggle currently-clicked item's aria-expanded attribute.
	$el.attr(
		'aria-expanded',
		( 'false' === $el.attr( 'aria-expanded' ) ) ? 'true' : 'false'
	);

	isExpanded = 'true' === $el.attr( 'aria-expanded' );

	if ( isExpanded ) {
		$parent.addClass( 'expanded' );

		// Legacy Megamenu.
		if ( $parent.hasClass( 'fusion-megamenu-menu' ) && 'undefined' !== typeof fusionNavMegamenuPosition ) {
			fusionNavMegamenuPosition( $parent );
		}

		// Flyout submenu.
		if ( $nav.hasClass( 'awb-menu_flyout' ) && ! $nav.hasClass( 'collapse-enabled' ) ) {
			$nav.addClass( 'flyout-submenu-expanded' );

			$nav.parents( '.fusion-row' ).last().addClass( 'fusion-row-on-top' );

			// Close flyout submenu when esc key is pressed.
			jQuery( document ).on( 'keyup.fusion_flyout', function( e ) {
				if ( 'Escape' === e.key ) {
					$el.trigger( 'click' );
				}
			} );

			// Focus if there is search field in submenu.
			if ( 0 < $parent.find( '.fusion-search-form-content' ).length ) {
				setTimeout( function() {
					$parent.find( '.fusion-search-form-content input.s' ).focus();
				}, $nav.data( 'transition-time' ) );
			}

			// Adjust #main z-index to prevent content overlap.
			if ( jQuery( 'body' ).hasClass( 'fusion-builder-live' ) && jQuery( 'body' ).hasClass( 'avada-footer-fx-parallax-effect' ) ) {
				jQuery( 'body' ).addClass( 'avada-flyout-submenu-active' );
			}
		}

		// Search dropdown from caret click.
		if ( $parent.hasClass( 'awb-menu__li_search-dropdown' ) ) {
			setTimeout( function() {
				$parent.find( '.fusion-search-form-content input.s' ).focus();
			}, $nav.data( 'transition-time' ) );
		}
	} else {
		$parent.removeClass( 'expanded' );
		$el.blur();

		// Flyout submenu.
		if ( $nav.hasClass( 'awb-menu_flyout' ) ) {
			$nav.removeClass( 'flyout-submenu-expanded' );

			$nav.parents( '.fusion-row' ).last().removeClass( 'fusion-row-on-top' );

			// Unbind 'close flyout' keyup event.
			jQuery( document ).off( 'keyup.fusion_flyout' );

			// Remove adjustment CSS class.
			if ( jQuery( 'body' ).hasClass( 'avada-flyout-submenu-active' ) ) {
				jQuery( 'body' ).removeClass( 'avada-flyout-submenu-active' );
			}
		}
	}

	fusionNavSubmenuDirection( $parent );
};

/**
 * Fix the mobile-nav width.
 *
 * @since 3.0
 * @param {Element} nav - The nav element.
 * @return {void}
 */
var fusionNavMobilePosition = function( nav ) {
	var $nav = jQuery( nav ),
		$ul = $nav.children( 'ul' );
	if ( $nav.hasClass( 'mobile-size-full-absolute' ) ) {
		if ( $nav.hasClass( 'collapse-enabled' ) ) {
			$ul.offset( { left: 0 } ).css( 'width', 'calc(100vw - ' + avadaGetScrollBarWidth() + 'px' );
		} else {
			$ul.css( {
				'width': '',
				'left': '',
				'right': ''
			} );
		}
	}
};

/**
 * Change direction of submenus if required.
 *
 * @since 3.0
 * @param {Element} el - The parent element.
 * @return {void}
 */
var fusionNavSubmenuDirection = function( el ) {
	var $el          = jQuery( el ),
		row          = $el.closest( '.fusion-row' ),
		rowLeftEdge  = row.offset().left,
		rowWidth     = row.width(),
		rowRightEdge = rowLeftEdge + rowWidth,
		$nav         = $el.closest( 'nav' ),
		subMenu      = $el.children( 'ul' ),
		isRow        = $nav.hasClass( 'awb-menu_row' ) || $nav.hasClass( 'awb-submenu_row' ),
		expandLeft   = $nav.hasClass( 'awb-menu_left' ) || $nav.hasClass( 'awb-submenu_left' ),
		isMegaMenu   = $el.closest( '.fusion-megamenu-wrapper' ).length, // For the submenu position being called when going through a MM, that's why it goes up the DOM tree.
		isRootLevel  = ( isRow && $el.parent()[ 0 ] === $nav.children( 'ul' )[ 0 ] ),
		arrowWidth   = $el.find( '.awb-menu__sub-arrow' ).length ? $el.find( '.awb-menu__sub-arrow' ).outerWidth() : 0,
		subMenuLeft,
		subMenuWidth,
		subMenuRight,
		lastLeft,
		lastRight;

	// ! subMenu.length: In click mode, when top level <li> is clicked, this is where MM gets early exit.
	if ( ! subMenu || isMegaMenu || $nav.hasClass( 'awb-menu_flyout' ) || $nav.hasClass( 'awb-menu_v-stacked' ) || ! subMenu.length ) {
		return;
	}

	// Don't do horizontal corrections for side header submenus.
	if ( jQuery( 'body' ).hasClass( 'side-header' ) && 0 < $nav.closest( '#side-header.fusion-tb-header' ).length ) {
		return;
	}

	lastLeft  = subMenu.css( 'left' );
	lastRight = subMenu.css( 'right' );

	// Set transition and opacity, to make animation work.
	subMenu.css( {
		'left': '',
		'right': '',
		'transition': 'all 0s',
		'opacity': '0'
	} );

	subMenuLeft     = subMenu.offset().left;
	subMenuWidth    = subMenu.width();
	subMenuRight    = subMenuLeft + subMenuWidth;

	// If sub-menu needs to be re-positioned, transition needs to be re-added after positioning.
	if ( ( expandLeft && lastRight !== subMenu.css( 'right' ) ) || ( ! expandLeft && lastLeft !== subMenu.css( 'left' ) ) ) {
		setTimeout( function() {
			subMenu.css( {
				'transition': '',
				'opacity': ''
			} );
		}, 10 );
	} else {
		subMenu.css( {
			'transition': '',
			'opacity': ''
		} );
	}

	if ( expandLeft && subMenuLeft < rowLeftEdge ) {

		// First level submenu.
		if ( isRootLevel ) {
			subMenu.css( 'right', ( ( -1 ) * subMenuWidth ) + subMenu.parent().width() );

		// Second level submenu.
		} else {
			subMenu.css( 'right', ( -1 ) * subMenuWidth );
		}
	} else if ( ! expandLeft && subMenuRight > rowRightEdge ) {

		// First level submenu.
		if ( isRootLevel ) {
			subMenu.css( 'left', ( ( -1 ) * subMenuWidth ) + subMenu.parent().width() );

		// Depper level submenu.
		} else {
			subMenu.css( 'left', ( -1 ) * subMenuWidth );
		}
	}

	// If the li item is more than 2 times wider than the child menu
	// and we're on a row (not column) mode, then we need to reposition
	// the submenu arrows.
	if ( isRow && subMenu.width() < ( ( $el.width() + arrowWidth ) / 2 ) ) {
		$el.addClass( 'reposition-arrows' );
	}
};

/**
 * Expand search to cover the whole nav area.
 *
 * @since 3.0
 * @param {Element} el - The parent element.
 * @return {void}
 */
var fusionNavSearchOverlay = function( el ) {
	var $nav = jQuery( el ).closest( 'nav' );
	$nav.toggleClass( 'has-search-overlay' );

	$nav.addClass( 'menu-element-search-transition' );

	setTimeout( function() {
		$nav.removeClass( 'menu-element-search-transition' );
	}, $nav.data( 'transition-time' ) );

	// Focus on search field.
	if ( $nav.hasClass( 'has-search-overlay' ) ) {
		setTimeout( function() {
			$nav.find( '.awb-menu__search-overlay input[type=search]' ).focus();
		}, $nav.data( 'transition-time' ) );

		$nav.find( '.awb-menu__overlay-search-trigger' ).attr( 'aria-expanded', 'true' );
	} else {
		$nav.find( '.awb-menu__overlay-search-trigger' ).attr( 'aria-expanded', 'false' );
	}
};

/**
 * Handle clicking the close flyout submenu button.
 *
 * @since 3.0
 * @param {Element} el - The element we clicked on.
 * @return {void}
 */
var fusionNavCloseFlyoutSub = function( el ) { // eslint-disable-line no-unused-vars
	var $nav = jQuery( el ).parent();

	fusionNavClickExpandSubmenuBtn( $nav.find( '.expanded > .awb-menu__open-nav-submenu_main' ) );
};

/**
 * Handle changing arrow colors when hovering the 1st submenu item in a dropdown,
 * or when the 1st item is the currently active menu.
 *
 * @see https://github.com/Theme-Fusion/Fusion-Builder/issues/4235#issue-614029893
 *
 * @since 3.0
 */
var fusionNavAltArrowsClass = function( nav ) {
	if ( jQuery( nav ).find( '.awb-menu__sub-arrow' ).length ) {
		jQuery( nav ).find( '.awb-menu__sub-arrow + ul > .awb-menu__sub-li:not(.current-menu-item):first-child' ).on( 'mouseenter mouseleave focus', function( e ) {
			var li = jQuery( this ).closest( '.awb-menu__main-li' );
			if ( ! li.hasClass( 'custom-menu-search' ) && ! jQuery( this ).closest( '.awb-menu__sub-ul' ).hasClass( 'avada-custom-menu-item-contents' ) ) {
				if ( 'mouseenter' === e.handleObj.origType ) {
					li.addClass( 'alt-arrow-child-color' );
					li.children( 'a' ).addClass( 'hover' );
				} else if ( 'mouseleave' === e.handleObj.origType ) {
					li.removeClass( 'alt-arrow-child-color' );
					li.children( 'a' ).removeClass( 'hover' );
				} else {
					li.toggleClass( 'alt-arrow-child-color' );
				}
			}
		} );

		const firstChildActive = jQuery( nav ).find( '.awb-menu__sub-arrow + ul > .awb-menu__sub-li.current-menu-item:first-child' );
		if ( firstChildActive.length ) {
			const li = firstChildActive.closest( '.awb-menu__main-li' );
			li.addClass( 'alt-arrow-child-color' );
		}
	}
};

var fusionNavRunAll = function() {

	var subMenus  = jQuery( '.awb-menu_em-hover .menu-item-has-children, .awb-submenu_em-hover .menu-item-has-children' );

	// Mobile menu expand on toggle click.
	jQuery( '.awb-menu__m-toggle' ).off( 'click.mobileTrigger' ).on( 'click.mobileTrigger', fusionNavClickExpandBtn );

	subMenus.each( function() {
		fusionNavSubmenuDirection( this );
	} );

	subMenus.on( 'mouseenter', function() {
		fusionNavSubmenuDirection( this );
	} );

	// Click mode, it sorts the positioning of the submenus prior to opening.
	jQuery( '.awb-menu__open-nav-submenu_click, .awb-submenu__open-nav-submenu_click' ).parent().each( function() {
		fusionNavSubmenuDirection( this );
	} );

	// Desktop click caret and mobile menu caret.
	jQuery( '.awb-menu__open-nav-submenu_mobile, .awb-menu__open-nav-submenu_click, .awb-submenu__open-nav-submenu_click' ).off( 'click.expandSubmenu' ).on( 'click.expandSubmenu', fusionNavClickExpandSubmenuBtn );

	// Search menu item (in dropdown mode)
	jQuery( '.awb-menu__li_search-dropdown .awb-menu__main-a' ).off( 'click.searchDropdown' ).on( 'click.searchDropdown', function( event ) {
		var $self   = jQuery( this ),
			$parent = $self.parent(),
			$nav    = $self.closest( 'nav' );

		event.preventDefault();

		if ( $self.closest( '.awb-menu' ).hasClass( 'awb-menu_flyout' ) ) {
			$self.siblings( '.awb-menu__open-nav-submenu_mobile' ).trigger( 'click' );
		} else {
			$parent.toggleClass( 'expanded' );
			fusionNavSubmenuDirection( $parent );
		}

		// Focus on search field.
		if ( $parent.hasClass( 'expanded' ) ) {
			setTimeout( function() {
				$parent.find( 'input[type=search]' ).focus();
			}, $nav.data( 'transition-time' ) );
		} else {
			$self.blur();
		}
	} );

	// Flyout submenus enabled, menu items with children (not our search menu item in dropdown mode)
	jQuery( '.awb-menu_flyout .menu-item-has-children:not( .awb-menu__li_search-dropdown ) .awb-menu__main-a' ).off( 'click.flyoutTrigger' ).on( 'click.flyoutTrigger', function( event ) {
		if ( event ) {
			event.preventDefault();
		}

		// Trigger submenu button.
		jQuery( this ).next( '.awb-menu__open-nav-submenu_mobile' ).trigger( 'click' );
	} );

	// Flyout background image reveal.
	jQuery( 'html' ).on( 'mouseenter', '.fusion-no-touch .awb-menu_flyout.awb-menu_desktop .awb-menu__sub-a', function() {
		var $self   = jQuery( this ),
			$parent = $self.parent();

		if ( 'undefined' !== typeof $parent.data( 'item-id' ) ) {
			$self.closest( '.awb-menu' ).find( '.fusion-flyout-menu-backgrounds' ).addClass( 'fusion-flyout-menu-backgrounds-active' ).find( '#item-bg-' + $parent.data( 'item-id' ) ).addClass( 'active' );
			$self.closest( '.awb-menu__sub-ul' ).addClass( 'fusion-transparent-bg' );
		}

	} );

	// Flyout background image hide.
	jQuery( 'html' ).on( 'mouseleave', '.fusion-no-touch .awb-menu_flyout.awb-menu_desktop .awb-menu__sub-a', function() {
		var $self   = jQuery( this ),
			$parent = $self.parent();

		if ( 'undefined' !== typeof $parent.data( 'item-id' ) ) {
			$self.closest( '.awb-menu' ).find( '.fusion-flyout-menu-backgrounds' ).removeClass( 'fusion-flyout-menu-backgrounds-active' ).find( '#item-bg-' + $parent.data( 'item-id' ) ).removeClass( 'active' );
			$self.closest( '.awb-menu__sub-ul' ).removeClass( 'fusion-transparent-bg' );
		}
	} );

	/**
	 * On click mode and mobile mode. If link is empty or hash treat it as a dropdown trigger.
	 */
	jQuery( '.awb-menu:not(.awb-menu_flyout) a, .awb-submenu a' ).on( 'click', function( e ) {
		var $wrapper = jQuery( this ).closest( 'nav' );
		if ( 'undefined' === typeof this.attributes.href || '#' === this.attributes.href.value ) {

			e.preventDefault();

			if ( $wrapper.hasClass( 'awb-menu' ) ) {
				if ( $wrapper.hasClass( 'awb-menu_em-click' ) || $wrapper.hasClass( 'collapse-enabled' ) || $wrapper.hasClass( 'awb-menu_flyout' ) ) {
					jQuery( this ).siblings( '.awb-menu__open-nav-submenu_mobile' ).trigger( 'click.expandSubmenu' );
				}
			} else if ( $wrapper.hasClass( 'awb-submenu_em-click' ) ) {
				jQuery( this ).siblings( '.awb-submenu__open-nav-submenu_mobile' ).trigger( 'click.expandSubmenu' );
			}
		}
	} );

	jQuery( '.awb-menu.collapse-enabled' ).each( function( i, nav ) {
		var $nav = jQuery( nav );
		if ( ( $nav.hasClass( 'mobile-size-full-absolute' ) || $nav.hasClass( 'mobile-size-relative' ) ) && $nav.hasClass( 'mobile-mode-collapse-to-button' ) ) {
			jQuery( nav ).children( 'ul' ).offset( { left: 0 } );
		}
	} );

	// Collapse mobile menus when on page anchors are clicked.
	jQuery( '.awb-menu a[href^="#"]' ).on( 'click', function() {
		var $target = jQuery( this.hash ),
			$nav    = jQuery( this ).closest( '.awb-menu' );

		// Do nothing if not in mobile mode or mobile menu is not absolute.
		if ( ! $nav.hasClass( 'collapse-enabled' ) || ( ! $nav.hasClass( 'mobile-size-full-absolute' ) && ! $nav.hasClass( 'mobile-size-column-absolute' ) ) ) {
			return;
		}

		if ( $target.length && '' !== this.hash.slice( 1 ) ) {
			$nav.find( '.awb-menu__m-toggle' ).trigger( 'click' );
		}
	} );

	// Vertical menu stacked submenu mode.
	jQuery( '.awb-menu_v-stacked.awb-menu_em-hover .awb-menu__li' ).off( 'mouseenter.verticalMenu' ).on( 'mouseenter.verticalMenu', function() {
		if ( jQuery( this ).find( '.current-menu-item' ).length ) {
			return;
		}
		jQuery( this ).stop();
		fusionVerticalSubmenuDirection( jQuery( this ) );
		jQuery( this ).children( '.awb-menu__sub-a, .awb-menu__main-a' ).find( '.awb-menu__open-nav-submenu-hover' ).attr( 'aria-expanded', 'true' );
	} );

	jQuery( '.awb-menu_v-stacked.awb-menu_em-hover .awb-menu__li' ).off( 'mouseleave.verticalMenu' ).on( 'mouseleave.verticalMenu', function() {
		if ( jQuery( this ).find( '.current-menu-item' ).length ) {
			return;
		}
		jQuery( this ).stop();
		fusionVerticalSubmenuDirection( jQuery( this ) );
		jQuery( this ).children( '.awb-menu__sub-a, .awb-menu__main-a' ).find( '.awb-menu__open-nav-submenu-hover' ).attr( 'aria-expanded', 'false' );
	} );

	// Vertical submenu Accordion submenu mode.
	jQuery( '.awb-submenu_v-stacked.awb-submenu_em-hover .awb-submenu__li' ).off( 'mouseenter.verticalMenu' ).on( 'mouseenter.verticalMenu', function() {
		if ( jQuery( this ).find( '.current-menu-item' ).length ) {
			return;
		}
		jQuery( this ).stop();
		fusionVerticalSubmenuDirection( jQuery( this ) );
		jQuery( this ).children( '.awb-submenu__sub-a, .awb-submenu__main-a' ).find( '.awb-submenu__open-nav-submenu-hover' ).attr( 'aria-expanded', 'true' );
	} );

	jQuery( '.awb-submenu_v-stacked.awb-submenu_em-hover .awb-submenu__li' ).off( 'mouseleave.verticalMenu' ).on( 'mouseleave.verticalMenu', function() {
		if ( jQuery( this ).find( '.current-menu-item' ).length ) {
			return;
		}
		jQuery( this ).stop();
		fusionVerticalSubmenuDirection( jQuery( this ) );
		jQuery( this ).children( '.awb-submenu__sub-a, .awb-submenu__main-a' ).find( '.awb-submenu__open-nav-submenu-hover' ).attr( 'aria-expanded', 'false' );
	} );

	// Expand current page menu item.
	if ( jQuery( '.awb-menu_v-stacked .awb-menu__sub-li.current-menu-item' ).length ) {
		jQuery( '.awb-menu_v-stacked .awb-menu__sub-li.current-menu-item' ).each( function() {
			jQuery( this ).parents( '.awb-menu__sub-ul' ).addClass( 'is-opened' );
			jQuery( this ).parents( '.awb-menu__li' ).each( function() {
				jQuery( this ).children( '.awb-menu__open-nav-submenu_mobile' ).attr( 'aria-expanded', 'true' );
				jQuery( this ).children( '.awb-menu__main-a' ).find( '.awb-menu__open-nav-submenu-hover' ).attr( 'aria-expanded', 'true' );
				jQuery( this ).children( '.awb-menu__sub-a' ).find( '.awb-menu__open-nav-submenu-hover' ).attr( 'aria-expanded', 'true' );
			} );

		} );
	}

	// Expand current page menu item in submenu.
	if ( jQuery( '.awb-submenu_v-stacked .awb-submenu__sub-li.current-menu-item' ).length ) {
		jQuery( '.awb-submenu_v-stacked .awb-submenu__sub-li.current-menu-item' ).each( function() {
			jQuery( this ).parents( '.awb-submenu__sub-ul' ).show();
			jQuery( this ).parents( '.awb-submenu__li' ).each( function() {
				jQuery( this ).children( '.awb-submenu__open-nav-submenu_mobile' ).attr( 'aria-expanded', 'true' );
				jQuery( this ).children( '.awb-submenu__main-a' ).find( '.awb-submenu__open-nav-submenu-hover' ).attr( 'aria-expanded', 'true' );
				jQuery( this ).children( '.awb-submenu__sub-a' ).find( '.awb-submenu__open-nav-submenu-hover' ).attr( 'aria-expanded', 'true' );
			} );

		} );
	}
};

/**
 * Adjusts mobile nav position when sticky is enabled.
 *
 * @since 3.0
 */
var fusionAdjustNavMobilePosition =  function() {
	setTimeout( function() {
		fusionNavMobilePosition( jQuery( '.awb-menu.expanded[aria-expanded="true"]' ) );
	}, 50 );
};

/**
 * Init.
 *
 * @since 3.0
 */
jQuery( window ).on( 'load', function() {
	var navs = jQuery( '.awb-menu, .awb-submenu' );

	// Initial run when the page loads.
	navs.each( function( i, nav ) {
		fusionNavAltArrowsClass( nav );
		fusionNavIsCollapsed( nav );
	} );

	jQuery( '.fusion-close-search, .awb-menu__overlay-search-trigger' ).on( 'click', function( event ) {
		if ( event ) {
			event.preventDefault();
		}

		fusionNavSearchOverlay( this );
	} );
} );

/**
 * Handle events on the live-builder.
 *
 * @since 3.0
 */
jQuery( window ).on( 'fusion-element-render-fusion_menu fusion-element-render-fusion_submenu', function( event, cid ) {
	var nav = jQuery( '[data-cid="' + cid + '"] .awb-menu, [data-cid="' + cid + '"] .awb-submenu' );
	fusionNavRunAll();

	if ( nav.length ) {
		fusionNavAltArrowsClass( nav[ 0 ] );
		fusionNavIsCollapsed( nav[ 0 ] );
	}

} );

/**
 * Closes open menu item on click outside.
 *
 * @since 3.9.2
 */
jQuery( document ).click( function( event ) {
  const $target = jQuery( event.target );

	if ( ! $target.closest( '.awb-menu' ).length && jQuery( '.close-on-outer-click-yes .menu-item-has-children.expanded .awb-menu__open-nav-submenu_click' ).length ) {
    jQuery( '.close-on-outer-click-yes .menu-item-has-children.expanded .awb-menu__open-nav-submenu_click' ).trigger( 'click' );
  }
} );


/**
 * Adjusts mobile menu position when menu is collapsed.
 *
 * @since 3.0
 */
jQuery( window ).on( 'fusion-mobile-menu-collapsed', function() {
	var $nav = jQuery( '.awb-menu.mobile-mode-collapse-to-button.mobile-size-full-absolute[aria-expanded="false"]' );

	$nav.find( 'ul > li' ).find( '> a, > button' ).attr( 'tabindex', '-1' );
	$nav.children( 'ul' ).offset( { left: 0 } );
} );


jQuery( document ).ready( fusionNavRunAll );
jQuery( window ).on( 'fusion-sticky-change fusion-resize-horizontal', fusionAdjustNavMobilePosition );

// Remove / add .menu-item-has-children when cart is updated.
jQuery( document.body ).on( 'wc_fragments_refreshed wc_fragments_loaded', function() {

	jQuery( '.awb-menu .fusion-menu-cart' ).each( function() {

		// Cart items are disabled.
		if ( 0 === jQuery( this ).children( '.fusion-menu-cart-items' ).length ) {
			return;
		}

		if ( jQuery( this ).children( '.fusion-menu-cart-items' ).hasClass( 'avada-custom-menu-item-contents-empty' ) ) {
			jQuery( this ).removeClass( 'menu-item-has-children' ).addClass( 'empty-cart' );
		} else {
			jQuery( this ).addClass( 'menu-item-has-children' ).removeClass( 'empty-cart' );

			// Re-run fusionNavSubmenuDirection() when cart is updated.
			fusionNavSubmenuDirection( jQuery( this ) );
		}
	} );
} );

function fusionVerticalSubmenuDirection( el ) {
	const $nav = el.closest( 'nav' );
	const subUl = el.children( '.awb-menu__sub-ul, .awb-submenu__sub-ul' );
	const transitionTime = el.closest( '.awb-menu, .awb-submenu' ).data( 'transition-time' ) || 400;

	if ( ! subUl.length ) {
		return;
	}

	if ( $nav.hasClass( 'awb-menu_cm_accordion' ) || $nav.hasClass( 'awb-submenu_cm_accordion' ) ) {
		const subUls = $nav.find( '.awb-menu__sub-ul, .awb-submenu__sub-ul' );

		subUls.each( function() {
			if ( !jQuery.contains( el[ 0 ], this ) && !jQuery.contains( this, el[ 0 ] ) ) {
				jQuery( this ).slideUp( transitionTime );
				jQuery( this ).closest( '.menu-item' ).find( '.awb-submenu__open-nav-submenu_click' ).attr( 'aria-expanded', 'false' );
				jQuery( this ).closest( '.menu-item' ).removeClass( 'expanded' );
			}
		} );
	}
	subUl.slideToggle( transitionTime );

}
