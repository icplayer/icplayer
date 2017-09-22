function AddonCatch_create() {

    var presenter = function () {};
    presenter.configuration = {};
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

    presenter.ERROR_CODES = {
        I01: 'Property Image cannot be empty',
        D01: 'Description too long. Max is 20 characters',
        L01: 'Property level cannot be empty',
        L02: 'Property level fill with numbers in range 1 - 3',
        P01: 'Property Points to Finish expects number',
        O01: 'Property Items cannot be empty'
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
    };

    function parseItems (rawItems) {
        var result = [];

        if (ModelValidationUtils.isArrayEmpty(rawItems)) {
            return getErrorObject('O01');
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

        return {
            items: validatedItems.value,
            levelsItems: presenter.calculateLevelsItems(validatedItems.value),
            pointsToFinish: validatedPointsToFinish.value,
            countErrors: ModelValidationUtils.validateBoolean(model["Count errors"]),

            ID: model.ID,
            isVisible: ModelValidationUtils.validateBoolean(model['Is Visible']),
            isValid: true
        }
    };

    function makePlate () {
        $plateElement = $('<img class="plate" />');
        $plateElement.attr('src', getImageUrlFromResources('plate.png'));

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
        var score = presenter.configuration.countErrors ? (points - errors) : points;

        if (!isInfiniteGame && score >= presenter.configuration.pointsToFinish) {
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

        var options = {
            duration: 'fast',
            easing: 'swing',
            queue: false
        };

        if (hasSpaceLeft) {
            $plateElement.animate({
                left: '0px'
            }, options);
        } else if (hasSpaceRight) {
            $plateElement.animate({
                left: (addOnWidth - plateWidth) + 'px'
            }, options);
        } else {
            var directionSign = isDirectionToRight ? '+' : '-';
            $plateElement.animate({
                left: directionSign + '=[plateWidth]px'.replace('[plateWidth]', plateWidth)
            }, options);
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
        $welcomePage.css('background', 'url(' + getImageUrlFromResources('startGame.png') + ') no-repeat');
        $welcomePage.css('background-size', 'auto');
        $welcomePage.css('background-position-x', 'center');
        $welcomePage.css('background-position-y', 'center');

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

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        eventBus = controller.getEventBus();
    };

    function getImageUrlFromResources (fileName) {
        return presenter.playerController.getStaticFilesPath() + 'addons/resources/' + fileName;
    }

    return presenter;
}
