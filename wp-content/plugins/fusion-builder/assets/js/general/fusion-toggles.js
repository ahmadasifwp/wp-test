( function( jQuery ) {

	'use strict';

	// Change active tab when a link containing a tab ID is clicked; on and off page
	jQuery.fn.fusionSwitchAccordionOnLinkClick = function( $customID ) {

		var $linkHash;

		// The custom_id is used for on page links
		if ( $customID ) {
			$linkHash = $customID;
		} else {
			$linkHash = ( '#_' === document.location.hash.substring( 0, 2 ) ) ? document.location.hash.replace( '#_', '#' ) : document.location.hash;
		}

		if ( $linkHash && jQuery( this ).find( '.panel-title a[href="' + $linkHash  + '"]' ).length ) {
			jQuery( this ).find( '.panel-title a[href="' + $linkHash  + '"]' ).fusionAccordionDoClick( true );
		}

	};

	jQuery.fn.fusionAccordionDoClick = function( collapsedIn ) {

		var clickedToggle,
			toggleContentToActivate,
			toggleChildren,
			panelChildren;

		// Make sure nothing happens, while one toggle is still transitioning.
		if ( jQuery( this ).closest( '.fusion-accordian' ).find( '.toggle-fadein' ).length && jQuery( this ).closest( '.fusion-accordian' ).find( '.toggle-fadein' )[ 0 ] !== jQuery( this ).closest( '.fusion-panel' ).find( '.panel-collapse' )[ 0 ] ) {
			return;
		}

		if ( true === window.fusionAccordianClick ) {
			return;
		}
		window.fusionAccordianClick = true;

		clickedToggle = jQuery( this );
		toggleContentToActivate = jQuery( jQuery( this ).data( 'target' ) ).find( '.panel-body' );
		toggleChildren = clickedToggle.closest( '.fusion-accordian' ).find( '.panel-title a' );
		panelChildren = clickedToggle.closest( '.fusion-accordian' ).find( '.panel-collapse.in' );

		// Apply state of show/hide panel
		if ( collapsedIn && 'true' !== clickedToggle.attr( 'aria-expanded' ) ) {
			if ( 'undefined' !== typeof clickedToggle.data( 'parent' ) ) {
				panelChildren.removeClass( 'in' );
			}
			toggleContentToActivate.parent().addClass( 'in' );
		}

		// Toggle aria-expanded & aria-selected.
		if ( 'false' === clickedToggle.attr( 'aria-expanded' ) ) {
			if ( 'undefined' !== typeof clickedToggle.data( 'parent' ) ) {
				toggleChildren.attr( 'aria-expanded', 'false' );
			}
			clickedToggle.attr( 'aria-expanded', 'true' );
		} else {
			clickedToggle.attr( 'aria-expanded', 'false' );
		}

		if ( clickedToggle.hasClass( 'collapsed' ) ) {
			if ( 'undefined' !== typeof clickedToggle.data( 'parent' ) ) {
				toggleChildren.removeClass( 'active' );
			} else {
				clickedToggle.removeClass( 'active' );
			}

			// Make equal heights work.
			if ( clickedToggle.closest( '.fusion-fullwidth' ).hasClass( 'fusion-equal-height-columns' ) ) {
				setTimeout( function() {
					window.dispatchEvent( new Event( 'fusion-resize-horizontal', { 'bubbles': true, 'cancelable': true } ) );
				}, 350 );
			}
		} else {
			if ( 'undefined' !== typeof clickedToggle.data( 'parent' ) ) {
				toggleChildren.removeClass( 'active' );
			}
			clickedToggle.addClass( 'active' );

			// Reinitialize dynamic content.
			setTimeout( function() {

				// Trigger init for dynamic content.
				jQuery( window ).trigger( 'fusion-dynamic-content-render', toggleContentToActivate );

				jQuery( window ).trigger( 'fusion-resize-vertical' );
				jQuery( window ).trigger( 'resize' );
			}, 350 );
		}

		window.fusionAccordianClick = false;

	};

}( jQuery ) );

jQuery( window ).on( 'load', function() {

	var $targetEl = jQuery( '.fusion-accordian' );

	// Boxed toggles should be clickable everywhere.
	jQuery( '.fusion-toggle-boxed-mode .panel-collapse' ).on( 'click', function( e ) {
		if ( ! jQuery( e.target ).is( 'a' ) && ! jQuery( e.target ).is( 'button' ) && ! jQuery( e.target ).hasClass( 'fusion-button-text' ) ) {
			jQuery( this ).closest( '.fusion-panel' ).find( '.panel-title > a' ).trigger( 'click' );
		}
	} );

	window.fusionAccordianClick = false;

	$targetEl.each( function() {
		jQuery( this ).fusionSwitchAccordionOnLinkClick();
	} );

	// Toggles.
	jQuery( document ).on( 'click dblclick', '.fusion-accordian .panel-title a', function( e ) {

		e.preventDefault();

		jQuery( e.currentTarget ).fusionAccordionDoClick();

	} );
} );

jQuery( document ).ready( function() {
	jQuery( '.fusion-accordian .panel-title a' ).on( 'click', function( e ) {
		e.preventDefault();
	} );
} );
