function AddonCatch_create() {
    var presenter = function () {};
    var points = 0;

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
        var plateElement = $('<img class="plate" />');
        plateElement.attr('src', 'http://www.clipartsfree.net/vector/medium/9748-plate-green-with-red-trim-art-design.png');

        presenter.$view.append(plateElement);
    }

    function makeFruit () {
        var fruitElement = $("<img class='fruit' />");
        fruitElement.attr("src", "https://www.emojibase.com/resources/img/emojis/apple/x1f34d.png.pagespeed.ic.8rtDbOLo72.png");

        presenter.$view.append(fruitElement);
        fruitElement.css('left', getRandomInt(0, presenter.$view.width()) + "px");

        fruitElement.css("top", "-100px");
        var speed = getRandomInt(5000, 10000);

        // Start animation
        fruitElement.animate({"top": "430px"}, speed, "swing", makeFruit);

        // Add click listener for fruits
        // fruitElement.click(fruitClick);

        // function fruitClick () {
        //     var fruitPoints = Number($(this).attr("data-points"));
        //     points = points + fruitPoints;
        //     $(".points-text").text(points);
        //     $(this).remove();
        // }

    }

    function startGame () {
        makePlate();

        for (var i=0; i<8; i++) {
            setTimeout(function () {
                makeFruit();
            }, 500 * i);
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
            console.log('event', e);
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
