/* global avadaElasticSliderVars */
jQuery( window ).on( 'load', function() {
	var eislideshowArgs;

	if ( jQuery().eislideshow ) {
		eislideshowArgs = {
			autoplay: Boolean( Number( avadaElasticSliderVars.tfes_autoplay ) )
		};

		if ( avadaElasticSliderVars.tfes_animation ) {
			eislideshowArgs.animation = avadaElasticSliderVars.tfes_animation;
		}
		if ( avadaElasticSliderVars.tfes_interval ) {
			eislideshowArgs.slideshow_interval = parseInt( avadaElasticSliderVars.tfes_interval, 10 );
		}
		if ( avadaElasticSliderVars.tfes_speed ) {
			eislideshowArgs.speed = parseInt( avadaElasticSliderVars.tfes_speed, 10 );
		}
		if ( avadaElasticSliderVars.tfes_width ) {
			eislideshowArgs.thumbMaxWidth = parseInt( avadaElasticSliderVars.tfes_width, 10 );
		}

		jQuery( '#ei-slider' ).eislideshow( eislideshowArgs );
	}
} );
