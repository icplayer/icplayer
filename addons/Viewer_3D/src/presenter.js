function AddonViewer_3D_create(){
    var deferredSyncQueue = window.DecoratorUtils.DeferredSyncQueue(deferredQueueDecoratorChecker);

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

    function deferredQueueDecoratorChecker () {
        return presenter.isLoaded;
    }

    presenter.getDeferredQueueVariable = function () {
        return deferredSyncQueue;
    };

    presenter.run = function (view, model) {
        presenter.presenterLogic(view, model);
        presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.createPreview = function (view, model) {
        presenter.presenterLogic(view, model);
        presenter.setVisibility(true);
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
            renderMode: renderMode,
            quality: 'standard',
            queues: {
                X: {
                    name: model.ID + "_X",
                    isActive: false,
                    delay: 0,
                    angle: 0
                },
                Y: {
                    name: model.ID + "_Y",
                    isActive: false,
                    delay: 0,
                    angle: 0
                },
                Z: {
                    name: model.ID + "_Z",
                    isActive: false,
                    delay: 0,
                    angle: 0
                }
            }
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

            deferredSyncQueue.resolve()
        });
    };

    presenter.presenterLogic = function (view, model) {
        presenter.$view = $(view);
        presenter.model = model;
        presenter.isLoaded = false;

        presenter.setCanvasDimensions(model.Width, model.Height);

        presenter.configuration = presenter.parseModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        presenter.renderObject();

        presenter.$view.click(function(e){
            e.stopPropagation();
        });
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'reset': presenter.reset,
            'show': presenter.show,
            'hide': presenter.hide,
            'rotateX': presenter.rotateXCommand,
            'rotateY': presenter.rotateYCommand,
            'rotateZ': presenter.rotateZCommand,
            'setState': presenter.setStateCommand,
            'setQuality': presenter.setQualityCommand,
            'startRotationX': presenter.startRotationXCommand,
            'stopRotationX': presenter.stopRotationX,
            'startRotationY': presenter.startRotationYCommand,
            'stopRotationY': presenter.stopRotationY,
            'startRotationZ': presenter.startRotationZCommand,
            'stopRotationZ': presenter.stopRotationZ,
            'stopAllRotations': presenter.stopAllRotations
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.rotateObject = function (angleX, angleY, angleZ) {
        presenter.viewer.rotate(angleX, angleY, angleZ);
        presenter.viewer.update();
    };

    presenter.validateAngle = function (angle) {
        var validatedAngle = ModelValidationUtils.validateFloat(angle);

        if (!validatedAngle.isValid) return { isValid: false };
        if (validatedAngle.value < 0) return { isValid: false };

        return { isValid: true, value: validatedAngle.value };
    };

    presenter.rotateX = deferredSyncQueue.decorate(function (angle) {
        var validatedAngle = presenter.validateAngle(angle);
        if (!validatedAngle.isValid) return;

        presenter.rotateObject(validatedAngle.value, 0, 0);
    });

    presenter.rotateXCommand = function (params) {
        presenter.rotateX(params[0]);
    };

    presenter.rotateY = deferredSyncQueue.decorate(function (angle) {
        var validatedAngle = presenter.validateAngle(angle);
        if (!validatedAngle.isValid) return;

        presenter.rotateObject(0, validatedAngle.value, 0);
    });

    presenter.rotateYCommand = function (params) {
        presenter.rotateY(params[0]);
    };

    presenter.rotateZ = deferredSyncQueue.decorate(function (angle) {
        var validatedAngle = presenter.validateAngle(angle);
        if (!validatedAngle.isValid) return;

        presenter.rotateObject(0, 0, validatedAngle.value);
    });

    presenter.rotateZCommand = function (params) {
        presenter.rotateZ(params[0]);
    };

    presenter.setQuality = deferredSyncQueue.decorate(function (quality) {
        if (ModelValidationUtils.isStringEmpty(quality)) return;
        if (quality !== 'low' && quality !== 'standard' && quality !== 'high') return;
        if (presenter.configuration.quality === quality) return;

        presenter.configuration.quality = quality;
        presenter.viewer.setDefinition(quality);
        presenter.viewer.update();
    });

    presenter.setQualityCommand = function (params) {
        presenter.setQuality(params[0]);
    };

    presenter.reset = deferredSyncQueue.decorate(function () {
        presenter.stopAllRotations();
        presenter.setQuality('standard');

        presenter.setVisibility(presenter.configuration.isVisible);
        presenter.configuration.isCurrentlyVisible = presenter.configuration.isVisible;

        presenter.viewer.replaceSceneFromUrl(presenter.configuration.files.OBJ + '.obj');
        presenter.viewer.update();
    });

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.show = deferredSyncQueue.decorate(function () {
        if (presenter.configuration.isCurrentlyVisible) return;

        presenter.configuration.isCurrentlyVisible = true;
        presenter.setVisibility(true);
    });

    presenter.hide = deferredSyncQueue.decorate(function () {
        if (!presenter.configuration.isCurrentlyVisible) return;

        presenter.configuration.isCurrentlyVisible = false;
        presenter.setVisibility(false);
    });

    presenter.getState = function () {
        if (!presenter.isLoaded) return;

        return JSON.stringify({
            isVisible: presenter.configuration.isCurrentlyVisible
        });
    };

    presenter.setStateCommand = function (params) {
        presenter.setState(params[0]);
    };

    presenter.setState = deferredSyncQueue.decorate(function (state) {
        if (!state) return;

        var parsedState = JSON.parse(state);

        if (parsedState.isVisible) {
            presenter.show();
        } else {
            presenter.hide();
        }
    });

    presenter.validateDelay = function (delay) {
        var validatedDelay = ModelValidationUtils.validateInteger(delay);

        if (!validatedDelay.isValid) return { isValid: false };
        if (validatedDelay.value < 0) return { isValid: false };

        return { isValid: true, value: validatedDelay.value };
    };

    // Generic commands

    presenter.startRotation = deferredSyncQueue.decorate(function (axis, angle, delay) {
        var validatedAngle = presenter.validateAngle(angle);
        if (!validatedAngle.isValid) return;

        var validatedDelay = presenter.validateDelay(delay);
        if (!validatedDelay.isValid) return;

        if (presenter.configuration.queues[axis].isActive) {
            if (validatedDelay.value == 0) {
                presenter['stopRotation' + axis]();
                return;
            }

            presenter.configuration.queues[axis].delay = validatedDelay.value;
            presenter.configuration.queues[axis].angle = validatedAngle.value;
        } else {
            presenter.configuration.queues[axis].isActive = true;
            presenter.configuration.queues[axis].delay = validatedDelay.value;
            presenter.configuration.queues[axis].angle = validatedAngle.value;

            presenter['startRotation' + axis + 'Queue']();
        }
    });

    presenter.startRotationQueue = function (axis) {
        var queue = presenter.configuration.queues[axis].name,
            delay = presenter.configuration.queues[axis].delay;

        $.doTimeout(queue, delay, function () {
            var angle = presenter.configuration.queues[axis].angle,
                angleX = 0, angleY = 0, angleZ = 0;

            switch (axis) {
                case 'X':
                    angleX = angle;
                    break;
                case 'Y':
                    angleY = angle;
                    break;
                case 'Z':
                    angleZ = angle;
                    break;
            }

            presenter.rotateObject(angleX, angleY, angleZ);

            return true; // continue callback call
        });
    };

    presenter.stopRotation = deferredSyncQueue.decorate(function (axis) {
        if (!presenter.configuration.queues[axis].isActive) return;

        presenter.configuration.queues[axis].isActive = false;
        presenter.configuration.queues[axis].angle = 0;
        presenter.configuration.queues[axis].delay = 0;

        presenter['stopRotation' + axis + 'Queue']();
    });

    presenter.stopRotationQueue = function (axis) {
        var queue = presenter.configuration.queues[axis].name;

        $.doTimeout(queue);
    };

    // X-axis specific rotation commands

    presenter.startRotationX = function (angle, delay) {
        presenter.startRotation('X', angle, delay);
    };

    presenter.startRotationXCommand = function (params) {
        presenter.startRotationX(params[0], params[1]);
    };

    presenter.startRotationXQueue = function () {
        presenter.startRotationQueue('X');
    };

    presenter.stopRotationX = function () {
        presenter.stopRotation('X');
    };

    presenter.stopRotationXQueue = function () {
        presenter.startRotationQueue('X');
    };

    // Y-axis specific rotation commands

    presenter.startRotationY = function (angle, delay) {
        presenter.startRotation('Y', angle, delay);
    };

    presenter.startRotationYCommand = function (params) {
        presenter.startRotationY(params[0], params[1]);
    };

    presenter.startRotationYQueue = function () {
        presenter.startRotationQueue('Y');
    };

    presenter.stopRotationY = function () {
        presenter.stopRotation('Y');
    };

    presenter.stopRotationYQueue = function () {
        presenter.startRotationQueue('Y');
    };

    // Z-axis specific rotation commands

    presenter.startRotationZ = function (angle, delay) {
        presenter.startRotation('Z', angle, delay);
    };

    presenter.startRotationZCommand = function (params) {
        presenter.startRotationZ(params[0], params[1]);
    };

    presenter.startRotationZQueue = function () {
        presenter.startRotationQueue('Z');
    };

    presenter.stopRotationZ = function () {
        presenter.stopRotation('Z');
    };

    presenter.stopRotationZQueue = function () {
        presenter.startRotationQueue('Z');
    };

    presenter.stopAllRotations = function () {
        presenter.stopRotationX();
        presenter.stopRotationY();
        presenter.stopRotationZ();
    };

    return presenter;
}