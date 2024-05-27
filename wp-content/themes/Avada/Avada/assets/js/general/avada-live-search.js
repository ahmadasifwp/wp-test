/* global avadaLiveSearchVars */

var avadaLiveSearch = function() {
	var cachedSearchResults = [];

	if ( ! avadaLiveSearchVars.live_search ) {
		return;
	}

	jQuery( '.fusion-live-search-input' ).each( function() {
		var typingTimer,
			doneTypingInterval    = 500,
			searchInput           = jQuery( this ),
			searchWrapper         = searchInput.closest( '.fusion-live-search' ),
			searchButton          = searchWrapper.find( '.fusion-search-button' ),
			searchSubmit          = searchWrapper.find( '.fusion-search-submit' ),
			searchResults         = searchWrapper.find( '.fusion-search-results' ),
			searchPostType        = searchWrapper.find( 'input[name^="post_type"]' ),
			searchLimitPostTitles = searchWrapper.find( 'input[name="search_limit_to_post_titles"]' ),
			liveMinCharacter 	  = searchWrapper.find( 'input[name="live_min_character"]' ),
			livePostsPerPage 	  = searchWrapper.find( 'input[name="live_posts_per_page"]' ),
			liveFeaturedImage 	  = searchWrapper.find( 'input[name="live_search_display_featured_image"]' ),
			liveShowPostType 	  = searchWrapper.find( 'input[name="live_search_display_post_type"]' ),
			liveScrollbar 	  	  = searchWrapper.find( 'input[name="live_results_scrollbar"]' ),
			parentRow             = searchResults.closest( '.fusion-builder-row' ),
			parentRowHeader       = searchWrapper.closest( '.fusion-header' );

		var minCharCount = 'undefined' !== typeof liveMinCharacter.val() ? parseInt( liveMinCharacter.val() ) : avadaLiveSearchVars.min_char_count,
			postCount    = 'undefined' !== typeof livePostsPerPage.val() ? parseInt( livePostsPerPage.val() ) : avadaLiveSearchVars.per_page,
			featuredImg  = 'undefined' !== typeof liveFeaturedImage.val() ? parseInt( liveFeaturedImage.val() ) : avadaLiveSearchVars.show_feat_img,
			showPostType = 'undefined' !== typeof liveShowPostType.val() ? parseInt( liveShowPostType.val() ) : avadaLiveSearchVars.display_post_type;

		searchSubmit.attr( 'data-color', searchSubmit.css( 'color' ) );
		if ( 'undefined' !== typeof liveScrollbar.val() && liveScrollbar.val() ) {
			searchResults.addClass( 'live-results-scrollbar-' + liveScrollbar.val() );
		}

		// Make sure the results are faded in/out as they should.
		searchInput.on( 'focusin', function() {
			if ( minCharCount <= jQuery( this ).val().length && searchResults.children( '.fusion-search-result' ).length ) {
				searchResults.addClass( 'suggestions-added' );

				setParentRowZindex( 'add' );
			}
		} );

		searchInput.on( 'focusout', function() {
			if ( ! searchResults.is( ':hover' ) && ! searchButton.is( ':hover' ) ) {
				searchResults.removeClass( 'suggestions-added' );

				setParentRowZindex( 'remove' );

				searchResults.addClass( 'suggestions-transition' );
				setTimeout( function() {
					searchResults.removeClass( 'suggestions-transition' );
				}, 300 );
			}
		} );

		jQuery( searchButton, searchResults ).on( 'mouseleave', function() {
			if ( ! searchInput.is( ':focus' ) ) {
				searchResults.removeClass( 'suggestions-added' );

				setParentRowZindex( 'remove' );

				searchResults.addClass( 'suggestions-transition' );
				setTimeout( function() {
					searchResults.removeClass( 'suggestions-transition' );
				}, 300 );
			}
		} );

		// On keyup we start the countdown and invoke the actual search when needed.
		searchInput.on( 'keyup', function() {
			clearTimeout( typingTimer );
			typingTimer = setTimeout( doLiveSearch, doneTypingInterval );
		} );

		// On keydown we clear the typing countdown.
		searchInput.on( 'keydown', function() {
			clearTimeout( typingTimer );
		} );

		function showSearchResults( resultSuggestions ) {
			var suggestionHTML = '';

			searchResults.html( '' );
			searchResults.removeClass( 'suggestions-empty' );
			searchResults.addClass( 'suggestions-added' );

			setParentRowZindex( 'add' );

			if ( ! jQuery.isEmptyObject( resultSuggestions ) ) {
				jQuery.each( resultSuggestions, function( index, suggestion ) {
					suggestionHTML = '';

					suggestionHTML += '<a class="fusion-search-result" href="' + suggestion.post_url + '" title="' + suggestion.title + '">';
					if ( suggestion.image_url ) {
						suggestionHTML += '<div class="fusion-search-image"><img class="fusion-search-image-tag" src="' + suggestion.image_url + '" alt="Post Thumb' + suggestion.id + '"/></div>';
					}
					suggestionHTML += '<div class="fusion-search-content">';
					suggestionHTML += '<div class="fusion-search-post-title">' + suggestion.title + '</div>';
					if ( suggestion.type ) {
						suggestionHTML += '<div class="fusion-search-post-type">' + suggestion.type + '</div>';
					}
					suggestionHTML += '</div>';
					suggestionHTML += '</a>';

					searchResults.append( suggestionHTML );
				} );
			} else {
				searchResults.addClass( 'suggestions-empty' );
				suggestionHTML += '<div class="fusion-search-result">' + avadaLiveSearchVars.no_search_results + '</div>';
				searchResults.append( suggestionHTML );
			}
		}

		// Do the live search when user stopped typing.
		function doLiveSearch() {
			var searchString, getPostValues;

			searchWrapper = searchInput.closest( '.fusion-live-search' );
			searchString  = searchInput.val();

			getPostValues = function() {
				var postTypes = [];
				searchPostType.each( function () {
					postTypes.push( this.value );
				} );
				return postTypes;
			};

			searchString += getPostValues().toString();

			if ( minCharCount <= searchInput.val().length ) {

				// If there already is a cached version, use it.
				if ( 'undefined' !== typeof cachedSearchResults[ searchString ] ) {
					showSearchResults( cachedSearchResults[ searchString ] );
					return;
				}

				searchWrapper.find( '.fusion-slider-loading' ).show();
				searchWrapper.find( '.fusion-search-submit' ).css( 'color', 'transparent' );
				searchSubmit.css( 'color', 'transparent' );

				jQuery.ajax( {
					url: avadaLiveSearchVars.ajaxurl,
					type: 'post',
					data: {
						action: 'live_search_retrieve_posts',
						search: searchInput.val(),
						per_page: postCount,
						show_feat_img: featuredImg,
						display_post_type: showPostType,
						post_type: getPostValues(),
						search_limit_to_post_titles: searchLimitPostTitles.val()
					}
				} )
				.done( function( resultSuggestions ) {
					cachedSearchResults[ searchString ]  = resultSuggestions;
					showSearchResults( resultSuggestions );

					searchWrapper.find( '.fusion-slider-loading' ).hide();
					searchSubmit.css( 'color', searchSubmit.attr( 'data-color' ) );
				} );
			} else {
				searchWrapper.find( '.fusion-slider-loading' ).hide();
				searchSubmit.css( 'color', searchSubmit.attr( 'data-color' ) );
				searchResults.removeClass( 'suggestions-added' );

				setParentRowZindex( 'remove' );
			}
		}

		function setParentRowZindex( addRemove ) {
			if ( parentRow.length ) {
				if ( 'add' === addRemove ) {
					parentRow.css( 'z-index', '11' );
				} else {
					parentRow.css( 'z-index', '' );
				}
			}

			if ( parentRowHeader.length ) {
				if ( 'add' === addRemove ) {
					parentRowHeader.addClass( 'live-suggestion-added' );
				} else {
					parentRowHeader.removeClass( 'live-suggestion-added' );
				}
			}

		}
	} );
};
jQuery( document ).ready( function() {
	avadaLiveSearch();
} );
