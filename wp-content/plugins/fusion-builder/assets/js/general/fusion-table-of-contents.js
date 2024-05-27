/* global awbTOCElementVars, fusion, fusionGetScrollOffset */

jQuery( document ).ready( awbTableOfContentsRefreshAllElements );

function awbTableOfContentsRefreshAllElements() {
    var allHeadingsHierarchy      = getAllPageHeadings();
    var allTOCElements            = document.querySelectorAll( '.awb-toc-el' );
    // Hide columns and nested columns titles in LE.
    var liveEditorHeadingToIgnore = '.fusion-builder-module-controls-container *, .fusion-builder-modal-top-container *';
    var isLiveEditor              = document.body.classList.contains( 'fusion-builder-live-preview' );
    var titleIds                  = {};

    createHierarchyForAllElements();
    scrollToTocHeaderIfNeeded();

    /**
     * Get all titles the document, in order of their appearance.
     *
     * @returns {NodeList}
     */
    function getAllPageHeadings() {
        var allHeadingsFiltered = [];
        var removeSelectors = '.awb-toc-el__title';

        document.querySelectorAll( 'h1,h2,h3,h4,h5,h6' ).forEach( function( el ) {
            if ( ! el.matches( removeSelectors ) ) {
                allHeadingsFiltered.push( el );
            }
        } );

        return allHeadingsFiltered;
    }

    function createHierarchyForAllElements() {
        var i,
            element,
            options,
            headingsTree,
            contentElement,
            tocId,
            bothHTMLAreEmpty,
            cacheIsEnabled,
            pageTocTreesToUpdate = {},
            updateCache = false,
            html;

        for ( i = 0; i < allTOCElements.length; i++ ) {
            element = allTOCElements[ i ];
            options = element.getAttribute( 'data-awb-toc-options' );
            tocId  = element.getAttribute( 'data-awb-toc-id' );

            if ( ! options || element.getAttribute( 'data-awb-toc-static' ) ) {
                continue; //eslint-disable-line no-continue
            }
            options = JSON.parse( options );
            cacheIsEnabled = ( 'yes' === options.enable_cache );

            headingsTree      = getDisplayedHeadings( options );
            html = createHTMLForHeadings( headingsTree, options );

            if ( cacheIsEnabled ) {
                pageTocTreesToUpdate[ tocId ] = headingsTree;
            }

            contentElement = element.querySelector( '.awb-toc-el__content' );
            if ( ! contentElement ) {
                continue; // eslint-disable-line no-continue
            }

            // If we have content, but cache is disabled, then it means that the inside cache needs to be updated.
            if ( ! cacheIsEnabled && contentElement.childElementCount ) {
                updateCache = true;
            }

            bothHTMLAreEmpty = ( ! contentElement.innerHTML ) && ( -1 === html.indexOf( '</li' ) );
            if ( contentElement.innerHTML !== html && ! bothHTMLAreEmpty ) {
                contentElement.innerHTML = '';
                contentElement.insertAdjacentHTML( 'beforeend', html );

                if ( cacheIsEnabled ) {
                    updateCache = true;
                }
            }

            manageScrollSpy( allTOCElements[ i ], options );
        }

        if ( updateCache ) {
            updateServerTOCCache( pageTocTreesToUpdate );
        }
    }

    function createHTMLForHeadings( headingsTree, options, currentIndent = 0 ) {

        /*
            Important! This function needs to be the same with PHP function
            from front-end that generates HTML. Meaning that a change here
            will likely means a change there. If you do not meet same HTML,
            then AJAX will fire on each page load(please also test for this).
        */
        var i = 0,
            listClasses = 'awb-toc-el__list awb-toc-el__list--' + currentIndent,
            icon = '',
            html = '';

        if ( 'custom_icon' === options.counter_type && options.icon ) {
            icon = '<span class="awb-toc-el__item-icon ' + options.icon + '"></span>';
        }

        html += '<ul class="' + listClasses + '">';

        // Dummy content for Live Editor, if nothing is displayed. This should not be in PHP version.
        if ( isLiveEditor && 0 === headingsTree.length && window.awbTOCDummyContent1 && 0 === currentIndent ) {
            var dummyIndent = ( 'object' === typeof options.allowed_heading_tags ? Object.keys( options.allowed_heading_tags ).length : 3 ); // eslint-disable-line vars-on-top
            if ( 3 < dummyIndent ) {
                dummyIndent = 3;
            }
            headingsTree = window[ 'awbTOCDummyContent' + dummyIndent ];
        }

        for ( i = 0; i < headingsTree.length; i++ ) {
            html += '<li class="awb-toc-el__list-item">';

            if ( headingsTree[ i ].title ) {
                html += '<a class="awb-toc-el__item-anchor" href="#' + headingsTree[ i ].id + '">' + icon + headingsTree[ i ].title + '</a>';
            }

            if ( Array.isArray( headingsTree[ i ].children ) && headingsTree[ i ].children.length ) {
                html += createHTMLForHeadings( headingsTree[ i ].children, options, currentIndent + 1 );
            }

            html += '</li>';
        }

        html += '</ul>';

        return html;
    }

    /**
     * Giving a list of options gets the heading tree valid for the options.
     *
     * @param {array} options
     * @returns {object}
     */
    function getDisplayedHeadings( options ) {
        var tree = [],
            heading,
            headings = allHeadingsHierarchy,
            textContent,
            ignoreWords,
            ignoreHeading,
            headingIndent,
            ignoreFromPlaces = '.awb-off-canvas *',
            headingMatches = '',
            j,
            i;

        if ( 'post_content' === options.limit_container ) {
            headingMatches = '.fusion-content-tb *';
        } else if ( 'page_content' === options.limit_container ) {
            headingMatches = '#content *';
        } else if ( 'custom' === options.limit_container && options.select_custom_headings ) {
            headingMatches = options.select_custom_headings;
        }

        if ( ! options.ignore_headings ) {
            options.ignore_headings = '.awb-exclude-from-toc, .awb-exclude-from-toc *';
        }


        for ( i = 0; i < headings.length; i++ ) {
            heading = headings[ i ];
            if ( 'undefined' === typeof options.allowed_heading_tags[ heading.tagName.toLowerCase() ] ) {
                continue; // eslint-disable-line no-continue
            }

            if ( headingMatches && ! heading.matches( headingMatches ) ) {
                continue; // eslint-disable-line no-continue
            }

            if ( options.ignore_headings && heading.matches( options.ignore_headings ) ) {
                continue; // eslint-disable-line no-continue
            }

            if ( isLiveEditor && heading.matches( liveEditorHeadingToIgnore ) ) {
                continue; // eslint-disable-line no-continue
            }

            if ( heading.matches( ignoreFromPlaces ) ) {
                continue; // eslint-disable-line no-continue
            }

            if ( 'yes' === options.hide_hidden_titles && ! jQuery( heading ).is( ':visible' ) ) {
                continue;  // eslint-disable-line no-continue
            }

            if ( options.ignore_headings_words && 'string' === typeof options.ignore_headings_words ) {
                textContent = heading.textContent.toLowerCase();
                ignoreWords = options.ignore_headings_words.split( '|' );
                ignoreHeading = false;

                for ( j = 0; j < ignoreWords.length; j++ ) {
                    if ( ignoreWords[ j ] && textContent.includes( ignoreWords[ j ].toLowerCase() ) ) {
                        ignoreHeading = true;
                    }
                }

                if ( ignoreHeading ) {
                    continue; // eslint-disable-line no-continue
                }
            }

            headingIndent = options.allowed_heading_tags[ heading.tagName.toLowerCase() ];

            if ( 0 === headingIndent ) {
                tree.push( createHeadingItem( heading ) );
            }

            if ( 0 < headingIndent ) {
                pushIntoChildren( tree, heading, headingIndent );
            }
        }

        return tree;

        function createHeadingItem( h ) {
            var headingId = '',
                headingTitle = '';

            if ( h ) {
                headingId = getOrCreateHeadingId( h );
                headingTitle = getHeadingTitle( h );
            }

            return {
                title: headingTitle,
                children: [],
                id: headingId
            };
        }

        function getEmptyHeadingItem() {
            return createHeadingItem( '' );
        }

        function pushIntoChildren( theTree, h, indent ) {
            if ( 0 === indent ) {
                theTree.push( createHeadingItem( h ) );
            } else {
                if ( 0 === theTree.length ) {
                    theTree.push( getEmptyHeadingItem() );
                }

                indent--;
                pushIntoChildren( theTree[ theTree.length - 1 ].children, h, indent );
            }
        }

        /**
         * Get the heading title from a heading node.
         *
         * @param {Node} heading
         * @returns {string}
         */
        function getHeadingTitle( h ) {
            var newHeading = h.cloneNode( true ),
                tagsToKeepWithContent = [ 'bdi', 'bdo', 'del', 'ins', 'q', 's', 'small', 'strike', 'sub', 'sup', 'u' ],
                tagsToStrip = [ 'a', 'abbr', 'address', 'b', 'blockquote', 'code', 'data',  'em', 'i', 'kbd', 'mark', 'p', 'pre', 'span', 'strong', 'time' ]; // Note: i tags, which contains icons should be striped. The rest of the tags are deleted with their content.

            traverseNode( newHeading );

            return newHeading.innerHTML.replace( /<span><\/span>/g, '' ).trim();

            // Recursive function traversing the DOM of the current heading.
            function traverseNode( parent ) {
                var children = getChildren( parent ),
                    childNr;

                for ( childNr = 0; childNr < children.length; childNr++ ) {
                   traverseNode( children[ childNr ] );
                }
            }

            // Getting all the children of the current DOM level.
            function getChildren( parent ) {
                var children = [],
                childNr;

                if ( 'undefined' === typeof parent || 'undefined' === typeof parent.childNodes || 0 === parent.childNodes.length ) {
                    return children;
                }

                for ( childNr = 0; childNr < parent.childNodes.length; childNr++ ) {
                    getCleanNodeContent( parent.childNodes[ childNr ] );

                    children.push( parent.childNodes[ childNr ] );
                }

                return children;
            }

            // Does the actual cleaning on the current DOM element, that will bubble up the full heading DOM.
            function getCleanNodeContent( node ) {
                var tagName;

                if ( 'undefined' === typeof node.tagName ) {
                    node.outerHTML = node.textContent;
                } else {
                    tagName = node.tagName.toLowerCase();

                    if ( -1 !== tagsToKeepWithContent.indexOf( tagName ) ) {
                        node.outerHTML = node.outerHTML; // eslint-disable-line
                    } else if ( -1 !== tagsToStrip.indexOf( tagName ) ) {
                        node.outerHTML = '<span>' + node.innerHTML + '</span>';
                    }
                }
            }
        }
    }

    /**
     * Giving a heading, create an unique Id for that heading.
     *
     * @param {Node} heading
     * @return {string}
     */
    function getOrCreateHeadingId( heading ) {
        var headingId = heading.getAttribute( 'id' ),
            idNumOfExists = 0,
            uniqueId;

        // If heading doesn't have an id, then create a new unique one assign to it.
        if ( ! headingId ) {
            uniqueId = createId( heading.textContent );
            makeSureIdIsUnique( uniqueId );
            heading.setAttribute( 'id', uniqueId );
            headingId = uniqueId;
        }

        return headingId;

        function createId( text ) {
            var id = 'toc', // append toc to make sure ID starts with characters and not numbers.
                words = text.split( ' ' ),
                cleanWord,
                maxWords,
                i;

            for ( maxWords = 8, i = 0; i < words.length && 0 < maxWords; i++ ) { // Limit Id creation to 8 words.
                // Make sure to replace all diacritics with normal characters, and remove non-alpha-characters.
                cleanWord = words[ i ].normalize( 'NFKD' ).replaceAll( /[^a-zA-Z0-9_]/g, '' );
                if ( cleanWord ) {
                    maxWords--;
                    id += '_' + cleanWord;
                }
            }

            return id;
        }

        // If an Id already exists, and is not for the same title, then create a new Id appending "__" and new nr.
        function makeSureIdIsUnique( idToVerify ) {
            if ( ! titleIds[ idToVerify ] ) {
                titleIds[ idToVerify ] = heading;
                uniqueId               = idToVerify;
            } else if ( titleIds[ idToVerify ] !== heading ) {
                if ( idNumOfExists ) {
                    idToVerify = idToVerify.replace( /__\d+/, '' );
                }

                idNumOfExists++;
                idToVerify = idToVerify + '__' + idNumOfExists;
                makeSureIdIsUnique( idToVerify );
            }
        }
    }

    function updateServerTOCCache( tocTrees ) {
        var postId = fusion.getCurrentPostID();

        if ( ! postId ) {
            return;
        }

        if ( document.body.classList.contains( 'fusion-builder-live-preview' ) ) {
            return;
        }

        jQuery.ajax( {
			type: 'POST',
			url: awbTOCElementVars.ajaxUrl,
			data: {
                action: 'awb_save_toc_tree',
                postId: postId,
                trees: tocTrees
            },
			dataType: 'json'
        } );
    }

    /** Implement ScrollSpy */

    function manageScrollSpy( tocEl, options ) {
        var tocId = tocEl.getAttribute( 'data-awb-toc-id' );

        if ( ! window.awbTocScrollSpies ) {
            window.awbTocScrollSpies = {};
        }

        if ( ! tocId ) {
            return;
        }

        setTimeout( function() { // Don't block the rendering.

            if ( window.awbTocScrollSpies[ tocId ] ) {
                window.awbTocScrollSpies[ tocId ].stopListening();
                delete window.awbTocScrollSpies[ tocId ];
            }

            if ( 'yes' === options.highlight_current_heading ) {
                window.awbTocScrollSpies[ tocId ] = new window.awbScrollSpy( document.body, {
                    target: '.' + tocEl.className.replace( / /g, '.' ),
                    currentItemClass: 'awb-toc-el__list-item--highlighted',
                    offset: fusionGetScrollOffset()
                } );
            }
        }, 10 );

        // Reset ScrollSpy offset to correct height after page is fully loaded, sticky container change.
        jQuery( window ).on( 'load fusion-sticky-change fusion-sticky-scroll-change', function() {
            if ( 'object' === typeof window.awbTocScrollSpies[ tocId ] ) {
                window.awbTocScrollSpies[ tocId ].options.offset = fusionGetScrollOffset();
            }
        } );

        // Reset ScrollSpy offset to correct height after sticky transition has finished.
        jQuery( window ).on( 'fusion-sticky-transition-change', function() {
            setTimeout( function() {
                if ( 'object' === typeof window.awbTocScrollSpies[ tocId ] ) {
                    window.awbTocScrollSpies[ tocId ].options.offset = fusionGetScrollOffset();
                }
            }, 300 );
        } );

    }

    function scrollToTocHeaderIfNeeded() {
        var hashId = window.location.hash;

        if ( 0 === hashId.indexOf( '#toc_' ) ) {
            jQuery( '[href*="' + hashId + '"]' ).fusion_scroll_to_anchor_target();
        }
    }
}
