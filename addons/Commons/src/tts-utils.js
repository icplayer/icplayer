(function (window) {

    window.TTSUtils = {

        getTextVoiceArrayFromElement: function($element, presenterLangTag) {
            var $clone = $element.clone();
            $clone.find('[aria-hidden="true"]').remove();

            //Handle alt texts
            $clone.find('[aria-label]').each(function(){
                var replaceText = $(this).attr('aria-label');
                var langTag = $(this).attr('lang');
                if (langTag && langTag.trim().length > 0 ) {
                    replaceText = '\\alt{ |' + replaceText + '}' + '[lang ' + langTag + ']';
                }
                $(this).append(replaceText);
            });

            var breakText = '&&break&&';
            //Handle images
            $clone.find('img[alt]').each(function(){
                var altText = $(this).attr('alt');
                $('<span>' + breakText + '</span>').insertBefore($(this));
                $('<span>' + breakText + '</span>').insertAfter($(this));
                $('<span>' + altText + '</span>').insertAfter($(this));
            });

            var splitTexts = $clone.text().split(breakText);
            var TextVoiceArray = [];
            for (var i = 0; i<splitTexts.length; i++) {
                TextVoiceArray.push(this.getTextVoiceObject(splitTexts[i].trim(), presenterLangTag));
            }

            return TextVoiceArray;
        },

        getTextVoiceObject: function (text, lang) {return {text: text, lang: lang};}

    }
})(window);