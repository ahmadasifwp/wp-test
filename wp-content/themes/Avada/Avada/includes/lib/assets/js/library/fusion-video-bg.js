/* global YT, Vimeo, fusionVideoBgVars, fusionGetConsent, onYouTubeIframeAPIReady */
/**
 * These are in charge of initializing YouTube
 */
/* eslint no-unused-vars: 0*/
/* eslint no-mixed-operators: 0*/
/* eslint no-continue: 0*/
/* eslint no-loop-func: 0*/
var $youtubeBGVideos = {};

function _fbRowGetAllElementsWithAttribute( attribute ) {
	var matchingElements = [],
		allElements = document.getElementsByTagName( '*' ),
		i,
		n;

	for ( i = 0, n = allElements.length; i < n; i++ ) {
		if ( allElements[ i ].getAttribute( attribute ) && ! jQuery( allElements[ i ] ).parents( '.tfs-slider' ).length ) {

			// Element exists with attribute. Add to array.
			matchingElements.push( allElements[ i ] );
		}
	}
	return matchingElements;
}

function _fbRowOnPlayerReady( event ) {
	var player   = event.target,
		currTime = 0,
		firstRun = true,
		prevCurrTime,
		timeLastCall;

	player.playVideo();
	if ( player.isMute ) {
		player.mute();
	}

	if ( 0 !== jQuery( '[data-youtube-video-id=' + player.getVideoData().video_id + ']' ).data( 'loop' ) ) {
		prevCurrTime = player.getCurrentTime();
		timeLastCall = +new Date() / 1000;

		player.loopInterval = setInterval( function() {
			if ( 'undefined' !== typeof player.loopTimeout ) {
				clearTimeout( player.loopTimeout );
			}

			if ( prevCurrTime === player.getCurrentTime() ) {
				currTime = prevCurrTime + ( +new Date() / 1000 - timeLastCall );
			} else {
				currTime = player.getCurrentTime();
				timeLastCall = +new Date() / 1000;
			}
			prevCurrTime = player.getCurrentTime();

			if ( currTime + ( firstRun ? 0.45 : 0.21 ) >= player.getDuration() ) {
				player.pauseVideo();
				player.seekTo( 0 );
				player.playVideo();
				firstRun = false;
			}
		}, 150
		);
	}
}

function _fbRowOnPlayerStateChange( event ) {
	if ( event.data === YT.PlayerState.ENDED ) {
		if ( 'undefined' !== typeof event.target.loopTimeout ) {
			clearTimeout( event.target.loopTimeout );
		}

		if ( 0 !== jQuery( '[data-youtube-video-id=' + event.target.getVideoData().video_id + ']' ).data( 'loop' ) ) {
			event.target.seekTo( 0 );
		}

		// Make the video visible when we start playing
	} else if ( event.data === YT.PlayerState.PLAYING ) {
		jQuery( event.target.getIframe() ).parent().css( 'opacity', '1' );
	}
}

