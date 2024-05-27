/* global imagesLoaded, calcSelectArrowDimensions, avadaAddQuantityBoxes */

jQuery( document ).ready( function() {
	var resizeTimer,
		navPrevHTML  = jQuery( '.tribe-events-nav-previous' ).length ? jQuery( '.tribe-events-nav-previous' ).html().trim() : '',
		navNextHTML  = jQuery( '.tribe-events-nav-next' ).length ? jQuery( '.tribe-events-nav-next' ).html().trim() : '',
		qtySelectors = jQuery( '.tribe-ticket-quantity, .tribe-tickets-quantity, .tribe-tickets__tickets-item-quantity-number-input' );

	if ( ! jQuery( 'body' ).hasClass( 'page-tribe-attendee-registration' ) ) {
		qtySelectors.addClass( 'qty' ).wrap( '<div class="quantity"></div>' );
		avadaAddQuantityBoxes( '.qty', qtySelectors );

		jQuery( '.tribe-tickets__tickets-buy' ).on( 'click', function() {
			setTimeout( function() {
				var input = jQuery( '.tribe-dialog .tribe-tickets__tickets-item-quantity-number-input' );

				if ( ! input.parent().hasClass( 'quantity' ) ) {
					input.addClass( 'qty' ).wrap( '<div class="quantity"></div>' );
					avadaAddQuantityBoxes( '.qty', input );
				}
			}, 300 );
		} );

		jQuery( '.tribe-events-tickets-rsvp' ).find( '.quantity input' ).on( 'change', function() {
			setTimeout( function() {
				calcSelectArrowDimensions();
			}, 100 );
		} );
	}

	// Disable the navigation top and bottom lines, when there is no prev and next nav
	if ( ! navPrevHTML.length && ! navNextHTML.length ) {
		jQuery( '.tribe-events-sub-nav' ).parent( '#tribe-events-footer' ).hide();
	}

	jQuery( '.fusion-tribe-has-featured-image' ).each( function() {
		var height = jQuery( this ).parent().height();
		jQuery( this ).find( '.tribe-events-event-image' ).css( 'height', height );
	} );

	jQuery( window ).on( 'resize', function() {

		var height;

		jQuery( '.fusion-tribe-has-featured-image' ).each( function() {
			jQuery( this ).find( '.tribe-events-event-image' ).css( 'height', 'auto' );
			height = jQuery( this ).parent().height();
			jQuery( this ).find( '.tribe-events-event-image' ).css( 'height', height );
		} );
	} );

	if ( jQuery( 'body' ).hasClass( 'avada-ec-views-v2' ) ) {
		jQuery( window ).on( 'resize', function() {

			clearTimeout( resizeTimer );
			resizeTimer = setTimeout( toggleMobileClass, 200 );
		} );
	}
} );

function toggleMobileClass() {
	if ( 768 >= jQuery( window ).width() ) {
		jQuery( 'body' ).addClass( 'tribe-mobile' );
	} else {
		jQuery( 'body' ).removeClass( 'tribe-mobile' );
	}
}

jQuery( document ).ajaxComplete( function() {
	var postsContainer,
		posts;

	if ( jQuery( 'body' ).hasClass( 'events-archive' ) || jQuery( 'body' ).find( '.tribe-events-shortcode .fusion-blog-layout-grid' ).length ) {
		postsContainer = ( jQuery( this ).parents( '#tribe-events' ).length ) ? jQuery( this ) : jQuery( '#tribe-events .fusion-blog-layout-grid' );
		posts = postsContainer.find( '.post' );

		posts.each( function() {
			jQuery( this ).find( '.fusion-post-slideshow' ).flexslider();
			jQuery( this ).find( '.full-video, .video-shortcode, .wooslider .slide-content' ).fitVids();
		} );

		// Fade in new posts when all images are loaded, then relayout isotope.
		postsContainer.css( 'height', postsContainer.height() );
		posts.hide();
		imagesLoaded( posts, function() {

			postsContainer.css( 'height', '' );
			posts.fadeIn();

			// Relayout isotope.
			postsContainer.isotope();
			jQuery( window ).trigger( 'resize', false );

			// Refresh the scrollspy script for one page layouts.
			jQuery( '[data-spy="scroll"]' ).each( function() {
				jQuery( this ).scrollspy( 'refresh' );
			} );
		} );
	}

	if ( jQuery( 'body' ).hasClass( 'events-archive' ) ) {
		jQuery( '.fusion-tribe-has-featured-image' ).each( function() {
			var height = jQuery( this ).parent().height();
			jQuery( this ).find( '.tribe-events-event-image' ).css( 'height', height );
		} );

		if ( jQuery( '.fusion-page-title-bar h1' ).length ) {
			if ( jQuery( '#tribe-events-header' ).length ) {
				jQuery( '.fusion-page-title-bar h1' ).html( jQuery( '#tribe-events-header' ).data( 'viewtitle' ) );
			} else if ( jQuery( '.tribe-events-page-title' ).length ) {
				jQuery( '.fusion-page-title-bar h1' ).html( jQuery( '.tribe-events-page-title' ).html() );
			}
		}
	}
} );

jQuery( window ).on( 'load', function() {

	// Events Calendar Reinitialize Scripts.
	jQuery( '.tribe_events_filters_close_filters, .tribe_events_filters_show_filters' ).on( 'click', function() {
		var tribeEvents = jQuery( this );

		setTimeout( function() {
			jQuery( tribeEvents ).parents( '#tribe-events-content-wrapper' ).find( '.fusion-blog-layout-grid' ).isotope();
		} );
	} );
} );
