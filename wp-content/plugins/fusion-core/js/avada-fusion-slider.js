/* globals fusionSetOriginalTypographyData, cssua, Modernizr, avadaFusionSliderVars, playVideoAndPauseOthers, resizeVideo, fusion */

function updateVideoTag() {
    jQuery( '.fusion-slider-self-hosted-video-placeholder' ).each( function( index, selfHostedVideoPlaceholder ) {

        // Video is already inited, so continue.
        if ( 0 < jQuery( selfHostedVideoPlaceholder ).next( 'video' ).length ) {
            return;
        }

		jQuery( selfHostedVideoPlaceholder ).after( function() {
			var attrs = 'width="1800" height="700"',
				innerHTML = '';

			jQuery( selfHostedVideoPlaceholder.attributes ).each( function( k, attr ) {
				switch ( attr.name ) {
					case 'class':
						// Skip this one.
						break;
					case 'data-ogg':
						innerHTML += ( attr.nodeValue ) ? '<source src="' + attr.nodeValue + '" type="video/ogg">' : '';
						break;
					case 'data-webm':
						innerHTML += ( attr.nodeValue ) ? '<source src="' + attr.nodeValue + '" type="video/webm">' : '';
						break;
					case 'data-mp4':
						innerHTML += ( attr.nodeValue ) ? '<source src="' + attr.nodeValue + '" type="video/mp4">' : '';
						break;
					default:
						attrs += ' ' + attr.name + '="' + attr.nodeValue + '"';
				}
			} );

			return '<video ' + attrs + '>' + innerHTML + '</video>';
		} );
	} );
}
function avadaFusionSlider( el ) {
    if ( ! el ) {
        return;
    }

    this.$el                = jQuery( el );
    this.isPostContent      = 1 <= this.$el.parents( '.post-content' ).length;
    this.percentageWidth    = false;
    this.isParallax         = cssua.ua.mobile || this.breakpointReached() || this.isPostContent ? false : 1 === parseInt( this.$el.data( 'parallax' ) );
    this.isFullHeight       = 1 === parseInt( this.$el.parent().data( 'full_height' ) );
    this.isFullScreen       = this.isFullHeight || ( this.isPostContent ? false : 1 === parseInt( this.$el.data( 'full_screen' ) ) );
    this.isShortcode        = 0 === this.$el.parent( '#sliders-container' ).length;
    this.headerHeight       = jQuery( '.fusion-header-wrapper' ).height();
    this.resizeWidth        = jQuery( window ).width();
    this.fullHeightOffset   = this.$el.parent().data( 'offset' );
    this.isBoxedMode        = 0 < jQuery( '.layout-boxed-mode' ).length;

    // If we're in the frontend builder reset some CSS.
    if ( jQuery( 'body' ).hasClass( 'fusion-builder-live' ) && ! jQuery( 'body' ).hasClass( 'fusion-builder-live-preview-only' ) ) {
        this.$el.css( 'width', '' );
        this.$el.css( 'margin-left', '' );
        this.$el.css( 'margin-right', '' );
        this.$el.css( 'left', '' );
    }

    this.setResponsiveTypography();

    if ( ! this.isShortcode && this.isParallax  ) {
        jQuery( '.fusion-header' ).addClass( 'fusion-header-backface' );
    }

    if ( this.isFullScreen ) {
        this.$el.css( 'max-width', '100%' );
        this.$el.find( '.slides, .background' ).css( 'width', '100%' );
    }

    this.updateXPosition();

    this.initFlexslider();

    // Bindings
    jQuery( window ).on( 'fusion-resize-horizontal fusion-resize-vertical fusion-column-resized', this.sliderResize.bind( this ) );
    jQuery( window ).on( 'scroll', this.windowScroll.bind( this ) );

}

