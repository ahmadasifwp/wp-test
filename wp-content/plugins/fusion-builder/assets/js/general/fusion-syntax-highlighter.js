( function( jQuery ) {

	'use strict';

	var fusionSyntaxHighlighter = function( syntaxHighlighterTextarea ) {
		var syntaxHighlighter,
			syntaxHighlighterSettings;

		// Set settings to empty for each highlighter.
		syntaxHighlighterSettings = {};

		// Set custom values as per the settings set by user.
		syntaxHighlighterSettings.readOnly     = ( 'undefined' !== typeof jQuery( syntaxHighlighterTextarea ).data( 'readonly' ) ) ? jQuery( syntaxHighlighterTextarea ).data( 'readonly' ) : false;
		syntaxHighlighterSettings.lineNumbers  = ( 'undefined' !== typeof jQuery( syntaxHighlighterTextarea ).data( 'linenumbers' ) ) ? jQuery( syntaxHighlighterTextarea ).data( 'linenumbers' ) : false;
		syntaxHighlighterSettings.lineWrapping = ( 'undefined' !== typeof jQuery( syntaxHighlighterTextarea ).data( 'linewrapping' ) ) ? jQuery( syntaxHighlighterTextarea ).data( 'linewrapping' ) : false;
		syntaxHighlighterSettings.theme        = ( 'undefined' !== typeof jQuery( syntaxHighlighterTextarea ).data( 'theme' ) ) ? jQuery( syntaxHighlighterTextarea ).data( 'theme' ) : 'default';
		syntaxHighlighterSettings.mode         = ( 'undefined' !== typeof jQuery( syntaxHighlighterTextarea ).data( 'mode' ) ) ? jQuery( syntaxHighlighterTextarea ).data( 'mode' ) : 'text/html';

		// Instantiate new CodeMirror for each highlighter.
		syntaxHighlighter = wp.CodeMirror.fromTextArea( syntaxHighlighterTextarea, syntaxHighlighterSettings );
		jQuery( syntaxHighlighterTextarea ).addClass( 'code-mirror-initialized' );

		// Make sure the highlighter don't add extra lines.
		syntaxHighlighter.setSize( '100%', 'auto' );
		jQuery( document ).trigger( 'resize' );
		jQuery( syntaxHighlighterTextarea ).parents( '.fusion-syntax-highlighter-container' ).css( 'opacity', '1' );
	};

	jQuery( document ).on( 'ready', function() {
		var syntaxHighlighterTextareas = jQuery( '.fusion-syntax-highlighter-textarea' ),
			clickToCopyTextarea,
			parentTabs,
			parentToggle;

		// Loop through all highlighter instances on a page.
		jQuery.each( syntaxHighlighterTextareas, function( index, syntaxHighlighterTextarea ) {

			parentTabs   = jQuery( syntaxHighlighterTextarea ).parents( '.fusion-tabs' );
			parentToggle = jQuery( syntaxHighlighterTextarea ).parents( '.fusion-panel' );

			if ( jQuery( syntaxHighlighterTextarea ).parents( '.fusion-builder-element-content' ).length ) {
				return;
			}

			// Check if the highlighter is inside tab content.
			if ( parentTabs.length ) {

				// If the highlighter element is inside first tab, make sure it is initialized.
				if ( 0 === parentTabs.find( '.nav-tabs li.active' ).index() && parentTabs.find( '.nav-tabs li.active .tab-link' ).attr( 'href' ) === '#' + jQuery( syntaxHighlighterTextarea ).parents( '.tab-pane' ).attr( 'id' ) ) {
					fusionSyntaxHighlighter( syntaxHighlighterTextarea );
				} else {
					parentTabs.find( '.tab-link' ).on( 'click', function() {
						if ( jQuery( this ).attr( 'href' ) === '#' + jQuery( syntaxHighlighterTextarea ).parents( '.tab-pane' ).attr( 'id' ) && ! jQuery( syntaxHighlighterTextarea ).hasClass( 'code-mirror-initialized' ) ) {
							setTimeout( function() {
								fusionSyntaxHighlighter( syntaxHighlighterTextarea );
							}, 200 );
						}
					} );
				}
			} else if ( parentToggle.length ) {

				// If the highlighter element is inside active or default open toggle, make sure it is initialized.
				if ( parentToggle.find( '.panel-title a.active' ).length ) {
					syntaxHighlighterTextarea = parentToggle.find( parentToggle.find( '.panel-title a.active' ).attr( 'href' ) ).find( '.fusion-syntax-highlighter-textarea' )[ 0 ];
					fusionSyntaxHighlighter( syntaxHighlighterTextarea );
				}

				parentToggle.find( '.panel-title a' ).on( 'click', function() {
					if ( jQuery( this ).attr( 'href' ) === '#' + jQuery( syntaxHighlighterTextarea ).parents( '.panel-collapse' ).attr( 'id' ) && ! jQuery( syntaxHighlighterTextarea ).hasClass( 'code-mirror-initialized' ) ) {
						setTimeout( function() {
							fusionSyntaxHighlighter( syntaxHighlighterTextarea );
						}, 200 );
					}
				} );
			} else {
				fusionSyntaxHighlighter( syntaxHighlighterTextarea );
			}
		} );

		// Handle click to copy.
		jQuery( '.syntax-highlighter-copy-code-title' ).on( 'click', function() {
			var $this = jQuery( this );

			clickToCopyTextarea = document.getElementById( jQuery( this ).data( 'id' ) );

			$this.parent( '.syntax-highlighter-copy-code' ).addClass( 'syntax-highlighter-copying' );

			jQuery( clickToCopyTextarea ).removeAttr( 'style' ).css( { position: 'absolute', left: '-1000%' } );

			// Select the text in textarea.
			jQuery( clickToCopyTextarea ).select();

			// Copy the text inside the textarea field.
			document.execCommand( 'Copy', false, null );

			setTimeout( function() {
				$this.parent( '.syntax-highlighter-copy-code' ).removeClass( 'syntax-highlighter-copying' );
			}, 200 );
		} );
	} );
}( jQuery ) );
