function AddonModelViewer3D_create() {
    // to create version on mauthor-dev use storage.googleapis URL
    var presenter = function() {};

    presenter.wasInitiated = false;
    presenter.annotationsVisibility = "visible";
    presenter.isVisibleOnStart = true;
    presenter.areAnnotationsVisibleOnStart = true;

    presenter.run = function(view, model){
        if(!presenter.wasInitiated) {
            presenter.init(view, model);
        }
    };

    presenter.createPreview = function(view, model){
        if(!presenter.wasInitiated) {
            presenter.init(view, model);
            presenter.disableEvents();
        }
    };

    presenter.init = function(view, model) {
        presenter.$view = $(view);
        presenter.configuration = presenter.validateModel(model);
        presenter.isVisibleOnStart = presenter.configuration.isVisible;

        if (!presenter.configuration.isValid) {
            showErrorMessage();
            return;
        }

        presenter.modelViewer = presenter.$view.find("model-viewer").get(0);

        presenter.handleAttributes();
        presenter.setAnnotations();
        presenter.setAutoRotation();
        presenter.setInteractionPrompt();
        presenter.handleButtons();
        presenter.handleCopyright();

        $(presenter.modelViewer).on('load', function(){
            if(presenter.configuration.scale !== undefined && presenter.configuration.scale !== "") presenter.setScale(presenter.configuration.scale);
        });

        presenter.wasInitiated = true;
    };

    presenter.validateModel = function (model) {
        let isValid = true;
        let additionalAttributes;
        const isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);
        const isAutoRotate = ModelValidationUtils.validateBoolean(model["autoRotate"]);
        const areLabelsEnabled = ModelValidationUtils.validateBoolean(model["labelsEnabled"]);
        const isInteractionPrompt = ModelValidationUtils.validateBoolean(model["interactionPrompt"]);
        const environmentImage = model["environmentImage"] === "" ? "neutral" : model["environmentImage"];
        try {
            if (model["attributes"].trim() !== "") {
                additionalAttributes = JSON.parse(model["attributes"].trim());
            }
        } catch (e) {
            isValid = false;
        }

        return {
            isValid: isValid,
            isVisible: isVisible,
            addonID: model["ID"],
            model: model["model"],
            poster: model["poster"],
            annotations: model["annotations"].trim(),
            environmentImage: environmentImage,
            skyboxImage: model["skyboxImage"],
            shadowSoftness: model["shadowSoftness"],
            shadowIntensity: model["shadowIntensity"],
            autoRotate: isAutoRotate,
            scale: model["scale"],
            labelsEnabledOnStart: areLabelsEnabled,
            altText: model["altText"],
            additionalAttributes: additionalAttributes,
            copyInfo: model["copyInfo"],
            interactionPrompt: isInteractionPrompt
        };
    };

    presenter.handleAttributes = function () {
        $(presenter.modelViewer).attr("src", presenter.configuration.model);
        $(presenter.modelViewer).attr("poster", presenter.configuration.poster);
        $(presenter.modelViewer).attr("skybox-image", presenter.configuration.skyboxImage);
        $(presenter.modelViewer).attr("environment-image", presenter.configuration.environmentImage);
        $(presenter.modelViewer).attr("shadow-intensity", presenter.configuration.shadowIntensity);
        $(presenter.modelViewer).attr("shadow-softness", presenter.configuration.shadowSoftness);
        $(presenter.modelViewer).attr("alt", presenter.configuration.altText);

        presenter.addAttributesFromModel();
    };

    presenter.addAttributesFromModel = function () {
        if (!presenter.configuration.additionalAttributes) {
            return;
        }

        const attributes = presenter.configuration.additionalAttributes;

        Object.keys(attributes).forEach(key => {
            $(presenter.modelViewer).attr(key, attributes[key]);
        });
    };

    presenter.setAnnotations = function () {
        $(presenter.modelViewer).append(presenter.configuration.annotations);
        presenter.configuration.labelsEnabledOnStart ? presenter.showAnnotations() : presenter.hideAnnotations();
        presenter.areAnnotationsVisibleOnStart = presenter.annotationsVisibility === 'visible';
    };

    presenter.setAutoRotation = function () {
        if (presenter.configuration.autoRotate) {
            $(presenter.modelViewer).attr("auto-rotate", true);
        }
    };

    presenter.setInteractionPrompt = function () {
        presenter.configuration.interactionPrompt ? $(presenter.modelViewer).attr("interaction-prompt", "auto") : $(presenter.modelViewer).attr("interaction-prompt", "none");
    };

    presenter.handleButtons = function () {
        presenter.labelsButton = presenter.$view.find(".labelsButton").get(0);
        presenter.copyButton = presenter.$view.find(".copyButton").get(0);
        presenter.copyMessage = presenter.$view.find(".copyMessage").get(0);

        presenter.handleDisplayingButtons();

        presenter.configuration.labelsEnabledOnStart ? $(presenter.labelsButton).addClass("labelsButton-selected") : $(presenter.labelsButton).removeClass("labelsButton-selected");

        $(presenter.labelsButton).on("click", function (e) {
            $(presenter.labelsButton).toggleClass("labelsButton-selected");
            $(presenter.labelsButton).hasClass("labelsButton-selected") ? presenter.showAnnotations() : presenter.hideAnnotations();
        });
    };

    presenter.handleCopyright = function () {
        const copyText = '<div class="copyContainer">'+presenter.configuration.copyInfo+'</div>';
        $(presenter.copyMessage).append(copyText);

        presenter.copyContainer = $(presenter.copyMessage).find(".copyContainer").get(0);
        const link = presenter.copyContainer.querySelector('a');
        if (link) {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                window.open(link.getAttribute('href'), '_blank');
            });
        }

        $( presenter.copyButton ).on( "click", function(e) {
            $(presenter.copyButton).toggleClass("copyButton-selected");
            $(presenter.copyMessage).toggleClass("copyMessage-visible");
        });
    };

    presenter.handleDisplayingButtons = function () {
        if(presenter.configuration.annotations === "") {
            $( presenter.labelsButton ).addClass("hidden");
        }

        if( presenter.configuration.copyInfo === "") {
            $( presenter.copyButton ).addClass("hidden");
        }
    };
    
    presenter.disableEvents = function () {
        $(presenter.modelViewer).css('pointer-events', 'none');
    };

    presenter.setScale = function(scale){
        presenter.modelViewer.scale = scale+" "+scale+" "+scale;
    };

    presenter.showAnnotations = function() {
        if (!presenter.configuration.isVisible) { return; }
        presenter.setAnnotationsVisibility("visible");
        $(presenter.labelsButton).addClass("labelsButton-selected");
    };

    presenter.hideAnnotations = function(){
        presenter.setAnnotationsVisibility("hidden");
        $(presenter.labelsButton).removeClass("labelsButton-selected");
    };

    presenter.setAnnotationsVisibility = function(value) {
        $(presenter.modelViewer).find(".Hotspot").css("visibility", value);
        presenter.annotationsVisibility = value;
    };

    presenter.getAnnotationsVisibility = function(){
        return presenter.annotationsVisibility;
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'showAnnotations': presenter.showAnnotations,
            'hideAnnotations': presenter.hideAnnotations,
            'getAnnotationsVisibility': presenter.getAnnotationsVisibility,
            'setScale': presenter.setScale
        };
        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setShowErrorsMode = function() {};

    presenter.setWorkMode = function() {};

    presenter.reset = function () {
        if (presenter.isVisibleOnStart !== presenter.configuration.isVisible) {
            presenter.isVisibleOnStart ? presenter.show() : presenter.hide();
        }

        // set annotations visibility to default
        presenter.areAnnotationsVisibleOnStart ? presenter.showAnnotations() : presenter.hideAnnotations();

        if ($(presenter.copyButton).hasClass("copyButton-selected")) {
            $(presenter.copyButton).removeClass("copyButton-selected");
            $(presenter.copyMessage).removeClass("copyMessage-visible");
        }

        // handle animation
        presenter.setAnimationToDefault();
    };

    presenter.getErrorCount = function(){
        return 0;
    };

    presenter.getMaxScore = function(){
        return 0;
    };

    presenter.getScore = function(){
        return 0;
    };

    presenter.changeAnimation = function(animation) {
        $(presenter.modelViewer).attr("animation-name", animation);
    };

    presenter.play = function(repetitions, pingpong) {
        presenter.modelViewer.play(repetitions, pingpong);
    };

    presenter.pause = function() {
        presenter.modelViewer.pause();
    };

    presenter.listAnimations = function() {
        return presenter.modelViewer.availableAnimations;
    };

    presenter.jumpTo = function(time) {
        presenter.modelViewer.currentTime = time;
    };

    presenter.isPaused = function() {
        return presenter.modelViewer.paused;
    };

    presenter.animationDuration = function() {
        return presenter.modelViewer.duration;
    };

    presenter.changeSpeed = function(speed) {
        presenter.modelViewer.timeScale = speed;
    };

    presenter.userPrompt = function(value) {
        $(presenter.modelViewer).attr("interaction-prompt", value);
    };

    presenter.currentTime = function() {
        return presenter.modelViewer.currentTime;
    };

    presenter.getState = function() {
        return JSON.stringify({
            annotationsVisibility: presenter.annotationsVisibility,
            isVisible: presenter.configuration.isVisible,
            isPlaying: !presenter.isPaused(),
            selectedAnimation: $(presenter.modelViewer).attr("animation-name"),
            animationTime: presenter.modelViewer.currentTime
        });
    };

    presenter.setState = function(stateString){
        if (ModelValidationUtils.isStringEmpty(stateString)) return;

        var state = JSON.parse(stateString);
        presenter.annotationsVisibility = state.annotationsVisibility;

        presenter.annotationsVisibility === "visible" ? presenter.showAnnotations() : presenter.hideAnnotations();

        if (state.isVisible) {
            presenter.show();
        } else {
            presenter.hide();
        }

        presenter.handleAnimationState(state);
    };

    presenter.handleAnimationState = function (state) {
        $(presenter.modelViewer).attr("animation-name", state.selectedAnimation);

        setTimeout(function () {
            state.isPlaying ? presenter.play() : presenter.pause();
            presenter.jumpTo(state.animationTime);
        }, 100);
    };

    presenter.show = function() {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
        if (presenter.annotationsVisibility === "visible") {
            presenter.showAnnotations();
        }
    };

    presenter.hide = function() {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
        $(presenter.modelViewer).find(".Hotspot").css("visibility", "hidden");
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.setAnimationToDefault = function () {
        const animations = presenter.listAnimations();
        const userSelectedAnimations = presenter.getUserSelectedAnimation();
        const isAutoplay = presenter.getAutoplayStatus();
        if (userSelectedAnimations) {
            presenter.changeAnimation(userSelectedAnimations);
        } else if (animations.length) {
            presenter.changeAnimation(animations[0]);
        }

        presenter.jumpTo(0);

        if (isAutoplay) {
            presenter.modelViewer.play();
        } else {
            presenter.pause();
        }
    };

    presenter.getUserSelectedAnimation = function () {
        if (presenter.configuration.additionalAttributes && presenter.configuration.additionalAttributes.hasOwnProperty('animation-name')) {
            return presenter.configuration.additionalAttributes['animation-name'];
        }
    };

    presenter.getAutoplayStatus = function () {
        if (presenter.configuration.additionalAttributes && presenter.configuration.additionalAttributes.hasOwnProperty('autoplay')) {
            return presenter.configuration.additionalAttributes['autoplay'];
        }

        return false;
    };

    function showErrorMessage() {
        presenter.$view.addClass('error');
        presenter.$view.html("Additional Attributes must be in JSON format.");
    }

    return presenter;
}