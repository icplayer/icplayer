/**
 * @module commons
 */
(function (window) {
	window.Internationalization = {
		EASTERN_ARABIC: "ea",
		WESTERN_ARABIC: "wa",
		PERSO_ARABIC: "pa",

		getNumericals: function getNumericals(variant) {
			var numericals = {};
			numericals[window.Internationalization.WESTERN_ARABIC] = {0 : "0", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9"};
			numericals[window.Internationalization.EASTERN_ARABIC] = {0 : "&#x0660", 1: "&#x0661", 2: "&#x0662", 3: "&#x0663", 4: "&#x0664", 5: "&#x0665", 6: "&#x0666", 7: "&#x0667", 8: "&#x0668", 9: "&#x0669"};
			numericals[window.Internationalization.PERSO_ARABIC] = {0 : "&#x06F0", 1: "&#x06F1", 2: "&#x06F2", 3: "&#x06F3", 4: "&#x06F4", 5: "&#x06F5", 6: "&#x06F6", 7: "&#x06F7", 8: "&#x06F8", 9: "&#x06F9"};

			if (variant in numericals) {
				return numericals[variant];
			} else {
				return numericals[window.Internationalization.WESTERN_ARABIC];
			}
		},
	
		translate: function translate(number, variant) {
			var sNumber = number.toString();
			var output = "";
			var numericals = window.Internationalization.getNumericals(variant);
			for (var i = 0; i < sNumber.length; i++) {
			    output += numericals[+sNumber.charAt(i)];
			}
			return output;
		}
	}
})(window);