/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.2
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
	'use strict';

	// SCROLLSPY CLASS DEFINITION
	// ==========================

	function ScrollSpy(element, options) {
		this.processWithBind  = $.proxy(this.process, this);

		this.$body          = $('body');
		this.$scrollElement = $(element).is('body') ? $(window) : $(element);
		this.options        = $.extend({}, ScrollSpy.DEFAULTS, options);
		this.selector       = (this.options.target || '') + ' li > a';
		this.offsets        = [];
		this.targets        = [];
		this.activeTarget   = null;
		this.scrollHeight   = 0;

		this.$scrollElement.on('scroll.bs.scrollspy', this.processWithBind);
		this.refresh();
		this.process();
	}

	ScrollSpy.VERSION  = '3.3.2';

	ScrollSpy.DEFAULTS = {
		offset: 10
	};

	ScrollSpy.prototype.getScrollHeight = function () {
		return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight);
	};

	ScrollSpy.prototype.refresh = function () {
		var offsetMethod = 'offset';
		var offsetBase   = 0;

		// ThemeFusion Edit.
		if ( ! fusion.isWindow(this.$scrollElement[0]) ) {
			offsetMethod = 'position';
			offsetBase   = this.$scrollElement.scrollTop();
		};

		this.offsets = [];
		this.targets = [];
		this.scrollHeight = this.getScrollHeight();

		var self     = this;

		this.$body
			.find(this.selector)
			.map(function () {
				var $el   = $(this);
				var href  = $el.data('target') || $el.attr('href');
				var $href = /^#./.test(href) && $(href);

				return ($href
					&& $href.length
					&& $href.is(':visible')
					&& [[$href[offsetMethod]().top + offsetBase, href]]) || null;
			})
			.sort(function (a, b) { return a[0] - b[0]; })
			.each(function () {
				self.offsets.push(this[0]);
				self.targets.push(this[1]);
			});
	};

	ScrollSpy.prototype.process = function () {
		var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset;
		var scrollHeight = this.getScrollHeight();
		var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height();
		var offsets      = this.offsets;
		var targets      = this.targets;
		var activeTarget = this.activeTarget;
		var i;

		if (this.scrollHeight != scrollHeight) {
			this.refresh();
		};

		if (scrollTop >= maxScroll) {
			return activeTarget != (i = targets[targets.length - 1]) && this.activate(i);
		};

		if (activeTarget && scrollTop < offsets[0]) {
			this.activeTarget = null;
			return this.clear();
		};

		for (i = offsets.length; i--;) {
			activeTarget != targets[i]
				&& scrollTop >= offsets[i]
				&& (!offsets[i + 1] || scrollTop <= offsets[i + 1])
				&& this.activate(targets[i]);
		};
	};

	ScrollSpy.prototype.activate = function (target) {
		this.activeTarget = target;

		this.clear();

	var currentItemClass = this.options.currentItemClass ? this.options.currentItemClass : 'current-menu-item';

	// ThemeFusion edit for Avada theme: added the full url anchors to the selector to make sure highlighting works correctly
	var $current_href = window.location.href.split( '#' ),
		$current_path = ( $current_href[0].charAt( $current_href[0].length - 1 ) == '/' ) ? $current_href[0] : $current_href[0] + '/';

	var selector = this.selector +
		'[data-target="' + target + '"],' +
		this.selector + '[href="' + target + '"],' +
		this.selector + '[href="' + $current_path + target + '"]';

	var active = $(selector)
		.parents('li')
		.addClass( currentItemClass );

	if (active.parent('.sub-menu').length) {
		active = active
		.closest('li.fusion-dropdown-menu')
		.addClass( currentItemClass );
	};

		active.trigger('activate.bs.scrollspy');

		if ( active ) {
			$(this.selector).blur();
		}
	};

	ScrollSpy.prototype.clear = function () {
		var currentItemClass = this.options.currentItemClass ? this.options.currentItemClass : 'current-menu-item';
		$(this.selector)
			.parentsUntil(this.options.target, '.' + currentItemClass)
			.removeClass(currentItemClass);

		$(this.selector).parentsUntil(this.options.target, '.current-menu-parent').removeClass( 'current-menu-parent' );
	};

	ScrollSpy.prototype.stopListening = function () {
		this.$scrollElement.off('scroll.bs.scrollspy', this.processWithBind);
	};

	window.awbScrollSpy = ScrollSpy; // ThemeFusion Edit: Allow using the class directly, for multiple instances(jQuery prevent that).

	// SCROLLSPY PLUGIN DEFINITION
	// ===========================

	function Plugin(option) {
		return this.each(function () {
			var $this   = $(this);
			var data    = $this.data('bs.scrollspy');
			var options = typeof option == 'object' && option;

			if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)));
			if (typeof option == 'string') data[option]();
		});
	};

	var old = $.fn.scrollspy;

	$.fn.scrollspy             = Plugin;
	$.fn.scrollspy.Constructor = ScrollSpy;


	// SCROLLSPY NO CONFLICT
	// =====================

	$.fn.scrollspy.noConflict = function () {
		$.fn.scrollspy = old;
		return this;
	};


	// SCROLLSPY DATA-API
	// ==================

	$(window).on('load.bs.scrollspy.data-api', function () {
		$('[data-spy="scroll"]').each(function () {
			var $spy = $(this);
			Plugin.call($spy, $spy.data());
		});
	});

}(jQuery);
