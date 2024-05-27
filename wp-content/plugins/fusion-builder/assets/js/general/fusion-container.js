/* global fusion, Modernizr, fusionContainerVars, getStickyHeaderHeight, fusion, cssua */
/* eslint max-depth: 0 */
jQuery( window ).on( 'load fusion-element-render-fusion_builder_container resize', function( $, cid ) {
	var $targetEl           = 'undefined' !== typeof cid ? jQuery( 'div[data-cid="' + cid + '"]' ).find( '.fullwidth-faded' ) : jQuery( '.fullwidth-faded' ),
		$targetElHeight     = 'undefined' !== typeof cid ? jQuery( 'div[data-cid="' + cid + '"]' ).find( '.hundred-percent-height' ) : jQuery( '.hundred-percent-height' ),
		$stickyHeaderHeight = ( ! Number( fusionContainerVars.is_sticky_header_transparent ) && 'function' === typeof getStickyHeaderHeight ) ? getStickyHeaderHeight( true ) : 0,
		$adminbarHeight     = fusion.getAdminbarHeight(),
		$editorMode         = jQuery( 'body' ).hasClass( 'fusion-builder-live' ) && ! jQuery( 'body' ).hasClass( 'fusion-builder-preview-mode' ),
		$sectionTopOffset   = $stickyHeaderHeight + $adminbarHeight;

	$targetEl.fusionScroller( { type: 'fading_blur' } );

	$targetElHeight.css( 'min-height', '' ).css( 'height', '' );
	$targetElHeight.find( '.fusion-fullwidth-center-content' ).css( 'min-height', '' );

	if ( 0 == fusionContainerVars.container_hundred_percent_height_mobile ) { // jshint ignore:line

		// Mobile view.
		if ( Modernizr.mq( 'only screen and (max-width: ' + fusionContainerVars.content_break_point + 'px)' ) ) {
			$targetElHeight.css( 'height', 'auto' );

			if ( $editorMode ) {
				$targetElHeight.css( 'min-height', '0' );
				$targetElHeight.find( '.fusion-fullwidth-center-content' ).css( 'min-height', '0' );
			}
		} else {

			// Desktop view.
			$targetElHeight.css( 'height', 'calc(100vh - ' + $sectionTopOffset + 'px)' );

			if ( $editorMode ) {
				$targetElHeight.css( 'min-height', 'calc(100vh - ' + $sectionTopOffset + 'px)' );
				$targetElHeight.find( '.fusion-fullwidth-center-content' ).css( 'min-height', 'calc(100vh - ' + $sectionTopOffset + 'px)' );
			}
		}
	} else {
		$targetElHeight.css( 'height', 'calc(100vh - ' + $sectionTopOffset + 'px)' );

		if ( $editorMode ) {
			$targetElHeight.css( 'min-height', 'calc(100vh - ' + $sectionTopOffset + 'px)' );
			$targetElHeight.find( '.fusion-fullwidth-center-content' ).css( 'min-height', 'calc(100vh - ' + $sectionTopOffset + 'px)' );
		}
	}
} );

jQuery( document ).ready( function() {
	var $stickyElements;

	initScrollingSections();

	fusionInitStickyContainers();

	// Not live builder, Safari less than version 16, change overflow to allow sticky to work.
	if ( ! jQuery( 'body' ).hasClass( 'fusion-builder-live' ) && 'object' === typeof cssua && 'string' === typeof cssua.ua.safari && 16 > parseInt( cssua.ua.safari ) ) {
		$stickyElements = jQuery( '.awb-sticky, .mobile-sticky-tabs, .sticky-tabs' );

		if ( $stickyElements.length ) {
			jQuery( '#boxed-wrapper' ).addClass( 'safari-overflow' );
			$stickyElements.each( function() {
				// Parents, not closest on purpose.
				jQuery( this ).parents( '.fusion-fullwidth' ).addClass( 'has-sticky' );
			} );
		}
	}

	if ( Modernizr.mq( 'only screen and (max-width: ' + fusionContainerVars.content_break_point + 'px)' ) ) {
		jQuery( '.fullwidth-faded' ).each( function() {
			var bkgdImg   = jQuery( this ).css( 'background-image' ),
				bkgdColor = jQuery( this ).css( 'background-color' );

			jQuery( this ).parent().css( '--awb-background-image', bkgdImg );
			jQuery( this ).parent().css( '--awb-background-color', bkgdColor );
			jQuery( this ).remove();
		} );
	}
} );

jQuery( window ).on( 'load', function() {

	// Check if page is already loaded scrolled, without anchor scroll script. If so, move to beginning of correct scrolling section.
	if ( jQuery( '#content' ).find( '.fusion-scroll-section' ).length && '#' === jQuery( '.fusion-page-load-link' ).attr( 'href' ) ) {
		setTimeout( function() {
			if ( ! jQuery( '#content' ).find( '.fusion-scroll-section' ).hasClass( 'awb-swiper-full-sections' ) ) {
				scrollToCurrentScrollSection();
			}
		}, 400 );
	}
} );

