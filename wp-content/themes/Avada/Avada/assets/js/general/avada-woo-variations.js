jQuery( document ).ready( function() {
	var selectObserver;

	// Initial init to make sure swatch matches select.
	jQuery( '.avada-select-wrapper' ).each( function() {
		var $select   = jQuery( this ).find( 'select' ),
			selectVal = $select.val(),
			$active   = jQuery( this ).find( '[data-value="' + selectVal + '"]' ),
			$selected = jQuery( this ).find( '[data-checked]' );

		if ( $active.length && ! $active.is( '[data-checked]' ) ) {
			$selected.removeAttr( 'data-checked' );
			$active.attr( 'data-checked', true );

		}
	} );

	// Clicking on a swatch.
	jQuery( 'body' ).on( 'click', '.avada-color-select, .avada-image-select, .avada-button-select', function ( event ) {
		var $wrapper = jQuery( this ).closest( '.avada-select-wrapper' ),
			$select  = $wrapper.find( 'select' ),
			value    = jQuery( this ).attr( 'data-value' );

		if ( $wrapper.length ) {
			event.preventDefault();
		}

		// Swatch is disabled, do nothing.
		if ( jQuery( this ).attr( 'data-disabled' ) ) {
			return;
		}

		// Clicking again on active, make inactive.
		if ( jQuery( this ).is( '[data-checked]' ) ) {
			$wrapper.find( '[data-checked]' ).removeAttr( 'data-checked' );
			$select.val( '' ).trigger( 'change.wc-variation-form' );
			return;
		}

		// Active highlighting.
		$wrapper.find( '[data-checked]' ).removeAttr( 'data-checked' );

		jQuery( this ).attr( 'data-checked', true );

		// Change on hidden select.
		$select.val( value ).trigger( 'change.wc-variation-form' );
	} );

	function handleSelectChange( e ) {
		var i,
			closestSelect;

		// Check if we are on the correct element for either jquery event(deprecated), or MutationObserver.
		if ( e instanceof jQuery.Event ) {
			closestSelect = jQuery( e.target ).closest( 'select' );
			if ( closestSelect.length && closestSelect.closest( '.avada-select-wrapper' ).length ) {
				changeSelect( closestSelect );
			}
		} else { // MutationObserver
			for ( i = 0; i < e.length; i++ ) {
				closestSelect = jQuery( e[ i ].target );
				if ( 'childList' === e[ i ].type && closestSelect.is( 'select' ) && closestSelect.closest( '.avada-select-wrapper' ).length ) {
					changeSelect( closestSelect );
				}
			}
		}

		function changeSelect( $select ) {
			var $wrapper  = $select.closest( 'td.value' ),
				$swatches = $wrapper.find( '.avada-color-select, .avada-button-select, .avada-image-select' );

			$swatches.each( function() {
				var $el = jQuery( this );
				var value = $el.attr( 'data-value' );

				if ( ! $select.find( '[value="' + value + '"]' ).length ) {
					$el.attr( 'data-disabled', true );
				} else {
					$el.removeAttr( 'data-disabled' );
				}
			} );
		}
	}

	if ( window.MutationObserver ) {
		selectObserver = new MutationObserver( handleSelectChange );
		selectObserver.observe( document.querySelector( 'body' ), { attributes: false, childList: true, characterData: true, subtree: true } );
	} else {
		jQuery( 'body' ).on( 'DOMNodeInserted DOMNodeRemoved', handleSelectChange );
	}

	// Update the o_content for the SKU to avoid doubling up because of multiple instances on the page.
	jQuery( 'body' ).on( 'check_variations', '.variations_form', function( variation ) {
		var form = jQuery( variation.currentTarget ),
			$sku = form.closest( '.product' ).find( '.product_meta' ).find( '.sku' );

			if ( 1 < $sku.length ) {
				$sku.each( function() {
					if ( 'undefined' === typeof jQuery( this ).attr( 'data-o-content-set' ) ) {
						jQuery( this ).attr( 'data-o_content', jQuery( this ).text() );
						jQuery( this ).attr( 'data-o-content-set', true );
					} else if ( jQuery( this ).closest( '.fusion-layout-column' ).hasClass( 'post-card' ) ) {
						jQuery( this ).text( jQuery( this ).attr( 'data-o_content' ) );
					}
				} );
			}
	} );

	jQuery( 'body' ).on( 'reset_data', '.variations_form', function( variation ) {
		var form     = jQuery( variation.currentTarget ),
			$sku     = form.closest( '.product' ).find( '.product_meta' ).find( '.sku' );

		if ( 1 < $sku.length ) {
			jQuery( $sku ).each( function() {
				if ( jQuery( this ).closest( '.fusion-layout-column' ).hasClass( 'post-card' ) && 'undefined' !== typeof jQuery( this ).attr( 'data-o_content' ) ) {
					jQuery( this ).text( jQuery( this ).attr( 'data-o_content' ) );
				}
			} );
		}
	} );

	// Form is fully reset.
	jQuery( 'body' ).on( 'click', '.reset_variations', function() {
		jQuery( '.product' ).find( '.product_meta' ).find( '.sku' ).each( function() {
			if ( 'undefined' !== typeof jQuery( this ).attr( 'data-o_content' ) ) {
				jQuery( this ).text( jQuery( this ).attr( 'data-o_content' ) );
			}
		} );

		jQuery( this ).closest( '.variations_form' ).find( '[data-checked]' ).removeAttr( 'data-checked' );
	} );
} );
