function AddonCatch_create() {
    var presenter = function () {};
    var eventBus;

    var points = 0;
    var errors = 0;
    var $plateElement = null;
    var isGameOver = false;

    function getErrorObject (ec) { return { isValid: false, errorCode: ec }; }

    function getCorrectObject (v) { return { isValid: true, value: v }; }

    function getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getItemObject (index, image, description, isCorrect, level) {
        return {
            index: index,             // item index
            image: image,             // image url
            description: description, // description (max 20 characters)
            isCorrect: isCorrect,     // boolean
            levels: level             // array of levels in range 1 - 3
        };
    }

    var levelsParameters = [{
        speedMin: 10000,
        speedMax: 15000,
        density: 4
    },
    {
        speedMin: 7500,
        speedMax: 12500,
        density: 8
    },
    {
        speedMin: 5000,
        speedMax: 10000,
        density: 12
    }];
    var currentLevel = 0;

    var defaultLevelsItems = [
        [
            getItemObject(0, 'http://rs858.pbsrc.com/albums/ab148/SuperNyappyOfLove/Kawaii%20Stuff/Pixels/080.gif~c200', 'Apple', true, [1,2,3]),
            getItemObject(1, 'https://ih1.redbubble.net/image.77255900.5643/flat,1000x1000,075,f.jpg', 'Pie', false, [1,2,3])
        ],
        [
            getItemObject(0, 'http://rs858.pbsrc.com/albums/ab148/SuperNyappyOfLove/Kawaii%20Stuff/Pixels/080.gif~c200', 'Apple', true, [1,2,3]),
            getItemObject(1, 'https://ih1.redbubble.net/image.77255900.5643/flat,1000x1000,075,f.jpg', 'Pie', false, [1,2,3])
        ],
        [
            getItemObject(0, 'http://rs858.pbsrc.com/albums/ab148/SuperNyappyOfLove/Kawaii%20Stuff/Pixels/080.gif~c200', 'Apple', true, [1,2,3]),
            getItemObject(1, 'https://ih1.redbubble.net/image.77255900.5643/flat,1000x1000,075,f.jpg', 'Pie', false, [1,2,3])
        ]
    ];

    presenter.ERROR_CODES = {
        I01: 'Property Image cannot be empty',
        D01: 'Description too long. Max is 20 characters',
        L01: 'Property level cannot be empty',
        L02: 'Property level fill with numbers in range 1 - 3',
        P01: 'Property Points to Finish expects number'
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
    };

    function parseItems (rawItems) {
        var result = [];

        if (ModelValidationUtils.isArrayEmpty(rawItems)) {
            return getCorrectObject([]);
        }

        for (var i=0; i<rawItems.length; i++) {
            var rawItem = rawItems[i];

            var image = rawItem['Image'];
            var description = rawItem['Description'];
            var isCorrect = ModelValidationUtils.validateBoolean(rawItem['Is Correct']);
            var level = rawItem['Level'];

            if (ModelValidationUtils.isStringWithPrefixEmpty(image, "/file/")) {
                return getErrorObject('I01');
            }

            if (description.length > 20) {
                return getErrorObject('D01');
            }

            if (!level) {
                return getErrorObject('L01');
            }

            level = level.split(',').filter(function (l) {
                return l !== '';
            }).map(function (l) {
                return parseInt(l.trim(), 10);
            });

            // remove duplicates
            level = level.filter(function(item, pos) {
                return level.indexOf(item) === pos;
            });

            var isCorrectNumbersInLevels = level.every(function (l) {
                return l === 1 || l === 2 || l === 3;
            });
            if (!isCorrectNumbersInLevels) {
                return getErrorObject('L02');
            }

            result.push(getItemObject(i, image, description, isCorrect, level));
        }

        return getCorrectObject(result);
    }

    function parsePointsToFinish (pointsRaw) {
        var points = parseInt(pointsRaw || 0, 10);

        if (isNaN(points)) {
            return getErrorObject('P01');
        }

        return getCorrectObject(points);
    }

    presenter.calculateLevelsItems = function (items) {
        var result = [[], [], []];

        for (var i=0; i<items.length; i++) {
            var item = items[i];

            for (var j=0; j<item.levels.length; j++) {
                result[item.levels[j]-1].push(item);
            }
        }

        return result;
    };

    presenter.validateModel = function (model) {
        var validatedItems = parseItems(model['Items']);
        if (!validatedItems.isValid) {
            return getErrorObject(validatedItems.errorCode);
        }

        var validatedPointsToFinish = parsePointsToFinish(model['Points to finish']);
        if (!validatedPointsToFinish.isValid) {
            return getErrorObject(validatedPointsToFinish.errorCode);
        }

        var levelsItems;
        if (validatedItems.value.length === 0) {
            levelsItems = defaultLevelsItems;
        } else {
            levelsItems = presenter.calculateLevelsItems(validatedItems.value);
        }

        return {
            items: validatedItems.value,
            levelsItems: levelsItems,
            pointsToFinish: validatedPointsToFinish.value,

            ID: model.ID,
            isVisible: ModelValidationUtils.validateBoolean(model['Is Visible']),
            isValid: true
        }
    };

    function makePlate () {
        $plateElement = $('<img class="plate" />');
        $plateElement.attr('src', 'http://www.clipartsfree.net/vector/medium/9748-plate-green-with-red-trim-art-design.png');

        presenter.$view.append($plateElement);
    }

    function makeDescription (description) {
        var $description = $('<span class="description">' + description + '</span>');
        $description.css('top', '-15px');
        $description.css('left', '-5px');
        return $description;
    }

    function getRandomItemFromLevel (level) {
        var itemsForLevel = presenter.configuration.levelsItems[level];
        return itemsForLevel[Math.floor(Math.random() * itemsForLevel.length)];
    }

    function onNewPoint (itemNumber) {
        points++;
        sendEvent(itemNumber, 1, true);

        var isInfiniteGame = presenter.configuration.pointsToFinish === 0;
        if (!isInfiniteGame && points >= presenter.configuration.pointsToFinish) {
            sendEvent('all', 'EOG', true);
            presenter.reset(true);
        }
    }

    function onNewError (itemNumber) {
        errors++;
        sendEvent(itemNumber, 1, false);
    }

    function reCreateFallingObject (itemNumber) {
        sendEvent(itemNumber, 0, false);

        makeFallingObject();
    }

    function makeFallingObject () {
        if (isGameOver) {
            return;
        }

        var isRemoved = false;
        var addOnHeight = presenter.$view.height();
        var itemObject = getRandomItemFromLevel(currentLevel);

        var $objectElement = $('<div class="fallingObject"></div>');
        $objectElement.css('background', 'url(' + itemObject.image + ')');
        $objectElement.append(makeDescription(itemObject.description));
        $objectElement.css('background-size', 'cover');
        presenter.$view.append($objectElement);

        var xPosition = getRandomInt(0, presenter.$view.width() - $objectElement.width());
        $objectElement.css('left', xPosition + 'px');
        $objectElement.css('top', '-100px');

        var speed = getRandomInt(levelsParameters[currentLevel].speedMin, levelsParameters[currentLevel].speedMax);
        var landingPosition = (addOnHeight + 100) + 'px';

        $objectElement.animate({'top': landingPosition}, {
            duration: speed,
            complete: function () { reCreateFallingObject(itemObject.index + 1) },
            step: function (now, tween) {
                if (isRemoved) return;

                now = Math.round(now);
                var elementBotYPosition = now + $objectElement.height();
                var isInCatchLevel = elementBotYPosition < addOnHeight && elementBotYPosition > addOnHeight - $plateElement.height();

                if (isInCatchLevel) {
                    var elementLeftEdge = xPosition;
                    var elementRightEdge = elementLeftEdge + $objectElement.width();

                    var plateLeftEdge = $plateElement.offset().left - presenter.$view.offset().left;
                    var plateRightEdge = plateLeftEdge + $plateElement.width();

                    var isOnLeftEdge = plateLeftEdge < elementRightEdge && plateRightEdge > elementRightEdge;
                    var isOnCenter = plateLeftEdge <= elementLeftEdge && plateRightEdge >= elementRightEdge;
                    var isOnRightEdge = plateLeftEdge < elementLeftEdge && plateRightEdge > elementLeftEdge;

                    if (isOnLeftEdge || isOnCenter || isOnRightEdge) {
                        if (itemObject.isCorrect) {
                            onNewPoint(itemObject.index + 1);
                        } else {
                            onNewError(itemObject.index + 1);
                        }
                        $objectElement.stop();
                        $objectElement.remove();
                        makeFallingObject();
                        isRemoved = true;
                    }
                }
            }
        });

    }

    function startGame (level) {
        makePlate();

        var numberOfElements = levelsParameters[level].density;
        for (var i=0; i<numberOfElements; i++) {
            setTimeout(function () {
                makeFallingObject();
            }, 1000 * i);
        }
    }

    function movePlate (isDirectionToRight) {
        var platePositionLeft = $plateElement.offset().left;
        var plateWidth = $plateElement.width();
        var addOnPositionLeft = presenter.$view.position().left;
        var addOnWidth = presenter.$view.width();

        var isPositionZeroLeft = platePositionLeft <= addOnPositionLeft;
        var isPositionZeroRight = platePositionLeft + plateWidth >= addOnPositionLeft + addOnWidth;

        if (!isDirectionToRight && isPositionZeroLeft || isDirectionToRight && isPositionZeroRight) {
            return;
        }

        var hasSpaceLeft = !isDirectionToRight && (platePositionLeft - addOnPositionLeft < plateWidth);
        var hasSpaceRight = isDirectionToRight && (platePositionLeft + plateWidth + plateWidth >= addOnPositionLeft + addOnWidth);

        if (hasSpaceLeft) {
            $plateElement.animate({'left': '0px'}, 'fast', 'linear');
        } else if (hasSpaceRight) {
            $plateElement.animate({'left': (addOnWidth - plateWidth) + 'px'}, 'fast', 'linear');
        } else {
            var directionSign = isDirectionToRight ? '+' : '-';
            $plateElement.animate({
                'left': directionSign + '=[plateWidth]px'.replace('[plateWidth]', plateWidth)
            }, 'fast', 'linear');
        }
    }

    function turnOnEventListeners () {
        presenter.$view.keydown(function (e) {
            if (e.key === 'ArrowLeft') {
                movePlate(false);
            }

            if (e.key === 'ArrowRight') {
                movePlate(true);
            }
        });

        presenter.$view.on('click', function (e) {
            var isLeftSide = (e.clientX - presenter.$view.position().left) > Math.round(presenter.$view.width() / 2);
            movePlate(isLeftSide);
        });

        presenter.$view.focus();
    }

    function turnOffEventListeners () {
        presenter.$view.off();
    }

    function makeWelcomePage () {
        var $welcomePage = $('<div class="welcome"></div>');
        $welcomePage.css('background', 'url(data:image/png;base64,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TUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MTwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPHRpZmY6Q29tcHJlc3Npb24+NTwvdGlmZjpDb21wcmVzc2lvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzI8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+NTEyPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj41MTI8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICAgICA8ZGM6c3ViamVjdD4KICAgICAgICAgICAgPHJkZjpCYWcvPgogICAgICAgICA8L2RjOnN1YmplY3Q+CiAgICAgICAgIDx4bXA6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) no-repeat');
        $welcomePage.css('background-size', 'contain');
        $welcomePage.css('background-position-x', 'center');
        $welcomePage.css('background-position-x', 'center');

        return $welcomePage;
    }

    presenter.presenterLogic = function (view, model, isPreview) {
        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return false;
        }

        presenter.$view = $(view);
        presenter.$view.attr('tabindex', 1);

        if (!isPreview) {
            var $welcomePage = makeWelcomePage();
            presenter.$view.append($welcomePage);

            $welcomePage.on('click', function () {
                startGame(currentLevel);
                turnOnEventListeners();
                $welcomePage.remove();
            });

        }
    };

    function stopAndRemoveFallingObjects () {
        presenter.$view.find('.fallingObject').each(function () {
            $(this).stop();
            $(this).remove();
        });
        presenter.$view.empty();
    }

    presenter.setLevel = function (level) {
        level = parseInt(level, 10);
        if (level === 1 || level === 2 || level === 3) {
            currentLevel = level-1;
            turnOffEventListeners();
            stopAndRemoveFallingObjects();
            startGame(currentLevel);
            turnOnEventListeners();
        }
    };

    presenter.getPoints = function () {
        return points;
    };

    presenter.getErrors = function () {
        return errors;
    };

    presenter.run = function (view, model) {
        presenter.presenterLogic(view, model, false);
    };

    presenter.createPreview = function (view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.reset = function (isEndGame) {
        isEndGame = isEndGame || false;
        isGameOver = isEndGame;

        if (!isEndGame) {
            points = 0;
            errors = 0;
            currentLevel = 0;
        }

        turnOffEventListeners();
        stopAndRemoveFallingObjects();

        if (!isEndGame) {
            startGame(currentLevel);
            turnOnEventListeners();
        }
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css('visibility', isVisible ? 'visibility' : 'hidden');
    };

    presenter.show = function () {
        presenter.setVisibility(true);
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
    };

    presenter.executeCommand = function (name, params) {
        if (!presenter.configuration.isValid) {
            return;
        }

        var commands = {
            'reset': presenter.reset,
            'show': presenter.show,
            'hide': presenter.hide,

            'setLevel': presenter.setLevel,
            'getPoints': presenter.getPoints,
            'getErrors': presenter.getErrors
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.getErrorCount = function () {
        return errors;
    };

    presenter.getMaxScore = function () {

    };

    presenter.getScore = function () {
        return points;
    };

    presenter.getState = function () {
        return JSON.stringify({
            isVisible: presenter.configuration.isVisible,
            points: points,
            errors: errors
        });
    };

    presenter.setState = function (state) {
        if (ModelValidationUtils.isStringEmpty(state)) {
            return;
        }

        var parsedState = JSON.parse(state);

        presenter.configuration.isVisible = parsedState.isVisible;
        points = parsedState.points;
        errors = parsedState.errors;

        presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.isAllOk = function () {
        return errors === 0;
    };

    function sendEvent (item, value, isCorrect) {
        function createEventObject(_item, _value, _isCorrect) {
            return {
                'source': presenter.configuration.ID,
                'item': '' + _item,
                'value': '' + _value,
                'score': _isCorrect ? '1' : '0'
            };
        }

        eventBus.sendEvent('ValueChanged', createEventObject(item, value, isCorrect));
    }

    presenter.setPlayerController = function(controller) {
        eventBus = controller.getEventBus();
    };

    return presenter;
}
