jQuery( document ).ready( function() {
	jQuery( '.fusion-vertical-menu-widget .current_page_item, .fusion-vertical-menu-widget .current-menu-item' ).each( function() {
		var self       = jQuery( this ),
			parentItem = self.parent();

		if ( self.find( '.children, .sub-menu' ).length ) {
			self.find( '.children, .sub-menu' ).show( 'slow' );
		}

		self.parentsUntil( '.fusion-vertical-menu-widget', '.children, .sub-menu' ).show( 'slow' );

		if ( parentItem.hasClass( 'fusion-vertical-menu-widget' ) ) {
			self.find( 'ul' ).show( 'slow' );
		}

	} );
} );

jQuery( window ).on( 'load', function() {
	jQuery( '.fusion-vertical-menu-widget.click li a .arrow' ).on( 'click', function( e ) {
		var parent       = jQuery( this ).parent(),
			parentParent = parent.parent(),
			subMenu      = parentParent.find( '> .children, > .sub-menu' );

		e.preventDefault();
		if ( parentParent.hasClass( 'page_item_has_children' ) || parentParent.hasClass( 'menu-item-has-children' ) ) {
			if ( subMenu.length  && ! subMenu.is( ':visible' ) ) {
				subMenu.stop( true, true ).slideDown( 'slow' );
			} else {
				subMenu.stop( true, true ).slideUp( 'slow' );
			}
		}

		if ( parent.parent( '.page_item_has_children.current_page_item, .menu-item-has-children.current-menu-item' ).length ) {
			return false;
		}
	} );

	jQuery( '.fusion-vertical-menu-widget.hover li' ).each( function() {
		var timeout;

		jQuery( this ).hover(
			function() {
				var subMenu = jQuery( this ).find( '> .children, > .sub-menu' );

				clearTimeout( timeout );
				timeout = setTimeout( function() {
					if ( subMenu.length ) {
						subMenu.stop( true, true ).slideDown( 'slow' );
					}
				}, 500 );
			},
			function() {
				var self    = jQuery( this ),
					subMenu = self.find( '.children, .sub-menu' );

				clearTimeout( timeout );
				timeout = setTimeout( function() {
					if ( ( 0 === self.find( '.current_page_item' ).length && false === self.hasClass( 'current_page_item' ) )  ) {
						subMenu.stop( true, true ).slideUp( 'slow' );
					}
				}, 500 );
			}
		);
	} );
} );
