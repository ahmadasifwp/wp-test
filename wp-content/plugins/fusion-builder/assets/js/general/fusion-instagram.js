( function( jQuery ) {
	'use strict';

    // Get Instagram posts automatically if has loading class.
    jQuery( '.awb-instagram-element' ).each(  function() {
        const counter       = this.dataset.counter;
        window[ `igRequest-${counter}` ] = null;

        getInstagramPosts( this );
    } );

    function isoTopeInit( el, child ) {
        jQuery( el ).isotope( {
            layoutMode: 'packery',
            itemSelector: child,
            isOriginLeft: jQuery( 'body.rtl' ).length ? false : true,
            resizable: true,
            initLayout: true
        } );
    }
    function getInstagramPosts( el, url, more, live ) {
        const counter       = el.dataset.counter;

        live = live || jQuery( el ).parents( '.fusion-builder-live-element' ).length;

        if ( window[ `igRequest-${counter}` ] ) {
            window[ `igRequest-${counter}` ].abort();
        }

        const limit       = el.dataset.limit,
              linkType    = el.dataset.link_type,
              linkTarget  = el.dataset.link_target,
              page = el.dataset.page || 1,
              postsContainer = el.querySelector( '.instagram-posts' ),
              moreBtn = el.querySelector( '.awb-instagram-load-more-btn' ),
              infiniteScrollHandle = el.querySelector( '.awb-instagram-infinite-scroll-handle' ),
              loadingContainer = el.querySelector( '.instagram-posts-loading-container' ),
              isMasonry = jQuery( el ).hasClass( 'layout-masonry' );

        if ( more ) {
            jQuery( loadingContainer ).show();
        }

        if ( ( !live || ( live && !window.fusionInstagramItems ) ) && ( jQuery( el ).hasClass( 'loading' ) || more ) ) {
            window[ `igRequest-${counter}` ] = jQuery.ajax( {
                type: 'POST',
                url: window.fusionInstagramVars.ajax_url,
                data: {
                    action: 'awb_instagram_get_data',
                    nonce: window.fusionInstagramVars.nonce,
                    limit,
                    page,
                    next: url || '',
                    args: {
                        layout: jQuery( el ).hasClass( 'layout-masonry' ) ? 'masonry' : 'grid',
                        link_type: linkType || '',
                        link_target: linkTarget || ''
                    },
                    counter
                },
                dataType: 'json',
                success: function( rsp ) {
                    let html = rsp.html;
                    if ( more ) {
                        html = jQuery( html );
                        jQuery( postsContainer ).append( html );

                        if ( isMasonry ) {
                            jQuery( postsContainer ).isotope( 'appended', html );
                        }

                    } else {
                        postsContainer.innerHTML = html;
                    }

                    // For live editor.
                    if ( live && !window.fusionInstagramItems ) {
                        window.fusionInstagramItems = html;
                    }

                    // Lightbox and masonry.
                    handle_js( el, live );

                    // set the next page param.
                    el.dataset.page = parseInt( page ) + 1;

                    // Add next url to more button.
                    if ( moreBtn ) {
                        if ( rsp.data && rsp.data.paging && rsp.data.paging.cursors && ( rsp.data.paging.cursors.after && rsp.data.paging.next ) ) {
                            moreBtn.dataset.url = rsp.data.paging.cursors.after;
                        } else {
                            delete moreBtn.dataset.url;
                        }
                    }

                    // Add next url to infinite scroll handle.
                    if ( infiniteScrollHandle ) {
                        if ( rsp.data && rsp.data.paging && rsp.data.paging.cursors && ( rsp.data.paging.cursors.after && rsp.data.paging.next ) ) {
                            infiniteScrollHandle.dataset.url = rsp.data.paging.cursors.after;
                        } else {
                            delete infiniteScrollHandle.dataset.url;
                        }
                    }

                    // Remove loading class.
                    el.classList.remove( 'loading' );

                    // Hide loading container.
                    if ( more ) {
                        jQuery( loadingContainer ).hide();
                    }
                }
            } );
        }

        if ( live ) {
            el.classList.remove( 'loading' );
        }

        // Initial loading if posts cached.
        if ( ! jQuery( el ).hasClass( 'loading' ) && !more ) {
            handle_js( el, live );
        }

    }

    // Handle js.
    function handle_js( el, live ) {
        const counter       = el.dataset.counter,
              linkType    = el.dataset.link_type,
              postsContainer = el.querySelector( '.instagram-posts' ),
              galleryId   = 'awb-instagram-' + counter,
              infiniteScrollHandle = el.querySelector( '.awb-instagram-infinite-scroll-handle' ),
              isMasonry = jQuery( el ).hasClass( 'layout-masonry' );

            if ( jQuery( infiniteScrollHandle ).hasClass( 'is-active' ) ) {
                jQuery( infiniteScrollHandle ).removeClass( 'is-active' );
            }

            // Lightbox.
            if ( 'lightbox' === linkType ) {
                if ( !window[ galleryId ] ) {
                    window[ galleryId ] = jQuery( el ).find(  `a[data-rel="${galleryId}"]` ).iLightBox( window.avadaLightBox.prepare_options( galleryId, false ) );
                } else {
                    window[ galleryId ].destroy();
                    window[ galleryId ] = jQuery( el ).find(  `a[data-rel="${galleryId}"]` ).iLightBox( window.avadaLightBox.prepare_options( galleryId, false ) );
                }

                // Carousel children lightbox.
                if ( jQuery( el ).find( '.instagram-post-children' ).length ) {
                    jQuery( '.instagram-post-children' ).each( function() {
                        const childGalleryId = jQuery( this ).find( 'a:first-child' ).data( 'rel' );
                        if ( !window[ childGalleryId ] ) {
                            window[ childGalleryId ] = jQuery( el ).find(  `a[data-rel="${childGalleryId}"]` ).iLightBox( window.avadaLightBox.prepare_options( childGalleryId, false ) );
                        } else {
                            window[ childGalleryId ].destroy();
                            window[ childGalleryId ] = jQuery( el ).find(  `a[data-rel="${childGalleryId}"]` ).iLightBox( window.avadaLightBox.prepare_options( childGalleryId, false ) );
                        }
                    } );
                }
            }

            // Masonry.
            if ( isMasonry ) {
                window.imagesLoaded( postsContainer, function() {
                    if ( jQuery( postsContainer ).data( 'isotope' ) ) {
                        if ( live ) {
                            jQuery( postsContainer ).isotope( 'destroy' );
                            isoTopeInit( postsContainer, '.instagram-post' );
                        } else {
                            jQuery( postsContainer ).isotope( 'layout' );
                        }
                    } else {
                        isoTopeInit( postsContainer, '.instagram-post' );
                    }
                } );
            }
}

    function getNextPosts( el ) {
        const nextUrl = el.dataset.url;
        const container = jQuery( el ).parents( '.awb-instagram-element' );
        const loadingContainer = container.find( '.instagram-posts-loading-container' );

        if ( !nextUrl ) {
            loadingContainer.show();
            setTimeout( () => {
                loadingContainer.find( '.fusion-loading-spinner' ).hide();
                loadingContainer.find( '.fusion-loading-msg' ).html( window.fusionInstagramVars.no_more_posts_msg );
            }, 500 );

            setTimeout( () => {
                loadingContainer.slideUp();
                jQuery( el ).hide();
            }, 3500 );

        } else {
            getInstagramPosts( container[ 0 ], nextUrl, true );
        }
    }

    // load more button.
    jQuery( '.awb-instagram-load-more-btn' ).on( 'click', function( event ) {
        event.preventDefault();
        getNextPosts( this );
    } );

    // Infinite scroll.
    const instagramInfiniteObserver = new IntersectionObserver(
        ( entries ) => {
          entries.forEach( ( entry ) => {
            if ( entry.isIntersecting && !jQuery( entry.target ).hasClass( 'is-active' ) ) {
              jQuery( entry.target ).addClass( 'is-active' );
              getNextPosts( entry.target );
            }
          } );
        } );

    document.querySelectorAll( '.awb-instagram-infinite-scroll-handle' ).forEach( ( handler ) => {
        instagramInfiniteObserver.observe( handler );
    } );

    // Live editor.
    jQuery( window ).on( 'load fusion-element-render-fusion_instagram', function( $, cid ) {
        const el = 'object' == typeof cid ? cid : document.querySelector( `[data-cid="${cid}"] .awb-instagram-element` );
        if ( el ) {
            getInstagramPosts( el, false, false, true );
        }
    } );

}( jQuery ) );