avadaFusionSlider.prototype.fusionReanimateSlider = function fusionReanimateSlider( contentContainer ) {
    var slideContent = contentContainer.find( '.slide-content' ),
        scrollDonwIndicators = contentContainer.siblings( '.tfs-scroll-down-indicator' );

    jQuery( slideContent ).each( function() {
        jQuery( this ).stop( true, true );

        jQuery( this ).css( 'margin-top', '50px' );

        jQuery( this ).animate( {
            opacity: '1',
            'margin-top': '0'
        }, 1000 );
    } );

    jQuery( scrollDonwIndicators ).each( function() {
        var scrollDonwIndicator = jQuery( this );

        scrollDonwIndicator.stop( true, true );

        scrollDonwIndicator.css( 'opacity', '0' );

        if ( slideContent.offset().top + slideContent.height() + 25 < scrollDonwIndicator.offset().top ) {
            scrollDonwIndicator.css( 'padding-bottom', '50px' );

            setTimeout( function() {
                scrollDonwIndicator.animate( {
                    opacity: '1',
                    'padding-bottom': '0'
                }, 500, 'easeOutCubic' );
            }, 500 );
        }
    } );
};

avadaFusionSlider.prototype.getHeaderHeight = function getHeaderHeight() {
    if ( this.isShortcode && this.isFullHeight ) {
        // TODO change to accept all kind of units
        return this.fullHeightOffset ? fusion.getHeight( this.fullHeightOffset ) : 0;
    }
    // Check if we dealing with a header layout.
    if ( jQuery( '.fusion-tb-header:not( #side-header )' ).length ) {
        return jQuery( '.fusion-tb-header' ).height();
    }

    if ( this.breakpointReached() && jQuery( '#side-header' ).length ) {
        return jQuery( '#side-header' ).outerHeight();
    }
    return jQuery( '.fusion-header-wrapper' ).height();
};

avadaFusionSlider.prototype.getWpAdminBarHeight = function getWpAdminBarHeight() {
    var height = 0;

    if ( 'object' === typeof fusion && 'function' === typeof fusion.getAdminbarHeight ) {
        height = fusion.getAdminbarHeight();
    } else if ( jQuery( '#wpadminbar' ).length ) {
        height = jQuery( '#wpadminbar' ).height();
    }

    return height;
};

avadaFusionSlider.prototype.removeLoader = function removeLoader() {
    this.$el.parent().find( '.fusion-slider-loading' ).remove();
};

avadaFusionSlider.prototype.getMaxHeight = function getMaxHeight() {
    var maxHeight = Math.max.apply(
        null,
        this.$el.find( '.slide-content' ).map( function() {
            return jQuery( this ).outerHeight();
        } ).get()
    );
    return maxHeight + 40;
};

avadaFusionSlider.prototype.removeTitleSeparators = function removeTitleSeparators( slider ) {
    // Remove title separators and padding, when there is not enough space.
    if ( 'function' === typeof jQuery.fn.fusion_responsive_title_shortcode ) {
        jQuery( slider.slides.eq( slider.currentSlide ) ).find( '.fusion-title' ).fusion_responsive_title_shortcode();
    }
};

avadaFusionSlider.prototype.getHeightOnFS = function getHeightOnFS() {
    var addHeaderheight = false;

    if (  this.breakpointReached() ) {
        addHeaderheight = ! ( 1 == avadaFusionSliderVars.mobile_header_transparency && 'below' === avadaFusionSliderVars.slider_position.toLowerCase() );
    } else if ( ! this.isParallax && ! jQuery( '#side-header' ).length ) {
        addHeaderheight = ! ( 1 == avadaFusionSliderVars.header_transparency && 'below' === avadaFusionSliderVars.slider_position.toLowerCase() );
    } else if ( 'above' === avadaFusionSliderVars.slider_position.toLowerCase() && ! jQuery( '#side-header' ).length ) {
        addHeaderheight = true;
    }
    return jQuery( window ).height() - this.getWpAdminBarHeight() - ( addHeaderheight ? this.getHeaderHeight() : 0 );
};

