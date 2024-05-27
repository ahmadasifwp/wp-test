/**
 * Ported from https://github.com/paulirish/lite-youtube-embed
 *
 * A lightweight vimeo embed. Still should feel the same to the user, just MUCH faster to initialize and paint.
 *
 * Thx to these as the inspiration
 *   https://storage.googleapis.com/amp-vs-non-amp/youtube-lazy.html
 *   https://autoplay-youtube-player.glitch.me/
 *
 * Once built it, I also found these:
 *   https://github.com/ampproject/amphtml/blob/master/extensions/amp-youtube (👍👍)
 *   https://github.com/Daugilas/lazyYT
 *   https://github.com/vb/lazyframe
 */
if ( 'undefined' === typeof LiteVimeo ) {
    class LiteVimeo extends HTMLElement {
        constructor() {
            super();
            // TODO: support dynamically setting the attribute via attributeChangedCallback
        }

        connectedCallback() {
            // Gotta encode the untrusted value
            // https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html#rule-2---attribute-escape-before-inserting-untrusted-data-into-html-common-attributes
            this.videoId = encodeURIComponent(this.getAttribute('videoid'));

            /**
             * Lo, the vimeo placeholder image!  (aka the thumbnail, poster image, etc)
             * We have to use the Vimeo API.
             *
             * As of date of this commit, the custom lite-vimeo website to retrieve
             * the thumbnails no longer works. This was replaced by an initial
             * similar SVG, and the official Vimeo way to retrieve thumbnails.
             */
            // let { width, height } = vimeoLiteGetThumbnailDimensions(this.getBoundingClientRect());
            // const devicePixelRatio = window.devicePixelRatio || 1;

            // // Begin: Theme Fusion Edit.
            // width  = Math.round( width * devicePixelRatio );
            // height = Math.round( height * devicePixelRatio );
            // // End: Theme Fusion Edit.

            // let thumbnailUrl = `https://lite-vimeo-embed.now.sh/thumb/${this.videoId}`;
            // thumbnailUrl += `.${vimeoLiteCanUseWebP() ? 'webp' : 'jpg'}`;
            // thumbnailUrl += `?mw=${width}&mh=${height}&q=${devicePixelRatio > 1 ? 70 : 85}`;

            // this.style.backgroundImage = `url("${thumbnailUrl}")`;

            const playBtn = document.createElement('button');
            playBtn.type = 'button';
            playBtn.classList.add('ltv-playbtn');
            this.appendChild(playBtn);

            // On hover (or tap), warm up the TCP connections we're (likely) about to use.
            this.addEventListener('pointerover', LiteVimeo._warmConnections, {
                once: true
            });

            // Once the user clicks, add the real iframe and drop our play button
            // TODO: In the future we could be like amp-youtube and silently swap in the iframe during idle time
            //   We'd want to only do this for in-viewport or near-viewport ones: https://github.com/ampproject/amphtml/pull/5003
            // Begin: Theme Fusion Edit 
            this.addEventListener('click', this.callbackIframe );
        }

        /** 
         * Add iframe and make sure event is bound only once. 
         */ 
        callbackIframe() {
            this._addIframe()
            this.removeEventListener( 'click', this.callbackIframe );
        }
        // End: Theme Fusion Edit 

        // // TODO: Support the the user changing the [videoid] attribute
        // attributeChangedCallback() {
        // }

        /**
         * Begin pre-connecting to warm up the iframe load
         * Since the embed's network requests load within its iframe,
         *   preload/prefetch'ing them outside the iframe will only cause double-downloads.
         * So, the best we can do is warm up a few connections to origins that are in the critical path.
         *
         * Maybe `<link rel=preload as=document>` would work, but it's unsupported: http://crbug.com/593267
         * But TBH, I don't think it'll happen soon with Site Isolation and split caches adding serious complexity.
         */
        static _warmConnections() {
            if (LiteVimeo.preconnected) return;

            // The iframe document and most of its subresources come right off player.vimeo.com
            vimeoLiteAddPrefetch('preconnect', 'https://player.vimeo.com');
            // Images
            vimeoLiteAddPrefetch('preconnect', 'https://i.vimeocdn.com');
            // Files .js, .css
            vimeoLiteAddPrefetch('preconnect', 'https://f.vimeocdn.com');
            // Metrics
            vimeoLiteAddPrefetch('preconnect', 'https://fresnel.vimeocdn.com');

            LiteVimeo.preconnected = true;
        }

        _addIframe() {
            const iframeHTML = `
    <iframe width="640" height="360" frameborder="0"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    src="https://player.vimeo.com/video/${this.videoId}?autoplay=1"
    ></iframe>`;
            this.insertAdjacentHTML('beforeend', iframeHTML);
            this.classList.add('ltv-activated');
        }
    }
    // Register custom element - Theme Fusion Edit.
    if ( undefined === customElements.get( 'lite-vimeo' ) ) {
        customElements.define('lite-vimeo', LiteVimeo);
    }
}

// ThemeFusion edit: Copied from utils.js
/**
 * Add a <link rel={preload | preconnect} ...> to the head
 */
 function vimeoLiteAddPrefetch(kind, url, as) {
    const linkElem = document.createElement('link');
    linkElem.rel = kind;
    linkElem.href = url;
    if (as) {
        linkElem.as = as;
    }
    linkElem.crossorigin = true;
    document.head.appendChild(linkElem);
}

