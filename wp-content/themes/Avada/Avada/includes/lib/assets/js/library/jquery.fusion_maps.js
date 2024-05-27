/* global google, fusionMapsVars, InfoBox, fusionMapNonce */
;( function( $, window, document, undefined ) {

	'use strict';

	var pluginName = 'fusion_maps',
		defaults   = {
			addresses: {},
			address_pin: true,
			animations: true,
			delay: 10, // Delay between each address if over_query_limit is reached
			infobox_background_color: false,
			infobox_styling: 'default',
			infobox_text_color: false,
			map_style: 'default',
			map_type: 'roadmap',
			marker_icon: false,
			overlay_color: false,
			overlay_color_hsl: {},
			pan_control: true,
			show_address: true,
			scale_control: true,
			scrollwheel: true,
			zoom: 9,
			zoom_control: true
		};

	// Plugin Constructor
	function Plugin( $element, $options ) {
		this.element   = $element;
		this.settings  = $.extend( {}, defaults, $options );
		this._defaults = defaults;
		this._name     = pluginName;

		this.geocoder         = new google.maps.Geocoder();
		this.next_address     = 0;
		this.infowindow       = new google.maps.InfoWindow();
		this.markers          = [];
		this.query_sent       = false;
		this.last_cache_index = 'none';
		this.bounds           = new google.maps.LatLngBounds();

		this.init();
	}

	// Avoid Plugin.prototype conflicts
	$.extend( Plugin.prototype, {
		init: function() {
			var mapOptions = {
					zoom: this.settings.zoom,
					mapTypeId: this.settings.map_type,
					scrollwheel: this.settings.scrollwheel,
					scaleControl: this.settings.scale_control,
					panControl: this.settings.pan_control,
					zoomControl: this.settings.zoom_control
				},
				$latlng, $styles,
				$pluginObject = this,
				boundsChanged;

			if ( ! this.settings.scrollwheel ) {
				mapOptions.gestureHandling = 'cooperative';
				delete mapOptions.scrollwheel;
			}

			if ( ! this.settings.address_pin ) {
				this.settings.addresses = [ this.settings.addresses[0] ];
			}

			jQuery.each( this.settings.addresses, function( index ) {
				if ( false === this.cache ) {
					$pluginObject.last_cache_index = index;
				}
			} );

			if ( this.settings.addresses[0].coordinates ) {
				$latlng = new google.maps.LatLng( this.settings.addresses[0].latitude, this.settings.addresses[0].longitude );
				mapOptions.center = $latlng;
			}

			this.map = new google.maps.Map( this.element, mapOptions );

			if ( this.settings.overlay_color && 'custom' === this.settings.map_style ) {
				$styles = [
					{
						stylers: [
							{ hue: this.settings.overlay_color },
							{ lightness: this.settings.overlay_color_hsl.lum * 2 - 100 },
							{ saturation: this.settings.overlay_color_hsl.sat * 2 - 100 }
						]
					},
					{
						featureType: 'road',
						elementType: 'geometry',
						stylers: [
							{ visibility: 'simplified' }
						]
					},
					{
						featureType: 'road',
						elementType: 'labels'
					}
				];

				this.map.setOptions( {
					styles: $styles
				} );
			}

			// Reset zoom level after adding markers
			boundsChanged = google.maps.event.addListener( this.map, 'bounds_changed', function() {
				var $latlng = new google.maps.LatLng( $pluginObject.settings.addresses[0].latitude, $pluginObject.settings.addresses[0].longitude );

				$pluginObject.map.setZoom( $pluginObject.settings.zoom );
				$pluginObject.map.setCenter( $latlng );

				google.maps.event.removeListener( boundsChanged );
			} );

			this.next_geocode_request();
		},

		/**
		 * Geocoding Addresses
		 * @param  object $search object with address
		 * @return void
		 */
		geocode_address: function( $search, index ) {
			var $pluginObject = this,
				$latLngObject,
				$addressObject,
				$latitude,
				$longitude,
				$location,
				$cache = true;

			if ( 'object' === typeof $search && false === $search.cache ) {
				$cache = false;

				if ( true === $search.coordinates ) {
					$latLngObject = new google.maps.LatLng( $search.latitude, $search.longitude );
					$addressObject = { latLng: $latLngObject };
				} else {
					$addressObject = { address: $search.address };
				}

				this.geocoder.geocode( $addressObject, function( $results, $status ) {
					var $latitude,
						$longitude,
						$location,
						$data;

					if ( $status === google.maps.GeocoderStatus.OK ) {

						// When coordiantes have been entered, bypass the geocoder results and use specified coordinates
						if ( true === $search.coordinates ) {
							$location = $latLngObject; // First location
							$latitude = jQuery.trim( $search.latitude );
							$longitude = jQuery.trim( $search.longitude );
						} else {
							$location = $results[0].geometry.location; // First location
							$latitude = $location.lat();
							$longitude = $location.lng();
						}

						$pluginObject.settings.addresses[ index ].latitude  = $latitude;
						$pluginObject.settings.addresses[ index ].longitude = $longitude;

						if ( true === $search.coordinates && '' === $search.infobox_content ) {
							$search.geocoded_address = $results[0].formatted_address;
						}

						// If first address is not a coordinate, set a center through address
						if ( ( 1 === $pluginObject.next_address || '1' === $pluginObject.next_address || true === $pluginObject.next_address ) && ! $search.coordinates ) {
							$pluginObject.map.setCenter( $location );
						}

						if ( $pluginObject.settings.address_pin ) {
							$pluginObject.create_marker( $search, $latitude, $longitude, index );
						}

						if ( 0 === $pluginObject.next_address || '0' === $pluginObject.next_address || false === $pluginObject.next_address ) {
							$pluginObject.map.setCenter( $location );
						}
					} else {

						// If over query limit, go back and try again with a delayed call
						if ( $status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT ) {
							$pluginObject.next_address--;
							$pluginObject.settings.delay++;
						}
					}

					if ( false === $cache && false === $pluginObject.query_sent && $pluginObject.last_cache_index === index && 'undefined' !== typeof fusionMapNonce ) {

						$data = {
							action: 'fusion_cache_map',
							addresses: $pluginObject.settings.addresses,
							security: fusionMapNonce
						};

						jQuery.post( fusionMapsVars.admin_ajax, $data );

						$pluginObject.query_sent = true;
					}

					$pluginObject.next_geocode_request();
				} );
			} else if ( 'object' === typeof $search && true === $search.cache ) {
				$latitude  = jQuery.trim( $search.latitude );
				$longitude = jQuery.trim( $search.longitude );
				$location  = new google.maps.LatLng( $latitude, $longitude );

				if ( true === $search.coordinates && '' === $search.infobox_content ) {
					$search.geocoded_address = $search.geocoded_address;
				}

				if ( $pluginObject.settings.address_pin ) {
					$pluginObject.create_marker( $search, $latitude, $longitude, index );
				}

				if ( 0 === $pluginObject.next_address || '0' === $pluginObject.next_address || false === $pluginObject.next_address ) {
					$pluginObject.map.setCenter( $location );
				}

				$pluginObject.next_geocode_request();
			}
		},
		create_marker: function( $address, $latitude, $longitude, index ) {
			var $pluginObject = this,
				$contentString,
				$markerSettings = {
					position: new google.maps.LatLng( $latitude, $longitude ),
					map: this.map
				},
				$marker;

			this.bounds.extend( $markerSettings.position );

			if ( $address.infobox_content ) {
				$contentString = $address.infobox_content;
			} else {
				$contentString = $address.address;

				// Use google maps suggested address if coordinates were used
				if ( true === $address.coordinates && $address.geocoded_address ) {
					$contentString = $address.geocoded_address;
				}
			}

			if ( this.settings.animations ) {
				$markerSettings.animation = google.maps.Animation.DROP;
			}

			if ( 'custom' === this.settings.map_style && 'theme' === this.settings.marker_icon ) {
				$markerSettings.icon = new google.maps.MarkerImage( $address.marker, null, null, null, new google.maps.Size( 37, 55 ) );
			} else if ( 'custom' === this.settings.map_style && $address.marker ) {
				$markerSettings.icon = $address.marker;
			}

			$marker = new google.maps.Marker( $markerSettings );
			this.markers.push( $marker );

			this.create_infowindow( $contentString, $marker );

			if ( index + 1 >= this.settings.addresses.length ) {
				this.map.setCenter( this.bounds.getCenter() );
			}

			this.map.setZoom( this.settings.zoom );
		},
		create_infowindow: function( $contentString, $marker ) {
			var $infoWindow,
			    $infoBox,
				$infoBoxDiv,
				$infoBoxOptions,
				infoBoxOpenOptions = {
					anchor: $marker,
					shouldFocus: false
				},
				$pluginObject = this;

			if ( 'custom' === this.settings.infobox_styling && 'custom' === this.settings.map_style ) {
				$infoBoxDiv = document.createElement( 'div' );

				$infoBoxOptions = {
					content: $infoBoxDiv,
					disableAutoPan: true,
					maxWidth: 150,
					pixelOffset: new google.maps.Size( -125, 10 ),
					zIndex: null,
					boxStyle: {
						background: 'none',
						opacity: 1,
						width: '250px'
					},
					closeBoxMargin: '2px 2px 2px 2px',
					closeBoxURL: '//www.google.com/intl/en_us/mapfiles/close.gif',
					infoBoxClearance: new google.maps.Size( 1, 1 )
				};

				$infoBoxDiv.className = 'fusion-info-box';
				$infoBoxDiv.style.cssText = 'background-color:' + this.settings.infobox_background_color + ';color:' + this.settings.infobox_text_color  + ';';

				$infoBoxDiv.innerHTML = $contentString;

				$infoBox = new InfoBox( $infoBoxOptions );

				if ( this.settings.show_address ) {
					$infoBox.open( this.map, $marker );
				}

				google.maps.event.addListener( $marker, 'click', function() {
					var $map = $infoBox.getMap();

					if ( null === $map || 'undefined' === typeof $map ) {
						$infoBox.open( $pluginObject.map, this );
					} else {
						$infoBox.close();
					}
				} );
			} else {
				$infoWindow = new google.maps.InfoWindow( {
					disableAutoPan: true,
					content: $contentString
				} );

				if ( this.settings.show_address ) {
					$infoWindow.show = true;
					$infoWindow.open( infoBoxOpenOptions );
				}

				google.maps.event.addListener( $marker, 'click', function() {
					var $map = $infoWindow.getMap();

					if ( null === $map || 'undefined' === typeof $map ) {
						$infoWindow.open( $pluginObject.map, this );
					} else {
						$infoWindow.close();
					}
				} );
			}
		},

		/**
		 * Helps with avoiding OVER_QUERY_LIMIT google maps limit
		 * @return void
		 */
		next_geocode_request: function() {
			var $pluginObject = this;

			if ( $pluginObject.next_address < $pluginObject.settings.addresses.length ) {
				setTimeout( function() {
					$pluginObject.geocode_address( $pluginObject.settings.addresses[$pluginObject.next_address], $pluginObject.next_address );
					$pluginObject.next_address++;
				}, $pluginObject.settings.delay );
			}
		}
	} );

	$.fn[ pluginName ] = function( $options ) {
		this.each( function() {
			if ( ! $.data( this, 'plugin_' + pluginName ) ) {
				$.data( this, 'plugin_' + pluginName, new Plugin( this, $options ) );
			}
		} );

		return this;
	};

}( jQuery, window, document ) );
