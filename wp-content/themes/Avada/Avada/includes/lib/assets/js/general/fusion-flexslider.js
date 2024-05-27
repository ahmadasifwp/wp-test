/* global fusionFlexSliderVars, Vimeo, YT, onPlayerStateChange, playVideoAndPauseOthers */
/* eslint no-unused-vars: 0*/
jQuery( window ).on( 'load', function() {

	var flexSmoothHeight = 'false' === fusionFlexSliderVars.flex_smoothHeight ? false : true,
		slide;

	window.fusionVimeoPlayers = [];

	if ( jQuery().flexslider ) {

		if ( Number( fusionFlexSliderVars.status_vimeo ) ) {

			jQuery( '.flexslider' ).find( 'iframe' ).each( function() {
				var id  = jQuery( this ).attr( 'id' ),
					src = jQuery( this ).attr( 'src' );

				if ( id && -1 !== src.indexOf( 'vimeo' ) ) {
					window.fusionVimeoPlayers[ id ] = new Vimeo.Player( id ),
					slide              = jQuery( '#' + id ).parents( 'li' );

					window.fusionVimeoPlayers[ id ].on( 'play', function() {
						jQuery( '#' + id ).parents( 'li' ).parent().parent().flexslider( 'pause' );
					} );

					window.fusionVimeoPlayers[ id ].on( 'pause', function() {
						jQuery( slide ).attr( 'data-vimeo-paused', 'true' );

						if ( 'yes' === jQuery( slide ).attr( 'data-loop' ) ) {
							jQuery( '#' + id ).parents( 'li' ).parent().parent().flexslider( 'pause' );
						} else {
							jQuery( '#' + id ).parents( 'li' ).parent().parent().flexslider( 'play' );
						}
					} );

					window.fusionVimeoPlayers[ id ].on( 'ended', function() {
						if ( 'yes' !== jQuery( slide ).attr( 'data-loop' ) && 'true' !== jQuery( slide ).attr( 'data-vimeo-paused' ) ) {
							jQuery( '#' + id ).parents( 'li' ).parent().parent().flexslider( 'next' );
						}

						if ( 'true' === jQuery( slide ).attr( 'data-vimeo-paused', 'true' ) ) {
							jQuery( slide ).attr( 'data-vimeo-paused', 'false' );
						}
					} );
				}
			} );
		}

		// Init flex sliders.
		fusionInitPostFlexSlider();

		if ( 1 <= jQuery( '.flexslider-attachments' ).length ) {
			jQuery.each( jQuery( '.flexslider-attachments' ), function() {

				if ( 'undefined' !== typeof jQuery( this ).data( 'flexslider' ) ) {
					jQuery( this ).flexslider( 'destroy' );
				}

				jQuery( this ).flexslider( {
					slideshow: Boolean( Number( fusionFlexSliderVars.slideshow_autoplay ) ),
					slideshowSpeed: fusionFlexSliderVars.slideshow_speed,
					video: false,
					smoothHeight: flexSmoothHeight,
					pauseOnHover: false,
					useCSS: false,
					prevText: '&#xf104;',
					nextText: '&#xf105;',
					controlNav: 'thumbnails',
					start: function( slider ) {
						jQuery( slider ).find( '.fusion-slider-loading' ).remove();

						// Remove Loading
						slider.removeClass( 'fusion-flexslider-loading' );
					}
				} );

				if ( flexSmoothHeight ) {
					jQuery( this ).find( '.flex-control-nav' ).css( 'position', 'absolute' );
				}
			} );
		}
	}
} );
jQuery( window ).on( 'fusion-element-render-fusion_recent_posts fusion-element-render-fusion_postslider', function( $, cid ) {
	var $targetEl = 'undefined' !== typeof cid ? jQuery( 'div[data-cid="' + cid + '"]' ) : jQuery( document );
	$targetEl.find( '.fusion-flexslider' ).not( '.woocommerce .images #slider' ).flexslider();
} );

jQuery( window ).on( 'fusion-element-render-fusion_slider', function( $, cid ) {
	var $targetEl = 'undefined' !== typeof cid ? jQuery( 'div[data-cid="' + cid + '"]' ) : jQuery( document ),
		slider = $targetEl.find( '.flexslider:not(.tfs-slider)' );

	if ( 'undefined' !== typeof slider ) {
		slider.flexslider();
	}
} );

