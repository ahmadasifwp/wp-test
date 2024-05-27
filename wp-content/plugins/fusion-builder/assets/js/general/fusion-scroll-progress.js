/* global fusion */
( function( jQuery ) {

	'use strict';

	// Animate progress bar,
	jQuery.fn.scrollProgress = function() {
		var progressBar = jQuery( this ),
			maxScroll,
			currentScroll,
			widthPercentage,

			getMaxScroll = function () {
				return jQuery( document ).height() - jQuery( window ).height();
			},

			getWidthPercentage = function () {

				// Calculate width in percentage.
				currentScroll = jQuery( window ).scrollTop();
				widthPercentage = Math.ceil( ( currentScroll / maxScroll ) * 100 );

				return 100 < widthPercentage ? 100 : widthPercentage;
			},

			setWidthPercentage = function () {
				progressBar.attr( 'value', getWidthPercentage() );
			},

			setParentRowZindex = function () {
				if ( progressBar.hasClass( 'fusion-fixed-top' ) || progressBar.hasClass( 'fusion-fixed-top' ) ) {
					progressBar.closest( '.fusion-builder-row' ).css( 'z-index', '11' );
				}
			},

			setHtmlTagMargin = function () {
				var htmlTag = jQuery( 'html' );

				if ( progressBar.hasClass( 'fusion-fixed-top' ) ) {
					htmlTag.attr( 'style', 'margin-top:' + fusion.getAdminbarHeight() + 'px!important;' );
				}
			};

		maxScroll = getMaxScroll();

		jQuery( document ).on( 'scroll', setWidthPercentage );

		jQuery( window ).on( 'resize', function () {
			setParentRowZindex();
			setHtmlTagMargin();
			maxScroll = getMaxScroll();
			setWidthPercentage();

			setTimeout( function() {
				maxScroll = getMaxScroll();
				setWidthPercentage();
			}, 700 );
		} );
	};
}( jQuery ) );

jQuery( window ).on( 'load fusion-element-render-fusion_scroll_progress', function( event, cid ) {
	var $targetEl = 'undefined' !== typeof cid ? jQuery( 'div[data-cid="' + cid + '"]' ).find( '.fusion-scroll-progress' ) : jQuery( '.fusion-scroll-progress' );
	$targetEl.scrollProgress();
} );
