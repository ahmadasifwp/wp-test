/* global patcherVars, ajaxurl */
jQuery( document ).ready( function() {
	var applyPatches,
		$patcherTable = jQuery( '.fusion-patcher-table' );

	_.each( patcherVars.args, function( args ) {

		var topMenuElement,
			subMenuElement,
			noticeContent;

		// Only process if the number of available patches is > 0.
		if ( 'undefined' !== typeof patcherVars.patches[ args.context ] && 0 < patcherVars.patches[ args.context ] && 'none' !== patcherVars.display_counter ) {
			topMenuElement = jQuery( '#adminmenu .toplevel_page_' + args.parent_slug + ' .wp-menu-name' );
			subMenuElement = jQuery( '#adminmenu .toplevel_page_' + args.parent_slug + ' ul.wp-submenu li a[href="admin.php?page=' + args.context + '-patcher"]' );

			noticeContent = '<span class="avada-patches-count update-plugins count-' + patcherVars.patches[ args.context ] + '" style="background-color:#65bc7b;margin-left:5px;"><span class="plugin-count">' + patcherVars.patches[ args.context ] + '</span></span>';

			if ( 'sub_level' !== patcherVars.display_counter ) {
				jQuery( noticeContent ).appendTo( topMenuElement );
			}

			if ( 'top_level' !== patcherVars.display_counter ) {
				jQuery( noticeContent ).appendTo( subMenuElement );
				jQuery( noticeContent ).appendTo( jQuery( '.avada-db-menu-sub-item-patcher .avada-db-menu-sub-item-label' ) );
			}

			jQuery( '.avada-db-maintenance-counter' ).show();
		}
	} );

	// Re-apply applied patch.
	jQuery( '.fusion-patcher-table' ).on( 'click', '.awb-patch-applied-icon', function( e ) {
		e.preventDefault();

		jQuery( this ).siblings( '.button.button-primary' ).trigger( 'click' );
	} );

	// Bulk apply patches.
	jQuery( '#bulk-apply-patches' ).on( 'click', function( event ) {
		var patchesArray = [];

		if ( event ) {
			event.preventDefault();
		}

		jQuery.each( jQuery( '.fusion-patcher-table-head:not(.awb-patch-applied)' ), function( index, element ) {
			patchesArray.push( parseInt( jQuery( element ).data( 'patch-id' ) ) );
		} );

		if ( 0 === patchesArray.length ) {
			console.log( 'No patches to apply' ); // eslint-disable-line no-console
			return;
		}

		$patcherTable.addClass( 'awb-bulk-applying-patches' );
		applyPatches( patchesArray );

	} );

	applyPatches = function( patchesArray ) {
		var $patchRow;

		if ( 0 === patchesArray.length ) {

			// Done, patches applied.
			$patcherTable.removeClass( 'awb-bulk-applying-patches' );
			jQuery( '#bulk-apply-patches' ).fadeOut();
			return;
		}

		$patchRow = jQuery( '.fusion-patcher-table-head:not(.awb-patch-applied)[data-patch-id="' + patchesArray[ 0 ] + '"]' );

		$patchRow.addClass( 'awb-patch-applying' );

		jQuery.ajax( {
			type: 'POST',
			url: ajaxurl,
			dataType: 'json',
			data: {
				action: 'awb_apply_patch',
				patchID: patchesArray[ 0 ],
				awb_patcher_nonce: jQuery( '#awb-bulk-patches-nonce' ).val()
			}
		} )
			.done( function( response ) { // eslint-disable-line no-unused-vars
				$patchRow.removeClass( 'awb-patch-applying' );

				if ( true === response.success ) {
					$patchRow.removeClass( 'awb-patch-failed' ).addClass( 'awb-patch-applied' );

					if ( 0 < $patchRow.find( '.patch-apply .button.button-primary' ).length ) {
						$patchRow.find( '.patch-apply .button.button-primary' ).val( patcherVars.patch_applied_text ).after( '<span class="awb-patch-applied-icon"><i class="fusiona-checkmark"></i></span>' );
					} else {
						$patchRow.find( '.patch-apply .button' ).removeClass( 'disabled' ).addClass( 'button-primary' ).html( patcherVars.patch_applied_text ).after( '<span class="awb-patch-applied-icon"><i class="fusiona-checkmark"></i></span>' );
					}

					// Remove applied patch from array.
					patchesArray.shift();

					// Recursive call so next patch is applied.
					applyPatches( patchesArray );
				} else {
					$patchRow.addClass( 'awb-patch-failed' );

					// If it fails that will most likely by the first available patch.
					if ( 0 < $patchRow.find( '.patch-apply .button.button-primary' ).length && 0 === $patchRow.find( '.dismiss-notices' ).length ) {
						$patchRow.find( '.patch-apply .button.button-primary' ).after( '<span class="dismiss-notices"><a class=" fusiona-times-solid" href="' + patcherVars.admin_url + 'admin.php?page=avada-patcher&manually-applied-patch=' + response.data.patch_id + '" title="' + patcherVars.patch_dismiss_notice_text + '"></a><span>' );
					}

					// Clean up.
					$patcherTable.removeClass( 'awb-bulk-applying-patches' );
					jQuery( '#bulk-apply-patches' ).fadeOut();
				}
			} );

	};
} );