function resizeVideo( $wrapper ) {
	var $videoContainer = $wrapper.parent(),
		$videoWrapper,
		containerWidth,
		containerHeight,
		containerInnerWidth,
		containerInnerHeight,
		finalWidth,
		finalHeight,
		aspectRatio,
		height,
		width,
		$parent,
		marginTop,
		marginLeft,
		marginRight,
		$videoDisplay,
		$toFind;

	if ( $videoContainer.find( 'iframe' ).hasClass( 'fusion-hidden' ) && $videoContainer.find( 'iframe' ).attr( 'data-privacy-src' ) ) {
		return;
	}
	if ( null === $videoContainer.find( 'iframe' ).width() ) {
		setTimeout( function() {
			resizeVideo( $wrapper );
		}, 500 );
		return;
	}

	$videoWrapper = $wrapper;

	$videoWrapper.css( {
		width: 'auto',
		height: 'auto',
		left: 'auto',
		top: 'auto'
	} );

	$videoWrapper.css( 'position', 'absolute' );

	$videoDisplay         = $videoContainer.find( '> div' ).data( 'display' );
	containerInnerWidth   = $videoContainer.width();
	containerInnerHeight  = $videoContainer.height();
	containerWidth        = $videoContainer.outerWidth();
	containerHeight       = $videoContainer.outerHeight();

	aspectRatio = [ 16, 9 ];

	if ( 'undefined' !== typeof $wrapper.attr( 'data-video-aspect-ratio' ) ) {
		if ( -1 !== $wrapper.attr( 'data-video-aspect-ratio' ).indexOf( ':' ) ) {
			aspectRatio = $wrapper.attr( 'data-video-aspect-ratio' ).split( ':' );
			aspectRatio[ 0 ] = parseFloat( aspectRatio[ 0 ] );
			aspectRatio[ 1 ] = parseFloat( aspectRatio[ 1 ] );
		}
	}

	finalHeight = containerHeight;
	finalWidth  = aspectRatio[ 0 ] / aspectRatio[ 1 ] * containerHeight;

	if ( 'contain' === $videoDisplay ) {
		$videoContainer.css( 'paddingTop', $videoContainer.parent( 'li' ).find( '.slide-content-container' ).css( 'paddingTop' ) );
		if ( finalHeight >= containerHeight ) {
			height = containerHeight;
			width  = aspectRatio[ 0 ] / aspectRatio[ 1 ] * containerHeight;
		}
		if ( width >= containerWidth ) {
			width  = containerWidth;
			height  = aspectRatio[ 1 ] / aspectRatio[ 0 ] * containerWidth;
		}
	} else if ( finalWidth >= containerWidth && finalHeight >= containerHeight ) {
		height = containerHeight;
		width  = aspectRatio[ 0 ] / aspectRatio[ 1 ] * containerHeight;
	} else {
		width  = containerWidth;
		height = aspectRatio[ 1 ] / aspectRatio[ 0 ] * containerWidth;
	}

	marginTop  = -( height - containerInnerHeight ) / 2;

	if ( $videoContainer.hasClass( 'fusion-flex-container' ) ) {
		marginLeft  = 'auto';
		marginRight = 'auto';
	} else {
		marginLeft = -( width - containerInnerWidth ) / 2;
		marginRight = '0';
	}

	if ( 1 > $videoContainer.find( '.fusion-video-cover' ).length ) {
		$parent = $videoContainer.find( 'iframe' ).parent();
		$parent.prepend( '<div class="fusion-video-cover">&nbsp;</div>' );
	}

	// No YouTube right click stuff!
	if ( $videoContainer.is( ':visible' ) ) {
		$videoContainer.find( '.fusion-video-cover' ).css( {
			'z-index': 0,
			width: width,
			height: height,
			position: 'absolute'
		} );

		// Fix for #1314.
		$toFind = 'iframe';
		if ( $videoContainer.hasClass( 'video-background' ) ) {
			$toFind = 'iframe.fusion-container-video-bg';
		}

		if ( jQuery( 'body' ).hasClass( 'rtl' ) ) {
			$videoContainer.find( $toFind ).parent().css( {
				marginRight: marginLeft,
				marginLeft: marginRight,
				marginTop: marginTop
			} );
		} else {
			$videoContainer.find( $toFind ).parent().css( {
				marginRight: marginRight,
				marginLeft: marginLeft,
				marginTop: marginTop
			} );
		}

		$videoContainer.find( $toFind ).css( {
			width: width,
			height: height,
			'z-index': -1
		} );
	}
}

/**
 * Called once a vimeo player is loaded and ready to receive
 * commands. You can add events and make api calls only after this
 * function has been called.
 */
function vimeoReady( playerID ) {

	var $container  = jQuery( '#' + playerID ).parents( '[data-vimeo-video-id]' ).first(),
		vimeoPlayer;

	if ( 'function' === typeof fusionGetConsent && ! fusionGetConsent( 'vimeo' ) ) {
		return;
	}

	// Keep a reference to vimeoPlayer for this player
	vimeoPlayer = new Vimeo.Player( playerID );

	if ( 'yes' === $container.data( 'mute' ) ) {
		vimeoPlayer.setVolume( 0 );
	}

	if ( 'no' === $container.data( 'mute' ) ) {
		vimeoPlayer.setVolume( 1 );
	}

	vimeoPlayer.on( 'timeupdate', function onPlayProgress( status ) {
		$container.css( 'opacity', '1' );
		vimeoPlayer.off( 'timeupdate' );
	} );

	// If its enabling a privacy background, then requires resize.
	if ( jQuery( '#' + playerID ).attr( 'data-privacy-src' ) ) {
		resizeVideo( $container );
	}
}

