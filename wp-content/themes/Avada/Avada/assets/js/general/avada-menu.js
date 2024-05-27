/* global fusion, avadaMenuVars, Modernizr, avadaHeaderVars */
/* eslint max-depth: 0 */
jQuery( document ).ready( function() {

	'use strict';

	var iframeLoaded;

	// SVG arrow class check.
	if ( jQuery( '.fusion-dropdown-svg' ).length ) {
		jQuery( '.fusion-dropdown-svg' ).each( function() {
			var firstChild = jQuery( this ).parents( 'li' ).find( '> .sub-menu > li:first-child' );
			if ( jQuery( firstChild ).hasClass( 'current-menu-item' ) || jQuery( firstChild ).hasClass( 'current-menu-parent' ) || jQuery( firstChild ).hasClass( 'current_page_item' ) ) {
				jQuery( this ).addClass( 'fusion-svg-active' );
			}
			jQuery( firstChild ).not( '.current-menu-item, .current-menu-parent, .current_page_item' ).find( '> a' ).on( 'mouseenter mouseleave', function() {
				jQuery( this ).parents( 'li' ).find( '.fusion-dropdown-svg' ).toggleClass( 'fusion-svg-active' );
			} );
		} );
	}

	// Position dropdown menu correctly
	jQuery.fn.fusion_position_menu_dropdown = function() {
		if ( ( 'top' === avadaMenuVars.header_position && ! jQuery( 'body.rtl' ).length ) || 'left' === avadaMenuVars.header_position ) {
			return jQuery( this ).children( '.sub-menu' ).each( function() {

				var submenu = jQuery( this ),
					submenuPosition,
					submenuLeft,
					submenuTop,
					submenuHeight,
					submenuWidth,
					submenuBottomEdge,
					submenuRightEdge,
					viewportRight,
					submenuNewTopPos,
					adminbarHeight,
					viewportTop,
					viewportHeight,
					viewportBottom,
					submenuLis,
					submenuJoined;

				// Reset attributes.
				submenu.removeAttr( 'style' );
				submenu.show();
				submenu.removeData( 'shifted' );

				if ( submenu.length ) {
					submenuPosition   = submenu.offset();
					submenuLeft       = submenuPosition.left;
					submenuTop        = submenuPosition.top;
					submenuHeight     = submenu.height();
					submenuWidth      = submenu.outerWidth();
					submenuBottomEdge = submenuTop + submenuHeight;
					submenuRightEdge  = submenuLeft + submenuWidth;
					adminbarHeight    = fusion.getAdminbarHeight();
					viewportTop       = jQuery( window ).scrollTop();
					viewportHeight    = jQuery( window ).height();
					viewportBottom    = viewportTop + viewportHeight;
					viewportRight     = jQuery( window ).width();

					// Current submenu goes beyond browser's right edge
					if ( submenuRightEdge > viewportRight ) {

						submenu.addClass( 'fusion-switched-side' );

						// First level submenu
						if ( ! submenu.parent().parent( '.sub-menu' ).length ) {
							submenu.css( 'left', ( ( -1 ) * submenuWidth ) + submenu.parent().width() );

						// Second level submenu
						} else {
							submenu.css( {
								left: ( -1 ) * submenuWidth
							} );
						}

						submenu.data( 'shifted', 1 );

					// Parent submenu had to be shifted
					} else if ( submenu.parent().parent( '.sub-menu' ).length ) {
						submenu.removeClass( 'fusion-switched-side' );
						if ( submenu.parent().parent( '.sub-menu' ).data( 'shifted' ) ) {
							submenu.css( 'left', ( -1 ) * submenuWidth );
							submenu.data( 'shifted', 1 );
						}
					}

					// Calculate dropdown vertical position on side header.
					if ( 'top' !== avadaMenuVars.header_position && submenuBottomEdge > viewportBottom ) {

						// Sub-menu is smaller than viewport, move it up as needed.
						if ( submenuHeight < viewportBottom ) {
							submenuNewTopPos = ( -1 ) * ( submenuBottomEdge - viewportBottom + 10 );
						} else {

							// Sub-menu is larger than viewport, move it up to the top of viewport - admin bar.
							submenuNewTopPos = ( -1 ) * ( submenuTop - viewportTop - adminbarHeight );
						}

						// Arrow can be between items, so disable hover change for svg.
						if ( jQuery( '.fusion-dropdown-svg' ).length ) {
							submenu.find( '> li > a' ).off( 'mouseenter mouseleave' );
							submenu.parents( 'li' ).find( '.fusion-dropdown-svg' ).removeClass( 'fusion-svg-active' );

							submenuLis = Math.floor( submenuNewTopPos / submenu.find( 'li' ).outerHeight() );
							submenuNewTopPos  = submenuLis * submenu.find( 'li' ).outerHeight();
							submenuJoined = submenu.find( '> li:nth-child( ' + ( Math.abs( submenuLis ) + 1 ) + ')' );

							if ( jQuery( submenuJoined ).hasClass( 'current-menu-item' ) || jQuery( submenuJoined ).hasClass( 'current-menu-parent' ) || jQuery( submenuJoined ).hasClass( 'current_page_item' ) ) {
								submenu.parents( 'li' ).find( '.fusion-dropdown-svg' ).addClass( 'fusion-svg-active' );
							}
							jQuery( submenuJoined ).not( '.current-menu-item, .current-menu-parent, .current_page_item' ).find( '> a' ).on( 'mouseenter mouseleave', function() {
								submenu.parents( 'li' ).find( '.fusion-dropdown-svg' ).toggleClass( 'fusion-svg-active' );
							} );
						}

						submenu.css( 'top', submenuNewTopPos );

					}
				}
			} );
		}
		return jQuery( this ).children( '.sub-menu' ).each( function() {

			var submenu,
				submenuPosition,
				submenuLeftEdge,
				submenuTop,
				submenuHeight,
				submenuWidth,
				submenuBottomEdge,
				adminbarHeight,
				viewportTop,
				viewportHeight,
				viewportBottom,
				submenuNewTopPos,
				cssPosition,
				submenuLis,
				submenuJoined;

			// Reset attributes
			jQuery( this ).removeAttr( 'style' );
			jQuery( this ).removeData( 'shifted' );

			submenu = jQuery( this );

			if ( submenu.length ) {
				submenuPosition   = submenu.offset();
				submenuLeftEdge   = submenuPosition.left;
				submenuTop        = submenuPosition.top;
				submenuHeight     = submenu.height();
				submenuWidth      = submenu.outerWidth();
				submenuBottomEdge = submenuTop + submenuHeight;
				adminbarHeight    = fusion.getAdminbarHeight();
				viewportTop       = jQuery( window ).scrollTop();
				viewportHeight    = jQuery( window ).height();
				viewportBottom    = viewportTop + viewportHeight;

				cssPosition = 'right';

				// Current submenu goes beyond browser's left edge
				if ( 0 > submenuLeftEdge ) {

					submenu.addClass( 'fusion-switched-side' );

					// First level submenu
					if ( ! submenu.parent().parent( '.sub-menu' ).length ) {
						submenu.css( cssPosition, ( ( -1 ) * submenuWidth ) + submenu.parent().width() );

						// Second level submenu
					} else if ( submenuLeftEdge <  submenuWidth ) {
						submenu.attr( 'style', cssPosition + ':' + ( -1  * submenuWidth ) + 'px !important' );
					} else {
						submenu.css( cssPosition, ( -1 ) * submenuWidth );
					}

					submenu.data( 'shifted', 1 );

					// Parent submenu had to be shifted
				} else if ( submenu.parent().parent( '.sub-menu' ).length ) {
					submenu.removeClass( 'fusion-switched-side' );
					if ( submenu.parent().parent( '.sub-menu' ).data( 'shifted' ) ) {
						submenu.css( cssPosition, ( -1 ) * submenuWidth );
					}
				}

				// Calculate dropdown vertical position on side header.
				if ( 'top' !== avadaMenuVars.header_position && submenuBottomEdge > viewportBottom ) {

					// Sub-menu is smaller than viewport, move it up as needed.
					if ( submenuHeight < viewportBottom ) {
						submenuNewTopPos = ( -1 ) * ( submenuBottomEdge - viewportBottom + 10 );
					} else {

						// Sub-menu is larger than viewport, move it up to the top of viewport - admin bar.
						submenuNewTopPos = ( -1 ) * ( submenuTop - viewportTop - adminbarHeight );
					}

					// Arrow can be between items, so disable hover change for svg.
					if ( jQuery( '.fusion-dropdown-svg' ).length ) {
						submenu.find( '> li > a' ).off( 'mouseenter mouseleave' );
						submenu.parents( 'li' ).find( '.fusion-dropdown-svg' ).removeClass( 'fusion-svg-active' );

						submenuLis = Math.floor( submenuNewTopPos / submenu.find( 'li' ).outerHeight() );
						submenuNewTopPos  = submenuLis * submenu.find( 'li' ).outerHeight();
						submenuJoined = submenu.find( '> li:nth-child( ' + ( Math.abs( submenuLis ) + 1 ) + ')' );

						if ( jQuery( submenuJoined ).hasClass( 'current-menu-item' ) || jQuery( submenuJoined ).hasClass( 'current-menu-parent' ) || jQuery( submenuJoined ).hasClass( 'current_page_item' ) ) {
							submenu.parents( 'li' ).find( '.fusion-dropdown-svg' ).addClass( 'fusion-svg-active' );
						}
						jQuery( submenuJoined ).not( '.current-menu-item, .current-menu-parent, .current_page_item' ).find( '> a' ).on( 'mouseenter mouseleave', function() {
							submenu.parents( 'li' ).find( '.fusion-dropdown-svg' ).toggleClass( 'fusion-svg-active' );
						} );
					}

					submenu.css( 'top', submenuNewTopPos );
				}
			}
		} );

	};

	// Recursive function for positioning menu items correctly on load
	jQuery.fn.walk_through_menu_items = function() {
		jQuery( this ).fusion_position_menu_dropdown();

		if ( jQuery( this ).find( '.sub-menu' ).length ) {
			jQuery( this ).find( '.sub-menu li' ).walk_through_menu_items();
		}
	};

	// Position the cart dropdown vertically on side-header layouts.
	jQuery.fn.position_cart_dropdown = function() {
		if ( 'top' !== avadaMenuVars.header_position ) {
			jQuery( this ).find( '.fusion-menu-cart-items' ).each( function() {
				var cartDropdown       = jQuery( this ),
					cartDropdownHeight = cartDropdown.height(),
					adminbarHeight     = fusion.getAdminbarHeight(),
					viewportTop        = jQuery( window ).scrollTop(),
					viewportHeight     = jQuery( window ).height(),
					viewportBottom     = viewportTop + viewportHeight,
					cartDropdownTop,
					cartDropdownBottom,
					cartDropdownNewTopPos;

				cartDropdown.css( 'top', '' );
				cartDropdownTop        = cartDropdown.offset().top;
				cartDropdownBottom = cartDropdownTop + cartDropdownHeight;

				// Cart dropdown overflows viewport.
				if ( cartDropdownBottom > viewportBottom ) {

					// Cart dropdown is smaller than viewport, move it up as needed.
					if ( cartDropdownHeight < viewportHeight ) {
						cartDropdownNewTopPos = ( -1 ) * ( cartDropdownBottom - viewportBottom + 10 );
					} else {

						// Cart dropdown is larger than viewport, move it up to the top of viewport - admin bar.
						cartDropdownNewTopPos = ( -1 ) * ( cartDropdownTop - viewportTop - adminbarHeight );
					}

					cartDropdown.css( 'top', cartDropdownNewTopPos );
				}
			} );
		}
	};

	// Position the search form vertically on side-header layouts
	jQuery.fn.position_menu_search_form = function() {
		if ( 'top' !== avadaMenuVars.header_position ) {
			jQuery( this ).each( function() {

				var searchForm       = jQuery( this ),
					searchFormHeight = searchForm.outerHeight(),
					viewportTop      = jQuery( window ).scrollTop(),
					viewportHeight   = jQuery( window ).height(),
					viewportBottom   = viewportTop + viewportHeight,
					searchFormTop,
					searchFormBottom,
					searchFormNewTopPos;

				searchForm.css( 'top', '' );
				searchFormTop        = searchForm.offset().top;
				searchFormBottom = searchFormTop + searchFormHeight;

				if ( searchFormBottom > viewportBottom ) {
					searchFormNewTopPos = ( -1 ) * ( searchFormBottom - viewportBottom + 10 );

					searchForm.css( 'top', searchFormNewTopPos );
				}
			} );
		}
	};

	// Position mega menu correctly
	jQuery.fn.fusion_position_megamenu = function() { // eslint-disable-line camelcase

		var referenceElem,
			mainNavContainer,
			mainNavContainerPosition,
			mainNavContainerWidth,
			mainNavContainerLeftEdge,
			mainNavContainerRightEdge,
			referenceAvadaRow,
			referenceAvadaRowWidth,
			referenceAvadaRowPosition,
			referenceAvadaRowLeftEdge,
			referenceAvadaRowRightEdge;

		if ( 'top' === avadaMenuVars.header_position ) {
			referenceAvadaRow          = ( jQuery( '.fusion-secondary-main-menu' ).length ) ? jQuery( '.fusion-header-wrapper .fusion-secondary-main-menu .fusion-row' ) : jQuery( '.fusion-header-wrapper .fusion-row' ),
			referenceAvadaRowWidth     = referenceAvadaRow.width(),
			referenceAvadaRowPosition  = referenceAvadaRow.offset(),
			referenceAvadaRowLeftEdge  = ( 'undefined' !== typeof referenceAvadaRowPosition ) ? referenceAvadaRowPosition.left : 0,
			referenceAvadaRowRightEdge = referenceAvadaRowLeftEdge + referenceAvadaRowWidth;
		}

		// Side header left handling
		if ( jQuery( '.side-header-left' ).length ) {
			return this.each( function() {
				jQuery( this ).children( 'li' ).each( function() {
					var liItem = jQuery( this ),
						megamenuWrapper = liItem.find( '.fusion-megamenu-wrapper' ),
						megamenuWrapperLeft,
						megamenuWrapperTop,
						megamenuWrapperHeight,
						megamenuBottomEdge,
						adminbarHeight,
						sideHeaderTop,
						browserBottomEdge,
						megamenuWrapperNewTopPos;

					if ( megamenuWrapper.length ) {
						megamenuWrapper.removeAttr( 'style' );

						megamenuWrapperLeft   = jQuery( '#side-header' ).outerWidth() - 1;
						megamenuWrapperTop    = megamenuWrapper.offset().top;
						megamenuWrapperHeight = megamenuWrapper.height();
						megamenuBottomEdge    = megamenuWrapperTop + megamenuWrapperHeight;
						adminbarHeight        = fusion.getAdminbarHeight();
						sideHeaderTop         = jQuery( '.side-header-wrapper' ).offset().top - adminbarHeight;
						browserBottomEdge     = jQuery( window ).height();

						if ( ! jQuery( 'body.rtl' ).length ) {
							megamenuWrapper.css( 'left', megamenuWrapperLeft );
						} else {
							megamenuWrapper.css( { left: megamenuWrapperLeft, right: 'auto' } );
						}

						if ( megamenuBottomEdge > sideHeaderTop + browserBottomEdge && jQuery( window ).height() >= jQuery( '.side-header-wrapper' ).height() ) {
							if ( megamenuWrapperHeight < browserBottomEdge ) {
								megamenuWrapperNewTopPos = ( -1 ) * ( megamenuBottomEdge - sideHeaderTop - browserBottomEdge + 20 );
							} else {
								megamenuWrapperNewTopPos = ( -1 ) * ( megamenuWrapperTop - adminbarHeight );
							}

							megamenuWrapper.css( 'top', megamenuWrapperNewTopPos );
						}
					}
				} );
			} );
		}

		// Side header right handling
		if ( jQuery( '.side-header-right' ).length ) {
			return this.each( function() {
				jQuery( this ).children( 'li' ).each( function() {
					var liItem = jQuery( this ),
						megamenuWrapper = liItem.find( '.fusion-megamenu-wrapper' ),
						megamenuWrapperLeft,
						megamenuWrapperTop,
						megamenuWrapperHeight,
						megamenuBottomEdge,
						adminbarHeight,
						sideHeaderTop,
						browserBottomEdge,
						megamenuWrapperNewTopPos;

					if ( megamenuWrapper.length ) {
						megamenuWrapper.removeAttr( 'style' );

						megamenuWrapperLeft   = ( -1 ) * megamenuWrapper.outerWidth();
						megamenuWrapperTop    = megamenuWrapper.offset().top;
						megamenuWrapperHeight = megamenuWrapper.height();
						megamenuBottomEdge    = megamenuWrapperTop + megamenuWrapperHeight;
						adminbarHeight        = fusion.getAdminbarHeight();
						sideHeaderTop         = jQuery( '.side-header-wrapper' ).offset().top - adminbarHeight;
						browserBottomEdge     = jQuery( window ).height();

						if ( ! jQuery( 'body.rtl' ).length ) {
							megamenuWrapper.css( 'left', megamenuWrapperLeft );
						} else {
							megamenuWrapper.css( { left: megamenuWrapperLeft, right: 'auto' } );
						}

						if ( megamenuBottomEdge > sideHeaderTop + browserBottomEdge && jQuery( window ).height() >= jQuery( '.side-header-wrapper' ).height() ) {
							if ( megamenuWrapperHeight < browserBottomEdge ) {
								megamenuWrapperNewTopPos = ( -1 ) * ( megamenuBottomEdge - sideHeaderTop - browserBottomEdge + 20 );
							} else {
								megamenuWrapperNewTopPos = ( -1 ) * ( megamenuWrapperTop - adminbarHeight );
							}

							megamenuWrapper.css( 'top', megamenuWrapperNewTopPos );
						}
					}
				} );
			} );
		}

		// Top header handling
		referenceElem = '';
		if ( jQuery( '.fusion-header-v4' ).length ) {
			referenceElem = jQuery( this ).parent( '.fusion-main-menu' ).parent();
		} else {
			referenceElem = jQuery( this ).parent( '.fusion-main-menu' );
		}

		if ( jQuery( this ).parent( '.fusion-main-menu' ).length ) {

			mainNavContainer           = referenceElem;
			mainNavContainerPosition   = mainNavContainer.offset();
			mainNavContainerWidth      = mainNavContainer.width();
			mainNavContainerLeftEdge   = mainNavContainerPosition.left;
			mainNavContainerRightEdge  = mainNavContainerLeftEdge + mainNavContainerWidth;

			if ( ! jQuery( 'body.rtl' ).length ) {
				return this.each( function() {

					jQuery( this ).children( 'li' ).each( function() {
						var liItem                  = jQuery( this ),
							liItemPosition          = liItem.offset(),
							megamenuWrapper         = liItem.find( '.fusion-megamenu-wrapper' ),
							megamenuWrapperWidth    = megamenuWrapper.outerWidth(),
							megamenuWrapperPosition = 0;

						// Check if there is a megamenu.
						if ( megamenuWrapper.length ) {
							megamenuWrapper.removeAttr( 'style' );

							referenceAvadaRowWidth = referenceAvadaRow.width();

							// Check if the mega menu is larger than the main nav.
							if ( liItemPosition.left + megamenuWrapperWidth > mainNavContainerRightEdge ) {

								// Viewport width.
								if ( megamenuWrapperWidth === jQuery( window ).width() ) {
									megamenuWrapperPosition = -1 * liItemPosition.left;
								} else if ( megamenuWrapperWidth > referenceAvadaRowWidth ) {

									//Menu is larger than site width (thus must be custom width).
									megamenuWrapperPosition = referenceAvadaRowLeftEdge - liItemPosition.left + ( ( referenceAvadaRowWidth - megamenuWrapperWidth ) / 2 );
								} else {
									megamenuWrapperPosition = -1 * ( liItemPosition.left - ( mainNavContainerRightEdge - megamenuWrapperWidth ) );

									// When menu is on left make sure position is not left of first menu item
									if ( 'right' === avadaMenuVars.logo_alignment.toLowerCase() ) {
										if ( liItemPosition.left + megamenuWrapperPosition < mainNavContainerLeftEdge ) {
											megamenuWrapperPosition = -1 * ( liItemPosition.left - mainNavContainerLeftEdge );
										}
									}
								}

								megamenuWrapper.css( 'left', megamenuWrapperPosition );
							}
						}
					} );
				} );
			}
			return this.each( function() {
				jQuery( this ).children( 'li' ).each( function() {
					var liItem                  = jQuery( this ),
						liItemPosition          = liItem.offset(),
						liItemRightEdge         = liItemPosition.left + liItem.outerWidth(),
						megamenuWrapper         = liItem.find( '.fusion-megamenu-wrapper' ),
						megamenuWrapperWidth    = megamenuWrapper.outerWidth(),
						megamenuWrapperPosition = 0;

					// Check if there is a megamenu
					if ( megamenuWrapper.length ) {
						megamenuWrapper.removeAttr( 'style' );

						referenceAvadaRowWidth = referenceAvadaRow.width();

						// Check if the mega menu is larger than the main nav.
						if ( liItemRightEdge - megamenuWrapperWidth < mainNavContainerLeftEdge ) {

							// Viewport width.
							if ( megamenuWrapperWidth === jQuery( window ).width() ) {
								megamenuWrapperPosition = liItemRightEdge - megamenuWrapperWidth;
							} else if ( megamenuWrapperWidth > referenceAvadaRowWidth ) {

								//Menu is larger than site width (thus must be custom width).
								megamenuWrapperPosition = liItemRightEdge - referenceAvadaRowRightEdge + ( ( referenceAvadaRowWidth - megamenuWrapperWidth ) / 2 );
							} else {
								megamenuWrapperPosition = -1 * ( liItemPosition.left - ( mainNavContainerRightEdge - megamenuWrapperWidth ) );

								// When menu is on right or center, make sure position is not left of first menu item
								megamenuWrapperPosition = -1 * ( megamenuWrapperWidth - ( liItemRightEdge - mainNavContainerLeftEdge ) );

								if ( 'left' === avadaMenuVars.logo_alignment.toLowerCase() || ( 'center' === avadaMenuVars.logo_alignment.toLowerCase() && ! jQuery( '.header-v5' ).length ) || jQuery( this ).parents( '.sticky-header' ).length ) {
									if ( liItemRightEdge - megamenuWrapperPosition > mainNavContainerRightEdge ) {
										megamenuWrapperPosition = -1 * ( mainNavContainerRightEdge - liItemRightEdge );
									}
								}
							}

							megamenuWrapper.css( 'right', megamenuWrapperPosition );
						}
					}
				} );
			} );

		}
	};

	jQuery.fn.calc_megamenu_widths = function() {
		jQuery( this ).find( '.fusion-megamenu-menu' ).each( function() {
			var megamenuHolder          = jQuery( this ).find( '.fusion-megamenu-holder' ),
				megamenuHolderMaxWidth  = megamenuHolder.data( 'width' ),
				megamenuHolderWidth,
				referenceFusionRow,
				availableSpace,
				mainPaddingLeft;

			megamenuHolder.css( 'width', megamenuHolderMaxWidth );
			megamenuHolderWidth = megamenuHolder.outerWidth();

			if ( 'site_width' === avadaMenuVars.megamenu_base_width ) {
				if ( 'top' === avadaMenuVars.header_position ) {
					referenceFusionRow = ( jQuery( '.fusion-secondary-main-menu' ).length ) ? jQuery( '.fusion-header-wrapper .fusion-secondary-main-menu .fusion-row' ) : jQuery( '.fusion-header-wrapper .fusion-row' );
					availableSpace     = referenceFusionRow.width();
				} else if ( 'boxed' === avadaMenuVars.site_layout.toLowerCase() ) {
					availableSpace = jQuery( '#main' ).outerWidth();
				} else {
					mainPaddingLeft = jQuery( '#main' ).css( 'padding-left' ).replace( 'px', '' );
					availableSpace = jQuery( window ).width() - mainPaddingLeft - jQuery( '#side-header' ).outerWidth();
				}
			} else if ( 'viewport_width' === avadaMenuVars.megamenu_base_width && 'boxed' === avadaMenuVars.site_layout.toLowerCase() && 'top' !== avadaMenuVars.header_position ) {

				// On boxed side header layouts make viewport_width match site_width.
				availableSpace = jQuery( '#main' ).outerWidth();
			} else {
				availableSpace = jQuery( window ).width();
			}

			if ( availableSpace < megamenuHolderWidth ) {
				megamenuHolder.css( 'width', availableSpace );
			} else {
				megamenuHolder.css( 'width', megamenuHolderWidth );
			}
		} );
	};

	jQuery.fn.position_last_top_menu_item = function() {

		var lastItem,
			lastItemLeftPos,
			lastItemChild,
			parentContainer,
			parentContainerLeftPos,
			parentContainerWidth;

		if ( jQuery( this ).children( 'ul' ).length || jQuery( this ).children( 'div' ).length ) {
			lastItem               = jQuery( this );
			lastItemLeftPos        = lastItem.position().left;
			parentContainer        = jQuery( '.fusion-secondary-header .fusion-row' );
			parentContainerLeftPos = parentContainer.position().left;
			parentContainerWidth   = parentContainer.outerWidth();

			if ( lastItem.children( 'ul' ).length ) {
				lastItemChild =  lastItem.children( 'ul' );
			} else if ( lastItem.children( 'div' ).length ) {
				lastItemChild =  lastItem.children( 'div' );
			}

			if ( ! jQuery( 'body.rtl' ).length ) {
				if ( lastItemLeftPos + lastItemChild.outerWidth() > parentContainerLeftPos + parentContainerWidth ) {
					lastItemChild.css( 'right', '-1px' ).css( 'left', 'auto' );

					lastItemChild.find( '.sub-menu' ).each( function() {
						jQuery( this ).css( 'right', '100px' ).css( 'left', 'auto' );
					} );
				}
			} else if ( lastItemChild.position().left < lastItemLeftPos ) {
				lastItemChild.css( 'left', '-1px' ).css( 'right', 'auto' );

				lastItemChild.find( '.sub-menu' ).each( function() {
					jQuery( this ).css( 'left', '100px' ).css( 'right', 'auto' );
				} );
			}
		}
	};

	function fusionMenuHoverEvents() {

		// Calculate main menu dropdown submenu position.
		if ( jQuery.fn.fusion_position_menu_dropdown ) {
			jQuery( '.fusion-dropdown-menu, .fusion-dropdown-menu li' ).on( 'mouseenter', function() {
				// Do not trigger this function for menu elements.
				if ( jQuery( this ).closest( '.awb-menu' ).length ) {
					return;
				}

				jQuery( this ).fusion_position_menu_dropdown();
			} );

			jQuery( '.fusion-dropdown-menu > ul > li' ).each( function() {
				jQuery( this ).walk_through_menu_items();
			} );

			jQuery( window ).on( 'fusion-resize-horizontal', function() {
				jQuery( '.fusion-dropdown-menu > ul > li' ).each( function() {
					jQuery( this ).walk_through_menu_items();
				} );
			} );
		}
	}

	fusionMenuHoverEvents();
	fusionPositionSubmenus();
	fusionMobileMenu();
	jQuery( window ).on( 'header-rendered', function() {
		fusionMenuHoverEvents();
		fusionPositionSubmenus();
		fusionMobileMenu();
	} );

	// Set overflow state of main nav items; done to get rid of menu overflow.
	jQuery( document.body ).on( 'mouseenter', '.fusion-dropdown-menu', function() {
		jQuery( this ).css( 'overflow', 'visible' );
	} );
	jQuery( document.body ).on( 'mouseleave', '.fusion-dropdown-menu, .fusion-megamenu-menu, .fusion-custom-menu-item', function() {
		jQuery( this ).css( 'overflow', '' );
		jQuery( '.fusion-active-link' ).removeClass( 'fusion-active-link' );
	} );

	jQuery( document.body ).on( 'click', '.fusion-main-menu-search', function( e ) {
		e.stopPropagation();
	} );

	jQuery( document.body ).on( 'click', '.fusion-main-menu-search:not(.fusion-search-overlay) .fusion-main-menu-icon', function( e ) {
		e.preventDefault();
		e.stopPropagation();

		if ( 'block' === jQuery( this ).parent().find( '.fusion-custom-menu-item-contents' ).css( 'display' ) ) {
			jQuery( this ).parent().find( '.fusion-custom-menu-item-contents' ).hide();
			jQuery( this ).parent().removeClass( 'fusion-main-menu-search-open' );

			jQuery( this ).parent().find( 'style' ).remove();

			jQuery( this ).attr( 'aria-expanded', 'false' );
		} else {
			jQuery( this ).parent().find( '.fusion-custom-menu-item-contents' ).removeAttr( 'style' );
			jQuery( this ).parent().find( '.fusion-custom-menu-item-contents' ).show();
			jQuery( this ).parent().addClass( 'fusion-main-menu-search-open' );

			jQuery( this ).parent().append( '<style>.fusion-main-menu{overflow:visible!important;</style>' );
			jQuery( this ).parent().find( '.fusion-custom-menu-item-contents .s' ).focus();

			jQuery( this ).attr( 'aria-expanded', 'true' );

			// Position main menu search box on click positioning
			if ( 'top' === avadaMenuVars.header_position ) {
				if ( ! jQuery( 'body.rtl' ).length && 0 > jQuery( this ).parent().find( '.fusion-custom-menu-item-contents' ).offset().left ) {
					jQuery( this ).parent().find( '.fusion-custom-menu-item-contents' ).css( {
						left: '0',
						right: 'auto'
					} );
				}

				if ( jQuery( 'body.rtl' ).length && jQuery( this ).parent().find( '.fusion-custom-menu-item-contents' ).offset().left + jQuery( this ).parent().find( '.fusion-custom-menu-item-contents' ).width()  > jQuery( window ).width() ) {
					jQuery( this ).parent().find( '.fusion-custom-menu-item-contents' ).css( {
						left: 'auto',
						right: '0'
					} );
				}
			}
		}
	} );

	jQuery( document.body ).on( 'click', '.fusion-search-overlay .fusion-main-menu-icon, .fusion-close-search', function( e ) {
		var mainMenuNav = jQuery( '.fusion-main-menu' );

		e.preventDefault();

		// Resizes overlay search in main and sticky menu; Definition at bottom of this file.
		resizeOverlaySearch();

		mainMenuNav.addClass( 'search-transition' );

		setTimeout( function() {
			mainMenuNav.removeClass( 'search-transition' );
		}, 800 );

		mainMenuNav.toggleClass( 'search-open' );

		if ( mainMenuNav.hasClass( 'search-open' ) ) {
			mainMenuNav.find( '.fusion-search-field input[type="search"]' ).focus();

			mainMenuNav.find( '.fusion-main-menu-search' ).attr( 'aria-expanded', 'true' );
		} else {
			mainMenuNav.find( '.fusion-main-menu-search' ).attr( 'aria-expanded', 'false' );
		}
	} );

	// Accessibility dropdowns.
	jQuery( 'a' ).on( 'focus',  function() {
		jQuery( '.fusion-active-link ' ).removeClass( 'fusion-active-link' );
		if ( jQuery( this ).parents( '.fusion-dropdown-menu, .fusion-main-menu-cart, .fusion-megamenu-menu, .fusion-custom-menu-item' ).length ) {
			jQuery( this ).parents( 'li' ).addClass( 'fusion-active-link' );
			jQuery( '.fusion-main-menu' ).css( 'overflow', 'visible' );
		}
	} );

	// Search icon show/hide.
	jQuery( document ).on( 'click', function() {
		jQuery( '.fusion-main-menu-search-dropdown .fusion-main-menu-search .fusion-custom-menu-item-contents' ).hide();
		jQuery( '.fusion-main-menu-search-dropdown .fusion-main-menu-search' ).removeClass( 'fusion-main-menu-search-open' );
		jQuery( '.fusion-main-menu-search-dropdown .fusion-main-menu-search' ).find( 'style' ).remove();
	} );

	function fusionPositionSubmenus() {

		// Calculate megamenu position.
		if ( jQuery.fn.fusion_position_megamenu ) {
			jQuery( '.fusion-main-menu > ul' ).fusion_position_megamenu();

			jQuery( document.body ).on( 'mouseenter', '.fusion-main-menu .fusion-megamenu-menu', function() {
				jQuery( this ).parent().fusion_position_megamenu();
			} );

			jQuery( window ).on( 'resize', function() {
				jQuery( '.fusion-main-menu > ul' ).fusion_position_megamenu();
			} );
		}

		// Calculate megamenu column widths.
		if ( jQuery.fn.calc_megamenu_widths ) {
			jQuery( '.fusion-main-menu > ul' ).calc_megamenu_widths();

			jQuery( window ).on( 'resize', function() {
				jQuery( '.fusion-main-menu > ul' ).calc_megamenu_widths();
			} );
		}
	}

	// Top Menu last item positioning.
	jQuery( '.fusion-header-wrapper .fusion-secondary-menu > ul > li:last-child' ).position_last_top_menu_item();

	fusionRepositionMenuItem( '.fusion-main-menu .fusion-main-menu-cart' );
	fusionRepositionMenuItem( '.fusion-secondary-menu .fusion-menu-login-box' );

	function fusionRepositionMenuItem( $menuItem ) {

		// Position main menu cart dropdown correctly
		if ( 'top' === avadaMenuVars.header_position ) {
			jQuery( $menuItem ).on( 'mouseenter', function() {

				if ( jQuery( this ).find( '> div' ).length && 0 > jQuery( this ).find( '> div' ).offset().left ) {
					jQuery( this ).find( '> div' ).css( {
						left: '0',
						right: 'auto'
					} );
				}

				if ( jQuery( this ).find( '> div' ).length && jQuery( this ).find( '> div' ).offset().left + jQuery( this ).find( '> div' ).width()  > jQuery( window ).width() ) {
					jQuery( this ).find( '> div' ).css( {
						left: 'auto',
						right: '0'
					} );
				}
			} );

			jQuery( window ).on( 'fusion-resize-horizontal', function() {
				jQuery( $menuItem ).find( '> div' ).each( function() {
					var $menuItemDropdown          = jQuery( this ),
						$menuItemDropdownWidth     = $menuItemDropdown.outerWidth(),
						$menuItemDropdownLeftEdge  = $menuItemDropdown.offset().left,
						$menuItemDropdownRightEdge = $menuItemDropdownLeftEdge + $menuItemDropdownWidth,
						$menuItemLeftEdge          = $menuItemDropdown.parent().offset().left,
						windowRightEdge            = jQuery( window ).width();

					if ( ! jQuery( 'body.rtl' ).length ) {
						if (
							( $menuItemDropdownLeftEdge < $menuItemLeftEdge && 0 > $menuItemDropdownLeftEdge ) ||
							( parseInt( $menuItemDropdownLeftEdge, 10 ) === parseInt( $menuItemLeftEdge, 10 ) && 0 > $menuItemDropdownLeftEdge - $menuItemDropdownWidth )
						) {
							$menuItemDropdown.css( {
								left: '0',
								right: 'auto'
							} );
						} else {
							$menuItemDropdown.css( {
								left: 'auto',
								right: '0'
							} );
						}
					} else if (
						( parseInt( $menuItemDropdownLeftEdge, 10 ) === parseInt( $menuItemLeftEdge, 10 ) && $menuItemDropdownRightEdge > windowRightEdge ) ||
							( $menuItemDropdownLeftEdge < $menuItemLeftEdge && $menuItemDropdownRightEdge + $menuItemDropdownWidth > windowRightEdge )
					) {
						$menuItemDropdown.css( {
							left: 'auto',
							right: '0'
						} );
					} else {
						$menuItemDropdown.css( {
							left: '0',
							right: 'auto'
						} );
					}
				} );
			} );
		}
	}

	// Reinitialize google map on megamenu.
	jQuery( '.fusion-megamenu-menu' ).on( 'mouseenter', function() {
		if ( jQuery( this ).find( '.shortcode-map' ).length ) {
			jQuery( this ).find( '.shortcode-map' ).each( function() {
				jQuery( this ).reinitializeGoogleMap();
			} );
		}
	} );

	// Make iframes in megamenu widget area load correctly in Safari and IE.
	// Safari part - load the iframe correctly.
	iframeLoaded = false;

	jQuery( '.fusion-megamenu-menu' ).on( 'mouseover',
		function() {
			jQuery( this ).find( '.fusion-megamenu-widgets-container iframe' ).each( function() {
				if ( ! iframeLoaded ) {
					jQuery( this ).attr( 'src', jQuery( this ).attr( 'src' ) );
				}
				iframeLoaded = true;
			} );
		}
	);

	// Position main menu cart dropdown correctly on side-header.
	jQuery( '.fusion-main-menu' ).on( 'mouseenter', '.fusion-menu-cart', function() {
		jQuery( this ).position_cart_dropdown();
	} );

	// Position main menu search form correctly on side-header.
	jQuery( '.fusion-main-menu .fusion-main-menu-search .fusion-main-menu-icon' ).on( 'click', function() {
		var searchIcon = jQuery( this );
		setTimeout( function() {
			searchIcon.parent().find( '.fusion-custom-menu-item-contents' ).position_menu_search_form();
		}, 5 );
	} );

	jQuery( window ).on( 'fusion-resize-horizontal', function() {
		jQuery( '.fusion-main-menu .fusion-main-menu-search .fusion-custom-menu-item-contents' ).position_menu_search_form();
	} );

	jQuery( document ).on( 'click', '.fusion-mobile-selector', function() {
		var $mobileNav = jQuery( this ).next( 'ul' );
		if ( $mobileNav.hasClass( 'mobile-menu-expanded' ) ) {
			$mobileNav.removeClass( 'mobile-menu-expanded' );
			jQuery( this ).attr( 'aria-expanded', 'false' );
		} else {
			$mobileNav.addClass( 'mobile-menu-expanded' );
			jQuery( this ).attr( 'aria-expanded', 'true' );
		}

		$mobileNav.slideToggle( 200, 'easeOutQuad' );

		jQuery( '.fusion-mobile-menu-search' ).slideToggle( 200, 'easeOutQuad' );
	} );

	// Mobile Modern Menu.
	if ( jQuery( '.fusion-is-sticky' ).length && jQuery( '.fusion-mobile-sticky-nav-holder' ).length ) {
		jQuery( '.fusion-mobile-menu-icons .awb-icon-bars' ).attr( 'aria-controls', jQuery( '.fusion-mobile-sticky-nav-holder > ul' ).attr( 'id' ) );
	} else {
		jQuery( '.fusion-mobile-menu-icons .awb-icon-bars' ).attr( 'aria-controls', jQuery( '.fusion-mobile-nav-holder' ).not( '.fusion-mobile-sticky-nav-holder' ).find( '> ul' ).attr( 'id' ) );
	}

	jQuery( window ).on( 'scroll', function() {
		setTimeout( function() {
			if ( jQuery( '.fusion-is-sticky' ).length && jQuery( '.fusion-mobile-sticky-nav-holder' ).length ) {
				jQuery( '.fusion-mobile-menu-icons .awb-icon-bars' ).attr( 'aria-controls', jQuery( '.fusion-mobile-sticky-nav-holder > ul' ).attr( 'id' ) );
			} else {
				jQuery( '.fusion-mobile-menu-icons .awb-icon-bars' ).attr( 'aria-controls', jQuery( '.fusion-mobile-nav-holder' ).not( '.fusion-mobile-sticky-nav-holder' ).find( '> ul' ).attr( 'id' ) );
			}
		}, 50 );
	} );

	jQuery( document ).on( 'click', '.fusion-mobile-menu-icons .awb-icon-bars', function( event ) {

		var $wrapper,
			menu;

		event.preventDefault();

		if ( 1 <= jQuery( '.fusion-header-v4' ).length || 1 <= jQuery( '.fusion-header-v5' ).length ) {
			$wrapper = '.fusion-secondary-main-menu';
		} else if ( 1 <= jQuery( '#side-header' ).length ) {
			$wrapper = '#side-header';
		} else {
			$wrapper = '.fusion-header';
		}

		if ( 1 <= jQuery( '.fusion-is-sticky' ).length && 1 <= jQuery( '.fusion-mobile-sticky-nav-holder' ).length ) {
			menu = jQuery( $wrapper ).find( '.fusion-mobile-sticky-nav-holder' );
		} else {
			menu = jQuery( $wrapper ).find( '.fusion-mobile-nav-holder' ).not( '.fusion-mobile-sticky-nav-holder' );
		}

		menu.slideToggle( 200, 'easeOutQuad' );
		menu.toggleClass( 'fusion-mobile-menu-expanded' );

		if ( menu.hasClass( 'fusion-mobile-menu-expanded' ) ) {
			jQuery( this ).attr( 'aria-expanded', 'true' );
		} else {
			jQuery( this ).attr( 'aria-expanded', 'false' );
		}
	} );

	jQuery( document ).on( 'click', '.fusion-mobile-menu-icons .awb-icon-search', function( event ) {
		event.preventDefault();
		jQuery( '.fusion-secondary-main-menu .fusion-secondary-menu-search, .side-header-wrapper .fusion-secondary-menu-search, .fusion-mobile-menu-search' ).slideToggle( 200, 'easeOutQuad' );
	} );

	function fusionMobileMenu() {

		/**
		 * Mobile Navigation.
		 */
		jQuery( '.fusion-mobile-nav-holder' ).not( '.fusion-mobile-sticky-nav-holder' ).each( function() {
			var $mobileNavHolder = jQuery( this ),
				$mobileNav       = '',
				$menu            = '',
				$currentMenuId   = '';

			if ( jQuery( '.fusion-mobile-navigation' ).length ) {
				$menu = jQuery( this ).parent().find( '.fusion-mobile-navigation, .fusion-secondary-menu' ).not( '.fusion-sticky-menu' );
			} else {
				$menu = jQuery( this ).parent().find( '.fusion-main-menu, .fusion-secondary-menu' ).not( '.fusion-sticky-menu' );
			}

			if ( $menu.length ) {
				if ( 'classic' === avadaMenuVars.mobile_menu_design && ! $mobileNavHolder.find( '.fusion-mobile-selector' ).length ) {
					$mobileNavHolder.append( '<button class="fusion-mobile-selector" aria-expanded="false"><span>' + avadaMenuVars.dropdown_goto + '</span></button>' );
					jQuery( this ).find( '.fusion-mobile-selector' ).append( '<div class="fusion-selector-down"></div>' );
				}

				if ( ! jQuery( $mobileNavHolder ).find( 'ul' ).length ) {
					jQuery( $mobileNavHolder ).append( jQuery( $menu ).find( '> ul' ).clone() );
					jQuery( $mobileNavHolder ).find( 'ul > li > a' ).css( 'height', '' );
				}

				$mobileNav = jQuery( $mobileNavHolder ).find( '> ul' );
				$currentMenuId = $mobileNav.attr( 'id' );

				if ( 'undefined' !== typeof $currentMenuId && 0 !== $currentMenuId.indexOf( 'mobile-menu-' ) ) {
					$mobileNav.attr( 'id', 'mobile-' + $currentMenuId );
				}
				$mobileNav.removeClass( 'fusion-middle-logo-ul' );

				if ( 'classic' === avadaMenuVars.mobile_menu_design ) {
					$mobileNavHolder.find( '.fusion-mobile-selector' ).attr( 'aria-controls', $mobileNav.attr( 'id' ) );
				}

				$mobileNav.find( '.fusion-middle-logo-menu-logo, .fusion-caret, .fusion-menu-login-box .fusion-custom-menu-item-contents, .fusion-menu-cart .fusion-custom-menu-item-contents, .fusion-main-menu-search, li> a > span > .button-icon-divider-left, li > a > span > .button-icon-divider-right, .fusion-arrow-svg, .fusion-dropdown-svg' ).remove();

				if ( jQuery( '.no-mobile-slidingbar' ).length || 'classic' !== avadaMenuVars.mobile_menu_design ) {
					$mobileNav.find( '.fusion-main-menu-sliding-bar' ).remove();
				}

				if ( 'classic' === avadaMenuVars.mobile_menu_design ) {
					$mobileNav.find( '.fusion-menu-cart > a' ).html( avadaMenuVars.mobile_nav_cart );
				} else {
					$mobileNav.find( '.fusion-main-menu-cart' ).remove();
				}

				$mobileNav.find( 'li' ).each( function() {

					var classes = 'fusion-mobile-nav-item';
					if ( jQuery( this ).data( 'classes' ) ) {
						classes += ' ' + jQuery( this ).data( 'classes' );
					}

					if ( jQuery( this ).find( 'img' ).hasClass( 'wpml-ls-flag' ) ) {
						classes += ' wpml-ls-item';
					}

					if ( jQuery( this ).hasClass( 'menu-item-has-children' ) ) {
						classes += ' menu-item-has-children';
					}

					jQuery( this ).find( '> a > .menu-text' ).removeAttr( 'class' ).addClass( 'menu-text' );

					if ( jQuery( this ).hasClass( 'current-menu-item' ) || jQuery( this ).hasClass( 'current-menu-parent' ) || jQuery( this ).hasClass( 'current-menu-ancestor' ) ) {
						classes += ' fusion-mobile-current-nav-item';
					}

					jQuery( this ).attr( 'class', classes );

					if ( jQuery( this ).attr( 'id' ) && 0 !== jQuery( this ).attr( 'id' ).indexOf( 'mobile-menu-item-' ) ) {
						jQuery( this ).attr( 'id', jQuery( this ).attr( 'id' ).replace( 'menu-item', 'mobile-menu-item' ) );
					}

					jQuery( this ).attr( 'style', '' );
				} );
			}
		} );

		jQuery( '.fusion-mobile-sticky-nav-holder' ).each( function() {
			var $mobileNavHolder = jQuery( this ),
				$mobileNav       = '',
				$menu            = jQuery( this ).parent().find( '.fusion-sticky-menu' ),
				$currentMenuId   = '';

			if ( 'classic' === avadaMenuVars.mobile_menu_design && ! $mobileNavHolder.find( '.fusion-mobile-selector' ).length ) {
				$mobileNavHolder.append( '<button class="fusion-mobile-selector" aria-expanded="false"><span>' + avadaMenuVars.dropdown_goto + '</span></button>' );
				jQuery( this ).find( '.fusion-mobile-selector' ).append( '<div class="fusion-selector-down"></div>' );
			}

			if ( ! jQuery( $mobileNavHolder ).find( 'ul' ).length ) {
				jQuery( $mobileNavHolder ).append( jQuery( $menu ).find( '> ul' ).clone() );
			}

			$mobileNav = jQuery( $mobileNavHolder ).find( '> ul' );
			$currentMenuId = $mobileNav.attr( 'id' );

			if ( 'undefined' !== typeof $currentMenuId && 0 !== $currentMenuId.indexOf( 'mobile-menu-' ) ) {
				$mobileNav.attr( 'id', 'mobile-' + $currentMenuId );
			}

			if ( 'classic' === avadaMenuVars.mobile_menu_design ) {
				$mobileNavHolder.find( '.fusion-mobile-selector' ).attr( 'aria-controls', $mobileNav.attr( 'id' ) );
			}
			$mobileNav.find( '.fusion-middle-logo-menu-logo, .fusion-menu-cart, .fusion-menu-login-box, .fusion-main-menu-search, .fusion-arrow-svg, .fusion-dropdown-svg' ).remove();

			if ( jQuery( '.no-mobile-slidingbar' ).length || 'classic' !== avadaMenuVars.mobile_menu_design ) {
				$mobileNav.find( '.fusion-main-menu-sliding-bar' ).remove();
			}

			// Make sure button classes are removed.
			$mobileNav.find( '.fusion-button' ).attr( 'class', 'menu-text' );

			$mobileNav.find( 'li' ).each( function() {
				var classes = 'fusion-mobile-nav-item';
				if ( jQuery( this ).data( 'classes' ) ) {
					classes += ' ' + jQuery( this ).data( 'classes' );
				}

				if ( jQuery( this ).find( 'img' ).hasClass( 'wpml-ls-flag' ) ) {
					classes += ' wpml-ls-item';
				}

				if ( jQuery( this ).hasClass( 'current-menu-item' ) || jQuery( this ).hasClass( 'current-menu-parent' ) || jQuery( this ).hasClass( 'current-menu-ancestor' ) ) {
					classes += ' fusion-mobile-current-nav-item';
				}

				jQuery( this ).attr( 'class', classes );

				if ( jQuery( this ).attr( 'id' ) && 0 !== jQuery( this ).attr( 'id' ).indexOf( 'mobile-menu-item-' ) ) {
					jQuery( this ).attr( 'id', jQuery( this ).attr( 'id' ).replace( 'menu-item', 'mobile-menu-item' ) );
				}

				jQuery( this ).attr( 'style', '' );
			} );
		} );

		// Make megamenu items mobile ready.
		jQuery( '.fusion-mobile-nav-holder > ul > li' ).each( function() {
			jQuery( this ).find( '.fusion-megamenu-widgets-container' ).remove();

			jQuery( this ).find( '.fusion-megamenu-holder > ul' ).each( function() {
				jQuery( this ).attr( 'class', 'sub-menu' );
				jQuery( this ).attr( 'style', '' );
				jQuery( this ).find( '> li' ).each( function() {

					// Add menu needed menu classes to li elements
					var classes = 'fusion-mobile-nav-item',
						parentLi;

					if ( jQuery( this ).data( 'classes' ) ) {
						classes += ' ' + jQuery( this ).data( 'classes' );
					}

					if ( jQuery( this ).find( 'img' ).hasClass( 'wpml-ls-flag' ) ) {
						classes += ' wpml-ls-item';
					}

					if ( jQuery( this ).hasClass( 'current-menu-item' ) || jQuery( this ).hasClass( 'current-menu-parent' ) || jQuery( this ).hasClass( 'current-menu-ancestor' ) || jQuery( this ).hasClass( 'fusion-mobile-current-nav-item' ) ) {
						classes += ' fusion-mobile-current-nav-item';
					}

					if ( jQuery( this ).hasClass( 'menu-item-has-children' ) ) {
						classes += ' menu-item-has-children';
					}

					jQuery( this ).attr( 'class', classes );

					// Append column titles and title links correctly
					if ( ! jQuery( this ).find( '.fusion-megamenu-title a, > a' ).length ) {
						jQuery( this ).find( '.fusion-megamenu-title' ).each( function() {
							if ( ! jQuery( this ).children( 'a' ).length ) {
								jQuery( this ).append( '<a href="#">' + jQuery( this ).html() + '</a>' );
							}
						} );

						if ( ! jQuery( this ).find( '.fusion-megamenu-title' ).length ) {

							parentLi = jQuery( this );

							jQuery( this ).find( '.sub-menu' ).each( function() {
								parentLi.after( jQuery( this ) );

							} );

							// Hide rather than remove, for front-end.
							if ( jQuery( 'body' ).hasClass( 'fusion-builder-live' ) ) {
								jQuery( this ).addClass( 'fusion-hidden-mobile-menu-item' );
								jQuery( this ).hide();
							} else {
								jQuery( this ).remove();
							}
						}
					}
					jQuery( this ).prepend( jQuery( this ).find( '.fusion-megamenu-title a, > a' ) );

					jQuery( this ).find( '.fusion-megamenu-title' ).remove();
				} );
				jQuery( this ).closest( '.fusion-mobile-nav-item' ).append( jQuery( this ) );
			} );

			jQuery( this ).find( '.fusion-megamenu-wrapper, .caret, .fusion-megamenu-bullet' ).remove();
		} );

		// Collapse mobile menus when on page anchors are clicked.
		jQuery( '.fusion-mobile-nav-holder .fusion-mobile-nav-item a:not([href="#"])' ).on( 'click', function() {
			var $target = jQuery( this.hash );
			if ( '' !== $target.length && this.hash.slice( 1 ) ) {
				if ( jQuery( this ).parents( '.fusion-mobile-menu-design-classic' ).length ) {
					jQuery( this ).parents( '.fusion-menu, .menu' )
						.hide()
						.removeClass( 'mobile-menu-expanded' );
				} else {
					jQuery( this ).parents( '.fusion-mobile-nav-holder' ).hide();
				}
			}
		} );

		// Make mobile menu sub-menu toggles.
		if ( avadaMenuVars.submenu_slideout && 'flyout' !== avadaMenuVars.mobile_menu_design ) {
			jQuery( '.fusion-mobile-nav-holder > ul li' ).each( function() {
				var classes = 'fusion-mobile-nav-item',
					subMenu = jQuery( this ).find( ' > ul' ),
					link,
					linkTitle;

				if ( jQuery( this ).data( 'classes' ) ) {
					classes += ' ' + jQuery( this ).data( 'classes' );
				}

				if ( jQuery( this ).find( 'img' ).hasClass( 'wpml-ls-flag' ) ) {
					classes += ' wpml-ls-item';
				}

				if ( jQuery( this ).hasClass( 'current-menu-item' ) || jQuery( this ).hasClass( 'current-menu-parent' ) || jQuery( this ).hasClass( 'current-menu-ancestor' ) || jQuery( this ).hasClass( 'fusion-mobile-current-nav-item' ) ) {
					classes += ' fusion-mobile-current-nav-item';
				}

				if ( jQuery( this ).hasClass( 'menu-item-has-children' ) ) {
					classes += ' menu-item-has-children';
				}

				jQuery( this ).attr( 'class', classes );

				if ( subMenu.length ) {
					link = jQuery( this ).find( '> a' );

					if ( 0 < link.length ) {
						if ( 'undefined' !== typeof link.attr( 'title' ) ) {
							linkTitle = link.attr( 'title' );
						} else if ( link.children( '.menu-text' ).length ) {
							linkTitle = link.children( '.menu-text' ).clone().children().remove().end().text();
						} else {
							linkTitle = link[ 0 ].innerText;
						}

						link.after( '<button href="#" aria-label="' + avadaMenuVars.mobile_submenu_open.replace( '%s', linkTitle ) + '" aria-expanded="false" class="fusion-open-submenu"></button>' );
						subMenu.hide();
					}
				}
			} );

			jQuery( '.fusion-mobile-nav-holder .fusion-open-submenu' ).on( 'click', function( e ) {
				var subMenu   = jQuery( this ).parent().children( '.sub-menu' ),
					link      = jQuery( this ).parent().children( 'a' ),
					linkTitle;

				if ( 'undefined' !== typeof link.attr( 'title' ) ) {
					linkTitle = link.attr( 'title' );
				} else if ( link.children( '.menu-text' ).length ) {
					linkTitle = link.children( '.menu-text' ).clone().children().remove().end().text();
				} else {
					linkTitle = link[ 0 ].innerText;
				}

				e.stopPropagation();

				subMenu.slideToggle( 200, 'easeOutQuad' );
				subMenu.toggleClass( 'fusion-sub-menu-open' );

				if ( subMenu.hasClass( 'fusion-sub-menu-open' ) ) {
					jQuery( this ).attr( 'aria-label', avadaMenuVars.mobile_submenu_close.replace( '%s', linkTitle ) );
					jQuery( this ).attr( 'aria-expanded', 'true' );
				} else {
					jQuery( this ).attr( 'aria-label', avadaMenuVars.mobile_submenu_open.replace( '%s', linkTitle ) );
					jQuery( this ).attr( 'aria-expanded', 'false' );
				}
			} );

			jQuery( '.fusion-mobile-nav-holder a:not(.fusion-menu-edit, .awb-icon-sliding-bar)' ).on( 'click', function( e ) {
				if ( '#' === jQuery( this ).attr( 'href' ) ) {
					if ( 'modal' === jQuery( this ).data( 'toggle' ) ) {
						jQuery( this ).trigger( 'show.bs.modal' );
					} else if ( 'undefined' === typeof jQuery( this ).parent().data( 'off-canvas' ) ) {
						e.preventDefault();
						e.stopPropagation();
					}

					jQuery( this ).next( '.fusion-open-submenu' ).trigger( 'click' );
				}
			} );
		}
	}

	// Flyout Menu.
	function setFlyoutActiveCSS() {
		var $flyoutMenuTopHeight,
			$flyoutContent         = jQuery( '.fusion-header-has-flyout-menu' ),
			additionalHeaderOffset = 0,
			$flyoutMenuNav,
			flyoutHeaderOffset,
			isTablet = Modernizr.mq( 'only screen and (min-device-width: 768px) and (max-device-width: 1366px) and (orientation: portrait)' ) ||  Modernizr.mq( 'only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape)' ),
			isMobile = Modernizr.mq( 'only screen and (max-width: ' + avadaMenuVars.side_header_break_point + 'px)' );

		jQuery( 'body' ).on( 'touchmove', function( e ) {
			if ( ! jQuery( e.target ).parents( '.fusion-flyout-menu' ).length ) {
				e.preventDefault();
			}
		} );

		if ( 1 <= jQuery( '.fusion-mobile-menu-design-flyout' ).length ) {
			$flyoutMenuNav = 1 <= jQuery( '.fusion-is-sticky' ).length && 1 <= jQuery( '.fusion-mobile-sticky-nav-holder' ).length ? $flyoutContent.find( '.fusion-flyout-menu.fusion-mobile-sticky-nav-holder' ) : $flyoutContent.find( '.fusion-flyout-menu:not(.fusion-mobile-sticky-nav-holder)' );
			$flyoutContent.find( '.fusion-flyout-menu' ).css( {
				display: 'none'
			} );
			$flyoutMenuNav.css( {
				display: 'flex'
			} );
		} else {
			$flyoutMenuNav = $flyoutContent.find( '.fusion-flyout-menu' );
		}

		if (  jQuery( '.fusion-header-has-flyout-menu .fusion-secondary-header' ).length ) {
			additionalHeaderOffset += jQuery( '.fusion-header-has-flyout-menu .fusion-secondary-header' ).outerHeight();
		}

		// Add boxed mode offset.
		if ( jQuery( 'body' ).hasClass( 'layout-boxed-mode' ) ) {
			additionalHeaderOffset += jQuery( 'body' ).outerHeight( true ) - jQuery( 'body' ).outerHeight();
		}

		window.$wpadminbarHeight = fusion.getAdminbarHeight();
		$flyoutMenuTopHeight = jQuery( '.fusion-header-has-flyout-menu-content' ).height() + jQuery( '.fusion-secondary-header' ).height() + window.$wpadminbarHeight;

		// Make user the menu is opened in a way, that menu items do not collide with the header.
		if ( $flyoutContent.hasClass( 'fusion-flyout-menu-active' ) ) {
			$flyoutMenuNav.css( {
				height: 'calc(100% - ' + $flyoutMenuTopHeight + 'px)',
				'margin-top': $flyoutMenuTopHeight
			} );

			if ( $flyoutMenuNav.find( '.fusion-menu' ).height() > $flyoutMenuNav.height() ) {
				$flyoutMenuNav.css( 'display', 'flex' );
			}
		}

		// Make sure logo and menu stay sticky on flyout opened, even if sticky header is disabled.
		if ( $flyoutContent.find( '.fusion-header' ).length ) {
			flyoutHeaderOffset = $flyoutContent.find( '.fusion-header' ).offset().top;

			if ( ! avadaMenuVars.header_sticky || ( isTablet && ! avadaMenuVars.header_sticky_tablet ) || ( isMobile && ! avadaMenuVars.header_sticky_mobile ) ) {
				$flyoutContent.find( '.fusion-header' ).css( {
					position: 'fixed',
					width: '100%',
					'max-width': '100%',
					top: window.$wpadminbarHeight + additionalHeaderOffset,
					'z-index': '210'
				} );

				jQuery( '.fusion-header-sticky-height' ).css( {
					display: 'block',
					height: $flyoutContent.find( '.fusion-header' ).outerHeight()
				} );
			} else if ( flyoutHeaderOffset > window.$wpadminbarHeight ) {
				$flyoutContent.find( '.fusion-header' ).css( {
					position: 'fixed',
					top: window.$wpadminbarHeight + additionalHeaderOffset
				} );

				if ( jQuery( '.layout-boxed-mode' ).length ) {
					$flyoutContent.find( '.fusion-header' ).css( 'max-width', jQuery( '#wrapper' ).outerWidth() + 'px' );
				}

				jQuery( '.fusion-header-wrapper' ).css( 'height', '' );
			}
		}
	}

	function resetFlyoutActiveCSS() {
		setTimeout( function() {
			var flyoutContent = jQuery( '.fusion-header-has-flyout-menu' ),
				secondaryHeaderHeight = 0,
				isTablet = Modernizr.mq( 'only screen and (min-device-width: 768px) and (max-device-width: 1366px) and (orientation: portrait)' ) ||  Modernizr.mq( 'only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape)' ),
				isMobile = Modernizr.mq( 'only screen and (max-width: ' + avadaMenuVars.side_header_break_point + 'px)' );

			if (  jQuery( '.fusion-header-has-flyout-menu .fusion-secondary-header' ).length ) {
				secondaryHeaderHeight = jQuery( '.fusion-header-has-flyout-menu .fusion-secondary-header' ).outerHeight();
			}

			flyoutContent.find( '.fusion-flyout-menu' ).css( 'display', '' );

			if ( ! avadaMenuVars.header_sticky || ( isTablet && ! avadaMenuVars.header_sticky_tablet ) || ( isMobile && ! avadaMenuVars.header_sticky_mobile ) ) {
				flyoutContent.find( '.fusion-header' ).attr( 'style', '' );
				jQuery( '.fusion-header-sticky-height' ).attr( 'style', '' );
			} else if ( 'fixed' === flyoutContent.find( '.fusion-header' ).css( 'position' ) ) {
				flyoutContent.find( '.fusion-header' ).css( 'position', '' );

				if ( flyoutContent.find( '.fusion-header' ).offset().top > secondaryHeaderHeight ) {
					flyoutContent.find( '.fusion-header' ).css( 'top', window.$wpadminbarHeight );
				}

				jQuery( window ).trigger( 'scroll' );
			}

			jQuery( 'body' ).off( 'touchmove' );
		}, 250 );
	}

	jQuery( document ).on( 'click', '.fusion-flyout-menu-icons .fusion-flyout-menu-toggle', function( e ) {
		var $flyoutContent = jQuery( '.fusion-header-has-flyout-menu' );

		e.preventDefault();

		// Remove previous event listeners.
		jQuery( document ).off( 'keyup.flyoutSearchEsc' );
		jQuery( document ).off( 'keyup.flyoutMenuEsc' );

		if ( $flyoutContent.hasClass( 'fusion-flyout-active' ) ) {
			if ( $flyoutContent.hasClass( 'fusion-flyout-search-active' ) ) {
				$flyoutContent.addClass( 'fusion-flyout-menu-active' );

				setFlyoutActiveCSS();

				// Add event listener for esc key.
				jQuery( document ).on( 'keyup.flyoutMenuEsc', function( event ) {
					if ( 27 === event.keyCode ) { // Escape key.
						document.querySelector( '.fusion-flyout-menu-icons .fusion-flyout-menu-toggle' ).click();
					}
				} );

			} else {
				$flyoutContent.removeClass( 'fusion-flyout-active' );
				$flyoutContent.removeClass( 'fusion-flyout-menu-active' );

				resetFlyoutActiveCSS();
			}
			$flyoutContent.removeClass( 'fusion-flyout-search-active' );
		} else {
			$flyoutContent.addClass( 'fusion-flyout-active' );
			$flyoutContent.addClass( 'fusion-flyout-menu-active' );

			setFlyoutActiveCSS();

			// Add event listener for esc key.
			jQuery( document ).on( 'keyup.flyoutMenuEsc', function( event ) {
				if ( 27 === event.keyCode ) { // Escape key.
					document.querySelector( '.fusion-flyout-menu-icons .fusion-flyout-menu-toggle' ).click();
				}
			} );
		}
	} );

	jQuery( document ).on( 'click', '.fusion-flyout-menu-icons .fusion-flyout-search-toggle', function( e ) {
		var $flyoutContent = jQuery( '.fusion-header-has-flyout-menu' );

		e.preventDefault();

		// Remove previous event listeners.
		jQuery( document ).off( 'keyup.flyoutSearchEsc' );
		jQuery( document ).off( 'keyup.flyoutMenuEsc' );

		if ( $flyoutContent.hasClass( 'fusion-flyout-active' ) ) {
			if ( $flyoutContent.hasClass( 'fusion-flyout-menu-active' ) ) {
				$flyoutContent.addClass( 'fusion-flyout-search-active' );

				// Set focus on search field if not on mobiles
				if ( Modernizr.mq( 'only screen and (min-width:'  + parseInt( avadaMenuVars.side_header_break_point, 10 ) +  'px)' ) ) {
					$flyoutContent.find( '.fusion-flyout-search .s' ).focus();
				}

				// Add event listener for esc key.
				jQuery( document ).on( 'keyup.flyoutSearchEsc', function( event ) {
					if ( 27 === event.keyCode ) { // Escape key.
						document.querySelector( '.fusion-flyout-menu-icons .fusion-icon.awb-icon-search' ).click();
					}
				} );
			} else {
				$flyoutContent.removeClass( 'fusion-flyout-active' );
				$flyoutContent.removeClass( 'fusion-flyout-search-active' );

				resetFlyoutActiveCSS();
			}
			$flyoutContent.removeClass( 'fusion-flyout-menu-active' );
		} else {
			$flyoutContent.addClass( 'fusion-flyout-active' );
			$flyoutContent.addClass( 'fusion-flyout-search-active' );

			// Set focus on search field if not on mobiles
			if ( Modernizr.mq( 'only screen and (min-width:'  + parseInt( avadaMenuVars.side_header_break_point, 10 ) +  'px)' ) ) {
				$flyoutContent.find( '.fusion-flyout-search .s' ).focus();
			}

			setFlyoutActiveCSS();

			// Add event listener for esc key.
			jQuery( document ).on( 'keyup.flyoutSearchEsc', function( event ) {
				if ( 27 === event.keyCode ) { // Escape key.
					document.querySelector( '.fusion-flyout-menu-icons .fusion-icon.awb-icon-search' ).click();
				}
			} );
		}
	} );

	jQuery( 'html' ).on( 'mouseenter', '.fusion-no-touch .fusion-flyout-menu .menu-item a', function() {
		jQuery( this ).parents( '.fusion-flyout-menu' ).find( '.fusion-flyout-menu-backgrounds #item-bg-' + jQuery( this ).parent().data( 'item-id' ) ).addClass( 'active' );
	} );

	jQuery( 'html' ).on( 'mouseleave', '.fusion-no-touch .fusion-flyout-menu .menu-item a', function() {
		jQuery( this ).parents( '.fusion-flyout-menu' ).find( '.fusion-flyout-menu-backgrounds #item-bg-' + jQuery( this ).parent().data( 'item-id' ) ).removeClass( 'active' );
	} );

	// Close mobile flyout menu if screen width is bigger then breakpoint.
	jQuery( window ).on( 'resize', function() {
		if ( jQuery( '.fusion-mobile-menu-design-flyout' ).hasClass( 'fusion-flyout-active' ) && Modernizr.mq( 'screen and (min-width: ' + ( parseInt( avadaHeaderVars.side_header_break_point, 10 ) + 1 ) + 'px)' ) ) {
			jQuery( '.fusion-flyout-menu-icons .fusion-flyout-menu-toggle' ).trigger( 'click' );
		}
	} ).on( 'fusion-reset-flyout-active-css', function() {
		resetFlyoutActiveCSS();
	} );
} );

