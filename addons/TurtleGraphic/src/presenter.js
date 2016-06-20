function AddonTurtleGraphic_create () {
    var presenter = function () {};

    presenter.configuration = {
        turtle: null,
        logoInterpreter: null,
        isNotActivity: null,
        correctCode: null,
        copiedCanvas: null,
        correctTurtle: null,
        correctLogoInterpreter: null
    };

    presenter.$view = null;

    presenter.run = function(view, model) {
        presenter.runLogic(view, model, false);
    };

    presenter.createPreview = function (view, model) {
        presenter.runLogic(view, model, true);
    };

    presenter.runLogic = function (view, model, isPreview) {
        if (isPreview) {
            $(view).find(".TurtleGraphic-wrapper").addClass("preview");
            return;
        }

        presenter.configuration = $.extend(presenter.configuration, presenter.validateModel(model));

        if (!presenter.configuration.isValid) {
            return;
        }

        presenter.$view = $(view);
        presenter.configuration.copiedCanvas = presenter.$view.clone();
        presenter.setDrawingArea(presenter.$view);

        presenter.setCorrectDrawingArea(presenter.configuration.copiedCanvas);
        presenter.$view.find('.correct-scene').append(presenter.configuration.copiedCanvas);


        presenter.configuration.correctLogoInterpreter.run('cs');
        presenter.configuration.correctLogoInterpreter.run(presenter.configuration.correctCode);
        var correct_canvas_element = presenter.configuration.copiedCanvas.find(".sandbox")[0];
        var correct_turtle_element = presenter.configuration.copiedCanvas.find(".turtle")[0];

        presenter.correct_canvas_data = correct_canvas_element.toDataURL();
        presenter.correct_turtle_data = correct_turtle_element.toDataURL();
    };

    presenter.validateModel = function (model) {
        var parsedCorrectCode = presenter.validateCorrectCode(model);

        return {
            isValid: true,
            isNotActivity: ModelValidationUtils.validateBoolean(model["isNotActivity"]),
            correctCode: parsedCorrectCode.value
        };
    };

    presenter.validateCorrectCode = function (model) {
        var code = model["correctCode"].trim();

        if (code == "") {
            code = null;
        }

        return {
            isValid: true,
            value: code
        };
    };

    presenter.setDrawingArea = function ($view) {
        var logo = presenter.initLogoOnCanvas($view);

        presenter.configuration.turtle = logo.turtle;
        presenter.configuration.logoInterpreter = logo.logo;
    };

    presenter.setCorrectDrawingArea = function ($view) {
        var logo = presenter.initLogoOnCanvas($view);

        presenter.configuration.correctTurtle = logo.turtle;
        presenter.configuration.correctLogoInterpreter = logo.logo;
    };

    presenter.initLogoOnCanvas = function ($view) {
        var canvas_element = $view.find(".sandbox");
        var canvas_ctx = canvas_element[0].getContext('2d');
        var turtle_element = $view.find(".turtle");
        var turtle_ctx = turtle_element[0].getContext('2d');

        canvas_element.attr("width", $view.width());
        canvas_element.attr("height", $view.height());
        turtle_element.attr("width", $view.width());
        turtle_element.attr("height", $view.height());

        var turtle = new CanvasTurtle(
            canvas_ctx,
            turtle_ctx,
            canvas_element.width, canvas_element.height);

        var logo = new LogoInterpreter(turtle);
        turtle.resize($view.width(), $view.height());
        logo.run('cs');

        return {
            "logo": logo,
            "turtle": turtle
        };
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'execute': presenter.executeCommandFunction
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.executeCommandFunction = function (params) {
        presenter.execute(params[0]);
    };

    presenter.execute = function (code) {
        console.log(code);
        console.log(presenter.configuration.logoInterpreter);
        if (presenter.configuration.logoInterpreter !== null) {
            presenter.configuration.logoInterpreter.run(code);
        }
    };

    presenter.getScore = function () {
        var canvas_element = presenter.$view.find(".sandbox")[0];
        var turtle_element = presenter.$view.find(".turtle")[0];

        var user_canvas_data = canvas_element.toDataURL();
        var user_turtle_data = turtle_element.toDataURL();
        console.log(user_canvas_data);
        console.log(user_turtle_data);
        console.log(presenter.correct_canvas_data);
        console.log(presenter.correct_turtle_data);
        console.log(presenter.correct_canvas_data === user_canvas_data);
        console.log(presenter.correct_turtle_data === user_turtle_data);
        if (presenter.configuration.isNotActivity) return 0;
        return 1;
    };

    presenter.getMaxScore = function () {
        if (presenter.configuration.isNotActivity) return 0;
        return 1;
    };
    
    return presenter;
}
