/* global avadaCommentVars */
jQuery( document ).ready( function() {

	var $titleSep,
		$titleSepClassString,
		$styles,
		i;

	// Comment form title changes
	if ( jQuery( '.comment-respond .comment-reply-title' ).length && ! jQuery( '.comment-respond .comment-reply-title' ).parents( '.fusion-comments-tb' ).length && ! jQuery( '.comment-respond .comment-reply-title' ).parents( '.woocommerce-tabs' ).length ) {
		$titleSep                = avadaCommentVars.title_style_type.split( ' ' );
		$titleSepClassString     = '';

		for ( i = 0; i < $titleSep.length; i++ ) {
			$titleSepClassString += ' sep-' + $titleSep[ i ];
		}

		if ( jQuery( 'body' ).hasClass( 'rtl' ) ) {
			jQuery( '.comment-respond .comment-reply-title' ).addClass( 'title-heading-right' );
		} else {
			jQuery( '.comment-respond .comment-reply-title' ).addClass( 'title-heading-left' );
		}

		$styles = ' style="margin-top:' + avadaCommentVars.title_margin_top + ';margin-bottom:' + avadaCommentVars.title_margin_bottom + ';"';

		jQuery( '.comment-respond .comment-reply-title' ).wrap( '<div class="fusion-title title fusion-title-size-three' + $titleSepClassString + '"' + $styles + '></div>' );

		if ( -1 === $titleSepClassString.indexOf( 'underline' ) ) {
			jQuery( '.comment-respond .comment-reply-title' ).parent().append( '<span class="awb-title-spacer"></span><div class="title-sep-container"><div class="title-sep' + $titleSepClassString + ' "></div></div>' );
		}
	}

	// Text area limit expandability
	jQuery( '.textarea-comment' ).each( function() {
		jQuery( this ).css( 'max-width', jQuery( '#content' ).width() );
	} );

	jQuery( window ).on( 'fusion-resize-horizontal', function() {
		jQuery( '.textarea-comment' ).each( function() {
			jQuery( this ).css( 'max-width', jQuery( '#content' ).width() );
		} );
	} );
} );
