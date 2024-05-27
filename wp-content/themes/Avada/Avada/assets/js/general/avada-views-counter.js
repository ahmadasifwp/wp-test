/* global avadaViewsCounterVars */
( function( jQuery ) {
	'use strict';

    setTimeout( sendPostViewsRequest, 1000 );
    function sendPostViewsRequest() {
        var postId = window.fusion.getCurrentPostID();

        if ( ! postId || 0 > postId ) {
            return;
        }

        jQuery.ajax( {
			type: 'POST',
			url: avadaViewsCounterVars.ajaxUrl,
			data: {
                action: 'avada_set_ajax_post_views',
                postId: postId
            },
			dataType: 'json'
        } );
    }

}( jQuery ) );
