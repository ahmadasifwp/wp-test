module.exports = function( grunt ) {

	grunt.initConfig( {
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
				textdomain: 'fusion-builder',
				updateDomains: [
					'Avada',
					'fusionredux-framework',
					'fusion-library-textdomain',
					'fusion-core',
					'fusion-builder',
					'envato-market',
					'Fusion',
					'wordpress-importer',
					'fusion-library'
				]
			},
			target: {
				files: {
					src: [
						'inc/lib/*.php',
						'inc/lib/**/*.php',
						'inc/lib/**/**/*.php',
						'inc/lib/**/**/**/*.php'
					]
				}
			}
		},

		copy: {
			proxy: {
				src: 'languages/Fusion-Builder.pot',
				dest: 'languages/fb.pot'
			},
			final: {
				src: 'languages/fb.pot',
				dest: 'languages/fusion-builder.pot'
			}
		},

		clean: {
			'proxy': [ 'languages/Fusion-Builder.pot' ],
			'final': [ 'languages/fb.pot' ]
		},

		less: {
			options: {
				sourceMap: false,
				plugins: [ new ( require( 'less-plugin-autoprefix' ) )( { browsers: [ '> 1%' ] } ) ]
			},
			development: {
				files: [
					{
						'assets/admin/css/elements-preview.css': 'less/admin/elements-preview.less',
						'assets/admin/css/fusion-builder-admin.css': 'less/admin/fusion-builder-admin.less',
						'assets/admin/css/fusion-builder.css': 'less/admin/fusion-builder.less',
						'assets/admin/css/fusion-form-admin.css': 'less/admin/fusion-form-admin.less',
						'front-end/css/builder.css': 'front-end/css/less/builder/builder.less',
						'front-end/css/preview.css': 'front-end/css/less/preview/preview.less',
						'front-end/css/preview-no-controls.css': 'front-end/css/less/preview/preview-no-controls.less',
						'assets/css/layout.css': 'less/layout.less',
						'assets/css/animations.css': [ 'less/icon_animations.less', 'less/animations.less' ],
						'assets/css/bootstrap-animations.css': [ 'less/bootstrap-animations.less' ],

						'assets/css/ilightbox.css': 'less/plugins/iLightbox/iLightbox.less',
						'assets/css/ilightbox-dark-skin.css': 'less/plugins/iLightbox/skins/dark-skin.less',
						'assets/css/ilightbox-light-skin.css': 'less/plugins/iLightbox/skins/light-skin.less',
						'assets/css/ilightbox-mac-skin.css': 'less/plugins/iLightbox/skins/mac-skin.less',
						'assets/css/ilightbox-metro-black-skin.css': 'less/plugins/iLightbox/skins/metro-black-skin.less',
						'assets/css/ilightbox-metro-white-skin.css': 'less/plugins/iLightbox/skins/metro-white-skin.less',
						'assets/css/ilightbox-parade-skin.css': 'less/plugins/iLightbox/skins/parade-skin.less',
						'assets/css/ilightbox-smooth-skin.css': 'less/plugins/iLightbox/skins/smooth-skin.less',

						'assets/css/fusion-form.css': 'less/fusion-form.less',
						'assets/css/fusion-form-rtl.css': 'less/fusion-form-rtl.less',
						'assets/css/components/archives.css': 'less/components/archives.less',
						'assets/css/components/author.css': 'less/components/author.less',
						'assets/css/components/comments.css': 'less/components/comments.less',
						'assets/css/components/content.css': 'less/components/content.less',
						'assets/css/components/pagination.css': 'less/components/pagination.less',
						'assets/css/components/meta.css': 'less/components/meta.less',
						'assets/css/components/woo-additional-info.css': 'less/components/woo-additional-info.less',
						'assets/css/components/related.css': 'less/components/related.less',
						'assets/css/components/woo-price.css': 'less/components/woo-price.less',
						'assets/css/components/woo-rating.css': 'less/components/woo-rating.less',
						'assets/css/components/woo-reviews.css': 'less/components/woo-reviews.less',
						'assets/css/components/woo-short-description.css': 'less/components/woo-short-description.less',
						'assets/css/components/woo-stock.css': 'less/components/woo-stock.less',
						'assets/css/components/woo-tabs.css': 'less/components/woo-tabs.less',
						'assets/css/components/woo-product-images.css': 'less/components/woo-product-images.less',
						'assets/css/components/woo-cart.css': 'less/components/woo-cart.less',
						'assets/css/components/woo-products.css': 'less/components/woo-products.less',
						'assets/css/components/woo-filters.css': 'less/components/woo-filters.less',
						'assets/css/components/woo-order-details.css': 'less/components/woo-order-details.less',
						'assets/css/components/woo-order-downloads.css': 'less/components/woo-order-downloads.less',
						'assets/css/components/woo-order-customer-details.css': 'less/components/woo-order-customer-details.less',
						'assets/css/components/woo-order-table.css': 'less/components/woo-order-table.less',
						'assets/css/components/woo-order-additional-info.css': 'less/components/woo-order-additional-info.less',

						'assets/css/form/checkbox.css': 'less/form/checkbox.less',
						'assets/css/form/honeypot.css': 'less/form/honeypot.less',
						'assets/css/form/image-select.css': 'less/form/image-select.less',
						'assets/css/form/radio.css': 'less/form/radio.less',
						'assets/css/form/range.css': 'less/form/range.less',
						'assets/css/form/rating.css': 'less/form/rating.less',
						'assets/css/form/select.css': 'less/form/select.less',
						'assets/css/form/upload.css': 'less/form/upload.less',
						'assets/css/form/submit.css': 'less/form/submit.less',
						'assets/css/shortcodes/audio.css': 'less/shortcodes/audio.less',
						'assets/css/shortcodes/alert.css': 'less/shortcodes/alert.less',
						'assets/css/shortcodes/blog.css': 'less/shortcodes/blog.less',
						'assets/css/shortcodes/button.css': 'less/shortcodes/button.less',
						'assets/css/shortcodes/button-sliders.css': 'less/shortcodes/button-sliders.less',
						'assets/css/shortcodes/button-presets.css': 'less/shortcodes/button-presets.less',
						'assets/css/shortcodes/chart.css': 'less/shortcodes/chart.less',
						'assets/css/shortcodes/checklist.css': 'less/shortcodes/checklist.less',
						'assets/css/shortcodes/content-boxes.css': 'less/shortcodes/content-boxes.less',
						'assets/css/shortcodes/countdown.css': 'less/shortcodes/countdown.less',
						'assets/css/shortcodes/counters-circle.css': 'less/shortcodes/counters-circle.less',
						'assets/css/shortcodes/counters-box.css': 'less/shortcodes/counters-box.less',
						'assets/css/shortcodes/circles-info.css': 'less/shortcodes/circles-info.less',
						'assets/css/shortcodes/dropcap.css': 'less/shortcodes/dropcap.less',
						'assets/css/shortcodes/flexslider.css': 'less/shortcodes/flexslider.less',
						'assets/css/shortcodes/flip-boxes.css': 'less/shortcodes/flip-boxes.less',
						'assets/css/shortcodes/icon.css': 'less/shortcodes/icon.less',
						'assets/css/shortcodes/login.css': 'less/shortcodes/login.less',
						'assets/css/shortcodes/lottie.css': 'less/shortcodes/lottie.less',
						'assets/css/shortcodes/fullwidth.css': 'less/shortcodes/fullwidth.less',
						'assets/css/shortcodes/fullwidth-flex.css': 'less/shortcodes/fullwidth-flex.less',
						'assets/css/shortcodes/fullwidth-sticky.css': 'less/shortcodes/fullwidth-sticky.less',
						'assets/css/shortcodes/fullwidth-absolute.css': 'less/shortcodes/fullwidth-absolute.less',
						'assets/css/shortcodes/google-map.css': 'less/shortcodes/google-map.less',
						'assets/css/shortcodes/highlight.css': 'less/shortcodes/highlight.less',
						'assets/css/shortcodes/image.css': 'less/shortcodes/image.less',
						'assets/css/shortcodes/image-before-after.css': 'less/shortcodes/image-before-after.less',
						'assets/css/shortcodes/text.css': 'less/shortcodes/text.less',
						'assets/css/shortcodes/image-carousel.css': 'less/shortcodes/image-carousel.less',
						'assets/css/shortcodes/image-hotspots.css': 'less/shortcodes/image-hotspots.less',
						'assets/css/shortcodes/layout-columns.css': 'less/shortcodes/layout-columns.less',
						'assets/css/shortcodes/modal.css': 'less/shortcodes/modal.less',
						'assets/css/shortcodes/news-ticker.css': 'less/shortcodes/news-ticker.less',
						'assets/css/shortcodes/person.css': 'less/shortcodes/person.less',
						'assets/css/shortcodes/popover.css': 'less/shortcodes/popover.less',
						'assets/css/shortcodes/portfolio.css': 'less/shortcodes/portfolio.less',
						'assets/css/shortcodes/pricingtable.css': 'less/shortcodes/pricingtable.less',
						'assets/css/shortcodes/progressbar.css': 'less/shortcodes/progressbar.less',
						'assets/css/shortcodes/recent-posts.css': 'less/shortcodes/recent-posts.less',
						'assets/css/shortcodes/scroll-progress.css': 'less/shortcodes/scroll-progress.less',
						'assets/css/shortcodes/section-separator.css': 'less/shortcodes/section-separator.less',
						'assets/css/shortcodes/separator.css': 'less/shortcodes/separator.less',
						'assets/css/shortcodes/sharingbox.css': 'less/shortcodes/sharingbox.less',
						'assets/css/shortcodes/star-rating.css': 'less/shortcodes/star-rating.less',
						'assets/css/shortcodes/media-slider.css': 'less/shortcodes/media-slider.less',
						'assets/css/shortcodes/social-links.css': 'less/shortcodes/social-links.less',
						'assets/css/shortcodes/tabs.css': 'less/shortcodes/tabs.less',
						'assets/css/shortcodes/table.css': 'less/shortcodes/table.less',
						'assets/css/shortcodes/tagline.css': 'less/shortcodes/tagline.less',
						'assets/css/shortcodes/testimonials.css': 'less/shortcodes/testimonials.less',
						'assets/css/shortcodes/title.css': 'less/shortcodes/title.less',
						'assets/css/shortcodes/toggles.css': 'less/shortcodes/toggles.less',
						'assets/css/shortcodes/tooltip.css': 'less/shortcodes/tooltip.less',
						'assets/css/shortcodes/video.css': 'less/shortcodes/video.less',
						'assets/css/shortcodes/views-counter.css': 'less/shortcodes/views-counter.less',
						'assets/css/shortcodes/widget-area.css': 'less/shortcodes/widget-area.less',
						'assets/css/shortcodes/woo-featured-products-slider.css': 'less/shortcodes/woo-featured-products-slider.less',
						'assets/css/shortcodes/woo-product-slider.css': 'less/shortcodes/woo-product-slider.less',
						'assets/css/shortcodes/woo-product-grid.css': 'less/shortcodes/woo-product-grid.less',
						'assets/css/shortcodes/woo-mini-cart.css': 'less/shortcodes/woo-mini-cart.less',
						'assets/css/shortcodes/woo-sorting.css': 'less/shortcodes/woo-sorting.less',
						'assets/css/shortcodes/youtube.css': 'less/shortcodes/youtube.less',
						'assets/css/shortcodes/events.css': 'less/shortcodes/events.less',
						'assets/css/shortcodes/isotope.css': 'less/shortcodes/isotope.less',
						'assets/css/shortcodes/image-hovers.css': 'less/shortcodes/image-hovers.less',
						'assets/css/shortcodes/grid.css': 'less/shortcodes/grid.less',
						'assets/css/shortcodes/gallery.css': 'less/shortcodes/gallery.less',
						'assets/css/shortcodes/syntax-highlighter.css': 'less/shortcodes/syntax-highlighter.less',
						'assets/css/shortcodes/pagination.css': 'less/shortcodes/pagination.less',
						'assets/css/shortcodes/rollover.css': 'less/shortcodes/rollover.less',
						'assets/css/shortcodes/widget.css': 'less/shortcodes/widget.less',
						'assets/css/shortcodes/post-card-image.css': 'less/shortcodes/post-card-image.less',
						'assets/css/shortcodes/post-card-cart.css': 'less/shortcodes/post-card-cart.less',
						'assets/css/shortcodes/post-cards.css': 'less/shortcodes/post-cards.less',
						'assets/css/shortcodes/woo-cart-totals.css': 'less/shortcodes/woo-cart-totals.less',
						'assets/css/shortcodes/woo-checkout-order-review.css': 'less/shortcodes/woo-checkout-order-review.less',
						'assets/css/shortcodes/woo-checkout-billing.css': 'less/shortcodes/woo-checkout-billing.less',
						'assets/css/shortcodes/woo-cart-shipping.css': 'less/shortcodes/woo-cart-shipping.less',
						'assets/css/shortcodes/woo-cart-coupons.css': 'less/shortcodes/woo-cart-coupons.less',
						'assets/css/shortcodes/woo-cart-table.css': 'less/shortcodes/woo-cart-table.less',
						'assets/css/shortcodes/woo-checkout-payment.css': 'less/shortcodes/woo-checkout-payment.less',
						'assets/css/shortcodes/woo-checkout-shipping.css': 'less/shortcodes/woo-checkout-shipping.less',
						'assets/css/shortcodes/woo-checkout-tabs.css': 'less/shortcodes/woo-checkout-tabs.less',
						'assets/css/shortcodes/woo-notices.css': 'less/shortcodes/woo-notices.less',
						'assets/css/shortcodes/swiper.css': 'less/shortcodes/swiper.less',
						'assets/css/shortcodes/leaflet.css': 'less/shortcodes/leaflet.less',
						'assets/css/shortcodes/open-street-map.css': 'less/shortcodes/open-street-map.less',

						'assets/css/shortcodes/facebook-page.css': 'less/shortcodes/facebook-page.less',
						'assets/css/shortcodes/twitter-timeline.css': 'less/shortcodes/twitter-timeline.less',
						'assets/css/shortcodes/flickr.css': 'less/shortcodes/flickr.less',
						'assets/css/shortcodes/tagcloud.css': 'less/shortcodes/tagcloud.less',
						'assets/css/shortcodes/instagram.css': 'less/shortcodes/instagram.less',
						'assets/css/shortcodes/table-of-contents.css': 'less/shortcodes/table-of-contents.less',
						'assets/css/shortcodes/breadcrumbs.css': 'less/shortcodes/breadcrumbs.less',
						'assets/css/shortcodes/search.css': 'less/shortcodes/search.less',

						'assets/css/side-header.css': 'less/side-header.less',
						'assets/css/off-canvas.css': 'less/off-canvas.less',

						'assets/css/shortcodes/menu.css': 'less/shortcodes/menu/menu.less',
						'assets/css/shortcodes/menu-arrows.css': 'less/shortcodes/menu/menu-arrows.less',
						'assets/css/shortcodes/menu-vertical.css': 'less/shortcodes/menu/menu-vertical.less',
						'assets/css/shortcodes/menu-stacked.css': 'less/shortcodes/menu/menu-stacked.less',
						'assets/css/shortcodes/menu-mobile.css': 'less/shortcodes/menu/menu-mobile.less',
						'assets/css/shortcodes/menu-woo.css': 'less/shortcodes/menu/menu-woo.less',
						'assets/css/shortcodes/menu-flyout.css': 'less/shortcodes/menu/menu-flyout.less',
						'assets/css/shortcodes/menu-search.css': 'less/shortcodes/menu/menu-search.less',
						'assets/css/shortcodes/menu-mega.css': 'less/shortcodes/menu/menu-mega.less',
						'assets/css/shortcodes/menu-mega-legacy.css': 'less/shortcodes/menu/menu-mega-legacy.less',

						'assets/css/shortcodes/submenu.css': 'less/shortcodes/submenu/submenu.less',
						'assets/css/shortcodes/submenu-vertical.css': 'less/shortcodes/submenu/submenu-vertical.less',
						'assets/css/shortcodes/submenu-stacked.css': 'less/shortcodes/submenu/submenu-stacked.less'
					},
					{
						expand: true,
						dot: true,
						cwd: 'assets/css/media/less',
						src: '*.less',
						dest: 'assets/css/media',
						rename: function( dest, src ) {
							return dest + '/' + src.replace( '.less', '.css' );
						}
					}
				]
			}
		},

		csscomb: {
			target: {
				files: {
					'css/style.css': 'css/style.css',
					'css/fusion-builder-admin.css': 'css/fusion-builder-admin.css'
				}
			}
		},

		csslint: {
			target: {
				options: {
					csslintrc: '.csslintrc'
				},
				src: [ 'css/style.css' ]
			}
		},

		concat: {
			options: {
				separator: ';'
			},
			main: {
				src: [
					'inc/lib/inc/fusion-app/util.js',
					'js/sticky-menu.js',
					'js/models/model-element.js',
					'js/models/model-studio.js',
					'js/models/model-website.js',
					'js/views/view-library-base.js',
					'js/models/model-view-manager.js',
					'js/models/model-dynamic-values.js',
					'js/models/model-dynamic-params.js',
					'js/collections/collection-element.js',
					'js/views/view-element.js',
					'js/views/view-element-preview.js',
					'js/views/view-elements-library.js',
					'js/views/view-generator-elements.js',
					'js/views/view-container.js',
					'js/views/view-blank-page.js',
					'js/views/view-row.js',
					'js/views/view-row-nested.js',
					'js/views/view-nested-column-library.js',
					'js/views/view-column-base.js',
					'js/views/view-column-nested.js',
					'js/views/view-column.js',
					'js/views/view-modal.js',
					'js/views/view-next-page.js',
					'js/views/view-form-step.js',
					'js/views/view-woo-checkout-form.js',
					'js/views/view-context-menu.js',
					'js/views/view-element-settings.js',
					'js/views/view-multi-element-child-settings.js',
					'js/views/view-base-widget-settings.js',
					'js/views/view-bulk-add.js',
					'js/views/view-multi-element-sortable-ui.js',
					'js/views/view-multi-element-sortable-child.js',
					'js/views/view-column-library.js',
					'js/views/view-dynamic-selection.js',
					'js/views/view-dynamic-data.js',
					'js/app.js',
					'js/fusion-shortcode-generator.js',
					'js/fusion-history.js',
					'js/yoast-integration.js',
					'js/rank-math-integration.js'
				],
				dest: 'js/fusion-builder.js'
			},
			frontEndCombo: {
				src: [
					'front-end/fusion-shortcode-generator.js',
					'front-end/views/view-history.js',
					'front-end/views/view-toolbar.js',
					'front-end/models/model-element.js',
					'front-end/models/model-extra-shortcodes.js',
					'front-end/models/model-dynamic-values.js',
					'front-end/models/model-dynamic-params.js',
					'front-end/models/model-form-styles.js',
					'front-end/models/model-off-canvas-styles.js',
					'front-end/collections/collection-element.js',
					'front-end/views/view-base.js',
					'front-end/views/view-base-row.js',
					'front-end/views/view-base-column.js',
					'front-end/views/view-column.js',
					'front-end/views/view-container.js',
					'front-end/views/view-studio-import-modal.js',
					'front-end/views/view-context-menu.js',
					'front-end/views/view-context-menu-inline.js',
					'front-end/views/view-element.js',
					'front-end/views/view-parent-element.js',
					'front-end/views/view-child-element.js',
					'front-end/views/view-row.js',
					'front-end/views/view-dynamic-selection.js',
					'front-end/views/view-dynamic-data.js',
					'front-end/views/view-element-settings.js',
					'js/views/view-base-widget-settings.js',
					'js/views/view-bulk-add.js',
					'front-end/views/view-element-settings-parent.js',
					'front-end/views/view-library-base.js',
					'front-end/views/view-library-elements.js',
					'front-end/views/view-library-column.js',
					'front-end/views/view-library-nested-column.js',
					'front-end/views/view-library-container.js',
					'front-end/views/view-generator-elements.js',
					'front-end/views/view-column-nested.js',
					'front-end/views/view-row-nested.js',
					'front-end/views/view-blank-page.js',
					'front-end/views/view-builder-preferences.js',
					'js/views/view-element-preview.js',
					'front-end/views/view-next-page.js',
					'front-end/views/view-form-step.js',
					'front-end/views/view-woo-checkout-form.js',
					'front-end/views/view-keyboard-shortcuts.js',
					'front-end/views/view-library.js',
					'front-end/views/view-demo-import-modal.js',
					'front-end/models/model-settings-helpers.js',
					'front-end/models/model-template-helpers.js',
					'front-end/models/model-inline-editor-helpers.js',
					'front-end/models/model-callback-functions.js',
					'front-end/models/model-globals.js',
					'front-end/models/model-draggable-helpers.js',
					'front-end/models/model-isotope-manager.js',
					'front-end/models/model-studio.js',
					'front-end/models/model-website.js',
					'front-end/models/model-navigator.js',
					'front-end/models/model-form-nav.js',
					'front-end/views/view-navigator.js',
					'front-end/views/view-form-nav.js',
					'front-end/front-end.js',
					'front-end/views/elements/view-child-counter-circle.js',
					'front-end/views/elements/view-child-counter-circles.js',
					'front-end/views/elements/view-gallery.js',
					'front-end/views/elements/view-gallery-child.js',
					'front-end/views/elements/view-separator.js',
					'front-end/views/elements/view-title.js',
					'front-end/views/elements/view-testimonials.js',
					'front-end/views/elements/view-testimonial.js',
					'front-end/views/elements/view-tooltip.js',
					'front-end/views/elements/view-sharingbox.js',
					'front-end/views/elements/view-section-separator.js',
					'front-end/views/elements/view-modal.js',
					'front-end/views/elements/view-code-block.js',
					'front-end/views/elements/view-alert.js',
					'front-end/views/elements/view-audio.js',
					'front-end/views/elements/view-google-map.js',
					'front-end/views/elements/view-font-awesome.js',
					'front-end/views/elements/view-button.js',
					'front-end/views/elements/view-breadcrumbs.js',
					'front-end/views/elements/view-image.js',
					'front-end/views/elements/view-layerslider.js',
					'front-end/views/elements/view-slider-revolution.js',
					'front-end/views/elements/view-convert_plus.js',
					'front-end/views/elements/view-person.js',
					'front-end/views/elements/view-lottie.js',
					'front-end/views/elements/view-menu.js',
					'front-end/views/elements/view-submenu.js',
					'front-end/views/elements/view-video.js',
					'front-end/views/elements/view-views-counter.js',
					'front-end/views/elements/view-vimeo.js',
					'front-end/views/elements/view-post-slider.js',
					'front-end/views/elements/view-user-login.js',
					'front-end/views/elements/view-user-register.js',
					'front-end/views/elements/view-user-lost-password.js',
					'front-end/views/elements/view-woo-featured-products-slider.js',
					'front-end/views/elements/view-highlight.js',
					'front-end/views/elements/view-search.js',
					'front-end/views/elements/view-syntax-highlighter.js',
					'front-end/views/elements/view-tabs.js',
					'front-end/views/elements/view-tab.js',
					'front-end/views/elements/view-table.js',
					'shortcodes/js/fusion-table.js',
					'front-end/views/elements/view-progress-bar.js',
					'front-end/views/elements/view-scroll-progress.js',
					'front-end/views/elements/view-recent-posts.js',
					'front-end/views/elements/view-woo-product-slider.js',
					'front-end/views/elements/view-woo-product-grid.js',
					'front-end/views/elements/view-woo-sorting.js',
					'front-end/views/elements/view-media-slider.js',
					'front-end/views/elements/view-slide.js',
					'front-end/views/elements/view-image-hotspots.js',
					'front-end/views/elements/view-image-hotspot-point.js',
					'front-end/views/elements/view-image-carousel.js',
					'front-end/views/elements/view-image-carousel-child.js',
					'front-end/views/elements/view-one-page-link.js',
					'front-end/views/elements/view-dropcap.js',
					'front-end/views/elements/view-flip-boxes.js',
					'front-end/views/elements/view-flip-box.js',
					'front-end/views/elements/view-accordion.js',
					'front-end/views/elements/view-accordion-toggle.js',
					'front-end/views/elements/view-chart.js',
					'front-end/views/elements/view-chart-dataset.js',
					'front-end/views/elements/view-image-before-after.js',
					'front-end/views/elements/view-counters-box.js',
					'front-end/views/elements/view-counter-box.js',
					'front-end/views/elements/view-circles-info.js',
					'front-end/views/elements/view-circle-info.js',
					'front-end/views/elements/view-widget-area.js',
					'front-end/views/elements/view-content-boxes.js',
					'front-end/views/elements/view-content-box.js',
					'front-end/views/elements/view-social-links.js',
					'front-end/views/elements/view-star-rating.js',
					'front-end/views/elements/view-modal-text-link.js',
					'front-end/views/elements/view-news-ticker.js',
					'front-end/views/elements/view-popover.js',
					'front-end/views/elements/view-events.js',
					'front-end/views/elements/view-countdown.js',
					'front-end/views/elements/view-menu-anchor.js',
					'front-end/views/elements/view-checklist.js',
					'front-end/views/elements/view-checklist-item.js',
					'front-end/views/elements/view-youtube.js',
					'front-end/views/elements/view-soundcloud.js',
					'front-end/views/elements/view-text.js',
					'front-end/views/elements/view-tagline-box.js',
					'front-end/views/elements/view-pricing-table.js',
					'front-end/views/elements/view-pricing-column.js',
					'front-end/views/elements/view-blog.js',
					'front-end/views/elements/view-breadcrumbs.js',
					'front-end/views/elements/view-lightbox.js',
					'front-end/views/elements/view-widget.js',
					'front-end/views/elements/view-woo-notices.js',
					'front-end/views/elements/view-woo-checkout-billing.js',
					'front-end/views/elements/view-woo-checkout-tabs.js',
					'front-end/views/elements/view-woo-checkout-shipping.js',
					'front-end/views/elements/view-woo-checkout-payment.js',
					'front-end/views/elements/view-woo-checkout-order-review.js',
					'front-end/views/elements/view-woo-cart-table.js',
					'front-end/views/elements/view-woo-cart-coupons.js',
					'front-end/views/elements/view-woo-cart-shipping.js',
					'front-end/views/elements/view-woo-cart-totals.js',
					'front-end/views/elements/view-woo-mini-cart.js',
					'front-end/views/elements/view-post-cards.js',
					'front-end/views/widgets/view-widget-content.js',
					'front-end/views/widgets/view-revslider.js',
					'front-end/views/widgets/view-facebook.js',
					'front-end/views/widgets/view-wp-video.js',
					'front-end/views/components/view-author.js',
					'front-end/views/components/view-comments.js',
					'front-end/views/components/view-content.js',
					'front-end/views/components/view-featured-slider.js',
					'front-end/views/components/view-meta.js',
					'front-end/views/components/view-pagination.js',
					'front-end/views/components/view-related.js',
					'front-end/views/components/view-results.js',
					'front-end/views/components/view-archives.js',
					'front-end/views/components/view-woo-price.js',
					'front-end/views/components/view-woo-cart.js',
					'front-end/views/components/view-woo-stock.js',
					'front-end/views/components/view-woo-rating.js',
					'front-end/views/components/view-woo-short-description.js',
					'front-end/views/components/view-woo-reviews.js',
					'front-end/views/components/view-woo-additional-info.js',
					'front-end/views/components/view-woo-tabs.js',
					'front-end/views/components/view-woo-products.js',
					'front-end/views/components/view-woo-related.js',
					'front-end/views/components/view-woo-product-images.js',
					'front-end/views/components/view-woo-archives.js',
					'front-end/views/components/view-post-card-archives.js',
					'front-end/views/components/view-woo-filters.js',
					'front-end/views/components/view-woo-order-details.js',
					'front-end/views/components/view-woo-order-customer-details.js',
					'front-end/views/components/view-woo-order-table.js',
					'front-end/views/components/view-woo-order-downloads.js',
					'front-end/views/components/view-woo-order-additional-info.js',
					'front-end/views/view-blank-form.js',
					'front-end/views/form/view-form-base.js',
					'front-end/views/form/view-checkbox.js',
					'front-end/views/form/view-consent.js',
					'front-end/views/form/view-date.js',
					'front-end/views/form/view-select.js',
					'front-end/views/form/view-email.js',
					'front-end/views/form/view-hidden.js',
					'front-end/views/form/view-honeypot.js',
					'front-end/views/form/view-number.js',
					'front-end/views/form/view-password.js',
					'front-end/views/form/view-phone-number.js',
					'front-end/views/form/view-image-select.js',
					'front-end/views/form/view-image-select-input.js',
					'front-end/views/form/view-radio.js',
					'front-end/views/form/view-range.js',
					'front-end/views/form/view-rating.js',
					'front-end/views/form/view-recaptcha.js',
					'front-end/views/form/view-submit.js',
					'front-end/views/form/view-notice.js',
					'front-end/views/form/view-text.js',
					'front-end/views/form/view-textarea.js',
					'front-end/views/form/view-time.js',
					'front-end/views/form/view-upload.js',
					'front-end/views/elements/view-post-card-image.js',
					'front-end/views/elements/view-woo-upsells.js',
					'front-end/views/elements/view-post-card-cart.js',
					'front-end/views/elements/view-facebook-page.js',
					'front-end/views/elements/view-twitter-timeline.js',
					'front-end/views/elements/view-flickr.js',
					'front-end/views/elements/view-tagcloud.js',
					'front-end/views/elements/view-instagram.js',
					'front-end/views/elements/view-table-of-contents.js',
					'front-end/views/elements/view-stripe-button.js',
					'front-end/views/elements/view-open-street-map.js',
					'front-end/views/elements/view-open-street-map-marker.js',

					'front-end/views/view-post-lock.js'
				],
				dest: 'front-end/fusion-frontend-combined.js'
			}
		},
		babel: {
			options: {
				sourceMap: false,
				presets: [ '@babel/preset-env' ]
			},
			dist: {
				files: {
					'js/fusion-builder.js': [ 'js/fusion-builder.js' ],
					'front-end/fusion-frontend-combined.js': [ 'front-end/fusion-frontend-combined.js' ]
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
				files: {
					'js/fusion-builder.js': [ 'js/fusion-builder.js' ],
					'front-end/fusion-frontend-combined.min.js': [ 'front-end/fusion-frontend-combined.js' ]
				}
			},
			general: {
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
					cwd: 'assets/js/general',
					src: '*.js',
					dest: 'assets/js/min/general'
				} ]
			},
			library: {
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
					cwd: 'assets/js/library',
					src: '*.js',
					dest: 'assets/js/min/library'
				} ]
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
						'inc/woocommerce/css/woocommerce.min.css': [ 'inc/woocommerce/css/woocommerce.css' ],
						'assets/css/animations.min.css': [ 'assets/css/animations.css' ],
						'assets/css/bootstrap-animations.min.css': [ 'assets/css/bootstrap-animations.css' ],

						'assets/css/lite-yt-embed.min.css': [ 'assets/css/lite-yt-embed.css' ],
						'assets/css/lite-vimeo-embed.min.css': [ 'assets/css/lite-vimeo-embed.css' ],

						'assets/css/ilightbox.min.css': 'assets/css/ilightbox.css',
						'assets/css/ilightbox-dark-skin.min.css': 'assets/css/ilightbox-dark-skin.css',
						'assets/css/ilightbox-light-skin.min.css': 'assets/css/ilightbox-light-skin.css',
						'assets/css/ilightbox-mac-skin.min.css': 'assets/css/ilightbox-mac-skin.css',
						'assets/css/ilightbox-metro-black-skin.min.css': 'assets/css/ilightbox-metro-black-skin.css',
						'assets/css/ilightbox-metro-white-skin.min.css': 'assets/css/ilightbox-metro-white-skin.css',
						'assets/css/ilightbox-parade-skin.min.css': 'assets/css/ilightbox-parade-skin.css',
						'assets/css/ilightbox-smooth-skin.min.css': 'assets/css/ilightbox-smooth-skin.css',

						'assets/css/layout.min.css': 'assets/css/layout.css',

						'assets/css/components/archives.min.css': 'assets/css/components/archives.css',
						'assets/css/components/author.min.css': 'assets/css/components/author.css',
						'assets/css/components/comments.min.css': 'assets/css/components/comments.css',
						'assets/css/components/content.min.css': 'assets/css/components/content.css',
						'assets/css/components/pagination.min.css': 'assets/css/components/pagination.css',
						'assets/css/components/meta.min.css': 'assets/css/components/meta.css',
						'assets/css/components/woo-additional-info.min.css': 'assets/css/components/woo-additional-info.css',
						'assets/css/components/related.min.css': 'assets/css/components/related.css',

						'assets/css/components/woo-price.min.css': 'assets/css/components/woo-price.css',
						'assets/css/components/woo-rating.min.css': 'assets/css/components/woo-rating.css',
						'assets/css/components/woo-reviews.min.css': 'assets/css/components/woo-reviews.css',
						'assets/css/components/woo-short-description.min.css': 'assets/css/components/woo-short-description.css',
						'assets/css/components/woo-stock.min.css': 'assets/css/components/woo-stock.css',
						'assets/css/components/woo-tabs.min.css': 'assets/css/components/woo-tabs.css',
						'assets/css/components/woo-product-images.min.css': 'assets/css/components/woo-product-images.css',
						'assets/css/components/woo-cart.min.css': 'assets/css/components/woo-cart.css',
						'assets/css/components/woo-products.min.css': 'assets/css/components/woo-products.css',
						'assets/css/components/woo-filters.min.css': 'assets/css/components/woo-filters.css',
						'assets/css/components/woo-order-details.min.css': 'assets/css/components/woo-order-details.css',
						'assets/css/components/woo-order-downloads.min.css': 'assets/css/components/woo-order-downloads.css',
						'assets/css/components/woo-order-customer-details.min.css': 'assets/css/components/woo-order-customer-details.css',
						'assets/css/components/woo-order-table.min.css': 'assets/css/components/woo-order-table.css',
						'assets/css/components/woo-order-additional-info.min.css': 'assets/css/components/woo-order-additional-info.css',

						'assets/css/form/checkbox.min.css': 'assets/css/form/checkbox.css',
						'assets/css/form/honeypot.min.css': 'assets/css/form/honeypot.css',
						'assets/css/form/image-select.min.css': 'assets/css/form/image-select.css',
						'assets/css/form/radio.min.css': 'assets/css/form/radio.css',
						'assets/css/form/range.min.css': 'assets/css/form/range.css',
						'assets/css/form/rating.min.css': 'assets/css/form/rating.css',
						'assets/css/form/select.min.css': 'assets/css/form/select.css',
						'assets/css/form/upload.min.css': 'assets/css/form/upload.css',
						'assets/css/form/submit.min.css': 'assets/css/form/submit.css',

						'assets/css/shortcodes/audio.min.css': 'assets/css/shortcodes/audio.css',
						'assets/css/shortcodes/alert.min.css': 'assets/css/shortcodes/alert.css',
						'assets/css/shortcodes/blog.min.css': 'assets/css/shortcodes/blog.css',
						'assets/css/shortcodes/button.min.css': 'assets/css/shortcodes/button.css',
						'assets/css/shortcodes/button-sliders.min.css': 'assets/css/shortcodes/button-sliders.css',
						'assets/css/shortcodes/button-presets.min.css': 'assets/css/shortcodes/button-presets.css',
						'assets/css/shortcodes/chart.min.css': 'assets/css/shortcodes/chart.css',
						'assets/css/shortcodes/checklist.min.css': 'assets/css/shortcodes/checklist.css',
						'assets/css/shortcodes/content-boxes.min.css': 'assets/css/shortcodes/content-boxes.css',
						'assets/css/shortcodes/countdown.min.css': 'assets/css/shortcodes/countdown.css',
						'assets/css/shortcodes/counters-circle.min.css': 'assets/css/shortcodes/counters-circle.css',
						'assets/css/shortcodes/counters-box.min.css': 'assets/css/shortcodes/counters-box.css',
						'assets/css/shortcodes/dropcap.min.css': 'assets/css/shortcodes/dropcap.css',
						'assets/css/shortcodes/flexslider.min.css': 'assets/css/shortcodes/flexslider.css',
						'assets/css/shortcodes/flip-boxes.min.css': 'assets/css/shortcodes/flip-boxes.css',
						'assets/css/shortcodes/icon.min.css': 'assets/css/shortcodes/icon.css',
						'assets/css/shortcodes/login.min.css': 'assets/css/shortcodes/login.css',
						'assets/css/shortcodes/lottie.min.css': 'assets/css/shortcodes/lottie.css',
						'assets/css/shortcodes/fullwidth.min.css': 'assets/css/shortcodes/fullwidth.css',
						'assets/css/shortcodes/fullwidth-flex.min.css': 'assets/css/shortcodes/fullwidth-flex.css',
						'assets/css/shortcodes/fullwidth-sticky.min.css': 'assets/css/shortcodes/fullwidth-sticky.css',
						'assets/css/shortcodes/fullwidth-absolute.min.css': 'assets/css/shortcodes/fullwidth-absolute.css',
						'assets/css/shortcodes/google-map.min.css': 'assets/css/shortcodes/google-map.css',
						'assets/css/shortcodes/highlight.min.css': 'assets/css/shortcodes/highlight.css',
						'assets/css/shortcodes/image.min.css': 'assets/css/shortcodes/image.css',
						'assets/css/shortcodes/image-before-after.min.css': 'assets/css/shortcodes/image-before-after.css',
						'assets/css/shortcodes/text.min.css': 'assets/css/shortcodes/text.css',
						'assets/css/shortcodes/image-carousel.min.css': 'assets/css/shortcodes/image-carousel.css',
						'assets/css/shortcodes/image-hotspots.min.css': 'assets/css/shortcodes/image-hotspots.css',
						'assets/css/shortcodes/layout-columns.min.css': 'assets/css/shortcodes/layout-columns.css',
						'assets/css/shortcodes/modal.min.css': 'assets/css/shortcodes/modal.css',
						'assets/css/shortcodes/news-ticker.min.css': 'assets/css/shortcodes/news-ticker.css',
						'assets/css/shortcodes/person.min.css': 'assets/css/shortcodes/person.css',
						'assets/css/shortcodes/popover.min.css': 'assets/css/shortcodes/popover.css',
						'assets/css/shortcodes/portfolio.min.css': 'assets/css/shortcodes/portfolio.css',
						'assets/css/shortcodes/pricingtable.min.css': 'assets/css/shortcodes/pricingtable.css',
						'assets/css/shortcodes/progressbar.min.css': 'assets/css/shortcodes/progressbar.css',
						'assets/css/shortcodes/recent-posts.min.css': 'assets/css/shortcodes/recent-posts.css',
						'assets/css/shortcodes/scroll-progress.min.css': 'assets/css/shortcodes/scroll-progress.css',
						'assets/css/shortcodes/section-separator.min.css': 'assets/css/shortcodes/section-separator.css',
						'assets/css/shortcodes/separator.min.css': 'assets/css/shortcodes/separator.css',
						'assets/css/shortcodes/sharingbox.min.css': 'assets/css/shortcodes/sharingbox.css',
						'assets/css/shortcodes/star-rating.min.css': 'assets/css/shortcodes/star-rating.css',
						'assets/css/shortcodes/media-slider.min.css': 'assets/css/shortcodes/media-slider.css',
						'assets/css/shortcodes/social-links.min.css': 'assets/css/shortcodes/social-links.css',
						'assets/css/shortcodes/tabs.min.css': 'assets/css/shortcodes/tabs.css',
						'assets/css/shortcodes/table.min.css': 'assets/css/shortcodes/table.css',
						'assets/css/shortcodes/tagline.min.css': 'assets/css/shortcodes/tagline.css',
						'assets/css/shortcodes/testimonials.min.css': 'assets/css/shortcodes/testimonials.css',
						'assets/css/shortcodes/title.min.css': 'assets/css/shortcodes/title.css',
						'assets/css/shortcodes/toggles.min.css': 'assets/css/shortcodes/toggles.css',
						'assets/css/shortcodes/tooltip.min.css': 'assets/css/shortcodes/tooltip.css',
						'assets/css/shortcodes/video.min.css': 'assets/css/shortcodes/video.css',
						'assets/css/shortcodes/views-counter.min.css': 'assets/css/shortcodes/views-counter.css',
						'assets/css/shortcodes/widget-area.min.css': 'assets/css/shortcodes/widget-area.css',
						'assets/css/shortcodes/woo-featured-products-slider.min.css': 'assets/css/shortcodes/woo-featured-products-slider.css',
						'assets/css/shortcodes/woo-product-slider.min.css': 'assets/css/shortcodes/woo-product-slider.css',
						'assets/css/shortcodes/woo-product-grid.min.css': 'assets/css/shortcodes/woo-product-grid.css',
						'assets/css/shortcodes/woo-mini-cart.min.css': 'assets/css/shortcodes/woo-mini-cart.css',
						'assets/css/shortcodes/woo-sorting.min.css': 'assets/css/shortcodes/woo-sorting.css',
						'assets/css/shortcodes/youtube.min.css': 'assets/css/shortcodes/youtube.css',
						'assets/css/shortcodes/events.min.css': 'assets/css/shortcodes/events.css',
						'assets/css/shortcodes/isotope.min.css': 'assets/css/shortcodes/isotope.css',
						'assets/css/shortcodes/image-hovers.min.css': 'assets/css/shortcodes/image-hovers.css',
						'assets/css/shortcodes/grid.min.css': 'assets/css/shortcodes/grid.css',
						'assets/css/shortcodes/gallery.min.css': 'assets/css/shortcodes/gallery.css',
						'assets/css/shortcodes/syntax-highlighter.min.css': 'assets/css/shortcodes/syntax-highlighter.css',
						'assets/css/shortcodes/pagination.min.css': 'assets/css/shortcodes/pagination.css',
						'assets/css/shortcodes/rollover.min.css': 'assets/css/shortcodes/rollover.css',
						'assets/css/shortcodes/widget.min.css': 'assets/css/shortcodes/widget.css',
						'assets/css/shortcodes/post-card-image.min.css': 'assets/css/shortcodes/post-card-image.css',
						'assets/css/shortcodes/post-card-cart.min.css': 'assets/css/shortcodes/post-card-cart.css',
						'assets/css/shortcodes/post-cards.min.css': 'assets/css/shortcodes/post-cards.css',
						'assets/css/fusion-form.min.css' : 'assets/css/fusion-form.css',
						'assets/css/fusion-form-rtl.min.css' : 'assets/css/fusion-form-rtl.css',
						'assets/css/shortcodes/woo-cart-totals.min.css': 'assets/css/shortcodes/woo-cart-totals.css',
						'assets/css/shortcodes/woo-checkout-order-review.min.css': 'assets/css/shortcodes/woo-checkout-order-review.css',
						'assets/css/shortcodes/woo-checkout-billing.min.css': 'assets/css/shortcodes/woo-checkout-billing.css',
						'assets/css/shortcodes/woo-cart-table.min.css': 'assets/css/shortcodes/woo-cart-table.css',
						'assets/css/shortcodes/woo-cart-shipping.min.css': 'assets/css/shortcodes/woo-cart-shipping.css',
						'assets/css/shortcodes/woo-cart-coupons.min.css': 'assets/css/shortcodes/woo-cart-coupons.css',
						'assets/css/shortcodes/woo-checkout-payment.min.css': 'assets/css/shortcodes/woo-checkout-payment.css',
						'assets/css/shortcodes/woo-checkout-shipping.min.css': 'assets/css/shortcodes/woo-checkout-shipping.css',
						'assets/css/shortcodes/woo-checkout-tabs.min.css': 'assets/css/shortcodes/woo-checkout-tabs.css',
						'assets/css/shortcodes/woo-notices.min.css': 'assets/css/shortcodes/woo-notices.css',
						'assets/css/shortcodes/circles-info.min.css' : 'assets/css/shortcodes/circles-info.css',
						'assets/css/shortcodes/swiper.min.css': 'assets/css/shortcodes/swiper.css',
						'assets/css/shortcodes/leaflet.min.css': 'assets/css/shortcodes/leaflet.css',
						'assets/css/shortcodes/open-street-map.min.css': 'assets/css/shortcodes/open-street-map.css',

						'assets/css/shortcodes/submenu.min.css' : 'assets/css/shortcodes/submenu.css',
						'assets/css/shortcodes/submenu-vertical.min.css' : 'assets/css/shortcodes/submenu-vertical.css',
						'assets/css/shortcodes/submenu-stacked.min.css' : 'assets/css/shortcodes/submenu-stacked.css',

						'assets/css/shortcodes/facebook-page.min.css': 'assets/css/shortcodes/facebook-page.css',
						'assets/css/shortcodes/twitter-timeline.min.css': 'assets/css/shortcodes/twitter-timeline.css',
						'assets/css/shortcodes/flickr.min.css': 'assets/css/shortcodes/flickr.css',
						'assets/css/shortcodes/tagcloud.min.css': 'assets/css/shortcodes/tagcloud.css',
						'assets/css/shortcodes/instagram.min.css': 'assets/css/shortcodes/instagram.css',
						'assets/css/shortcodes/table-of-contents.min.css': 'assets/css/shortcodes/table-of-contents.css',
						'assets/css/shortcodes/breadcrumbs.min.css': 'assets/css/shortcodes/breadcrumbs.css',
						'assets/css/shortcodes/search.min.css': 'assets/css/shortcodes/search.css',

						'assets/css/side-header.min.css': 'assets/css/side-header.css',
						'assets/css/off-canvas.min.css': 'assets/css/off-canvas.css',

						'assets/css/shortcodes/menu.min.css': 'assets/css/shortcodes/menu.css',
						'assets/css/shortcodes/menu-vertical.min.css': 'assets/css/shortcodes/menu-vertical.css',
						'assets/css/shortcodes/menu-stacked.min.css': 'assets/css/shortcodes/menu-stacked.css',
						'assets/css/shortcodes/menu-mobile.min.css': 'assets/css/shortcodes/menu-mobile.css',
						'assets/css/shortcodes/menu-arrows.min.css': 'assets/css/shortcodes/menu-arrows.css',
						'assets/css/shortcodes/menu-woo.min.css': 'assets/css/shortcodes/menu-woo.css',
						'assets/css/shortcodes/menu-flyout.min.css': 'assets/css/shortcodes/menu-flyout.css',
						'assets/css/shortcodes/menu-search.min.css': 'assets/css/shortcodes/menu-search.css',
						'assets/css/shortcodes/menu-mega.min.css': 'assets/css/shortcodes/menu-mega.css',
						'assets/css/shortcodes/menu-mega-legacy.min.css': 'assets/css/shortcodes/menu-mega-legacy.css'
					},
					{
						expand: true,
						dot: true,
						cwd: 'assets/css/media/',
						src: [ '*.css', '!*.min.css' ],
						dest: 'assets/css/media',
						rename: function( dest, src ) {
							return dest + '/' + src.replace( '.css', '.min.css' );
						}
					}
				]
			}
		},

		exec: {
			gitClone: 'rm -Rf inc/lib && git clone -b master git@github.com:Theme-Fusion/Fusion-Library.git inc/lib',
			gitCloneWindows: 'rmdir "./inc/lib" /s /q && git clone -b master https://github.com/Theme-Fusion/Fusion-Library.git inc/lib'
		},

		// JSHint.
		jshint: {
			all: [ 'Gruntfile.js', 'js/*.js', 'js/**/*.js', 'assets/js/general/*.js', '!js/fusion-builder.js', '!js/wNumb.js', '!js/sticky-menu.js' ]
		},

		watch: {
			css: {
				files: [ '**/*.less', '**/**/*.less' ],
				tasks: [ 'less:development', 'csscomb', 'cssmin' ]
			},
			js: {
				files: [ '**/*.js', '**/**/*.js', '**/**/**/*.js', '**/**/**/**/*.js' ],
				tasks: [ 'jshint', 'concat:main', 'concat:frontEndCombo', 'uglify' ]
			}
		}
	} );

	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify-es' );
	grunt.loadNpmTasks( 'grunt-contrib-less' );
	grunt.loadNpmTasks( 'grunt-csscomb' );
	grunt.loadNpmTasks( 'grunt-contrib-csslint' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-wp-i18n' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-exec' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-babel' );

	var isWin = process.platform === "win32";
	var gitClone = 'exec:gitClone';
	if ( isWin ) {
		gitClone = 'exec:gitCloneWindows';
	}

	grunt.registerTask( 'default', [ 'less', 'csscomb', 'cssmin', 'concat:main', 'concat:frontEndCombo', gitClone, 'addtextdomain', 'uglify:main', 'uglify:general', 'uglify:library', 'makepot', 'copy:proxy', 'clean:proxy', 'copy:final', 'clean:final' ] );
	grunt.registerTask( 'nofl', [ 'less', 'csscomb', 'cssmin', 'concat:main', 'concat:frontEndCombo', 'uglify:main', 'uglify:general', 'uglify:library', 'makepot', 'copy:proxy', 'clean:proxy', 'copy:final', 'clean:final' ] );
	grunt.registerTask( 'css', [ 'less', 'csscomb', 'cssmin' ] );
	grunt.registerTask( 'js', [ 'uglify:main', 'uglify:general', 'uglify:library' ] );
};
