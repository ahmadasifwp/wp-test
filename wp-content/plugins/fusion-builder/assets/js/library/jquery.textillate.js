// Lettering.JS
(function($){
	function injector(t, splitter, klass, after) {
		var a = t.text().split(splitter), inject = '';
		if (a.length) {
			$(a).each(function(i, item) {
				inject += '<span class="'+klass+(i+1)+'">'+item+'</span>'+after;
			});
			t.empty().append(inject);
		}
	}

	var methods = {
		init : function() {

			return this.each(function() {
				injector($(this), '', 'char', '');
			});

		},

		words : function() {

			return this.each(function() {
				injector($(this), ' ', 'word', ' ');
			});

		},

		lines : function() {

			return this.each(function() {
				var r = "eefec303079ad17405c889e092e105b0";
				// Because it's hard to split a <br/> tag consistently across browsers,
				// (*ahem* IE *ahem*), we replaces all <br/> instances with an md5 hash
				// (of the word "split").  If you're trying to use this plugin on that
				// md5 hash string, it will fail because you're being ridiculous.
				injector($(this).children("br").replaceWith(r).end(), r, 'line', '');
			});

		}
	};

	$.fn.lettering = function( method ) {
		// Method calling logic
		if ( method && methods[method] ) {
			return methods[ method ].apply( this, [].slice.call( arguments, 1 ));
		} else if ( method === 'letters' || ! method ) {
			return methods.init.apply( this, [].slice.call( arguments, 0 ) ); // always pass an array
		}
		$.error( 'Method ' +  method + ' does not exist on jQuery.lettering' );
		return this;
	};

})(jQuery);
// Lettering.JS ends.


/*
 * textillate.js
 * http://jschr.github.com/textillate
 * MIT licensed
 *
 * Copyright (C) 2012-2013 Jordan Schroter
 */

