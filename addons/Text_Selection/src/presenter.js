function AddonText_Selection_create() {

	var presenter = function(){};

	var first = 0,
		beforeActive = false,
		lastMoveEvent = null;

	function isLastSpecialSign(word) {
		return ['.', ',', '?', '!', ';', ':'].indexOf(word[word.length-1]) != -1;
	}

	presenter.isStartedCorrect = function(word) {
		return (/\\correct{/).test(word);
	};

	presenter.isStartedWrong = function(word) {
		return (/\\wrong{/).test(word);
	};

    presenter.hasOpeningBracket = function(word) {
        return (/{/).test(word);
    };

	presenter.hasClosingBracket = function(word) {
		return (/}/).test(word);
	};

	presenter.isMarkedCorrect = function(word) {
		var counted = this.countBrackets(word);
		return (/\\correct{.*}/).test(word) && (counted.open === counted.close);
	};

	presenter.isMarkedWrong = function(word) {
		var counted = this.countBrackets(word);
		return (/\\wrong{.*}/).test(word) && (counted.open === counted.close);
	};

	presenter.cutMarkedCorrect = function(word) {
		var countedBrackets = this.countBrackets(word);
		if (isLastSpecialSign(word)) {
			word = word.replace(/\\correct{/, '');
			if (countedBrackets.open === countedBrackets.close) {
				word = word.replace(/}([^}]*)$/,'$1');
			}
			return word.substring(0, word.length-1);
		} else {
			word = word.replace(/\\correct{/, '')
			if (countedBrackets.open === countedBrackets.close) {
				word = word.replace(/}([^}]*)$/,'$1');
			}
			return word;
		}
	};

	presenter.cutMarkedWrong = function(word) {
		var countedBrackets = this.countBrackets(word);
		if (isLastSpecialSign(word)) {
			word = word.replace(/\\wrong{/, '');
			if (countedBrackets.open === countedBrackets.close) {
				word = word.replace(/}([^}]*)$/,'$1');
			}
			return word.substring(0, word.length - 1);
		} else {
			word = word.replace(/\\wrong{/, '');
			if (countedBrackets.open === countedBrackets.close) {
				word = word.replace(/}([^}]*)$/,'$1'); 
			}
			return word;
		}
	};

	presenter.cutLastClosingBracket = function(word) {
		return word.replace(/}([^}]*)$/,'$1');
	};

    presenter.countBrackets = function(word) {
        return {
            open : word.split("{").length - 1,
            close : word.split("}").length - 1
        }
    };

	presenter.startSelection = function(et) {
		first = parseInt($(et).attr('number'), 10);
		if (isNaN(first)) first = parseInt($(et).attr('left'), 10);
		if (isNaN(first)) first = parseInt($(et).closest('.selectable').attr('number'));
		if (isNaN(first)) {
			$(et).nextAll('div').each(function() {
				first = parseInt($(this).children('span.selectable').attr('number'));
				if (!isNaN(first)) {
					beforeActive = true;
					return false;
				}
			});
		}
		if ($(et).hasClass('text_selection')  && isNaN(first)) {
			beforeActive = true;
			first = parseInt(presenter.$view.find('.text_selection').find('span.selectable').first().attr('number'), 10);
		}
	};

	presenter.endSelection = function(et) {
		var last = parseInt($(et).attr('number'), 10),
			tmp = 0,
			i,
			$span = null,
			element = null;

		if (isNaN(last)) last = parseInt($(et).attr('right'), 10);
		if (isNaN(last)) last = parseInt($(et).closest('.selectable').attr('number'));
		if (isNaN(last)) {
			$(et).nextAll('div').each(function() {
				last = parseInt($(this).children('span.selectable').attr('number'));
				if (!isNaN(last)) {
					return false;
				}
			});
		}
		if ($(et).hasClass('text_selection')) {
			last = first;
		}
		var selected = presenter.$view.find('.text_selection').find('.selected');

		if(first !== last) {
			if(first > last) {
				tmp = first; first = last; last = tmp;
			}

			if (presenter.configuration.selection_type === 'SINGLESELECT') {

				if (selected.length === 0) {
					for (i=first; i<last+1; i++) {
						element = presenter.$view.find('.text_selection').find("span[number='" + i + "']");
						if (element.hasClass('selectable')) {
							element.toggleClass('selected');
							break;
						}
					}
				} else if (selected.length === 1) {
					for (i=first; i<last+1; i++) {
						element = presenter.$view.find('.text_selection').find("span[number='" + i + "']");
						if (element.hasClass('selectable')) {
							$(selected).removeClass('selected');
							element.addClass('selected');
							break;
						}
					}
				} else {
					$(selected).removeClass('selected');
				}
			} else if (presenter.configuration.selection_type === 'MULTISELECT') {

				for (i=first; i<last+1; i++) {
					element = presenter.$view.find('.text_selection').find("span[number='" + i + "']");
					if (element.hasClass('selectable')) {
						element.toggleClass('selected');
					}
				}

			}
		} else if (first === last && !beforeActive) {
			$span = presenter.$view.find('.text_selection').find("span[number='" + first + "']");

			if (presenter.configuration.selection_type === 'SINGLESELECT') {
				if (selected.length == 0) {
					if ($span.hasClass('selectable')) {
						$span.addClass('selected');
					}
				} else if (selected.length == 1) {
					if (parseInt(selected.attr('number')) === parseInt(first, 10)) {
						selected.removeClass('selected');
					} else {
						if ($span.hasClass('selectable')) {
							selected.removeClass('selected');
							$span.toggleClass('selected');
						}
					}
				}
			} else if (presenter.configuration.selection_type === 'MULTISELECT') {
				if ($span.hasClass('selectable')) {
					$span.toggleClass('selected');
				}
			}
		}

		first = 0;
		beforeActive = false;
		if (window.getSelection) {
			window.getSelection().removeAllRanges();
		} else if (document.selection) {
			document.selection.empty();
		}
	};

	presenter.turnOnEventListeners = function() {
		var $text_selection = presenter.$view.find('.text_selection');

		$text_selection.on('touchstart', function(e) {
            e.stopPropagation();
			e.preventDefault();
			presenter.startSelection(e.target);
		});

		$text_selection.on('touchend', function(e) {
            e.stopPropagation();
			presenter.configuration.isExerciseStarted = true;
			e.preventDefault();
			if (lastMoveEvent != null) {
				presenter.endSelection(lastMoveEvent);
			} else {
				presenter.endSelection(e.target);
			}
			lastMoveEvent = null;
		});

		$text_selection.on('touchmove', function(e) {
            e.stopPropagation();
			e.preventDefault();
			var temp = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0] || e.originalEvent.targetTouches[0];

			lastMoveEvent = $(document.elementFromPoint(temp.pageX - $(document).scrollLeft(), temp.pageY - $(document).scrollTop()));
		});

        $text_selection.on('click', function(e) {
            e.stopPropagation();
        });

        $text_selection.on('mouseup', function(e) {
            e.stopPropagation();
            presenter.configuration.isExerciseStarted = true;
            presenter.endSelection(e.target);
        });

        $text_selection.on('mousedown', function(e) {
            e.stopPropagation();
            presenter.startSelection(e.target);
        });

		$text_selection.find('.selectable').hover(
			function() {
				$(this).addClass("hover");
			},
			function() {
				$(this).removeClass("hover");
			}
		);

		presenter.configuration.areEventListenersOn = true;
	};

	presenter.turnOffEventListeners = function() {
		presenter.$view.find('.text_selection').off();
		presenter.$view.find('.text_selection').find('.selectable').off();

		presenter.configuration.areEventListenersOn = false;
	};

	function getSelectableSpan(i, word) {
		return $('<span></span>').attr('number', i).addClass('selectable').html(word);
	}

	function getBlock(i, specialSign) {
		return "<span left=\"" + i + "\" right=\"" + (i+1) + "\">" + specialSign + " </span>";
	}

	function getSpace(i) {
		return "<span left=\"" + i + "\" right=\"" + (i+1) + "\"> </span>";
	}

	function getSpecialSign(word) {
		return isLastSpecialSign(word) && (presenter.isMarkedWrong(word) || presenter.isMarkedCorrect(word)) ? word[word.length - 1] : "";
	}
	
	function getSpecialIfStarted(word) {
		return isLastSpecialSign(word) && (presenter.isStartedWrong(word) || presenter.isStartedCorrect(word)) ? word[word.length - 1] : "";
	}

	presenter.presenterLogic = function(view, model, isPreview) {
		presenter.$view = $(view);

		presenter.configuration = presenter.validateModel(model);
		if (!presenter.configuration.isValid) {
			DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
			return;
		}

		if (isPreview) {
			presenter.$view.append($(presenter.configuration.renderedPreview));
		} else {
			presenter.$view.append($(presenter.configuration.renderedRun));
		}

		presenter.setVisibility(presenter.configuration.isVisible);
	};

	presenter.ERROR_CODES = {
		M01: 'Text cannot be empty',
		M02: 'Text cannot be w/o \\correct{} or \\wrong{}',
		M03: 'You cannot use \\wrong{} in "All selectable" mode',
		M04: 'Empty word in marker',
		M05: 'In single selection you have to mark only one phrase as correct and at least one mark as wrong'
	};

	presenter.MODE = {
		'Mark phrases to select': 'MARK_PHRASES',
		'All selectable': 'ALL_SELECTABLE',
		DEFAULT: 'Mark phrases to select'
	};

	presenter.SELECTION_TYPE = {
		'Single select': 'SINGLESELECT',
		'Multiselect': 'MULTISELECT',
		DEFAULT: 'Single select'
	};
	
	presenter.run = function(view, model) {
		presenter.presenterLogic(view, model, false);
		presenter.turnOnEventListeners();
	};

	presenter.createPreview = function(view, model) {
		presenter.presenterLogic(view, model, true);
	};

	function returnErrorObject(errorCode) {
		return { isValid: false, errorCode: errorCode };
	}

	presenter.validateModel = function(model) {

		if (ModelValidationUtils.isStringEmpty(model.Text)) {
			return returnErrorObject('M01');
		}

		var mode = ModelValidationUtils.validateOption(presenter.MODE, model.Mode);
		var selection_type = ModelValidationUtils.validateOption(presenter.SELECTION_TYPE, model['Selection type']);

		var parsedWords = presenter.parseWords(model.Text, mode, selection_type);
		if (!parsedWords.isValid) {
			return returnErrorObject(parsedWords.errorCode);
		}

		return {
			isValid: true,
			mode: mode,
			selection_type: selection_type,
			renderedRun: parsedWords.renderedRun,
			renderedPreview: parsedWords.renderedPreview,
			isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"]),
			isExerciseStarted: false,
			areEventListenersOn: true
		};
	};

	presenter.getMarked = function(wrong, correct) {
		return {
			markedWrong: wrong,
			markedCorrect: correct
		};
	};

	presenter.connectWords = function(words) {
		var i,
			j,
			longWord = '',
			result = [];

		for (i=0; i<words.length; i++) {
			if ((presenter.isStartedCorrect(words[i]) || presenter.isStartedWrong(words[i])) && !presenter.isMarkedCorrect(words[i]) && !presenter.isMarkedWrong(words[i])) {
				if (presenter.isStartedCorrect(words[i])) {
					longWord += words[i] + ' ';
					for (j=i+1; j<words.length; j++) {
						if(presenter.hasClosingBracket(words[j])) {
							longWord += words[j];
							i = j;
							j = words.length + 1;
						} else {
							longWord += words[j] + ' ';
						}
					}
					result.push(longWord);
					longWord = '';
				} else if (presenter.isStartedWrong(words[i])) {
					longWord += words[i] + ' ';
					for (j=i+1; j<words.length; j++) {
						if(presenter.hasClosingBracket(words[j])) {
							longWord += words[j];
							i = j;
							j = words.length + 1;
						} else {
							longWord += words[j] + ' ';
						}
					}
					result.push(longWord);
					longWord = '';
				}
			} else {
				result.push(words[i]);
			}
		}

		return result;
	};

	presenter.parseWords = function(text, mode, selection_type) {
		var i,
			result = '',
			words = [],
			markedCorrect = [],
			markedWrong = [],
			renderedPreview = '',
			renderedRun = '',
			amountWrong,
			amountCorrect,
			isTagClosed = true,
			spanNumber = 0,
			tmpWord = '',
			wrongMarkerInAllSelectable = false,
			emptyWord = false,
            stack = 0,
            counted = null;

		HTMLParser(text.replace(/&nbsp;/, ' '), {
			start: function(tag, attrs, unary) {
				renderedPreview += "<" + tag;
				renderedRun     += "<" + tag;

				for (i=0; i<attrs.length; i++) {
					renderedPreview += " " + attrs[i].name + '="' + attrs[i].escaped + '"';
					renderedRun     += " " + attrs[i].name + '="' + attrs[i].escaped + '"';
				}

				renderedPreview += (unary ? "/" : "") + ">";
				renderedRun     += (unary ? "/" : "") + ">";
			},
			end: function(tag) {
				renderedPreview += "</" + tag + ">";
				renderedRun     += "</" + tag + ">";
			},
			chars: function(text) {
				words = text.split(' ');

				for (i=0; i<words.length; i++) {
					if (isTagClosed === true) {
						if (words[i] === ' ') {
							renderedPreview += getSpace(spanNumber);
							renderedRun += getSpace(spanNumber);
						} else if (presenter.isMarkedCorrect(words[i])) {
							tmpWord = presenter.cutMarkedCorrect(words[i]);

                            counted = presenter.countBrackets(words[i]);
                            if (counted.open > counted.close) {
                                renderedPreview += '<span class="correct selectable">' + tmpWord + getSpecialIfStarted(words[i]) + getSpace(spanNumber);
                                renderedRun += '<span class="selectable" number="' + spanNumber + '">' + tmpWord + getSpecialIfStarted(words[i]) + getSpace(spanNumber);
                                isTagClosed = false;
                            } else {
                                if (isLastSpecialSign(words[i])) {
                                    renderedPreview += '<span class="correct selectable">' + tmpWord + '</span>' + getBlock(spanNumber, getSpecialSign(words[i]));
                                    renderedRun += '<span class="selectable" number="' + spanNumber + '">' + tmpWord + '</span>' + getBlock(spanNumber, getSpecialSign(words[i]));
                                } else {
                                    renderedPreview += '<span class="correct selectable">' + tmpWord + '</span> ';
                                    renderedRun += '<span class="selectable" number="' + spanNumber + '">' + tmpWord + '</span>' + getSpace(spanNumber);
                                }
                            }

							markedCorrect.push(spanNumber);
							spanNumber++;

							if (ModelValidationUtils.isStringEmpty(tmpWord)) {
								emptyWord = true;
							}
						} else if (presenter.isMarkedWrong(words[i])) {
							tmpWord = presenter.cutMarkedWrong(words[i]);

                            counted = presenter.countBrackets(words[i]);
                            if (counted.open > counted.close) {
                                renderedPreview += '<span class="wrong selectable">' + tmpWord + getSpecialIfStarted(words[i]) + getSpace(spanNumber);
                                renderedRun += '<span class="selectable" number="' + spanNumber + '">' + tmpWord + getSpecialIfStarted(words[i]) + getSpace(spanNumber);
                                isTagClosed = false;
                            } else {
                                if (isLastSpecialSign(words[i])) {
                                    renderedPreview += '<span class="wrong selectable">' + tmpWord + '</span>' + getBlock(spanNumber, getSpecialSign(words[i]));
                                    renderedRun += '<span class="selectable" number="' + spanNumber + '">' + tmpWord + '</span>' + getBlock(spanNumber, getSpecialSign(words[i]));
                                } else {
                                    renderedPreview += '<span class="wrong selectable">' + tmpWord + '</span> ';
                                    renderedRun += '<span class="selectable" number="' + spanNumber + '">' + tmpWord + '</span>' + getSpace(spanNumber);
                                }
                            }

							markedWrong.push(spanNumber);
							spanNumber++;

							if (ModelValidationUtils.isStringEmpty(tmpWord)) {
								emptyWord = true;
							}
							if (mode === 'ALL_SELECTABLE') {
								wrongMarkerInAllSelectable = true;
							}
						} else if (presenter.isStartedCorrect(words[i])) {
							tmpWord = presenter.cutMarkedCorrect(words[i]);
							
                            counted = presenter.countBrackets(words[i]);
                            stack += counted.open;
                            stack -= counted.close;

							renderedPreview += '<span class="correct selectable">' + tmpWord + getSpecialIfStarted(words[i]) + getSpace(spanNumber);
							renderedRun += '<span class="selectable" number="' + spanNumber + '">' + tmpWord + getSpecialIfStarted(words[i]) + getSpace(spanNumber);
							markedCorrect.push(spanNumber);
							spanNumber++;
							isTagClosed = false;
						} else if (presenter.isStartedWrong(words[i])) {
							tmpWord = presenter.cutMarkedWrong(words[i]);
							
                            counted = presenter.countBrackets(words[i]);
                            stack += counted.open;
                            stack -= counted.close;

							renderedPreview += '<span class="wrong selectable">' + tmpWord + getSpecialIfStarted(words[i]) + getSpace(spanNumber);
							renderedRun += '<span class="selectable" number="' + spanNumber + '">' + tmpWord + getSpecialIfStarted(words[i]) + getSpace(spanNumber);
							markedWrong.push(spanNumber);
							spanNumber++;
							isTagClosed = false;
                        } else {
                            counted = presenter.countBrackets(words[i]);
                            stack += counted.open;
                            stack -= counted.close;

							if (mode === 'ALL_SELECTABLE') {
								renderedRun += '<span class="selectable" number="' + spanNumber + '">' + words[i] + '</span>' + getSpace(spanNumber);
								markedWrong.push(spanNumber);
							} else if (mode === 'MARK_PHRASES') {
								renderedRun += '<span number="' + spanNumber + '">' + words[i] + '</span>' + getSpace(spanNumber);
							}
							renderedPreview += '<span number="' + spanNumber + '">' + words[i] + '</span>' + getSpace(spanNumber);

							spanNumber++;
						}
					} else { // isTagClosed === false
                        counted = presenter.countBrackets(words[i]);
                        if (counted.open === counted.close) {
                            renderedPreview += words[i] + ' ';
                            renderedRun += words[i] + ' ';
                        } else {
                        	if (counted.close >= (stack + counted.open)) {
                        		tmpWord = presenter.cutLastClosingBracket(words[i]);
                        	} else {
                        		tmpWord = words[i];
                        	}
                            stack += counted.open;
                            stack -= counted.close;
                            if (stack === 0) {
                                renderedPreview += tmpWord + '</span>' + getSpace(spanNumber);
                                renderedRun += tmpWord + '</span>' + getSpace(spanNumber);
                                isTagClosed = true;
                            } else {
                                renderedPreview += tmpWord + ' ';
                                renderedRun += tmpWord + ' ';
                            }
                        }
					}
                }

				text = words.join(' ');
				result += text;
			},
			comment: function(text) {}
		});

		amountCorrect = markedCorrect.length;
		amountWrong   = markedWrong.length;

		presenter.markers = presenter.getMarked(markedWrong, markedCorrect);

		if (amountCorrect === 0 && amountWrong === 0) { // has Correct Or Wrong Marker
			return returnErrorObject('M02');
		}

		if (wrongMarkerInAllSelectable) {
			return returnErrorObject('M03');
		}

		if (emptyWord) {
			return returnErrorObject('M04');
		}

		if ((amountCorrect !== 1 || amountWrong < 1) && selection_type === 'SINGLESELECT') { // HasOneCorrectAtLeastOneWrongInSingleSelectionTypeSelection
			return returnErrorObject('M05');
		}

		return {
			isValid: true,
			renderedPreview: '<div class="text_selection">' + renderedPreview + '</div>',
			renderedRun: '<div class="text_selection">' + renderedRun + '</div>',
			markedWrong: markedWrong,
			markedCorrect: markedCorrect
		};
	};

	presenter.executeCommand = function(name, params) {
		if (!presenter.configuration.isValid) return;

		var commands = {
			'show': presenter.show,
			'hide': presenter.hide
		};

		Commands.dispatch(commands, name, params, presenter);
	};

	presenter.setVisibility = function(isVisible) {
		presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
	};

	presenter.show = function() {
		presenter.setVisibility(true);
		presenter.configuration.isVisible = true;
	};

	presenter.hide = function() {
		presenter.setVisibility(false);
		presenter.configuration.isVisible = false;
	};

	presenter.reset = function() {
		presenter.$view.find('.text_selection').find('.selected').removeClass('selected');
		presenter.setWorkMode();
		presenter.show();
	};

	presenter.getState = function() {
		var numberSelected = [];

		var allSelected = presenter.$view.find('.text_selection').find('.selected');

		for (var i=0; i<allSelected.length; i++) {
			numberSelected.push($(allSelected[i]).attr('number'));
		}

		return JSON.stringify({
			numbers: numberSelected,
			isVisible: presenter.configuration.isVisible,
			isExerciseStarted: presenter.configuration.isExerciseStarted
		});
	};

	presenter.setState = function(state) {
		if (ModelValidationUtils.isStringEmpty(state)) return;

		var nums              = JSON.parse(state).numbers,
			isVisible         = JSON.parse(state).isVisible,
			isExerciseStarted = JSON.parse(state).isExerciseStarted;

		for (var i=0; i<nums.length; i++) {
			presenter.$view.find('.text_selection').find("span[number='" + nums[i] + "']").addClass("selected");
		}

		if (isVisible) {
			presenter.show();
		} else {
			presenter.hide();
		}

		presenter.configuration.isVisible = isVisible;
		presenter.configuration.isExerciseStarted = isExerciseStarted;
	};

	function intersection(a, b) {
		return a.filter(function(i) {
			return b.indexOf(parseInt(i, 10)) != -1;
		});
	}

	presenter.setShowErrorsMode = function() {
		if (!presenter.configuration.isExerciseStarted) return;

		var i;

		presenter.turnOffEventListeners();

		var numbersSelected = presenter.$view.find('.text_selection').find('.selected').map(function() {
			return this.getAttribute('number');
		}).get();

		var numbersCorrect = presenter.markers.markedCorrect;
		var numbersWrong   = presenter.markers.markedWrong;

		var correctSelected = intersection(numbersSelected, numbersCorrect);

		for (i=0; i<correctSelected.length; i++) {
			presenter.$view.find('.text_selection').find("span[number='" + correctSelected[i] + "']").addClass('correct');
		}

		var selectedWrong = intersection(numbersSelected, numbersWrong);

		for (i=0; i<selectedWrong.length; i++) {
			presenter.$view.find('.text_selection').find("span[number='" + selectedWrong[i] + "']").addClass('wrong');
		}
	};

	presenter.setWorkMode = function() {
		presenter.$view.find('.text_selection').find('.correct').removeClass('correct');
		presenter.$view.find('.text_selection').find('.wrong').removeClass('wrong');

		if (!presenter.configuration.areEventListenersOn) {
			presenter.turnOnEventListeners();
		}
	};

	function points(selector) {
		var numbersSelected = presenter.$view.find('.text_selection').find('.selected').map(function() {
			return parseInt(this.getAttribute('number'));
		}).get();

		return intersection(selector, numbersSelected).length;
	}

	presenter.getErrorCount = function() {
		return points(presenter.markers.markedWrong);
	};

	presenter.getMaxScore = function() {
		return presenter.markers.markedCorrect.length;
	};

	presenter.getScore = function() {
		return points(presenter.markers.markedCorrect);
	};

	return presenter;
}