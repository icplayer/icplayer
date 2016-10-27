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


    presenter.ERROR_CODES = {
        "SI01": "Scene id must have value",
        "SI02": "You must add scene id if you want to add scene toolbox",
        "CN01": "Color must be integer positive value in range 0..360",
        "CE01": "Addon can't have blocks with category and without category in the same time",
        "DN01": "Custom block name must be unique",
        "IE01": "Undefined input or connection type",
        "OE01": "Undefined connection type",
        "DE01": "Duplicated elements in toolbox",
        "BL01": "Block limit must be  0 or positive integer number",
        "BL02": "Block limit is float number but should be integer value.",
        "VN01": "Input name must be a valid JS variable name",
        "UB01": "Undefined block in toolbox",
        "TP01": "Translation in Toolbox is not a valid JSON.",
        "TP02": "Translation is not a valid JSON"
    };

    presenter.inputsType = {
        "ANY" : "Any",
        "BOOLEAN" : "Boolean",
        "NUMBER" : "Number",
        "STRING" : "String",
        "ARRAY" : "Array"
    };
    presenter.connections = {
        "NONE" : function Blockly_NONE_Connection_function () {return "" },
        "LEFT" : function Blockly_LEFT_Connection_function (type) {return "this.setOutput(true,'" + type + "');"; },
        "TOP" :  function Blockly_TOP_Connection_function (type) {return "this.setPreviousStatement(true,'" + type + "');";},
        "BOTTOM" : function Blockly_BOTTOM_Connection_function (type) {return "this.setNextStatement(true,'" + type + "');";},
        "TOP-BOTTOM" : function Blockly_TOP_BOTTOM_Connection_function (firstType, secondType) { return presenter.connections["TOP"](firstType) + presenter.connections["BOTTOM"](secondType); }
    };

    presenter.DEFAULT_BLOCKS_TRANSLATION_LABELS = [
         "controls_if",
         "logic_compare",
         "logic_operation",
         "logic_negate",
         "logic_boolean",
         "logic_null",
         "logic_ternary",
         "controls_repeat_ext",
         "controls_whileUntil",
         "controls_for",
         "controls_forEach",
         "controls_flow_statements",
         "math_number",
         "math_arithmetic",
         "math_single",
         "math_trig",
         "math_constant",
         "math_number_property",
         "math_round",
         "math_on_list",
         "math_modulo",
         "math_constrain",
         "math_random_int",
         "math_random_float",
         "text",
         "text_join",
         "text_append",
         "text_length",
         "text_isEmpty",
         "text_indexOf",
         "text_charAt",
         "text_getSubstring",
         "text_changeCase",
         "text_trim",
         "text_print",
         "text_prompt_ext",
         "lists_create_with",
         "lists_repeat",
         "lists_length",
         "lists_isEmpty",
         "lists_indexOf",
         "lists_setIndex",
         "lists_getSublist",
         "lists_split",
         "lists_sort",
         "colour_picker",
         "colour_random",
         "colour_rgb",
         "colour_blend",
         "math_change",
         "variables_set",
         "variables_get"
    ];

    presenter.javaScriptBlocksCode = [];
    presenter.stubBlocks = [];

    presenter.configuration = {
        hideRun: null,
        sceneID: null,
        sceneModule: null,
        workspace: null,
        toolboxXML: "",
        addSceneToolbox: false,
        sceneToolboxName: "",
        sceneToolboxIsCategory: false,
        isPreview: false,
        isValid: false,
        haveSceneID: true,
        isVisible: true,
        visibleByDefault: true,
        pageLoaded: false,
        blocksTranslation: {}
    };

    function isPreviewDecorator(func) {
        if (!presenter.configuration.isPreview) {
            return func;
        } else {
            return function Blockly_empty_preview_decorator_function () {};
        }
    }

    presenter.run = function Blockly_run_function (view, model) {
        presenter.runLogic(view, model, false);
    };

    presenter.createPreview = function Blockly_createPreview_function (view, model) {
        presenter.runLogic(view, model, true);
    };

    presenter.setPlayerController = function Blockly_setPlayerController_function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = presenter.playerController.getEventBus();
        presenter.eventBus.addEventListener('PageLoaded', this, true);
        presenter.eventBus.addEventListener('ShowAnswers', this);
        presenter.eventBus.addEventListener('HideAnswers', this);
    };

    presenter.createWorkspace = function (view, isPreview) {
        var $editor = $(view).find(".editor")[0];
        var toolboxXML = "";
        if (isPreview) {
            toolboxXML = presenter.getPreviewToolbox();
        } else {
            toolboxXML = presenter.getToolboxXML();
        }

        presenter.configuration.workspace = Blockly.inject($editor, {
            toolbox: toolboxXML,
            sounds: false,
            maxBlocks: presenter.configuration.maxBlocks
        });
    };

    presenter.setEditorCss = function () {
        presenter.$view.find(".editor").css({
            width: presenter.$view.width(),
            height: presenter.$view.height()
        });
    };

    presenter.runLogic = function Blockly_runLogic_function (view, model, isPreview) {
        presenter.configuration.isPreview = isPreview;
        presenter.configuration = $.extend(presenter.configuration, presenter.validateModel(model));

        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        presenter.view = view;
        presenter.$view = $(view);

        presenter.setRunButton();
        presenter.setEditorCss();
        presenter.createWorkspace(view, isPreview);

        eval(presenter.configuration.customBlocksXML.code);
        eval(presenter.configuration.customBlocksXML.stub);

        presenter.setVisibility(presenter.configuration.visibleByDefault);

        isPreviewDecorator(presenter.connectHandlers)();

        isPreviewDecorator(presenter.updateToolbox)();

        presenter.view.addEventListener('DOMNodeRemoved', function onDOMNodeRemoved_Blockly (ev) {
            if (ev.target === this) {
                presenter.destroy();
            }
        });
    };

    presenter.addBlocksTranslations = function Blockly_addGoogleBlocksTranslations_function () {
        for (var key in presenter.configuration.blocksTranslation) {
            if (presenter.configuration.blocksTranslation.hasOwnProperty(key)) {
                Blockly.Msg[StringUtils.format('{0}', key)] = presenter.configuration.blocksTranslation[key];
            }
        }
    };

    presenter.destroy = function Blockly_destroy_function () {
        var key, i;
        if (presenter.configuration.isPreview) {
            $("#content").off("scroll", presenter.scrollFixHandler);
        }

        presenter.view.removeEventListener('DOMNodeRemoved', presenter.destroy);
        presenter.configuration.workspace.dispose();

        presenter.configuration.workspace = null;

        presenter.$view.find(".run").off();
        presenter.$view = null;
        presenter.view = null;
        presenter.configuration = null;

        for(i = 0; i < presenter.javaScriptBlocksCode.length; i++) {
            delete Blockly.JavaScript[presenter.javaScriptBlocksCode[i]];
        }

        for(i = 0; i < presenter.stubBlocks.length; i++) {
            delete Blockly.Blocks[presenter.stubBlocks[i]];
        }

        presenter.javaScriptBlocksCode = null;
        presenter.stubBlocks = null;

        for (key in presenter.connections) {
            if (presenter.connections.hasOwnProperty(key)) {
                presenter.connections[key] = null;
            }
        }
        presenter.connections = null;
        presenter.removePresenterFunctions();
    };

    presenter.removePresenterFunctions = function Blockly_removePresenterFunctions_function() {
        presenter.removePresenterFunctions = null;
        presenter.destroy = null;
        presenter.ERROR_CODES = null;
        presenter.inputsType = null;
        presenter.connections = null;
        presenter.DEFAULT_BLOCKS_TRANSLATION_LABELS = null;
        presenter.run = null;
        presenter.scrollToolboxPreviewFix = null;
        presenter.scrollFixHandler = null;
        presenter.createPreview = null;
        presenter.setPlayerController = null;
        presenter.runLogic = null;
        presenter.addGoogleBlocksTranslations = null;
        presenter.validateModel = null;
        presenter.validateBlockLimit = null;
        presenter.validateBlocksTranslation = null;
        presenter.validateToolboxNamesWithCustomBlocks = null;
        presenter.validateSceneId = null;
        presenter.validateToolbox = null;
        presenter.validateTranslations = null;
        presenter.validateInputsType = null;
        presenter.validateConnection = null;
        presenter.validateBlock = null;
        presenter.convertCustomBlockToJS = null;
        presenter.convertCustomBlocksToJS = null;
        presenter.validateCustomBlocks = null;
        presenter.connectHandlers = null;
        presenter.setRunButton = null;
        presenter.executeCommand = null;
        presenter.hide = null;
        presenter.show = null;
        presenter.setVisibility = null;
        presenter.getWorkspaceCode = null;
        presenter.getToolboxXML = null;
        presenter.onEventReceived = null;
        presenter.addCustomBlocks = null;
        presenter.getSceneModuleOnPageLoaded = null;
        presenter.updateToolbox = null;
        presenter.getState = null;
        presenter.setState= null;
        presenter.setState = null;
        presenter.setShowErrorsMode = null;
        presenter.setWorkMode = null;
        presenter.showAnswers = null;
        presenter.hideAnswers = null;
        presenter.coverAddon = null;
        presenter.removeAddonCover = null;
        presenter.coverToolbox = null;
        presenter.removeToolboxCover = null;
    };

    presenter.validateModel = function Blockly_validateModel_function(model) {
        var haveSceneID = true;
        var validatedIsVisible = ModelValidationUtils.validateBoolean(model['Is Visible']);

        var validatedToolbox = presenter.validateToolbox(model['toolbox']);
        if (!validatedToolbox.isValid) {
            return validatedToolbox;
        }

        var validatedSceneId = presenter.validateSceneId(model["sceneID"]);
        if (!validatedSceneId.isValid) {
          haveSceneID = false;
        }

        var validatedCustomBlocks = presenter.validateCustomBlocks(model["customBlocks"]);
        if (!validatedCustomBlocks.isValid) {
            return validatedCustomBlocks;
        }

        var validatedBlockLimit = presenter.validateBlockLimit(model['maxBlocksLimit']);
        if (!validatedBlockLimit.isValid) {
            return validatedBlockLimit;
        }

        var validatedToolboxNamesWithCustomBlocks = presenter.validateToolboxNamesWithCustomBlocks(validatedToolbox.value.categories, validatedCustomBlocks);
        if (!validatedToolboxNamesWithCustomBlocks.isValid) {
            return validatedToolboxNamesWithCustomBlocks;
        }

        var validatedBlocksTranslations = presenter.validateBlocksTranslation(model['blocksTranslation']);
        if (!validatedBlocksTranslations.isValid) {
            return validatedBlocksTranslations;
        }

        var isCategory = false;
        var isWithoutCategory = false;
        for (var key in validatedToolbox.value.categories) {
            if (validatedToolbox.value.categories.hasOwnProperty(key)) {
                var blocks = validatedToolbox.value.categories[key];
                for (var i = 0; i < blocks.length; i++) {
                    if (blocks[i].isCategory) {
                        isCategory = true;
                    } else {
                        isWithoutCategory = true;
                    }
                }
            }
        }

        if (presenter.configuration.addSceneToolbox) {
            if (presenter.configuration.sceneToolboxIsCategory) {
                isCategory = true;
            } else {
                isWithoutCategory = true;
            }
        }

        if (isCategory == isWithoutCategory) {
            return {
                isValid: false,
                errorCode: "CE01"
            }
        }

        return {
            isValid: true,
            visibleByDefault : validatedIsVisible,
            haveSceneID: haveSceneID,
            hideRun: ModelValidationUtils.validateBoolean(model["hideRun"]),
            sceneID: validatedSceneId.value,
            toolboxXML: validatedToolbox.value.categories,
            customBlocksXML: presenter.convertCustomBlocksToJS(validatedCustomBlocks.value),
            maxBlocks: validatedBlockLimit.value,
            blocksTranslation: $.extend(validatedToolbox.value.translations, validatedBlocksTranslations.value)
        };
    };

    presenter.validateBlockLimit = function Blockly_validateBlockLimit_function(blockModel) {
        if (ModelValidationUtils.isStringEmpty(blockModel.trim())) {
            blockModel = "0";
        }
        var validatedBlockLimit = ModelValidationUtils.validateInteger(blockModel);
        if (!validatedBlockLimit.isValid || validatedBlockLimit.value < 0) {
            return {
                isValid: false,
                errorCode: "BL01"
            };
        }

        /*
            Find all characters without numbers
         */
        if (blockModel.trim().match(/[^0-9]/) !== null) {
             return {
                isValid: false,
                errorCode: "BL02"
            };
        }
        return validatedBlockLimit;
    };

    presenter.validateBlocksTranslation = function Blockly_validateBlocksTranslation_function (blocksTranslations) {
        if (ModelValidationUtils.isStringEmpty(blocksTranslations.trim())){
            return {
                isValid: true,
                value: {}
            }
        }

        var parsedValue = {};
        try {
            parsedValue = JSON.parse(blocksTranslations);
        } catch (error) {
            return {
                isValid: false,
                errorCode: "TP02"
            }
        }

        return {
            isValid: true,
            value : parsedValue
        };
    };

    presenter.validateToolboxNamesWithCustomBlocks = function Blockly_validateToolboxNamesWithCustomBlocks_function (toolbox, customblocks) {
        for (var key in toolbox) {
            if (toolbox.hasOwnProperty(key)) {
                var category = toolbox[key];
                for (var i = 0; i < category.length; i++) {
                    if (presenter.DEFAULT_BLOCKS_TRANSLATION_LABELS.indexOf(category[i].name)  == -1) {
                        var founded = false;
                        for (var j = 0; j < customblocks.value.length; j++) {
                            if (customblocks.value[j].name == category[i].name) {
                                founded = true;
                                break;
                            }
                        }
                        if (!founded) {
                            return {
                                isValid: false,
                                errorCode: "UB01"
                            }
                        }
                    }
                }
            }
        }
        return {
            isValid: true
        }
    };

    presenter.validateSceneId = function Blockly_Code_Editor_validate_scene_id (sceneId) {
        if (ModelValidationUtils.isStringEmpty(sceneId)) {
            return {
                isValid: false,
                errorCode: "SI01"
            };
        }

        return {
            isValid: true,
            value: sceneId
        };
    };

    presenter.validateToolbox = function Blockly_Code_Editor_validate_toolbox (toolbox) {
        var categories = {};
        var elements = [];
        var tranlations = {};
        for (var index = 0; index < toolbox.length; index++) {
            var toolboxElement = toolbox[index];
            if (toolboxElement['blockName'].name != "custom") {
                if (elements.indexOf(toolboxElement['blockName'].name) != -1) {
                    return {
                        isValid: false,
                        errorCode: "DE01"
                    };
                }
            }
            elements.push(toolboxElement['blockName'].name);

            var validatedTranslations = presenter.validateTranslations(toolboxElement);
            if (!validatedTranslations.isValid) {
                return validatedTranslations;
            }
            $.extend(tranlations, validatedTranslations.value);
            if (toolboxElement['blockName'].name == "custom") {
                addToCategory(categories, toolboxElement['blockCategory'], toolboxElement['blockName'].value, toolboxElement['blockIsDisabled']);
            } else if (toolboxElement['blockName'].name == "grid_scene_commands") {
                addToCategory(categories, toolboxElement['blockCategory'], "grid_scene_commands", toolboxElement['blockIsDisabled']);
            } else {
                addToCategory(categories, toolboxElement['blockCategory'], toolboxElement['blockName'].name, toolboxElement['blockIsDisabled']);
            }
        }
        return {
            isValid: true,
            value: {
                categories: categories,
                translations: tranlations
            }
        };
    };



    function addToCategory(categories, categoryName, blockName, isDisabled) {
        if (blockName == '') return;
        if (ModelValidationUtils.validateBoolean(isDisabled)) return;
        var haveCategory = true;
        if (categoryName.trim() == '') {
            haveCategory = false;
            categoryName = "Empty";
        }
        if (categories[categoryName] == null) {
                categories[categoryName] = [];
        }
        if (blockName != "grid_scene_commands") {
            categories[categoryName].push({
                name: blockName,
                isCategory: haveCategory
            });
        } else {
            presenter.configuration.addSceneToolbox = true;
            presenter.configuration.sceneToolboxIsCategory = haveCategory;
            presenter.configuration.sceneToolboxName = categoryName;
        }
    }

    presenter.validateTranslations = function Blockly_validateTranslations_function (toolboxElement) {

        if (presenter.DEFAULT_BLOCKS_TRANSLATION_LABELS.indexOf(toolboxElement['blockName'].name) != -1 || (toolboxElement['blockName'].name == "grid_scene_commands")) {
            var parsedValue = "";
            try {
                parsedValue = JSON.parse(toolboxElement['blockName'].value);
            } catch (error) {
                return {
                    isValid: false,
                    errorCode: "TP01"
                };
            }
            return {
                isValid: true,
                value: parsedValue
            }
        }

        return {
            isValid: true,
            value: {}
        }
    };

    presenter.validateType = function Blockly_validateType_function (type) {
        if (type.toUpperCase().trim() in presenter.inputsType) {
            return {
                isValid: true,
                value: presenter.inputsType[type.toUpperCase().trim()]
            };
        }
        return {
            isValid: false,
            errorCode: "IE01"
        };
    };

    presenter.validateInputsType = function Blockly_validateInputsType_function (inputsType, inputsLength) {
        if (inputsLength == 0) {
            return {
                isValid:true,
                value : []
            };
        }

        var validatedInputTypes = [];
        var separatedInputsType = [];
        if (!ModelValidationUtils.isStringEmpty(inputsType.trim())) {
            separatedInputsType = inputsType.split(",");
        }
        for (var actualPosition = separatedInputsType.length; actualPosition < inputsLength.length; actualPosition++) {
            separatedInputsType.push("Any");
        }

        for (var key in separatedInputsType) {
            if (separatedInputsType.hasOwnProperty(key)) {
                var validatedType = presenter.validateType(separatedInputsType[key]);
                if (!validatedType.isValid) {
                    return validatedType;
                }
                validatedInputTypes.push(validatedType.value);
            }
        }

        return {
            isValid: true,
            value: validatedInputTypes
        };
    };

    presenter.validateConnection = function Blockly_validateConnection_function (connection) {
        if (connection.toUpperCase().trim() in presenter.connections) {
            return {
                isValid: true,
                value: connection.toUpperCase().trim()
            };
        }
        return {
            isValid: false,
            errorCode: "OE01"
        };
    };


    presenter.validateBlock = function Blockly_validateBlock_function (customBlock) {
        var validatedColor =  ModelValidationUtils.validateIntegerInRange(customBlock['customBlockColor'], 360, 0);
        if (!validatedColor.isValid) {
            return {
                isValid: false,
                errorCode: "CN01"
            };
        }

        var inputs = customBlock['customBlockInputs'].split(",");
        if (ModelValidationUtils.isStringEmpty(customBlock['customBlockInputs'])) {
            inputs = [];
        }
        for (var i = 0; i < inputs.length; i++) {
            if (!ModelValidationUtils.validateJSVariableName(inputs[i].trim()).isValid) {
                return {
                    isValid: false,
                    errorCode: "VN01"
                };
            }
        }

        var validatedInputsType = presenter.validateInputsType(customBlock['customBlockInputsType'], inputs.length);
        if (!validatedInputsType.isValid) {
            return validatedInputsType;
        }

        var inputsText = customBlock['customBlockInputsText'].split(",");
        for (var actualPosition = inputsText.length; actualPosition < inputs.length; actualPosition++) {
            inputsText.push("");
        }
        var validatedConnection = presenter.validateConnection(customBlock['customBlockOutput']);
        if (!validatedConnection.isValid) {
            return validatedConnection;
        }

        var validatedConnectionsType = presenter.validateInputsType(customBlock['customBlockOutputType'], 2);
        if (!validatedConnectionsType.isValid) {
            return validatedConnectionsType;
        }

        var isTitle = !ModelValidationUtils.isStringEmpty(customBlock['customBlockTitle']);
        var validatedTitle = {
            isValid: true,
            value: null
        };

        if (isTitle) {
            validatedTitle.value = customBlock['customBlockTitle'];
        }

        return {
            isValid: true,
            name:  customBlock['customBlockName'],
            color: validatedColor.value,
            inputs: inputs,
            inputsText: inputsText,
            inputsType: validatedInputsType.value,
            code: customBlock['customBlockCode'].replace(/\r?\n|\r/g,""),   //Removing all new line sings
            connection: validatedConnection.value,
            connectionType: validatedConnectionsType.value,
            title: validatedTitle.value

        };
    };


    presenter.convertCustomBlockToJS = function Blockly_convertCustomBlockToJS_function (customBlock) {
        var stub = this.createStub(customBlock);
        var code = this.createCode(customBlock);

        return {
            stub: stub,
            code: code
        };
    };

    presenter.createCode = function Blockly_createCode_function (customBlock) {
        presenter.javaScriptBlocksCode.push(customBlock.name);
        var code = StringUtils.format("Blockly.JavaScript['{0}'] = function(block) {", customBlock.name);
        for (var inputKey in customBlock.inputs) {
            if (customBlock.inputs.hasOwnProperty(inputKey)) {
                code += StringUtils.format("var {0} = Blockly.JavaScript.valueToCode(block, '{1}', Blockly.JavaScript.ORDER_ATOMIC);", customBlock.inputs[inputKey], customBlock.inputs[inputKey]);
            }
        }

        var variables = "";
        for (var inputIndex = 0; inputIndex < customBlock.inputs.length; inputIndex++) {
            variables += StringUtils.format("'var {0} = ' + {1} + ';' + ", customBlock.inputs[inputIndex], customBlock.inputs[inputIndex]);
        }

        if (customBlock.connection.toUpperCase() == "LEFT") {
            code += StringUtils.format("var code = [eval('(function Blockly_createCode_function_creating (){{0}}())'), Blockly.JavaScript.ORDER_ATOMIC];", customBlock.code);
        } else {
            code += StringUtils.format("var code = {0}'{1}';", variables, customBlock.code);
        }
        code += "return code;};";
        return code;
    };

    presenter.createStub = function Blockly_createStub_function (customBlock) {
        presenter.stubBlocks.push(customBlock.name);
        var stub = StringUtils.format("Blockly.Blocks['{0}'] = { ", customBlock.name);
        stub += "init: function Blockly_init_function_creating() {";
        if (customBlock.title != null) {
            stub += StringUtils.format("this.appendDummyInput().appendField('{0}');", customBlock.title);
        }
        for (var inputKey in customBlock.inputs) {
            if (customBlock.inputs.hasOwnProperty(inputKey)) {
                stub += StringUtils.format("this.appendValueInput('{0}')", customBlock.inputs[inputKey]);
                stub += StringUtils.format(".setCheck('{0}')", customBlock.inputsType[inputKey]);
                stub += StringUtils.format(".appendField('{0}');", customBlock.inputsText[inputKey]);
            }
        }

        if (customBlock.connection.toUpperCase() != "NONE" && customBlock.connection.toUpperCase() != "TOP-BOTTOM") {
            stub += presenter.connections[customBlock.connection.toUpperCase()](customBlock.connectionType[0]);
        } else if (customBlock.connection.toUpperCase() == "TOP-BOTTOM") {
            stub += presenter.connections["TOP-BOTTOM"](customBlock.connectionType[0], customBlock.connectionType[1]);
        }

        stub += StringUtils.format("this.setColour({0});", customBlock.color);
        stub += StringUtils.format("this.setTooltip('');}};");
        return stub;
    };

    presenter.convertCustomBlocksToJS = function Blockly_convertCustomBlocksToJS_function (customBlocks) {
        var stringJS = {
            stub: "",
            code: ""
        };
        for (var key in customBlocks) {
            if (customBlocks.hasOwnProperty(key)) {
                var convertedCode = presenter.convertCustomBlockToJS(customBlocks[key]);
                stringJS.stub += convertedCode.stub;
                stringJS.code += convertedCode.code;
            }
        }
        return stringJS;
    };

    presenter.validateCustomBlocks = function Blockly_validateCustomBlocks_function (customBlocksList) {
        var blocks = [];
        var names = [];

        for (var customBlockKey in customBlocksList) {
            if (customBlocksList.hasOwnProperty(customBlockKey)) {
                if (ModelValidationUtils.isStringEmpty(customBlocksList[customBlockKey]['customBlockName'])) {
                    continue;
                }
                var customBlock = customBlocksList[customBlockKey];
                var validatedBlock = presenter.validateBlock(customBlock);
                if (!validatedBlock.isValid) {
                    return validatedBlock;
                }
                blocks.push(validatedBlock);
            }
        }

        for (var i = 0; i < blocks.length; i++) {
            if (names.indexOf(blocks[i].name) != -1) {
                return {
                    isValid: false,
                    errorCode: 'DN01'
                }
            }
            names.push(blocks[i].name);
        }

        return {
            isValid: true,
            value: blocks
        };
    };

    presenter.connectHandlers = function Blockly_connectHandlers_function() {
        var runButton = presenter.$view.find(".run");
        runButton.click(function Blockly_runClick_function () {
            if (presenter.configuration.sceneModule !== null) {
                var code = Blockly.JavaScript.workspaceToCode(presenter.configuration.workspace);
                presenter.configuration.sceneModule.executeCode(code);
            }
        });
        runButton = null;
    };

    presenter.setRunButton = function Blockly_setRunButton_function () {
        if (presenter.configuration.hideRun) {
            var runButton = presenter.$view.find(".run");
            runButton.css({
                "display": "none"
            });
        }
    };

    presenter.executeCommand = function Blockly_executeCommand_function (name, params) {
        var commands = {
            'getWorkspaceCode' : presenter.getWorkspaceCode,
            'show' : presenter.show,
            'hide' : presenter.hide
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.hide = function Blockly_hide_function () {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.show = function Blockly_show_function () {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.setVisibility = function Blockly_setVisibility_function (isVisible) {
        presenter.configuration.isVisible = isVisible;
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
        var $blocklyToolboxDiv = $('.blocklyToolboxDiv');
        $blocklyToolboxDiv.css('visibility', isVisible ? 'visible' : 'hidden');
        $blocklyToolboxDiv = null;
    };

    presenter.getWorkspaceCode = function Blockly_getWorkspaceCode_function () {
        return Blockly.JavaScript.workspaceToCode(presenter.configuration.workspace);
    };

    presenter.getToolboxXML = function Blockly_getToolboxXML_function () {
        var toolbox = '<xml>';
        toolbox = StringUtils.format("{0}{1}", toolbox, generateXMLFromCategories(presenter.configuration.toolboxXML));
        toolbox = StringUtils.format("{0}{1}", toolbox, generateXMLWithoutCategories(presenter.configuration.toolboxXML));
        toolbox = StringUtils.format("{0}{1}", toolbox, "</xml>");
        return toolbox;
    };

    presenter.getPreviewToolbox = function () {
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

    function generateXMLWithoutCategories (categories) {
        var toolboxText = "";
        if (categories.hasOwnProperty("Empty")) {
            for (var key in categories["Empty"]) {
                if (categories["Empty"].hasOwnProperty(key)) {
                    if (!categories["Empty"][key].isCategory) {
                        toolboxText = StringUtils.format("{0}<block type='{1}'></block>", toolboxText, categories["Empty"][key].name);
                    }
                }
            }
        }
        return toolboxText;
    }

    function generateXMLFromCategories(categories) {
        var xml = "";
        for (var categoryName in categories) {
            var category = "";
            var categoryIsNotEmpty = false;
            if (categories.hasOwnProperty(categoryName)) {
                category += "<category name='" + categoryName + "' >";
                for (var key in categories[categoryName]) {
                    if (categories[categoryName].hasOwnProperty(key)) {
                        var block = categories[categoryName][key];
                        if (!block.isCategory) {
                            continue;
                        }
                        categoryIsNotEmpty = true;
                        category += "<block type='" + block.name + "'></block>";
                    }
                }
            }
            category += "</category>";
            if (categoryIsNotEmpty) {
                xml += category;
            }
        }
        return xml;
    }

    presenter.onEventReceived = function Blockly_onEventReceived_function (eventName, eventData) {

        if (eventName == "PageLoaded") {
            if (presenter.configuration.pageLoaded ) {
                return;
            }
            presenter.addBlocksTranslations();
            presenter.getSceneModuleOnPageLoaded();
            var sceneData = presenter.getSceneData();
            if (sceneData !== undefined) {
                if (presenter.configuration.addSceneToolbox) {
                    presenter.scenesInitialization[sceneData.type](sceneData);
                    presenter.updateToolbox();
                }
            }

            presenter.configuration.pageLoaded = true;
        } else if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        } else if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }
    };



    presenter.gridSceneInitialization = function (data) {
        for (var key in data.labels) {
            if (data.labels.hasOwnProperty(key) && presenter.configuration.blocksTranslation.hasOwnProperty(key)) {
                data.labels[key] = presenter.configuration.blocksTranslation[key];
            }
        }
        BlocklyCustomBlocks.SceneGrid.addBlocks(data.labels);


        if (presenter.configuration.addSceneToolbox) {
            for (var key in data.availableBlocks) {
                if (data.availableBlocks.hasOwnProperty(key)) {
                    presenter.configuration.toolboxXML[presenter.configuration.sceneToolboxName].push({
                        name: key,
                        isCategory: presenter.configuration.sceneToolboxIsCategory
                    });
                }
            }
        }

    };

    presenter.scenesInitialization = {
        "GridScene" : presenter.gridSceneInitialization
    };

    presenter.getSceneData = function Blockly_getSceneData () {
        if ((presenter.configuration.sceneModule !== null && presenter.configuration.sceneModule !== undefined)) {
            if (presenter.configuration.sceneModule.getBlocklyData !== undefined && presenter.configuration.sceneModule.getBlocklyData !== null) {
                return presenter.configuration.sceneModule.getBlocklyData();
            }
        }
        return undefined;
    };

    presenter.getSceneModuleOnPageLoaded = function Blockly_getSceneModuleOnPageLoaded_function () {
        if (presenter.configuration.sceneModule === null || presenter.configuration.sceneModule === undefined) {
            presenter.configuration.sceneModule = presenter.playerController.getModule(presenter.configuration.sceneID);
        }
    };

    presenter.updateToolbox = function Blockly_updateToolbox_function () {
        presenter.configuration.workspace.updateToolbox(presenter.getToolboxXML());
        var transformValue = $(".blocklyToolboxDiv");
        transformValue = transformValue.width();
        presenter.$view.find('.blocklyFlyout').css({
            '-webkit-transform' : StringUtils.format("translate({0}px, 0)", transformValue),
            '-moz-transform'    : StringUtils.format("translate({0}px, 0)", transformValue),
            '-ms-transform'     : StringUtils.format("translate({0}px, 0)", transformValue),
            '-o-transform'      : StringUtils.format("translate({0}px, 0)", transformValue),
            'transform'         : StringUtils.format("translate({0}px, 0)", transformValue)
        });
    };

    presenter.getState = function Blockly_Code_Edtior_get_state () {
        var xml = Blockly.Xml.workspaceToDom(presenter.configuration.workspace);
        var value = {
            code: Blockly.Xml.domToText(xml),
            isVisible: presenter.configuration.isVisible
        };
        return JSON.stringify(value);
    };

    presenter.setState = function Blockly_Code_Editor_set_state (state) {
        var value = JSON.parse(state);
        var xml = Blockly.Xml.textToDom(value.code);
        Blockly.Xml.domToWorkspace(xml, presenter.configuration.workspace);
        presenter.setVisibility(value.isVisible);
    };

    presenter.reset = function Blockly_reset_function () {
        presenter.setWorkMode();
        presenter.configuration.workspace.clear();
    };

    presenter.setShowErrorsMode = function Blockly_setShowErrorsMode_function () {
        presenter.setWorkMode();
        presenter.coverToolbox();
        presenter.coverAddon();
    };

    presenter.setWorkMode = function Blockly_setWorkMode_function () {
        presenter.removeToolboxCover();
        presenter.removeAddonCover();
    };

    presenter.showAnswers = function Blockly_showAnswers_function () {
        presenter.setShowErrorsMode();
    };

    presenter.hideAnswers = function Blockly_hideAnswers_function () {
        presenter.setWorkMode();
    };

    presenter.coverAddon = function Blockly_coverAddon_function () {
        var cover = $("<div>");
        cover.addClass("blockly-cover");
        presenter.$view.append(cover);
    };

    presenter.removeAddonCover = function Blockly_removeAddonCover_function () {
        var element = presenter.$view.find('.blockly-cover');
        element.remove();
    };

    presenter.coverToolbox = function Blockly_coverToolbox_function () {
        var toolbox = presenter.view.getElementsByClassName('blocklyToolboxDiv');
        if (toolbox.length != 0) {
            var cover = document.createElement('div');
            cover.className = 'toolboxCover blockly-cover';
            toolbox[0].appendChild(cover);
        }
    };

    presenter.removeToolboxCover = function Blockly_removeToolboxCover_function () {
        var toolboxCover = presenter.view.getElementsByClassName('toolboxCover blockly-cover');
        if (toolboxCover !== null && toolboxCover !== undefined) {
            if (toolboxCover.length > 0) {
                toolboxCover[0].parentNode.removeChild(toolboxCover[0]);
            }
        }
    };

    return presenter;
}
