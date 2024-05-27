/* global fusion */

jQuery( document ).ready( function() {
	jQuery( '.fusion-image-hovers .hover-type-liftup.fusion-column-inner-bg' ).on( {
		mouseenter: function() {
			var parentColumn = jQuery( this ).closest( '.fusion_builder_column' );

			jQuery( this ).css( 'z-index', '4' );
			jQuery( this ).siblings( '.fusion-column-wrapper' ).css( 'z-index', '5' );

			if ( 'none' !== parentColumn.css( 'filter' ) && 'auto' === parentColumn.css( 'z-index' ) ) {
				parentColumn.css( 'z-index', '1' );
				parentColumn.attr( 'data-filter-zindex', 'true' );
			}
		},
		mouseleave: function() {
			var parentColumn = jQuery( this ).closest( '.fusion_builder_column' );

			jQuery( this ).css( 'z-index', '' );
			jQuery( this ).siblings( '.fusion-column-wrapper' ).css( 'z-index', '' );

			if ( 'true' === parentColumn.data( 'filter-zindex' ) ) {
				parentColumn.css( 'z-index', '' );
				parentColumn.removeAttr( 'data-filter-zindex' );
			}
		}
	} );
} );

jQuery( window ).on( 'load fusion-sticky-change fusion-resize-horizontal', fusionInitStickyColumns );
function fusionInitStickyColumns() {
	if ( 'object' === typeof fusion && 'function' === typeof fusion.getHeight ) {
		jQuery( '.awb-sticky[data-sticky-offset]' ).each( function() {
			jQuery( this )[ 0 ].style.setProperty( '--awb-sticky-offset', ( fusion.getHeight( jQuery( this ).attr( 'data-sticky-offset' ) ) + fusion.getAdminbarHeight() ) + 'px' );
		} );
	}
}