jQuery( window ).on( 'fusion-reinit-sticky', function( $, cid ) {
	var $targetEl = 'undefined' !== typeof cid ? jQuery( 'div[data-cid="' + cid + '"] .fusion-fullwidth' ) : false;

	if ( $targetEl && $targetEl.length ) {
		$targetEl.trigger( 'sticky_kit:detach' );
		fusionInitSticky( $targetEl );
	}
} );

jQuery( window ).on( 'fusion-sticky-header-reinit fusion-resize-horizontal', function() {
	fusionInitStickyContainers();
} );

jQuery( 'body' ).on( 'avada-studio-preview-done', function() {
	initScrollingSections( true );
} );

function fusionInitStickyContainers() {
	if ( 'function' === typeof jQuery.fn.stick_in_parent ) {
		jQuery( '.fusion-sticky-container' ).each( function() {
			fusionInitSticky( jQuery( this ) );
		} );
	}
}

function fusionInitSticky( $element ) {
	var transitionOffset = 'undefined' === typeof $element.attr( 'data-transition-offset' ) ? 0 : parseFloat( $element.attr( 'data-transition-offset' ) ),
		stickyOffset     = 'undefined' === typeof $element.attr( 'data-sticky-offset' ) ? 0 : $element.attr( 'data-sticky-offset' ),
		scrollTransition = 'undefined' === typeof $element.attr( 'data-scroll-offset' ) ? false : parseFloat( $element.attr( 'data-scroll-offset' ) ),
		options          = {
			sticky_class: 'fusion-container-stuck',
			bottoming: true,
			offset_top: stickyOffset,
			transition_offset: transitionOffset,
			clone: false
		},
		dataAttribute    = 'data-sticky-medium-visibility';

	// Preference in live editor is set, do not allow sticky.
	if ( jQuery( 'body' ).hasClass( 'fusion-disable-sticky' ) ) {
		if ( $element.data( 'sticky_kit' ) ) {
			$element.trigger( 'sticky_kit:detach' );
		}
		return;
	}

	// If should be disabled, detach and return early.
	if ( 'object' === typeof fusion && 'function' === typeof fusion.isLarge ) {
		if ( fusion.isLarge() ) {
			dataAttribute = 'data-sticky-large-visibility';
		} else if ( fusion.isSmall() ) {
			dataAttribute = 'data-sticky-small-visibility';
		}

		if ( 'undefined' === typeof $element.attr( dataAttribute ) || ! $element.attr( dataAttribute ) ) {
			if ( $element.data( 'sticky_kit' ) ) {
				$element.trigger( 'sticky_kit:detach' );
			}
			return;
		}
	}
	if ( $element.data( 'sticky_kit' ) ) {
		return;
	}

	if ( scrollTransition ) {
		options.scroll_transition = scrollTransition;
	}

	// If header, do not use closest as parent.
	if ( $element.closest( '.fusion-tb-header' ).length || $element.closest( '.fusion-tb-page-title-bar' ).length ) {
		options.parent    = '#wrapper';
		options.bottoming = false;

		// If we are in a nested layout, use the parent column.
	} else if ( $element.closest( '.fusion-content-tb' ).length ) {
		options.parent = '.fusion-content-tb';
	} else if ( $element.closest( '.fusion-builder-live-editor' ).length ) {
		options.parent = '#fusion_builder_container';
	} else if ( $element.parent().parent( '.post-content' ).length ) {
		options.parent = '.post-content';
	} else if ( $element.hasClass( 'awb-sticky-content' ) ) {
		options.parent = '#wrapper';
	}

	// Allow override for parent and bottoming.
	if ( 'string' === typeof $element.attr( 'data-sticky-parent' ) ) {
		options.parent = $element.attr( 'data-sticky-parent' );
	}
	if ( 'string' === typeof $element.attr( 'data-sticky-bottoming' ) ) {
		options.bottoming = $element.attr( 'data-sticky-bottoming' );
	}
	// Only clone if we are regular front-end and have transition height.
	if ( ! jQuery( 'body' ).hasClass( 'fusion-builder-live' ) &&  'undefined' !== typeof $element.attr( 'data-sticky-height-transition' ) ) {
		options.clone = true;
	}

	$element.stick_in_parent( options );
}

// eslint-disable-next-line no-unused-vars
function fusionGetStickyOffset() {
	var maxStickyPosition = 0,
		$stickyContainers = jQuery( '.fusion-container-stuck:not( .side-header-wrapper )' );

	// No sticky, just use
	if ( ! $stickyContainers.length ) {
		return maxStickyPosition;
	}

	// Loop containers to find which is positioned highest.
	$stickyContainers.each( function() {
		var $element       = jQuery( this ),
			stickyPosition = $element.position().top + $element.outerHeight( true );

		if ( !fusionIsWholeElementInViewport( $element[ 0 ] ) ) {
			return;
		}

		if ( $element.closest( '#side-header' ).length || $element.closest( '.off-canvas-content' ).length ) {
			return;
		}

		if ( stickyPosition > maxStickyPosition ) {
			maxStickyPosition = stickyPosition;
		}
	} );

	return maxStickyPosition;
}