avadaFusionSlider.prototype.getWidth = function getWidth() {
    var width       = this.$el.data( 'slider_width' ),
        $firstSlide = jQuery( this.$el.find( 'li' ).get( 0 ) );

    if ( -1 !== width.indexOf( '%' ) ) {
        width = $firstSlide.find( '.background-image' ).data( 'imgwidth' );
        width = ! width && ! cssua.ua.mobile ? $firstSlide.find( 'video' ).width() : width;
        width = ! width ? 940 : width;
        width = width < this.$el.data( 'slider_width' ) ? this.$el.data( 'slider_width' ) : width;
        // TODO try to move this out of this function.
        this.percentageWidth = true;
    } else {
        width = parseInt( width, 10 );
    }

    return width;
};

avadaFusionSlider.prototype.getHeight = function getHeight( sliderWidth ) {
    var height = parseInt( this.$el.data( 'slider_height' ), 10 ),
        aspectRatio = height / sliderWidth,
        compareWidth;

    if ( 0.5 > aspectRatio ) {
        aspectRatio = 0.5;
    }

    compareWidth = this.$el.parent().parent().parent().width();
    if ( 1 <= this.$el.parents( '.post-content' ).length ) {
        compareWidth = this.$el.width();

        if ( this.$el.parents( '.tab-content' ).length ) {
            compareWidth = this.$el.parents( '.tab-content' ).width() - 60;
        }
    }
    height = aspectRatio * compareWidth;

    if ( height > parseInt( this.$el.data( 'slider_height' ), 10 ) ) {
        height = parseInt( this.$el.data( 'slider_height' ), 10 );
    }

    if ( 200 > height ) {
        height = 200;
    }
    return height;
};

avadaFusionSlider.prototype.fusionFixZindex = function fusionFixZindex() {

    // Do nothing if we're in front end builder mode.
    if ( jQuery( 'body' ).hasClass( 'fusion-builder-live' ) && ! jQuery( 'body' ).hasClass( 'fusion-builder-live-preview-only' ) ) {
        return;
    }

    if ( 'absolute' !== jQuery( '.fusion-header-wrapper' ).css( 'position' ) ) {
        jQuery( '.fusion-header-wrapper' ).css( 'position', 'relative' );
    }
    jQuery( '#main, .fusion-footer-widget-area, .fusion-footer-copyright-area, .fusion-page-title-bar' ).css( 'position', 'relative' );
    jQuery( '#main, .fusion-footer-widget-area, .fusion-footer-copyright-area, .fusion-page-title-bar' ).css( 'z-index', '3' );
    jQuery( '.fusion-header-wrapper' ).css( 'z-index', '5' );
};

