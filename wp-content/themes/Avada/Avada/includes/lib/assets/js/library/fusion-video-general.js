/* global fusionVideoGeneralVars, YT, Vimeo, fusionGetConsent, fusionYouTubeTimeout */
/* eslint no-unused-vars: 0*/
/* eslint max-depth: 0*/

function playVideoAndPauseOthers( slider ) {

	// Play the youtube video inside the current slide
	var $currentSliderIframes = jQuery( slider ).find( '[data-youtube-video-id]' ).find( 'iframe' ),
		$currentSlide         = jQuery( slider ).data( 'flexslider' ).slides.eq( jQuery( slider ).data( 'flexslider' ).currentSlide ),
		$currentSlideIframe   = $currentSlide.find( '[data-youtube-video-id]' ).find( 'iframe' );

	// Stop all youtube videos.
	$currentSliderIframes.each( function() {

		// Don't stop current video, but all others
		if ( jQuery( this ).attr( 'id' ) !== $currentSlideIframe.attr( 'id' ) && 'undefined' !== typeof window.$youtube_players && 'undefined' !== typeof window.$youtube_players[ jQuery( this ).attr( 'id' ) ] ) {
			window.$youtube_players[ jQuery( this ).attr( 'id' ) ].stopVideo(); // Stop instead of pause for preview images
		}
	} );

	if ( $currentSlideIframe.length && ( 'function' !== typeof fusionGetConsent || fusionGetConsent( 'youtube' ) ) && 'undefined' !== typeof window.$youtube_players ) {

		// Play only if autoplay is setup.
		if ( ! $currentSlideIframe.parents( 'li' ).hasClass( 'clone' ) && $currentSlideIframe.parents( 'li' ).hasClass( 'flex-active-slide' ) && 'yes' === $currentSlideIframe.parents( 'li' ).attr( 'data-autoplay' ) ) {
			if ( 'undefined' === typeof window.$youtube_players || 'undefined' === typeof window.$youtube_players[ $currentSlideIframe.attr( 'id' ) ] || 'undefined' === typeof window.$youtube_players[ $currentSlideIframe.attr( 'id' ) ].playVideo ) {
				fusionYouTubeTimeout( $currentSlideIframe.attr( 'id' ) );
			} else if ( 'slide' === jQuery( slider ).data( 'animation' ) && 0 === slider.currentSlide && undefined === jQuery( slider ).data( 'iteration' ) ) {
				if ( window.$youtube_players[ $currentSlideIframe.attr( 'id' ) ] ) {
					setTimeout( function() {
						window.$youtube_players[ $currentSlideIframe.attr( 'id' ) ].playVideo();
						jQuery( slider ).data( 'iteration', 1 );

						// Stop slider so that it does not move to next slide.
						slider.stop();

						// Play Slider again when video in finished.
						setTimeout( function() {
							slider.play();
						}, ( window.$youtube_players[ $currentSlideIframe.attr( 'id' ) ].getDuration() * 1000 ) - 6000 );
					}, 2000 );
				}
			} else {
				window.$youtube_players[ $currentSlideIframe.attr( 'id' ) ].playVideo();
			}
		}

		if ( 'yes' === $currentSlide.attr( 'data-mute' ) && 'undefined' !== typeof window.$youtube_players[ $currentSlideIframe.attr( 'id' ) ] && 'undefined' !== typeof window.$youtube_players[ $currentSlideIframe.attr( 'id' ) ].mute ) {
			window.$youtube_players[ $currentSlideIframe.attr( 'id' ) ].mute();
		}
	}

	// Vimeo videos.
	if ( Number( fusionVideoGeneralVars.status_vimeo ) && ( 'function' !== typeof fusionGetConsent || fusionGetConsent( 'vimeo' ) ) ) {
		setTimeout(
			function() {
				jQuery( slider ).find( '[data-vimeo-video-id] > iframe' ).each( function() {
					new Vimeo.Player( jQuery( this )[ 0 ] ).pause();
				} );

				if ( 0 !== slider.slides.eq( slider.currentSlide ).find( '[data-vimeo-video-id] > iframe' ).length ) {
					if ( 'yes' === jQuery( slider.slides.eq( slider.currentSlide ) ).data( 'autoplay' ) ) {
						new Vimeo.Player( slider.slides.eq( slider.currentSlide ).find( 'iframe' )[ 0 ] ).play();
					}
					if ( 'yes' === jQuery( slider.slides.eq( slider.currentSlide ) ).data( 'mute' ) ) {
						new Vimeo.Player( slider.slides.eq( slider.currentSlide ).find( 'iframe' )[ 0 ] ).setVolume( 0 );
					}
				}
			}, 300 );
	}

	// Self hosted videos.
	jQuery( slider ).find( 'video' ).each( function() {
		if ( 'function' === typeof jQuery( this )[ 0 ].pause ) {
			jQuery( this )[ 0 ].pause();
		}
		if ( ! jQuery( this ).parents( 'li' ).hasClass( 'clone' ) && jQuery( this ).parents( 'li' ).hasClass( 'flex-active-slide' ) && 'yes' === jQuery( this ).parents( 'li' ).attr( 'data-autoplay' ) ) {
			if ( 'function' === typeof jQuery( this )[ 0 ].play ) {
				jQuery( this )[ 0 ].play();
			}
		}
	} );
}

jQuery( document ).ready( function() {

	var iframes;

	iframes = jQuery( 'iframe' );
	jQuery.each( iframes, function( i, v ) {
		var src     = jQuery( this ).attr( 'src' ),
			datasrc = jQuery( this ).data( 'privacy-src' ),
			newSrc,
			newSrc2,
			realsrc = ! src && datasrc ? datasrc : src;

		if ( realsrc ) {
			if ( Number( fusionVideoGeneralVars.status_vimeo ) && 1 <= realsrc.indexOf( 'vimeo' ) ) {
				jQuery( this ).attr( 'id', 'player_' + ( i + 1 ) );
			}
		}
	} );

	if ( ! jQuery( 'body' ).hasClass( 'fusion-builder-live' ) ) {
		jQuery( '.full-video, .video-shortcode, .wooslider .slide-content, .fusion-portfolio-carousel .fusion-video' ).not( '#bbpress-forums .full-video, #bbpress-forums .video-shortcode, #bbpress-forums .wooslider .slide-content, #bbpress-forums .fusion-portfolio-carousel .fusion-video' ).fitVids();
		jQuery( '#bbpress-forums' ).fitVids();
	} else {
		setTimeout( function() {
			jQuery( '.full-video, .video-shortcode, .wooslider .slide-content, .fusion-portfolio-carousel .fusion-video' ).not( '#bbpress-forums .full-video, #bbpress-forums .video-shortcode, #bbpress-forums .wooslider .slide-content, #bbpress-forums .fusion-portfolio-carousel .fusion-video' ).fitVids();
			jQuery( '#bbpress-forums' ).fitVids();
		}, 350 );
	}
} );