function fusionIsWholeElementInViewport( el ) {
	const 	rect = el.getBoundingClientRect(),
			windowHeight = ( window.innerHeight || document.documentElement.clientHeight );

	return !(
		100 > Math.floor( 100 - ( ( ( 0 <= rect.top ? 0 : rect.top ) / +-rect.height ) * 100 ) ) ||
		// eslint-disable-next-line no-mixed-operators
		100 > Math.floor( 100 - ( ( rect.bottom - windowHeight ) / rect.height ) * 100 )
	);
  }

function initSwiperScrollingSection( el ) {

	if ( ! el.length ) {
		return;
	}

	const effects = {
		slide: {
				prev: {
					translate: [ 0, '-100%', 0 ],
					opacity: 0
				},
				next: {
					translate: [ 0, '100%', 0 ],
					opacity: 0
				}
			},
		stack: {
			prev: {
				translate: [ 0, '60px', '-30px' ],
				scale: 0.7,
				opacity: 0
			},
			next: {
				translate: [ 0, '100%', 0 ]
			}
		},
		zoom: {
			prev: {
				scale: 1.3,
				opacity: 0
			},
			next: {
				scale: 0.7,
				opacity: 0
			}
		},
		'slide-zoom-out': {
			prev: {
				translate: [ 0, '-100%', 0 ],
				scale: 1.5,
				opacity: 0
			},
			next: {
				translate: [ 0, '100%', 0 ],
				scale: 1.5,
				opacity: 0
			}
		},
		'slide-zoom-in': {
			prev: {
				translate: [ 0, '-100%', 0 ],
				scale: 0.8,
				opacity: 0
			},
			next: {
				translate: [ 0, '100%', 0 ],
				scale: 0.8,
				opacity: 0
			}
		}
	};

	const options = {
		direction: 'vertical',
		speed: el.data( 'speed' ),
		effect: 'creative',
		observer: true,
		observeParents: true,
		mousewheel: {
			releaseOnEdges: true
		},
		allowTouchMove: false,
		touchReleaseOnEdges: true,
		creativeEffect: effects[ el.data( 'animation' ) ],
		on: {
			afterInit: function( slider ) {
				el.find( '.fusion-scroll-section-nav ul li:first-child a' ).addClass( 'active' );
				el.addClass( 'swiper-ready' );
				if ( window.location.hash.length ) {
					if ( el.find( window.location.hash ).length ) {
						const slide = el.find( window.location.hash + '.swiper-slide' ).length ? el.find( window.location.hash + '.swiper-slide' ) : el.find( window.location.hash ).closest( '.swiper-slide' );
						if ( slide.length ) {
							setTimeout( () => {
								slider.slideTo( slide.index(), 0 );
								el[ 0 ].scrollIntoView();
							}, 100 );
						}
					}
				}
			},
			activeIndexChange: function( slider ) {
				el.find( '.fusion-scroll-section-nav ul li a' ).removeClass( 'active' );
				el.find( '.fusion-scroll-section-nav ul li' ).eq( slider.activeIndex ).find( 'a' ).addClass( 'active' );

				setTimeout( () => {
					setActiveAnchor();
				}, 100 );

			},
			slideChange: function( slider ) {
				el[ 0 ].scrollIntoView( { behavior: 'smooth' } );
				setTimeout( function () {
					slider.params.mousewheel.releaseOnEdges = false;
				}, 500 );
			},
			reachEnd: function( slider ) {
				setTimeout( function () {
					slider.params.mousewheel.releaseOnEdges = true;
				}, 750 );
			},
			reachBeginning: function( slider ) {
				setTimeout( function () {
					slider.params.mousewheel.releaseOnEdges = true;
				}, 750 );
			}
		}
	};

	// Enable Touch move if touch device.
	if ( isTouchDevice() ) {
		options.allowTouchMove = true;
	}

	const fusionFullSectionSwiper = new window.Swiper( el[ 0 ], options );

	//  clickable navigation.
	el.find( '.fusion-scroll-section-nav ul li a' ).on( 'click', function( event ) {
		event.preventDefault();
		const idx = jQuery( this ).parent().index();
		fusionFullSectionSwiper.slideTo( idx );
	} );

	// disable on mobile.
	function disableOnMobile() {
		if ( 0 == fusionContainerVars.container_hundred_percent_height_mobile ) { // jshint ignore:line
			if ( Modernizr.mq( 'only screen and (max-width: ' + fusionContainerVars.content_break_point + 'px)' ) ) {
				el.removeClass( 'awb-swiper' ).addClass( 'fusion-full-scroll-disabled' );
				fusionFullSectionSwiper.destroy();
			}
		}
	}

	disableOnMobile();

	function isTouchDevice() {
		return ( ( 'ontouchstart' in window ) || ( 0 < navigator.maxTouchPoints ) || ( 0 < navigator.msMaxTouchPoints ) );
	}

	function setActiveAnchor( anchor ) {

		if ( ! anchor ) {
			const activeSlide = el.find( '.swiper-slide-active' );
			const containerID = activeSlide.find( '.fusion-container-anchor' ).length ? activeSlide.find( '.fusion-container-anchor' ).attr( 'id' ) :  activeSlide.attr( 'id' );
			anchor = jQuery( `a[href="#${containerID}"]` );
		}

		if ( anchor.length && anchor.hasClass( 'awb-menu__main-a' ) ) {
			const currentItem = anchor.parents( '.awb-menu__main-ul' ).find( 'li.menu-item.current-menu-item' );
			currentItem.removeClass( 'current-menu-item' );
			anchor.closest( '.menu-item' ).addClass( 'current-menu-item' );
		} else {
			anchor.addClass( 'awb-active' );
		}
	}

	// anchor links.
	jQuery( 'a[href^="#"]' ).on( 'click', function( event ) {

		const anchor = jQuery( this );
		const href = anchor.attr( 'href' );
		const container = '#' !== href ? el.find( href ) : '';

			if ( container.length ) {
				event.preventDefault();
				let idx = container.index();
				if ( container.hasClass( 'fusion-container-anchor' ) ) {
					idx = container.parent().index();
				}

				setActiveAnchor( anchor );
				fusionFullSectionSwiper.slideTo( idx );
			}
	} );

}

