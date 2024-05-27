/* global cssua */
jQuery( document ).ready( function() {
	jQuery( '.fusion-sharing-box' ).each( function() {
		if ( ! jQuery( 'meta[property="og:title"]' ).length ) {
			jQuery( 'head title' ).after( '<meta property="og:title" content="' + jQuery( this ).data( 'title' )  + '"/>' );
			jQuery( 'head title' ).after( '<meta property="og:description" content="' + jQuery( this ).data( 'description' )  + '"/>' );
			jQuery( 'head title' ).after( '<meta property="og:type" content="article"/>' );
			jQuery( 'head title' ).after( '<meta property="og:url" content="' + jQuery( this ).data( 'link' )  + '"/>' );
			jQuery( 'head title' ).after( '<meta property="og:image" content="' + jQuery( this ).data( 'image' )  + '"/>' );
		}
	} );

	if ( cssua.ua.mobile ) {
		jQuery( '.fusion-social-network-icon, .fusion-facebook-sharer-icon, .fusion-social-networks span a' ).each( function( i, icon ) {
			if ( 'string' === typeof icon.href && 0 === icon.href.indexOf( 'https://www.facebook.com/sharer.php' ) ) {
				icon.setAttribute( 'href', icon.href.replace( 'https://www.facebook.com/sharer.php', 'https://m.facebook.com/sharer.php' ) );
			}
		} );
	}
} );
