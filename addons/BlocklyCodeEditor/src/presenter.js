/**
 * KNOWN ISSUES:
 *      Toolbox Menu
 *          - when header is on page, the toolbox is moved by header height and there is need to change it top property,
 *          issue due to blockly library have lack of setting toolbox under parent HTML element, instead it places on page
 *
 *          - updatingToolbox do not update toolbox menu element ".blocklyFlyout", after updating toolbox there is need to update
 *          transform translate to width of ".blocklyToolboxDiv"
 */
function AddonBlocklyCodeEditor_create () {
    var presenter = function () {};

    var hasBeenSet = false;

    presenter.configuration = {
        hideRun: null,
        sceneID: null,
        sceneModule: null,
        workspace: null,
        toolboxXML: "",
        addSceneToolbox: false,
        isPreview: false
    };

    function isPreviewDecorator(func) {
        if (!presenter.configuration.isPreview) {
            return func;
        } else {
            return function () {

            };
        }
    }

    presenter.run = function (view, model) {
        presenter.runLogic(view, model, false);
    };

    presenter.createPreview = function (view, model) {
        presenter.runLogic(view, model, true);
    };
    
    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
        presenter.eventBus.addEventListener('PageLoaded', this, true);
    };

    presenter.runLogic = function (view, model, isPreview) {
        presenter.configuration.isPreview = isPreview;
        presenter.configuration = $.extend(presenter.configuration, presenter.validateModel(model));
        presenter.view = view;
        presenter.$view = $(view);
        presenter.$view.find(".editor").css({
            width: presenter.$view.width(),
            height: presenter.$view.height()
        });

        presenter.setRunButton();
        isPreviewDecorator(presenter.connectHandlers)();


        presenter.configuration.workspace = Blockly.inject($(view).find(".editor")[0], {toolbox: presenter.getToolboxXML()});

        presenter.view.addEventListener('DOMNodeRemoved', function onDOMNodeRemoved(ev) {
            if (ev.target === this) {
                presenter.destroy();
            }
        });
    };

    presenter.destroy = function () {
        presenter.view.removeEventListener('DOMNodeRemoved', presenter.destroy);
        presenter.configuration.workspace.dispose();
        presenter.$view.find(".run").off();
        presenter.$view = null;
        presenter.view = null;
        presenter.configuration = null;
    };

    presenter.validateModel = function (model) {
        return {
            isValid: true,
            hideRun: ModelValidationUtils.validateBoolean(model["hideRun"]),
            addSceneToolbox: ModelValidationUtils.validateBoolean(model["addSceneToolbox"]),
            sceneID: model["sceneID"],
            toolboxXML: model["toolbox"]
        };
    };

    presenter.connectHandlers = function() {
        presenter.$view.find(".run").click(function () {
            if (presenter.configuration.sceneModule !== null) {
                var code = Blockly.JavaScript.workspaceToCode(presenter.configuration.workspace);
                presenter.configuration.sceneModule.executeCode(code);
            }
        });
    };

    presenter.setRunButton = function() {
        if (presenter.configuration.hideRun) {
            presenter.$view.find(".run").css({
                "display": "none"
            });
        }
    };
    
    presenter.executeCommand = function(name, params) {
        var commands = {
            'getWorkspaceCode' : presenter.getWorkspaceCode,
        };

        Commands.dispatch(commands, name, params, presenter);
    };
    
    presenter.getWorkspaceCode = function () {
        return Blockly.JavaScript.workspaceToCode(presenter.configuration.workspace);
    };

    presenter.getToolboxXML = function () {
        if (presenter.configuration.isPreview) {
            return presenter.previewToolbox();
        }


        var toolbox = '<xml>';
        // toolbox = StringUtils.format("{0}{1}", toolbox, presenter.getTestingCategoryXML());
        // toolbox = StringUtils.format("{0}{1}", toolbox, presenter.getVariablesCategoryXML());

        toolbox = StringUtils.format("{0}{1}", toolbox, presenter.configuration.toolboxXML);

        if (presenter.configuration.sceneModule !== null
            && presenter.configuration.sceneModule !== undefined
            && presenter.configuration.addSceneToolbox) {
            toolbox = StringUtils.format("{0}{1}", toolbox, presenter.configuration.sceneModule.getToolboxCategoryXML());
        } else if (presenter.configuration.addSceneToolbox) {
            toolbox = StringUtils.format("{0}{1}", toolbox, "<category name=\"Scene\"></category>");
        }

        toolbox = StringUtils.format("{0}{1}", toolbox, "</xml>");

        return toolbox;
    };

    presenter.previewToolbox = function () {
        var toolbox = "";
            toolbox += "<xml>";
            toolbox += "<block type=\"lists_create_with\">";
            toolbox += "<mutation items=\"3\"></mutation>";
            toolbox += "</block>";
            toolbox += "<block type=\"controls_repeat_ext\">";
            toolbox += "<value name=\"TIMES\">";
            toolbox += "<shadow type=\"math_number\">";
            toolbox += "<field name=\"NUM\">10</field>";
            toolbox += "</shadow>";
            toolbox += "</value>";
            toolbox += "</block>";
            toolbox += "<block type=\"math_constant\">";
            toolbox += "<field name=\"CONSTANT\">PI</field>";
            toolbox += "</block>";
            toolbox += "<block type=\"controls_for\">";
            toolbox += "<field name=\"VAR\">i</field>";
            toolbox += "<value name=\"FROM\">";
            toolbox += "<shadow type=\"math_number\">";
            toolbox += "<field name=\"NUM\">1</field>";
            toolbox += "</shadow>";
            toolbox += "</value>";
            toolbox += "<value name=\"TO\">";
            toolbox += "<shadow type=\"math_number\">";
            toolbox += "<field name=\"NUM\">10</field>";
            toolbox += "</shadow>";
            toolbox += "</value>";
            toolbox += "<value name=\"BY\">";
            toolbox += "<shadow type=\"math_number\">";
            toolbox += "<field name=\"NUM\">1</field>";
            toolbox += "</shadow>";
            toolbox += "</value>";
            toolbox += "</block>";
            toolbox += "</xml>";
    
        return toolbox;
    };

    presenter.getTextBlockXML = function() {
        var textBlock = '<block type=\"text\">';
        textBlock += "<field name=\"TEXT\"></field>";
        textBlock += "</block>";
        return textBlock;
    };
    
    presenter.getCountFromToByBlockXML = function () {
        var block = '<block type=\"controls_for\">';
            block += '<field name=\"VAR\">i</field>';
            block += '<value name=\"FROM\">';
            block += '<shadow type=\"math_number\">';
            block += '<field name=\"NUM\">1</field>';
            block += '</shadow>';
            block += '</value>';
            block += '<value name=\"TO\">';
            block += '<shadow type=\"math_number\">';
            block += '<field name=\"NUM\">10</field>';
            block += '</shadow>';
            block += '</value>';
            block += '<value name=\"BY\">';
            block += '<shadow type=\"math_number\">';
            block += '<field name=\"NUM\">1</field>';
            block += '</shadow>';
            block += '</value>';
        block += '</block>';

        return block;
    };

    presenter.getVariablesCategoryXML = function () {
        var categoryXML = "<category name=\"Variables\">";

        categoryXML += '<block type=\"variables_get\">';
        categoryXML += '<field name=\"VAR\">i</field>';
        categoryXML += '</block>';
        categoryXML += '<block type=\"variables_set\">';
        categoryXML += '<field name=\"VAR\">i</field>';
        categoryXML += '</block>';
        categoryXML += '<block type=\"variables_get\">';
        categoryXML += '<field name=\"VAR\">item</field>';
        categoryXML += '</block>';
        categoryXML += '<block type=\"variables_set\">';
        categoryXML += '<field name=\"VAR\">item</field>';
        categoryXML += '</block>';
        categoryXML += "</category>";

        return categoryXML
    };

    presenter.getTestingCategoryXML = function () {
        var categoryXML = '<category name=\"TestingBlocks\">';
        categoryXML += '<block type="math_number"><field name="NUM">0</field></block>';
        categoryXML = StringUtils.format("{0}{1}", categoryXML, presenter.getTextBlockXML());
        categoryXML = StringUtils.format("{0}{1}", categoryXML, presenter.getCountFromToByBlockXML());
        categoryXML += '</category>';

        return categoryXML;
    };

    presenter.onEventReceived = function (eventName, eventData) {
        if (eventName == "PageLoaded") {
            isPreviewDecorator(presenter.getSceneModuleOnPageLoaded)();
            isPreviewDecorator(presenter.addCustomBlocks)();
            isPreviewDecorator(presenter.updateToolbox)();
            presenter.toolboxPositionFix();
        }
    };

    presenter.toolboxPositionFix = function () {
        if (!hasBeenSet) {
            var headerHeight = $(".ic_header").height();
            var $toolbox = $(".blocklyToolboxDiv");
            if ($toolbox.length > 0 && headerHeight !== undefined && headerHeight !== null) {
                $toolbox.css({
                    "top": ($toolbox.position().top + headerHeight) + "px"
                });

                hasBeenSet = true;
            }
        }
    };
    
    presenter.addCustomBlocks = function () {
        if (presenter.configuration.sceneModule !== null || presenter.configuration.sceneModule !== undefined) {
            presenter.configuration.sceneModule.addCustomBlocks();
        }
    };
 
    presenter.getSceneModuleOnPageLoaded = function () {
        if (presenter.configuration.sceneModule === null || presenter.configuration.sceneModule === undefined) {
            presenter.configuration.sceneModule = presenter.playerController.getModule(presenter.configuration.sceneID);
        }
    };

    presenter.updateToolbox = function () {
        if (presenter.configuration.sceneModule !== null && presenter.configuration.sceneModule !== undefined) {
            presenter.configuration.workspace.updateToolbox(presenter.getToolboxXML());

            var transformValue = $(".blocklyToolboxDiv").width();
            presenter.$view.find('.blocklyFlyout').css({
                '-webkit-transform' : StringUtils.format("translate({0}px, 0)", transformValue),
                '-moz-transform'    : StringUtils.format("translate({0}px, 0)", transformValue),
                '-ms-transform'     : StringUtils.format("translate({0}px, 0)", transformValue),
                '-o-transform'      : StringUtils.format("translate({0}px, 0)", transformValue),
                'transform'         : StringUtils.format("translate({0}px, 0)", transformValue)
            });
        }
    };

    return presenter;
}