avadaFusionSlider.prototype.parallaxAdjustments = function parallaxAdjustments() {
    var self = this,
        wrappingContainer,
        fixedWidthCenter,
        $navigationArrowsTranslate;

    if ( ! this.breakpointReached() ) {
        this.$el.css( 'position', 'fixed' );
        if ( 'absolute' !== jQuery( '.fusion-header-wrapper' ).css( 'position' ) ) {
            jQuery( '.fusion-header-wrapper' ).css( 'position', 'relative' );
            $navigationArrowsTranslate = ( this.getHeaderHeight() / 2 ) + 'px';

            if ( 'below' === avadaFusionSliderVars.slider_position.toLowerCase() ) {
                this.$el.parents( '.fusion-slider-container' ).css( 'margin-top', '-' + this.getHeaderHeight() + 'px' );
            }
        } else {
            $navigationArrowsTranslate = '0';
        }
        this.$el.find( '.flex-direction-nav li a' ).css( 'margin-top', $navigationArrowsTranslate );

        jQuery( '.fusion-header-wrapper' ).css( 'height', this.getHeaderHeight() );

        this.fusionFixZindex();

        if ( 1 == this.$el.data( 'full_screen' ) ) {
            this.$el.find( '.flex-control-nav' ).css( 'bottom', ( this.getHeaderHeight() / 2 ) );
        } else {
            this.$el.find( '.flex-control-nav' ).css( 'bottom', 0 );
        }

        if ( this.$el.hasClass( 'fixed-width-slider' ) ) {
            if ( 'left' === avadaFusionSliderVars.header_position || 'right' === avadaFusionSliderVars.header_position ) {
                if ( ! this.isShortcode ) {
                    wrappingContainer = jQuery( '#sliders-container' );
                } else {
                    wrappingContainer = jQuery( '#main' );
                }

                if ( wrappingContainer.width() < parseFloat( this.$el.parent().css( 'max-width' ) ) ) {
                    this.$el.css( 'max-width', wrappingContainer.width() );
                } else {
                    this.$el.css( 'max-width', this.$el.parent().css( 'max-width' ) );
                }

                if ( 'left' === avadaFusionSliderVars.header_position ) {
                    fixedWidthCenter = '-' + ( ( this.$el.width() - jQuery( '#side-header' ).width() ) / 2 ) + 'px';
                } else {
                    fixedWidthCenter = '-' + ( ( this.$el.width() + jQuery( '#side-header' ).width() ) / 2 ) + 'px';
                }

                if ( ( -1 ) * fixedWidthCenter > this.$el.width() ) {
                    fixedWidthCenter = ( -1 ) * this.$el.width();
                }
            } else {
                fixedWidthCenter = '-' + ( this.$el.width() / 2 ) + 'px';
            }
            this.$el.css( 'left', '50%' );
            this.$el.css( 'margin-left', fixedWidthCenter );
        }

        // This line might be necessary.
        // jQuery( thisTFSlider ).find( '.flex-control-nav' ).css( 'bottom', ( headerHeight / 2 ) );

        if ( ( 0 === avadaFusionSliderVars.header_transparency || '0' === avadaFusionSliderVars.header_transparency || false === avadaFusionSliderVars.header_transparency ) && 'below' === avadaFusionSliderVars.slider_position.toLowerCase() ) {
            this.$el.find( '.slide-content-container' ).each( function() {
                jQuery( this ).css( 'padding-top',  self.getHeaderHeight() + 'px' );
            } );
        }

    } else if ( this.breakpointReached() ) {
        this.$el.css( 'position', 'relative' );
        this.$el.css( 'left', '0' );
        this.$el.css( 'margin-left', '0' );

        this.fusionFixZindex();

        jQuery( '.fusion-header-wrapper' ).css( 'height', 'auto' );
        this.$el.parents( '.fusion-slider-container' ).css( 'margin-top', '' );
        this.$el.find( '.flex-direction-nav li a' ).css( 'margin-top', '' );

        this.$el.find( '.flex-control-nav' ).css( 'bottom', 0 );

        if ( ( 0 === avadaFusionSliderVars.header_transparency || '0' === avadaFusionSliderVars.header_transparency || false === avadaFusionSliderVars.header_transparency ) && 'below' === avadaFusionSliderVars.slider_position.toLowerCase() ) {
            this.$el.find( '.slide-content-container' ).each( function() {
                jQuery( this ).css( 'padding-top',  '' );
            } );
        }
    }
};

