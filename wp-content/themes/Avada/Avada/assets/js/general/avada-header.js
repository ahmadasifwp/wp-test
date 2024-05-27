/* global fusion, avadaHeaderVars, Modernizr, cssua, resizeOverlaySearch */
/* eslint max-depth: 0 */
/* eslint no-unused-vars: 0 */
function fusionDisableStickyHeader() {
	jQuery( window ).off( '.stickyheader' );
	jQuery( '.fusion-header-wrapper, .fusion-header-sticky-height, .fusion-header, .fusion-logo, .fusion-header-wrapper .fusion-main-menu > li a, .fusion-header-wrapper .fusion-secondary-main-menu' ).attr( 'style', '' );
	jQuery( '.fusion-is-sticky' ).removeClass( 'fusion-is-sticky' );
}

function fusionInitStickyHeader() {
	var $animationDuration = 300,
		$headerParent,
		$menuHeight,
		$logo,
		$stickyHeaderScrolled,
		$logoImage,
		resizeWidth,
		resizeHeight,
		notInitial = true,
		topHeaderHeight = 0;

	if ( ! avadaHeaderVars.sticky_header_shrinkage ) {
		$animationDuration = 0;
	}

	$headerParent                   = jQuery( '.fusion-header' ).parent();
	window.$headerParentHeight      = $headerParent.outerHeight();
	window.$headerHeight            = jQuery( '.fusion-header' ).outerHeight();
	$menuHeight                     = parseInt( avadaHeaderVars.nav_height, 10 );
	window.$menuHeight              = $menuHeight;
	window.$scrolled_header_height  = 65;
	$logo                           = ( jQuery( '.fusion-logo img:visible' ).length ) ? jQuery( '.fusion-logo img:visible' ) : '';
	$stickyHeaderScrolled           = false;
	window.$stickyTrigger           = jQuery( '.fusion-header' );
	window.$wpadminbarHeight        = fusion.getAdminbarHeight();
	window.$stickyTrigger_position  = ( window.$stickyTrigger.length ) ? Math.round( window.$stickyTrigger.offset().top ) - window.$wpadminbarHeight - window.$woo_store_notice - window.$top_frame : 0;
	window.$woo_store_notice        = ( jQuery( '.woocommerce-store-notice' ).length && jQuery( '.woocommerce-store-notice' ).is( ':visible' ) ) ? jQuery( '.woocommerce-store-notice' ).outerHeight() : 0;
	window.$top_frame               = ( jQuery( '.fusion-top-frame' ).is( ':visible' ) ) ? jQuery( '.fusion-top-frame' ).outerHeight() - window.$woo_store_notice : 0;
	window.sticky_header_type       = 1;
	window.$slider_offset           = 0;
	window.$site_width              = jQuery( '#wrapper' ).outerWidth();
	window.$media_query_test_1      = Modernizr.mq( 'only screen and (min-device-width: 768px) and (max-device-width: 1366px) and (orientation: portrait)' ) ||  Modernizr.mq( 'only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape)' );
	window.$media_query_test_2      = Modernizr.mq( 'screen and (max-width: ' + avadaHeaderVars.side_header_break_point + 'px)' );
	window.$media_query_test_3      = Modernizr.mq( 'screen and (max-width: ' + avadaHeaderVars.side_header_break_point + 'px)' );
	window.$media_query_test_4      = Modernizr.mq( 'only screen and (max-width: ' + avadaHeaderVars.side_header_break_point + 'px)' );
	window.$standardLogoHeight      = jQuery( '.fusion-standard-logo' ).height();
	window.$logoMarginTop           = '' !== jQuery( '.fusion-logo' ).data( 'margin-top' ) ? parseInt( jQuery( '.fusion-logo' ).data( 'margin-top' ), 10 ) : 0;
	window.$logoMarginBottom        = '' !== jQuery( '.fusion-logo' ).data( 'margin-bottom' ) ? parseInt( jQuery( '.fusion-logo' ).data( 'margin-bottom' ), 10 ) : 0;
	window.$standardLogoHeight      += window.$logoMarginTop + window.$logoMarginBottom;

	window.$initial_desktop_header_height   = Math.max( window.$headerHeight, Math.round( Math.max( window.$menuHeight, window.$standardLogoHeight ) + parseFloat( jQuery( '.fusion-header' ).find( '.fusion-row' ).css( 'padding-top' ) ) + parseFloat( jQuery( '.fusion-header' ).find( '.fusion-row' ).css( 'padding-bottom' ) ) ) );
	window.$initial_sticky_header_shrinkage = avadaHeaderVars.sticky_header_shrinkage;
	window.$sticky_can_be_shrinked          = true;

	if ( ! avadaHeaderVars.sticky_header_shrinkage ) {
		$animationDuration = 0;
		window.$scrolled_header_height = window.$headerHeight;
	}

	window.original_logo_height = 0;

	if ( '' !== $logo ) {

		// Getting the correct natural height of the visible logo.
		if ( $logo[ 0 ].hasAttribute( 'data-retina_logo_url' ) ) {
			$logoImage = new Image();
			$logoImage.src = $logo.attr( 'data-retina_logo_url' );
			window.original_logo_height = parseInt( $logo.height(), 10 ) + parseInt( avadaHeaderVars.logo_margin_top, 10 ) + parseInt( avadaHeaderVars.logo_margin_bottom, 10 );
		} else {

			// For normal logo we need to setup the image object to get the natural heights.
			$logoImage = new Image();
			$logoImage.src = $logo.attr( 'src' );
			window.original_logo_height = parseInt( $logoImage.naturalHeight, 10 ) + parseInt( avadaHeaderVars.logo_margin_top, 10 ) + parseInt( avadaHeaderVars.logo_margin_bottom, 10 );

		}
	}

	// Different sticky header behavior for header v4/v5.
	// Instead of header with logo, secondary menu is made sticky.
	if ( 1 <= jQuery( '.fusion-header-v4' ).length || 1 <= jQuery( '.fusion-header-v5' ).length ) {
		window.sticky_header_type = 2;
		if ( 'menu_and_logo' === avadaHeaderVars.header_sticky_type2_layout || ( Modernizr.mq( 'only screen and (max-width: ' + avadaHeaderVars.side_header_break_point + 'px)' ) && 'modern' === avadaHeaderVars.mobile_menu_design ) ) {
			window.$stickyTrigger = jQuery( '.fusion-sticky-header-wrapper' );
		} else {
			window.$stickyTrigger = jQuery( '.fusion-secondary-main-menu' );
		}
		window.$stickyTrigger_position = Math.round( window.$stickyTrigger.offset().top ) - window.$wpadminbarHeight - window.$woo_store_notice - window.$top_frame;
	}

	if ( 1 === window.sticky_header_type ) {
		if ( Modernizr.mq( 'only screen and (max-width: ' + avadaHeaderVars.side_header_break_point + 'px)' ) ) {
			window.$scrolled_header_height = window.$headerHeight;
		} else {
			window.$original_sticky_trigger_height = jQuery( window.$stickyTrigger ).outerHeight();
		}
	} else if ( 2 === window.sticky_header_type ) {
		if ( 'classic' === avadaHeaderVars.mobile_menu_design ) {
			jQuery( $headerParent ).height( window.$headerParentHeight );
		}

		if ( ! Modernizr.mq( 'only screen and (max-width: ' + avadaHeaderVars.side_header_break_point + 'px)' ) ) {
			jQuery( $headerParent ).height( window.$headerParentHeight );
		} else {
			window.$scrolled_header_height = window.$headerParentHeight;
		}
	}

	// Side Header
	if ( 1 <= jQuery( '#side-header' ).length ) {
		window.sticky_header_type = 3;
	}

	if ( jQuery( '.fusion-secondary-header' ).length ) {
		topHeaderHeight = jQuery( '.fusion-secondary-header' ).outerHeight();
	}

	// If there is not enough space for sticky header to trigger safely.
	if ( jQuery( document ).height() - ( window.$initial_desktop_header_height + topHeaderHeight + window.$wpadminbarHeight - window.$scrolled_header_height ) < jQuery( window ).height() && avadaHeaderVars.sticky_header_shrinkage ) {
		window.$sticky_can_be_shrinked = false;
		jQuery( '.fusion-header-wrapper' ).removeClass( 'fusion-is-sticky' );
	} else {
		window.$sticky_can_be_shrinked = true;
	}

	resizeWidth  = jQuery( window ).width();
	resizeHeight = jQuery( window ).height();

	jQuery( window ).on( 'resize.stickyheader', function() {
		var $stickyTrigger,
			$logoHeightWithMargin,
			$mainMenuWidth,
			$availableWidth,
			$scrolledLogoHeight,
			$scrolledLogoContainerMargin;

		window.$media_query_test_1 = Modernizr.mq( 'only screen and (min-device-width: 768px) and (max-device-width: 1366px) and (orientation: portrait)' ) ||  Modernizr.mq( 'only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape)' );
		window.$media_query_test_2 = Modernizr.mq( 'screen and (max-width: ' + avadaHeaderVars.side_header_break_point + 'px)' );
		window.$media_query_test_3 = Modernizr.mq( 'screen and (max-width: ' + avadaHeaderVars.side_header_break_point + 'px)' );
		window.$media_query_test_4 = Modernizr.mq( 'only screen and (max-width: ' + avadaHeaderVars.side_header_break_point + 'px)' );

		// Recalculate the header height if percentage padding is being used.
		if ( Modernizr.mq( 'only screen and (min-width: ' + avadaHeaderVars.side_header_break_point + 'px)' ) && ( -1 !== avadaHeaderVars.header_padding_top.indexOf( '%' ) || -1 !== avadaHeaderVars.header_padding_bottom.indexOf( '%' ) ) && ! jQuery( '.fusion-is-sticky' ).length ) {
			window.$headerHeight = Math.round( Math.max( window.$menuHeight, window.$standardLogoHeight ) + parseFloat( jQuery( '.fusion-header' ).find( '.fusion-row' ).css( 'padding-top' ) ) + parseFloat( jQuery( '.fusion-header' ).find( '.fusion-row' ).css( 'padding-bottom' ) ) );
			jQuery( '.fusion-header, .fusion-header-sticky-height' ).height( window.$headerHeight );

			// If no sticky header animation, update sticky height to match.
			if ( ! avadaHeaderVars.sticky_header_shrinkage ) {
				window.$scrolled_header_height = window.$headerHeight;
			}
		}

		if ( -1 !== avadaHeaderVars.header_padding_top.indexOf( '%' ) || ( -1 !== avadaHeaderVars.header_padding_bottom.indexOf( '%' ) && ! jQuery( '.fusion-is-sticky' ).length ) ) {
			window.$initial_desktop_header_height = Math.max( window.$headerHeight, Math.round( Math.max( window.$menuHeight, window.$standardLogoHeight ) + parseFloat( jQuery( '.fusion-header' ).find( '.fusion-row' ).css( 'padding-top' ) ) + parseFloat( jQuery( '.fusion-header' ).find( '.fusion-row' ).css( 'padding-bottom' ) ) ) );
		}

		if ( ! avadaHeaderVars.header_sticky_tablet && ( window.$media_query_test_1 ) ) {
			jQuery( '.fusion-header-wrapper, .fusion-header-sticky-height, .fusion-header, .fusion-logo, .fusion-header-wrapper .fusion-main-menu > li a, .fusion-header-wrapper .fusion-secondary-main-menu' ).attr( 'style', '' );
			jQuery( '.fusion-header-wrapper' ).removeClass( 'fusion-is-sticky' );
		} else if ( avadaHeaderVars.header_sticky_tablet && ( window.$media_query_test_1 ) ) {
			$animationDuration = 0;
		}

		if ( ! avadaHeaderVars.header_sticky_mobile && window.$media_query_test_2 && ! window.$media_query_test_1 ) {
			jQuery( '.fusion-header-wrapper, .fusion-header-sticky-height, .fusion-header, .fusion-logo, .fusion-header-wrapper .fusion-main-menu > li a, .fusion-header-wrapper .fusion-secondary-main-menu' ).attr( 'style', '' );
			jQuery( '.fusion-header-wrapper' ).removeClass( 'fusion-is-sticky' );
		} else if ( avadaHeaderVars.header_sticky_mobile && window.$media_query_test_2 && ! window.$media_query_test_1 ) {
			$animationDuration = 0;
		}

		// Check the variable stored dimensions are not 0, real resize event occured or in front-end editor.
		if ( jQuery( 'body' ).hasClass( 'fusion-builder-live' ) || ( ( resizeWidth && resizeHeight ) && ( jQuery( window ).width() !== resizeWidth || jQuery( window ).height() !== resizeHeight ) && notInitial ) ) {

			// Check for actual resize.
			$menuHeight = parseInt( avadaHeaderVars.nav_height, 10 );

			window.$wpadminbarHeight = fusion.getAdminbarHeight();

			window.$woo_store_notice = ( jQuery( '.woocommerce-store-notice' ).length && jQuery( '.woocommerce-store-notice' ).is( ':visible' ) ) ? jQuery( '.woocommerce-store-notice' ).outerHeight() : 0;

			if ( jQuery( '.fusion-is-sticky' ).length ) {
				$stickyTrigger = jQuery( '.fusion-header' );

				if ( 2 === window.sticky_header_type ) {
					if ( 'menu_only' === avadaHeaderVars.header_sticky_type2_layout && ( 'classic' === avadaHeaderVars.mobile_menu_design || ! window.$media_query_test_4 ) ) {
						$stickyTrigger = jQuery( '.fusion-secondary-main-menu' );
					} else {
						$stickyTrigger = jQuery( '.fusion-sticky-header-wrapper' );
					}
				}

				if ( window.$wpadminbarHeight ) {

					// Unset the top value for all candidates
					jQuery( '.fusion-header, .fusion-sticky-header-wrapper, .fusion-secondary-main-menu' ).css( 'top', '' );

					// Set top value for coreect selector
					jQuery( $stickyTrigger ).css( 'top', window.$wpadminbarHeight + window.$woo_store_notice + window.$top_frame );
				}

				if ( 'boxed' === avadaHeaderVars.layout_mode.toLowerCase() ) {
					jQuery( $stickyTrigger ).css( 'max-width', jQuery( '#wrapper' ).outerWidth() + 'px' );
				}
			}

			// Refresh header v1, v2, v3 and v6
			if ( 1 === window.sticky_header_type ) {
				avadaHeaderVars.sticky_header_shrinkage = window.$initial_sticky_header_shrinkage;

				if ( ! jQuery( '.fusion-header-wrapper' ).hasClass( 'fusion-is-sticky' ) ) {

					if ( jQuery( '.fusion-secondary-header' ).length ) {
						window.$stickyTrigger_position = Math.round( jQuery( '.fusion-secondary-header' ).offset().top )  - window.$wpadminbarHeight - window.$woo_store_notice - window.$top_frame + jQuery( '.fusion-secondary-header' ).outerHeight();

					// If there is no secondary header, trigger position is 0
					} else {
						window.$stickyTrigger_position = Math.round( jQuery( '.fusion-header' ).offset().top )  - window.$wpadminbarHeight - window.$woo_store_notice - window.$top_frame;
					}

				}

				// Desktop mode
				if ( ! Modernizr.mq( 'only screen and (max-width: ' + avadaHeaderVars.side_header_break_point + 'px)' ) ) {
					$logoHeightWithMargin = jQuery( '.fusion-logo img:visible' ).length ? jQuery( '.fusion-logo img:visible' ).outerHeight() + parseInt( avadaHeaderVars.logo_margin_top, 10 ) + parseInt( avadaHeaderVars.logo_margin_bottom, 10 ) : 0;
					$mainMenuWidth = 0;

					// Calculate actual menu width
					jQuery( '.fusion-main-menu > ul > li' ).each( function() {
						$mainMenuWidth += jQuery( this ).outerWidth();
					} );

					if ( jQuery( '.fusion-header-v6' ).length ) {
						$mainMenuWidth = 0;
					}

					// Sticky desktop header
					if ( jQuery( '.fusion-is-sticky' ).length ) {
						if ( $mainMenuWidth > ( jQuery( '.fusion-header .fusion-row' ).width() - jQuery( '.fusion-logo img:visible' ).outerWidth() ) ) {
							window.$headerHeight = jQuery( '.fusion-main-menu' ).outerHeight() + $logoHeightWithMargin;
							if ( jQuery( '.fusion-header-v7' ).length ) {
								window.$headerHeight = jQuery( '.fusion-middle-logo-menu' ).height();
							}

							// Headers v2 and v3 have a 1px bottom border
							if ( jQuery( '.fusion-header-v2' ).length || jQuery( '.fusion-header-v3' ).length ) {
								window.$headerHeight += 1;
							}
						} else if ( ! avadaHeaderVars.sticky_header_shrinkage ) {
							if ( window.original_logo_height > $menuHeight ) {
								window.$headerHeight = window.original_logo_height;
							} else {
								window.$headerHeight = $menuHeight;
							}

							window.$headerHeight += parseFloat( jQuery( '.fusion-header > .fusion-row' ).css( 'padding-top' ) ) + parseFloat( jQuery( '.fusion-header > .fusion-row' ).css( 'padding-bottom' ) );
							window.$headerHeight = Math.round( window.$headerHeight );

							// Headers v2 and v3 have a 1px bottom border
							if ( jQuery( '.fusion-header-v2' ).length || jQuery( '.fusion-header-v3' ).length ) {
								window.$headerHeight += 1;
							}
						} else {
							window.$headerHeight = 65;
						}

						window.$scrolled_header_height = window.$headerHeight;

						jQuery( '.fusion-header-sticky-height' ).css( 'height', window.$headerHeight );
						jQuery( '.fusion-header' ).css( 'height', window.$headerHeight );

					// Non sticky desktop header.
					} else {
						$availableWidth =  jQuery( '.fusion-header .fusion-row' ).width() - jQuery( '.fusion-logo img:visible' ).outerWidth();
						if ( jQuery( '.fusion-header-v7' ).length ) {
							$availableWidth =  jQuery( '.fusion-header .fusion-row' ).width();
						}
						if ( $mainMenuWidth > $availableWidth ) {
							window.$headerHeight = jQuery( '.fusion-main-menu' ).outerHeight() + $logoHeightWithMargin;
							if ( jQuery( '.fusion-header-v7' ).length ) {
								window.$headerHeight = jQuery( '.fusion-middle-logo-menu' ).height();
							}
							avadaHeaderVars.sticky_header_shrinkage = false;
						} else {
							if ( window.original_logo_height > $menuHeight ) {
								window.$headerHeight = window.original_logo_height;
							} else {
								window.$headerHeight = $menuHeight;
							}

							if ( jQuery( '.fusion-header-v7' ).length ) {
								window.$headerHeight = jQuery( '.fusion-main-menu' ).outerHeight();
							}
						}

						window.$headerHeight += parseFloat( jQuery( '.fusion-header > .fusion-row' ).css( 'padding-top' ) ) + parseFloat( jQuery( '.fusion-header > .fusion-row' ).css( 'padding-bottom' ) );
						window.$headerHeight = Math.round( window.$headerHeight );

						// Headers v2 and v3 have a 1px bottom border
						if ( jQuery( '.fusion-header-v2' ).length || jQuery( '.fusion-header-v3' ).length ) {
							window.$headerHeight += 1;
						}

						window.$scrolled_header_height = 65;

						if ( ! avadaHeaderVars.sticky_header_shrinkage ) {
							window.$scrolled_header_height = window.$headerHeight;
						}

						jQuery( '.fusion-header-sticky-height' ).css( 'height', window.$headerHeight );
						jQuery( '.fusion-header' ).css( 'height', window.$headerHeight );
					}
				}

				// Mobile mode.
				if ( Modernizr.mq( 'only screen and (max-width: ' + avadaHeaderVars.side_header_break_point + 'px)' ) ) {
					jQuery( '.fusion-header' ).css( 'height', '' );

					window.$headerHeight = jQuery( '.fusion-header' ).outerHeight();
					window.$scrolled_header_height = window.$headerHeight;

					jQuery( '.fusion-header-sticky-height' ).css( 'height', window.$scrolled_header_height );
				}
			}

			// Refresh header v4 and v5.
			if ( 2 === window.sticky_header_type ) {
				if ( 'modern' === avadaHeaderVars.mobile_menu_design ) {

					// Desktop mode and sticky active
					if ( ! Modernizr.mq( 'only screen and (max-width: ' + avadaHeaderVars.side_header_break_point + 'px)' ) && jQuery( '.fusion-is-sticky' ).length && 'menu_only' === avadaHeaderVars.header_sticky_type2_layout ) {
						window.$headerParentHeight = jQuery( '.fusion-header' ).parent().outerHeight() + jQuery( '.fusion-secondary-main-menu' ).outerHeight();
					} else {
						window.$headerParentHeight = jQuery( '.fusion-header' ).parent().outerHeight();
					}
					window.$scrolled_header_height = window.header_parent_height;

					// Desktop Mode
					if ( ! Modernizr.mq( 'only screen and (max-width: ' + avadaHeaderVars.side_header_break_point + 'px)' ) ) {
						window.$headerParentHeight = jQuery( '.fusion-header' ).outerHeight() + jQuery( '.fusion-secondary-main-menu' ).outerHeight();
						window.$stickyTrigger_position = Math.round( jQuery( '.fusion-header' ).offset().top )  - window.$wpadminbarHeight - window.$woo_store_notice - window.$top_frame + jQuery( '.fusion-header' ).outerHeight();

						jQuery( $headerParent ).height( window.$headerParentHeight );
						jQuery( '.fusion-header-sticky-height' ).css( 'height', '' );
					}

					// Mobile Mode
					if ( Modernizr.mq( 'only screen and (max-width: ' + avadaHeaderVars.side_header_break_point + 'px)' ) ) {

						// Trigger position basis is fusion-secondary-header, if there is a secondary header
						if ( jQuery( '.fusion-secondary-header' ).length ) {
							window.$stickyTrigger_position = Math.round( jQuery( '.fusion-secondary-header' ).offset().top )  - window.$wpadminbarHeight - window.$woo_store_notice - window.$top_frame + jQuery( '.fusion-secondary-header' ).outerHeight();

						// If there is no secondary header, trigger position is 0
						} else {
							window.$stickyTrigger_position = Math.round( jQuery( '.fusion-header' ).offset().top )  - window.$wpadminbarHeight - window.$woo_store_notice - window.$top_frame;
						}

						jQuery( $headerParent ).height( '' );
						jQuery( '.fusion-header-sticky-height' ).css( 'height', jQuery( '.fusion-sticky-header-wrapper' ).outerHeight() );
					}
				}

				if ( 'classic' === avadaHeaderVars.mobile_menu_design ) {
					window.$headerParentHeight = jQuery( '.fusion-header' ).outerHeight() + jQuery( '.fusion-secondary-main-menu' ).outerHeight();
					window.$stickyTrigger_position = Math.round( jQuery( '.fusion-header' ).offset().top ) - window.$wpadminbarHeight - window.$woo_store_notice - window.$top_frame + jQuery( '.fusion-header' ).outerHeight();

					jQuery( $headerParent ).height( window.$headerParentHeight );
				}
			}

			// Refresh header v3
			if ( 3 === window.sticky_header_type ) {

				// Desktop mode
				if ( ! Modernizr.mq( 'only screen and (max-width:' + avadaHeaderVars.side_header_break_point + 'px)' ) ) {
					jQuery( '#side-header-sticky' ).css( {
						height: '',
						top: ''
					} );

					if ( jQuery( '#side-header' ).hasClass( 'fusion-is-sticky' ) ) {
						jQuery( '#side-header' ).css( {
							top: '',
							position: ''
						} );

						jQuery( '#side-header' ).removeClass( 'fusion-is-sticky' );
					}
				}
			}

			if ( jQuery( document ).height() - ( window.$initial_desktop_header_height + topHeaderHeight + window.$wpadminbarHeight - window.$scrolled_header_height ) < jQuery( window ).height() && avadaHeaderVars.sticky_header_shrinkage ) {
				window.$sticky_can_be_shrinked = false;
				jQuery( '.fusion-header-wrapper' ).removeClass( 'fusion-is-sticky' );
				jQuery( '.fusion-header' ).css( 'height', '' );

				jQuery( '.fusion-logo' ).css( {
					'margin-top': '',
					'margin-bottom': ''
				} );

				jQuery( '.fusion-main-menu > ul > li > a' ).css( 'height', '' );

				jQuery( '.fusion-logo img' ).css( 'height', '' );
			} else {
				window.$sticky_can_be_shrinked = true;

				// Resizing sticky header
				if ( 1 <= jQuery( '.fusion-is-sticky' ).length ) {
					if ( 1 === window.sticky_header_type && ! Modernizr.mq( 'only screen and (max-width: ' + avadaHeaderVars.side_header_break_point + 'px)' ) ) {

						// Animate Header Height
						if ( ! Modernizr.mq( 'only screen and (max-width: ' + avadaHeaderVars.side_header_break_point + 'px)' ) ) {
							if ( parseInt( window.$headerHeight, 10 ) === parseInt( window.$initial_desktop_header_height, 10 ) ) {
								jQuery( window.$stickyTrigger ).stop( true, true ).animate( {
									height: window.$scrolled_header_height
								}, { queue: false, duration: $animationDuration, easing: 'easeOutCubic', complete: function() {
									jQuery( this ).css( 'overflow', 'visible' );
								} } );
								jQuery( '.fusion-header-sticky-height' ).stop( true, true ).animate( {
									height: window.$scrolled_header_height
								}, { queue: false, duration: $animationDuration, easing: 'easeOutCubic', complete: function() {
									jQuery( this ).css( 'overflow', 'visible' );
								} } );
							}
						} else {
							jQuery( '.fusion-header-sticky-height' ).css( 'height', window.$scrolled_header_height );
						}

						// Animate Logo
						if ( avadaHeaderVars.sticky_header_shrinkage && parseInt( window.$headerHeight, 10 ) === parseInt( window.$initial_desktop_header_height, 10 ) ) {
							if ( $logo ) {
								$scrolledLogoHeight = $logo.height();

								if (  $scrolledLogoHeight < window.$scrolled_header_height - 10 ) {
									$scrolledLogoContainerMargin = ( window.$scrolled_header_height - $scrolledLogoHeight ) / 2;
								} else {
									$scrolledLogoHeight = window.$scrolled_header_height - 10;
									$scrolledLogoContainerMargin = 5;
								}

								$logo.stop( true, true ).animate( {
									height: $scrolledLogoHeight
								}, { queue: false, duration: $animationDuration, easing: 'easeOutCubic', complete: function() {
									jQuery( this ).css( 'display', '' );
								}, step: function() {
									jQuery( this ).css( 'display', '' );
								} } );
							}

							jQuery( '.fusion-logo' ).stop( true, true ).animate( {
								'margin-top': $scrolledLogoContainerMargin,
								'margin-bottom': $scrolledLogoContainerMargin
							}, { queue: false, duration: $animationDuration, easing: 'easeOutCubic' } );

							// Animate Menu Height
							if ( ! jQuery( '.fusion-header-v6' ).length ) {
								jQuery( '.fusion-main-menu > ul > li' ).not( '.fusion-middle-logo-menu-logo' ).find( '> a' ).stop( true, true ).animate( {
									height: window.$scrolled_header_height
								}, { queue: false, duration: $animationDuration, easing: 'easeOutCubic' } );
							}
						}
					}
				}
			}

			resizeWidth  = jQuery( window ).width();
			resizeHeight = jQuery( window ).height();
		}
	} ); // End resize event

	jQuery( window ).on( 'scroll.stickyheader', function() {

		var $scrolledLogoHeight,
			$scrolledLogoContainerMargin;

		if ( window.$sticky_can_be_shrinked ) {
			if ( ! avadaHeaderVars.header_sticky_tablet && ( window.$media_query_test_1 ) ) {
				return;
			} else if ( avadaHeaderVars.header_sticky_tablet && ( window.$media_query_test_1 ) ) {
				$animationDuration = 0;
			}

			if ( ! avadaHeaderVars.header_sticky_mobile && window.$media_query_test_2 && ! window.$media_query_test_1 ) {
				return;
			} else if ( avadaHeaderVars.header_sticky_mobile && window.$media_query_test_2 ) {
				$animationDuration = 0;
			}

			if ( 3 === window.sticky_header_type && ! avadaHeaderVars.header_sticky_mobile ) {
				return;
			}

			if ( 3 === window.sticky_header_type && ! avadaHeaderVars.header_sticky_mobile && ! window.$media_query_test_3 ) {
				return;
			}

			// Change the sticky trigger position to the bottom of the mobile menu
			if ( 0 === jQuery( '.fusion-is-sticky' ).length && jQuery( '.fusion-header, .fusion-secondary-main-menu, #side-header' ).find( '.fusion-mobile-nav-holder > ul' ).is( ':visible' ) ) {
				if ( jQuery( '.fusion-header-has-flyout-menu-content' ).length ) {
					window.$stickyTrigger_position = Math.round( jQuery( '.fusion-header, .fusion-sticky-header-wrapper, #side-header' ).find( '.fusion-header-has-flyout-menu-content' ).offset().top ) - window.$wpadminbarHeight - window.$woo_store_notice - window.$top_frame;
				} else {
					window.$stickyTrigger_position = Math.round( jQuery( '.fusion-header, .fusion-sticky-header-wrapper, #side-header' ).find( '.fusion-mobile-nav-holder:visible' ).offset().top ) - window.$wpadminbarHeight - window.$woo_store_notice - window.$top_frame + jQuery( '.fusion-header, .fusion-sticky-header-wrapper, #side-header' ).find( '.fusion-mobile-nav-holder:visible' ).height();
				}
			}

			// If sticky header is not active, reassign the triggers
			if ( 3 !== window.sticky_header_type && 0 === jQuery( '.fusion-is-sticky' ).length && ! jQuery( '.fusion-header, .fusion-secondary-main-menu' ).find( '.fusion-mobile-nav-holder > ul' ).is( ':visible' ) && jQuery( '.fusion-header' ).length ) {
				window.$stickyTrigger          = jQuery( '.fusion-header' );
				window.$stickyTrigger_position = Math.round( window.$stickyTrigger.offset().top )  - window.$wpadminbarHeight - window.$woo_store_notice - window.$top_frame;

				if ( 2 === window.sticky_header_type ) {
					if ( 'menu_and_logo' === avadaHeaderVars.header_sticky_type2_layout || ( window.$media_query_test_4 && 'modern' === avadaHeaderVars.mobile_menu_design ) ) {
						window.$stickyTrigger = jQuery( '.fusion-sticky-header-wrapper' );
					} else {
						window.$stickyTrigger = jQuery( '.fusion-secondary-main-menu' );
					}
					window.$stickyTrigger_position = Math.round( window.$stickyTrigger.offset().top ) - window.$wpadminbarHeight - window.$woo_store_notice - window.$top_frame;
				}

				// Set sticky header height for header v4 and v5
				if ( 'modern' === avadaHeaderVars.mobile_menu_design && 2 === window.sticky_header_type && ( window.$media_query_test_4 || 'menu_and_logo' === avadaHeaderVars.header_sticky_type2_layout ) ) {

					// Refresh header height on scroll
					window.$headerHeight = jQuery( window.$stickyTrigger ).outerHeight();
					window.$scrolled_header_height = window.$headerHeight;
					jQuery( '.fusion-header-sticky-height' ).css( 'height', window.$scrolled_header_height );
				}
			}

			// Special side header handling for modern mobile menu.
			if ( 3 === window.sticky_header_type && 0 === jQuery( '.fusion-is-sticky' ).length && ! jQuery( '#side-header' ).find( '.fusion-mobile-nav-holder > ul' ).is( ':visible' ) ) {
				window.$stickyTrigger = jQuery( '#side-header' );
				window.$stickyTrigger_position = Math.round( window.$stickyTrigger.offset().top ) - window.$wpadminbarHeight - window.$woo_store_notice - window.$top_frame;
			}

			if ( jQuery( window ).scrollTop() > window.$stickyTrigger_position ) { // Sticky header mode

				if ( false === $stickyHeaderScrolled ) {
					window.$woo_store_notice = ( jQuery( '.woocommerce-store-notice' ).length && jQuery( '.woocommerce-store-notice' ).is( ':visible' ) ) ? jQuery( '.woocommerce-store-notice' ).outerHeight() : 0;

					jQuery( '.fusion-header-wrapper' ).addClass( 'fusion-is-sticky' );

					// Resizes overlay search in main and sticky menu.
					if ( 'function' === typeof resizeOverlaySearch ) {
						resizeOverlaySearch();
					}

					jQuery( window.$stickyTrigger ).css( 'top', window.$wpadminbarHeight + window.$woo_store_notice + window.$top_frame );
					$logo = jQuery( '.fusion-logo img:visible' );

					// Hide all mobile menus
					if ( 'modern' === avadaHeaderVars.mobile_menu_design ) {
						jQuery( '.fusion-header, .fusion-secondary-main-menu, #side-header' ).find( '.fusion-mobile-nav-holder' ).hide();
						jQuery( '.fusion-secondary-main-menu .fusion-main-menu-search .fusion-custom-menu-item-contents' ).hide();
						jQuery( '.fusion-mobile-menu-search' ).hide();
					} else if ( 'classic' === avadaHeaderVars.mobile_menu_design ) {
						jQuery( '.fusion-header, .fusion-secondary-main-menu, #side-header' ).find( '.fusion-mobile-nav-holder > ul' ).hide();
						jQuery( '.fusion-mobile-menu-search' ).hide();
					}

					if ( 'modern' === avadaHeaderVars.mobile_menu_design ) {

						// Hide normal mobile menu if sticky menu is set in sticky header
						if ( 1 <= jQuery( '.fusion-is-sticky' ).length && 1 <= jQuery( '.fusion-mobile-sticky-nav-holder' ).length && jQuery( '.fusion-mobile-nav-holder' ).is( ':visible' ) ) {
							jQuery( '.fusion-mobile-nav-holder' ).not( '.fusion-mobile-sticky-nav-holder' ).hide();
						}
					}

					if ( 'boxed' === avadaHeaderVars.layout_mode.toLowerCase() ) {
						jQuery( window.$stickyTrigger ).css( 'max-width', jQuery( '#wrapper' ).outerWidth() );

					}

					if ( 1 === window.sticky_header_type ) {

						// Animate Header Height
						if ( ! Modernizr.mq( 'only screen and (max-width: ' + avadaHeaderVars.side_header_break_point + 'px)' ) ) {
							if ( parseInt( window.$headerHeight, 10 ) === parseInt( window.$initial_desktop_header_height, 10 ) ) {
								jQuery( window.$stickyTrigger ).stop( true, true ).animate( {
									height: window.$scrolled_header_height
								}, { queue: false, duration: $animationDuration, easing: 'easeOutCubic', complete: function() {
									jQuery( this ).css( 'overflow', 'visible' );
								} } );

								jQuery( '.fusion-header-sticky-height' ).stop( true, true ).animate( {
									height: window.$scrolled_header_height
								}, { queue: false, duration: $animationDuration, easing: 'easeOutCubic', complete: function() {
									jQuery( this ).css( 'overflow', 'visible' );
								} } );
							}
						} else {
							jQuery( '.fusion-header-sticky-height' ).css( 'height', window.$scrolled_header_height );
						}

						// Add sticky shadow
						if ( '1' === avadaHeaderVars.header_sticky_shadow || 1 === avadaHeaderVars.header_sticky_shadow || true === avadaHeaderVars.header_sticky_shadow || 'true' === avadaHeaderVars.header_sticky_shadow ) {
							setTimeout( function() {
								jQuery( '.fusion-header' ).addClass( 'fusion-sticky-shadow' );
							}, 150 );
						}

						if ( avadaHeaderVars.sticky_header_shrinkage && parseInt( window.$headerHeight, 10 ) === parseInt( window.$initial_desktop_header_height, 10 ) ) {

							// Animate header padding
							jQuery( window.$stickyTrigger ).find( '.fusion-row' ).stop( true, true ).animate( {
								'padding-top': 0,
								'padding-bottom': 0
							}, { queue: false, duration: $animationDuration, easing: 'easeOutCubic' } );

							// Animate Logo
							if ( $logo ) {
								$scrolledLogoHeight = $logo.height();

								$logo.attr( 'data-logo-height', $logo.height() );
								$logo.attr( 'data-logo-width', $logo.width() );

								if (  $scrolledLogoHeight < window.$scrolled_header_height - 10 ) {
									$scrolledLogoContainerMargin = ( window.$scrolled_header_height - $scrolledLogoHeight ) / 2;
								} else {
									$scrolledLogoHeight = window.$scrolled_header_height - 10;
									$scrolledLogoContainerMargin = 5;
								}

								$logo.stop( true, true ).animate( {
									height: $scrolledLogoHeight
								}, { queue: false, duration: $animationDuration, easing: 'easeOutCubic', complete: function() {
									jQuery( this ).css( 'display', '' );
								}, step: function() {
									jQuery( this ).css( 'display', '' );
								} } );
							}

							jQuery( '.fusion-logo' ).stop( true, true ).animate( {
								'margin-top': $scrolledLogoContainerMargin,
								'margin-bottom': $scrolledLogoContainerMargin
							}, { queue: false, duration: $animationDuration, easing: 'easeOutCubic' } );

							// Animate Menu Height
							if ( ! jQuery( '.fusion-header-v6' ).length ) {
								jQuery( '.fusion-main-menu > ul > li' ).not( '.fusion-middle-logo-menu-logo' ).find( '> a' ).stop( true, true ).animate( {
									height: window.$scrolled_header_height
								}, { queue: false, duration: $animationDuration, easing: 'easeOutCubic' } );
							}
						}

					}

					if ( 2 === window.sticky_header_type ) {
						if ( 'menu_and_logo' === avadaHeaderVars.header_sticky_type2_layout ) {
							jQuery( window.$stickyTrigger ).css( 'height', '' );

							// Refresh header height on scroll
							window.$headerHeight = jQuery( window.$stickyTrigger ).outerHeight();
							window.$scrolled_header_height = window.$headerHeight;
							jQuery( window.$stickyTrigger ).css( 'height', window.$scrolled_header_height );
							jQuery( '.fusion-header-sticky-height' ).css( 'height', window.$scrolled_header_height );
						}

					}

					if ( 3 === window.sticky_header_type && Modernizr.mq( 'only screen and (max-width:' + avadaHeaderVars.side_header_break_point + 'px)' ) ) {
						jQuery( '#side-header-sticky' ).css( {
							height: jQuery( '#side-header' ).outerHeight()
						} );

						jQuery( '#side-header' ).css( {
							position: 'fixed',
							top: window.$wpadminbarHeight + window.$woo_store_notice + window.$top_frame
						} ).addClass( 'fusion-is-sticky' );
					}

					$stickyHeaderScrolled = true;
				}
			} else if ( jQuery( window ).scrollTop() <= window.$stickyTrigger_position ) {
				jQuery( '.fusion-header-wrapper' ).removeClass( 'fusion-is-sticky' );

				// Resizes overlay search in main and sticky menu.
				if ( 'function' === typeof resizeOverlaySearch ) {
					resizeOverlaySearch();
				}

				jQuery( '.fusion-header' ).removeClass( 'fusion-sticky-shadow' );
				$logo = jQuery( '.fusion-logo img:visible' );

				if ( 'modern' === avadaHeaderVars.mobile_menu_design ) {

					// Hide sticky menu if sticky menu is set in normal header
					if ( 0 === jQuery( '.fusion-is-sticky' ).length && 1 <= jQuery( '.fusion-mobile-sticky-nav-holder' ).length && jQuery( '.fusion-mobile-nav-holder' ).is( ':visible' ) ) {
						jQuery( '.fusion-mobile-sticky-nav-holder' ).hide();
					}
				}

				if ( 1 === window.sticky_header_type ) {

					// Animate Header Height to Original Size
					if ( ! Modernizr.mq( 'only screen and (max-width: ' + avadaHeaderVars.side_header_break_point + 'px)' ) ) {

						// Done to make sure that resize event while sticky is active doesn't lead to no animation on scroll up
						if ( 1 === window.sticky_header_type && 65 === parseInt( window.$headerHeight, 10 ) ) {
							window.$headerHeight = window.$initial_desktop_header_height;
						}

						if ( parseInt( window.$headerHeight, 10 ) === parseInt( window.$initial_desktop_header_height, 10 ) ) {
							jQuery( window.$stickyTrigger ).stop( true, true ).animate( {
								height: window.$headerHeight
							}, { queue: false, duration: $animationDuration, easing: 'easeOutCubic', complete: function() {
								jQuery( this ).css( 'overflow', 'visible' );
							}, step: function() {
								jQuery( this ).css( 'overflow', 'visible' );
							} } );

							jQuery( '.fusion-header-sticky-height' ).stop( true, true ).animate( {
								height: window.$headerHeight
							}, { queue: false, duration: $animationDuration, easing: 'easeOutCubic', complete: function() {
								jQuery( this ).css( 'overflow', 'visible' );
								jQuery( this ).css( 'display', '' );
							}, step: function() {
								jQuery( this ).css( 'overflow', 'visible' );
							} } );
						} else if ( jQuery( '.fusion-header-v7' ).length ) {
							jQuery( '.fusion-header-sticky-height' ).css( 'height', jQuery( '.fusion-middle-logo-menu' ).height() );
							jQuery( '.fusion-header' ).css( 'height', jQuery( '.fusion-middle-logo-menu' ).height() );
						}
					} else {
						jQuery( '.fusion-header-sticky-height' ).css( 'height', window.$headerHeight );
					}

					if ( avadaHeaderVars.sticky_header_shrinkage && parseInt( window.$headerHeight, 10 ) === parseInt( window.$initial_desktop_header_height, 10 ) ) {

						// Animate header padding to Original Size
						jQuery( window.$stickyTrigger ).find( '.fusion-row' ).stop( true, true ).animate( {
							'padding-top': avadaHeaderVars.header_padding_top,
							'padding-bottom': avadaHeaderVars.header_padding_bottom
						}, { queue: false, duration: $animationDuration, easing: 'easeOutCubic' } );

						// Animate Logo to Original Size
						if ( $logo ) {
							$logo.stop( true, true ).animate( {
								height: $logo.data( 'logo-height' )
							}, { queue: false, duration: $animationDuration, easing: 'easeOutCubic', complete: function() {
								jQuery( this ).css( 'display', '' );
								jQuery( '.fusion-sticky-logo' ).css( 'height', '' );
							} } );
						}

						jQuery( '.fusion-logo' ).stop( true, true ).animate( {
							'margin-top': window.$logoMarginTop,
							'margin-bottom': window.$logoMarginBottom
						}, { queue: false, duration: $animationDuration, easing: 'easeOutCubic' } );

						// Animate Menu Height to Original Size
						if ( ! jQuery( '.fusion-header-v6' ).length ) {
							jQuery( '.fusion-main-menu > ul > li' ).not( '.fusion-middle-logo-menu-logo' ).find( '> a' ).stop( true, true ).animate( {
								height: $menuHeight
							}, { queue: false, duration: $animationDuration, easing: 'easeOutCubic' } );
						}
					}
				}

				if ( 2 === window.sticky_header_type ) {

					if ( 'menu_and_logo' === avadaHeaderVars.header_sticky_type2_layout ) {
						jQuery( window.$stickyTrigger ).css( 'height', '' );

						// Refresh header height on scroll
						window.$headerHeight = jQuery( window.$stickyTrigger ).outerHeight();
						window.$scrolled_header_height = window.$headerHeight;
						jQuery( window.$stickyTrigger ).css( 'height', window.$scrolled_header_height );
						jQuery( '.fusion-header-sticky-height' ).css( 'height', window.$scrolled_header_height );
					}

					// Reset flyout active css.
					jQuery( window ).trigger( 'fusion-reset-flyout-active-css' );

				}

				if ( 3 === window.sticky_header_type && Modernizr.mq( 'only screen and (max-width:' + avadaHeaderVars.side_header_break_point + 'px)' ) ) {
					jQuery( '#side-header-sticky' ).css( {
						height: ''
					} );

					jQuery( '#side-header' ).css( {
						position: ''
					} ).removeClass( 'fusion-is-sticky' );
				}

				$stickyHeaderScrolled = false;
			}

		}
	} );
	jQuery( window ).trigger( 'scroll' ); // Trigger scroll for page load
}

