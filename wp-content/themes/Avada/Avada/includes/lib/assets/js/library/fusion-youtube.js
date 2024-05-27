/* global YT, fusionGetConsent, playVideoAndPauseOthers, _fbRowGetAllElementsWithAttribute, _fbRowOnPlayerReady, _fbRowOnPlayerStateChange */
/* eslint no-unused-vars: 0*/
/* eslint no-continue: 0*/
/* eslint max-depth: 0*/
var prevCallback  = window.onYouTubePlayerAPIReady;
var fusionTimeout = [];
function registerYoutubePlayers( forced ) {
	if ( true === window.yt_vid_exists ) {
		window.$youtube_players = [];

		jQuery( '.tfs-slider' ).each( function() {
			var $slider = jQuery( this ),
				length  = $slider.find( '[data-youtube-video-id]' ).find( 'iframe' ).length,
				slider  = false;

			$slider.find( '[data-youtube-video-id]' ).find( 'iframe' ).each( function( index ) {
				var $iframe = jQuery( this );

				if ( length === ( index + 1 ) && 'undefined' !== typeof forced ) {
					slider = $slider.data( 'flexslider' );
				}
				window.YTReady( function() {
					window.$youtube_players[ $iframe.attr( 'id' ) ] = new YT.Player( $iframe.attr( 'id' ), {
						events: {
							onReady: onPlayerReady( $iframe.parents( 'li' ), slider ),
							onStateChange: onPlayerStateChange( $iframe.attr( 'id' ), $slider )
						}
					} );
				} );
			} );
		} );
	}
}

function onPlayerReady( $slide, slider ) {

	return function( $event ) {
		if ( 'yes' === jQuery( $slide ).data( 'mute' ) ) {
			$event.target.mute();
		}
		if ( slider ) {
			setTimeout( function() {
				playVideoAndPauseOthers( slider );
			}, 300 );
		}
	};
}

// Load the YouTube iFrame API
function loadYoutubeIframeAPI() {

	var tag,
		firstScriptTag;

	if ( true === window.yt_vid_exists || jQuery( 'body' ).hasClass( 'fusion-builder-live' ) ) {
		tag = document.createElement( 'script' );
		tag.src = 'https://www.youtube.com/iframe_api';
		firstScriptTag = document.getElementsByTagName( 'script' )[ 0 ];
		firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );
	}
}

// This function will be called when the API is fully loaded
function onYouTubePlayerAPIReadyCallback() {
	window.YTReady( true );
}

if ( prevCallback ) {
	window.onYouTubePlayerAPIReady = function() {
		prevCallback();
		onYouTubePlayerAPIReadyCallback();
	};
} else {
	window.onYouTubePlayerAPIReady = onYouTubePlayerAPIReadyCallback;
}

function onPlayerStateChange( $frame, $slider ) {
	return function( $event ) {
		if ( $event.data == YT.PlayerState.PLAYING ) {
			jQuery( $slider ).flexslider( 'pause' );
		}

		if ( $event.data == YT.PlayerState.PAUSED ) {
			jQuery( $slider ).flexslider( 'play' );
		}

		if ( $event.data == YT.PlayerState.BUFFERING ) {
			jQuery( $slider ).flexslider( 'pause' );
		}

		if ( $event.data == YT.PlayerState.ENDED ) {
			if ( '1' == jQuery( $slider ).data( 'autoplay' ) ) {
				if ( 'undefined' !== typeof jQuery( $slider ).find( '.flex-active-slide' ).data( 'loop' ) && 'yes' !== jQuery( $slider ).find( '.flex-active-slide' ).data( 'loop' ) ) {
					jQuery( $slider ).flexslider( 'next' );
				}

				jQuery( $slider ).flexslider( 'play' );
			}
		}
	};
}