function fusionInitVimeoPlayers() {
	var $vimeos,
		vimeoPlayers,
		length,
		player,
		i;

	if ( 'function' === typeof fusionGetConsent && ! fusionGetConsent( 'vimeo' ) ) {
		return;
	}

	if ( Number( fusionVideoBgVars.status_vimeo ) ) {
		$vimeos = jQuery( '[data-vimeo-video-id]' );

		if ( 0 < $vimeos.length ) {
			vimeoPlayers = $vimeos.find( '> iframe, iframe[data-privacy-type="vimeo"]' ),
			length       = vimeoPlayers.length;

			for ( i = 0; i < length; i++ ) {
				player = vimeoPlayers[ i ];

				if ( 'function' === typeof vimeoReady ) {
					vimeoReady( player.getAttribute( 'id' ) );
				}
			}

		}
	}
}

// Set up both YouTube and Vimeo videos.
jQuery( document ).ready(
	function( $ ) {
		var $videoContainer,
			$vimeos,
			vimeoPlayers,
			player,
			i,
			length;

		// Disable showing/rendering the parallax in the VC's frontend editor.
		if ( $( 'body' ).hasClass( 'vc_editor' ) ) {
			return;
		}
		$( '.bg-parallax.video, .fusion-bg-parallax.video' ).each(
			function() {
				$( this ).prependTo( $( this ).next().addClass( 'video' ) );
				$( this ).css( {
					opacity: Math.abs( parseFloat( $( this ).attr( 'data-opacity' ) ) / 100 )
				}
				);
			}
		);

		$videoContainer = $( '[data-youtube-video-id], [data-vimeo-video-id]' ).parent();
		$videoContainer.css( 'overflow', 'hidden' );

		$( '[data-youtube-video-id], [data-vimeo-video-id]' ).each( function() {
			var $this = $( this );
			setTimeout(	function() {
				resizeVideo( $this );
			}, 100 );
		} );

		$( '[data-youtube-video-id], [data-vimeo-video-id]' ).each( function() {
			var $this = $( this );
			setTimeout( function() {
				resizeVideo( $this );
			}, 1000 );
		} );

		$( window ).on( 'resize', function() {
			$( '[data-youtube-video-id], [data-vimeo-video-id]' ).each( function() {
				var $this = $( this );
				setTimeout( function() {
					resizeVideo( $this );
				}, 2 );
			} );
		} );

		fusionInitVimeoPlayers();

		/**
		 * Utility function for adding an event. Handles the inconsistencies
		 * between the W3C method for adding events (addEventListener) and
		 * IE's (attachEvent).
		 */
		function addEvent( element, eventName, callback ) {
			if ( element.addEventListener ) {
				element.addEventListener( eventName, callback, false );
			} else {
				element.attachEvent( 'on' + eventName, callback );
			}
		}
	}
);

jQuery( window ).on( 'load fusion-element-render-fusion_builder_container', function( $, cid ) {
	var $targetEl = 'undefined' !== typeof cid ? jQuery( 'div[data-cid="' + cid + '"]' ).find( '[data-youtube-video-id], [data-vimeo-video-id]' ) : jQuery( '[data-youtube-video-id], [data-vimeo-video-id]' );

	if ( 'undefined' !== typeof cid && Number( fusionVideoBgVars.status_yt ) && 'undefined' !== typeof onYouTubeIframeAPIReady ) {
		onYouTubeIframeAPIReady(); // eslint-disable-line block-scoped-var
	}

	$targetEl.each( function() {
		var $this = jQuery( this );
		setTimeout( function() {
			resizeVideo( $this );
		}, 500 );
	} );
} );
