/* global avadaPrivacyVars, registerYoutubePlayers, loadYoutubeIframeAPI, playVideoAndPauseOthers, fusionInitVimeoPlayers */
/* eslint no-unused-vars: 0 */
function fusionGetCookieValue() {
	var cookieName  = 'undefined' !== typeof avadaPrivacyVars ? avadaPrivacyVars.name : '',
		cookieValue = fusionGetConsentValues( cookieName );

	if ( 'object' !== typeof cookieValue ) {
		cookieValue = [];
	}
	return cookieValue;
}

function fusionGetConsent( type ) {
	var cookieName   = 'undefined' !== typeof avadaPrivacyVars ? avadaPrivacyVars.name : '',
		cookieValue  = fusionGetConsentValues( cookieName ),
		consentTypes = 'undefined' !== typeof avadaPrivacyVars ? avadaPrivacyVars.types : [];

	// No privacy set, so allow all.
	if ( 'undefined' === typeof avadaPrivacyVars ) {
		return true;
	}

	// Embed type is not selected in TO, allow it.
	if ( -1 === jQuery.inArray( type, consentTypes ) ) {
		return true;
	}

	if ( 'object' !== typeof cookieValue ) {
		cookieValue = [];
	}

	// Consent has been given.
	if ( -1 !== jQuery.inArray( type, cookieValue ) ) {
		return true;
	}

	return false;
}

function fusionReplacePlaceholder( $el ) {
	var tag,
		src,
		html,
		innerHTML;

	if ( $el.is( 'iframe' ) || $el.is( 'img' ) ) {

		// Iframe, just switch the src.
		$el.attr( 'src', $el.attr( 'data-privacy-src' ) );
		$el.removeClass( 'fusion-hidden' );

		if ( 'gmaps' === $el.attr( 'data-privacy-type' ) ) {
			$el.parents( '.fusion-maps-static-type' ).removeClass( 'fusion-hidden' );
		}
	} else if ( $el.is( 'priv-fac-lite-youtube' ) || $el.is( 'priv-fac-lite-vimeo' ) ) {

		// Facade, change tag.
		$el.removeClass( 'fusion-hidden' );
		html = $el[ 0 ].outerHTML;
		html = html.replace( /priv-fac-/g, '' );
		$el[ 0 ].outerHTML = html;

	} else if ( $el.attr( 'data-privacy-video' ) && $el.is( 'noscript' ) ) {
		$el.after( $el.text() );
		$el.remove();
		if ( 'undefined' !== typeof wp && 'undefined' !== typeof wp.mediaelement ) {
			wp.mediaelement.initialize();
		}
	} else if ( $el.attr( 'data-privacy-script' ) && ( $el.is( 'span' ) || $el.is( 'noscript' ) ) ) {

		// Script we need to inject it to get it to run.
		tag       = document.createElement( 'script' );
		src       = 'undefined' !== typeof $el.attr( 'data-privacy-src' ) ?  $el.attr( 'data-privacy-src' ) : false;
		innerHTML = '' !== $el.text() ? $el.text() : false;

		// If its an external src then set.
		if ( src ) {
			tag.src = src;
		}

		// If its a script block then set.
		if ( innerHTML ) {
			tag.innerHTML = innerHTML.replace( /data-privacy-src=/g, 'src=' );
		}

		// Append script to body.
		if ( ( innerHTML && -1 !== innerHTML.indexOf( 'google.maps' ) ) || ( src && -1 !== src.indexOf( 'infobox_packed' ) ) ) {
			fusionMapInsert( tag );
		} else {
			document.body.appendChild( tag );
		}

		// Remove dummy el.
		$el.remove();
	}
}

function fusionGetConsentValues( name ) {
	var value = '; ' + decodeURIComponent( document.cookie ),
		parts = value.split( '; ' + name + '=' );

	if ( 2 === parts.length ) {
		return parts.pop().split( ';' ).shift().split( ',' );
	}
	return false;
}

