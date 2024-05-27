/* global fusion, getStickyHeaderHeight, fusionScrollToAnchorVars, Modernizr, fusionGetStickyOffset */
function awbScrollToTarget( $target, customScrollOffset ) {
	var animationRoot   = ( jQuery( 'html' ).hasClass( 'ua-edge' ) || jQuery( 'html' ).hasClass( 'ua-safari-12' ) || jQuery( 'html' ).hasClass( 'ua-safari-11' ) || jQuery( 'html' ).hasClass( 'ua-safari-10' ) ) ? 'body' : 'html',
		customHeader    = jQuery( '.fusion-tb-header' ).length,
		customSticky    = false,
		endCustomSticky = false,
		$adminbarHeight,
		$stickyHeaderHeight,
		$currentScrollPosition,
		$newScrollPosition,
		$halfScrollAmount,
		$offCanvasContent,
		contentTop,
		targetTop,
		currentScroll,
		maxScrollTop,
		$halfScrollPosition,
		scrollSectionElement;

	customScrollOffset = 'undefined' !== typeof customScrollOffset ? customScrollOffset : 0;

	if ( $target.length ) {

		// Ignore full scroll section slider.
		if ( $target.parents( '.fusion-scroll-section' ).hasClass( 'awb-swiper-full-sections' ) ) {
			return;
		}

		// Anchor link inside of a 100% height scrolling section needs special handling.
		if ( ( $target.parents( '.hundred-percent-height-scrolling' ).length || $target.find( '.hundred-percent-height-scrolling' ).length ) && ( 0 != fusionScrollToAnchorVars.container_hundred_percent_height_mobile || ! Modernizr.mq( 'only screen and (max-width: ' + fusionScrollToAnchorVars.content_break_point + 'px)' ) ) ) { // jshint ignore:line

			// Anchor is on the scroll section itself.
			if ( $target.hasClass( 'fusion-scroll-section-element' ) ) {
				scrollSectionElement = $target;
			} else {

				// Anchor is inside the scroll section or using menu anchor option.
				scrollSectionElement = $target.parents( '.fusion-scroll-section-element' );
			}

			// Scrolled position is already at anchor, so do nothing.
			if ( scrollSectionElement.hasClass( 'active' ) && scrollSectionElement.offset().top >= jQuery( window ).scrollTop() && scrollSectionElement.offset().top < jQuery( window ).scrollTop() + jQuery( window ).height() ) {
				return false;
			}

			// If the anchor link was invoked from a different page add a special class to supress the scroll section scroll script.
			if ( location.hash && '#_' === location.hash.substring( 0, 2 ) ) {
				jQuery( '.fusion-page-load-link' ).addClass( 'fusion-page.load-scroll-section-link' );
			}

			if ( $target.parents( '.fusion-scroll-section' ).length ) {

				// If the scrolling section itself is not yet active, we first have to scroll to it.
				if ( ! $target.parents( '.fusion-scroll-section' ).hasClass( 'active' ) ) {

					// First scroll to the section top.
					$halfScrollPosition = Math.ceil( $target.parents( '.fusion-scroll-section' ).offset().top );

					jQuery( animationRoot ).animate( {
						scrollTop: $halfScrollPosition
					}, { duration: 400, easing: 'easeInExpo', complete: function() {

						// Timeout is needed, that all section elements get properly set.
						setTimeout( function() {

							// Trigger click on the nav item belonging to the element holding the anchor, which will perform the actual scrolling.
							$target.parents( '.fusion-scroll-section' ).find( '.fusion-scroll-section-nav' ).find( '.fusion-scroll-section-link[data-element=' + scrollSectionElement.data( 'element' )  + ']' ).trigger( 'click' );

							// Manipulate history after animation.
							if ( location.hash && '#_' === location.hash.substring( 0, 2 ) ) {
								if ( 'history' in window && 'replaceState' in history ) {
									history.replaceState( '', window.location.href.replace( '#_', '#' ), window.location.href.replace( '#_', '#' ) );
								}

								jQuery( '.fusion-page-load-link' ).removeClass( 'fusion-page.load-scroll-section-link' );
							}
						}, parseInt( fusionScrollToAnchorVars.hundred_percent_scroll_sensitivity ) + 50 );
					}
					} );
				} else {

					// We stay within the same main scrolling section, so we just have to trigger the correct nav item.

					// Trigger click on the nav item belonging to the element holding the anchor, which will perform the actual scrolling.
					$target.parents( '.fusion-scroll-section' ).find( '.fusion-scroll-section-nav' ).find( '.fusion-scroll-section-link[data-element=' + scrollSectionElement.data( 'element' )  + ']' ).trigger( 'click' );
				}

				return false;
			}
		}

		// Anchor link inside offcanvas.
		if ( $target.parents( '.awb-off-canvas' ).length ) {
			if ( 0 === $target.parents( '.awb-off-canvas-wrap.awb-show' ).length ) {
				return false;
			}

			$offCanvasContent = $target.parents( '.awb-off-canvas-wrap.awb-show' ).find( '.off-canvas-content' );
			contentTop = $offCanvasContent[ 0 ].getBoundingClientRect().top;
			targetTop = $target[ 0 ].getBoundingClientRect().top;

			currentScroll = $offCanvasContent.scrollTop();

			if ( targetTop < contentTop ) {
				$newScrollPosition = currentScroll - ( contentTop - targetTop );
			} else {
				$newScrollPosition = Math.abs( currentScroll + ( targetTop - contentTop ) );
			}

			maxScrollTop = $offCanvasContent[ 0 ].scrollHeight - $offCanvasContent.outerHeight();
			if ( $newScrollPosition > maxScrollTop ) {
				$newScrollPosition = maxScrollTop;
			}

			$offCanvasContent.animate( {
				scrollTop: $newScrollPosition
			}, { duration: 400 } );

			return;
		}

		$adminbarHeight        = fusion.getAdminbarHeight();
		$currentScrollPosition = jQuery( document ).scrollTop();

		// Add scroll class, used for transition of custom headers.
		if ( customHeader ) {
			jQuery( 'body' ).addClass( 'fusion-scrolling-active' );
			customSticky = fusionGetStickyOffset();
			if ( ! customSticky ) {
				customSticky = $adminbarHeight;
			}
			$newScrollPosition = $target.offset().top - customSticky - customScrollOffset;
		} else {
			$stickyHeaderHeight    = ( 'function' === typeof getStickyHeaderHeight ) ? getStickyHeaderHeight() : 0;
			$newScrollPosition     = $target.offset().top - $adminbarHeight - $stickyHeaderHeight - customScrollOffset;
		}

		$halfScrollAmount = Math.abs( $currentScrollPosition - $newScrollPosition ) / 2;

		if ( $currentScrollPosition > $newScrollPosition ) {
			$halfScrollPosition = $currentScrollPosition - $halfScrollAmount;
		} else {
			$halfScrollPosition = $currentScrollPosition + $halfScrollAmount;
		}

		jQuery( animationRoot ).animate( {
			scrollTop: $halfScrollPosition
		}, { duration: 400, easing: 'easeInExpo',
			complete: function() {
				$adminbarHeight = fusion.getAdminbarHeight();

				if ( customHeader ) {
					customSticky = fusionGetStickyOffset();
					if ( ! customSticky ) {
						customSticky = $adminbarHeight;
					}
					$newScrollPosition = Math.ceil( $target.offset().top ) - customSticky - customScrollOffset;
				} else {
					$stickyHeaderHeight = ( 'function' === typeof getStickyHeaderHeight ) ? getStickyHeaderHeight() : 0;
					$newScrollPosition  = ( Math.ceil( $target.offset().top ) - $adminbarHeight - $stickyHeaderHeight - customScrollOffset );
				}

				jQuery( animationRoot ).animate( {
					scrollTop: $newScrollPosition
				}, 450, 'easeOutExpo', function() {

					// Manipulate history after animation.
					if ( location.hash && '#_' === location.hash.substring( 0, 2 ) ) {
						if ( 'history' in window && 'replaceState' in history ) {
							history.replaceState( '', window.location.href.replace( '#_', '#' ), window.location.href.replace( '#_', '#' ) );
						}
					}

					if ( customHeader ) {

						// One final check if position has changed.
						endCustomSticky = fusionGetStickyOffset();
						if ( ! endCustomSticky ) {
							endCustomSticky = $adminbarHeight;
						}
						if ( customSticky !== endCustomSticky ) {
							$newScrollPosition = Math.ceil( $target.offset().top ) - endCustomSticky - customScrollOffset;
							jQuery( animationRoot ).animate( {
								scrollTop: $newScrollPosition
							}, 450 );
						}

						// Remove scroll class, used for transition of custom headers.
						jQuery( 'body' ).removeClass( 'fusion-scrolling-active' );
					}
				} );

			}

		} );

		// On page tab link.
		if ( ( $target.hasClass( 'tab-pane' ) || $target.hasClass( 'tab-link' ) ) && 'function' === typeof jQuery.fn.fusionSwitchTabOnLinkClick ) {
			setTimeout( function() {
				$target.parents( '.fusion-tabs' ).fusionSwitchTabOnLinkClick();
			}, 100 );
		}

		return false;
	}
}
( function( jQuery ) {

	'use strict';

	// Smooth scrolling to anchor target
	jQuery.fn.fusion_scroll_to_anchor_target = function( customScrollOffset ) {
		var $href           = 'undefined' !== typeof jQuery( this ).attr( 'href' ) ? jQuery( this ).attr( 'href' ) : jQuery( this ).data( 'link' ),
			$hrefHash       = $href.substr( $href.indexOf( '#' ) ).slice( 1 ),
			$target         = jQuery( '#' + $hrefHash );

		if ( '' !== $hrefHash  ) {
			awbScrollToTarget( $target, customScrollOffset );
		}
	};

}( jQuery ) );