function initScrollingSections( studio ) {
	var mainContentScrollSections = jQuery( '#content' ).find( '.fusion-scroll-section' ),
		onlyOneScrollSectionOnPage,
		stickyHeaderHeight = ( ! Number( fusionContainerVars.is_sticky_header_transparent ) && 'function' === typeof getStickyHeaderHeight ) ? getStickyHeaderHeight( true ) : 0,
		adminbarHeight = fusion.getAdminbarHeight(),
		sectionTopOffset = stickyHeaderHeight + adminbarHeight,
		overallSectionHeight;

	if ( studio ) {
		mainContentScrollSections = jQuery( '.post-preview.post-content' ).find( '.fusion-scroll-section' );
	}

	if ( mainContentScrollSections.hasClass( 'awb-swiper-full-sections' ) ) {
			initSwiperScrollingSection( mainContentScrollSections );
		return;
	}
	window.lastYPosition  = 0;
	window.scrollDisabled = false;

	// Check if there are 100% height scroll sections.
	if ( mainContentScrollSections.length ) {
		if ( ! jQuery( '#content' ).find( '.non-hundred-percent-height-scrolling' ).length && 1 === mainContentScrollSections.length && ! jQuery.trim( jQuery( '#sliders-container' ).html() ) ) {
			mainContentScrollSections.addClass( 'active' );
			mainContentScrollSections.find( '.fusion-scroll-section-nav li:first a' ).addClass( 'active' );
			onlyOneScrollSectionOnPage = true;
		}

		// Set correct heights for the wrapping scroll sections and individual scroll elements, based on the number of elements, sticky header and admin bar.
		mainContentScrollSections.each( function() {
			if ( 1 < jQuery( this ).children( 'div' ).length ) {
				overallSectionHeight = ( sectionTopOffset ) ? 'calc(' + ( ( jQuery( this ).children( 'div' ).length * 100 ) + ( 100 / 2 ) ) + 'vh - ' + sectionTopOffset + 'px)' : ( ( jQuery( this ).children( 'div' ).length * 100 ) + ( 100 / 2 ) ) + 'vh';

				// Set correct height for the wrapping scroll section.
				jQuery( this ).css( 'height', overallSectionHeight );

				// Set the correct height offset per section and also for the nav.
				if ( sectionTopOffset ) {
					jQuery( this ).find( '.hundred-percent-height-scrolling' ).css( 'height', 'calc(100vh - ' + sectionTopOffset + 'px)' );

					jQuery( this ).find( '.fusion-scroll-section-nav' ).css( 'top', 'calc(50% + ' + ( sectionTopOffset / 2 ) + 'px)' );
				}
			}
		} );

		// Set the last scroll position to the initial loading value.
		window.lastYPosition = jQuery( window ).scrollTop();

		jQuery( window ).on( 'scroll', function() {
			var currentYPosition = jQuery( window ).scrollTop(),
				lastYPosition    = window.lastYPosition;

			// If scroll is disabled, return.
			if ( window.scrollDisabled ) {
				return;
			}

			// Position the elements of a scroll section correctly.
			jQuery( '.fusion-scroll-section' ).each( function() {
				if ( 1 < jQuery( this ).children( 'div' ).length && ! jQuery( this ).hasClass( 'fusion-scroll-section-mobile-disabled' ) ) {
					jQuery( this ).fusionPositionScrollSectionElements( currentYPosition, onlyOneScrollSectionOnPage, lastYPosition );
				}
			} );
		} );

		// Set the "active" class to the correct scroll nav link and the correct section element.
		jQuery( '.fusion-scroll-section-link' ).on( 'click', function( e ) {
			var scrollSection            = jQuery( this ).parents( '.fusion-scroll-section' ),
				sectionValues            = getScrollSectionPositionValues( scrollSection ),
				sections                 = scrollSection.find( '.fusion-scroll-section-element' ),
				numberOfElements         = sections.length,
				lastActive               = jQuery( this ).parents( '.fusion-scroll-section-nav' ).find( '.fusion-scroll-section-link.active' ),
				numberOfLastActive       = lastActive.length ? parseInt( lastActive.data( 'element' ), 10 ) : 0,
				numberOfNewActive        = parseInt( jQuery( this ).data( 'element' ), 10 ),
				numberOfScrolledElements = Math.abs( numberOfNewActive - numberOfLastActive );

			e.preventDefault();

			// Only perform transition, if not same section is clicked.
			if ( 0 < numberOfScrolledElements ) {

				// Set the new element to the main parent.
				scrollSection.data( 'clicked', numberOfNewActive );

				if ( 'fixed' !== sections.last().css( 'position' ) ) {
					// When entering a scroll section all elements need to be positioned fixed and other values set depending on layout.
					sections.css( {
						position: 'fixed',
						top: sectionValues.sectionTopOffset,
						left: sectionValues.sectionLeftOffset,
						padding: '0',
						width: sectionValues.sectionWidth
					} );
				}

				if ( 1 === numberOfNewActive ) {
					jQuery( window ).scrollTop( sectionValues.sectionTop + 1 );
				} else if ( numberOfElements === numberOfNewActive ) {
					jQuery( window ).scrollTop( sectionValues.sectionBottom - sectionValues.viewportHeight - 1 );
				} else if ( numberOfNewActive > numberOfLastActive ) {
					jQuery( window ).scrollTop( sectionValues.sectionTop + ( sectionValues.viewportHeight * numberOfNewActive ) - 1 );
				} else {
					jQuery( window ).scrollTop( sectionValues.sectionTop + ( sectionValues.viewportHeight * ( numberOfNewActive - 1 ) ) + 1 );
				}
			}
		} );
	}

	if ( jQuery( '.hundred-percent-height' ).length ) {
		setCorrectResizeValuesForScrollSections();

		jQuery( window ).on( 'resize', function() {
			setCorrectResizeValuesForScrollSections();
		} );
	}
}