jQuery( window ).on( 'fusion-element-render-fusion_slide', function( $, cid ) {
	var $targetEl = jQuery( 'li[data-cid="' + cid + '"]' );

	if ( 0 < $targetEl.length && 'undefined' !== typeof $targetEl.data( 'parent-cid' ) ) {
		if ( 'undefined' !== typeof $targetEl.closest( '.flexslider:not(.tfs-slider)' ).data( 'flexslider' ) ) {
			jQuery( $targetEl.closest( '.flexslider:not(.tfs-slider)' ) ).flexslider( 'destroy' );
		}

		jQuery( window ).trigger( 'fusion-element-render-fusion_slider', $targetEl.data( 'parent-cid' ) );
	}
} );

jQuery( window ).on( 'fusion-element-render-fusion_post_cards', function( $, cid ) {
	fusionInitPostFlexSlider();
} );

function fusionInitPostFlexSlider() {
	jQuery( '.fusion-flexslider.fusion-flexslider-loading, .flexslider.fusion-flexslider-loading:not(.tfs-slider)' ).not( '.woocommerce .images #slider' ).each( function() {
		var flexSmoothHeight = 'false' === fusionFlexSliderVars.flex_smoothHeight ? false : true,
			slideShowAutoPlay  = Boolean( Number( fusionFlexSliderVars.slideshow_autoplay ) ),
			slideshowSpeed     = Number( fusionFlexSliderVars.slideshow_speed ),
			slideShowAnimation = 'fade',
			controlNav = true,
			directionNav = true,
			prevText = '<i class="awb-icon-angle-left"></i>',
			nextText = '<i class="awb-icon-angle-right"></i>';

		// If there is just one slide.
		if ( 2 > jQuery( this ).find( '.slides li' ).length ) {
			return;
		}

		flexSmoothHeight   = 'undefined' !== typeof jQuery( this ).data( 'slideshow_smooth_height' ) ? Boolean( Number( jQuery( this ).data( 'slideshow_smooth_height' ) ) ) : flexSmoothHeight;
		slideShowAutoPlay  = 'undefined' !== typeof jQuery( this ).data( 'slideshow_autoplay' ) ? Boolean( Number( jQuery( this ).data( 'slideshow_autoplay' ) ) ) : slideShowAutoPlay;
		slideshowSpeed     = 'undefined' !== typeof jQuery( this ).data( 'slideshow_speed' ) ? Number( jQuery( this ).data( 'slideshow_speed' ) ) : slideshowSpeed;
		slideShowAnimation = 'undefined' !== typeof jQuery( this ).data( 'slideshow_animation' ) ? String( jQuery( this ).data( 'slideshow_animation' ) ) : slideShowAnimation;
		controlNav         = 'undefined' !== typeof jQuery( this ).data( 'slideshow_control_nav' ) ? fusionFlexSliderStrToBool( jQuery( this ).data( 'slideshow_control_nav' ) ) : controlNav;
		directionNav       = 'undefined' !== typeof jQuery( this ).data( 'slideshow_direction_nav' ) ? fusionFlexSliderStrToBool( jQuery( this ).data( 'slideshow_direction_nav' ) ) : directionNav;
		prevText           = 'undefined' !== typeof jQuery( this ).data( 'slideshow_prev_text' ) ? '<i class="' + jQuery( this ).data( 'slideshow_prev_text' ) + '"></i>' : prevText;
		nextText           = 'undefined' !== typeof jQuery( this ).data( 'slideshow_next_text' ) ? '<i class="' + jQuery( this ).data( 'slideshow_next_text' ) + '"></i>' : nextText;

		// TODO: Look into making this check more efficient.
		if ( jQuery().isotope && ( 0 < jQuery( this ).closest( '.fusion-blog-layout-grid' ).length ) ) {
			flexSmoothHeight = false;
		}

		jQuery( this ).flexslider( {
			slideshow: slideShowAutoPlay,
			slideshowSpeed: slideshowSpeed,
			video: true,
			smoothHeight: flexSmoothHeight,
			pauseOnHover: false,
			useCSS: false,
			prevText: prevText,
			nextText: nextText,
			animation: slideShowAnimation,
			controlNav: controlNav,
			directionNav: directionNav,
			start: function( slider ) {

				// Remove Loading
				slider.removeClass( 'fusion-flexslider-loading' );

				// For dynamic content, like equalHeights
				jQuery( window ).trigger( 'resize' );

				if ( 'undefined' !== typeof slider.slides && 0 !== slider.slides.eq( slider.currentSlide ).find( 'iframe' ).length ) {
					if ( Number( fusionFlexSliderVars.pagination_video_slide ) ) {
						jQuery( slider ).find( '.flex-control-nav' ).css( 'bottom', '-20px' );
					} else {
						jQuery( slider ).find( '.flex-control-nav' ).hide();
					}
					if ( Number( fusionFlexSliderVars.status_yt ) && true === window.yt_vid_exists ) {
						window.YTReady( function() {
							new YT.Player( slider.slides.eq( slider.currentSlide ).find( 'iframe' ).attr( 'id' ), {
								events: {
									onStateChange: onPlayerStateChange( slider.slides.eq( slider.currentSlide ).find( 'iframe' ).attr( 'id' ), slider )
								}
							} );
						} );
					}
				} else if ( Number( fusionFlexSliderVars.pagination_video_slide ) ) {
					jQuery( slider ).find( '.flex-control-nav' ).css( 'bottom', '0' );
				} else {
					jQuery( slider ).find( '.flex-control-nav' ).show();
				}

				// Reinitialize element animations.
				if ( jQuery.isFunction( jQuery.fn.initElementAnimations ) ) {
					jQuery( window ).initElementAnimations();
				}
			},
			before: function( slider ) {
				if ( 0 !== slider.slides.eq( slider.currentSlide ).find( 'iframe' ).length ) {
					if ( Number( fusionFlexSliderVars.status_vimeo ) && -1 !== slider.slides.eq( slider.currentSlide ).find( 'iframe' )[ 0 ].src.indexOf( 'vimeo' ) ) {

						if ( 'undefined' !== typeof window.fusionVimeoPlayers[ slider.slides.eq( slider.currentSlide ).find( 'iframe' )[ 0 ].getAttribute( 'id' ) ] ) {
							window.fusionVimeoPlayers[ slider.slides.eq( slider.currentSlide ).find( 'iframe' )[ 0 ].getAttribute( 'id' ) ].pause();
						} else {
							new Vimeo.Player( slider.slides.eq( slider.currentSlide ).find( 'iframe' )[ 0 ] ).pause();
						}
					}

					if ( Number( fusionFlexSliderVars.status_yt ) && true === window.yt_vid_exists ) {
						window.YTReady( function() {
							new YT.Player( slider.slides.eq( slider.currentSlide ).find( 'iframe' ).attr( 'id' ), {
								events: {
									onStateChange: onPlayerStateChange( slider.slides.eq( slider.currentSlide ).find( 'iframe' ).attr( 'id' ), slider )
								}
							} );
						} );
					}

					/* ------------------  YOUTUBE FOR AUTOSLIDER ------------------ */
					playVideoAndPauseOthers( slider );
				}
			},
			after: function( slider ) {
				if ( 0 !== slider.slides.eq( slider.currentSlide ).find( 'iframe' ).length ) {
					if ( Number( fusionFlexSliderVars.pagination_video_slide ) ) {
						jQuery( slider ).find( '.flex-control-nav' ).css( 'bottom', '-20px' );
					} else {
						jQuery( slider ).find( '.flex-control-nav' ).hide();
					}

					if ( Number( fusionFlexSliderVars.status_yt ) && true === window.yt_vid_exists ) {
						window.YTReady( function() {
							new YT.Player( slider.slides.eq( slider.currentSlide ).find( 'iframe' ).attr( 'id' ), {
								events: {
									onStateChange: onPlayerStateChange( slider.slides.eq( slider.currentSlide ).find( 'iframe' ).attr( 'id' ), slider )
								}
							} );
						} );
					}
				} else if ( Number( fusionFlexSliderVars.pagination_video_slide ) ) {
					jQuery( slider ).find( '.flex-control-nav' ).css( 'bottom', '0' );
				} else {
					jQuery( slider ).find( '.flex-control-nav' ).show();
				}
				jQuery( '[data-spy="scroll"]' ).each( function() {
					jQuery( this ).scrollspy( 'refresh' );
				} );
			}
		} );

		// Reset flexSmoothHeight for next container.
		flexSmoothHeight = 'false' === fusionFlexSliderVars.flex_smoothHeight ? false : true;
	} );
}

function fusionDestroyPostFlexSlider() {
	jQuery( '.fusion-flexslider' ).not( '.woocommerce .images #slider' ).flexslider( 'destroy' );
}

// Re-init flexslider on partial refresh.
window.addEventListener( 'fusion-reinit-single-post-slideshow', function() {
	fusionInitPostFlexSlider();
} );

function fusionFlexSliderStrToBool( s ) {
	var regex = /^\s*(true|1|on)\s*$/i;
	return regex.test( s );
}
