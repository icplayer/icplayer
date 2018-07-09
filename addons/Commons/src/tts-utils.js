(function (window) {

    window.TTSUtils = {

        statics: {
            breakText: '&&break&&',
            gap: '&&gap&&',
            dropdown: '&&dropdown&&',
            correct: '&&correct&&',
            wrong: '&&wrong&&',
            empty: '&&empty&&'
        },

        getTextVoiceArrayFromElement: function($element, presenterLangTag) {
            var $clone = $element.clone();

            $clone = this._prepareAltTexts($clone);
            $clone = this._prepareImages($clone);

            var splitTexts = $clone.text().split(this.statics.breakText);
            var TextVoiceArray = [];
            for (var i = 0; i<splitTexts.length; i++) {
                TextVoiceArray.push(this.getTextVoiceObject(splitTexts[i].trim(), presenterLangTag));
            }

            return TextVoiceArray;
        },

        getTextVoiceArrayFromElementWithGaps: function($element, presenterLangTag, speechTextsModel) {
            var $clone = $('<div></div>').append($element.clone());


            var speechTexts = {
                gap: 'gap',
                dropdown: 'dropdown',
                correct: 'correct',
                empty: 'empty',
                wrong: 'wrong'
            };
            if (speechTextsModel) {
                if(speechTextsModel.gap) speechTexts.gap = speechTextsModel.gap;
                if(speechTextsModel.dropdown) speechTexts.dropdown = speechTextsModel.dropdown;
                if(speechTextsModel.correct) speechTexts.correct = speechTextsModel.correct;
                if(speechTextsModel.wrong) speechTexts.wrong = speechTextsModel.wrong;
                if(speechTextsModel.empty) speechTexts.empty = speechTextsModel.empty;
            }

            $element.find('select[id]').each( function() { //jquery.clone doesn't copy select values
                var id = $(this).attr('id');
                $clone.find('#'+id).val($(this).val());
            });

            $clone = this._prepareAltTexts($clone);
            $clone = this._prepareImages($clone);
            $clone = this._prepareGaps($clone);

            var TextVoiceArray = this._parseRawText($clone.text(), speechTexts, presenterLangTag);

            return TextVoiceArray;
        },

        getTextVoiceArrayFromGap: function($gap, $gapContainer, presenterLangTag, speechTextsModel) {
            var $clone = $('<div></div>').append($gap.clone());

            var speechTexts = {
                gap: 'gap',
                dropdown: 'dropdown',
                correct: 'correct',
                empty: 'empty',
                wrong: 'wrong'
            };
            if (speechTextsModel) {
                if (speechTextsModel.gap) speechTexts.gap = speechTextsModel.gap;
                if (speechTextsModel.dropdown) speechTexts.dropdown = speechTextsModel.dropdown;
                if (speechTextsModel.correct) speechTexts.correct = speechTextsModel.correct;
                if (speechTextsModel.wrong) speechTexts.wrong = speechTextsModel.wrong;
                if (speechTextsModel.empty) speechTexts.empty = speechTextsModel.empty;
            }

            $clone = this._prepareAltTexts($clone);
            $clone = this._prepareImages($clone);

            // ensure the correct gap index when $element is a gap
            var gapIndex = 0;
            $gapContainer.find('span.ic_gap, input.ic_gap, select.ic_inlineChoice').each(function(index){
                if($(this).is($gap)){
                    gapIndex = index;
                }
            });

            if($gap.is('select')){
                $clone.find('select').val($gap.val());
            }

            $clone = this._prepareGaps($clone, gapIndex);

            var TextVoiceArray = this._parseRawText($clone.text(), speechTexts, presenterLangTag);

            return TextVoiceArray;
        },

        getTextVoiceObject: function (text, lang) {return {text: text, lang: lang};},

        parsePreviewAltText: function (text) {
            text = text.replace(/\\alt{([^{}|]*?)\|[^{}|]*?}(\[[a-zA-Z0-9_\- ]*?\])*/g, '$1'); // replace \alt{a|b}[c] with a
            text = text.replace(/\\alt{([^|{}]*?)\|[^|{}]*?}/g, '$1'); // replace \alt{a|b} with a
            return text;
        },

        _prepareAltTexts: function($clone) {
            $clone.find('[aria-hidden="true"]').remove();

            $clone.find('[aria-label]').each(function(){
                var replaceText = $(this).attr('aria-label');
                var langTag = $(this).attr('lang');
                if (langTag && langTag.trim().length > 0 ) {
                    replaceText = '\\alt{ |' + replaceText + '}' + '[lang ' + langTag + ']';
                }
                $(this).append(replaceText);
            });

            return $clone;
        },

        _prepareImages: function($clone) {
            var breakText = this.statics.breakText;

            $clone.find('img[alt]').each(function(){
                var altText = $(this).attr('alt');
                $('<span>' + breakText + '</span>').insertBefore($(this));
                $('<span>' + breakText + '</span>').insertAfter($(this));
                $('<span>' + altText + '</span>').insertAfter($(this));
            });

            return $clone;
        },

        _prepareGaps: function($clone, gapIndex) {
            var breakText = this.statics.breakText;
            var gap = this.statics.gap;
            var dropdown = this.statics.dropdown;
            var correct = this.statics.correct;
            var wrong = this.statics.wrong;
            var empty = this.statics.empty;

            $clone.find('span.ic_gap, input.ic_gap, select.ic_inlineChoice').each(function(index){
                if (gapIndex) {
                    $(this).attr('index', gapIndex + 1);
                } else {
                    $(this).attr('index', index + 1);
                }
            });

            $clone.find('span.ic_gap, input.ic_gap, select.ic_inlineChoice').each(function(){
                var $self = $(this);
                var index = $self.attr('index');

                var prefix = '';
                if ($self.is('select')) {
                    prefix = breakText + dropdown + ' ' + index + breakText;
                } else {
                    prefix = breakText + gap + ' ' + index + breakText;
                }

                var value = '';
                if ($self.is('select, input')) {
                    value = $self.val();
                } else {
                    value = $self.text();
                }
                if (value.length == 0 || ($self.is('select') && (value == '-' || value == '---'))) {
                    if ($self.hasClass('ic_gap-empty')) {
                        value = '';
                    } else {
                        value = empty + breakText;
                    }
                } else {
                    value = value + breakText;
                }

                var suffix = '';
                if ($self.hasClass('ic_gap-correct')) {
                    suffix = correct + breakText;
                } else if ($self.hasClass('ic_gap-wrong')) {
                    suffix = wrong + breakText;
                } else if ($self.hasClass('ic_gap-empty')) {
                    suffix = empty + breakText;
                }

                var $newElement = $('<span>' + prefix + value + suffix + '</span>');
                $self.replaceWith($newElement);
            });
            return $clone;
        },

        _parseRawText: function(content, speechTexts, presenterLangTag) {
            var splitTexts = content.split(this.statics.breakText);
            var TextVoiceArray = [];
            for (var i = 0; i < splitTexts.length; i++) {
                if(splitTexts[i].trim().length == 0){
                    continue;
                } else if (splitTexts[i].trim().indexOf(this.statics.gap) !== -1) {
                    var content = splitTexts[i].trim().replace(this.statics.gap, speechTexts.gap);
                    TextVoiceArray.push(this.getTextVoiceObject(content));
                } else if (splitTexts[i].trim().indexOf(this.statics.dropdown) !== -1) {
                    var content = splitTexts[i].trim().replace(this.statics.dropdown, speechTexts.dropdown);
                    TextVoiceArray.push(this.getTextVoiceObject(content));
                } else if (splitTexts[i].trim().indexOf(this.statics.correct) !== -1) {
                    var content = splitTexts[i].trim().replace(this.statics.correct, speechTexts.correct);
                    TextVoiceArray.push(this.getTextVoiceObject(content));
                } else  if (splitTexts[i].trim().indexOf(this.statics.wrong) !== -1) {
                    var content = splitTexts[i].trim().replace(this.statics.wrong, speechTexts.wrong);
                    TextVoiceArray.push(this.getTextVoiceObject(content));
                } else if (splitTexts[i].trim().indexOf(this.statics.empty) !== -1) {
                    var content = splitTexts[i].trim().replace(this.statics.empty, speechTexts.empty);
                    TextVoiceArray.push(this.getTextVoiceObject(content));
                } else {
                    TextVoiceArray.push(this.getTextVoiceObject(splitTexts[i].trim(), presenterLangTag));
                }
            }

            return TextVoiceArray;
        },

        focusInvisibleElement: function() {
            $('#input_element_for_focus_to_change_focused_element_by_browser').focus();
        }

    }
})(window);