jQuery( document ).ready( function() {

	jQuery( 'body' ).on( 'click', '.fusion-menu a:not([href="#"], .fusion-megamenu-widgets-container a, .search-link), .fusion-widget-menu a, .fusion-secondary-menu a, .fusion-mobile-nav-item a:not([href="#"], .search-link), .fusion-button:not([href="#"], input, button), .fusion-one-page-text-link:not([href="#"]), .fusion-content-boxes .fusion-read-more:not([href="#"]), .fusion-imageframe > .fusion-no-lightbox, .content-box-wrapper:not(.link-area-box) .heading-link, a.woocommerce-review-link, .awb-toc-el .awb-toc-el__item-anchor', function( e ) {
		var $target,
			$targetArray,
			$targetID,
			$targetIDFirstChar,
			$targetPath,
			$targetPathLastChar,
			$targetWindow,
			$tabLink,
			isBuilder = jQuery( 'body' ).hasClass( 'fusion-builder-live' );

		if ( ( jQuery( this ).hasClass( 'avada-noscroll' ) || jQuery( this ).parent().hasClass( 'avada-noscroll' ) ) || ( jQuery( this ).is( '.fusion-content-box-button, .fusion-tagline-button' ) && jQuery( this ).parents( '.avada-noscroll' ).length ) ) {
			return true;
		}

		if ( this.hash ) {

			// Target path.
			$targetWindow       = ( jQuery( this ).attr( 'target' ) ) ? jQuery( this ).attr( 'target' ) : '_self';
			$target             = jQuery( this ).attr( 'href' );
			$targetArray        = $target.split( '#' );
			$targetID           = ( 'undefined' !== typeof $targetArray[ 1 ] ) ? $targetArray[ 1 ] : '';
			$targetIDFirstChar  = $targetID.substring( 0, 1 );
			$targetPath         = $targetArray[ 0 ];
			$targetPathLastChar = $targetPath.substring( $targetPath.length - 1, $targetPath.length );

			// A fully outbound link, do nothing.
			if ( window.location.host !== this.host ) {
				return;
			}

			// Exclude hubSpot chat link.
			if ( '#hubspot-open-chat' === $target ) {
				return;
			}

			// Exclude next/previus steps.
			if ( '#previousStep' === $target || '#nextStep' === $target ) {
				return;
			}

			// Exclude tabs link.
			$tabLink  = $targetID.split( '-' );
			if ( 'undefined' !== typeof $tabLink[ 0 ] && 'tab' === $tabLink[ 0 ] && jQuery( this ).parents( '.awb-menu__mega-wrap' ).length ) {
				return;
			}
			if ( '/' !== $targetPathLastChar ) {
				$targetPath = $targetPath + '/';
			}

			if ( '!' === $targetIDFirstChar || '/' === $targetIDFirstChar  ) {
				return;
			}

			e.preventDefault();

			// If the link is outbound add an underscore right after the hash tag to make sure the link isn't present on the loaded page.
			if ( ( location.pathname.replace( /^\//, '' ) == this.pathname.replace( /^\//, '' ) || '#' === $target.charAt( 0 ) ) && ( '' === location.search || -1 !== location.search.indexOf( 'lang=' ) || -1 !== location.search.indexOf( 'builder=' ) || jQuery( this ).hasClass( 'tfs-scroll-down-indicator' ) || jQuery( this ).hasClass( 'fusion-same-page-scroll' ) ) ) { // jshint ignore:line
				jQuery( this ).fusion_scroll_to_anchor_target();
				if ( 'history' in window && 'replaceState' in history && ! isBuilder ) {
					history.replaceState( '',  $target, $target );
				}

				// Menu element flyout menu.
				if ( jQuery( this ).closest( '.awb-menu.flyout-submenu-expanded' ).length ) {
					jQuery( this ).closest( '.awb-menu.flyout-submenu-expanded' ).find( '.awb-menu__flyout-close' ).trigger( 'click' );
				} else if ( jQuery( this ).closest( '.fusion-flyout-menu' ).length ) {

					// Legacy flyout menu.
					jQuery( '.fusion-flyout-menu-toggle' ).trigger( 'click' );
				} else if ( jQuery( this ).closest( '.fusion-megamenu-menu, .awb-menu__sub-ul' ).length ) {
					jQuery( this ).blur();
				}


				// Remove focus from anchor link inside mega menu.
				if ( jQuery( this ).closest( '.awb-menu .awb-menu__mega-wrap' ).length ) {
					jQuery( this ).blur();
				}
			} else if ( ! isBuilder && ! $target.includes( '-oc__' ) ) {

				// If we are on search page, front page anchors won't work, unless we add full path.
				if ( '/' === $targetPath && '' !== location.search ) {
					$targetPath = location.href.replace( location.search, '' );
				}

				window.open( $targetPath + '#_' + $targetID, $targetWindow );
			}
		}
	} );
} );

// Prevent anchor jumping on page load.
if ( location.hash && '#_' === location.hash.substring( 0, 2 ) ) {

	// Add the anchor link to the hidden a tag
	jQuery( '.fusion-page-load-link' ).attr( 'href', decodeURIComponent( '#' + location.hash.substring( 2 ) ) );

	// Scroll the page
	jQuery( window ).on( 'load', function() {
		if ( jQuery( '.fusion-blog-shortcode' ).length ) {
			setTimeout( function() {
				jQuery( '.fusion-page-load-link' ).fusion_scroll_to_anchor_target();
			}, 300 );
		} else {
			jQuery( '.fusion-page-load-link' ).fusion_scroll_to_anchor_target();
		}
	} );
}