avadaFusionSlider.prototype.updateVideoContainers = function updateVideoContainers( sliderHeight, sliderWidth, video ) {
    var self = this,
        videos = 'undefined' !== typeof video ? video : this.$el.find( 'video' );

    videos.each( function() {
        var arcSliderLeft,
            compareWidth,
            aspectRatio,
            arcSliderWidth,
            position;

        jQuery( this ).removeAttr( 'style' );

        aspectRatio    = jQuery( this ).width() / jQuery( this ).height();
        arcSliderWidth = aspectRatio * sliderHeight;

        if ( arcSliderWidth < sliderWidth && ! self.$el.hasClass( 'full-width-slider' ) ) {
            arcSliderWidth = sliderWidth;
        }

        arcSliderLeft = '-' + ( ( arcSliderWidth - self.$el.width() ) / 2 ) + 'px';
        compareWidth = self.$el.parent().parent().parent().width();
        if ( 1 <= self.$el.parents( '.post-content' ).length ) {
            compareWidth = self.$el.width();
        }
        if ( compareWidth > arcSliderWidth && true === self.percentageWidth && ! self.isFullScreen ) {
            arcSliderWidth = '100%';
            arcSliderLeft = 0;
        } else if ( self.isFullScreen ) {
            if ( compareWidth > arcSliderWidth ) {
                arcSliderWidth = '100%';
                arcSliderLeft = 0;
                position = 'static';
            } else {
                position = 'absolute';
            }
        }

        jQuery( this ).width( arcSliderWidth );
        jQuery( this ).css( 'left', arcSliderLeft );
        if ( position ) {
            jQuery( this ).css( 'position', position );
        }
    } );
};

avadaFusionSlider.prototype.breakpointReached = function breakpointReached( type ) {
    switch ( type ) {
        case 'content':
            return Modernizr.mq( 'only screen and (max-width: ' + avadaFusionSliderVars.content_break_point + 'px)' );

        case 'header':
        default:
            return Modernizr.mq( 'only screen and (max-width: ' + avadaFusionSliderVars.side_header_break_point + 'px)' );
    }
};

avadaFusionSlider.prototype.updateHeight = function updateHeight( sliderHeight ) {
    this.$el.parents( '.fusion-slider-container' ).css( 'max-height', sliderHeight );
    this.$el.parents( '.fusion-slider-container' ).css( 'height', sliderHeight );
    this.$el.css( 'height', sliderHeight );
    this.$el.find( '.background, .mobile_video_image' ).css( 'height', sliderHeight );
};

avadaFusionSlider.prototype.updateXPosition = function updateXPosition() {
    var fixedWidthCenter;

    if ( ( 'left' === avadaFusionSliderVars.header_position || 'right' === avadaFusionSliderVars.header_position ) && ! this.$el.hasClass( 'fixed-width-slider' ) && this.isParallax ) {
        this.$el.css( 'max-width', jQuery( '#wrapper' ).width() + 1 );
        if ( jQuery( 'body' ).hasClass( 'side-header-left' ) ) {
            this.$el.css( {
                'left': '50%',
                'transform': 'translateX(calc(' + jQuery( '#side-header' ).width() + 'px / 2 - 50%))'
            } );
        } else if ( jQuery( 'body' ).hasClass( 'side-header-right' ) ) {
            this.$el.css( {
                'left': '50%',
                'transform': 'translateX(calc(' + jQuery( '#side-header' ).width() + 'px / -2 - 50%))'
            } );
        }
    }

    if ( this.isParallax && this.isBoxedMode && 'top' === avadaFusionSliderVars.header_position ) {
        this.$el.css( 'width', jQuery( '.layout-boxed-mode #wrapper' ).width() );

        fixedWidthCenter = '-' + ( this.$el.width() / 2 ) + 'px';
        this.$el.css( 'left', '50%' );
        this.$el.css( 'margin-left', fixedWidthCenter );
    }
};

avadaFusionSlider.prototype.maybeUpdateButtons = function maybeUpdateButtons() {
    if ( cssua.ua.mobile ) {
        this.$el.find( '.fusion-button' ).each( function() {
            jQuery( this ).removeClass( 'button-xlarge button-large button-medium' );
            jQuery( this ).addClass( 'button-small' );
        } );
    }

    this.$el.find( 'a.button' ).each( function() {
        jQuery( this ).data( 'old', jQuery( this ).attr( 'class' ) );
    } );

    if ( this.breakpointReached( 'content' ) ) {
        this.$el.find( '.fusion-button' ).each( function() {
            jQuery( this ).data( 'old', jQuery( this ).attr( 'class' ) );
            jQuery( this ).removeClass( 'button-xlarge button-large button-medium' );
            jQuery( this ).addClass( 'button-small' );
        } );
    } else {
        this.$el.find( 'a.button' ).each( function() {
            jQuery( this ).attr( 'class', jQuery( this ).data( 'old' ) );
        } );
    }
};

