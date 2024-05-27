// Marquee Section
( function( jQuery ) {
    'use strict';

    jQuery( initializeAllMarquee );
    jQuery( addMarqueeEvents );
    // Trigger to refresh in live-builder.
    jQuery( 'body' ).on( 'fusion-element-render-fusion_news_ticker', initializeAllMarquee );

    function initializeAllMarquee() {
        var marqueeList = jQuery( '.awb-news-ticker-marquee' );

        marqueeList.each( function( index, elem ) {
            var marqueeElem = jQuery( elem ),
            oldMarquee = marqueeElem.data( 'awb_news_ticker_marquee' ),
            Marquee;

            if ( oldMarquee ) {
                oldMarquee.initializeOrRefresh();
                return;
            }

            Marquee = new newsTickerMarquee( marqueeElem );
            Marquee.initializeOrRefresh();
        } );
    }

    function addMarqueeEvents() {
        jQuery( window ).resize( function() {
            var marquees = jQuery( '.awb-news-ticker-marquee' );
            marquees.each( function( index, elem ) {
                var marquee = jQuery( elem ).data( 'awb_news_ticker_marquee' );
                if ( marquee ) {
                    marquee.updateMarqueeDuration();
                }
            } );
        } );

        jQuery( document ).on( 'mouseenter', '.awb-news-ticker-marquee', function() {
            var marqueeElem = jQuery( this ).data( 'awb_news_ticker_marquee' );
            if ( marqueeElem ) {
                marqueeElem.pauseMarquee();
            }
        } );

        jQuery( document ).on( 'mouseleave', '.awb-news-ticker-marquee', function() {
            var marqueeElem = jQuery( this ).data( 'awb_news_ticker_marquee' );
            if ( marqueeElem ) {
                marqueeElem.continueMarquee();
            }
        } );

        jQuery( document ).on( 'focusin', '.awb-news-ticker-marquee', function() {
            var marqueeElem = jQuery( this ).data( 'awb_news_ticker_marquee' );
            if ( marqueeElem ) {
                marqueeElem.pauseMarquee();
            }
        } );

        jQuery( document ).on( 'focusout', '.awb-news-ticker-marquee', function() {
            var marqueeElem = jQuery( this ).data( 'awb_news_ticker_marquee' );
            if ( marqueeElem ) {
                marqueeElem.continueMarquee();
            }
        } );
    }

    // This is used/acting like a class.
    function newsTickerMarquee( wrapper ) {
        var self = this,
            itemsList,
            itemsBar,
            pixelPerSecond;

        this.initializeOrRefresh = function() {
            itemsList = wrapper.find( '.awb-news-ticker-item-list' );
            itemsBar = wrapper.find( '.awb-news-ticker-bar' );
            pixelPerSecond = itemsList.attr( 'data-awb-ticker-speed' );
            wrapper.data( 'awb_news_ticker_marquee', this );

            self.updateMarqueeDuration();
        };

        this.updateMarqueeDuration = function() {
            var width = itemsList.width(),
                trackWidth = itemsBar.width(),
                animationDuration;

            if ( ! ( 0 < pixelPerSecond ) ) {
                return;
            }

            animationDuration = ( ( width + trackWidth ) / pixelPerSecond ).toFixed( 2 ) + 's';
            itemsList.css( 'animation-name', 'awb-run-news-ticker' );
            itemsList.css( 'animation-duration', animationDuration );
        };

        this.pauseMarquee = function() {
            itemsList.css( 'animation-play-state', 'paused' );
        };

        this.continueMarquee = function() {
            itemsList.css( 'animation-play-state', '' );
        };
    }
}( jQuery ) );