function fusionMapInsert( tag ) {
	if ( 'undefined' !== typeof google && ( ! jQuery( '[src*="infobox_packed"], [data-privacy-src*="infobox_packed"]' ).length || 'undefined' !== typeof InfoBox ) ) {
		document.body.appendChild( tag );
		jQuery( '.fusion-google-map' ).each( function() {
			jQuery( this ).removeClass( 'fusion-hidden' );
			if ( 'function' === typeof window[ 'fusion_run_map_' + jQuery( this ).attr( 'id' ) ] ) {
				window[ 'fusion_run_map_' + jQuery( this ).attr( 'id' ) ]();
			}
		} );
		return;
	}
	setTimeout( function() {
		fusionMapInsert( tag );
	}, 1000 );
}

function fusionSaveCookieValues( value, single ) {
	var cookieName  = 'undefined' !== typeof avadaPrivacyVars ? avadaPrivacyVars.name : '',
		cookieValue = fusionGetCookieValue(),
		cookiePath  = 'undefined' !== typeof avadaPrivacyVars ? avadaPrivacyVars.path : '/',
		days        = 'undefined' !== typeof avadaPrivacyVars ? avadaPrivacyVars.days : '30',
		dateNow     = new Date(),
		cookieExpires;

	if ( single ) {
		cookieValue.push( value );
	} else {
		cookieValue = value;
	}

	dateNow.setTime( dateNow.getTime() + ( days * 24 * 60 * 60 * 1000 ) );
	cookieExpires   = 'expires=' + dateNow.toUTCString();
	document.cookie = cookieName + '=' + cookieValue.join( ',' ) + ';' + cookieExpires + ';path=' + cookiePath;
}

function fusionSliderVideoInit( vimeoPlayer, youTube, triggeredYouTube ) {
	if ( vimeoPlayer || youTube ) {
		jQuery( '.tfs-slider' ).each( function() {
			var slider;

			if ( ( vimeoPlayer && jQuery( this ).find( '[data-privacy-type="vimeo"]' ).length ) || ( youTube && jQuery( this ).find( '[data-privacy-type="youtube"]' ).length ) ) {
				slider = jQuery( this ).data( 'flexslider' );

				if ( 'undefined' !== typeof slider ) {
					slider.resize();

					if ( ! triggeredYouTube && youTube && 'function' === typeof registerYoutubePlayers && jQuery( this ).find( '[data-privacy-type="youtube"]' ).length ) {
						registerYoutubePlayers( true );
						loadYoutubeIframeAPI();
						triggeredYouTube = true;
					}
					if ( 'function' === typeof playVideoAndPauseOthers && ( ! youTube || 'function' !== typeof registerYoutubePlayers || ! jQuery( this ).find( '[data-privacy-type="youtube"]' ).length ) ) {
						playVideoAndPauseOthers( slider );
					}
				}
			}
		} );
	}
	return triggeredYouTube;
}

function fusionVideoApiInit( vimeoPlayer, youTube, triggeredYouTube ) {

	// Vimeo background handling.
	if ( vimeoPlayer && 'function' === typeof fusionInitVimeoPlayers ) {
		fusionInitVimeoPlayers();
	}

	// YouTube background handling if no slider already.
	if ( youTube && 'function' === typeof onYouTubeIframeAPIReady && ! triggeredYouTube ) {
		registerYoutubePlayers();
		loadYoutubeIframeAPI();
	}
}

