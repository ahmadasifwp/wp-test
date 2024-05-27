( function( jQuery ) {

	'use strict';

	jQuery.fn.fusion_countdown = function() {

		var $countdown = jQuery( this ),
			$timer     = $countdown.attr( 'data-timer' ).split( '-' ),
			$GMToffset = $countdown.attr( 'data-gmt-offset' ),
			$omitWeeks = $countdown.attr( 'data-omit-weeks' );

		$countdown.countDown( {
			gmtOffset: $GMToffset,
			omitWeeks: $omitWeeks,
			targetDate: {
				year: $timer[ 0 ],
				month: $timer[ 1 ],
				day: $timer[ 2 ],
				hour: $timer[ 3 ],
				min: $timer[ 4 ],
				sec: $timer[ 5 ]
			}
		} );
	};
}( jQuery ) );
jQuery( document ).ready( function() {

	/*
	* Setup the countdown shortcodes.
	* Don't init them in preview window, it's done from the view.
	*/
	if ( ! jQuery( 'body' ).hasClass( 'fusion-builder-live' ) ) {
		jQuery( '.fusion-countdown-counter-wrapper' ).each( function() {
			var $countdownID = jQuery( this ).attr( 'id' );
			jQuery( '#' + $countdownID ).fusion_countdown();
		} );
	}
} );