// Get current height of sticky header.
function getStickyHeaderHeight( getShrinkedValue ) { // jshint ignore:line
	var stickyHeaderType   = 1,
		stickyHeaderHeight = 0,
		mediaQueryIpad     = Modernizr.mq( 'only screen and (min-device-width: 768px) and (max-device-width: 1366px) and (orientation: portrait)' ) ||  Modernizr.mq( 'only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape)' );

	getShrinkedValue = getShrinkedValue || false;

	// Set header type to 2 for headers v4, v5.
	if ( jQuery( '.fusion-header-v4' ).length || jQuery( '.fusion-header-v5' ).length ) {
		stickyHeaderType = 2;
	}

	if ( jQuery( '#side-header' ).length ) {
		stickyHeaderType = 'side';
	}

	// Sticky header is enabled.
	if ( avadaHeaderVars.header_sticky && ( jQuery( '.fusion-header-wrapper' ).length || jQuery( '#side-header' ).length ) ) {

		// Desktop mode - headers v1, v2, v3.
		if ( 1 === stickyHeaderType ) {
			stickyHeaderHeight = jQuery( '.fusion-header' ).outerHeight();

			// For headers v1 - v3 the sticky header min height is always 65px if sticky animation is used.
			if ( getShrinkedValue && avadaHeaderVars.sticky_header_shrinkage ) {
				stickyHeaderHeight = 64;
			}

		// Desktop mode - headers v4, v5.
		} else if ( 2 === stickyHeaderType ) {
			stickyHeaderHeight = jQuery( '.fusion-secondary-main-menu' ).outerHeight();

			if ( 'menu_and_logo' === avadaHeaderVars.header_sticky_type2_layout ) {
				stickyHeaderHeight += jQuery( '.fusion-header' ).outerHeight();
			}
		}

		// Mobile mode.
		if ( Modernizr.mq( 'only screen and (max-width: ' + avadaHeaderVars.side_header_break_point + 'px)' ) ) {

			// Sticky header is enabled on mobile.
			if ( avadaHeaderVars.header_sticky_mobile ) {

				stickyHeaderHeight = jQuery( '.fusion-header' ).outerHeight();

				if ( 2 === stickyHeaderType && 'classic' === avadaHeaderVars.mobile_menu_design ) {
					stickyHeaderHeight = jQuery( '.fusion-secondary-main-menu' ).find( '.fusion-mobile-selector' ).height() + 14;

					if ( 'menu_and_logo' === avadaHeaderVars.header_sticky_type2_layout ) {
						stickyHeaderHeight += jQuery( '.fusion-header' ).outerHeight();
					}
				} else if ( 'side' === stickyHeaderType ) {

					// Side header need different container check.
					stickyHeaderHeight = jQuery( '#side-header' ).outerHeight();
				}

			// Sticky header is disabled on mobile.
			} else {
				stickyHeaderHeight = 0;
			}
		}

		// Tablet mode.
		if ( ! avadaHeaderVars.header_sticky_tablet && mediaQueryIpad ) {
			stickyHeaderHeight = 0;
		}
	}

	return stickyHeaderHeight;
}

