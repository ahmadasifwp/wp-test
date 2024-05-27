
window.awbStudioPreview = {

	/**
	 * Run actions on load.
	 *
	 * @since 3.1
	 *
	 * @return {void}
	 */
	onReady: function() {
		var self = this;

		// Set reusable vars.
		this.colorPalette          = this.getColorPallete();
		this.typoSets              = this.getTypoSets();
		this.invertedColorPaletter = this.getInvertedColorPalette( this.colorPalette );

		/********************
		* Add Listeners.
		*********************/

		// On change.
		jQuery( 'body' ).on( 'change', '.awb-import-style input[name="overwrite-type"], .awb-import-inversion input[name="invert"]', function( e ) {
			e.preventDefault();

			self.triggerPreviewChanges();
		} );

		// On initial load.
		jQuery( window ).on( 'awb-studio-update-preview', function( e ) {
			e.preventDefault();

			self.triggerPreviewChanges();
		} );

		jQuery( window ).on( 'awb-studio-update-palettes', function( e ) {
			e.preventDefault();

			self.colorPalette          = self.getColorPallete();
			self.typoSets              = self.getTypoSets();
			self.invertedColorPaletter = self.getInvertedColorPalette( self.colorPalette );
		} );
	},

	/**
   * Gets local color palette.
   *
   * @since 3.7
   * @return {object}
   */
	getColorPallete: function() {
		var palette = jQuery( '#awb-global-colors' ).html();

		if ( 'undefined' !== typeof window.awbSetupWizard && 'object' === typeof window.awbSetupWizard.colors ) {
			return this.getSetupWizardColors();
		} else if ( 'undefined' !== typeof palette && palette.length ) {
			palette = this.cleanData( palette );
			palette = this.ConvertToKeyValuePair( palette );

			return palette;
		}

		return {};
	},

	/**
   * Gets setup wizard color palette.
   *
   * @since 3.7
   * @return {object}
   */
	getSetupWizardColors: function() {
		var palette = {},
			i,
			colorObject;

		for ( i = 0; i <= Object.keys( window.awbSetupWizard.colors ).length; i++ ) {
			if ( 'undefined' !== typeof window.awbSetupWizard.colors[ 'color' + i ] ) {

				// Get color object;
				colorObject = jQuery.Color( window.awbSetupWizard.colors[ 'color' + i ].color );

				palette[ '--awb-color' + i ]       = window.awbSetupWizard.colors[ 'color' + i ].color;
				palette[ '--awb-color' + i + '-h' ] = colorObject.hue();
				palette[ '--awb-color' + i + '-s' ] = ( colorObject.saturation() * 100 ) + '%';
				palette[ '--awb-color' + i + '-l' ] = ( colorObject.lightness() * 100 ) + '%';
				palette[ '--awb-color' + i + '-a' ] = ( colorObject.alpha() * 100 ) + '%';
			}
		}

		return palette;
	},

	/**
   * Gets local typo sets.
   *
   * @since 3.7
   * @return {object}
   */
	getTypoSets: function() {
		var typoSets = jQuery( '#awb-global-typography' ).html();
		var slug;
		var property;
		var propertyValue;
		var headingSets = jQuery( '.awb-import-options' ).attr( 'data-awb-headings-typographies' );

		if ( 'undefined' !== typeof window.awbSetupWizard && 'object' === typeof window.awbSetupWizard.activeTypoSetData ) {
			return this.getSetupWizardTypography();
		} else if ( 'undefined' !== typeof typoSets && typoSets.length ) {
			typoSets = this.cleanData( typoSets );
			typoSets = this.ConvertToKeyValuePair( typoSets );

			if ( headingSets ) {
				headingSets = JSON.parse( headingSets );
				for ( slug in headingSets ) {
					if ( 'object' === typeof headingSets[ slug ] ) {
						for ( property in headingSets[ slug ] ) {  // eslint-disable-line
							propertyValue = headingSets[ slug ][ property ];
							if ( propertyValue ) { // eslint-disable-line
								typoSets[ '--' + slug + '-' + property ] = propertyValue;
							}
						}
					}
				}
			}

			return typoSets;
		}
	},

	/**
   * Gets setup wizard typo sets.
   *
   * @since 3.7
   * @return {object}
   */
	getSetupWizardTypography: function() {
		var ratio    = jQuery( '#pyre_sizing_type' ).val(),
			baseSize = parseFloat( jQuery( 'input[name="base_size"]' ).val() ),
			typoSet  = {},
			i,
			subsets  = [
				'font-family',
				'font-size',
				'font-weight',
				'font-style',
				'line-height',
				'letter-spacing',
				'text-transform'
			],
			setData  = {
				'small': '--awb-typography5',
				'body': '--awb-typography4',
				'lead': '--awb-typography3',
				'subheadings': '--awb-typography2',
				'headings': '--awb-typography1'
			};

		// default values.
		if ( 'undefined' === typeof ratio || '' === ratio ) {
			ratio = 1.33;
		}

		if ( 'undefined' === typeof baseSize || '' === baseSize ) {
			baseSize = 16;
		}

		jQuery.each( setData, function( name, cssSlug ) {
			subsets.forEach( function( subsetName ) {
				var typoProperty = subsetName.replace( '-', '_' ),
					typoValue;

				if ( 'undefined' !== typeof window.awbSetupWizard.activeTypoSetData[ name ] ) {
					typoValue = window.awbSetupWizard.activeTypoSetData[ name ][ typoProperty ];
					if ( 'font_size' === typoProperty ) {
						if ( 'body' === name || 'lead' === name ) {
							typoValue = parseFloat( baseSize ).toFixed( 2 ) + 'px';
						} else if ( 'small' === name ) {
							typoValue = parseFloat( baseSize * 0.8125 ).toFixed( 2 ) + 'px';
						} else if ( 'subheadings' === name ) {
							typoValue = parseFloat( baseSize * 1.5 ).toFixed( 2 ) + 'px';
						} else if ( 'headings' === name ) {
							typoValue = parseFloat( baseSize * Math.pow( ratio, 5 ) ).toFixed( 2 ) + 'px';
						}
					}

					typoSet[ cssSlug + '-' + subsetName ] = typoValue;
				}
			} );
		} );

		for ( i = 1; 6 >= i; i++ ) {
			typoSet[ '--h' + i + '_typography-font-size' ] = ( baseSize * Math.pow( ratio, 6 - i ) ).toFixed( 2 ) + 'px';
		}

		return typoSet;
	},

	/**
   * Cleans data.
   *
   * @since 3.7
   * @param {string} data - The data to clean.
   * @return {string}
   */
	cleanData: function( data ) {

		data = data.replace( /^\s*\:root\s*{\s*/, '' ); // eslint-disable-line no-useless-escape
		data = data.replace( /\s*}\s*$/, '' );
		data = data.split( ';' );

		return data;
	},

	/**
	 * Converts string to key/value pair object.
	 *
	 * @since 3.7
	 * @param {String} data - The data to convert.
	 * @return {Object}
	 */
	ConvertToKeyValuePair: function( data ) {
		var object = {},
			shouldSkip = [ '--primary_color' ];

		for ( let i = 0; i <= data.length; i++ ) {
			let pair = data[ i ];

			if ( 'string' === typeof pair && '' !== pair ) {
				pair = pair.split( ':' );

				if ( this.valueExists( pair[ 0 ] ) && this.valueExists( pair[ 1 ] ) && ! shouldSkip.includes( pair[ 0 ] ) ) {
					object[ pair[ 0 ] ] = pair[ 1 ];
				}
			}
		}

		return object;
	},

	/**
   * Inverts color palette.
   *
   * @since 3.7
   * @param {Object} palette - The color palette to invert.
   * @return {Boolean}
   */
	getInvertedColorPalette: function( palette ) {
		var reversedPalette = {},
			i,
			revI;

		for ( i = 1, revI = 8; 8 >= i; i++, revI-- ) {
			if ( 'undefined' !== typeof palette[ '--awb-color' + revI ] ) {
				reversedPalette[ '--awb-color' + i ]        = palette[ '--awb-color' + revI ];
				reversedPalette[ '--awb-color' + i + '-h' ] = palette[ '--awb-color' + revI + '-h' ];
				reversedPalette[ '--awb-color' + i + '-s' ] = palette[ '--awb-color' + revI + '-s' ];
				reversedPalette[ '--awb-color' + i + '-l' ] = palette[ '--awb-color' + revI + '-l' ];
				reversedPalette[ '--awb-color' + i + '-a' ] = palette[ '--awb-color' + revI + '-a' ];
			}
		}

		return reversedPalette;
	},

	/**
   * Checks if value exists or not.
   *
   * @since 3.7
   * @param {String} data - The data to check.
   * @return {Boolean}
   */
	valueExists: function( data ) {
		return 'undefined' !== typeof data && '' !== data ? true : false;
	},

	/**
	 * Trigger preview changes.
	 *
	 * @since 3.7
	 * @return {void}
	 */
	triggerPreviewChanges: function() {
		var overWriteType    = jQuery( '.awb-import-options input[name="overwrite-type"]:checked' ).val(),
			shouldInvert     = jQuery( '.awb-import-options input[name="invert"]:checked' ).val(),
			varData          = {
				color_palette: {},
				typo_sets: {},
				shouldInvert: shouldInvert
			};

		if ( 'inherit' === overWriteType ) {
			varData.color_palette = 'do-invert' === shouldInvert ? this.invertedColorPaletter : this.colorPalette;
			varData.typo_sets     = this.typoSets;
		}

		if ( 'undefined' !== typeof awbStudio ) {
			document.getElementsByTagName( 'iframe' )[ 0 ].contentWindow.postMessage( varData, '*' );
		} else {
			jQuery( '.awb-studio-preview-frame' )[ 0 ].contentWindow.postMessage( varData, '*' );
		}
	}
};

( function( jQuery ) {

	'use strict';

	jQuery( document ).ready( function() {

		// Trigger actions on ready event.
		jQuery( document ).ready( function() {
			window.awbStudioPreview.onReady();
		} );

	} );
}( jQuery ) );