// Carousel Section
( function( jQuery ) {
	'use strict';

    jQuery( initializeAllCarousels );
    jQuery( addCarouselEvents );
    // Trigger to refresh in live-builder.
    jQuery( 'body' ).on( 'fusion-element-render-fusion_news_ticker', initializeAllCarousels );

    function initializeAllCarousels() {
        var carouselLists = jQuery( document ).find( '.awb-news-ticker-carousel' );

        carouselLists.each( function( index, elem ) {
            var carouselElem = jQuery( elem ),
                oldCarousel = carouselElem.data( 'awb_news_ticker_carousel' ),
                Carousel;

            if ( oldCarousel ) {
                oldCarousel.initializeOrRefresh();
                return;
            }

            Carousel = new NewsTickerCarousel( carouselElem );
            Carousel.initializeOrRefresh();
        } );
    }

    function addCarouselEvents() {
        jQuery( document ).on( 'click', '.awb-news-ticker-next-btn', function() {
            var newsTickerElem = jQuery( this ).closest( '.awb-news-ticker' ).data( 'awb_news_ticker_carousel' );
            if ( newsTickerElem ) {
                newsTickerElem.showNextItem();
            }
        } );
        jQuery( document ).on( 'click', '.awb-news-ticker-prev-btn', function() {
            var newsTickerElem = jQuery( this ).closest( '.awb-news-ticker' ).data( 'awb_news_ticker_carousel' );
            if ( newsTickerElem ) {
                newsTickerElem.showPrevItem();
            }
        } );

        jQuery( document ).on( 'mouseenter', '.awb-news-ticker-carousel', function() {
            var newsTickerElem = jQuery( this ).data( 'awb_news_ticker_carousel' );
            if ( newsTickerElem ) {
                newsTickerElem.pauseCarousel();
            }
        } );

        jQuery( document ).on( 'mouseleave', '.awb-news-ticker-carousel', function() {
            var newsTickerElem = jQuery( this ).data( 'awb_news_ticker_carousel' );
            if ( newsTickerElem ) {
                newsTickerElem.continueCarousel();
            }
        } );

        jQuery( document ).on( 'focusin', '.awb-news-ticker-carousel', function() {
            var newsTickerElem = jQuery( this ).data( 'awb_news_ticker_carousel' );
            if ( newsTickerElem ) {
                newsTickerElem.pauseCarousel();
            }
        } );

        jQuery( document ).on( 'focusout', '.awb-news-ticker-carousel', function() {
            var newsTickerElem = jQuery( this ).data( 'awb_news_ticker_carousel' );
            if ( newsTickerElem ) {
                newsTickerElem.continueCarousel();
            }
        } );
    }

    // This is used/acting like a class.
    function NewsTickerCarousel( wrapper ) {
        var self = this,
            itemsWrapper,
            currentShowing,
            indicator,
            displayTime,
            timeout, // setTimeout object.
            carouselStartTime = 0,
            remainingTimeoutTime = 0;

        this.initializeOrRefresh = function() {
            var oldDisplayTime = displayTime,
                isRefresh = ( displayTime !== undefined ? true : false ),
                needsTimeRefresh,
                needsIndicatorRefresh;

            itemsWrapper = wrapper.find( '.awb-news-ticker-item-list-carousel' );
            currentShowing = wrapper.find( '.awb-news-ticker-item-active' );
            indicator = wrapper.find( '.awb-news-ticker-carousel-indicator' );
            displayTime = parseFloat( itemsWrapper.attr( 'data-awb-news-ticker-display-time' ) );

            wrapper.data( 'awb_news_ticker_carousel', self );

            needsIndicatorRefresh = ( 'none' === indicator.css( 'animation-name' ) ? true : false );
            needsTimeRefresh = ( isRefresh && oldDisplayTime !== displayTime );
            if ( ! isRefresh || needsTimeRefresh || needsIndicatorRefresh ) {
                if ( timeout ) {
                    clearTimeout( timeout );
                }
                self.startTimeout();
            }
        };

        this.startTimeout = function() {
            timeout = setTimeout( this.showNextItem, 1000 * displayTime );
            carouselStartTime    = Date.now();
            remainingTimeoutTime = 1000 * displayTime;

            this.refreshIndicator();
        };

        this.restartTimeout = function() {
            if ( timeout ) {
                clearTimeout( timeout );
            }
            this.startTimeout();
        };

        this.pauseCarousel = function() {
            indicator.css( 'animation-play-state', 'paused' );

            if ( timeout ) {
                clearTimeout( timeout );
            }

            remainingTimeoutTime -= Date.now() - carouselStartTime;
        };

        this.continueCarousel = function() {
            indicator.css( 'animation-play-state', 'running' );
            carouselStartTime = Date.now();

            // Additionally clear the timeout, just for safety.
            if ( timeout ) {
                clearTimeout( timeout );
            }

            timeout = setTimeout( this.showNextItem, remainingTimeoutTime );
        };

        this.showNextItem = function() {
            var nextToShow;
            nextToShow = currentShowing.next();
            if ( 0 === nextToShow.length ) {
                nextToShow = currentShowing.parent().children().first();
            }

            self.showItem( nextToShow );
            self.restartTimeout();
        };

        this.showPrevItem = function() {
            var nextToShow;

            nextToShow = currentShowing.prev();
            if ( 0 === nextToShow.length ) {
                nextToShow = currentShowing.parent().children().last();
            }

            self.showItem( nextToShow );
            self.restartTimeout();
        };

        this.showItem = function( next ) {
            var prevItem;

            currentShowing.addClass( 'awb-news-ticker-item-hides' );
            next.addClass( 'awb-news-ticker-item-showing' );

            currentShowing.removeClass( 'awb-news-ticker-item-active' );
            next.addClass( 'awb-news-ticker-item-active' );

            prevItem = jQuery( currentShowing );
            setTimeout( function() {
                prevItem.removeClass( 'awb-news-ticker-item-hides' );
                next.removeClass( 'awb-news-ticker-item-showing' );
            }, 500 );

            currentShowing = next;
        };

        this.refreshIndicator = function() {
            indicator.css( 'animation-name', '' );
            indicator.offset(); // force redraw.
            indicator.css( 'animation-name', 'awb-news-ticker-indicator' );
        };
    }

}( jQuery ) );