function ytVidId( url ) {
	var p = /^(?:https?:)?(\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
	return ( url.match( p ) ) ? RegExp.$1 : false;
}

function insertParam( url, parameterName, parameterValue, atStart ) {

	var replaceDuplicates = true,
		cl,
		urlhash,
		sourceUrl,
		urlParts,
		newQueryString,
		parameters,
		i,
		parameterParts;

	if ( 0 < url.indexOf( '#' ) ) {
		cl      = url.indexOf( '#' );
		urlhash = url.substring( url.indexOf( '#' ), url.length );
	} else {
		urlhash = '';
		cl      = url.length;
	}
	sourceUrl = url.substring( 0, cl );

	urlParts = sourceUrl.split( '?' );
	newQueryString = '';

	if ( 1 < urlParts.length ) {
		parameters = urlParts[ 1 ].split( '&' );
		for ( i = 0; ( i < parameters.length ); i++ ) {
			parameterParts = parameters[ i ].split( '=' );
			if ( ! ( replaceDuplicates && parameterParts[ 0 ] === parameterName ) ) {
				if ( '' === newQueryString ) {
					newQueryString = '?' + parameterParts[ 0 ] + '=' + ( parameterParts[ 1 ] ? parameterParts[ 1 ] : '' );
				} else {
					newQueryString += '&';
					newQueryString += parameterParts[ 0 ] + '=' + ( parameterParts[ 1 ] ? parameterParts[ 1 ] : '' );
				}
			}
		}
	}
	if ( '' === newQueryString ) {
		newQueryString = '?';
	}

	if ( atStart ) {
		newQueryString = '?' + parameterName + '=' + parameterValue + ( 1 < newQueryString.length ? '&' + newQueryString.substring( 1 ) : '' );
	} else {
		if ( '' !== newQueryString && '?' !== newQueryString ) {
			newQueryString += '&';
		}
		newQueryString += parameterName + '=' + ( parameterValue ? parameterValue : '' );
	}
	return urlParts[ 0 ] + newQueryString + urlhash;
}

function fusionYouTubeTimeout( sliderID ) {

	if ( 'undefined' === typeof fusionTimeout[ sliderID ] ) {
		fusionTimeout[ sliderID ] = 0;
	}

	setTimeout( function() {
		if ( 'undefined' !== typeof window.$youtube_players && 'undefined' !== typeof window.$youtube_players[ sliderID ] && 'undefined' !== typeof window.$youtube_players[ sliderID ].playVideo ) {
			window.$youtube_players[ sliderID ].playVideo();
		} else if ( 5 > ++fusionTimeout[ sliderID ] ) {
			fusionYouTubeTimeout( sliderID );
		}
	}, 325 );
}

// Define YTReady function.
window.YTReady = ( function() {
	var onReadyFuncs = [],
		apiIsReady   = false;

	/* @param func function	 Function to execute on ready
	 * @param func Boolean	  If true, all qeued functions are executed
	 * @param bBefore Boolean  If true, the func will added to the first
	 position in the queue*/
	return function( func, bBefore ) {
		if ( true === func ) {
			apiIsReady = true;
			while ( onReadyFuncs.length ) {

				// Removes the first func from the array, and execute func
				onReadyFuncs.shift()();
			}
		} else if ( 'function' === typeof func ) {
			if ( apiIsReady ) {
				func();
			} else {
				onReadyFuncs[ bBefore ? 'unshift' : 'push' ]( func );
			}
		}
	};
}() );

var onYouTubeIframeAPIReady = function() { // eslint-disable-line
	var videos = _fbRowGetAllElementsWithAttribute( 'data-youtube-video-id' ),
		i,
		videoID,
		elemID,
		k,
		player;

	if ( 'function' === typeof fusionGetConsent && ! fusionGetConsent( 'youtube' ) ) {
		return;
	}

	for ( i = 0; i < videos.length; i++ ) {
		videoID = videos[ i ].getAttribute( 'data-youtube-video-id' );

		// Get the elementID for the placeholder where we'll put in the video
		elemID = '';
		for ( k = 0; k < videos[ i ].childNodes.length; k++ ) {
			if ( ( /div/i ).test( videos[ i ].childNodes[ k ].tagName ) ) {
				elemID = videos[ i ].childNodes[ k ].getAttribute( 'id' );
				break;
			}
		}
		if ( '' === elemID ) {
			continue;
		}

		player = new YT.Player( elemID, {
			height: 'auto',
			width: 'auto',
			videoId: videoID,
			playerVars: {
				autohide: 1,
				autoplay: 1,
				fs: 0,
				showinfo: 0,
				modestBranding: 1,
				start: 0,
				controls: 0,
				rel: 0,
				disablekb: 1,
				iv_load_policy: 3,
				wmode: 'transparent'
			},
			events: {
				onReady: _fbRowOnPlayerReady,
				onStateChange: _fbRowOnPlayerStateChange
			}
		} );

		player.isMute = false;
		if ( 'yes' === videos[ i ].getAttribute( 'data-mute' ) ) {
			player.isMute = true;
		}

		// Force YT video to load in HD
		if ( 'true' === videos[ i ].getAttribute( 'data-youtube-video-id' ) ) {
			player.setPlaybackQuality( 'hd720' );
		}
	}
};

jQuery( document ).ready( function() {

	var iframes;

	jQuery( '.fusion-fullwidth.video-background' ).each( function() {
		if ( jQuery( this ).find( '[data-youtube-video-id]' ) ) {
			window.yt_vid_exists = true;
		}
	} );

	iframes = jQuery( 'iframe' );
	jQuery.each( iframes, function( i, v ) {
		var src     = jQuery( this ).attr( 'src' ),
			datasrc = jQuery( this ).data( 'privacy-src' ),
			newSrc,
			newSrc2,
			realsrc = ! src && datasrc ? datasrc : src;

		if ( realsrc ) {
			if ( ytVidId( realsrc ) ) {
				jQuery( this ).attr( 'id', 'player_' + ( i + 1 ) );

				newSrc  = insertParam( realsrc, 'enablejsapi', '1', false );
				newSrc2 = insertParam( newSrc, 'wmode', 'opaque', false );

				if ( src ) {
					jQuery( this ).attr( 'src', newSrc2 );
				} else if ( datasrc ) {
					jQuery( this ).attr( 'data-privacy-src', newSrc2 );
				}

				window.yt_vid_exists = true;
			}
		}
	} );

	if ( 'function' !== typeof fusionGetConsent || fusionGetConsent( 'youtube' ) ) {
		registerYoutubePlayers();
		loadYoutubeIframeAPI();
	}
} );
