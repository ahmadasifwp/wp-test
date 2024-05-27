/* global avadaSideNavVars */
jQuery( document ).ready( function() {

	// Side nav drop downs
	jQuery( '.side-nav-left .side-nav li' ).each( function() {
		if ( jQuery( this ).find( '> .children' ).length ) {
			if ( jQuery( '.rtl' ).length ) {
				jQuery( this ).find( '> a' ).prepend( '<span class="arrow"></span>' );
			} else {
				jQuery( this ).find( '> a' ).append( '<span class="arrow"></span>' );
			}
		}
	} );

	jQuery( '.side-nav-right .side-nav li' ).each( function() {
		if ( jQuery( this ).find( '> .children' ).length ) {
			if ( jQuery( 'body.rtl' ).length ) {
				jQuery( this ).find( '> a' ).append( '<span class="arrow"></span>' );
			} else {
				jQuery( this ).find( '> a' ).prepend( '<span class="arrow"></span>' );
			}
		}
	} );

	jQuery( '.side-nav .current_page_item' ).each( function() {
		var parent   = jQuery( this ).parent(),
			children = jQuery( this ).find( '.children' );

		if ( children.length ) {
			children.show( 'slow' );
		}

		if ( parent.hasClass( 'side-nav' ) ) {
			jQuery( this ).find( 'ul' ).show( 'slow' );
		}

		if ( parent.hasClass( 'children' ) ) {
			jQuery( this ).parents( 'ul' ).show( 'slow' );
		}
	} );
} );

jQuery( window ).on( 'load', function() {
	if ( 'click' === avadaSideNavVars.sidenav_behavior ) {
		jQuery( '.side-nav li a .arrow' ).on( 'click', function( e ) {
			var parentParent = jQuery( this ).parent().parent(),
				children     = parentParent.find( '> .children' );

			e.preventDefault();

			if ( parentParent.hasClass( '.page_item_has_children' ).length ) {
				if ( children.length  && ! children.is( ':visible' ) ) {
					children.stop( true, true ).slideDown( 'slow' );
				} else {
					children.stop( true, true ).slideUp( 'slow' );
				}
			}

			if ( jQuery( this ).parent().parent( '.page_item_has_children.current_page_item' ).length ) {
				return false;
			}
		} );
	} else {

		jQuery( '.side-nav li' ).each( function() {
			var timeout;

			jQuery( this ).hover(
				function() {
					var children = jQuery( this ).find( '> .children' );

					clearTimeout( timeout );
					timeout = setTimeout( function() {
						if ( children.length ) {
							children.stop( true, true ).slideDown( 'slow' );
						}
					}, 500 );
				},
				function() {
					var self     = jQuery( this ),
						children = self.find( '.children' );

					clearTimeout( timeout );
					timeout = setTimeout( function() {
						if ( 0 === self.find( '.current_page_item' ).length && false === self.hasClass( 'current_page_item' ) ) {
							children.stop( true, true ).slideUp( 'slow' );
						}
					}, 500 );
				}
			);
		} );
	}
} );
