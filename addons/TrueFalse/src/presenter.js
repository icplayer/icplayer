function AddonTrueFalse_create() {
    var presenter = function () {
    };

    presenter.type = "";
    presenter.$view;
    presenter.lastEvent = null;

    var possibleChoices = [];
    var multi = false;
    var isNotActivity = false;
    var questions = [];
    var playerController;
    var eventBus; // Modules communication
    var textParser = null; // Links to Glossary Addon

    var QUESTION_AND_CHOICES_REQUIRED = "At least 1 question and 2 choices are required.";
    var INDEX_OUT_OF_RANGE = "Index is out of range.";

    presenter.isSelectionCorrect = function (question, selection) {
        var answers = question.Answer.split(',');

        for (var i = 0; i < answers.length; i++) {
            if (parseInt(answers[i], 10) === selection) {
                return true;
            }
        }

        return false;
    };

    var score = function () {
        var score = { 'score': 0, 'maxScore': 0, 'errorCount': 0 };
        for (var i = 0; i < questions.length + 1; i++) {
            var j = 0;
            var row = presenter.$view.find('#' + i);
            if (i > 0) {
                var values = (questions[i - 1].Answer).split(',');
                score.maxScore += values.length;
                row.children().each(function () {
                    if (isCorrectAnswer($(this), values, j)) {
                        score.score += 1;
                    } else if (isWrongAnswer($(this), values, j)) {
                        score.errorCount += 1;
                    }
                    j++;
                });
            }
        }
        return score;
    };

    var workMode = function (reset) {
        $(".tf_" + presenter.type + "_image").each(function () {
            var image = $(this);
            image.removeClass("disabled").removeClass("wrong").removeClass("correct");
            if (reset) {
                image.removeClass("down").addClass("up");
            }
        });
    };

    var markElements = function () {
        for (var i = 0; i < questions.length + 1; i++) {
            var j = 0;
            var row = presenter.$view.find('#' + i);
            if (i > 0) {
                var values = (questions[i - 1].Answer).split(',');
                row.children().each(function () {
                    if ($(this).hasClass("disabled") && j>0) return;
                    $(this).addClass("disabled");
                    if (isCorrectAnswer($(this), values, j)) {
                        $(this).addClass("correct");
                    } else if (isWrongAnswer($(this), values, j)) {
                        $(this).addClass("wrong");
                    }
                    j++;
                });
            }
        }
    };

    function whichQuestion(row, table) {
        var questionNumber = 0;

        $(table).find('tr').each(function (index) {
            if ($(this)[0] == $(row)[0]) {
                questionNumber = index;

                return false;
            }
        });

        return questionNumber;
    }

    function whichAnswer(element, row) {
        var answerNumber = 0;
        $(row).find('.tf_' + presenter.type + '_image').each(function (index) {
            if ($(this)[0] == $(element)[0]) {
                answerNumber = index + 1; // Answers are counted from 1 to n

                return false;
            }
        });

        return answerNumber;
    }

    presenter.createEventData = function (item, wasSelected, isSelectionCorrect) {
        return {
            'source': presenter.addonID,
            'item': item,
            'value': wasSelected ? '0' : '1',
            'score': isSelectionCorrect ? '1' : '0'
        };
    };

    presenter.createAllOKEventData = function () {
        return {
            'source': presenter.addonID,
            'item': 'all',
            'value': '',
            'score': ''
        };
    };

    presenter.createRowOKEventData = function (row) {
        return {
            'source': presenter.addonID,
            'item': row + '-all',
            'value': '',
            'score': ''
        }
    };

    function clickLogic(element) {
        var sendEvent = true;
        var wasSelected = false;

        if (!$(element).hasClass("disabled")) {
            if (multi) {
                if ($(element).hasClass("down")) {
                    wasSelected = true;
                    $(element).removeClass("down").addClass("up");
                } else {
                    $(element).removeClass("up").addClass("down");
                }
            } else {
                sendEvent = !$(element).hasClass("down");

                $(element).parent().children(".tf_" + presenter.type + "_image").each(function () {
                    $(this).removeClass("down").addClass("up");
                });

                $(element).removeClass("up").addClass("down");
            }

            if (sendEvent) {
                var selectedQuestion = whichQuestion($(element).parent(), $(element).parent().parent());
                var selectedAnswer = whichAnswer($(element), $(element).parent());
                var itemStr = selectedQuestion.toString() + '-' + selectedAnswer.toString();
                var isSelectionCorrect = presenter.isSelectionCorrect(questions[selectedQuestion - 1], parseInt(selectedAnswer, 10));

                var eventData = presenter.createEventData(itemStr, wasSelected, isSelectionCorrect);
                eventBus.sendEvent('ValueChanged', eventData);

                if (multi && presenter.isRowOK(selectedQuestion)) {
                    var rowOKEventData = presenter.createRowOKEventData(selectedQuestion);
                    eventBus.sendEvent('ValueChanged', rowOKEventData);

                }

                if (presenter.isAllOK()) {
                    var allOKEventData = presenter.createAllOKEventData();
                    eventBus.sendEvent('ValueChanged', allOKEventData);
                }
            }
        }
    }

    function handleClickActions(view) {
        var $elements = $(view).find(".tf_" + presenter.type + "_image");

        $elements.on('touchstart', function (e) {
            e.stopPropagation();
            e.preventDefault();

            presenter.lastEvent = e;
        });

        $elements.on('touchend', function (e) {
            e.stopPropagation();
            e.preventDefault();

            if (presenter.lastEvent.type != e.type) {
                var eventData = event.touches[0] || event.changedTouches[0];

                clickLogic($(eventData.target).parent());
            }
        });

        $elements.click(function (e) {
            e.stopPropagation();
            clickLogic(this);
        });
    }

    function generatePossibleChoicesRow(row) {
        row.append('<td class="tf_' + presenter.type + '_question first">&nbsp;</td>');

        for (var k = 0; k < possibleChoices.length; k++) {
            row.append('<td class="tf_' + presenter.type + '_text">' + possibleChoices[k].Choice + '</td>');
        }
    }

    function generateQuestionElement(row, rowID) {
        var question = questions[rowID - 1].Question;

        if (textParser !== null) { // Actions performed only in Player mode
            question = textParser.parse(question);
        }

        row.append('<td class="tf_' + presenter.type + '_question">' + question + '</td>');
    }

    function generateRowContent(row, rowID) {
        generateQuestionElement(row, rowID);
        for (var i = 0; i < possibleChoices.length; i++) {
            if (i === (possibleChoices.length - 1)) {
                row.append('<td class="tf_' + presenter.type + '_image up last"></td>');
            } else {
                row.append('<td class="tf_' + presenter.type + '_image up"></td>');
            }
            var innerElement = document.createElement('div');
            $(row).find('td:last-child').append(innerElement);
        }
    }

    function generateTableContent(table, view) {
        for (var rowID = 0; rowID < questions.length + 1; rowID++) {
            $(table).append('<tr class="tf_' + presenter.type + '_row" id=' + rowID + '></tr>');
            var row = $(view).find('#' + rowID);

            if (rowID === 0) {
                generatePossibleChoicesRow(row);
            } else {
                var answers = (questions[rowID - 1].Answer).split(',');
                for (var m = 0; m < answers.length; m++) {
                    var answer = parseInt(answers[m]);
                    if (answer > possibleChoices.length || answer <= 0) {
                        $(view).html(INDEX_OUT_OF_RANGE)

                        break;
                    }
                }

                generateRowContent(row, rowID);
            }
        }
    }

    var makeView = function (view, model, preview) {
        possibleChoices = model['Choices'];
        questions = model['Questions'];

        if (notAllRequiredParameters(questions, possibleChoices)) {
            return $(view).html(QUESTION_AND_CHOICES_REQUIRED);
        }

        multi = model['Multi'] === 'True';
        isNotActivity = (model['isNotActivity'] === 'True');
        presenter.type = multi ? "checkbox" : "radio";
        var table = document.createElement('table');

        $(table).addClass('tf_' + presenter.type);
        $(table).attr("cellspacing", 0).attr("cellpadding", 0);
        $(view).append(table);

        generateTableContent(table, view);

        if (!preview) {
            handleClickActions(view);
        }

        if (textParser !== null) { // Actions performed only in Player mode
            textParser.connectLinks($(view));
        }
    };

    presenter.setPlayerController = function (controller) {
        playerController = controller;
    };

    presenter.run = function (view, model) {
        presenter.$view = $(view);
        eventBus = playerController.getEventBus();
        textParser = new TextParserProxy(playerController.getTextParser());
        presenter.addonID = model.ID;
        makeView(view, model, false);
    };

    function isCorrectAnswer(element, values, index) {
        return values.indexOf(index.toString()) >= 0 && element.hasClass("down");
    }

    function isWrongAnswer(element, values, index) {
        return values.indexOf(index.toString()) < 0 && element.hasClass("down");
    }

    function notAllRequiredParameters(questions, possibleChoices) {
        return !questions[0].Question || possibleChoices.length < 2 || !possibleChoices[0].Choice || !possibleChoices[1].Choice;
    }

    function getSelectedElements() {
        var selectedElements = [];
        var i = 0;
        presenter.$view.find(".tf_" + presenter.type + "_image").each(function () {
            selectedElements[i] = $(this).hasClass("down");
            i++;
        });
        return JSON.stringify(selectedElements);
    }

    presenter.createPreview = function (view, model) {
        makeView(view, model, true);
    };

    presenter.getState = function () {
        return getSelectedElements();
    };

    presenter.setState = function (state) {
        var i = 0;
        var selectedElements = JSON.parse(state);

        presenter.$view.find(".tf_" + presenter.type + "_image").each(function () {
            if (selectedElements[i] == true) {
                $(this).addClass("down");
            }
            i++;
        });
    };

    presenter.setShowErrorsMode = function () {
        presenter.isErrorMode = true;
        markElements();
    };

    presenter.setWorkMode = function () {
        presenter.isErrorMode = false;
        workMode(false);
    };

    presenter.reset = function () {
        presenter.isErrorMode = false;
        workMode(true);
    };

    presenter.getErrorCount = function () {
        if (isNotActivity) return 0;
        return score().errorCount;
    };

    presenter.getMaxScore = function () {
        if (isNotActivity) return 0;
        return score().maxScore;
    };

    presenter.getScore = function () {
        if (isNotActivity) return 0;
        return score().score;
    };

    presenter.executeCommand = function (name, params) {
        if (presenter.isErrorMode) {
            return;
        }

        var commands = {
            'isAllOK': presenter.isAllOK,
            'isSelected': presenter.isSelectedCommand,
            'markAsCorrect': presenter.markAsCorrectCommand,
            'markAsWrong': presenter.markAsWrongCommand,
            'markAsEmpty': presenter.markAsEmptyCommand,
            'removeMark': presenter.removeMarkCommand
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.isAllOK = function () {
        return presenter.getMaxScore() === presenter.getScore() && presenter.getErrorCount() === 0;
    };

    presenter.isRowOK = function (selectedQuestion) {
        var correctAnswersLength = 0;
        var rowAnswers = questions[selectedQuestion - 1].Answer.split(',');
        var row = presenter.$view.find('#' + selectedQuestion);
        for (var i = 0; i < row.children('.down').length; i++) {
            var selectedAnswer = $(row.children('.down')[i]).index();
            var isSelectionCorrect = presenter.isSelectionCorrect(questions[selectedQuestion - 1], parseInt(selectedAnswer, 10));
            if (isSelectionCorrect) {
                correctAnswersLength++;
            }
        }
        ;
        return rowAnswers.length === correctAnswersLength;
    };

    presenter.isSelected = function (rowIndex, answerIndex) {
        if (answerIndex < 1) return false;
        var row = presenter.$view.find('#' + rowIndex);
        var el = row.children()[answerIndex];
        return $(el).hasClass("down");
    }


    presenter.markAsCorrect = function (rowIndex, answerIndex) {
        var row = presenter.$view.find('#' + rowIndex);
        if (rowIndex > 0) {
            var el = row.children()[answerIndex];
            $(el).addClass("disabled");
            $(el).addClass("correct");
         }
    };

    presenter.markAsWrong = function (rowIndex, answerIndex) {
        var row = presenter.$view.find('#' + rowIndex);
        if (rowIndex > 0) {
            var el = row.children()[answerIndex];
            $(el).addClass("disabled");
            $(el).addClass("wrong");
        }
    };

    presenter.markAsEmpty = function (rowIndex, answerIndex) {
        var row = presenter.$view.find('#' + rowIndex);
        if (rowIndex > 0) {
            var el = row.children()[answerIndex];
            $(el).addClass("disabled");
        }
    };

    presenter.removeMark = function (rowIndex, answerIndex) {
        var row = presenter.$view.find('#' + rowIndex);
        if (rowIndex > 0) {
            var el = row.children()[answerIndex];
            $(el).removeClass("wrong").removeClass("correct");
        }
    };

    presenter.isSelectedCommand = function (params) {
        presenter.isSelected(parseInt(params[0], 10), parseInt(params[1], 10));
    };

    presenter.markAsEmptyCommand = function (params) {
        presenter.markAsEmpty(parseInt(params[0], 10), parseInt(params[1], 10));
    };

    presenter.markAsWrongCommand = function (params) {
        presenter.markAsWrong(parseInt(params[0], 10), parseInt(params[1], 10));
    };

    presenter.removeMarkCommand = function (params) {
        presenter.removeMark(parseInt(params[0], 10), parseInt(params[1], 10));
    };

    presenter.markAsCorrectCommand = function (params) {
        presenter.markAsCorrect(parseInt(params[0], 10), parseInt(params[1], 10));
    };


    return presenter;
}