avadaFusionSlider.prototype.initFlexslider = function initFlexslider() {
    var self = this,
        sliderOptions = {
        animation: this.$el.data( 'animation' ),
        slideshow: this.$el.data( 'autoplay' ),
        slideshowSpeed: this.$el.data( 'slideshow_speed' ),
        animationSpeed: this.$el.data( 'animation_speed' ),
        controlNav: Boolean( 'pagination_circles' === this.$el.data( 'slider_indicator' ) ),
        directionNav: Boolean( Number( this.$el.data( 'nav_arrows' ) ) ),
        animationLoop: Boolean( Number( this.$el.data( 'loop' ) ) ),
        smoothHeight: true,
        pauseOnHover: false,
        useCSS: true,
        video: true,
        touch: true,
        prevText: '&#xe61e;',
        nextText: '&#xe620;',
        start: function( slider ) {
            var sliderWidth, sliderHeight;

            self.removeLoader();

            jQuery( slider.slides.eq( slider.currentSlide ) ).find( '.slide-content-container' ).show();
            jQuery( slider.slides.eq( slider.currentSlide ) ).find( '.tfs-scroll-down-indicator' ).show();

            self.removeTitleSeparators();

            sliderWidth  = self.isFullScreen ? 0 : self.getWidth(),
            sliderHeight = self.isFullScreen ? self.getHeightOnFS() : self.getHeight( sliderWidth );

            // Framed look, remove the offsets from height.
            if ( self.isFullScreen && jQuery( '.fusion-top-frame' ).length ) {
                sliderHeight = sliderHeight - jQuery( '.fusion-top-frame' ).height() - jQuery( '.fusion-bottom-frame' ).height();
            }

            if ( sliderHeight < self.getMaxHeight() ) {
                sliderHeight = self.getMaxHeight();
            }

            setTimeout( function() {
                self.$el.find( 'video' ).each( function() {
                    jQuery( this ).hide();
                    self.updateVideoContainers( sliderHeight, sliderWidth, jQuery( this ) );
                    jQuery( this ).show();

                    jQuery( this ).on( 'loadeddata', function() {
                        jQuery( this ).hide();
                        self.updateVideoContainers( sliderHeight, sliderWidth, jQuery( this ) );
                        jQuery( this ).show();
                    } );
                } );
            }, 500 );

            self.updateHeight( sliderHeight );

            self.maybeUpdateButtons();

            if ( self.isParallax ) {
                self.parallaxAdjustments();
            }

            jQuery( slider.slides.eq( slider.currentSlide ) ).find( 'video' ).each( function() {
                if ( 'yes' === jQuery( this ).parents( 'li' ).attr( 'data-autoplay' ) ) {
                    if ( 'function' === typeof jQuery( this )[ 0 ].play ) {
                        jQuery( this )[ 0 ].play();
                    }
                }
            } );

            // Adjust header slider margin when header is left/right.
            if ( ! self.isPostContent &&
                ( 'left' === avadaFusionSliderVars.header_position || 'right' === avadaFusionSliderVars.header_position ) &&
                ! this.isShortcode
            ) {
                self.$el.parents( '#sliders-container' ).find( '.slide-content-container' ).each( function() {
                    if ( ! self.breakpointReached() ) {
                        if ( jQuery( this ).hasClass( 'slide-content-right' ) ) {
                            jQuery( this ).find( '.slide-content' ).css( 'margin-right', '100px' );
                        } else if ( jQuery( this ).hasClass( 'slide-content-left' ) ) {
                            jQuery( this ).find( '.slide-content' ).css( 'margin-left', '100px' );
                        }
                    }
                } );
            }

            self.fusionReanimateSlider( self.$el.find( '.slide-content-container' ) );

            // Control Videos
            if ( 'undefined' !== typeof slider.slides && 0 !== slider.slides.eq( slider.currentSlide ).find( 'iframe' ).length ) {
                playVideoAndPauseOthers( slider );
            }

            self.$el.find( '.overlay-link' ).hide();
            jQuery( slider.slides.eq( slider.currentSlide ) ).find( '.overlay-link' ).show();

            // Resize videos
            self.$el.find( '[data-youtube-video-id], [data-vimeo-video-id]' ).each(
                function() {
                    var $this = jQuery( this );
                    setTimeout(
                        function() {
                            resizeVideo( $this );
                        }, 500
                    );
                }
            );

            // Re-init sticky containers if main slider.
            if ( jQuery( self.$el ).closest( '#sliders-container' ).length ) {
              jQuery( document.body ).trigger( 'sticky_kit:recalc' );
            }
        },
        before: function() {
            self.$el.find( '.slide-content-container' ).hide();
            self.$el.find( '.tfs-scroll-down-indicator' ).hide();
        },
        after: function( slider ) {

            jQuery( slider.slides.eq( slider.currentSlide ) ).find( '.slide-content-container' ).show();
            jQuery( slider.slides.eq( slider.currentSlide ) ).find( '.tfs-scroll-down-indicator' ).show();

            if ( 'function' === typeof jQuery.fn.fusion_responsive_title_shortcode ) {
                jQuery( slider.slides.eq( slider.currentSlide ) ).find( '.fusion-title' ).fusion_responsive_title_shortcode();
            }

            self.fusionReanimateSlider( self.$el.find( '.slide-content-container' ) );

            self.$el.find( '.overlay-link' ).hide();
            jQuery( slider.slides.eq( slider.currentSlide ) ).find( '.overlay-link' ).show();

            jQuery( slider.slides.eq( slider.currentSlide ) ).find( '[data-youtube-video-id], [data-vimeo-video-id]' ).each( function() {
                resizeVideo( jQuery( this ) );
            } );

            playVideoAndPauseOthers( slider );

            jQuery( '[data-spy="scroll"]' ).each( function() {
                jQuery( this ).scrollspy( 'refresh' );
            } );
        }
    };
    this.$el.flexslider( sliderOptions );
};

