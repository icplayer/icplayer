function AddonViewer_3D_create(){
    var presenter = function () {};

    presenter.RENDER_MODES = {
        'Smooth': 'SMOOTH',
        'Points': 'POINTS',
        'Wireframe': 'WIREFRAME',
        'Flat': 'FLAT',
        DEFAULT: 'Smooth'
    };

    presenter.ERROR_CODES = {
        'ERR_01': 'Missing OBJ file!',
        'ERR_02': 'Invalid rotation values!',
        'ERR_03': 'Invalid model color!',
        'ERR_04': 'Invalid background color values!'
    };

    presenter.run = function (view, model) {
        presenter.presenterLogic(view, model);
    };

    presenter.createPreview = function (view, model) {
        presenter.presenterLogic(view, model);
    };

    presenter.setCanvasDimensions = function (width, height) {
        presenter.$view.find('.3d-viewer-canvas').attr({
            width: width,
            height: height
        });
    };

    presenter.parseRotation = function (strRotation) {
        var rotation, parsedRotation;

        if (ModelValidationUtils.isStringEmpty(strRotation)) {
            rotation = 0;
        } else {
            parsedRotation = ModelValidationUtils.validateInteger(strRotation);

            if (!parsedRotation.isValid || parsedRotation.value < 0) {
                return { isValid: false };
            } else {
                rotation = parsedRotation.value;
            }
        }

        return { isValid: true, rotation: rotation };
    };

    presenter.parseInitialRotation = function (model) {
        var strRotationX = model['Initial Rotation X'],
            parsedRotationX = presenter.parseRotation(strRotationX),
            strRotationY = model['Initial Rotation Y'],
            parsedRotationY = presenter.parseRotation(strRotationY),
            strRotationZ = model['Initial Rotation Z'],
            parsedRotationZ = presenter.parseRotation(strRotationZ);

        if (!parsedRotationX.isValid || !parsedRotationY.isValid || !parsedRotationZ.isValid) {
            return { isValid: false };
        }

        return { isValid: true, X: parsedRotationX.rotation, Y: parsedRotationY.rotation, Z: parsedRotationZ.rotation };
    };

    presenter.parseModelColor = function (modelColor) {
        if (ModelValidationUtils.isStringEmpty(modelColor)) {
            return { isValid: true, color: '#EEEEEE' };
        }

        return ModelValidationUtils.validateColor(modelColor, '#EEEEEE');
    };

    presenter.parseBackgroundColors = function (model) {
        var backgroundColor1 = model['Background Color 1'],
            parsedBackgroundColor1,
            backgroundColor2 = model['Background Color 2'],
            parsedBackgroundColor2;

        // Background Color 1
        if (ModelValidationUtils.isStringEmpty(backgroundColor1)) {
            parsedBackgroundColor1 = { color: "#CCCCCC" };
        } else {
            parsedBackgroundColor1 = ModelValidationUtils.validateColor(backgroundColor1, '#CCCCCC');
            if (!parsedBackgroundColor1.isValid) {
                return { isValid: false };
            }
        }

        // Background Color 1
        if (ModelValidationUtils.isStringEmpty(backgroundColor2)) {
            parsedBackgroundColor2 = { color: "#EEEEEE" };
        } else {
            parsedBackgroundColor2 = ModelValidationUtils.validateColor(backgroundColor2, '#EEEEEE');
            if (!parsedBackgroundColor2.isValid) {
                return { isValid: false };
            }
        }

        return {
            isValid: true,
            color1: parsedBackgroundColor1.color,
            color2: parsedBackgroundColor2.color
        };
    };

    presenter.parseModel = function (model) {
        if (ModelValidationUtils.isStringEmpty(model['OBJ File'])) {
            return { isValid: false, errorCode: 'ERR_01' };
        }

        var MTLFile = model['MTL File'];
        if (ModelValidationUtils.isStringEmpty(MTLFile)) {
            MTLFile = '';
        }

        var parsedInitialRotation = presenter.parseInitialRotation(model);
        if (!parsedInitialRotation.isValid) {
            return { isValid: false, errorCode: 'ERR_02' };
        }

        var parsedModelColor = presenter.parseModelColor(model['Model Color']);
        if (!parsedModelColor.isValid) {
            return { isValid: false, errorCode: 'ERR_03' };
        }

        var parsedBackgroundColors = presenter.parseBackgroundColors(model);
        if (!parsedBackgroundColors.isValid) {
            return { isValid: false, errorCode: 'ERR_04' };
        }

        var renderMode = ModelValidationUtils.validateOption(presenter.RENDER_MODES, model['Render Mode']);
        var isVisible = ModelValidationUtils.validateBoolean(model["Is Visible"]);

        return {
            isValid: true,
            addonID: model.ID,
            isVisible: isVisible,
            isCurrentlyVisible: isVisible,
            files: {
                OBJ: model['OBJ File'],
                MTL: MTLFile
            },
            initialRotation: {
                X: parsedInitialRotation.X,
                Y: parsedInitialRotation.Y,
                Z: parsedInitialRotation.Z
            },
            colors: {
                model: parsedModelColor.color,
                background1: parsedBackgroundColors.color1,
                background2: parsedBackgroundColors.color2
            },
            renderMode: renderMode
        };
    };

    presenter.setViewerRenderMode = function (viewer) {
        var renderMode = "smooth";

        switch (presenter.configuration.renderMode) {
            case 'POINTS':
                renderMode = "point";
                break;
            case 'WIREFRAME':
                renderMode = "wireframe";
                break;
            case 'FLAT':
                renderMode = 'flat';
                break;
        }

        viewer.setParameter('RenderMode', renderMode);
    };

    presenter.renderObject = function () {
        var canvas =  presenter.$view.find('.3d-viewer-canvas')[0],
            viewer = new JSC3D.Viewer(canvas);

        presenter.viewer = viewer;
        viewer.setParameter('SceneUrl', presenter.configuration.files.OBJ + '.obj');
        viewer.setParameter('MtlLibUrl', presenter.configuration.files.MTL);
        viewer.setParameter('InitRotationX', presenter.configuration.initialRotation.X);
        viewer.setParameter('InitRotationY', presenter.configuration.initialRotation.Y);
        viewer.setParameter('InitRotationZ', presenter.configuration.initialRotation.Z);
        viewer.setParameter('ModelColor', presenter.configuration.colors.model);
        viewer.setParameter('BackgroundColor1', presenter.configuration.colors.background1);
        viewer.setParameter('BackgroundColor2', presenter.configuration.colors.background2);
        presenter.setViewerRenderMode(viewer);

        viewer.init();

        $.when(viewer.loadPromise).then(function () {
            presenter.isLoaded = true;

            if (!presenter.commandsQueue.isQueueEmpty()) {
                presenter.commandsQueue.executeAllTasks();
            }
        });
    };

    presenter.presenterLogic = function (view, model) {
        presenter.$view = $(view);
        presenter.model = model;
        presenter.commandsQueue = CommandsQueueFactory.create(presenter);
        presenter.isLoaded = false;

        presenter.setCanvasDimensions(model.Width, model.Height);

        presenter.configuration = presenter.parseModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        presenter.setVisibility(presenter.configuration.isVisible);
        presenter.renderObject();
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'reset': presenter.reset,
            'show': presenter.show,
            'hide': presenter.hide,
            'setState': presenter.setStateCommand
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.reset = function () {
        if (!presenter.isLoaded) {
            presenter.commandsQueue.addTask('reset', []);
            return;
        }

        presenter.setVisibility(presenter.configuration.isVisible);
        presenter.configuration.isCurrentlyVisible = presenter.configuration.isVisible;

        presenter.viewer.replaceSceneFromUrl(presenter.configuration.files.OBJ + '.obj');
        presenter.viewer.update();
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = function () {
        if (!presenter.isLoaded) {
            presenter.commandsQueue.addTask('show', []);
            return;
        }

        if (presenter.configuration.isCurrentlyVisible) return;

        presenter.configuration.isCurrentlyVisible = true;
        presenter.setVisibility(true);
    };

    presenter.hide = function () {
        if (!presenter.isLoaded) {
            presenter.commandsQueue.addTask('hide', []);
            return;
        }

        if (!presenter.configuration.isCurrentlyVisible) return;

        presenter.configuration.isCurrentlyVisible = false;
        presenter.setVisibility(false);
    };

    presenter.getState = function () {
        if (!presenter.isLoaded) return;

        return JSON.stringify({
            isVisible: presenter.configuration.isCurrentlyVisible
        });
    };

    presenter.setStateCommand = function (params) {
        presenter.setState(params[0]);
    };

    presenter.setState = function (state) {
        if (!state) return;

        if (!presenter.isLoaded) {
            presenter.commandsQueue.addTask('setState', [state]);
            return;
        }

        var parsedState = JSON.parse(state),
            shouldBeVisible = parsedState.isVisible;

        if (shouldBeVisible) {
            presenter.show();
        } else {
            presenter.hide();
        }
    };

    return presenter;
}