jQuery( window ).on( 'load', function() {

	var $menuHeight,
		notInitial = true,
		sliderScroll,
		sliderSticky,
		marginTop,
		stickySliderTop,
		adminBarHeight;

	jQuery( window ).on( 'scroll', function() {
		if ( jQuery( '#sliders-container .tfs-slider' ).data( 'parallax' ) && 'wide' !== avadaHeaderVars.layout_mode.toLowerCase() && ! cssua.ua.tablet_pc && ! cssua.ua.mobile && Modernizr.mq( 'only screen and (min-width: ' + avadaHeaderVars.side_header_break_point + 'px)' ) && 'full' === avadaHeaderVars.scroll_offset ) {
			sliderSticky    = jQuery( '#sliders-container .tfs-slider' );
			sliderScroll    = jQuery( window ).scrollTop();
			stickySliderTop = 0;
			marginTop       = jQuery( 'body' ).css( 'marginTop' );
			marginTop       = parseInt( marginTop, 10 );
			adminBarHeight  = fusion.getAdminbarHeight();

			if ( avadaHeaderVars.header_sticky && ( 1 <= jQuery( '.fusion-header-wrapper' ).length || 1 <= jQuery( '#side-header' ).length ) ) {
				$menuHeight = parseInt( jQuery( '.fusion-header' ).height(), 10 );
				stickySliderTop = 0;
			} else {
				$menuHeight     = marginTop;
				stickySliderTop = parseInt( avadaHeaderVars.nav_height, 10 );
				if ( 1 > jQuery( '#side-header' ).length ) {
					$menuHeight = 0;
				}
			}
			if ( sliderScroll >= adminBarHeight + marginTop + stickySliderTop ) {
				sliderSticky.css( 'top', 0 );
				sliderSticky.addClass( 'fusion-fixed-slider' );
			} else {
				sliderSticky.css( 'top', 0 );
				sliderSticky.removeClass( 'fusion-fixed-slider' );
			}
		} else if ( jQuery( '#sliders-container .tfs-slider.fusion-fixed-slider' ).length ) {
			jQuery( '#sliders-container .tfs-slider.fusion-fixed-slider' ).removeClass( 'fusion-fixed-slider' );
		}
	} );

	// Sticky Header
	if ( avadaHeaderVars.header_sticky && ( 1 <= jQuery( '.fusion-header-wrapper' ).length || 1 <= jQuery( '#side-header' ).length )  ) {
		fusionInitStickyHeader();
	}

	// Initial resize to set heights.
	setTimeout( function() {
		notInitial = false;
		jQuery( window ).trigger( 'resize' );
		notInitial = true;
	}, 10 );

	jQuery( window ).on( 'resize', function() {

		// Check for woo demo bar which can take on 2 lines and thus sticky position must be calculated
		if ( jQuery( '.woocommerce-store-notice' ).length && jQuery( '.woocommerce-store-notice' ).is( ':visible' ) && ! jQuery( '.fusion-top-frame' ).is( ':visible' ) ) {
			jQuery( '#wrapper' ).css( 'margin-top', jQuery( '.woocommerce-store-notice' ).outerHeight() );
			if ( jQuery( '.sticky-header' ).length ) {
				jQuery( '.sticky-header' ).css( 'margin-top', jQuery( '.woocommerce-store-notice' ).outerHeight() );
			}
		}

		if ( jQuery( '.sticky-header' ).length ) {
			jQuery( 'body.admin-bar #header-sticky.sticky-header' ).css( 'top', fusion.getAdminbarHeight() + 'px' );
		}
	} );
} );

