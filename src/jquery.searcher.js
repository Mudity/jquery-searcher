(function IIFE() {

"use strict";

function factory($) {

	var pluginName = "searcher",
		dataKey = "plugin_" + pluginName,
		defaults = {
			itemSelector: "tbody > tr",
			textSelector: "td",
			inputSelector: "",
			caseSensitive: false,
			toggle: function(item, containsText) {
				$(item).toggle(containsText);
			}
		};

	function Searcher(element, options)
	{
		this.element = element;

		this.options = $.extend({ }, defaults, options);

		this._create();
	}

	Searcher.prototype = {
		_create: function()
		{
			this._$element = $(this.element);

			// find the input and listen to various events
			var fn = $.proxy(this._onValueChange, this);
			this._$input = $(this.options.inputSelector).bind("input change keyup", fn);

			// remember the last entered value
			this._lastValue = "";
		},
		_onValueChange: function()
		{
			var options = this.options,
				textSelector = options.textSelector,
				caseSensitive = options.caseSensitive,
				toggle = options.toggle,
				value = this._$input.val();

			// lower text for case insensitive searches
			if (!caseSensitive)
				value = value.toLowerCase();

			if (value === this._lastValue)
				return; // nothing has changed

			this._lastValue = value;

			this._$element
				.find(options.itemSelector)
				.each(function eachItem() {
					var $item = $(this),
						$textElements = $item;

					if (textSelector)
						$textElements = $item.find(textSelector);

					$textElements = $textElements.filter(function eachTextElements() {
						// lower all texts for case insensitive searches
						var text = $(this).text();
						if (!caseSensitive)
							text = text.toLowerCase();

						return text.indexOf(value) >= 0;
					});

					toggle(this, $textElements.length > 0);
				});
		}
	};

	$.fn[pluginName] = function pluginHandler(options) {
		return this.each(function() {
			var searcher = $.data(this, dataKey);
			// either create a new searcher
			if (!searcher)
				$.data(this, dataKey, new Searcher(this, options));
			// or update the options
			else
				$.extend(searcher.options, options);
		});
	};

}

// AMD style (register as an anonymous module)
if (typeof(define) === "function" && define.amd)
	define(["jquery"], factory);
// node/CommonJS style (for Browserify)
else if (typeof(exports) === "object")
	module.exports = factory;
// browser
else
	factory(jQuery);

}).call(this);