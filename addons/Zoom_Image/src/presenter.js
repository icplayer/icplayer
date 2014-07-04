function AddonZoom_Image_create() {

    var presenter = function(){};

    function setSmallImage(url) {
        var $image = $('<img class="small">');
        $image.attr("src", url);
        $image.attr("height", presenter.configuration.height);
        $image.attr("width", presenter.configuration.width);
        presenter.$view.find("div.content").append($image);
    }

    presenter.ERROR_CODES = {
        IMAGE01: "Property Full Screen image and Page image cannot be empty"
    };

    function returnErrorObject(ec) { return { isValid: false, errorCode: ec }; }

    function returnCorrectObject(v) { return { isValid: true, value: v }; }

    function parseImage(image) {
        if (ModelValidationUtils.isStringWithPrefixEmpty(image, "/file/")) {
            return returnErrorObject("IMAGE01");
        }

        return returnCorrectObject(image);
    }

    presenter.validateModel = function(model) {

        var validatedBigImage = parseImage(model["Full Screen image"]);
        if (!validatedBigImage.isValid) {
            return returnErrorObject(validatedBigImage.errorCode);
        }

        var validatedSmallImage = parseImage(model["Page image"]);
        if (!validatedSmallImage.isValid) {
            return returnErrorObject(validatedSmallImage.errorCode);
        }

        return {
            bigImage: validatedBigImage.value,
            smallImage: validatedSmallImage.value,

            ID: model["ID"],
            width: parseInt(model["Width"], 10),
            height: parseInt(model["Height"], 10),
            isVisible: ModelValidationUtils.validateBoolean(model['Is Visible']),
            isValid: true
        }
    };

    presenter.presenterLogic = function(view, model, isPreview) {
        presenter.$view = $(view);

        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return false;
        }

        setSmallImage(presenter.configuration.smallImage);

        if (!isPreview) {
            presenter.eventType = MobileUtils.isMobileUserAgent(navigator.userAgent) ? "touchend" : "click";
            turnOnEventListeners();
        }

        presenter.setVisibility(presenter.configuration.isVisible);

        return false;
    };

    presenter.run = function(view, model) {
        presenter.presenterLogic(view, model, false);
    };

    presenter.createPreview = function(view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    function turnOnEventListeners() {
        function createPopUp(e) {
            e.preventDefault();
            e.stopPropagation();

            presenter.$image = $("<img class='big' src='" + presenter.configuration.bigImage + "'>");
            presenter.$image.appendTo(presenter.$view);

            presenter.$image.dialog({
                modal: true,
                resizable: false,
                draggable: false,
                show: {
                    effect: "fade",
                    duration: 1000
                },
                position: {
                    my: "center",
                    at: "center",
                    of: document.getElementById("_icplayer")
                }
            });

            presenter.$image.removeAttr('style');

            presenter.$image.parent().wrap("<div class='zoom-image-wraper'></div>");

            function remove(e) {
                e.preventDefault();
                e.stopPropagation();

                $(".zoom-image-wraper").remove();
                $(".big").remove();
            }

            presenter.$image.on(presenter.eventType, remove);
        }

        presenter.$view.find(".icon").on(presenter.eventType, createPopUp)
    }

//    presenter.setShowErrorsMode = function() {};
//    presenter.setWorkMode = function() {};
//    presenter.reset = function() {};
//    presenter.getErrorCount = function() {};
//    presenter.getMaxScore = function() {};
//    presenter.getScore = function() {};
//    presenter.getState = function() {};
//    presenter.setState = function(state) {};

    return presenter;
}