function setCorrectResizeValuesForScrollSections() {

	var mainContentScrollSections = jQuery( '#content' ).find( '.fusion-scroll-section' ),
		stickyHeaderHeight = 0,
		sectionTopOffset   = 0,
		adminbarHeight     = fusion.getAdminbarHeight();

	// Check if there are 100% height scroll sections.
	if ( mainContentScrollSections.length ) {

		// Resize the fixed containers, to fit the correct area.
		jQuery( '.fusion-scroll-section.active' ).find( '.fusion-scroll-section-element' ).css( {
			left: jQuery( '#content' ).offset().left
		} );

		jQuery( '.fusion-scroll-section' ).find( '.fusion-scroll-section-element' ).css( {
			width: jQuery( '#content' ).width()
		} );

		if ( 0 == fusionContainerVars.container_hundred_percent_height_mobile ) { // jshint ignore:line

			// Mobile view.
			if ( Modernizr.mq( 'only screen and (max-width: ' + fusionContainerVars.content_break_point + 'px)' ) ) {
				jQuery( '.fusion-scroll-section' ).removeClass( 'active' ).addClass( 'fusion-scroll-section-mobile-disabled' );
				jQuery( '.fusion-scroll-section' ).attr( 'style', '' );
				jQuery( '.fusion-scroll-section' ).find( '.fusion-scroll-section-element' ).attr( 'style', '' );
				jQuery( '.fusion-scroll-section' ).find( '.hundred-percent-height-scrolling' ).css( 'height', 'auto' );
				jQuery( '.fusion-scroll-section' ).find( '.fusion-fullwidth-center-content' ).css( 'height', 'auto' );

			} else if ( jQuery( '.fusion-scroll-section' ).hasClass( 'fusion-scroll-section-mobile-disabled' ) ) { // Desktop view.

				jQuery( '.fusion-scroll-section' ).find( '.fusion-fullwidth-center-content' ).css( 'height', '' );

				if ( ! Number( fusionContainerVars.is_sticky_header_transparent ) && 'function' === typeof getStickyHeaderHeight ) {
					stickyHeaderHeight = getStickyHeaderHeight( true );
				}

				sectionTopOffset = stickyHeaderHeight + adminbarHeight;

				// Set correct heights for the wrapping scroll sections, based on the number of elements.
				mainContentScrollSections.each( function() {
					if ( 1 < jQuery( this ).children( 'div' ).length ) {
						jQuery( this ).css( 'height', ( ( jQuery( this ).children( 'div' ).length * 100 ) + ( 100 / 2 ) ) + 'vh' );

						jQuery( this ).find( '.hundred-percent-height-scrolling' ).css( 'height', 'calc(100vh - ' + sectionTopOffset + 'px)' );
					}
				} );

				scrollToCurrentScrollSection();
			}
		}
	}

	// Special handling of 100% height containers without scrolling sections.
	if ( jQuery( '.hundred-percent-height.non-hundred-percent-height-scrolling' ).length ) {
		if ( ! Number( fusionContainerVars.is_sticky_header_transparent ) && 'function' === typeof getStickyHeaderHeight ) {
			stickyHeaderHeight = getStickyHeaderHeight( true );
		}

		sectionTopOffset = stickyHeaderHeight + adminbarHeight;

		if ( 0 == fusionContainerVars.container_hundred_percent_height_mobile ) { // jshint ignore:line

			// Mobile view.
			if ( Modernizr.mq( 'only screen and (max-width: ' + fusionContainerVars.content_break_point + 'px)' ) ) {
				jQuery( '.hundred-percent-height.non-hundred-percent-height-scrolling' ).css( 'height', 'auto' );

				jQuery( '.hundred-percent-height.non-hundred-percent-height-scrolling' ).find( '.fusion-fullwidth-center-content' ).css( 'height', 'auto' );
			} else {

				// Desktop view.
				jQuery( '.hundred-percent-height.non-hundred-percent-height-scrolling' ).css( 'height', 'calc(100vh - ' + sectionTopOffset + 'px)' );

				jQuery( '.hundred-percent-height.non-hundred-percent-height-scrolling' ).find( '.fusion-fullwidth-center-content' ).css( 'height', '' );
			}
		}
	}
}

