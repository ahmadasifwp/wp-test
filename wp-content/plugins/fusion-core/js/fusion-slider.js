jQuery( document ).ready( function() {

	var type,
		container,
		heading_bg,
		caption_bg;

	jQuery( window ).scrollTop( 0 );

	jQuery( '.wp-list-table #slug span:first,label[for=tag-slug],label[for=slug]' ).text( 'Shortcode' );
	jQuery( '.wp-list-table .column-description' ).attr( 'style', 'display:none !important' );
	jQuery( '.wp-list-table .column-slug' ).css( 'width', '33%' );

	jQuery( 'label[for=tag-slug],label[for=slug]' ).parents( '.form-field' ).find( 'p' ).text( 'This is the shortcode name that can be used in the post content area. Use only lowercase letters, numbers, and hyphens.' );
	jQuery( '#parent, #tag-description, #description' ).parents( '.form-field' ).hide();

	jQuery( 'label[for=tag-name],label[for=name]' ).parents( '.form-field' ).find( 'p' ).text( 'The name of your slider.' );
	jQuery( '.revslider_settings' ).parents( '.postbox' ).hide();

	jQuery( '.metabox-prefs #slugdiv-hide, .metabox-prefs #mymetabox_revslider_0-hide, .metabox-prefs #slug-hide' ).parents( 'label' ).hide();
	jQuery( '#normal-sortables' ).hide();

	type       = jQuery( '#pyre_type' ).val();
	container  = jQuery( '#pyre_type' ).parents( '.pyre_metabox' );
	heading_bg = jQuery( '#pyre_heading_bg' ).val();
	caption_bg = jQuery( '#pyre_caption_bg' ).val();
	jQuery( container ).find( '.video_settings .pyre_metabox_field' ).hide();

	if ( 'self-hosted-video' === type || 'youtube' === type || 'vimeo' === type ) {
		jQuery( container ).find( '.video_settings' ).slideDown();

		jQuery( container ).find( '.video_settings' ).find( '#pyre_video_bg_color, #pyre_mute_video, #pyre_autoplay_video, #pyre_loop_video, #pyre_hide_video_controls' ).parents( '.pyre_metabox_field' ).show();

		if ( 'youtube' === type || 'vimeo' === type ) {
			jQuery( container ).find( '.video_settings' ).find( '#pyre_aspect_ratio' ).parents( '.pyre_metabox_field' ).show();
			jQuery( container ).find( '.video_settings' ).find( '#pyre_video_display' ).parents( '.pyre_metabox_field' ).show();
		}

		if ( 'youtube' === type ) {
			jQuery( container ).find( '.video_settings #pyre_youtube_id' ).parents( '.pyre_metabox_field' ).show();
		} else if ( 'vimeo' === type ) {
			jQuery( container ).find( '.video_settings #pyre_vimeo_id' ).parents( '.pyre_metabox_field' ).show();
			jQuery( container ).find( '.video_settings #pyre_hide_video_controls' ).parents( '.pyre_metabox_field' ).hide();
		} else if ( 'self-hosted-video' === type ) {
			jQuery( container ).find( '.video_settings #pyre_webm, .video_settings #pyre_mp4, .video_settings #pyre_ogv, .video_settings #pyre_preview_image' ).parents( '.pyre_metabox_field' ).show();
		}
	} else {
		jQuery( container ).find( '.video_settings' ).hide();
	}

	if ( 'no' === heading_bg ) {
		jQuery( '#pyre_heading_bg_color' ).parents( '.pyre_metabox_field' ).hide();
	}

	if ( 'no' === caption_bg ) {
		jQuery( '#pyre_caption_bg_color' ).parents( '.pyre_metabox_field' ).hide();
	}

	if ( 'center' === jQuery( '#pyre_content_alignment' ).val() ) {
		jQuery( container ).find( '#pyre_heading_separator, #pyre_caption_separator' ).parents( '.pyre_metabox_field' ).show();
	} else {
		jQuery( container ).find( '#pyre_heading_separator, #pyre_caption_separator' ).parents( '.pyre_metabox_field' ).hide();
	}

	jQuery( '#pyre_content_alignment' ).on( 'change', function() {
		if ( 'center' === jQuery( this ).val() ) {
			jQuery( container ).find( '#pyre_heading_separator, #pyre_caption_separator' ).parents( '.pyre_metabox_field' ).show();
		} else {
			jQuery( container ).find( '#pyre_heading_separator, #pyre_caption_separator' ).parents( '.pyre_metabox_field' ).hide();
		}
	} );

	jQuery( '#pyre_heading_bg' ).on( 'change', function() {
		if ( 'yes' === jQuery( this ).val() ) {
			jQuery( '#pyre_heading_bg_color' ).parents( '.pyre_metabox_field' ).show();
		} else {
			jQuery( '#pyre_heading_bg_color' ).parents( '.pyre_metabox_field' ).hide();
		}
	} );

	jQuery( '#pyre_caption_bg' ).on( 'change', function() {
		if ( 'yes' === jQuery( this ).val() ) {
			jQuery( '#pyre_caption_bg_color' ).parents( '.pyre_metabox_field' ).show();
		} else {
			jQuery( '#pyre_caption_bg_color' ).parents( '.pyre_metabox_field' ).hide();
		}
	} );

	jQuery( '#pyre_type' ).on( 'change', function() {
		type      = jQuery( this ).val();
		container = jQuery( this ).parents( '.pyre_metabox' );
		jQuery( container ).find( '.video_settings .pyre_metabox_field' ).hide();

		if ( 'self-hosted-video' === type || 'youtube' === type || 'vimeo' === type ) {
			jQuery( container ).find( '.video_settings' ).slideDown();

			jQuery( container ).find( '.video_settings' ).find( '#pyre_video_bg_color, #pyre_mute_video, #pyre_autoplay_video, #pyre_loop_video, #pyre_hide_video_controls' ).parents( '.pyre_metabox_field' ).show();

			if ( 'youtube' === type || 'vimeo' === type ) {
				jQuery( container ).find( '.video_settings' ).find( '#pyre_aspect_ratio' ).parents( '.pyre_metabox_field' ).show();
				jQuery( container ).find( '.video_settings' ).find( '#pyre_video_display' ).parents( '.pyre_metabox_field' ).show();
			}

			if ( 'youtube' === type ) {
				jQuery( container ).find( '.video_settings #pyre_youtube_id' ).parents( '.pyre_metabox_field' ).show();
			} else if ( 'vimeo' === type ) {
				jQuery( container ).find( '.video_settings #pyre_vimeo_id' ).parents( '.pyre_metabox_field' ).show();
				jQuery( container ).find( '.video_settings #pyre_hide_video_controls' ).parents( '.pyre_metabox_field' ).hide();
			} else if ( 'self-hosted-video' === type ) {
				jQuery( container ).find( '.video_settings #pyre_webm, .video_settings #pyre_mp4, .video_settings #pyre_ogv, .video_settings #pyre_preview_image' ).parents( '.pyre_metabox_field' ).show();
			}
		} else {
			jQuery( container ).find( '.video_settings' ).hide();
		}
	} );

	type      = jQuery( '#pyre_link_type' ).val();
	container = jQuery( '#pyre_link_type' ).parents( '.pyre_metabox' );
	jQuery( container ).find( '#pyre_slide_link, #pyre_button_1, #pyre_button_2, #pyre_slide_target' ).parents( '.pyre_metabox_field' ).hide();

	if ( 'button' === type ) {
		jQuery( container ).find( '#pyre_button_1, #pyre_button_2' ).parents( '.pyre_metabox_field' ).show();
	} else {
		jQuery( container ).find( '#pyre_slide_link, #pyre_slide_target' ).parents( '.pyre_metabox_field' ).show();
	}

	jQuery( '#pyre_link_type' ).on( 'change', function() {
		type      = jQuery( this ).val();
		container = jQuery( this ).parents( '.pyre_metabox' );
		jQuery( container ).find( '#pyre_slide_link, #pyre_button_1, #pyre_button_2, #pyre_slide_target' ).parents( '.pyre_metabox_field' ).hide();

		if ( 'button' === type ) {
			jQuery( container ).find( '#pyre_button_1, #pyre_button_2' ).parents( '.pyre_metabox_field' ).show();
		} else {
			jQuery( container ).find( '#pyre_slide_link, #pyre_slide_target' ).parents( '.pyre_metabox_field' ).show();
		}
	} );
} );

jQuery( document ).ajaxComplete( function( event, request, settings ) {
	if ( 'undefined' !== typeof settings.data && 0 === settings.data.indexOf( 'action=add-tag' ) ) {
		jQuery( window ).scrollTop( 0 );

		jQuery( '.wp-list-table #slug span:first,label[for=tag-slug],label[for=slug]' ).text( 'Shortcode' );
		jQuery( '.wp-list-table .column-description' ).attr( 'style', 'display:none !important' );
		jQuery( '.wp-list-table .column-slug' ).css( 'width', '33%' );
	}
} );