avadaFusionSlider.prototype.sliderResize = function sliderResize( event, scopedCID ) { // eslint-disable-line no-unused-vars
    var self = this,
        $activeSlide,
        $scrollDownIndicator,
        sliderWidth,
        sliderHeight;

    $activeSlide            = self.$el.find( '.flex-active-slide' ),
    $scrollDownIndicator    = $activeSlide.find( '.tfs-scroll-down-indicator' ),
    sliderWidth             = self.isFullScreen ? 0 : self.getWidth(),
    sliderHeight            = self.isFullScreen ? self.getHeightOnFS() : self.getHeight( sliderWidth );

    if ( 'undefined' !== typeof $scrollDownIndicator.offset() && $activeSlide.find( '.slide-content' ).offset().top + $activeSlide.find( '.slide-content' ).height() + 25 < $scrollDownIndicator.offset().top ) {
        $scrollDownIndicator.css( 'opacity', '1' );
    } else {
        $scrollDownIndicator.css( 'opacity', '0' );
    }

    // Framed look, remove the offsets from height.
    if ( self.isFullScreen && jQuery( '.fusion-top-frame' ).length ) {
        sliderHeight = sliderHeight - jQuery( '.fusion-top-frame' ).height() - jQuery( '.fusion-bottom-frame' ).height();
    }

    if ( sliderHeight < self.getMaxHeight() ) {
        sliderHeight = self.getMaxHeight();
    }
    // Timeout to prevent self hosted video position breaking on re-size with sideheader.
    setTimeout( function() {
        self.updateVideoContainers( sliderHeight, sliderWidth );
    }, 100 );

    self.updateXPosition();

    self.updateHeight( sliderHeight );

    self.maybeUpdateButtons();

    if ( self.isParallax ) {
        self.parallaxAdjustments();
    }

    // Responsive stuff
    if ( Modernizr.mq( 'only screen and (max-width: 640px)' ) ) {
        self.$el.parents( '.fusion-slider-container' ).css( 'height', sliderHeight );
        self.$el.css( 'height', sliderHeight );
        self.$el.find( '.background, .mobile_video_image' ).css( 'height', sliderHeight );
    } else if ( self.breakpointReached() ) {
        self.$el.parents( '.fusion-slider-container' ).css( 'height', sliderHeight );
        self.$el.css( 'height', sliderHeight );
        self.$el.find( '.background, .mobile_video_image' ).css( 'height', sliderHeight );
    } else {
        self.$el.parents( '.fusion-slider-container' ).css( 'height', sliderHeight );
        self.$el.css( 'height', sliderHeight );
        self.$el.find( '.background, .mobile_video_image' ).css( 'height', sliderHeight );
    }
};

