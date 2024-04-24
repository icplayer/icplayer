function AddonCatch_create() {

    var presenter = function () {};
    presenter.configuration = {};

    var points = 0;
    var errors = 0;
    var $plateElement = null;
    var isGameOver = false;
    var isPaused = false;
    var pausedTimeInMs = 0;
    var objects = [];

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

    function getElementPositionLeft(element) {
        // can't use jquery position or offset, because they return values in virtual coordinate system
        // on high dpi devices such as smartphones, and we need CSS pixels coords
        return parseInt(element.css("left"), 10);
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
        O01: 'Property Items cannot be empty',
        W01: 'Property Width or Height cannot be empty'
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

    function parseWidthHeight (propertyValue) {
        var value = parseInt(propertyValue, 10);

        if (isNaN(value)) {
            return getErrorObject('W01');
        }

        return getCorrectObject(value);
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

        var validatedItemWidth = parseWidthHeight(model['Item_Width']);
        if (!validatedItemWidth.isValid) {
            return getErrorObject(validatedItemWidth.errorCode);
        }

        var validatedItemHeight = parseWidthHeight(model['Item_Height']);
        if (!validatedItemHeight.isValid) {
            return getErrorObject(validatedItemHeight.errorCode);
        }

        return {
            items: validatedItems.value,
            plateImage: model['Plate image'],
            levelsItems: presenter.calculateLevelsItems(validatedItems.value),
            pointsToFinish: validatedPointsToFinish.value,
            countErrors: ModelValidationUtils.validateBoolean(model["Count errors"]),
            itemWidth: validatedItemWidth.value,
            itemHeight: validatedItemHeight.value,
            ID: model.ID,
            isVisible: ModelValidationUtils.validateBoolean(model['Is Visible']),
            isValid: true
        }
    };

    presenter.onDestroy = function () {
        presenter.clearCatchObjects(objects);

        objects = null;
    };

    presenter.clearCatchObjects = function (objects) {
        objects.forEach( function(value) {
            value.obj.stop();
            value.obj.remove();
            value.obj = null;
        });
    };

    function makePlate () {
        var plateImage = presenter.configuration.plateImage !== "" && presenter.configuration.plateImage !== undefined ? presenter.configuration.plateImage : getImageUrlFromResources('plate.png');

        $plateElement = $('<img class="plate" />');
        $plateElement.attr('src', plateImage);

        presenter.$view.append($plateElement);

        // put the plate in the center of screen
        var addOnWidth = presenter.$view.width();
        var centerPos = addOnWidth/2 - $plateElement.width()/2;
        $plateElement.css('left', centerPos + 'px' );
    }

    function makeDescription (description) {
        var $description = $('<span class="description">' + description + '</span>');
        $description.css('top', '-15px');
        return $description;
    }

    function setDescriptionPosition (description, itemWidth) {
        var descWidth = description.outerWidth(); // get full width, including padding
        var leftPos= (-descWidth/2 + itemWidth/2) + 'px';
        description.css('left', leftPos );
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

        makeFallingObject(0);
    }

    function makeFallingObject (yOffset) {
        if (isGameOver) {
            return;
        }

        var addOnHeight = presenter.$view.height();
        var itemObject = getRandomItemFromLevel(currentLevel);

        var $objectElement = $('<div class="fallingObject"></div>');
        $objectElement.css('background', 'url(' + itemObject.image + ')');
        var description = makeDescription(itemObject.description);
        $objectElement.append(description);

        $objectElement.css('background-size', 'cover');
        presenter.$view.append($objectElement);

        setDescriptionPosition(description, presenter.configuration.itemWidth); // we have to do this after appending object to DOM

        var longestWidth = Math.max(description.outerWidth(), presenter.configuration.itemWidth);
        var xPosition = getRandomInt(longestWidth/2, presenter.$view.width() - longestWidth);

        $objectElement.css('left', xPosition + 'px');
        $objectElement.css('top', '-' + (100 + yOffset) + 'px');
        $objectElement.css('width', presenter.configuration.itemWidth);
        $objectElement.css('height', presenter.configuration.itemHeight);

        var duration = getRandomInt(levelsParameters[currentLevel].speedMin, levelsParameters[currentLevel].speedMax);
        var landingPosition = (addOnHeight + 10) + 'px';
        var initialTimeInMs = new Date().getTime();

        startMoving($objectElement, landingPosition, duration, itemObject, xPosition, initialTimeInMs);
    }

    function removeObject(object) {
        object.stop();
        object.remove();
        objects = objects.filter( function (objectIter) {
                return objectIter.obj !== object;
            }
        );
    }

    function startMoving($objectElement, landingPosition, duration, itemObject, xPosition, initialTime) {
        var isRemoved = false;

        objects.push( { obj: $objectElement, duration: duration, landing: landingPosition, item: itemObject, xPos: xPosition, initialTime: initialTime } );

        $objectElement.animate({'top': landingPosition}, {
            duration: duration,
            easing: 'linear',
            complete: function () {
                removeObject($objectElement);
                reCreateFallingObject(itemObject.index + 1);
            },
            step: function (now, tween) {
                if (isRemoved) return;

                var addOnHeight = presenter.$view.height();
                now = Math.round(now);
                var elementBotYPosition = now + $objectElement.height();
                var isInCatchLevel = elementBotYPosition < addOnHeight && elementBotYPosition > addOnHeight - $plateElement.height();

                if (isInCatchLevel) {
                    var elementLeftEdge = xPosition;
                    var elementRightEdge = elementLeftEdge + $objectElement.width();

                    var plateLeftEdge = getElementPositionLeft($plateElement);
                    var plateRightEdge = plateLeftEdge + $plateElement.width();

                    if (!(plateLeftEdge > elementRightEdge || plateRightEdge < elementLeftEdge)) {
                        if (itemObject.isCorrect) {
                            onNewPoint(itemObject.index + 1);
                        } else {
                            onNewError(itemObject.index + 1);
                        }

                        removeObject($objectElement);
                        makeFallingObject(0);
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
            makeFallingObject(150 * i);
        }
    }

    function movePlate (isDirectionToRight) {

        if (isPaused) {
            return;
        }

        var addOnPositionLeft = getElementPositionLeft(presenter.$view);
        var addOnWidth = presenter.$view.width();

        var platePositionLeft = addOnPositionLeft + getElementPositionLeft($plateElement);
        var plateWidth = $plateElement.width();

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
            if (e.key.localeCompare('ArrowLeft') === 0 || e.key.localeCompare('Left') === 0) {
                movePlate(false);
            }
            if (e.key.localeCompare('ArrowRight') === 0 || e.key.localeCompare('Right') === 0) {
                movePlate(true);
            }
        });

        if (MobileUtils.isMobileUserAgent(navigator.userAgent)) {
            presenter.$view.on('touchstart', function (e) {
                e.preventDefault();

                const posX = e.originalEvent.touches[0].pageX;
                const scaledX = posX / getScale().X;

                if (!isAbovePlateCenter(scaledX)) {
                    const isLeftSide = isPointOnLeftSide(scaledX);
                    movePlate(isLeftSide);
                }
            });
        } else {
            presenter.$view.on('click', function (e) {
                e.preventDefault();

                const posX = e.clientX;
                const scaledX = posX / getScale().X;

                if (!isAbovePlateCenter(scaledX)) {
                    const isLeftSide = isPointOnLeftSide(scaledX);
                    movePlate(isLeftSide);
                }
            });
        }

        presenter.$view.focus();
    }

    function getScale() {
        if (presenter.playerController) {
            const scaleInformation = presenter.playerController.getScaleInformation();
            if (scaleInformation.baseScaleX !== 1.0 ||
                scaleInformation.baseScaleY !== 1.0 ||
                scaleInformation.scaleX !== 1.0 ||
                scaleInformation.scaleY !== 1.0
            ) {
                return {X: scaleInformation.scaleX, Y: scaleInformation.scaleY};
            }
        }

        const $content = $("#content");
        if ($content.size() > 0) {
            const contentElem = $content[0];
            const scaleX = contentElem.getBoundingClientRect().width / contentElem.offsetWidth;
            const scaleY = contentElem.getBoundingClientRect().height / contentElem.offsetHeight;
            return {X: scaleX, Y: scaleY};
        } else {
            return {X: 1.0, Y: 1.0};
        }
    }

    function turnOffEventListeners () {
        presenter.$view.off();
    }

    function isAbovePlateCenter(point) {
        var addonBounds = presenter.$view[0].getBoundingClientRect();
        var addonLeftPos = addonBounds.left;
        var relativePoint = point - addonLeftPos;
        var quarterWidth =  Math.round($plateElement.width() / 4);
        var plateLeft = getElementPositionLeft($plateElement) + quarterWidth;
        var plateRight = plateLeft + quarterWidth*2;
        return relativePoint > plateLeft && relativePoint < plateRight;
    }

    function isPointOnLeftSide(point) {
        // we have to obtain the virtual coordinates of addon, because point from touchstart
        // will come in virtual coords, in case of high dpi devices such as smartphones
        // getBoundingClientRect will work correctly in css pixels in case of low dpi devices
        var addonBounds = presenter.$view[0].getBoundingClientRect();
        var addonLeftPos = addonBounds.left / getScale().X;
        var plateCenterPos = getElementPositionLeft($plateElement) + Math.round($plateElement.width() / 2);
        return (point - addonLeftPos) > plateCenterPos;
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
                if (isPaused) {
                    return;
                }
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
        isPaused = false;
        objects = [];

        turnOffEventListeners();
        stopAndRemoveFallingObjects();

        if (!isEndGame) {
            var $welcomePage = makeWelcomePage();
            presenter.$view.append($welcomePage);

            $welcomePage.on('click', function () {
                if (isPaused) {
                    return;
                }
                startGame(currentLevel);
                turnOnEventListeners();
                $welcomePage.remove();
            });
        }
        presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css('visibility', isVisible ? 'visible' : 'hidden');
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
        if (presenter.configuration.pointsToFinish === 0)
            return 0;
        else
            return presenter.configuration.pointsToFinish;
    };

    presenter.getScore = function () {
        return presenter.configuration.countErrors ? Math.max((points - errors), 0) : points;
    };

    presenter.getState = function () {
        return JSON.stringify({
            isVisible: presenter.$view.css('visibility') === 'visible',
            points: points,
            errors: errors
        });
    };

    presenter.setState = function (state) {
        if (ModelValidationUtils.isStringEmpty(state)) {
            return;
        }

        const parsedState = JSON.parse(state);
        points = parsedState.points;
        errors = parsedState.errors;

        presenter.setVisibility(parsedState.isVisible);
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

        presenter.eventBus.sendEvent('ValueChanged', createEventObject(item, value, isCorrect));
    }

    presenter.setEventBus = function(eventBus) {
        presenter.eventBus = eventBus;

        presenter.eventBus.addEventListener('ShowAnswers', this);
        presenter.eventBus.addEventListener('HideAnswers', this);
    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
    };

    function getImageUrlFromResources (fileName) {
        return presenter.playerController.getStaticFilesPath() + 'addons/resources/' + fileName;
    }

    presenter.setWorkMode = function () {
        resumeSimulation();
    };

    presenter.setShowErrorsMode = function () {
        pauseSimulation();
    };

    presenter.showAnswers = function () {
        pauseSimulation();
    };

    presenter.hideAnswers = function () {
        resumeSimulation();
    };

    presenter.onEventReceived = function (eventName) {

        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    function pauseSimulation() {
        if (isPaused)
            return;
        isPaused = true;
        pausedTimeInMs = new Date().getTime();

        for (var i = 0; i < objects.length; i++) {
            var object = objects[i];
            object.obj.clearQueue();
            object.obj.stop();
        }
    }

    function resumeSimulation() {
        if (!isPaused)
            return;
        isPaused = false;
        // copy objects to new array, because it will be edited in startMoving
        var newObjects = objects.slice();
        objects = [];
        var currentTimeInMs = new Date().getTime();

        for (var j = 0; j < newObjects.length; j++) {
            var obj = newObjects[j];

            // rescale animations
            var dt = obj.duration - (pausedTimeInMs - obj.initialTime);
            startMoving(obj.obj, obj.landing, dt, obj.item, obj.xPos, currentTimeInMs);
        }
    }

    return presenter;
}

AddonCatch_create.__supported_player_options__ = {
    interfaceVersion: 2
};
