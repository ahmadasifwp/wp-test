/* global fusionJSVars, awbCarouselVars, Swiper */
/* eslint no-nested-ternary: */
// Carousel is used in FB and also related posts for Avada.
( function ( $ ) {
	'use strict';

	var AWBCursorNavHelper = {
		clientX: 0,
		clientY: 0,
		$dragEl: '',
		lerpDamp: 0.18,
		bindEvents: function() {
			document.addEventListener( 'mousemove', function( e ) {
				AWBCursorNavHelper.clientX = e.clientX;
				AWBCursorNavHelper.clientY = e.clientY;
			} );
		},
		init: function( $el ) {
			this.lastX = this.clientX;
			this.lastY = this.clientY;
			this.$el = $el;

			this.createMarkup();
			this.mouseBind();
		},
		createMarkup: function() {
			if ( 0 == $( '.awb-cursor-nav-helper' ).length ) {
				$( 'body' ).append( '<div class="awb-cursor-nav-helper"><span><i class="awb-icon-angle-left awb-cursor-nav-left"></i><i class="awb-icon-angle-right awb-cursor-nav-right"></i></span></div>' );
				this.$dragEl = $( '.awb-cursor-nav-helper' );
				this.pointerBind();
			} else {
				this.$dragEl = $( '.awb-cursor-nav-helper' ).removeAttr( 'style' );
			}
		},
		mouseBind: function() {
			var that = this;

			that.$el.on( 'mouseenter', function() {
				var $cursorColorMode, $cursorColor;
				that.$dragEl.addClass( 'awb-cursor-nav-helper--visible' );

				$cursorColorMode = ( that.$el.is( '[data-cursor-color-mode]' ) ) ? 'color-' + that.$el.attr( 'data-cursor-color-mode' ) : '';
				$cursorColor = ( that.$el.is( '[data-cursor-color]' ) ) ? that.$el.attr( 'data-cursor-color' ) : '';

				that.$dragEl.removeClass( 'color-auto color-custom' );
				that.$dragEl.addClass( $cursorColorMode );

				if ( '' !== $cursorColor ) {
					that.$dragEl[ 0 ].style.setProperty( '--awb-cursor-color', $cursorColor );
				}
			} );

			that.$el.on( 'mouseleave', function() {
				that.$dragEl.removeClass( 'awb-cursor-nav-helper--visible' );
			} );
		},
		pointerBind: function() {
			this.lastY = this.linearInterpolate( this.lastY, this.clientY, this.lerpDamp );
			this.lastX = this.linearInterpolate( this.lastX, this.clientX, this.lerpDamp );

			this.$dragEl[ 0 ].style.transform = 'translateX(' + this.lastX + 'px) translateY(' + this.lastY + 'px)';

			requestAnimationFrame( this.pointerBind.bind( this ) );
		},
		linearInterpolate: function( a, b, n ) {
			return ( ( 1 - n ) * a ) + ( n * b );
		}
	};

	var generateSwiperCarousel = function( cid ) {
		var $targetEl = 'undefined' !== typeof cid ? jQuery( 'div[data-cid="' + cid + '"]' ).find( '.awb-carousel' ) : jQuery( '.awb-carousel' );

		$targetEl.each( function() {
			// Initialize the needed variables from data fields
			var $layout           = ( jQuery( this ).attr( 'data-layout' ) ) ? jQuery( this ).data( 'layout' ) : 'carousel',
				$slideEffect      = ( jQuery( this ).attr( 'data-slide-effect' ) ) ? jQuery( this ).data( 'slide-effect' ) : false,
				$customCursor     = ( jQuery( this ).attr( 'data-mousepointer' ) && 'custom' === jQuery( this ).data( 'mousepointer' ) ) ? true : false,
				$autoplay         = ( jQuery( this ).attr( 'data-autoplay' ) && 'yes' === jQuery( this ).data( 'autoplay' ) ) ? true : false,
				$loop             = ( jQuery( this ).attr( 'data-loop' ) && 'no' === jQuery( this ).data( 'loop' ) ) ? false : true,
				$timeoutDuration  = ( jQuery( this ).parents( '.related-posts' ).length ) ? awbCarouselVars.related_posts_speed : awbCarouselVars.carousel_speed,
				$touchScroll      = ( jQuery( this ).attr( 'data-touchscroll' ) && 'yes' === jQuery( this ).data( 'touchscroll' ) ) ? true : false,
				$columnMaximum    = ( jQuery( this ).attr( 'data-columns' ) ) ? jQuery( this ).data( 'columns' ) : 6,
				$scrollItems      = ( jQuery( this ).data( 'scrollitems' ) ) ? parseInt( jQuery( this ).data( 'scrollitems' ) ) : $columnMaximum,
				$itemMargin       = ( jQuery( this ).attr( 'data-itemmargin' ) ) ? parseInt( jQuery( this ).data( 'itemmargin' ), 10 ) : 44,
				totalSlides       = jQuery( this ).find( '.swiper-wrapper' ).children().length,
				$params           = {
					loop: $loop,
					spaceBetween: $itemMargin,
					speed: 500,
					autoHeight: true,
					pagination: {
						el: jQuery( this ).find( '.swiper-pagination' )[ 0 ],
						clickable: true
					},
					navigation: {
						nextEl: jQuery( this ).find( '.awb-swiper-button-next' )[ 0 ],
						prevEl: jQuery( this ).find( '.awb-swiper-button-prev' )[ 0 ]
					},
					breakpoints: {},
					on: {}
				};

			if ( this.swiper ) {
				return;
			}

			if ( jQuery( this ).closest( '.fusion-builder-row' ) ) {
				jQuery( this ).css( 'max-width', jQuery( this ).closest( '.fusion-builder-row' ).width() );
			}

			if ( 'carousel' === $layout ) {
				// Mobile.
				$params.slidesPerView = ( jQuery( this ).data( 'columnssmall' ) ) ? jQuery( this ).data( 'columnssmall' ) : Math.min( 2, $columnMaximum );
				$params.slidesPerGroup = $params.slidesPerView;

				// Tablet.
				$params.breakpoints[ fusionJSVars.visibility_small ] = {
					slidesPerView: ( jQuery( this ).data( 'columnsmedium' ) ) ? jQuery( this ).data( 'columnsmedium' ) : Math.min( 4, $columnMaximum )
				};
				$params.breakpoints[ fusionJSVars.visibility_small ].slidesPerGroup = $params.breakpoints[ fusionJSVars.visibility_small ].slidesPerView;

				// Desktop.
				$params.breakpoints[ fusionJSVars.visibility_medium ] = {
					slidesPerView: $columnMaximum,
					slidesPerGroup: $scrollItems
				};

				// If amount of items <= slidePerView.
				if ( totalSlides <= $params.breakpoints[ fusionJSVars.visibility_small ].slidesPerView ) {
					$params.breakpoints[ fusionJSVars.visibility_small ].slidesPerView = totalSlides;
				}
				if ( totalSlides <= $params.breakpoints[ fusionJSVars.visibility_medium ].slidesPerView ) {
					$params.breakpoints[ fusionJSVars.visibility_medium ].slidesPerView = totalSlides;

					$params.loop = false;
					$params.autoplay = false;
				}

				// Responsive Arrows.
				$params.on.breakpoint = function( sw, params ) {
					if ( $loop && totalSlides <= params.slidesPerView ) {
						sw.$el.find( '.awb-swiper-button' ).addClass( 'swiper-button-hidden' );
					} else if ( $loop ) {
						sw.$el.find( '.awb-swiper-button' ).removeClass( 'swiper-button-hidden' );
					}
				};

			} else {
				$params.slidesPerView = 1;
				$params.slidesPerGroup = 1;

				if ( 'fade' === $slideEffect && ! $touchScroll ) {
					$params.effect = 'fade';
					$params.fadeEffect = {
						crossFade: true
					};
				}
			}

			if ( $touchScroll ) {
				$params.touchEventsTarget = 'container';
				$params.grabCursor = true;

				if ( $customCursor ) {
					$params.on.touchMove = function( s, p ) {
						AWBCursorNavHelper.clientY = p.clientY;
						AWBCursorNavHelper.clientX = p.clientX;
					};
					$params.on.touchStart = function() {
						$( '.awb-cursor-nav-helper' ).addClass( 'awb-cursor-nav-helper--touch-start' );
						this.$el.find( '.swiper-wrapper' ).addClass( 'is-touch-start' );
					};
					$params.on.touchEnd = function() {
						$( '.awb-cursor-nav-helper' ).removeClass( 'awb-cursor-nav-helper--touch-start' );
						this.$el.find( '.swiper-wrapper' ).removeClass( 'is-touch-start' );
					};
				}
			}
			$params.allowTouchMove = $touchScroll;

			if ( $autoplay ) {
				$params.autoplay = {
					delay: parseInt( $timeoutDuration, 10 )
				};
			}

			$params.on.init = function() {
				if ( $touchScroll && $customCursor ) {
					AWBCursorNavHelper.init( this.$el );
				}

				if ( 'carousel' === $layout && this.$el.find( '.fusion-builder-live-child-element' ).length ) {
					this.$el.find( '.swiper-slide-duplicate' ).removeClass( 'fusion-builder-live-child-element fusion-builder-data-cid' );
				}

				if ( 'carousel' === $layout && this.$el.closest( '.fusion-image-carousel' ).hasClass( 'lightbox-enabled' ) ) {
					const slide = this.slides[ this.activeIndex ];
					const galleryName = jQuery( slide ).find( 'a' ).data( 'rel' );

					if ( 'undefined' !== typeof window.$ilInstances[ galleryName ] ) {
						const self = this;
						this.$el.find( `.swiper-slide-duplicate a[data-rel="${galleryName}"]` ).on( 'click', function( event ) {
							event.preventDefault();
							const index = jQuery( this ).closest( '.swiper-slide-duplicate' ).data( 'swiper-slide-index' );
							self.$el.find( `.swiper-slide:not(.swiper-slide-duplicate)[data-swiper-slide-index="${index}"] a[data-rel]` ).trigger( 'click' );
						} );
					}
				}
			};

			// Initialize the carousel
			new Swiper( jQuery( this )[ 0 ], $params );

		} );
	};

	jQuery( window ).on( 'load fusion-reinit-related-posts-carousel fusion-reinit-carousels fusion-element-render-fusion_images fusion-element-render-fusion_featured_products_slider fusion-element-render-fusion_products_slider fusion-element-render-fusion_portfolio fusion-element-render-fusion_tb_related fusion-element-render-fusion_tb_woo_related fusion-element-render-fusion_tb_woo_upsells fusion-element-render-fusion_post_cards fusion-column-resized', function( event, cid ) {
		generateSwiperCarousel( cid );
	} );

	jQuery( window ).on( 'fusion-dynamic-content-render', function( event, parent ) {
		var $reInitElems = jQuery( parent ).find( '.awb-carousel' );

		if ( 0 < $reInitElems.length ) {
			$reInitElems.each( function() {
				if ( jQuery( this ).closest( '.fusion-builder-row' ).length ) {
					jQuery( this ).css( 'max-width', jQuery( this ).closest( '.fusion-builder-row' ).width() );
				}
			} );
			generateSwiperCarousel();
		}
	} );

	jQuery( window ).on( 'fusion-resize-horizontal', function() {
		if ( jQuery( '.awb-carousel' ).length ) {
			jQuery( '.awb-carousel' ).each( function() {
				if ( jQuery( this ).closest( '.fusion-builder-row' ).length ) {
					jQuery( this ).css( 'max-width', jQuery( this ).closest( '.fusion-builder-row' ).width() );
				}
			} );
		}
	} );

	$( function() {
		AWBCursorNavHelper.bindEvents();
	} );

}( jQuery ) );
