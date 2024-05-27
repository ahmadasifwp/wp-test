/* ========================================================================
 * Bootstrap: tab.js v3.1.1
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
	'use strict';

	// TAB CLASS DEFINITION
	// ====================

	var Tab = function (element) {
	this.element = $(element);
	};

	Tab.prototype.show = function () {
	var $this	= this.element;
	var $ul	  = $this.closest('ul:not(.dropdown-menu)');
	var selector = $this.data('target');

	if (!selector) {
		selector = $this.attr('href');
		selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
	}

	if ($this.parent('li').hasClass('active')) return;

	var previous = $ul.find('.active:last a')[0];
	var e		= $.Event('show.bs.tab', {
		relatedTarget: previous
	});

	$this.trigger(e);

	if (e.isDefaultPrevented()) return;

	var $target = $( document ).find( selector );

	this.activate($this.parent('li'), $ul);

	this.activate($target, $target.parent(), function () {
		$this.trigger({
		type: 'shown.bs.tab',
		relatedTarget: previous
		});
	});
	};

	Tab.prototype.toggle = function () {
		const $this	= this.element;
		let selector = $this.data('target');

		if (!selector) {
			selector = $this.attr('href');
			selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
		}

		$this.parent('li').toggleClass( 'active' );
		
		const $target = $( document ).find( selector );
		$target.toggleClass( 'active fade in' );

	};

	Tab.prototype.activate = function (element, container, callback) {
		var $active	= container.find('> .active');
		var transition = callback
			&& $.support.transition
			&& $active.hasClass('fade');

		function next() {
			$active
			.removeClass('active')
			.find('> .dropdown-menu > .active')
			.removeClass('active');

			element.addClass('active');

			// ThemeFusion edit for Avada theme: needed for mobile tabs setup
			if ( element.parent( '.nav-tabs' ).length ) {
				element.parents( '.fusion-tabs' ).find( '.nav' ).find( 'a[href="' + element.find( 'a' ).attr( 'href' ) + '"]' ).parent().addClass( 'active' );
			}

			if (transition) {
				element[0].offsetWidth; // reflow for transition
				element.addClass('in');
			} else {
				element.removeClass('fade');
			}

			if (element.parent('.dropdown-menu')) {
				element.closest('li.dropdown').addClass('active');
			}
			// ThemeFusion editor for front-end preview.
			if ( element.parents( '.fusion-builder-live-editor' ).length && 'undefined' !== typeof element.attr( 'id' ) ) {
				element.parents( '.fusion-tabs' ).find( '.tab-link[href="#' + element.attr( 'id' ) + '"]' ).parents( 'li' ).addClass( 'active' );
			}
			callback && callback();
		}

		transition ?
			$active
			.one($.support.transition.end, next)
			.emulateTransitionEnd(150) :
			next();

		$active.removeClass('in');
	};


	// TAB PLUGIN DEFINITION
	// =====================

	var old = $.fn.tab;

	$.fn.tab = function ( option ) {
	return this.each(function () {
		var $this = $(this);
		var data  = $this.data('bs.tab');

		if (!data) $this.data('bs.tab', (data = new Tab(this)));
		if (typeof option == 'string') data[option]();
	});
	};

	$.fn.tab.Constructor = Tab;


	// TAB NO CONFLICT
	// ===============

	$.fn.tab.noConflict = function () {
	$.fn.tab = old;
	return this;
	};


	// TAB DATA-API
	// ============

	$(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
	e.preventDefault();

	const fusionTabs = $(this).parents( '.fusion-tabs' );
	if ( fusionTabs.length && fusionTabs.hasClass( 'mobile-mode-toggle' ) && $( this ).parents( '.nav' ).hasClass( 'fusion-mobile-tab-nav' ) ) {
		$(this).tab('toggle');
	} else {
		$(this).tab('show');
	}
	});

}(jQuery);