function fusionPrivacyBar() {
	var cookieInitialValue = fusionGetCookieValue(),
		checkboxesChanged  = [],
		$acceptButton      = jQuery( '.fusion-privacy-bar-acceptance' ),
		altText            = $acceptButton.data( 'alt-text' ),
		origText           = $acceptButton.data( 'orig-text' );

	// Sweep embeds which should be shown, mostly for caching conflict.
	jQuery.each( cookieInitialValue, function( key, embedType ) {
		jQuery( '[data-privacy-type="' + embedType + '"]' ).each( function() {
			fusionReplacePlaceholder( jQuery( this ) );
		} );

		// If you have checkbox on same page, make it checked so its representative.
		jQuery( '.fusion-privacy-element #' + embedType + ', #bar-' + embedType ).prop( 'checked', true );

		// Remove any other placeholders for same embed.
		jQuery( '.fusion-privacy-placeholder[data-privacy-type="' + embedType + '"]' ).remove();
	} );

	// Fit placeholders to available area.
	jQuery( '.fusion-privacy-placeholder' ).each( function() {
		var $thisEl      = jQuery( this ),
			$parent      = $thisEl.parent(),
			$iframe      = $thisEl.prev(),
			width        = $thisEl.outerWidth(),
			height       = $thisEl.outerHeight(),
			parentWidth  = $parent.width(),
			parentHeight = $parent.height(),
			padding;

		if ( $iframe.is( 'iframe' ) && ! $parent.hasClass( 'fusion-background-video-wrapper' ) && ! $parent.hasClass( 'fluid-width-video-wrapper' ) ) {
			padding = ( -1 !== $thisEl.css( 'width' ).indexOf( '%' ) ) ? height + 'px' : ( ( height / width ) * 100 ) + '%';
			$thisEl.wrap( '<div class="fluid-width-video-wrapper" style="padding-top:' + padding + '" />' );
			$thisEl.parent().append( $iframe );
		}
	} );

	// User clicks on placeholder, need to swap all of that type.
	jQuery( '.fusion-privacy-consent' ).on( 'click', function( event ) {
		var embedType   = jQuery( this ).attr( 'data-privacy-type' ),
			cookieValue = fusionGetCookieValue(),
			vimeoPlayer = 'vimeo' === embedType,
			youTube     = 'youtube' === embedType,
			triggeredYouTube = false;

		if ( -1 === jQuery.inArray( embedType, cookieValue ) ) {
			fusionSaveCookieValues( embedType, true );
		}

		event.preventDefault();

		jQuery( '[data-privacy-type="' + embedType + '"]' ).each( function() {
			fusionReplacePlaceholder( jQuery( this ) );
		} );

		// If you have checkbox on same page, make it checked so its representative.
		jQuery( '.fusion-privacy-element #' + embedType + ', #bar-' + embedType ).prop( 'checked', true );

		// Make sure background and slider videos work.
		triggeredYouTube = fusionSliderVideoInit( vimeoPlayer, youTube, triggeredYouTube );
		fusionVideoApiInit( vimeoPlayer, youTube, triggeredYouTube );

		// Remove any other placeholders for same embed.
		jQuery( '.fusion-privacy-placeholder[data-privacy-type="' + embedType + '"]' ).remove();
	} );

	// Check if cookie consent has been given.
	if ( -1 === jQuery.inArray( 'consent', cookieInitialValue ) ) {
		jQuery( '.fusion-privacy-bar' ).css( {
			display: 'block'
		} );
	}

	// User clicks on learn more.
	jQuery( '.fusion-privacy-bar-learn-more' ).on( 'click', function( event ) {
		var privacyBarWrapper = jQuery( this ).parents( '.fusion-privacy-bar' );

		event.preventDefault();
		privacyBarWrapper.find( '.fusion-privacy-bar-full' ).slideToggle( 300 );
		privacyBarWrapper.toggleClass( 'fusion-privacy-bar-open' );

		// Switch angle direction.
		if ( jQuery( this ).find( '.awb-icon-angle-up' ).length ) {
			jQuery( this ).find( '.awb-icon-angle-up' ).removeClass( 'awb-icon-angle-up' ).addClass( 'awb-icon-angle-down' );
		} else if ( jQuery( this ).find( '.awb-icon-angle-down' ).length ) {
			jQuery( this ).find( '.awb-icon-angle-down' ).removeClass( 'awb-icon-angle-down' ).addClass( 'awb-icon-angle-up' );
		}
	} );

	// User clicks on accept.
	jQuery( '.fusion-privacy-bar-acceptance' ).on( 'click', function( event ) {
		var $bar             = jQuery( this ).parents( '.fusion-privacy-bar' ),
			$checkboxes      = $bar.find( 'input[type="checkbox"]' ),
			cookieValue      = [ 'consent' ],
			youTube          = false,
			vimeoPlayer      = false,
			triggeredYouTube = false,
			buttonAlways     = 'undefined' !== typeof avadaPrivacyVars && 1 == avadaPrivacyVars.button ? true : false,
			defaults         = 'undefined' !== typeof avadaPrivacyVars ? avadaPrivacyVars.defaults : [];

		event.preventDefault();

		// If more details is open, check which have been selected.
		if ( $bar.find( '.fusion-privacy-bar-full' ).is( ':visible' ) || $acceptButton.hasClass( 'fusion-privacy-update' ) || buttonAlways ) {

			jQuery( '.fusion-privacy-element input[type="checkbox"]' ).prop( 'checked', false );

			if ( $checkboxes.length ) {
				jQuery( $checkboxes ).each( function() {
					var embedType = jQuery( this ).val();

					if ( jQuery( this ).is( ':checked' ) && -1 !== jQuery( this ).attr( 'name' ).indexOf( 'consents' ) ) {

						// Show the contents.
						jQuery( '[data-privacy-type="' + embedType + '"]' ).each( function() {
							fusionReplacePlaceholder( jQuery( this ) );
						} );

						// If you have checkbox on same page, make it checked so its representative.
						jQuery( '.fusion-privacy-element #' + embedType ).prop( 'checked', true );

						// Remove any other placeholders for same embed.
						jQuery( '.fusion-privacy-placeholder[data-privacy-type="' + embedType + '"]' ).remove();

						// Add type to cookie value.
						cookieValue.push( embedType );

						if ( 'youtube' === embedType ) {
							youTube = true;
						}
						if ( 'vimeo' === embedType ) {
							vimeoPlayer = true;
						}
					}
				} );
			} else if ( buttonAlways && defaults.length ) {

				// If no checkboxes, but button always enabled and defaults set, use them.
				jQuery.each( defaults, function( key, embedType ) {

					// Show the contents.
					jQuery( '[data-privacy-type="' + embedType + '"]' ).each( function() {
						fusionReplacePlaceholder( jQuery( this ) );
					} );

					// If you have checkbox on same page, make it checked so its representative.
					jQuery( '.fusion-privacy-element #' + embedType ).prop( 'checked', true );

					// Remove any other placeholders for same embed.
					jQuery( '.fusion-privacy-placeholder[data-privacy-type="' + embedType + '"]' ).remove();

					// Add type to cookie value.
					cookieValue.push( embedType );

					if ( 'youtube' === embedType ) {
						youTube = true;
					}
					if ( 'vimeo' === embedType ) {
						vimeoPlayer = true;
					}
				} );
			}

			// Replace cookie value with new array.
			fusionSaveCookieValues( cookieValue, false );
		} else {

			// Just save fact consent has been given.
			fusionSaveCookieValues( 'consent', true );
		}

		triggeredYouTube = fusionSliderVideoInit( vimeoPlayer, youTube, triggeredYouTube );
		fusionVideoApiInit( vimeoPlayer, youTube, triggeredYouTube );

		// Hide the consent bar.
		$bar.hide();
	} );

	// User clicks on reject.
	jQuery( '.fusion-privacy-bar-reject' ).on( 'click', function( event ) {
		event.preventDefault();

		// Just save fact consent has been given.
		fusionSaveCookieValues( 'consent', true );

		// Hide the consent bar.
		jQuery( this ).parents( '.fusion-privacy-bar' ).hide();

		location.reload();
	} );

	// User clicks on checkbox, update button text.
	jQuery( '.fusion-privacy-bar-full .fusion-privacy-choices input[type="checkbox"]' ).on( 'change', function( event ) {
		var embedType = jQuery( this ).val();

		if ( -1 === jQuery.inArray( embedType, checkboxesChanged ) ) {
			checkboxesChanged.push( embedType );
		} else {
			checkboxesChanged.splice( checkboxesChanged.indexOf( embedType ), 1 );
		}

		// If there are changes, make sure it uses alt text.
		if ( 0 !== checkboxesChanged.length ) {
			$acceptButton.text( altText );
			$acceptButton.addClass( 'fusion-privacy-update' );
		} else {
			$acceptButton.text( origText );
			$acceptButton.removeClass( 'fusion-privacy-update' );
		}
	} );
}

jQuery( document ).ready( function() {
	fusionPrivacyBar();
} );