jQuery( window ).on( 'load', function() {

	// Adjust mobile menu when it falls to 2 rows.
	window.mobileMenuSepAdded = false;

	function adjustMobileMenuSettings() {
		var menuWidth = 0;

		if ( Modernizr.mq( 'only screen and (max-width: ' + avadaMenuVars.side_header_break_point + 'px)' ) ) {
			jQuery( '.fusion-secondary-menu > ul' ).children( 'li' ).each( function() {
				menuWidth += jQuery( this ).outerWidth( true ) + 2;
			} );

			if ( menuWidth > jQuery( window ).width() && 318 < jQuery( window ).width() ) {
				if ( ! window.mobileMenuSepAdded ) {
					jQuery( '.fusion-secondary-menu > ul' ).append( '<div class="fusion-mobile-menu-sep"></div>' );
					jQuery( '.fusion-secondary-menu > ul' ).css( 'position', 'relative' );
					jQuery( '.fusion-mobile-menu-sep' ).css( {
						position: 'absolute',
						top: jQuery( '.fusion-secondary-menu > ul > li' ).height() - 1 + 'px',
						width: '100%',
						'border-bottom-width': '1px',
						'border-bottom-style': 'solid'
					} );
					window.mobileMenuSepAdded = true;
				}
			} else {
				jQuery( '.fusion-secondary-menu > ul' ).css( 'position', '' );
				jQuery( '.fusion-secondary-menu > ul' ).find( '.fusion-mobile-menu-sep' ).remove();
				window.mobileMenuSepAdded = false;
			}
		} else {
			jQuery( '.fusion-secondary-menu > ul' ).css( 'position', '' );
			jQuery( '.fusion-secondary-menu > ul' ).find( '.fusion-mobile-menu-sep' ).remove();
			window.mobileMenuSepAdded = false;
		}
	}

	adjustMobileMenuSettings();

	// Side header main nav
	if ( 'classic' === avadaMenuVars.mobile_menu_design ) {
		jQuery( '.sh-mobile-nav-holder' ).append( '<div class="mobile-selector" aria-expanded="false"><span>' + avadaMenuVars.dropdown_goto + '</span></div>' );
		jQuery( '.sh-mobile-nav-holder .mobile-selector' ).append( '<div class="selector-down"></div>' );
	}
	jQuery( '.sh-mobile-nav-holder' ).append( jQuery( '.nav-holder .fusion-navbar-nav' ).clone() );
	jQuery( '.sh-mobile-nav-holder .fusion-navbar-nav' ).attr( 'id', 'mobile-nav' );
	jQuery( '.sh-mobile-nav-holder ul#mobile-nav' ).removeClass( 'fusion-navbar-nav' );
	jQuery( '.sh-mobile-nav-holder ul#mobile-nav' ).children( '.cart' ).remove();
	jQuery( '.sh-mobile-nav-holder ul#mobile-nav .mobile-nav-item' ).children( '.login-box' ).remove();

	jQuery( '.sh-mobile-nav-holder ul#mobile-nav li' ).children( '#main-nav-search-link' ).each( function() {
		jQuery( this ).parents( 'li' ).remove();
	} );
	jQuery( '.sh-mobile-nav-holder ul#mobile-nav' ).find( 'li' ).each( function() {
		var classes = 'mobile-nav-item';

		if ( jQuery( this ).hasClass( 'current-menu-item' ) || jQuery( this ).hasClass( 'current-menu-parent' ) || jQuery( this ).hasClass( 'current-menu-ancestor' ) ) {
			classes += ' mobile-current-nav-item';
		}
		jQuery( this ).attr( 'class', classes );
		if ( jQuery( this ).attr( 'id' ) ) {
			jQuery( this ).attr( 'id', jQuery( this ).attr( 'id' ).replace( 'menu-item', 'mobile-menu-item' ) );
		}
		jQuery( this ).attr( 'style', '' );
	} );
	jQuery( '.sh-mobile-nav-holder .mobile-selector' ).on( 'click', function() {
		if ( jQuery( '.sh-mobile-nav-holder #mobile-nav' ).hasClass( 'mobile-menu-expanded' ) ) {
			jQuery( '.sh-mobile-nav-holder #mobile-nav' ).removeClass( 'mobile-menu-expanded' );
			jQuery( this ).attr( 'aria-expanded', 'false' );
		} else {
			jQuery( '.sh-mobile-nav-holder #mobile-nav' ).addClass( 'mobile-menu-expanded' );
			jQuery( this ).attr( 'aria-expanded', 'true' );
		}
		jQuery( '.sh-mobile-nav-holder #mobile-nav' ).slideToggle( 200, 'easeOutQuad' );
	} );

	// Make mobile menu sub-menu toggles
	if ( avadaMenuVars.submenu_slideout ) {
		jQuery( '.header-wrapper .mobile-topnav-holder .mobile-topnav li, .header-wrapper .mobile-nav-holder .navigation li, .sticky-header .mobile-nav-holder .navigation li, .sh-mobile-nav-holder .navigation li' ).each( function() {
			var classes = 'mobile-nav-item';

			if ( jQuery( this ).hasClass( 'current-menu-item' ) || jQuery( this ).hasClass( 'current-menu-parent' ) || jQuery( this ).hasClass( 'current-menu-ancestor' ) || jQuery( this ).hasClass( 'mobile-current-nav-item' ) ) {
				classes += ' mobile-current-nav-item';
			}
			jQuery( this ).attr( 'class', classes );

			if ( jQuery( this ).find( ' > ul' ).length ) {
				jQuery( this ).prepend( '<span href="#" aria-haspopup="true" class="open-submenu"></span>' );

				jQuery( this ).find( ' > ul' ).hide();
			}
		} );

		jQuery( '.header-wrapper .mobile-topnav-holder .open-submenu, .header-wrapper .mobile-nav-holder .open-submenu, .sticky-header .mobile-nav-holder .open-submenu, .sh-mobile-nav-holder .open-submenu' ).on( 'click', function( e ) {
			e.stopPropagation();
			jQuery( this ).parent().children( '.sub-menu' ).slideToggle( 200, 'easeOutQuad' );

		} );
	}

	if ( 'ontouchstart' in document.documentElement || navigator.msMaxTouchPoints ) {
		jQuery( '.fusion-main-menu li.menu-item-has-children > a, .fusion-secondary-menu li.menu-item-has-children > a, .order-dropdown > li .current-li' ).on( 'click', function() {
			var link = jQuery( this );
			if ( link.hasClass( 'hover' ) ) {
				link.removeClass( 'hover' );
				return true;
			}
			link.addClass( 'hover' );
			jQuery( '.fusion-main-menu li.menu-item-has-children > a, .fusion-secondary-menu li.menu-item-has-children > a, .order-dropdown > li .current-li' ).not( this ).removeClass( 'hover' );
			return false;

		} );

		jQuery( '.sub-menu li, .fusion-mobile-nav-item li' ).not( 'li.menu-item-has-children' ).on( 'click', function() {
			var link = jQuery( this ).find( 'a' ).attr( 'href' );
			if ( '_blank' !== jQuery( this ).find( 'a' ).attr( 'target' ) ) { // Fix for #1564
				if ( 0 < link.indexOf( '#' ) ) {
					link = ( '/' === link.charAt( link.indexOf( '#' ) - 1 ) ) ? link.replace( '#', '#_' ) : link.replace( '#', '/#_' );
				}
				window.location = link;
			}

			return true;
		} );
	}

	// Touch support for win phone devices
	jQuery( '.fusion-main-menu li.menu-item-has-children > a, .fusion-secondary-menu li.menu-item-has-children > a, .side-nav li.page_item_has_children > a' ).each( function() {
		jQuery( this ).attr( 'aria-haspopup', 'true' );
	} );

	// Ubermenu responsive fix
	if ( 1 <= jQuery( '.megaResponsive' ).length ) {
		jQuery( '.mobile-nav-holder.main-menu' ).addClass( 'set-invisible' );
	}

	// Position main menu search box correctly
	if ( 'top' === avadaMenuVars.header_position ) {
		jQuery( window ).on( 'fusion-resize-horizontal', function() {
			jQuery( '.main-nav-search' ).each( function() {
				var searchForm,
					searchFormWidth,
					searchFormLeftEdge,
					searchFormRightEdge,
					searchMenuItemLeftEdge,
					windowRightEdge;

				if ( jQuery( this ).hasClass( 'search-box-open' ) ) {
					searchForm             = jQuery( this ).find( '.main-nav-search-form' );
					searchFormWidth        = searchForm.outerWidth();
					searchFormLeftEdge     = searchForm.offset().left;
					searchFormRightEdge    = searchFormLeftEdge + searchFormWidth;
					searchMenuItemLeftEdge = searchForm.parent().offset().left;
					windowRightEdge        = jQuery( window ).width();

					if ( ! jQuery( 'body.rtl' ).length ) {
						if (
							( searchFormLeftEdge < searchMenuItemLeftEdge && 0 > searchFormLeftEdge ) ||
							( parseInt( searchFormLeftEdge, 10 ) === parseInt( searchMenuItemLeftEdge, 10 ) && 0 > searchFormLeftEdge - searchFormWidth )
						) {
							searchForm.css( {
								left: '0',
								right: 'auto'
							} );
						} else {
							searchForm.css( {
								left: 'auto',
								right: '0'
							} );
						}
					} else if (
						( parseInt( searchFormLeftEdge, 10 ) === parseInt( searchMenuItemLeftEdge, 10 ) && searchFormRightEdge > windowRightEdge ) ||
							( searchFormLeftEdge < searchMenuItemLeftEdge && searchFormRightEdge + searchFormWidth > windowRightEdge )
					) {
						searchForm.css( {
							left: 'auto',
							right: '0'
						} );
					} else {
						searchForm.css( {
							left: '0',
							right: 'auto'
						} );
					}
				}
			} );
		} );
	}

	jQuery( window ).on( 'fusion-resize-horizontal', function() {
		adjustMobileMenuSettings();
	} );

	jQuery( '.fusion-menu-login-box' ).each( function() {
		var $this   = jQuery( this ),
			loginBox = $this.find( '.fusion-custom-menu-item-contents' );

		loginBox.find( 'input[id="username"]' ).on( 'click', function() {
			$this.addClass( 'fusion-active-login' );
			$this.closest( '.fusion-main-menu' ).css( 'overflow', 'visible' );
		} );

		loginBox.find( 'input[id="username"]' ).on( 'input', function() {
			if ( $this.hasClass( 'fusion-active-login' ) ) {
				$this.removeClass( 'fusion-active-login' ).addClass( 'fusion-active-link' );
			}
		} );

		loginBox.find( 'input' ).not( '[id="username"]' ).on( 'click', function() {
			$this.removeClass( 'fusion-active-login' ).removeClass( 'fusion-active-link' );
			$this.closest( '.fusion-main-menu' ).css( 'overflow', '' );
		} );
	} );

	if ( jQuery( '.fusion-main-menu .fusion-menu-login-box' ).length ) {
		jQuery( '.fusion-main-menu' ).on( 'mouseleave', function() {
			var mainMenu     = jQuery( this ),
				loginBoxItem = mainMenu.find( '.fusion-menu-login-box' );

			setTimeout( function() {
				if ( 'hidden' === loginBoxItem.css( 'overflow' ) ) {
					mainMenu.css( 'overflow', '' );
				}
			}, 10 );
		} );
	}

	jQuery( document ).on( 'click', function( event ) {
		if ( 'fusion-custom-menu-item-contents' !== event.target.className && 'input-text' !== event.target.className ) {
			jQuery( '.fusion-custom-menu-item-contents' ).parents( '.fusion-custom-menu-item' ).removeClass( 'fusion-active-login' ).removeClass( 'fusion-active-link' );
			jQuery( '.fusion-main-menu' ).css( 'overflow', '' );
		}
	} );
} );

