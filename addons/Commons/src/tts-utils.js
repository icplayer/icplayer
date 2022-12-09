(function (window) {

    window.TTSUtils = {

        statics: {
            breakText: '&&break&&',
            gap: '&&gap&&',
            dropdown: '&&dropdown&&',
            correct: '&&correct&&',
            wrong: '&&wrong&&',
            empty: '&&empty&&',
            nonBreakingSpace: '\u00A0',
            textNodeId: 3
        },

        GENDER: {
            MASCULINE: 0,
            FEMININE: 1,
            NEUTER: 2
        },

        getTextVoiceArrayFromElement: function($element, presenterLangTag) {
            var $clone = $('<div></div>').append($element.clone());

            $clone = this._prepareAltTexts($clone);
            $clone = this._prepareImages($clone);
            $clone = this._prepareLists($clone);
            $clone = this._addEndingSpace($clone);

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
            $clone = this._prepareLists($clone);
            $clone = this._addEndingSpace($clone);

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

            return this._parseRawText($clone.text(), speechTexts, presenterLangTag);
        },

        getTextVoiceObject: function (text, lang) {return {text: text, lang: lang};},

        getSpeechTextProperty: function (rawValue, defaultValue) {
            var value = rawValue.trim();

            if (value === undefined || value === null || value === '') {
                return defaultValue;
            }

            return value;
        },

        parsePreviewAltText: function (text) {
            text = text.replace(/\\alt{([^{}|]*?)\|[^{}|]*?}(\[[a-zA-Z0-9_\- ]*?\])*/g, '$1'); // replace \alt{a|b}[c] with a
            text = text.replace(/\\alt{([^|{}]*?)\|[^|{}]*?}/g, '$1'); // replace \alt{a|b} with a
            return text;
        },

        numberToPolishNumber: function(n) {
            if (n === 0)
                return 'zero';

            var textUnits = ['', 'jeden', 'dwa', 'trzy', 'cztery', 'pi\u0119\u0107', 'sze\u015b\u0107', 'siedem', 'osiem', 'dziewi\u0119\u0107'];
            var textTeens = ['', 'jedena\u015bcie', 'dwana\u015bcie', 'trzyna\u015bcie', 'czterna\u015bcie', 'pi\u0119tna\u015bcie', 'szesna\u015bcie', 'siedemna\u015bcie', 'osiemna\u015bcie', 'dziewi\u0119tna\u015bcie'];
            var textTens = ['', 'dziesi\u0119\u0107', 'dwadzie\u015bcia', 'trzydzie\u015bci', 'czterdzie\u015bci', 'pi\u0119\u0107dziesi\u0105t', 'sze\u015b\u0107dziesi\u0105t', 'siedemdziesi\u0105t', 'osiemdziesi\u0105t', 'dziewi\u0119\u0107dziesi\u0105t'];
            var textHundreds = ['', 'sto', 'dwie\u015bcie', 'trzysta', 'czterysta', 'pi\u0119\u0107set', 'sze\u015b\u0107set', 'siedemset', 'osiemset', 'dziewi\u0119\u0107set'];

            var units = Math.floor(n % 10);
            var tens = Math.floor((n / 10) % 10);
            var hundreds = Math.floor((n / 100) % 10);
            var thousands = Math.floor((n % Math.pow(10, 6)) / Math.pow(10, 3));
            var millions = Math.floor((n % Math.pow(10, 9)) / Math.pow(10, 6));
            var billions = Math.floor((n % Math.pow(10, 12)) / Math.pow(10, 9));

            var nAsText = '';
            nAsText += this._partOfNumberToBigElementOfPolishNumber(billions, ['miliard', 'miliardy', 'miliard\u00f3w'], true) + ' ';
            nAsText += this._partOfNumberToBigElementOfPolishNumber(millions, ['milion', 'miliony', 'milion\u00f3w'], true) + ' ';
            nAsText += this._partOfNumberToBigElementOfPolishNumber(thousands, ['tysi\u0105c', 'tysi\u0105ce', 'tysi\u0119cy'], true) + ' ';
            nAsText += textHundreds[hundreds] + ' ';

            var numberEndsWithTeens = (tens === 1 && units != 0);
            if (numberEndsWithTeens)
                nAsText += textTeens[units];
            else
                nAsText += textTens[tens] + ' ' + textUnits[units];

            return this._removeExtraSpaces(nAsText);
        },

        numberToPolishOrdinalNumber: function(n, gender) {
            if (!gender) {
                gender = this.GENDER.MASCULINE;
            }
            if (n === 0)
                return this._simpleChangePolishWordGender('zerowy', gender);
            return this._getTextNonOrdinalPartOfNumber(n) + ' ' + this._getTextOrdinalPartOfNumber(n, gender);
        },

        numberToOrdinalNumber: function(n, language, gender) {
            if (!gender) {
                gender = this.GENDER.MASCULINE;
            }
            if (['pl', 'pl-pl', 'polish'].includes(language.toLowerCase()))
                return this.numberToPolishOrdinalNumber(n, gender);
            return n;
        },

        _prepareAltTexts: function($clone) {
            $clone.find('[aria-hidden="true"]').remove();

            $clone.find('[aria-label]').each(function(){
                var replaceText = $(this).attr('aria-label');
                var sanitizedText = window.xssUtils.sanitize(replaceText);
                var langTag = $(this).attr('lang');
                if (langTag && langTag.trim().length > 0 ) {
                    sanitizedText = '\\alt{ |' + sanitizedText + '}' + '[lang ' + langTag + ']';
                }
                $(this).append(sanitizedText);
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

        _prepareLists: function($clone) {
            $clone.find('ol > li').each(function(){
                var index = 0;
                var currentElement = this;
                while (currentElement != null) {
                    if (currentElement.nodeName && currentElement.nodeName.toLowerCase()  == "li") {
                        index += 1;
                        if (currentElement.hasAttribute("value")) {
                            var value = currentElement.getAttribute("value");
                            if (!isNaN(value)) {
                                index += parseInt(value) - 1;
                                break;
                            }
                        }
                    }
                    currentElement = currentElement.previousSibling;
                }
                this.innerHTML = ". " + index + ": " + this.innerHTML;
                this.setAttribute("value", index);
            });

            return $clone;
        },

        _addEndingSpace: function($clone) {
            var self = this;
            function isTextNode(node) {
                return node != null && node.nodeType == self.statics.textNodeId;
            }

            function endsWithPunctuation(text) {
                var trimmedText = text.replaceAll(self.statics.nonBreakingSpace, " ").replaceAll("&nbsp;", " ").trim();
                if (trimmedText.length === 0) return true; //text node with only white spaces should be ignored
                var punc = ".,;?!";
                for (var i = 0; i < punc.length; i++) {
                    if (trimmedText.endsWith(punc[i])) {
                        return true;
                    }
                }
                return false;
            }
            $clone.find('div, p').each(function(){
                originalHTML = this.innerHTML;
                if (isTextNode(this.previousSibling) && !endsWithPunctuation(this.previousSibling.wholeText)) {
                    originalHTML = "." + self.statics.nonBreakingSpace + originalHTML;
                }
                if (isTextNode(this.lastChild) && !endsWithPunctuation(this.innerText)) {
                    originalHTML = originalHTML + "." + self.statics.nonBreakingSpace;
                }
                originalHTML = originalHTML + self.statics.nonBreakingSpace;
                this.innerHTML = originalHTML;
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
                if (value.length === 0 || ($self.is('select') && (value === '-' || value === '---'))) {
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
        },

        _removeExtraSpaces: function(str) {
            return str.replace(/\s+/g," ").trim();
        },

        _reverseString: function(str) {
            var newString = "";
            for (var i = (str.length - 1); i >= 0; i--) {
                newString += str[i];
            }
            return newString;
        },

        _removeLastWord: function(str) {
            var lastWordIndex = str.lastIndexOf(" ");
            return str.substring(0, lastWordIndex);
        },

        _simpleChangePolishWordGender: function(word, gender) {
            if (word === '' || ![this.GENDER.MASCULINE, this.GENDER.FEMININE, this.GENDER.NEUTER].includes(gender))
                return word;

            var genderCharacter = 'y';
            if (gender === this.GENDER.FEMININE)
                genderCharacter = 'a';
            else if (gender === this.GENDER.NEUTER)
                genderCharacter = 'e';

            var lastCharacter = word.slice(word.length - 1);
            var lastCharacterIsAGenderCharacter = ['a', 'e', 'y'].includes(lastCharacter);

            if (lastCharacterIsAGenderCharacter)
                return word.slice(0, -1) + genderCharacter;
            return word + genderCharacter;
        },

        _partOfNumberToBigElementOfPolishNumber: function(n, wordsDescribingNumber, skipZero) {
            if (!skipZero) {
                skipZero = false;
            }
            if (n === 0 && skipZero)
                return '';

            var numberEndsWith2or3or4 = [2, 3, 4].includes(n % 10);

            if (n === 1)
                return ' ' + wordsDescribingNumber[0] + ' ';
            else if (numberEndsWith2or3or4)
                return this.numberToPolishNumber(n) + ' ' + wordsDescribingNumber[1] + ' ';
            return this.numberToPolishNumber(n) + ' ' + wordsDescribingNumber[2] + ' ';
        },

        _getOrdinalPartOfNumber: function(n) {
            var reversedOrdinalPart = '';

            var nAsString = n.toString();
            var unitsJustAdded;
            for (var i = (nAsString.length - 1); i >= 0; i--) {
                reversedOrdinalPart += nAsString[i];

                if (nAsString[i] !== '0') {
                    unitsJustAdded = ((nAsString.length - i - 1) % 3 === 0)
                    if (unitsJustAdded && i > 0) {
                        reversedOrdinalPart += nAsString[i - 1];
                    }
                    break;
                }
            }
            return parseInt(this._reverseString(reversedOrdinalPart));
        },

        _getTextNonOrdinalPartOfNumber: function(n) {
            numberLength = n.toString().length;
            var ordinalPartAsStr = this._getOrdinalPartOfNumber(n).toString();
            var ordinalPartLength = ordinalPartAsStr.length;
            var numberWithoutOrdinalPart = Math.floor(n / Math.pow(10, ordinalPartLength)) * Math.pow(10, ordinalPartLength);

            var hasNonOrdinalPart = (ordinalPartLength !== numberLength);
            if (!hasNonOrdinalPart)
                return '';
            var nAsText = this.numberToPolishNumber(numberWithoutOrdinalPart);

            var ordinalPartSize = Math.floor((ordinalPartLength - 1) / 3);
            var nonOrdinalPartWithoutOrdinalPartSize = Math.floor(n / Math.pow(10, (ordinalPartSize + 1) * 3)) * Math.pow(10, (ordinalPartSize + 1) * 3);

            var ordinalPartIsABigNumber = (ordinalPartLength > 3);
            var nonOrdinalPartContainsOrdinalPartSize = (nonOrdinalPartWithoutOrdinalPartSize !== numberWithoutOrdinalPart);

            if (ordinalPartIsABigNumber && nonOrdinalPartContainsOrdinalPartSize)
                nAsText = this._removeLastWord(nAsText);

            return this._removeExtraSpaces(nAsText)
        },

        _getTextOrdinalPartOfNumber: function(n, gender) {
            if (!gender) {
                gender = this.GENDER.MASCULINE
            }
            var textUnits = ['', 'pierwszy', 'drugi', 'trzeci', 'czwarty', 'pi\u0105ty', 'sz\u00f3sty', 'si\u00f3dmy', '\u00f3smy', 'dziewi\u0105ty'];
            var textTeens = ['', 'jedenasty', 'dwunasty', 'trzynasty', 'czternasty', 'pi\u0119tnasty', 'szesnasty', 'siedemnasty', 'osiemnasty', 'dziewi\u0119tnasty'];
            var textTens = ['', 'dziesi\u0105ty', 'dwudziesty', 'trzydziesty', 'czterdziesty', 'pi\u0119\u0107dziesi\u0105ty', 'sze\u015b\u0107dziesi\u0105ty', 'siedemdziesi\u0105ty', 'osiemdziesi\u0105ty', 'dziewi\u0119\u0107dziesi\u0105ty'];
            var textHundreds = ['', 'setny', 'dwusetny', 'trzysetny', 'czterysetny', 'pi\u0119\u0107setny', 'sze\u015b\u0107setny', 'siedemsetny', 'osiemsetny', 'dziewi\u0119\u0107setny'];

            var textBigUnits = ['', 'jedno', 'dwu', 'trzy', 'cztero', 'pi\u0119cio', 'sze\u015bcio', 'siedmio', 'o\u015bmio', 'dziewi\u0119cio'];
            var textBigTeens = ['', 'jedenasto', 'dwunasto', 'trzynasto', 'czternasto', 'pi\u0119tnasto', 'szesnasto', 'siedemnasto', 'osiemnasto', 'dziewi\u0119tnasto'];
            var textBigTens = ['', 'dziesi\u0119cio', 'dwudziesto', 'trzydziesto', 'czterdziesto', 'pi\u0119\u0107dziesi\u0119cio', 'sze\u015b\u0107dziesi\u0119cio', 'siedemdziesi\u0119cio', 'osiemdziesi\u0119cio', 'dziewi\u0119\u0107dziesi\u0119cio'];
            var textBigHundreds = ['', 'stu', 'dwustu', 'trzystu', 'czterystu', 'pi\u0119ciuset', 'sze\u015bciuset', 'siedmuset', 'o\u015bmiuset', 'dziewi\u0119ciuset'];
            var sizes = ['', 'tysi\u0119czny', 'milionowy', 'miliardowy'];

            textUnits.forEach(function(element, index, array) {
                array[index] = this._simpleChangePolishWordGender(element, gender);
            }.bind(this));
            textTeens.forEach(function(element, index, array){
                array[index] = this._simpleChangePolishWordGender(element, gender);
            }.bind(this));
            textTens.forEach(function(element, index, array){
                array[index] = this._simpleChangePolishWordGender(element, gender);
            }.bind(this));
            textHundreds.forEach(function(element, index, array){
                array[index] = this._simpleChangePolishWordGender(element, gender);
            }.bind(this));
            sizes.forEach(function(element, index, array){
                array[index] = this._simpleChangePolishWordGender(element, gender);
            }.bind(this));

            if (gender === this.GENDER.FEMININE) {
                textUnits[2] = 'druga';
            }

            var ordinalPart = this._getOrdinalPartOfNumber(n);
            var ordinalPartAsStr = ordinalPart.toString();
            var ordinalPartLength = ordinalPartAsStr.length;

            var ordinalPartIsUnits = ((ordinalPartLength - 1) % 3 === 0);
            var ordinalPartIsTens = ((ordinalPartLength - 1) % 3 === 1);
            var ordinalPartIsTeens = (ordinalPartIsTens && ordinalPartAsStr[0] === '1' && ordinalPartAsStr[1] !== '0');
            var ordinalPartIsHundreds = ((ordinalPartLength - 1) % 3 === 2);
            var size = sizes[Math.floor((ordinalPartLength - 1) / 3)];

            if (ordinalPartLength === 1)
                ordinalPartAsText = textUnits[ordinalPartAsStr[0]];
            else if (ordinalPartIsTeens && ordinalPartLength === 2)
                ordinalPartAsText = textTeens[ordinalPartAsStr[1]];
            else if (ordinalPartLength === 2)
                ordinalPartAsText = (textTens[ordinalPartAsStr[0]] + ' ' + textUnits[ordinalPartAsStr[1]]).trim();
            else if (ordinalPartLength === 3)
                ordinalPartAsText = textHundreds[ordinalPartAsStr[0]];
            else {
                if (ordinalPartIsUnits)
                    ordinalPartAsText = textBigUnits[ordinalPartAsStr[0]];
                else if (ordinalPartIsTeens)
                    ordinalPartAsText = textBigTeens[ordinalPartAsStr[1]];
                else if (ordinalPartIsTens)
                    ordinalPartAsText = (textBigTens[ordinalPartAsStr[0]] + ' ' + textBigUnits[ordinalPartAsStr[1]]).trim();
                else if (ordinalPartIsHundreds)
                    ordinalPartAsText = textBigHundreds[ordinalPartAsStr[0]];

                ordinalPartAsText += size;
            }

            return this._removeExtraSpaces(ordinalPartAsText);
        }
    }
})(window);