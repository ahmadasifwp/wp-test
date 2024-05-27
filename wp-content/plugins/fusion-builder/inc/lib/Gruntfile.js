/* jshint -W117 */
module.exports = function( grunt ) {

	// Project configuration.
	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),

		concat: {
			options: {
				separator: ';'
			},
			frontEndCombo: {
				src: [
					'assets/min/js/library/cssua.js',
					'inc/fusion-app/views/view-toolbar.js',
					'inc/fusion-app/model-dialog.js',
					'inc/fusion-app/model-validation.js',
					'inc/fusion-app/model-callback-functions.js',
					'inc/fusion-app/model-dependencies.js',
					'inc/fusion-app/model-view-manager.js',
					'inc/fusion-app/model-active-states.js',
					'inc/fusion-app/model-hotkeys.js',
					'inc/fusion-app/util.js',
					'inc/fusion-app/fusion-app.js',
					'inc/fusion-app/model-inline-editor.js',
					'inc/fusion-app/model-inline-editor-manager.js',
					'inc/fusion-app/options/checkbox-set.js',
					'inc/fusion-app/options/code-block.js',
					'inc/fusion-app/options/color-palette.js',
					'inc/fusion-app/options/typography-sets.js',
					'inc/fusion-app/options/column-width.js',
					'inc/fusion-app/options/form-options.js',
					'inc/fusion-app/options/fusion-logics.js',
					'inc/fusion-app/options/hubspot-map.js',
					'inc/fusion-app/options/hubspot-consent-map.js',
					'inc/fusion-app/options/layout-conditions.js',
					'inc/fusion-app/options/mailchimp-map.js',
					'inc/fusion-app/options/color-picker.js',
					'inc/fusion-app/options/date-picker.js',
					'inc/fusion-app/options/dimension.js',
					'inc/fusion-app/options/editor.js',
					'inc/fusion-app/options/export.js',
					'inc/fusion-app/options/icon-picker.js',
					'inc/fusion-app/options/import.js',
					'inc/fusion-app/options/link-selector-object.js',
					'inc/fusion-app/options/link-selector.js',
					'inc/fusion-app/options/media-upload.js',
					'inc/fusion-app/options/radio-button-set.js',
					'inc/fusion-app/options/image-focus-point.js',
					'inc/fusion-app/options/toggle.js',
					'inc/fusion-app/options/multi-select.js',
					'inc/fusion-app/options/radio-set.js',
					'inc/fusion-app/options/range.js',
					'inc/fusion-app/options/raw.js',
					'inc/fusion-app/options/repeater.js',
					'inc/fusion-app/options/select.js',
					'inc/fusion-app/options/ajax-select.js',
					'inc/fusion-app/options/sortable-text.js',
					'inc/fusion-app/options/connected-sortable.js',
					'inc/fusion-app/options/sortable.js',
					'inc/fusion-app/options/switch.js',
					'inc/fusion-app/options/textfield-placeholder.js',
					'inc/fusion-app/options/typography.js',
					'inc/fusion-app/callbacks.js',
					'inc/fusion-app/views/view-dialog-more-options.js',
					'inc/fusion-app/options/nominatim-selector.js'
				],
				dest: 'inc/fusion-app/fusion-frontend-combined.js'
			}
		},

		babel: {
			options: {
				sourceMap: false,
				presets: [ '@babel/preset-env' ]
			},
			dist: {
				files: [
					{
						expand: true,
						cwd: 'assets/js/general',
						src: '*.js',
						dest: 'assets/min/js/general'
					},
					{
						src: 'inc/fusion-app/fusion-frontend-combined.js',
						dest: 'inc/fusion-app/fusion-frontend-combined.js'
					}
				]
			}
		},

		uglify: {
			main: {
				options: {
					mangle: true,
					compress: {
						sequences: true,
						dead_code: true,
						conditionals: true,
						booleans: true,
						unused: true,
						if_return: true,
						join_vars: true,
						drop_console: true
					}
				},
				files: [
					{
						expand: true,
						cwd: 'assets/js',
						src: '**/*.js',
						dest: 'assets/min/js'
					},
					{
						src: 'inc/redux/framework/FusionReduxCore/assets/js/fusionredux.js',
						dest: 'inc/redux/framework/FusionReduxCore/assets/js/fusionredux.min.js'
					},
					{
						src: 'inc/fusion-app/assets/js/medium-editor.js',
						dest: 'inc/fusion-app/assets/js/medium-editor.min.js'
					},
					{
						src: 'inc/fusion-app/fusion-frontend-combined.js',
						dest: 'inc/fusion-app/fusion-frontend-combined.min.js'
					}
				]
			},

			redux: {
				options: {
					mangle: true,
					compress: {
						sequences: true,
						dead_code: true,
						conditionals: true,
						booleans: true,
						unused: true,
						if_return: true,
						join_vars: true,
						drop_console: true
					}
				},
				files: [
					{
						expand: true,
						src: [ '**/*.js', '!**/*.min.js' ],
						dest: 'inc/redux/framework/FusionReduxCore/inc/fields/',
						cwd: 'inc/redux/framework/FusionReduxCore/inc/fields/',
						rename: function( dst, src ) {
							return dst + '/' + src.replace( '.js', '.min.js' );
						}
					}
				]
			}
		},

		// Get json file from the google-fonts API
		curl: {
			'google-fonts-source': {
				src: 'https://www.googleapis.com/webfonts/v1/webfonts?sort=alpha&key=AIzaSyCDiOc36EIOmwdwspLG3LYwCg9avqC5YLs',
				dest: 'inc/redux/custom-fields/typography/googlefonts.json'
			},
			'fa-downloadLatestJson': {
				src: {
					url: 'https://api.github.com/repos/FortAwesome/Font-Awesome/releases/latest',
					headers: {
						'User-Agent': 'request'
					}
				},
				dest: '<%= faJSONPath %>'
			},
			'fa-downloadLatestPackage': {
				src: {
					url: '<%= faPackageUrl %>',
					headers: {
						'User-Agent': 'request'
					}
				},
				dest: '<%= faZipPath %>'
			}
		},

		unzip: {
			'fa-unzipPackage': {
				src: [ '<%= faZipPath %>' ],
				dest: '<%= faPackagePath %>'
			},
			'fa-unzipPackagePro': {
				src: [ '<%= faProZipPath %>' ],
				dest: '<%= faPackagePath %>'
			}
		},

		// Converts the googlefonts json file to a PHP array.
		json2php: {
			convert: {
				expand: false,
				src: [ 'inc/redux/custom-fields/typography/googlefonts.json' ],
				dest: 'inc/googlefonts-array.php'
			}
		},

		// Delete the json array
		clean: {
			'default': [
				'inc/redux/custom-fields/typography/googlefonts.json',
				'languages/Avada.mo',
				'languages/Avada.po'
			],
			'fa-removeOldFreeFiles': [
				'<%= faOutputPath %>' + 'font-awesome.min.css',
				'<%= faOutputPath %>' + 'webfonts',
				'<%= faOutputPath %>' + 'icons_free.php',
				'<%= faOutputPath %>' + 'js/icons-search-free.js'
			],
			'fa-removeOldProFiles': [
				'<%= faOutputPath %>' + 'icons_pro.php',
				'<%= faOutputPath %>' + 'js/icons-search-pro.js'
			],
			'fa-removePackageFiles': [ '<%= faPackagePath %>' ]
		},
		watch: {
			all: {
				files: [ 'assets/**', 'inc/fusion-app/css/less/**' ],
				tasks: [ 'less:development', 'cssmin' ]
			}
		},
		less: {
			options: {
				sourceMap: false,
				plugins: [ new ( require( 'less-plugin-autoprefix' ) )( { browsers: [ '> 1%' ] } ) ]
			},
			development: {
				files: {
					'inc/redux/assets/style.css': 'inc/redux/assets/style.less',
					'inc/fusion-app/css/fusion-builder-frame.css': 'inc/fusion-app/css/less/builder-frame/builder-frame.less',
					'inc/fusion-app/css/fusion-preview-frame.css': 'inc/fusion-app/css/less/preview-frame/preview-frame.less',
					'assets/css/fusion-custom-icons.css': 'assets/less/fusion-custom-icons.less',
					'assets/css/icomoon.css': 'assets/less/icomoon.less',
				}
			}
		},

		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1
			},
			target: {
				files: [
					{
						'inc/fusion-app/css/fusion-builder-frame.min.css': [ 'inc/fusion-app/css/fusion-builder-frame.css' ],
						'inc/fusion-app/assets/css/jquery-ui/jquery-ui.min.css': [ 'inc/fusion-app/assets/css/jquery-ui/jquery-ui.css' ],
						'inc/fusion-app/assets/fonts/icomoon.min.css': [ 'inc/fusion-app/assets/fonts/icomoon.css' ],
						'assets/css/icomoon.min.css': [ 'assets/css/icomoon.css' ],
					}
				]
			}
		},

		// Check JS syntax.
		jscs: {
			src: [ 'Gruntfile.js', 'assets/js/general/*.js' ],
			options: {
				config: '.jscsrc'
			}
		},

		// JSHint.
		jshint: {
			all: [ 'Gruntfile.js', 'assets/js/general/*.js' ]
		},

		faOutputPath: 'assets/fonts/fontawesome/',
		faPackagePath: '<%= faOutputPath %>' + 'package/',
		faPackageUrl: '',
		faJSONPath: '<%= faPackagePath %>' + 'fontawesome-free.json',
		faZipPath: '<%= faPackagePath %>' + 'fontawesome-free.zip',
		faProZipPath: '<%= faPackagePath %>' + 'fontawesome-pro.zip',
		faSubDir: ''

	} );

	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify-es' );
	grunt.loadNpmTasks( 'grunt-contrib-less' );
	grunt.loadNpmTasks( 'grunt-curl' );
	grunt.loadNpmTasks( 'grunt-json2php' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-jscs' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-zip' );
	grunt.loadNpmTasks( 'grunt-babel' );

	grunt.registerTask( 'watch', [ 'watch:all' ] );
	grunt.registerTask( 'default', [ 'concat:frontEndCombo', 'uglify:main', 'uglify:redux', 'less:development', 'curl:google-fonts-source', 'gFontsJSONCleanup', 'json2php', 'gFontsHttpToHttps', 'cssmin', 'clean:default', 'copyFiles' ] );
	grunt.registerTask( 'copyFiles', function() {
		grunt.file.copy( 'assets/js/library/vimeoPlayer.js', 'assets/min/js/library/vimeoPlayer.js' );
	} );

	/**
	 * Clean-up the googlefonts JSON.
	 */
	grunt.registerTask( 'gFontsJSONCleanup', function() {
		var fromJSON = JSON.parse( grunt.file.read( 'inc/redux/custom-fields/typography/googlefonts.json' ) ),
			items = fromJSON.items,
			finalItems = [];

		items.forEach( function( item ) {
			finalItems.push( {
				family: item.family,
				variants: item.variants,
				// subsets: item.subsets,
				// files: item.files
			} );
		} );

		grunt.file.write( 'inc/redux/custom-fields/typography/googlefonts.json', JSON.stringify( {
			items: finalItems
		} ) );
	} );

	/**
	 * Replaces http with https in the googlefonts array file.
	 */
	grunt.registerTask( 'gFontsHttpToHttps', function() {
		var fileData = grunt.file.read( 'inc/googlefonts-array.php' );
		fileData     = fileData.replace( new RegExp( 'http:', 'g' ), 'https:' );
		grunt.file.write( 'inc/googlefonts-array.php', fileData );
	} );

	grunt.registerTask( 'fa-readJSON', function() {

		json = JSON.parse( grunt.file.read( grunt.config.get( 'faJSONPath' ) ) );

		console.log( 'Latest Font Awesome version: ' + json.tag_name.green );

		if ( 'undefined' !== typeof json.zipball_url ) {
			grunt.config.set( 'faPackageUrl', json.zipball_url );
		}

	} );

	grunt.registerTask( 'fa-getPackageSubDir', function() {
		var subDirs = grunt.file.expand( grunt.config.get( 'faPackagePath' ) + 'FortAwesome-Font-Awesome-*' );

		if ( 0 < subDirs.length ) {
			grunt.config.set( 'faSubDir', subDirs[0] + '/' );
		} else {
			console.log( 'Font Awesome folder couldn\'t be found'.red );
		}

	} );

	grunt.registerTask( 'fa-getPackageSubDirPro', function() {
		var subDirs = grunt.file.expand( grunt.config.get( 'faPackagePath' ) + 'fontawesome-pro-*' );

		if ( 0 < subDirs.length ) {
			grunt.config.set( 'faSubDir', subDirs[0] + '/' );
		} else {
			console.log( 'Font Awesome Pro folder couldn\'t be found'.red );
		}

	} );

	grunt.registerTask( 'fa-updateFiles', function() {
		var allCSS;

		// Load CSS files.
		allCSS = grunt.file.read( grunt.config.get( 'faSubDir' ) + 'css/all.min.css' );

		// Replace font file paths.
		allCSS = allCSS.replace( new RegExp( '../webfonts', 'g' ), './webfonts' );

		// Write new CSS file.
		grunt.file.write( grunt.config.get( 'faOutputPath' ) + 'font-awesome.min.css', allCSS );

		// Copy new font files.
		grunt.file.recurse( grunt.config.get( 'faSubDir' ) + 'webfonts', function( abspath, rootdir, subdir, filename ) {
			grunt.file.copy( abspath, grunt.config.get( 'faOutputPath' ) + 'webfonts/' + filename );
		} );

		console.log( 'Don\'t forget to update Pro files as well, run: grunt faIconsUpdatePro'.red );
	} );

	grunt.registerTask( 'fa-updateUtilFiles', function() {
		var iconsObj,
			iconSearchArray = [],
			icon,
			iconObj = {},
			categoriesObj = {},
			cat,
			YAML = require( 'yamljs' ),
			iconsPicker    = [],
			iconPickerkeys = [],
			iconSubsets = {
				brands: 'fab',
				regular: 'far',
				solid: 'fas',
				light: 'fal',
				duotone: 'fad'
			},
			style,
			php = '',
			i,
			fileSuffix = [ 'free', 'pro' ],
			isPro      = -1 === grunt.config.get( 'faSubDir' ).indexOf( '-pro-' ) ? 0 : 1;

		// Create array used to populate icon picker and for search script.
		categoriesObj = YAML.parse( grunt.file.read( grunt.config.get( 'faSubDir' ) + 'metadata/categories.yml' ) );
		iconsObj      = JSON.parse( grunt.file.read( grunt.config.get( 'faSubDir' ) + 'metadata/icons.json' ) );

		for ( icon in iconsObj ) {

			// Skip broken 'fa-font-awesome-logo-full' icon (every subset has one).
			if ( 'font-awesome-logo-full' !== icon ) {

				// Used for icon search.
				iconObj = {
					name: icon,
					keywords: null !== iconsObj[ icon ].search ? iconsObj[ icon ].search.terms : [],
					categories: []
				};

				for ( cat in categoriesObj ) {
					if ( -1 !== categoriesObj[ cat ].icons.indexOf( icon ) ) {
						iconObj.categories.push( cat );
					}
				}
				iconSearchArray.push( iconObj );

				// Used for icon picker.
				iconPickerkeys.push( icon );
				subsets = 'array(';

				for ( style in iconsObj[ icon ].styles ) {
					subsets += '\'' + iconSubsets[ iconsObj[ icon ].styles[ style ] ] + '\',';
				}

				// Remove trailing comma.
				subsets = subsets.substring( 0, subsets.length - 1 ) + ')';

				iconsPicker[ icon ] = [ icon, subsets, iconsObj[ icon ].unicode ];
			}
		}

		// Write Icon Search File file.
		grunt.file.write( grunt.config.get( 'faOutputPath' ) + 'js/icons-search-' + fileSuffix[ isPro ] + '.js', 'var fusionIconSearch = ' + JSON.stringify( iconSearchArray ) + ';' );

		// Sort keys, so icons are added to PHP array in correct order.
		iconPickerkeys = iconPickerkeys.sort();

		// Convert to PHP array.
		for ( i = 0; i < iconPickerkeys.length; i++ ) {

			php += '\'' + iconPickerkeys[ i ] + '\'=>array(';

			// Don't add the comma to the last item.
			php += '\'fa-' + iconsPicker[ iconPickerkeys[ i ] ][ 0 ] + '\',' + iconsPicker[ iconPickerkeys[ i ] ][ 1 ] + ',\'' + iconsPicker[ iconPickerkeys[ i ] ][ 2 ] + '\')';
			php += ',';
		}

		// Write PHP file.
		grunt.file.write( 'assets/fonts/fontawesome/icons_' + fileSuffix[ isPro ] + '.php', '<?php return array(' + php + ');' );
	} );

	grunt.registerTask( 'faIconsUpdate', [ 'curl:fa-downloadLatestJson', 'fa-readJSON', 'curl:fa-downloadLatestPackage', 'unzip:fa-unzipPackage', 'fa-getPackageSubDir', 'clean:fa-removeOldFreeFiles', 'fa-updateFiles', 'fa-updateUtilFiles' ] );

	grunt.registerTask( 'faIconsUpdatePro', [ 'unzip:fa-unzipPackagePro', 'fa-getPackageSubDirPro', 'clean:fa-removeOldProFiles', 'fa-updateUtilFiles', 'clean:fa-removePackageFiles' ] );
};
