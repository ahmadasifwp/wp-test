/* global awbOpenStreetMap, L */
( function( jQuery ) {
	'use strict';

	window.fusion_open_street_map = [];

	function getCenterCoords( data ) {
		if ( ! ( 0 < data.length ) ) {
			return awbOpenStreetMap.default_coords;
		}

		const num_coords = data.length;
		let X, Y, Z, lat, lon, a, b, c, i;

		X = 0.0;
		Y = 0.0;
		Z = 0.0;

		for ( i = 0; i < data.length; i++ ) {
			lat = data[ i ][ 0 ] * Math.PI / 180;
			lon = data[ i ][ 1 ] * Math.PI / 180;

			a = Math.cos( lat ) * Math.cos( lon );
			b = Math.cos( lat ) * Math.sin( lon );
			c = Math.sin( lat );

			X += a;
			Y += b;
			Z += c;
		}

		X /= num_coords;
		Y /= num_coords;
		Z /= num_coords;

		lon = Math.atan2( Y, X );
		const hyp = Math.sqrt( X * X + Y * Y ); // eslint-disable-line no-mixed-operators
		lat = Math.atan2( Z, hyp );

		const newX = ( lat * 180 / Math.PI );
		const newY = ( lon * 180 / Math.PI );

		return [ newX, newY ];
	}

	function updateCoords( obj ) {
		return jQuery( obj ).find( '.awb-openstreet-map-marker' ).map( function() {
			const lat = this.getAttribute( 'data-latitude' );
			const long = this.getAttribute( 'data-longitude' );

			if ( ! lat || ! long ) {
				return null;
			}
			return [ [ lat, long ] ];
		} ).get();
	}

	function renderMap( obj, isLive, cid ) {
		const mapStyle = obj.getAttribute( 'data-map-style' );
		const zoom = obj.getAttribute( 'data-zoom' );
		const zoomSnap = obj.getAttribute( 'data-zoomsnap' );
		const zoomControl = obj.getAttribute( 'data-zoomcontrol' );
		const dragging = obj.getAttribute( 'data-dragging' );
		const touchZoom = obj.getAttribute( 'data-touchzoom' );
		const dbClickZoom = obj.getAttribute( 'data-dbclickzoom' );
		const scrollWheelZoom = obj.getAttribute( 'data-scrollwheelzoom' );
		const mapType = obj.getAttribute( 'data-map-type' );
		const shapeColor = obj.getAttribute( 'data-shape-color' );
		const shapeWeight = obj.getAttribute( 'data-shape-weight' );
		const fitbounds = obj.getAttribute( 'data-fitbounds' );
		const shapeStyle = { color: shapeColor, weight: shapeWeight };
		let coords = updateCoords( obj );
		const markers = [];
		const shapes = [];
		const mapOpts = {
			zoomControl: zoomControl,
			zoomSnap: parseFloat( zoomSnap )
		};

		if ( isLive ) {
			window.fusion_open_street_map[ cid ] = [];
		}

		const map = L.map( obj, mapOpts ).setView( getCenterCoords( coords ), parseFloat( zoom ) );

		L.tileLayer( awbOpenStreetMap.tiles[ mapStyle ].url, {
			attribution: awbOpenStreetMap.tiles[ mapStyle ].attribute
		} ).addTo( map );

		if ( ! dragging ) {
			map.dragging.disable();
		}
		if ( ! scrollWheelZoom ) {
			map.scrollWheelZoom.disable();
		}
		if ( ! touchZoom ) {
			map.touchZoom.disable();
		}
		if ( ! dbClickZoom ) {
			map.doubleClickZoom.disable();
		}

		jQuery( obj ).on( 'awb_openstreetmap/updateCoords', function() {
			const newCoords = getCenterCoords( updateCoords( obj ) );
			map.flyTo( newCoords );
		} ).on( 'awb_openstreetmap/updateMarker', function() {
			// Reset marker points.
			markers.forEach( function( point, index ) {
				map.removeLayer( markers[ index ] );
			} );

			// Reset live markers.
			if ( isLive ) {
				window.fusion_open_street_map[ cid ] = [];
			}

			// Reset shapes.
			shapes.forEach( function( point, index ) {
				map.removeLayer( shapes[ index ] );
			} );

			// Update coords.
			coords = updateCoords( obj );

			jQuery( obj ).find( '.awb-openstreet-map-marker' ).each( function() {
				const lat = this.getAttribute( 'data-latitude' ),
					long = this.getAttribute( 'data-longitude' ),
					content = jQuery( this ).find( '.awb-openstreet-map-content-wrapper' ).html(),
					action = this.getAttribute( 'data-action' ),
					iconEl = jQuery( this ).find( '.awb-openstreet-map-marker-icon-wrapper' ),
					sizeW = iconEl.width(),
					sizeH = iconEl.height();

				if ( ! lat || ! long ) {
					return true;
				}

				const marker = L.marker( [ lat, long ], {
					icon: L.divIcon( {
						iconSize: [ sizeW, sizeH ],
						html: iconEl[ 0 ].outerHTML,
						className: 'awb-openstreet-map-marker-icon'
					} )
				} );

				marker.addTo( map );

				switch ( action ) {
					case 'popup':
						marker.bindPopup( content );
						break;

					case 'static_close_on':
						marker.bindPopup( content, {
							closeOnClick: false,
							autoClose: false,
							closeOnEscapeKey: false
						} ).openPopup();
						break;

					case 'static_close_off':
						marker.bindPopup( content, {
							closeOnClick: false,
							autoClose: false,
							closeButton: false,
							closeOnEscapeKey: false
						} ).openPopup();
						break;

					case 'tooltip':
						marker.bindTooltip( content, { direction: 'top', opacity: 1 } );
						break;
				}

				markers.push( marker );

				if ( isLive ) {
					if ( ! window.fusion_open_street_map[ cid ][ this.getAttribute( 'data-cid' ) ] ) {
						window.fusion_open_street_map[ cid ][ this.getAttribute( 'data-cid' ) ] = [];
					}
					window.fusion_open_street_map[ cid ][ this.getAttribute( 'data-cid' ) ].push( marker );
				}

			} );

			if ( 'polygon' === mapType ) {
				const polygon = L.polygon( coords, shapeStyle ).addTo( map );

				if ( fitbounds ) {
					map.fitBounds( polygon.getBounds() );
				}
				shapes.push( polygon );
			}

			if ( 'polyline' === mapType ) {
				const polyline = L.polyline( coords, shapeStyle ).addTo( map );
				if ( fitbounds ) {
					map.fitBounds( polyline.getBounds() );
				}
				shapes.push( polyline );
			}

			if ( markers.length && 'marker' === mapType && fitbounds ) {
				const group = L.featureGroup( markers );
				const opts = 1 === markers.length ? { animate: true } : {};
				map.fitBounds( group.getBounds(), opts );
			}

		} ).trigger( 'awb_openstreetmap/updateMarker' );

		obj.dataset.isRendered = 1;
	}

	jQuery( window ).on( 'load fusion-element-render-fusion_openstreetmap', function( event, cid ) {
		var isLive = 'undefined' !== typeof cid ? true : false,
			$maps = isLive ? jQuery( 'div[data-cid="' + cid + '"]' ).find( '.awb-openstreet-map' ) : jQuery( '.awb-openstreet-map' );

		$maps.each( function() {
			if ( ! this.dataset.isRendered ) {
				renderMap( this, isLive, cid );
			}
		} );
	} );

}( jQuery ) );