function vimeoLiteCanUseWebP() {
    var elem = document.createElement('canvas');

    if (elem.getContext && elem.getContext('2d')) {
        // was able or not to get WebP representation
        return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    // very old browser like IE 8, canvas not supported
    return false;
}

/**
 * Get the thumbnail dimensions to use for a given player size.
 *
 * @param {Object} options
 * @param {number} options.width The width of the player
 * @param {number} options.height The height of the player
 * @return {Object} The width and height
 */
function vimeoLiteGetThumbnailDimensions({ width, height }) {

    // ThemeFusion edit: default dimensions if they were not set in time, ie using inside carousel.
    width  = width || 960;
    height = height || 540;

    let roundedWidth  = width;
    let roundedHeight = height;

    // If the original width is a multiple of 320 then we should
    // not round up. This is to keep the native image dimensions
    // so that they match up with the actual frames from the video.
    //
    // For example 640x360, 960x540, 1280x720, 1920x1080
    //
    // Round up to nearest 100 px to improve cacheability at the
    // CDN. For example, any width between 601 pixels and 699
    // pixels will render the thumbnail at 700 pixels width.
    if (roundedWidth % 320 !== 0) {
        roundedWidth = Math.ceil(width / 100) * 100;
        roundedHeight = Math.round((roundedWidth / width) * height);
    }

    return {
        width: roundedWidth,
        height: roundedHeight
    };
}

// Begin: Theme Fusion Edit - Insert thumbnail images from Vimeo API.
( function() {
    document.addEventListener( 'DOMContentLoaded', fusionChangeVimeoThumbnails );
    document.addEventListener( 'DOMContentLoaded', addJqueryAjaxEvent );

    if ( document.readyState === 'interactive' || document.readyState === 'complete' ) {
        fusionChangeVimeoThumbnails();
        addJqueryAjaxEvent();
    }

    /**
     * When an ajax call happens, also check for vimeo thumbnails.
     */
    function addJqueryAjaxEvent() {
        if ( jQuery ) {
            jQuery( document ).ajaxComplete( function() {
                fusionChangeVimeoThumbnails();
            } );
        }
    }

    /**
     * Change the vimeo thumbnails when the page load. This is because by
     * default the video thumbnails do not work.
     */
    function fusionChangeVimeoThumbnails() {
        var liteVimeoVideos = document.querySelectorAll( 'lite-vimeo, priv-fac-lite-vimeo' );

        liteVimeoVideos.forEach( function( liteVimeo ) {
            if ( ! liteVimeo.getAttribute( 'data-fusion-vimeo-thumbnail-loaded' ) ) {
                loadVimeoThumbnail( liteVimeo );
                liteVimeo.addEventListener( 'click', removeVimeoThumbnail );
            }
        } );

        function loadVimeoThumbnail( liteVideo ) {
            var xhttp = new XMLHttpRequest(),
                videoId = liteVideo.getAttribute( 'videoid' );

            liteVideo.setAttribute( 'data-fusion-vimeo-thumbnail-loaded', 'true' );

            xhttp.onload = function() {
                if ( this.status >= 200 && this.status < 400 ) {
                    var data = JSON.parse( this.responseText ),
                        liteVideoRect,
                        liteVideoWidth,
                        liteVideoHeight,
                        bothDimensionsAreInUrl,
                        devicePixelRatio = window.devicePixelRatio || 1,
                        thumbnail_url;

                    liteVideoRect   = vimeoLiteGetThumbnailDimensions( liteVideo.getBoundingClientRect() );
                    liteVideoWidth  = Math.round( liteVideoRect.width * devicePixelRatio );
                    liteVideoHeight = Math.round( liteVideoRect.height * devicePixelRatio );

                    if ( 'object' === typeof data && null !== data && 'string' === typeof data.thumbnail_url && data.thumbnail_url ) {
                        thumbnail_url = data.thumbnail_url;

                        if ( 0 < liteVideoWidth && 0 < liteVideoHeight ) {
                            // Both Height and Width is present in URL.
                            // Sometimes only Width is present in URL if the thumbnail is 16:9.
                            bothDimensionsAreInUrl = /d_\d+x\d+$/.test( data.thumbnail_url )

                            // Replace the thumbnail dimensions with new ones that fit better.
                            if ( bothDimensionsAreInUrl ) {
                                thumbnail_url = data.thumbnail_url.replace( /d_\d+x\d+$/, 'd_' + liteVideoWidth + 'x' + liteVideoHeight );
                            } else {
                                thumbnail_url = data.thumbnail_url.replace( /d_\d+$/, 'd_' + liteVideoWidth + 'x' + liteVideoHeight );
                            }
                        }

                        // Defer modifying backgroundImage. Works without but is better with.
                        setTimeout( function() {
                            liteVideo.style.backgroundImage = 'url("' + thumbnail_url + '")';
                        }, 200 )
                    }
                }
            }
            xhttp.open( 'GET', 'https://vimeo.com/api/oembed.json?url=https://vimeo.com/' + encodeURIComponent( videoId ), true );
            xhttp.send();
        }

        function removeVimeoThumbnail( event ) {
            event.currentTarget.removeEventListener( 'click', removeVimeoThumbnail );
            event.currentTarget.classList.add( 'awb-lite-vimeo-no-background' );
            event.currentTarget.style.backgroundImage = '';
        }
    }
} )();
// End: Theme Fusion Edit.