(function ($) {
  "use strict";

  function isInEffect (effect) {
    return /In/.test(effect) || $.inArray(effect, $.fn.textillate.defaults.inEffects) >= 0;
  };

  function isOutEffect (effect) {
    return /Out/.test(effect) || $.inArray(effect, $.fn.textillate.defaults.outEffects) >= 0;
  };


  function stringToBoolean(str) {
    if (str !== "true" && str !== "false") return str;
    return (str === "true");
  };

  // custom get data api method
  function getData (node) {
    var attrs = node.attributes || []
      , data = {};

    if (!attrs.length) return data;

    $.each(attrs, function (i, attr) {
      var nodeName = attr.nodeName.replace(/delayscale/, 'delayScale');
      if (/^data-in-*/.test(nodeName)) {
        data.in = data.in || {};
        data.in[nodeName.replace(/data-in-/, '')] = stringToBoolean(attr.nodeValue);
      } else if (/^data-out-*/.test(nodeName)) {
        data.out = data.out || {};
        data.out[nodeName.replace(/data-out-/, '')] =stringToBoolean(attr.nodeValue);
      } else if (/^data-*/.test(nodeName)) {
        data[nodeName.replace(/data-/, '')] = stringToBoolean(attr.nodeValue);
      }
    })

    return data;
  }

  function shuffle (o) {
      for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
  }

  function animate ($t, effect, cb) {
    // ThemeFusion Edit.
    var $twidth = 0;
    if ( 'clipIn' === effect ) {
      $t.css('width','auto');
      $twidth = $t.width();
      $t.css('overflow', 'hidden');
      $t.css('width','0');
      $t.css('visibility', 'visible');

      $t.animate({ width: $twidth + ( parseFloat( $t.css( 'font-size' ) ) * 0.3 ) }, 1200, function () {
        setTimeout(function () {
          cb && cb();
        }, 100);
      });
    } else if ( 'clipOut' === effect ) {
      $t.animate({ width: '2px' }, 1200, function () {
        setTimeout(function () {
          cb && cb();
        }, 100);
      });
    } else if ( 'typeIn' === effect ) {
      $t.addClass('fusion-title-animated ' + effect).show();
    } else {
      $t.addClass('fusion-title-animated ' + effect).css('visibility', 'visible').show();
    }

    // Handle IE11 and Edge.
    if ( ( 'typeIn' === effect || 'typeOut' === effect ) && jQuery( 'html' ).hasClass( 'ua-edge' ) ) {
      $t.removeClass( 'fusion-title-animated ' + effect ).css('visibility', 'visible');
      cb && cb();
    }

    $t.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oAnimationEnd AnimationEnd', function () {
      $t.removeClass('fusion-title-animated ' + effect);
      cb && cb();
    } );

    // ThemeFusion Edit End.
  }

  function animateTokens ($tokens, options, cb) {
    var that = this
      , count = $tokens.length;

    if (!count) {
      cb && cb();
      return;
    }

    if (options.shuffle) $tokens = shuffle($tokens);
    if (options.reverse) $tokens = $tokens.toArray().reverse();

    $.each($tokens, function (i, t) {
      var $token = $(t);

      function complete () {
        if (isInEffect(options.effect)) {
          // ThemeFusion Edit.
          if ( 'typeOut' === options.effect ) {
            $token.css('display', 'inline-block');
          } else {
            $token.css('visibility', 'visible');
          }
        } else if (isOutEffect(options.effect)) {
          if ( 'typeOut' === options.effect ) {
            $token.css('display', 'none');
          } else {
            $token.css('visibility', 'hidden');
          }

        }
        count -= 1;
        if (!count && cb) cb();
      }

      var delay = options.sync ? options.delay : options.delay * i * options.delayScale;

      $token.text() ?
        setTimeout(function () { animate($token, options.effect, complete) }, delay) :
        complete();
    });
  };

  var Textillate = function (element, options) {
    var base = this
      , $element = $(element);

    base.init = function () {
      base.$texts = $element.find(options.selector);

      if (!base.$texts.length) {
        base.$texts = $('<ul class="texts"><li>' + $element.html() + '</li></ul>');
        $element.html(base.$texts);
      }

      base.$texts.hide();

      base.$current = $('<span class="fusion-textillate">')
        .html(base.$texts.find(':first-child').html())
        .prependTo($element);

      if (isInEffect(options.in.effect)) {
        base.$current.css('visibility', 'hidden');
      } else if (isOutEffect(options.out.effect)) {
        base.$current.css('visibility', 'visible');
      }

      base.setOptions(options);

      base.timeoutRun = null;

      setTimeout(function () {
        base.options.autoStart && base.start();
      }, base.options.initialDelay)
    };

    base.setOptions = function (options) {
      base.options = options;
    };

    base.triggerEvent = function (name) {
      var e = $.Event(name + '.tlt');
      $element.trigger(e, base);
      return e;
    };

    base.in = function (index, cb) {
      index = index || 0;

      var $elem = base.$texts.find(':nth-child(' + ((index||0) + 1) + ')')
        , options = $.extend(true, {}, base.options, $elem.length ? getData($elem[0]) : {})
        , $textsWrapper = base.$current.closest( '.fusion-animated-texts-wrapper' )
        , $tokens;

      $elem.addClass('current');

      base.triggerEvent('inAnimationBegin');
      $element.attr('data-active', $elem.data('id'));

      // ThemeFusion Edit.
      if ( base.options.length == 'line' ) {
        base.$current.html($elem.html()).lettering('lines');
      } else {
        base.$current.html($elem.html()).lettering('words');
      }

      // ThemeFusion Edit. Split words to individual characters if token type is set to 'char'
      if (base.options.length == "char") {
        base.$current.find('[class^="word"]')
            .css({
              'display': 'inline-block',
              // fix for poor ios performance
              '-webkit-transform': 'translate3d(0,0,0)',
              '-moz-transform': 'translate3d(0,0,0)',
              '-o-transform': 'translate3d(0,0,0)',
              'transform': 'translate3d(0,0,0)'
            })
            .each(function () { $(this).lettering() });
      }

      // ThemeFusion Edit.
      $tokens = base.$current
        .find('[class^="' + base.options.length + '"]')
        .css('display', 'inline-block');

      if (isInEffect(options.in.effect)) {
				if ( 'typeIn' === options.in.effect ) {
					$tokens.css('display', 'none');
				} else {
					$tokens.css('visibility', 'hidden');
				}

      } else if (isOutEffect(options.in.effect)) {
        $tokens.css('visibility', 'visible');
      }

      if ( ( 'typeIn' === options.in.effect || 'clipIn' === options.in.effect ) && ( 'undefined' === typeof $textsWrapper.attr( 'style' ) || -1 === $textsWrapper.attr( 'style' ).indexOf( 'width' ) ) ) {
        base.$current.closest( '.fusion-animated-texts-wrapper' ).css('width','auto');
      }

      base.currentIndex = index;

      animateTokens($tokens, options.in, function () {
        base.triggerEvent('inAnimationEnd');
        if (options.in.callback) options.in.callback();
        if (cb) cb(base);
      });
    };

    base.out = function (cb) {
      // ThemeFusion Edit.
      var $elem = base.$texts.find(':nth-child(' + ((base.currentIndex||0) + 1) + ')')
        , $tokens = base.$current.find('[class^="' + base.options.length + '"]')
        , options = $.extend(true, {}, base.options, $elem.length ? getData($elem[0]) : {})

      base.triggerEvent('outAnimationBegin');

      animateTokens($tokens, options.out, function () {
        $elem.removeClass('current');
        base.triggerEvent('outAnimationEnd');
        $element.removeAttr('data-active');
        if (options.out.callback) options.out.callback();
        if (cb) cb(base);
      });
    };

    base.start = function (index) {
      setTimeout(function () {
        base.triggerEvent('start');

        (function run (index) {
          base.in(index, function () {
            var length = base.$texts.children().length;

            index += 1;

            if (!base.options.loop && index >= length) {
              if (base.options.callback) base.options.callback();
              base.triggerEvent('end');
            } else {
              index = index % length;

              base.timeoutRun = setTimeout(function () {
                base.out(function () {
                  run(index)
                });
              }, base.options.minDisplayTime);
            }
          });
        }(index || 0));
      }, base.options.initialDelay);
    };

    base.stop = function () {
      if (base.timeoutRun) {
        clearInterval(base.timeoutRun);
        base.timeoutRun = null;
      }
    };

    base.init();
  }

  $.fn.textillate = function (settings, args) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('textillate')
        , options = $.extend(true, {}, $.fn.textillate.defaults, getData(this), typeof settings == 'object' && settings);

      if (!data) {
        $this.data('textillate', (data = new Textillate(this, options)));
      } else if (typeof settings == 'string') {
        data[settings].apply(data, [].concat(args));
      } else {
        data.setOptions.call(data, options);
      }
    })
  };

  $.fn.textillate.defaults = {
    selector: '.texts',
    loop: true,
    minDisplayTime: 1200,
    initialDelay: 0,
    in: {
      effect: 'fadeIn',
      delayScale: 1.5,
      delay: 100,
      sync: false,
      reverse: false,
      shuffle: false,
      callback: function () {}
    },
    out: {
      effect: 'fadeOut',
      delayScale: 1.5,
      delay: 100,
      sync: false,
      reverse: false,
      shuffle: false,
      callback: function () {}
    },
    autoStart: true,
    inEffects: [],
    outEffects: [ 'hinge' ],
    callback: function () {},
    type: 'word'
  };

}(jQuery));
