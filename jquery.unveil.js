/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

;(function($) {
	$.fn.unveil = function(threshold, throttle, callback) {
		var self = this;

		var $w = $(window),
			th = threshold || 0,
			retina = window.devicePixelRatio > 1,
			attrib = retina? "data-src-retina" : "data-src",
			timer,
			images = this;

		// was one, but did not trigger for added elements
		function unveilElem(index, elem) {
			var source = elem.getAttribute(attrib);
			source = source || elem.getAttribute("data-src");
			if (source) {
				elem.setAttribute("src", source);
				if (typeof callback === "function") {
					callback.call(elem);
				}
			}
		};

		function render() {
			var inview = images.filter(function() {
				var $e = $(this);
				if ($e.is(":hidden")) {
					return;
				}

				var wt = $w.scrollTop(),
					wb = wt + $w.height(),
					et = $e.offset().top,
					eb = et + $e.height();

				return eb >= wt - th && et <= wb + th;
			});

			inview.each(unveilElem);
			images = images.not(inview);
		}

		function unveil() {
			render();
		}

		function unveilThrottled() {
			if (timer) {
				return;
			}

			render();

			timer = setTimeout(function () {
				timer = undefined;
			}, throttle);
		}

		function add(e, image) {
			images = images.add(image);
		}

		// triggered via scroll, resize, etc., not scroll.unveil
		$w.on("scroll.unveil resize.unveil touchmove.unveil", unveilThrottled);
		$w.on("lookup.unveil", unveil);
		$w.on("add.unveil", add);

		unveil();

		return self;
	};
})(window.jQuery || window.Zepto);
