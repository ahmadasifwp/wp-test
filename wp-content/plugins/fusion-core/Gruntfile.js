module.exports = function( grunt ) {

	// Project configuration.
	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),

		// Generate .pot translation file
		makepot: {
			target: {
				options: {
					type: 'wp-plugin',
					domainPath: 'languages'
				}
			}
		},

		addtextdomain: {
			options: {
				textdomain: 'fusion-core',
				updateDomains: [
					'Avada',
					'fusionredux-framework',
					'fusion-library-textdomain',
					'fusion-core',
					'fusion-builder',
					'envato-market',
					'Fusion',
					'wordpress-importer'
				]
			},
			target: {
				files: {
					src: [
						'*.php',
						'fusion-slider/*.php',
						'fusion-slider/**/*.php',
						'shortcodes/*.php',
						'shortcodes/**/*.php',
						'templates/*.php'
					]
				}
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
				files: [ {
					expand: true,
					cwd: 'js',
					src: '*.js',
					dest: 'js/min'
				} ]
			}
		},

		less: {
			options: {
				sourceMap: false,
				plugins: [ new ( require( 'less-plugin-autoprefix' ) )( { browsers: [ '> 1%' ] } ) ]
			},
			development: {
				files: {
					'css/comment-form.css': 'less/comment-form.less',
					'css/faqs.css': 'less/faqs.less',
					'css/portfolio.css': 'less/portfolio.less',
					'css/privacy.css': 'less/privacy.less'
				}
			}
		},

		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1
			},
			target: {
				files: {
					'css/comment-form.min.css': [ 'css/comment-form.css' ],
					'css/faqs.min.css': [ 'css/faqs.css' ],
					'css/portfolio.min.css': [ 'css/portfolio.css' ],
					'css/privacy.min.css': [ 'css/privacy.css' ]
				}
			}
		},

		// Check JS syntax.
		jscs: {
			src: [ 'Gruntfile.js', './assets/js/general/*.js' ],
			options: {
				config: '.jscsrc'
			}
		},

		// JSHint.
		jshint: {
			all: [ 'Gruntfile.js', './js/*.js' ]
		}

	} );

	grunt.loadNpmTasks( 'grunt-contrib-uglify-es' );
	grunt.loadNpmTasks( 'grunt-contrib-less' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-wp-i18n' );
	grunt.loadNpmTasks( 'grunt-jscs' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );

	grunt.registerTask( 'default', [ 'addtextdomain', 'makepot', 'uglify', 'less:development', 'cssmin' ] );
};
