/* global calcSelectArrowDimensions, gform */
function wrapGravitySelects( parent ) {
	var selector   = '.gform_wrapper select:not([multiple])',
		$initElems = jQuery( selector );

	if ( 'string' === typeof parent && 'undefined' !== typeof parent ) {
		if ( -1 !== parent.indexOf( '#gform_wrapper' ) ) {
			$initElems = jQuery( parent + selector );
		} else {
			$initElems = jQuery( parent ).find( selector );
		}
	}

	$initElems.filter( ':visible' ).each( function() {
		var currentSelect = jQuery( this );

		setTimeout( function() {
			if ( ! currentSelect.siblings( '.chosen-container' ).length && ! currentSelect.parent( '.gravity-select-parent' ).length ) {
				currentSelect.wrap( '<div class="gravity-select-parent"></div>' );

				jQuery( '<div class="select-arrow">&#xe61f;</div>' ).appendTo( currentSelect.parent( '.gravity-select-parent' ) );
			}
			calcSelectArrowDimensions();
			calcGravitySelectArrowPosition();
		}, 100 );
	} );
}

function calcGravitySelectArrowPosition() {
	jQuery( '.gravity-select-parent' ).each( function() {
		var select      = jQuery( this ).children( 'select' ),
			selectArrow = jQuery( this ).children( '.select-arrow' );

		selectArrow.css( 'left', select.outerWidth() - ( 2 * parseFloat( select.css( 'border-right-width' ) ) ) - selectArrow.width() );
	} );
}

// Unwrap gravity selects that get a chzn field appended on the fly
jQuery( document ).on( 'gform_post_conditional_logic', function() {
	var select = jQuery( '.gform_wrapper select' );
	jQuery( select ).each( function() {
		if ( jQuery( this ).hasClass( 'chzn-done' ) && jQuery( this ).parent().hasClass( 'gravity-select-parent' ) ) {
			jQuery( this ).parent().find( '.select-arrow' ).remove();
			jQuery( this ).unwrap( '<div class="gravity-select-parent"></div>' );
		}
	} );
} );

// Setup a recursive function to handle gform multipart form selects
function recursiveGFormSubmissionHandler() {
	if ( jQuery( '.gform_wrapper' ).find( 'form' ).attr( 'target' ) && -1 < jQuery( '.gform_wrapper' ).find( 'form' ).attr( 'target' ).indexOf( 'gform_ajax_frame' ) ) {
		jQuery( '.gform_wrapper' ).find( 'form' ).submit( function() {
			setTimeout( function() {
				wrapGravitySelects();
				calcSelectArrowDimensions();
				calcGravitySelectArrowPosition();
				recursiveGFormSubmissionHandler();
			}, 800 );
		} );
	}
}
recursiveGFormSubmissionHandler();

// Target specific forms that get rendered. Mainly for conditional logic forms.
jQuery( document ).on( 'gform_post_render', function( event, form_id ) {
	wrapGravitySelects( '#gform_wrapper_' + form_id );
} );

jQuery( window ).on( 'load', function() {

	// Remove gravity IE specific class
	jQuery( '.gform_wrapper' ).each( function() {
		jQuery( this ).removeClass( 'gf_browser_ie' );
	} );

	// Wrap gravity forms select and add arrow
	wrapGravitySelects();

	jQuery( window ).on( 'fusion-resize-horizontal', function() {
		calcGravitySelectArrowPosition();
	} );

	// Update dimensions for gravity form elements with conditional logic.
	if ( 'undefined' !== typeof gform && gform ) {
		gform.addAction( 'gform_post_conditional_logic_field_action', function( formId, action, targetId, defaultValues, isInit ) {
			if ( 'show' === action && ! isInit ) {
				setTimeout( function() {
					calcSelectArrowDimensions();
					wrapGravitySelects();
				}, 50 );
			}
		} );
	}
} );

jQuery( window ).on( 'fusion-dynamic-content-render', function( event, parent ) {
	wrapGravitySelects( parent );
} );
