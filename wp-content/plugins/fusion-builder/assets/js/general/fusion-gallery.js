/* global imagesLoaded */
function fusionInitGallery( $masonryGalleryContainer ) {
	var galleryElements;

	if ( $masonryGalleryContainer.data( 'isotope' ) || $masonryGalleryContainer.parents( '.fusion-builder-live-element[data-type="fusion_gallery"]' ).length ) {
		return;
	}

	galleryElements = $masonryGalleryContainer.find( '.fusion-gallery-column' );
	$masonryGalleryContainer.css( 'min-height', '500px' );
	galleryElements.hide();

	if ( $masonryGalleryContainer.hasClass( 'fusion-gallery-layout-masonry' ) && ! $masonryGalleryContainer.hasClass( 'fusion-masonry-has-vertical' ) && 0 < $masonryGalleryContainer.find( '.fusion-grid-column:not(.fusion-grid-sizer)' ).not( '.fusion-element-landscape' ).length ) {
		$masonryGalleryContainer.addClass( 'fusion-masonry-has-vertical' );
	}

	$masonryGalleryContainer.closest( '.awb-gallery-wrapper' ).find( '.awb-gallery-infinite-scroll-handle' ).removeClass( 'is-active' );

	imagesLoaded( galleryElements, function() {

		$masonryGalleryContainer.css( 'min-height', '' );
		galleryElements.fadeIn();

		// Start isotope.
		$masonryGalleryContainer.isotope( {
			layoutMode: 'packery',
			itemSelector: '.fusion-gallery-column',
			isOriginLeft: jQuery( 'body.rtl' ).length ? false : true,
			resizable: true,
			initLayout: false
		} );

		$masonryGalleryContainer.on( 'layoutComplete', function( event ) {
			var gallery = jQuery( event.target );

			// Relayout the wrapping blog isotope grid, if it exists.
			if ( gallery.parents( '.fusion-blog-layout-grid' ).length && ! gallery.parents( '.fusion-blog-layout-grid' ).hasClass( 'fusion-blog-equal-heights' ) ) {
				setTimeout( function() {
					gallery.parents( '.fusion-blog-layout-grid' ).isotope();
				}, 50 );
			}

			// Relayout the wrapping portfolio isotope grid, if it exists.
			if ( gallery.parents( '.fusion-portfolio-wrapper' ).length ) {
				setTimeout( function() {
					gallery.parents( '.fusion-portfolio-wrapper' ).isotope();
				}, 50 );
			}
		} );

		$masonryGalleryContainer.isotope();

		setTimeout( function() {
			window.dispatchEvent( new Event( 'fusion-resize-horizontal', { 'bubbles': true, 'cancelable': true } ) );
			jQuery( document.body ).trigger( 'sticky_kit:recalc' );
		}, 100 );

		// Refresh the scrollspy script for one page layouts.
		jQuery( '[data-spy="scroll"]' ).each( function() {
			jQuery( this ).scrollspy( 'refresh' );
		} );
	} );
}

jQuery( window ).on( 'load', function() {
	jQuery( '.fusion-gallery-layout-grid, .fusion-gallery-layout-masonry' ).each( function() {
		fusionInitGallery( jQuery( this ) );
	} );
} );

jQuery( window ).on( 'fusion-dynamic-content-render', function( event, parent ) {
	var $reInitElems = jQuery( parent ).find( '.fusion-gallery' );

	if ( 0 < $reInitElems.length ) {
		$reInitElems.each( function() {
			jQuery( this ).removeData();
			fusionInitGallery( jQuery( this ) );
		} );
	}
} );

jQuery( document ).ready( function() {

	function fuionGalleryShowNextItems( el ) {
		const container        = jQuery( el ).parents( '.awb-gallery-wrapper' );
		const loadingContainer = container.find( '.awb-gallery-posts-loading-container' );
		const limit            = parseInt( container.attr( 'data-limit' ) );
		const page             = parseInt( container.attr( 'data-page' ) );
		const total            = container.find( '.fusion-gallery-column' ).length;
		var start              = page * limit;
		const end              = start + limit;
		const more             = start < total;
		const isLive           = jQuery( el ).parents( '.fusion-builder-live-element' ).length ? true : false;

		if ( ! more ) {
			fusionGalleryHideNextItemsLoader( loadingContainer, el );
		} else {
			loadingContainer.show();

			container.find( '.fusion-gallery-column' ).slice( start, end ).hide().removeClass( 'awb-gallery-item-hidden' ).delay( 300 ).fadeIn( 100, function() {
				if ( isLive ) {
					window.parent.jQuery( '#fb-preview' ).contents().find( container ).find( '.fusion-gallery-container' ).isotope( 'reveal', this ).isotope( 'layout' );
				} else {
					container.find( '.fusion-gallery-container' ).isotope( 'reveal', this ).isotope( 'layout' );
				}
				loadingContainer.slideUp();
			} );

			container.attr( 'data-page', page + 1 );
			container.find( '.awb-gallery-infinite-scroll-handle' ).removeClass( 'is-active' );

			// Hide button if there are no more items.
			start = ( page + 1 ) * limit;
			if ( start >= total  ) {
				fusionGalleryHideNextItemsLoader( loadingContainer, el );
			}
		}
	}

	function fusionGalleryHideNextItemsLoader( loadingContainer, el ) {
		loadingContainer.show();
		setTimeout( () => {
			loadingContainer.find( '.fusion-loading-spinner' ).hide();
			loadingContainer.find( '.fusion-loading-msg' ).html( window.fusionGalleryVars.no_more_items_msg );
		}, 500 );

		setTimeout( () => {
			loadingContainer.slideUp();
			jQuery( el ).hide();
		}, 1000 );
	}

	// load more button.
	jQuery( 'body' ).on( 'click', '.awb-gallery-load-more-btn', function() {
		event.preventDefault();
		fuionGalleryShowNextItems( this );
	} );

	// Infinite scroll.
	const fusionGalleryInfiniteObserver = new IntersectionObserver(
		( entries ) => {
			entries.forEach( ( entry ) => {
				if ( entry.isIntersecting && !jQuery( entry.target ).hasClass( 'is-active' ) ) {
					jQuery( entry.target ).addClass( 'is-active' );
					fuionGalleryShowNextItems( entry.target );
				}
			} );
		} );

	document.querySelectorAll( '.awb-gallery-infinite-scroll-handle' ).forEach( ( handler ) => {
		fusionGalleryInfiniteObserver.observe( handler );
	} );

	jQuery( document ).on( 'fusion-element-render-fusion_gallery', function( $, cid ) {
		var element = jQuery( 'div[data-cid="' + cid + '"]' ).find( '.awb-gallery-infinite-scroll-handle' );
		if ( element.length && element.hasClass( 'is-active' ) ) {
			element.removeClass( 'is-active' );
			fusionGalleryInfiniteObserver.observe( element[ 0 ] );
		}
	} );
} );

jQuery( document ).on( 'fusion-element-render-fusion_tab fusion-element-render-fusion_tabs fusion-element-render-fusion_toggle fusion-element-render-fusion_tagline_box fusion-element-render-fusion_text', function( $, cid ) {
	jQuery( 'div[data-cid="' + cid + '"]' ).find( '.fusion-gallery' ).each( function() {
		jQuery( this ).removeData();
		fusionInitGallery( jQuery( this ) );
	} );
} );
