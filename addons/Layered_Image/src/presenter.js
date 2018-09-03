function AddonLayered_Image_create() {
    var presenter = function () {};
    var DOMElements = {};
    presenter.flags = [];
    presenter.savedState = "";
    var elementsDimensions = {};
    var deferredSyncQueue = window.DecoratorUtils.DeferredSyncQueue(deferredQueueDecoratorChecker);

    presenter.ERROR_CODES = {
        BI_01: "Base image wasn't set or was set incorrectly!",
        L_01: "At least one layer must be set and no blank layers can be left!"
    };

    presenter.IMAGE_SIZE = {
        ORIGINAL: 0,
        SCALED: 1,
        STRETCHED: 2
    };

    function deferredQueueDecoratorChecker () {
        return presenter.imagesAreLoaded || presenter.diplayingLayers;
    }

    function setDOMElementsHrefAndSelectors(view) {
        DOMElements.$view = $(view);
        DOMElements.wrapper = $(DOMElements.$view.find('.layeredimage-wrapper:first')[0]);
        DOMElements.loading = $(DOMElements.$view.find('.layeredimage-loading:first')[0]);
        DOMElements.baseImage = $(DOMElements.wrapper.find('.layeredimage-image:first')[0]);
    }

    function setElementsDimensions(width, height) {
        var wrapperDimensions = DOMOperationsUtils.getOuterDimensions(DOMElements.wrapper);
        var wrapperDistances = DOMOperationsUtils.calculateOuterDistances(wrapperDimensions);
        var wrapperWidth = width - wrapperDistances.horizontal;
        var wrapperHeight = height - wrapperDistances.vertical;

        $(DOMElements.wrapper).css({
            width: wrapperWidth,
            height: wrapperHeight
        });

        var imageDimensions = DOMOperationsUtils.getOuterDimensions(DOMElements.baseImage);
        var imageDistances = DOMOperationsUtils.calculateOuterDistances(imageDimensions);
        var imageWidth = width - imageDistances.horizontal;
        var imageHeight = height - imageDistances.vertical;

        elementsDimensions = {
            wrapper: {
                width: wrapperWidth,
                height: wrapperHeight
            },
            image: {
                width: imageWidth,
                height: imageHeight
            }
        };
    }

    // Calculate scale for image containing element depending on frame aspect ratio
    function calculateContainerDimensions(imageWidth, imageHeight, containerWidth, containerHeight) {
        var imageRatio = imageWidth / imageHeight;
        var containerRatio = containerWidth / containerHeight;

        var horizontal;
        var vertical;

        if (imageRatio >= containerRatio) {
            horizontal = containerWidth;
            vertical = containerWidth / imageRatio;
        } else {
            vertical = containerHeight;
            horizontal = containerHeight * imageRatio;
        }

        return {
            horizontal: horizontal,
            vertical: vertical
        };
    }

    // This function returns string containing CSS declaration of elements
    // background image size in percentage measure
    function calculateBackgroundSize(size) {
        var cssValue;

        switch (size) {
            case presenter.IMAGE_SIZE.SCALED:
            case presenter.IMAGE_SIZE.STRETCHED:
                cssValue = '100% 100%';
                break;
            default:
                cssValue = '';
        }

        return cssValue;
    }

    function appendImage(image, show) {
        var imageElement = document.createElement('div');
        $(imageElement).css('backgroundImage', 'url(' + image + ')');
        $(imageElement).addClass('layeredimage-image');
        $(DOMElements.wrapper).append(imageElement);

        if (!show) {
            $(imageElement).hide();
        }
    }

    function calculateImageDimensions(image) {
        $(DOMElements.wrapper).append(image);

        $(image).show();
        var imageWidth = $(image).width();
        var imageHeight = $(image).height();
        $(image).hide();

        $(image).remove();
        return { width: imageWidth, height: imageHeight };
    }

    function preloadImages(isPreview) {
        showLoadingScreen();

        var images = [presenter.configuration.baseImage];
        for (var i = 0; i < presenter.configuration.layers.length; i++) {
            images.push(presenter.configuration.layers[i].image);
        }

        $.imgpreload(images, {
            all: function() {
                var imageDimensions = calculateImageDimensions(this[0]);
                loadImages(imageDimensions.width, imageDimensions.height, isPreview);
            }
        });
    }

    function loadImages(imageWidth, imageHeight, isPreview) {
        appendImage(presenter.configuration.baseImage, true);
        DOMElements.baseImage = $(DOMElements.$view.find('.layeredimage-image:first')[0]);

        var containerWidth = elementsDimensions.wrapper.width;
        var containerHeight = elementsDimensions.wrapper.height;
        var containerDimensions = calculateContainerDimensions(imageWidth, imageHeight, containerWidth, containerHeight);
        var backgroundSize = calculateBackgroundSize(presenter.configuration.imageSize);

        var isScaledMode = presenter.configuration.imageSize === presenter.IMAGE_SIZE.SCALED;
        $(DOMElements.baseImage).css({
            width: isScaledMode ? containerDimensions.horizontal + 'px' : containerWidth + 'px',
            height: isScaledMode ? containerDimensions.vertical + 'px' : containerHeight + 'px'
        });
        if (backgroundSize) {
            $(DOMElements.baseImage).css('background-size', backgroundSize);
        }

        for (var i = 0; i < presenter.configuration.layers.length; i++) {
            var showLayer = isPreview ? true : presenter.configuration.layers[i].showAtStart;
            if(!presenter.savedState) {
                setFlag(i, presenter.configuration.layers[i].showAtStart);
            }
            var imageElement = document.createElement('div');
            $(imageElement).css('backgroundImage', 'url(' + presenter.configuration.layers[i].image + ')');
            $(imageElement).addClass('layeredimage-image');
            $(imageElement).attr('data-index', (i+1));
            $(DOMElements.wrapper).append(imageElement);

            if (!showLayer) {
                $(imageElement).hide();
            }

            var layer = DOMElements.wrapper.find('div[data-index="'+ (i+1) +'"]');
            $(layer).css({
                width: isScaledMode ? containerDimensions.horizontal + 'px' : containerWidth + 'px',
                height: isScaledMode ? containerDimensions.vertical + 'px' : containerHeight + 'px'
            });
            if (backgroundSize) {
                $(layer).css('background-size', backgroundSize);
            }
        }

        hideLoadingScreen();

        presenter.imageLoadedDeferred.resolve();

        if(!isPreview){
            if (!presenter.imagesAreLoaded && !presenter.savedState) {
                executeTasks();
            }
        }
    }

    function executeTasks () {
        presenter.imagesAreLoaded = true;

        deferredSyncQueue.resolve();
    }

    function setFlag(index, value) {
        presenter.flags[index] = value;
    }

    function getFlag(index) {
        return presenter.flags[index];
    }

    function prepareLoadingScreen(containerWidth, containerHeight) {
        $(DOMElements.loading).css({
            top: ((containerHeight - $(DOMElements.loading).height()) / 2) + 'px',
            left: ((containerWidth - $(DOMElements.loading).width()) / 2) + 'px'
        });
    }

    function showLoadingScreen() {
        $(DOMElements.loading).show();
    }

    function hideLoadingScreen() {
        $(DOMElements.loading).hide();
    }

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
    };

    function presenterLogic(view, model, isPreview) {
        presenter.imageLoadedDeferred = new jQuery.Deferred();
        presenter.imageLoaded = presenter.imageLoadedDeferred.promise();

        var width = model.Width;
        var height = model.Height;

        setDOMElementsHrefAndSelectors(view);

        if (!isPreview) {
            var loadingSrc = DOMOperationsUtils.getResourceFullPath(presenter.playerController, "media/loading.gif");
            if (loadingSrc) $(DOMElements.loading).attr('src', loadingSrc);
        }

        setElementsDimensions(width, height);
        $(DOMElements.baseImage).remove();

        presenter.configuration = presenter.validateModel(model);

        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(DOMElements.$view, presenter.ERROR_CODES, presenter.configuration.errorCode);
        } else {
            prepareLoadingScreen(width, height);
            preloadImages(isPreview);
            if (!isPreview && !presenter.configuration.isVisibleByDefault) {
                presenter.hide();
            }
        }
    }

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model, true);
    };

    presenter.run = function(view, model) {
        presenter.imagesAreLoaded = false;
        presenterLogic(view, model, false);
    };

    presenter.reset = function(){
        hideAllLayers();
        displayVisibleLayers(true);
        presenter.showLayer(0);

        presenter.configuration.isVisible = presenter.configuration.isVisibleByDefault;
        presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.getState = function() {
        return JSON.stringify({
            isVisible: presenter.configuration.isVisible,
            flags: presenter.flags
        });
    };

    presenter.setStateCallback = function() {
        displayVisibleLayers(false);

        if (presenter.isVisbleSaved) {
            presenter.show();
        } else {
            presenter.hide();
        }

        if (!presenter.imagesAreLoaded) {
            executeTasks();
        }
    };

    presenter.setState = function(state) {
        this.savedState = JSON.parse(state);

        presenter.isVisbleSaved = this.savedState.isVisible;

        for (var i = 0; i < this.savedState.flags.length; i++) {
            presenter.flags[i] = this.savedState.flags[i];
        }

        $.when(presenter.imageLoaded).then(presenter.setStateCallback);
    };

    presenter.setVisibility = function(isVisible) {
        DOMElements.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function() {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.hide = function() {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'showLayer': presenter.showLayerCommand,
            'hideLayer': presenter.hideLayerCommand,
            'toggleLayer': presenter.toggleLayerCommand,
            'show': presenter.show,
            'hide': presenter.hide
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    function displayVisibleLayers(displayLayersWithShowAtStart) {
        presenter.diplayingLayers = true;
        for (var i = 0; i < presenter.configuration.layers.length; i++) {
            var layerShouldBeDisplayed = displayLayersWithShowAtStart ? presenter.configuration.layers[i].showAtStart : presenter.flags[i];
            if(layerShouldBeDisplayed) {
                presenter.showLayer(i + 1);
            } else {
                presenter.hideLayer(i + 1);
            }
        }
        presenter.displayingLayers = false;
    }

    presenter.showLayer = deferredSyncQueue.decorate(function(index) {
        if (isNaN(index) || index < 1 || index > presenter.configuration.layers.length) {
            return;
        }

        setFlag(index - 1, true);

        var layer = DOMElements.wrapper.find('div[data-index="'+ index +'"]'),
            $layer = $(layer);

        $layer.show();
        if(presenter.configuration.animatedGifRefresh){
            var backgroundImageUrl = $layer.css('background-image'),
                backgroundImage = backgroundImageUrl.substring(backgroundImageUrl.indexOf('url(') + 'url('.length, backgroundImageUrl.indexOf(')')).replace(/"/g, ""),
                timestamp = new Date().getTime();

            if(backgroundImage.indexOf('?') !== -1) {
                backgroundImage = backgroundImage.substring(0, backgroundImage.indexOf('?'));
            }

            backgroundImage = backgroundImage + '?' + timestamp;
            $layer.css('background-image', '');
            $layer.css('background-image', 'url('+ backgroundImage +')');
        }
    });

    presenter.showLayerCommand = function (params) {
        presenter.showLayer(parseInt(params[0], 10));
    };

    presenter.hideLayer = deferredSyncQueue.decorate(function(index) {
        if (isNaN(index) || index < 1 || index > presenter.configuration.layers.length) {
            return;
        }

        setFlag(index - 1, false);

        var layer = DOMElements.wrapper.find('div[data-index="'+ index +'"]');
        $(layer).hide();
    });

    presenter.hideLayerCommand = function (params) {
        presenter.hideLayer(parseInt(params[0], 10));
    };

    presenter.toggleLayer = deferredSyncQueue.decorate(function(index) {
        if (isNaN(index) || index < 1 || index > presenter.configuration.layers.length) {
            return;
        }

        if (getFlag(index - 1)) {
            this.hideLayer(index);
        } else {
            this.showLayer(index);
        }
    });

    presenter.toggleLayerCommand = function (params) {
        presenter.toggleLayer(parseInt(params[0], 10));
    };

    function hideAllLayers() {
        for (var i = 1; i <= presenter.configuration.layers.length; i++) {
            presenter.hideLayer(i);
        }
    }

    presenter.validateImage = function(image) {
        if (ModelValidationUtils.isStringEmpty(image)) return { isError: true };

        return { isError: false, image: image };
    };

    presenter.validateImageList = function (list) {
        var imageList = [];

        for (var i = 0; i < list.length; i++) {
            var image = list[i].Image;
            if (presenter.validateImage(image).isError) {
                return { isError: true, errorCode: "IL_01" };
            }

            var showAtStart = presenter.showAtStart(list[i]["Show at start"]);
            imageList.push({
                image: image,
                showAtStart: showAtStart
            });
        }

        return { isError: false, list: imageList };
    };

    presenter.validateImageSize = function(imageSize) {
        var result;

        switch (imageSize) {
            case "Keep aspect ratio":
                result = presenter.IMAGE_SIZE.SCALED;
                break;
            case "Stretch":
                result = presenter.IMAGE_SIZE.STRETCHED;
                break;
            default:
                result = presenter.IMAGE_SIZE.ORIGINAL;
                break;
        }

        return result;
    };

    presenter.showAtStart = function(value) {
        return value === "True" || value === "1";
    };

    presenter.validateModel = function (model) {
        var validatedBaseImage = presenter.validateImage(model["Base image"]);
        if (validatedBaseImage.isError) return { isError: true, errorCode: "BI_01" };

        var validatedLayers = presenter.validateImageList(model.Layers);
        if (validatedLayers.isError) return { isError: true, errorCode: "L_01" };

        return {
            isError: false,
            baseImage: validatedBaseImage.image,
            layers: validatedLayers.list,
            imageSize: presenter.validateImageSize(model["Image size"]),
            isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            isVisibleByDefault: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            animatedGifRefresh: ModelValidationUtils.validateBoolean(model["Animated gif refresh"])
        };
    };

    return presenter;
}