// Reintalize scripts after ajax.
jQuery( document ).ajaxComplete( function() {

	var $stickyTrigger,
		$menuBorderHeight,
		$menuHeight,
		$menuLineHeight;

	jQuery( window ).trigger( 'scroll' ); // Trigger scroll for page load

	if ( 1 <= jQuery( '.fusion-is-sticky' ).length && window.$stickyTrigger && 3 !== window.sticky_header_type && ! jQuery( '.fusion-header-v6' ).length && 'background' !== avadaHeaderVars.nav_highlight_style ) {
		$stickyTrigger    = 1 >= Math.abs( jQuery( window.$stickyTrigger ).height() - jQuery( '.fusion-is-sticky .fusion-header > .fusion-row' ).outerHeight() ) ? jQuery( '.fusion-is-sticky .fusion-header > .fusion-row' ) : jQuery( window.$stickyTrigger );
		$menuBorderHeight = parseInt( avadaHeaderVars.nav_highlight_border, 10 );
		$menuHeight       = $stickyTrigger.height();
		$menuLineHeight   = $stickyTrigger.height() - $menuBorderHeight;

		if ( 2 === window.sticky_header_type ) {
			$stickyTrigger  = jQuery( '.fusion-secondary-main-menu' );
			$menuHeight     = $stickyTrigger.find( '.fusion-main-menu > ul > li > a' ).outerHeight();
			$menuLineHeight = $menuHeight - $menuBorderHeight;
		}

		jQuery( '.fusion-main-menu > ul > li' ).not( '.fusion-middle-logo-menu-logo' ).find( '> a' ).css( 'height', $menuHeight + 'px' );
	}
} );

window.addEventListener( 'fusion-reinit-sticky-header', function() {

	// Don't re-init sticky if it is disabled in FEB Preferences.
	if ( 'undefined' !== typeof window.parent.FusionApp && 'off' === window.parent.FusionApp.preferencesData.sticky_header ) {
		return;
	}

	fusionDisableStickyHeader();
	if ( ( Number( avadaHeaderVars.header_sticky ) ) ) {

		// Add a small 20ms delay so the browser has time to unhook previous listeners.
		setTimeout( function() {
			fusionInitStickyHeader();
		}, 20 );
	}
} );

window.addEventListener( 'fusion-disable-sticky-header', function() {
	fusionDisableStickyHeader();
} );

window.addEventListener( 'fusion-init-sticky-header', function() {
	fusionInitStickyHeader();
} );

window.addEventListener( 'fusion-resize-stickyheader', function() {
	jQuery( window ).trigger( 'resize.stickyheader' );
} );