/**
 * Resize the overlay search wrapper according to main menu width and sticky menu width respectively.
 *
 * @since 6.1
 */
function resizeOverlaySearch() {
	var mainMenuWidth     = 0,
		mainMenuVisible   = true,
		stickyMenuWidth   = 0,
		stickyMenuVisible = true;

	// Size the width of the search according to menu width.
	if ( ! jQuery( '.fusion-main-menu:not(.fusion-sticky-menu)' ).is( ':visible' ) ) {
		mainMenuVisible = false;
		jQuery( '.fusion-main-menu:not(.fusion-sticky-menu)' ).css( 'display', 'block' );
	}

	jQuery( '.fusion-main-menu:not(.fusion-sticky-menu) .fusion-menu > li' ).each( function() {
		mainMenuWidth += jQuery( this ).outerWidth( true );
	} );
	jQuery( '.fusion-main-menu:not(.fusion-sticky-menu) .fusion-overlay-search' ).css( 'max-width', mainMenuWidth + 'px' );

	if ( ! mainMenuVisible ) {
		jQuery( '.fusion-main-menu:not(.fusion-sticky-menu)' ).css( 'display', '' );
	}

	// Size the width of the search according to the sticky menu width.
	if ( ! jQuery( '.fusion-main-menu.fusion-sticky-menu' ).is( ':visible' ) ) {
		stickyMenuVisible = false;
		jQuery( '.fusion-main-menu.fusion-sticky-menu' ).css( 'display', 'block' );
	}

	jQuery( '.fusion-main-menu.fusion-sticky-menu .fusion-menu > li' ).each( function() {
		stickyMenuWidth += jQuery( this ).outerWidth( true );
	} );
	jQuery( '.fusion-main-menu.fusion-sticky-menu .fusion-overlay-search' ).css( 'max-width', stickyMenuWidth + 'px' );

	if ( ! stickyMenuVisible ) {
		jQuery( '.fusion-main-menu.fusion-sticky-menu' ).css( 'display', '' );
	}
}
