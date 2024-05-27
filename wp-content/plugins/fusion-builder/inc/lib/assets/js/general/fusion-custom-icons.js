/* global plupload, fusionUploaderOptions, tryAgain, uploadError */
/* jshint -W098, -W116 */
( function( jQuery ) {

	'use strict';

	jQuery( document ).ready( function() {
		var $uploadButton = jQuery( '#fusion-custom-icons-upload' ),
			uploadOptions = JSON.parse( JSON.stringify( fusionUploaderOptions ) ),
			$container = jQuery( '.fusion-icons-uploader' ),
			uploader;

		// Upload Button.
		$uploadButton.on( 'click', function( event ) {

			var fileFrame,
				$thisEl      = jQuery( this ),
				frameOptions = { // eslint-disable-line camelcase
					title: $thisEl.data( 'title' ),
					multiple: false,
					frame: 'post',
					className: 'media-frame mode-select fusion-builder-media-dialog wp-admin ' + $thisEl.data( 'id' ),
					displayUserSettings: false,
					displaySettings: true,
					allowLocalEdits: true,
					library: { type: 'application/zip' }
				};

			if ( event ) {
				event.preventDefault();
			}

			fileFrame                  = wp.media( frameOptions );
			wp.media.frames.file_frame = wp.media( frameOptions );

			fileFrame.on( 'select insert', function() {
				var state = fileFrame.state();

				state.get( 'selection' ).map( function( attachment ) {
					jQuery( '#fusion-custom-icons-attachment-id' ).val( attachment.id );

					// Icon set is updated.
					if ( 0 < jQuery( '#fusion-custom-icons-update' ).length ) {
						jQuery( '#fusion-custom-icons-update' ).val( 'true' );

						// Remove icons preview.
						jQuery( '.fusion-custom-icon-preview-wrapper' ).remove();
					}

					return attachment;
				} );

			} );

			fileFrame.open();

			return false;
		} );

		// Drop Down Upload Zone.
		if ( 0 < jQuery( '#fusion-icons-uploader-wrapper' ).length ) {

			uploadOptions.multipart_params._ajax_nonce = jQuery( '#fusion-custom-icons-nonce' ).val();

			if ( $container.hasClass( 'multiple' ) ) {
				uploadOptions.multi_selection = true;
			}

			uploader = new plupload.Uploader( uploadOptions );
			uploader.init();

			// EVENTS.

			// File added.
			uploader.bind( 'FilesAdded', function( up, files ) { // eslint-disable-line no-unused-vars
				up.refresh();
				up.start();

				// Show spinner.
				jQuery( '#fusion-icons-uploader-drop-zone .spinner' ).css( 'visibility', 'visible' );
			} );

			// Error.
			uploader.bind( 'Error', function( up, error ) {
				var isImage = error.file && error.file.type && 0 === error.file.type.indexOf( 'image/' ),
					status  = error && error.status;

				// If the file is an image and the error is HTTP 5xx try to create sub-sizes again.
				if ( 'function' === typeof tryAgain && isImage && 500 <= status && 600 > status ) {
					tryAgain( up, error );
					return;
				}

				if ( 'function' === typeof uploadError ) {
					uploadError( error.file, error.code, error.message, up );
				}

				up.refresh();
			} );

			// File uploaded.
			uploader.bind( 'FileUploaded', function( up, file, response ) {
				response = JSON.parse( response.response );

				if ( 'success' == response.status ) {

					// Update hidden input and add success notification.
					jQuery( '#fusion-custom-icons-attachment-id' ).val( response.attachment.id );

					// Populate title if it was left empty.
					if ( '' === jQuery( '#title' ).val() ) {
						jQuery( '#title' ).val( 'Custom Icon Set' );
					}

					// WIP. Save the post and reload the page.
					jQuery( '#publish' ).trigger( 'click' );
				} else {
					// Handle error.
					jQuery( '#fusion-icons-error' ).html( response.error );
				}

				// Hide spinner.
				jQuery( '#fusion-icons-uploader-drop-zone .spinner' ).css( 'visibility', 'hidden' );

			} );
		}

		// Add drag class on dragover.
		jQuery( '#fusion-icons-uploader-drop-zone' ).on( 'dragover', function() {
			jQuery( this ).addClass( 'fusion-drag-over' );
		} );

		// Remove drag class on dragleave and drop.
		jQuery( '#fusion-icons-uploader-drop-zone' ).on( 'dragleave drop', function() {
			jQuery( this ).removeClass( 'fusion-drag-over' );
		} );

	} );

}( jQuery ) );