avadaFusionSlider.prototype.windowScroll = function windowScroll( ) {
    if ( ! this.isParallax ) {
        return;
    }
    if ( this.$el.parents( '#sliders-container' ).length && jQuery( window ).scrollTop() >= jQuery( '#sliders-container' ).position().top + jQuery( '#sliders-container' ).height() ) {
      if ( ! cssua.ua.mobile && ! Modernizr.mq( 'only screen and (max-width: ' + avadaFusionSliderVars.side_header_break_point + 'px)' ) ) {
        this.$el.css( 'position', 'static' );
      }
      this.$el.css( 'visibility', 'hidden' );
    } else {
      if ( ! cssua.ua.mobile && ! Modernizr.mq( 'only screen and (max-width: ' + avadaFusionSliderVars.side_header_break_point + 'px)' ) ) {
        this.$el.css( 'position', 'fixed' );
      }
      this.$el.css( 'visibility', 'visible' );
    }
  };

avadaFusionSlider.prototype.setResponsiveTypography = function setResponsiveTypography() {
    var sliderId;
    if ( 'function' === typeof fusionSetOriginalTypographyData ) {
        sliderId = this.$el.parent().data( 'id' );
        if ( 'fusion-slider-' + sliderId !== this.$el.parent().attr( 'id' ) ) {
            sliderId = '.fusion-slider-' + sliderId;
        } else {
            sliderId = '#fusion-slider-' + sliderId;
        }

        if ( 'undefined' === typeof jQuery( sliderId ).data( 'has-rendered' ) ) {
            fusionSetOriginalTypographyData(
                sliderId + ' h1, ' + sliderId + ' h2, ' + sliderId + ' h3, ' + sliderId + ' h4, ' + sliderId + ' h5, ' + sliderId + ' h6'
            );
            jQuery( sliderId ).data( 'has-rendered', true );
        }
    }
};

jQuery( document ).on( 'ready fusion-element-render-fusion_fusionslider fusion-partial-header_position fusion-partial-wooslider fusion-partial-fusion_tax_wooslider fusion-partial-slider_type fusion-column-resized', function( $, cid ) {

    // Need to check when this condition applies. I can't imagine a case where ready contains a CID.
    if ( 'ready' === $.type && jQuery( 'body' ).hasClass( 'fusion-builder-live-preview' ) && 'undefined' !== typeof cid ) {
		return;
    }

    // Add video elements for self hosted video slides.
    if ( ! cssua.ua.mobile ) {
        updateVideoTag();
    }

    // Check if where're just initializing one slider
    // else init all.
    if ( 'undefined' !== typeof cid ) {
        new avadaFusionSlider( jQuery( 'div[data-cid="' + cid + '"]' ).find( '.tfs-slider' )[ 0 ] );
    } else {
        jQuery( '.tfs-slider' ).each( function() {
            new avadaFusionSlider( this );
        } );
    }

} );
