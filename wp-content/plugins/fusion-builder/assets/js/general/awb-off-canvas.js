/* global Vimeo */
( function( jQuery ) {
	'use strict';

    window.awb_oc_timeouts = {};

    window.awbOffCanvas = {

        /**
         * Timeouts object.
         *
         * @since 3.8
         */
        timeouts: {},

        /**
         * Transform first letter to uppercase.
         *
         * @since 3.6
         * @param {String} string the string to capitalize.
         * @return {String}
         */
         capitalize: function ( string ) {
            return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
         },

        /**
         * Set off canvas data to local storage.
         *
         * @since 3.6
         * @param {String} id Off Canvas id.
         * @param {String} key the data key.
         * @param {String} value the value.
         * @return {avoid}
         */
         set: function ( id, key, value ) {
            id = id ? '_' + id : '_data';
            let storage = localStorage.getItem( 'off_canvas' + id );
            storage = storage ? JSON.parse( storage ) : {};
            storage[ key ] = value;

            localStorage.setItem( 'off_canvas' + id, JSON.stringify( storage ) );
        },

        /**
         * get off canvas data from local storage.
         *
         * @since 3.6
         * @param {String} id Off Canvas id.
         * @param {String} key the data key.
         * @return {String}
         */
        get: function( id, key ) {
            id = id ? '_' + id : '_data';
            let storage = localStorage.getItem( 'off_canvas' + id );
            storage = storage ? JSON.parse( storage ) : {};
            return storage[ key ] || '';
        },
        animationsWithoutDirection: [ 'flash', 'rubberBand', 'shake', 'flipinx', 'flipiny', 'lightspeedin', 'flipOutX', 'flipOutY', 'lightSpeedOut' ],

        /**
         * Open Off Canvas.
         *
         * @since 3.6
         * @param {String} id Off Canvas id.
         * @param {Boolean} setCount if true it will increase the opens count in local storage.
         * @param {Boolean} toggle Behave like toggle not just open.
         * @return {avoid}
         */
        open_off_canvas: function( id, setCount = true, toggle = false ) {
            const   wrap = jQuery( '.awb-off-canvas-wrap[data-id="' + id + '"]' ),
                    offCanvas = wrap.find( '.awb-off-canvas' ),
                    options = window[ 'off_canvas_' + id ],
                    self = this;

                // Early exit if wrap not exist.
                if ( !wrap.length ) {
                    return;
                }

                // If opened and toggle set true close it.
                if ( wrap.hasClass( 'awb-show' ) && toggle ) {
                    this.close_off_canvas( id );
                    return;
                }

                // Set last open date
                this.set( id, 'last_open_date', new Date() );

                // If opened and not toggle dont do anything.
                if ( wrap.hasClass( 'awb-show' ) && !toggle ) {
                    return;
                }

            let     animation = options.enter_animation;
            const   animationDirection = options.enter_animation_direction && 'static' !== options.enter_animation_direction ? this.capitalize( options.enter_animation_direction ) : '',
                    animationSpeed = options.enter_animation_speed || 1;

            // Disable animation if CSS animations are disabled in global options.
            if ( 'off' === options.status_css_animations || ( 'desktop' === options.status_css_animations && options.is_mobile ) ) {
                animation = false;
            }
            if ( animation ) {
                if ( ! this.animationsWithoutDirection.includes( animation ) ) {
                    animation = animation + 'In' + animationDirection;
                }
                offCanvas.addClass( 'fusion-animated ' + animation );
                offCanvas.attr( 'data-animation-type', animation );
                offCanvas.css( {
                    'visibility': 'visible',
                    'animation-duration': animationSpeed + 's'
                } );

                if ( 'sliding-bar' === options.type && 'push' === options.transition && ( 'left' === options.position || 'right' === options.position ) ) {
                    const pushCss = { 'transition': 'margin-inline-start ' + options.enter_animation_speed + 's' };
                    const isRTL = jQuery( 'body' ).hasClass( 'rtl' );

                    if ( isRTL ) {
                        pushCss.marginInlineStart = '-' + offCanvas.outerWidth() + 'px';
                        if ( 'right' === options.position ) {
                            pushCss.marginInlineStart = offCanvas.outerWidth() + 'px';
                        }
                    } else {
                        pushCss.marginInlineStart = offCanvas.outerWidth() + 'px';
                        if ( 'right' === options.position ) {
                            pushCss.marginInlineStart = '-' + offCanvas.outerWidth() + 'px';
                        }
                    }
                    let pushedEl = '#wrapper';

                    // Change pushed element selector when loading from studio.
                    if ( wrap.hasClass( 'init-for-studio' ) ) {
                        pushedEl = '.post-preview';
                    }
                    jQuery( pushedEl ).css( pushCss );

                    // Parallax Avada Slider.
                    if ( jQuery( '#sliders-container .tfs-slider[data-parallax="1"]' ).length ) {
                        jQuery( '#sliders-container .tfs-slider[data-parallax="1"]' ).css( pushCss );
                    }
                }
            } else {

                // Enable focus trap immediately if no animation.
                this.enableTrapFocus( wrap );
            }

            // Disable scrollbar.
            if ( 'yes' === options.overlay && 'no' === options.overlay_page_scrollbar ) {
                jQuery( 'html' ).css( 'overflow', 'hidden' );
            }
            wrap.addClass( 'awb-show' );

            // Add active class for toggle links.
            jQuery( 'a[href^="#awb-oc__' + id + '"]' ).addClass( 'awb-oc-active' );

            // Count how many visitor open this off canvas.
            if ( setCount ) {
                const count = this.get( id, 'open_count' ) || 0;
                this.set( id, 'open_count', count + 1 );
            }

            // Auto close after time.
            const AutoCloseTime = parseInt( options.auto_close_after_time );
            if (  AutoCloseTime ) {
                window.awb_oc_timeouts[ 'close_after_time_' + id ] = setTimeout( () => {
                    self.close_off_canvas( id );
                }, AutoCloseTime * 1000 );
            }

            // Show close button after time.
            const showCloseButtonTime = parseInt( options.show_close_button_after_time );
            if (  showCloseButtonTime ) {
                window.awb_oc_timeouts[ 'show_close_button_' + id ] = setTimeout( () => {
                    offCanvas.children( '.off-canvas-close' ).removeClass( 'hidden' );
                }, showCloseButtonTime * 1000 );
            }

			wrap.trigger( jQuery.Event( 'awb-oc-opened' ), [ id ] );
        },

        /**
         * close Off Canvas.
         *
         * @since 3.6
         * @param {String} id Off Canvas id.
         * @param {Boolean} setCount if true it will increase the opens count in local storage.
         * @return {avoid}
         */
        close_off_canvas: function( id, setCount = true ) {
            const   wrap = jQuery( '.awb-off-canvas-wrap[data-id="' + id + '"]' ),
                    offCanvas = wrap.find( '.awb-off-canvas' ),
                    options = window[ 'off_canvas_' + id ];

            // Early exit if Off Canvas' markup doesn't exist.
            if ( 0 === wrap.length || 'undefined' === typeof options ) {
                return;
            }

            let   animation = options.exit_animation;
            const animationDirection = options.exit_animation_direction && 'static' !== options.exit_animation_direction ? this.capitalize( options.exit_animation_direction ) : '',
            animationSpeed = options.exit_animation_speed || 1;

            // Disable animation if CSS animations are disabled in global options.
            if ( 'off' === options.status_css_animations || ( 'desktop' === options.status_css_animations && options.is_mobile ) ) {
                animation = false;
            }


            if ( animation ) {
                if ( ! this.animationsWithoutDirection.includes( animation ) ) {
                    animation = animation + 'Out' + animationDirection;
                }
                offCanvas.addClass( 'fusion-animated ' + animation );
                offCanvas.attr( 'data-animation-type', animation );
                offCanvas.addClass( 'is-closing' );
                offCanvas.css( 'animation-duration', animationSpeed + 's' );
                if ( 'sliding-bar' === options.type && 'push' === options.transition && ( 'left' === options.position || 'right' === options.position ) ) {
                    const pushCss = { 'transition': 'margin-inline-start ' + options.exit_animation_speed + 's', marginInlineStart: 0 };
                    let pushedEl = '#wrapper';
                    // Change pushed element selector when loading from studio.
                    if ( wrap.hasClass( 'init-for-studio' ) ) {
                        pushedEl = '.post-preview';
                    }
                    jQuery( pushedEl ).css( pushCss );

                    // Parallax Avada Slider.
                    if ( jQuery( '#sliders-container .tfs-slider[data-parallax="1"]' ).length ) {
                        jQuery( '#sliders-container .tfs-slider[data-parallax="1"]' ).css( pushCss );
                    }
                }
            } else {

                // Add closing class if have overlay and not have animation.
                if ( 'yes' === options.overlay && wrap.hasClass( 'init-for-studio' ) ) {
                    offCanvas.addClass( 'is-closing' );
                }

                // Go back after closing for studio if no exit animation and no overly.
                if ( 'no' === options.overlay && wrap.hasClass( 'init-for-studio' ) ) {
                    jQuery( '#icon-bar .go-back' ).click();
                }
                wrap.removeClass( 'awb-show' );
            }

            // Remove active class from toggle links.
            jQuery( 'a[href^="#awb-oc__' + id + '"]' ).removeClass( 'awb-oc-active' );

            // Revert disable scrollbar.
            if ( 'yes' === options.overlay && 'no' === options.overlay_page_scrollbar ) {
                jQuery( 'html' ).css( 'overflow', '' );
            }

            // Remove the hash on close.
            setTimeout( () => {
                this.removeHash();
            }, 10 );

            if ( setCount ) {
                const count = this.get( id, 'close_count' ) || 0;
                this.set( id, 'close_count', count + 1 );
            }
            this.set( id, 'closed', true );

            // clear timeouts.
            clearTimeout( window.awb_oc_timeouts[ 'close_after_time_' + id ] );
            clearTimeout( window.awb_oc_timeouts[ 'show_close_button_' + id ] );

            // reset close button if "Show close button after time" used.
            const showCloseButtonTime = parseInt( options.show_close_button_after_time );
            if (  showCloseButtonTime ) {
                offCanvas.children( '.off-canvas-close' ).addClass( 'hidden' );
            }

			wrap.trigger( jQuery.Event( 'awb-oc-closed' ), [ id ] );
        },

        /**
         * Remove hash from the link.
         *
         * @since 3.6
         * @return {avoid}
         */
        removeHash() {
            const path = window.location.href.split( '#' )[ 0 ];
            history.replaceState( {}, '', path );
        },

        /**
         * Remove hash from the link.
         *
         * @since 3.6
         * @return {avoid}
         */
        enableTrapFocus( wrap ) {

            // Enable trap for Popups only.
            if ( !wrap.hasClass( 'type-popup' ) ) {
                return;
            }

            const element = wrap.find( '.awb-off-canvas' );
            // Select focusable elements that is visible.
            const focusableEls = element.find( 'a[href]:not([disabled]):visible, button:not([disabled]):visible, textarea:not([disabled]):visible, input[type="text"]:not([disabled]):visible, input[type="radio"]:not([disabled]):visible, input[type="checkbox"]:not([disabled]):visible, select:not([disabled]):visible' ),
                firstFocusableEl = focusableEls[ 0 ],
                lastFocusableEl = focusableEls[ focusableEls.length - 1 ],
                KEYCODE_TAB = 9;

            // Move focus from the page to the element. Timeout used to fix on page load trigger.
            setTimeout( () => {
                element[ 0 ].focus();
            }, 100 );

            // Listen to Tab and Shift+Tab to move between next and previous focusable elements inside the current element only.
            element[ 0 ].addEventListener( 'keydown', function( e ) {
                const isTabPressed = ( 'Tab' === e.key || e.keyCode === KEYCODE_TAB );

                if ( !isTabPressed ) {
                return;
                }

              if ( e.shiftKey ) /* shift + tab */ {
                if ( document.activeElement === firstFocusableEl ) {
                    lastFocusableEl.focus();
                    e.preventDefault();
                }
                } else /* tab */ if ( document.activeElement === lastFocusableEl ) {
                    firstFocusableEl.focus();
                    e.preventDefault();
                }
            } );
        }
    };

    //remove off Canvas animation
    jQuery( '.awb-off-canvas' ).on( 'animationend', function( event ) { // eslint-disable-line no-unused-vars
        const   el = jQuery( this ),
                wrap = el.parent();
        if ( el.attr( 'data-animation-type' ) ) {
            el.removeClass( 'fusion-animated' ).removeClass( el.attr( 'data-animation-type' ) ).removeAttr( 'data-animation-type' );

        }
        if ( el.hasClass( 'is-closing' ) ) {
            el.removeClass( 'is-closing' );
            el.addClass( 'oc-waiting-for-close' );
            wrap.removeClass( 'awb-show' );

            // Go back after closing for studio.
            if ( wrap.hasClass( 'init-for-studio' ) ) {
                jQuery( '#icon-bar .go-back' ).click();
            }
        } else {
            // if is open start focus trap after animation end.
            window.awbOffCanvas.enableTrapFocus( wrap );
        }

    } );

    //remove off Canvas after transition
    jQuery( '.awb-off-canvas-wrap' ).on( 'transitionend', function( event ) { // eslint-disable-line no-unused-vars
        const   oc = jQuery( this ).find( '.awb-off-canvas' );
        // Go back after closing for studio.
        if ( oc.hasClass( 'is-closing' ) && jQuery( this ).hasClass( 'init-for-studio' ) ) {
            jQuery( '#icon-bar .go-back' ).click();
            oc.removeClass( 'is-closing' );
        }
        oc.removeClass( 'oc-waiting-for-close' );
    } );

    // Open with hash.
    jQuery( window ).on( 'load', function () {
        if ( ( location.hash && location.hash.startsWith( '#awb-oc__' ) ) || ( location.hash && location.hash.startsWith( '#awb-open-oc__' ) ) ) {
            const id = location.hash.split( '__' )[ 1 ];
            window.awbOffCanvas.open_off_canvas( id, false, false );
        }
        // Open with class, for now it used for studio only.
        jQuery( '.awb-off-canvas-wrap.init-for-studio' ).each( function ( idx, el ) { // eslint-disable-line no-unused-vars
            const id = jQuery( el ).data( 'id' );
                window.awbOffCanvas.open_off_canvas( id, false, false );
        } );

        jQuery( '.awb-off-canvas-wrap' ).each( function() {
            jQuery( this ).on( 'awb-oc-closed', function() {
                // Youtube.
                jQuery( this ).find( '.fusion-youtube iframe' ).each( function() {
                    var func = 'pauseVideo';
                    this.contentWindow.postMessage( '{"event":"command","func":"' + func + '","args":""}', '*' );
                } );

                // Vimeo.
                jQuery( this ).find( '.fusion-vimeo iframe' ).each( function() {
                    new Vimeo.Player( this ).pause();
                } );

                // Self-hosted videos.
                jQuery( this ).find( 'video' ).each( function() {
                    jQuery( this ).get( 0 ).pause();
                } );

                // Audio.
                jQuery( this ).find( '.mejs-audio' ).each( function() {
                    jQuery( this ).find( '.mejs-playpause-button.mejs-pause button' ).trigger( 'click' );
                } );
            } );
        } );
    } );
    //toggle with link href.
    jQuery( 'a[href^="#awb-oc__"]' ).on( 'click', function( event ) {
        event.preventDefault();

        const href = jQuery( this ).attr( 'href' ) || '',
              id   = href.split( '__' )[ 1 ];

        window.awbOffCanvas.open_off_canvas( id, false, true );
    } );

    //Open with link href.
    jQuery( 'a[href^="#awb-open-oc__"]' ).on( 'click', function( event ) {
        event.preventDefault();
        const   href = jQuery( this ).attr( 'href' ) || '',
        id = href.split( '__' )[ 1 ];
        window.awbOffCanvas.open_off_canvas( id, false, false );
    } );

    //close off canvas.
    jQuery( 'a[href^="#awb-close-oc__"]' ).on( 'click', function( event ) {
        event.preventDefault();

        const   href = jQuery( this ).attr( 'href' ) || '',
                id = href.split( '__' )[ 1 ];
                if ( id ) {
                    window.awbOffCanvas.close_off_canvas( id );
                } else {
                    jQuery( '.awb-off-canvas-wrap.awb-show' ).each( function() {
                        const ocId = jQuery( this ).data( 'id' );
                        window.awbOffCanvas.close_off_canvas( ocId );
                    } );
                }
                window.awbOffCanvas.removeHash();
    } );

    // Close Off Canvas when click on the overlay.
    jQuery( '.awb-off-canvas-wrap:not(.overlay-disable-close)' ).on( 'click', function( event ) {
        if ( event.target === this ) {
            const id = jQuery( this ).data( 'id' );
            window.awbOffCanvas.close_off_canvas( id );
        }
    } );

    // Close Off Canvas when clicking on an anchor link inside an off canvas set to close on such link clicks.
    jQuery( '.close-on-anchor a' ).on( 'click', function() {
        const href = jQuery( this ).attr( 'href' ) || '';
        if ( href.includes( '#' ) ) {
            const id = jQuery( this ).closest( '.awb-off-canvas-wrap' ).data( 'id' );
            window.awbOffCanvas.close_off_canvas( id );
        }
    } );

    // Close with close button.
    jQuery( '.off-canvas-close' ).on( 'click', function( event ) {
        event.preventDefault();
        const id = jQuery( this ).closest( '.awb-off-canvas-wrap' ).data( 'id' );
        window.awbOffCanvas.close_off_canvas( id );
    } );

    // Close with esc key.
    jQuery( document ).on( 'keydown', function( event ) {
        if ( 27 !== event.keyCode ) {
            return;
        }


        const offCanvas = jQuery( '.awb-off-canvas-wrap.awb-show:not(.disable-close-on-esc)' );
        offCanvas.each( function( idx, el ) { // eslint-disable-line no-unused-vars
            const id = jQuery( el ).data( 'id' );
            window.awbOffCanvas.close_off_canvas( id );
        } );

    } );

        // Pause auto close timer on hover.
        jQuery( '.awb-off-canvas' ).on( 'mouseover', function() {
            const id = jQuery( this ).closest( '.awb-off-canvas-wrap' ).data( 'id' );
            const options = window[ 'off_canvas_' + id ];
            const AutoCloseTime = parseInt( options.auto_close_after_time );

            if (  AutoCloseTime ) {
                if ( window.awb_oc_timeouts[ 'close_after_time_' + id ] ) {
                    clearTimeout( window.awb_oc_timeouts[ 'close_after_time_' + id ] );
                }
            }
        } );

        // start auto close timer when leave.
        jQuery( '.awb-off-canvas' ).on( 'mouseleave', function() {
            const id = jQuery( this ).closest( '.awb-off-canvas-wrap' ).data( 'id' );
            const options = window[ 'off_canvas_' + id ];
            const AutoCloseTime = parseInt( options.auto_close_after_time );

            if (  AutoCloseTime ) {
                if ( window.awb_oc_timeouts[ 'close_after_time_' + id ] ) {
                        window.awb_oc_timeouts[ 'close_after_time_' + id ] = setTimeout( () => {
                            window.awbOffCanvas.close_off_canvas( id );
                        }, AutoCloseTime * 1000 );
                    }
            }
        } );

    // listen to studio events.
    jQuery( 'body' ).on( 'goback', function( event ) { // eslint-disable-line no-unused-vars
        // remove pushed effect.
        jQuery( '.post-preview' ).css( {
            'margin-right': 0,
            'margin-left': 0
        } );
    } );

    /**
     * Triggers and rules.
     */
    jQuery( '.awb-off-canvas-wrap' ).each( function ( idx, el ) { // eslint-disable-line no-unused-vars
        const id = jQuery( el ).data( 'id' );
        const options = window[ 'off_canvas_' + id ];

        // Fix admin bar with full height.
        const adminBar = jQuery( '#wpadminbar' );
        const adminBarHeight = adminBar.outerHeight();
        if ( 'full' === options.height && adminBar.length ) {
            jQuery( el ).find( '.awb-off-canvas' ).css( 'height', `calc(100vh - ${adminBarHeight}px)` );
        }
        if ( 'sliding-bar' === options.type && 'top' === options.position && adminBar.length ) {
            jQuery( el ).find( '.awb-off-canvas' ).css( 'margin-top', `${adminBarHeight}px` );
        }

        // Move on click trigger to top, Always open when click on the trigger.
        if ( 'yes' === options.on_click ) {
            const element = options.on_click_element ? jQuery( options.on_click_element ) : null;
            if ( element && element.length ) {
                element.attr( 'data-off-canvas', options.on_click_element );

                jQuery( document ).on( 'click', options.on_click_element, function( e ) {
                    e.preventDefault();
                    window.awbOffCanvas.open_off_canvas( id, false );
                } );
            }
        }

        // On Ajax add to cart, regardless the JS rules.
        if ( 'yes' === options.on_add_to_cart ) {
            jQuery( document ).on( 'added_to_cart', function() {
                window.awbOffCanvas.open_off_canvas( id );
            } );
        }

        /**
         * Rules.
         * Rules before triggers to stop triggers if the rules aren't met.
         */
        let StopTriggers = false; // If true triggers will not work.

        // Frequency.
        if ( options.frequency ) {
            // every time until close.
            if ( 'close' === options.frequency ) {
                const is_closed = window.awbOffCanvas.get( id, 'closed' );
                if ( true === is_closed ) {
                    StopTriggers = true;
                }
            }
            // Show once.
            if ( 'once' === options.frequency ) {
                const openCount = window.awbOffCanvas.get( id, 'open_count' );
                if ( 0 < openCount ) {
                    StopTriggers = true;
                }
            }

            // Show x times.
            if ( 'xtimes' === options.frequency && options.frequency_xtimes ) {
                const openCount = window.awbOffCanvas.get( id, 'open_count' );
                const times = parseInt( options.frequency_xtimes );
                if ( times <= openCount ) {
                    StopTriggers = true;
                }
            }

            // Show every session.
            if ( 'session' === options.frequency ) {
                const isOpened = sessionStorage.getItem( 'off_canvas_' + id + '_opened' );
                if ( isOpened ) {
                    StopTriggers = true;
                } else {
                    sessionStorage.setItem( 'off_canvas_' + id + '_opened', true );
                }
            }

            /**
             * Dates.
             * */
            let lastOpenDate = window.awbOffCanvas.get( id, 'last_open_date' );
            const now = new Date(); // Change let to const after debugging.

            // Show every day.
            if ( 'day' === options.frequency ) {
                if ( lastOpenDate ) {
                    lastOpenDate = new Date( lastOpenDate );
                    const addOneDay = lastOpenDate.getTime() + ( 1 * 24 * 60 * 60 * 1000 );
                    if ( now < addOneDay ) {
                        StopTriggers = true;
                    }
                }
            }

            // Show every week.
            if ( 'week' === options.frequency ) {
                if ( lastOpenDate ) {
                    lastOpenDate = new Date( lastOpenDate );
                    const addOneWeek = lastOpenDate.getTime() + ( 7 * 24 * 60 * 60 * 1000 );
                    if ( now < addOneWeek ) {
                        StopTriggers = true;
                    }
                }
            }

            // Show every month.
            if ( 'month' === options.frequency ) {
                if ( lastOpenDate ) {
                    lastOpenDate = new Date( lastOpenDate );
                    const addOneMonth = new Date( lastOpenDate ).setMonth( lastOpenDate.getMonth() + 1 );
                    if ( now < addOneMonth ) {
                        StopTriggers = true;
                    }
                }
            }
            // Show every x days.
            if ( 'xdays' === options.frequency && options.frequency_xdays ) {
                if ( lastOpenDate ) {
                    lastOpenDate = new Date( lastOpenDate );
                    const days = parseInt( options.frequency_xdays );
                    const addxDays = lastOpenDate.getTime() + ( days * 24 * 60 * 60 * 1000 );
                    if ( now < addxDays ) {
                        StopTriggers = true;
                    }
                }
            }
        }


        // Page views.
        if ( 'yes' === options.after_x_page_views ) {
            // Start count page views now.
            const views = window.awbOffCanvas.get( id, 'page_views' ) || 0;
            if ( views < parseInt( options.number_of_page_views ) ) {
                StopTriggers = true;
            }
            window.awbOffCanvas.set( id, 'page_views', views + 1 );
        }

        // Sessions.
        if ( 'yes' === options.after_x_sessions ) {
            const isSameSession = sessionStorage.getItem( 'off_canvas_' + id );
            let sessions;
            if ( !isSameSession ) {
                sessionStorage.setItem( 'off_canvas_' + id, true );
                sessions = window.awbOffCanvas.get( id, 'sessions' ) || 0;
                window.awbOffCanvas.set( id, 'sessions', sessions + 1 );
            }
            sessions = window.awbOffCanvas.get( id, 'sessions' );
            if ( sessions <= parseInt( options.number_of_sessions ) ) {
                StopTriggers = true;
            }

        }

        // Arriving from.
        if ( options.when_arriving_from ) {
            const   referrer = document.referrer,
                    location = window.location.host,
                    from     = options.when_arriving_from;
            let     current;

            if ( !referrer || referrer.includes( location ) ) {
                current = 'internal';
            } else {
                current = 'external';
                if ( ( /\.?(google|bing|yahoo|duckduckbot|yandex|baidu|msn|teoma|slurp)\./ ).test( referrer ) ) {
                    current = 'search';
                }
            }
            StopTriggers = !from.includes( current );
        }


        // If opened opens and stop triggers except on click.
        if ( 'opened' === options.off_canvas_state && 'sliding-bar' === options.type && options.has_js_rules && !StopTriggers ) {
            jQuery( window ).on( 'load', function() {
                window.awbOffCanvas.open_off_canvas( id );
            } );
            StopTriggers = true;
        }

        //stop triggers if Off Canvas already opens.
        if ( true === options.isOpened ) {
            StopTriggers = true;
        }
        if ( StopTriggers ) {
            // Stop execution if rules not met.
            return;
        }

        /**
         * Triggers except on click.
         */
        // On page load.
        if ( 'yes' === options.on_page_load ) {
            setTimeout( () => {
                window.awbOffCanvas.open_off_canvas( id );
                options.isOpened = true;
            }, 100 );
        }

        // Time on page.
        if ( 'yes' === options.time_on_page && options.time_on_page_duration ) {
            setTimeout( () => {
                window.awbOffCanvas.open_off_canvas( id );
                options.isOpened = true;
            }, options.time_on_page_duration * 1000 );
        }

        // On Scroll.
        if ( 'yes' === options.on_scroll ) {
            const   scrollDirection = options.scroll_direction,
                    scrollTo = options.scroll_to,
                    docHeight = document.documentElement.scrollHeight;

            let     scrollPos = options.scroll_position;

            if ( scrollPos && isNaN( scrollPos ) ) {
                if ( scrollPos.includes( '%' ) ) {
                    scrollPos = ( docHeight / 100 ) * parseInt( scrollPos );
                } else {
                    scrollPos = parseInt( scrollPos );
                }
            }

            if ( 'down' === scrollDirection && 'element' === scrollTo ) {
                const element = options.scroll_element ? document.querySelector( options.scroll_element ) : null;
                if ( element ) {
                    const observer = new IntersectionObserver( ( entries ) => {
                        entries.forEach( ( entry ) => {
                        if ( entry.isIntersecting ) {
                            window.awbOffCanvas.open_off_canvas( id );
                            options.isOpened = true;
                            observer.unobserve( entry.target );
                        }
                        } );
                    } );
                    observer.observe( element );
                }
            } else {
                jQuery( window ).on( 'scroll', function( event ) { // eslint-disable-line no-unused-vars
                    if ( 'up' === options.scroll_direction ) {
                        if ( this.oldScroll > this.scrollY ) {
                            if ( !options.isOpened ) {
                                window.awbOffCanvas.open_off_canvas( id );
                            }
                            options.isOpened = true;
                        }
                    }
                    if ( 'down' === options.scroll_direction ) {
                        if ( this.oldScroll < this.scrollY && this.scrollY >= scrollPos ) {
                            if ( !options.isOpened ) {
                                window.awbOffCanvas.open_off_canvas( id );
                            }
                            options.isOpened = true;
                        }
                    }

                    this.oldScroll = this.scrollY;
                } );
            }
        }

        // Exit Intent.
        if ( 'yes' === options.exit_intent ) {
            const exitIntent = function ( event ) {

                if ( null == event.relatedTarget &&
                'select' !== event.target.nodeName.toLowerCase() ) {
                    window.awbOffCanvas.open_off_canvas( id );
                    document.removeEventListener( 'mouseout', exitIntent );
                    options.isOpened = true;
                }
            };

            document.addEventListener( 'mouseout', exitIntent );
        }

        // After Inactivity.
        if ( 'yes' === options.after_inactivity && options.inactivity_duration ) {
            const inactiveDuration = options.inactivity_duration;
            let timeoutId;

            const InactivityTimer = function () {
                timeoutId = window.setTimeout( applyInactivityActions, inactiveDuration * 1000 );
            };

            const applyInactivityActions = function () {
                if ( !options.isOpened ) {
                    window.awbOffCanvas.open_off_canvas( id );
                }
                options.isOpened = true;
            };

            const setupTimers = function () {
                document.addEventListener( 'mousemove', resetTimer, false );
                document.addEventListener( 'mousedown', resetTimer, false );
                document.addEventListener( 'keypress', resetTimer, false );
                document.addEventListener( 'touchmove', resetTimer, false );
                document.addEventListener( 'scroll', resetTimer, false );
                InactivityTimer();
            };

            const resetTimer = function() {
            window.clearTimeout( timeoutId );
            InactivityTimer();
            };

            setupTimers();
        }

    } );

}( jQuery ) );