function scrollToCurrentScrollSection() {
	var viewportTop           = Math.ceil( jQuery( window ).scrollTop() ),
		viewportHeight        = jQuery( window ).height(),
		viewportBottom        = Math.floor( viewportTop + viewportHeight ),
		stickyHeaderHeight    = ( ! Number( fusionContainerVars.is_sticky_header_transparent ) && 'function' === typeof getStickyHeaderHeight ) ? getStickyHeaderHeight( true ) : 0,
		adminbarHeight        = fusion.getAdminbarHeight();

	viewportTop += stickyHeaderHeight + adminbarHeight;

	// Get the scroll section in view, but only if not while loading when a one page scroll link is present.
	if ( ! jQuery( '.fusion-page-load-link' ).hasClass( 'fusion-page.load-scroll-section-link' ) ) {
		jQuery( '.fusion-scroll-section' ).each( function() {
			var section       = jQuery( this ),
				sectionTop    = Math.ceil( section.offset().top ),
				sectionHeight = Math.ceil( section.outerHeight() ),
				sectionBottom = Math.floor( sectionTop + sectionHeight ),
				animationRoot = jQuery( 'html' ).hasClass( 'ua-edge' ) ? 'body' : 'html';

			// Scrolled position is inside a scroll section.
			if ( sectionTop <= viewportTop && sectionBottom >= viewportBottom ) {
				section.addClass( 'active' );

				// Scroll to beginning position of correct section.
				jQuery( animationRoot ).animate( {
					scrollTop: sectionTop - 50
				}, { duration: 50, easing: 'easeInExpo', complete: function() {
					jQuery( animationRoot ).animate( {
						scrollTop: sectionTop
					}, { duration: 50, easing: 'easeOutExpo', complete: function() {

						// Remove the mobile disabling class if in desktop mode.
						if ( ! Modernizr.mq( 'only screen and (max-width: ' + fusionContainerVars.content_break_point + 'px)' ) ) {
							jQuery( '.fusion-scroll-section' ).removeClass( 'fusion-scroll-section-mobile-disabled' );
						}
					}
					} );
				}
				} );
			} else if ( ! Modernizr.mq( 'only screen and (max-width: ' + fusionContainerVars.content_break_point + 'px)' ) ) {
				// Remove the mobile disabling class if in desktop mode.
				jQuery( '.fusion-scroll-section' ).removeClass( 'fusion-scroll-section-mobile-disabled' );
			}
		} );
	}
}

function getScrollSectionPositionValues( section ) {
	var sectionValues                   = {};

	sectionValues.sectionTop        = Math.ceil( section.offset().top );
	sectionValues.sectionHeight     = Math.ceil( section.outerHeight() );
	sectionValues.sectionBottom     = Math.floor( sectionValues.sectionTop + sectionValues.sectionHeight );
	sectionValues.viewportTop       = Math.ceil( jQuery( window ).scrollTop() );
	sectionValues.viewportHeight    = jQuery( window ).height();
	sectionValues.viewportBottom    = Math.floor( sectionValues.viewportTop + sectionValues.viewportHeight );
	sectionValues.sectionWidth      = jQuery( '#content' ).width();
	sectionValues.sectionTopOffset  = fusion.getAdminbarHeight(); // Top offset is 0 or wpadminbar height if no sticky header is used.
	sectionValues.sectionLeftOffset = jQuery( '#content' ).offset().left;

	// We have a non-transparent sticky header, so we need correct top offset.
	sectionValues.sectionTopOffset += ( ! Number( fusionContainerVars.is_sticky_header_transparent ) && 'function' === typeof getStickyHeaderHeight ) ? getStickyHeaderHeight( true ) : 0;

	// Add the sticky header offset to the viewpot top for calcs.
	sectionValues.viewportTop += sectionValues.sectionTopOffset;

	return sectionValues;
}

