function AddonCatch_create() {
    var presenter = function () {};
    var points = 0;
    var $plateElement = null;

    function returnErrorObject (ec) { return { isValid: false, errorCode: ec }; }

    function returnCorrectObject (v) { return { isValid: true, value: v }; }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    presenter.ERROR_CODES = {

    };

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
    };

    function parseTest (text) {
        return returnCorrectObject(text);
    }

    presenter.validateModel = function (model) {
        var validatedTest = parseTest(model['Test']);
        if (!validatedTest.isValid) {
            return returnErrorObject(validatedTest.errorCode);
        }

        return {
            test: validatedTest.value,

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

    function makeFallingObject () {
        var isCorrectObject = Math.random() < 0.5;
        var isRemoved = false;
        var addOnHeight = presenter.$view.height();
        var $objectElement = $('<div class="fallingObject"></div>');

        if (isCorrectObject) {
            $objectElement.css('background', 'url(http://rs858.pbsrc.com/albums/ab148/SuperNyappyOfLove/Kawaii%20Stuff/Pixels/080.gif~c200)');
            $objectElement.append(makeDescription('apple'));
        } else {
            $objectElement.css('background', 'url(https://ih1.redbubble.net/image.77255900.5643/flat,1000x1000,075,f.jpg)');
            $objectElement.append(makeDescription('pie'));
        }
        $objectElement.css('background-size', 'cover');
        presenter.$view.append($objectElement);

        var xPosition = getRandomInt(0, presenter.$view.width() - $objectElement.width());
        $objectElement.css('left', xPosition + 'px');
        $objectElement.css('top', '-100px');

        var speed = getRandomInt(5000, 10000);
        var landingPosition = (addOnHeight + 100) + 'px';

        $objectElement.animate({'top': landingPosition}, {
            duration: speed,
            complete: makeFallingObject,
            step: function (now, tween) {
                if (isRemoved) return;

                now = Math.round(now);
                var elementBotYPosition = now + $objectElement.height();
                var isInCatchLevel = elementBotYPosition < addOnHeight && elementBotYPosition > addOnHeight - $plateElement.height();

                if (isInCatchLevel) {
                    var plateOffset = $plateElement.position().left - presenter.$view.position().left;
                    if (plateOffset <= xPosition && plateOffset + $plateElement.width() + $objectElement.width() >= xPosition) {
                        if (isCorrectObject) {
                            points++;
                        } else {
                            points--;
                        }
                        $(this).remove();
                        isRemoved = true;
                    }
                }
            }
        });

    }

    function startGame () {
        makePlate();

        var numberOfElements = 12;
        for (var i=0; i<numberOfElements; i++) {
            setTimeout(function () {
                makeFallingObject();
            }, 1000 * i);
        }
    }

    function movePlate (isDirectionToRight) {
        var platePositionLeft = $plateElement.position().left;
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

    presenter.presenterLogic = function (view, model, isPreview) {
        presenter.configuration = presenter.validateModel(model);
        presenter.$view = $(view);
        presenter.$view.attr('tabindex', 1);

        if (!isPreview) {
            startGame();
        }

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
    };

    presenter.run = function (view, model) {
        presenter.presenterLogic(view, model, false);
    };

    presenter.createPreview = function (view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.onEventReceived = function (eventName, eventData) {

    };

    presenter.reset = function () {

    };

    presenter.setShowErrorsMode = function () {

    };

    presenter.setWorkMode = function () {

    };

    return presenter;
}