( function( jQuery ) {

	'use strict';

	var scrollDirection = 'down';

	jQuery.fn.fusionPositionScrollSectionElements = function( currentYPosition, onlyOneScrollSectionOnPage, lastYPosition ) {
		var section          = jQuery( this ),
			numberOfElements = section.find( '.fusion-scroll-section-element' ).length,
			currentSegment   = 0,
			sectionValues    = getScrollSectionPositionValues( section );

		onlyOneScrollSectionOnPage = onlyOneScrollSectionOnPage || false;

		// Make sure there is more than one scroll section, otherwise the one will always be active.
		if ( ! onlyOneScrollSectionOnPage ) {

			// Set the section to active if it is in viewport.
			if ( sectionValues.sectionTop <= sectionValues.viewportTop && sectionValues.sectionBottom >= sectionValues.viewportBottom ) {
				section.addClass( 'active' );
			} else {
				section.removeClass( 'active' );
			}
		}

		// Scrolling down.
		if ( lastYPosition < currentYPosition ) {

			// Next segment is activated through nav click.
			if ( section.data( 'clicked' ) ) {
				currentSegment = section.data( 'clicked' );
				section.removeData( 'clicked' );
				section.removeAttr( 'data-clicked' );
			} else {

				// Next segment will be one higher than the previously active.
				currentSegment = section.find( '.fusion-scroll-section-element.active' );
				if ( currentSegment.length ) {
					currentSegment = currentSegment.data( 'element' ) + 1;
					currentSegment = ( currentSegment > numberOfElements ) ? numberOfElements : currentSegment;
				} else {
					currentSegment = 1;
				}
			}

			// First element comes into viewport.
			if ( sectionValues.sectionTop <= sectionValues.viewportTop && sectionValues.sectionTop + sectionValues.viewportHeight > sectionValues.viewportTop ) {

				// Set correct element to be active.
				section.find( '.fusion-scroll-section-element' ).removeClass( 'active' );
				section.children( ':nth-child(1)' ).addClass( 'active' );

				// Set correct navigation link to be active.
				section.find( '.fusion-scroll-section-nav a' ).removeClass( 'active' );
				section.find( '.fusion-scroll-section-nav a[data-element="' + section.children( ':nth-child(1)' ).data( 'element' ) + '"] ' ).addClass( 'active' );

				// When entering a scroll section all elements need to be positioned fixed and other values set depending on layout.
				section.find( '.fusion-scroll-section-element' ).css( {
					position: 'fixed',
					top: sectionValues.sectionTopOffset,
					left: sectionValues.sectionLeftOffset,
					padding: '0',
					width: sectionValues.sectionWidth
				} );

				section.children( ':nth-child(1)' ).css( 'display', 'block' );

				window.scrollDisabled = true;

				// Scroll the page to the top of the current section.
				jQuery( window ).scrollTop( sectionValues.sectionTop + sectionValues.viewportHeight - 1 );

				// Disable further scrolling for the time the transition needs.
				disableScroll();
				setTimeout( function() {
					enableScroll();
				}, fusionContainerVars.hundred_percent_scroll_sensitivity );

			} else if ( sectionValues.sectionBottom <= sectionValues.viewportBottom && 'absolute' !== section.find( '.fusion-scroll-section-element' ).last().css( 'position' ) ) {

				// Last element is in viewport and it is scrolled further down, so exiting scroll section.
				section.find( '.fusion-scroll-section-element' ).removeClass( 'active' );
				section.find( '.fusion-scroll-section-element' ).last().addClass( 'active' );

				section.find( '.fusion-scroll-section-element' ).css( 'position', 'absolute' );

				section.find( '.fusion-scroll-section-element' ).last().css( {
					top: 'auto',
					left: '0',
					bottom: '0',
					padding: ''
				} );

				section.find( '.fusion-scroll-section-nav a' ).removeClass( 'active' );
				section.find( '.fusion-scroll-section-nav a' ).last().addClass( 'active' );

			} else if ( 1 < currentSegment  && 'fixed' === section.find( '.fusion-scroll-section-element' ).last().css( 'position' ) && ( ! section.children( ':nth-child(' + currentSegment + ')' ).hasClass( 'active' ) || 'up' === scrollDirection ) ) {

				// Transition between individual elements.

				// Set correct element to be active.
				section.find( '.fusion-scroll-section-element' ).removeClass( 'active' );
				section.children( ':nth-child(' + currentSegment + ')' ).addClass( 'active' );

				// Set correct navigation link to be active.
				section.find( '.fusion-scroll-section-nav a' ).removeClass( 'active' );
				section.find( '.fusion-scroll-section-nav a[data-element="' + section.children( ':nth-child(' + currentSegment + ')' ).data( 'element' ) + '"] ' ).addClass( 'active' );

				window.scrollDisabled = true;

				// Scroll the page to the top of the current section.
				if ( currentSegment < numberOfElements ) {
					jQuery( window ).scrollTop( sectionValues.sectionTop + ( sectionValues.viewportHeight * currentSegment ) - 1 );
				} else {
					jQuery( window ).scrollTop( sectionValues.sectionBottom - sectionValues.viewportHeight );
				}

				// Disable further scrolling for the time the transition needs.
				disableScroll();
				setTimeout( function() {
					enableScroll();
				}, fusionContainerVars.hundred_percent_scroll_sensitivity );
			}

			scrollDirection = 'down';
		} else if ( lastYPosition > currentYPosition ) {

			// Scrolling up.

			// Next segment is activated through nav click.
			if ( section.data( 'clicked' ) ) {
				currentSegment = section.data( 'clicked' );
				section.removeData( 'clicked' );
				section.removeAttr( 'data-clicked' );
			} else {

				// Next segment will be one lower than the previously active.
				currentSegment = section.find( '.fusion-scroll-section-element.active' );
				if ( currentSegment.length ) {
					currentSegment = currentSegment.data( 'element' ) - 1;
					currentSegment = ( 1 > currentSegment ) ? 1 : currentSegment;
				} else {
					currentSegment = 0;
				}
			}

			// Entering the last element of a scrolling section.
			if ( sectionValues.sectionBottom >= sectionValues.viewportBottom && 'absolute' === section.find( '.fusion-scroll-section-element' ).last().css( 'position' ) ) {

				// Set correct element to be active.
				section.find( '.fusion-scroll-section-element' ).removeClass( 'active' );
				section.find( '.fusion-scroll-section-element' ).last().addClass( 'active' );

				// Set correct navigation link to be active.
				section.find( '.fusion-scroll-section-nav a' ).removeClass( 'active' );
				section.find( '.fusion-scroll-section-nav a[data-element="' + section.find( '.fusion-scroll-section-element' ).last().data( 'element' ) + '"] ' ).addClass( 'active' );

				// When entering a scroll section all elements need to be positioned fixed and other values set depending on layout.
				section.find( '.fusion-scroll-section-element' ).css( {
					position: 'fixed',
					top: sectionValues.sectionTopOffset,
					left: sectionValues.sectionLeftOffset,
					padding: '0',
					width: sectionValues.sectionWidth
				} );

				section.find( '.fusion-scroll-section-element' ).last().css( 'display', 'block' );

				window.scrollDisabled = true;

				jQuery( window ).scrollTop( sectionValues.sectionTop + ( sectionValues.viewportHeight * ( numberOfElements - 1 ) ) );

				// Disable further scrolling for the time the transition needs.
				disableScroll();
				setTimeout( function() {
					enableScroll();
				}, fusionContainerVars.hundred_percent_scroll_sensitivity );

			} else if ( ( sectionValues.sectionTop >= sectionValues.viewportTop || ( 0 === jQuery( window ).scrollTop() && section.find( '.fusion-scroll-section-element' ).first().hasClass( 'active' ) ) ) && '' !== section.find( '.fusion-scroll-section-element' ).first().css( 'position' ) ) {

				// First element is in viewport and it is further scrolled up.

				section.find( '.fusion-scroll-section-element' ).removeClass( 'active' );
				section.find( '.fusion-scroll-section-element' ).first().addClass( 'active' );

				section.find( '.fusion-scroll-section-element' ).css( 'position', '' );

				section.find( '.fusion-scroll-section-element' ).first().css( 'padding', '' );

				section.find( '.fusion-scroll-section-nav a' ).removeClass( 'active' );
				section.find( '.fusion-scroll-section-nav a' ).first().addClass( 'active' );

			} else if ( 0 < currentSegment && 'fixed' === section.find( '.fusion-scroll-section-element' ).last().css( 'position' ) && ( ! section.children( ':nth-child(' + currentSegment + ')' ).hasClass( 'active' ) || 'down' === scrollDirection ) ) {

				// Transition between individual elements.

				// Set correct element to be active.
				section.find( '.fusion-scroll-section-element' ).removeClass( 'active' );
				section.children( ':nth-child(' + currentSegment + ')' ).addClass( 'active' );

				// Set correct navigation link to be active.
				section.find( '.fusion-scroll-section-nav a' ).removeClass( 'active' );
				section.find( '.fusion-scroll-section-nav a[data-element="' + section.children( ':nth-child(' + currentSegment + ')' ).data( 'element' ) + '"] ' ).addClass( 'active' );

				window.scrollDisabled = true;

				// Scroll the page to the top of the current section.
				jQuery( window ).scrollTop( sectionValues.sectionTop + ( sectionValues.viewportHeight * ( currentSegment - 1 ) ) );

				// Disable further scrolling for the time the transition needs.
				disableScroll();
				setTimeout( function() {
					enableScroll();
				}, fusionContainerVars.hundred_percent_scroll_sensitivity );
			}

			scrollDirection = 'up';
		}
		window.lastYPosition = jQuery( window ).scrollTop();
	};

	function disableScroll() {

		// Get current scroll position.
		var scrollTop = window.pageYOffset || document.documentElement.scrollTop,
			scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

		// Set to previous value to suppress scroll.
		window.onscroll = function() {
			window.scrollTo( scrollLeft, scrollTop );
		};


		window.scrollDisabled = true;
	}

	function enableScroll() {
		window.onscroll = function() {}; // eslint-disable-line no-empty-function

		window.scrollDisabled = false;
	}

}( jQuery ) );
