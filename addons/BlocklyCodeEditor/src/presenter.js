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
    presenter.ERROR_CODES = {
        "SI01": "Scene id must have value",
        "SI02": "You must add scene id if you want to add scene toolbox",
        "CN01": "Color must be integer positive value in range 0..360",
        "DN01": "Custom block name must be unique",
        "IE01": "Undefined input or connection type",
        "OE01": "Undefined connection type",
        "DE01": "Duplicated elements in toolbox",
        "BL01": "Block limit must be  0 or positive integer number",
        "VN01": "Input name must be a valid JS variable name"
    };

    presenter.inputsType = {
        "ANY" : "Any",
        "BOOLEAN" : "Boolean",
        "NUMBER" : "Number",
        "STRING" : "String",
        "ARRAY" : "Array"
    };

    presenter.connections = {
        "NONE" : "",
        "LEFT" : "this.setOutput(true,'",
        "TOP" : "this.setPreviousStatement(true,'",
        "BOTTOM" : "this.setNextStatement(true,'",
        "TOP-BOTTOM" : ""
    };

    presenter.DEFAULT_BLOCKS_LABELS = {
        "if": "controls_if",
        "compare": "logic_compare",
        "logic_operation": "logic_operation",
        "negate": "logic_negate",
        "boolean": "logic_boolean",
        "null": "logic_null",
        "logic_ternary": "logic_ternary",
        "repeat": "controls_repeat_ext",
        "repeat_while/until": "controls_whileUntil",
        "for": "controls_for",
        "for_each": "controls_forEach",
        "break": "controls_flow_statements",
        "number": "math_number",
        "arithmetic": "math_arithmetic",
        "basic_functions": "math_single",
        "trigonometry": "math_trig",
        "constants": "math_constant",
        "number_property": "math_number_property",
        "round": "math_round",
        "math_list_functions": "math_on_list",
        "modulo": "math_modulo",
        "constrain": "math_constrain",
        "random_integer": "math_random_int",
        "random_fraction": "math_random_float",
        "text": "text",
        "join_text": "text_join",
        "append_text": "text_append",
        "text_length": "text_length",
        "is_empty_text": "text_isEmpty",
        "text_index_of": "text_indexOf",
        "char_at": "text_charAt",
        "substring": "text_getSubstring",
        "to_upper/lower_case": "text_changeCase",
        "trim": "text_trim",
        "print": "text_print",
        "prompt_for": "text_prompt_ext",
        "create_list": "lists_create_with",
        "create_list_with_item": "lists_repeat",
        "list_length": "lists_length",
        "is_empty_list": "lists_isEmpty",
        "list_index_of": "lists_indexOf",
        "get_list_element": "lists_getIndex",
        "set_list_element": "lists_setIndex",
        "get_sublist": "lists_getSublist",
        "create_list_from": "lists_split",
        "sort_list": "lists_sort",
        "color_picker": "colour_picker",
        "random_color": "colour_random",
        "RGB_color": "colour_rgb",
        "blend_color": "colour_blend",
        "change_variable": "math_change",
        "set_variable": "variables_set",
        "get_variable": "variables_get",
        "custom": "custom"
    };

    presenter.DEFAULT_BLOCKS_TRANSLATION_LABELS = [
        "if",
        "compare",
        "logic_operation",
        "negate",
        "boolean",
        "null",
        "logic_ternary",
        "repeat",
        "repeat_while/until",
        "for",
        "for_each",
        "break",
        "number",
        "arithmetic",
        "basic_functions",
        "trigonometry",
        "constants",
        "number_property",
        "round",
        "math_list_functions",
        "modulo",
        "constrain",
        "random_integer",
        "random_fraction",
        "text",
        "join_text",
        "append_text",
        "text_length",
        "is_empty_text",
        "text_index_of",
        "char_at",
        "substring",
        "to_upper/lower_case",
        "trim",
        "print",
        "prompt_for",
        "create_list",
        "create_list_with_item",
        "list_length",
        "is_empty_list",
        "list_index_of",
        "get_list_element",
        "set_list_element",
        "get_sublist",
        "create_list_from",
        "sort_list",
        "color_picker",
        "random_color",
        "RGB_color",
        "blend_color",
        "variable",
        "set_variable",
        "get_variable",
        "change_variable"
    ];

    presenter.configuration = {
        hideRun: null,
        sceneID: null,
        sceneModule: null,
        workspace: null,
        toolboxXML: "",
        addSceneToolbox: false,
        sceneToolboxName: "",
        isPreview: false,
        isValid: false,
        haveSceneID: true,
        isVisible: true,
        visibleByDefault: true
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

        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        presenter.view = view;
        presenter.$view = $(view);
        presenter.$view.find(".editor").css({
            width: presenter.$view.width(),
            height: presenter.$view.height()
        });

        presenter.setRunButton();
        isPreviewDecorator(presenter.connectHandlers)();


        presenter.configuration.workspace = Blockly.inject($(view).find(".editor")[0], {
            toolbox: presenter.getToolboxXML(),
            sounds: false,
            maxBlocks: presenter.configuration.maxBlocks
        });

        eval(presenter.configuration.customBlocksXML.code);
        eval(presenter.configuration.customBlocksXML.stub);

        presenter.view.addEventListener('DOMNodeRemoved', function onDOMNodeRemoved(ev) {
            if (ev.target === this) {
                presenter.destroy();
            }
        });

        presenter.setVisibility(presenter.configuration.visibleByDefault);
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

        var validatedBlockLimit = ModelValidationUtils.validateInteger(model['maxBlocksLimit']);
        if (!validatedBlockLimit.isValid || validatedBlockLimit.value < 0) {
            return {
                isValid: false,
                errorCode: "BL01"
            };
        }

        if (!haveSceneID && presenter.configuration.addSceneToolbox) {
            return {
                isValid: false,
                errorCode: "SI02"
            }
        }

        return {
            isValid: true,
            visibleByDefault : validatedIsVisible,
            haveSceneID: haveSceneID,
            hideRun: ModelValidationUtils.validateBoolean(model["hideRun"]),
            sceneID: validatedSceneId.value,
            toolboxXML: validatedToolbox.value,
            customBlocksXML: validatedCustomBlocks.value,
            maxBlocks: validatedBlockLimit.value
        };
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

        for (var index = 0; index < toolbox.length; index++) {
            var toolboxElement = toolbox[index];
            if (elements.indexOf(toolboxElement['blockName'].name) != -1) {
                return {
                    isValid: false,
                    errorCode: "DE01"
                };
            }
            elements.push(toolboxElement['blockName'].name);
            presenter.validateTranslations(toolboxElement);
            if (toolboxElement['blockName'].name == "custom") {
                addToCategory(categories, toolboxElement['blockCategory'], toolboxElement['blockName'].value, toolboxElement['blockIsDisabled']);
            } else if (toolboxElement['blockName'].name == "scene_commands") {
                presenter.configuration.sceneToolboxName = toolboxElement['blockCategory'];
                presenter.configuration.addSceneToolbox = true;
            } else {
                addToCategory(categories, toolboxElement['blockCategory'], presenter.DEFAULT_BLOCKS_LABELS[toolboxElement['blockName'].name], toolboxElement['blockIsDisabled']);
            }
        }
        return {
            isValid: true,
            value: generateXMLFromCategories(categories)
        };
    };

    function generateXMLFromCategories(categories) {
        var xml = "";
        for (var categoryName in categories) {
            if (categories.hasOwnProperty(categoryName)) {
                xml += "<category name='" + categoryName + "' >";
                for (var key in categories[categoryName]) {
                    if (categories[categoryName].hasOwnProperty(key)) {
                        var block = categories[categoryName][key];
                        xml += "<block type='" + block.name + "'></block>";
                    }
                }
            }
            xml += "</category>";
        }
        return xml;
    }

    function addToCategory(categories, categoryName, blockName, isDisabled) {
        if (categoryName == '') return;
        if (blockName == '') return;

        if (!ModelValidationUtils.validateBoolean(isDisabled)) {
            if (categories[categoryName] == null) {
                categories[categoryName] = [];
            }
            categories[categoryName].push({
                name: blockName
            });
        }
    }

    presenter.validateTranslations = function (toolboxElement) {
        if (presenter.DEFAULT_BLOCKS_TRANSLATION_LABELS.indexOf(toolboxElement['blockName'].name) != -1) {
            var parsedValue = JSON.parse("{" + toolboxElement['blockName'].value + "}");
            for (var key in parsedValue) {
                if (parsedValue.hasOwnProperty(key)) {
                    Blockly.Msg[StringUtils.format('{0}', key)] = parsedValue[key];
                }
            }
        } else if (toolboxElement['blockName'].name == "toolbox") {
            var parsedValue = JSON.parse("{" + toolboxElement['blockName'].value + "}");
            BlocklyCustomBlocks.SceneGrid.LABELS = $.extend({},BlocklyCustomBlocks.SceneGrid.LABELS, parsedValue);
        }
    };

    presenter.validateType = function (type) {
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

    presenter.validateInputsType = function (inputsType, inputsLength) {
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

    presenter.validateConnection = function (connection) {
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


    presenter.validateBlock = function (customBlock) {
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
            if (!ModelValidationUtils.validateJSVariableName(inputs[i]).isValid) {
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

    presenter.convertCustomBlockToJS = function (customBlock) {
        var stub = StringUtils.format("Blockly.Blocks['{0}'] = { ", customBlock.name);
        stub += "init: function() {";
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

        if (customBlock.connection.toUpperCase() != "NONE" && customBlock.connection.toUpperCase() != "TOP-BOTTOM")
        {
            stub += StringUtils.format("{0}{1}{2}", presenter.connections[customBlock.connection.toUpperCase()], customBlock.connectionType[0],"');");
        } else if (customBlock.connection.toUpperCase() == "TOP-BOTTOM") {
            stub += StringUtils.format("{0}{1}{2}", presenter.connections["TOP"], customBlock.connectionType[0],"');");
            stub += StringUtils.format("{0}{1}{2}", presenter.connections["BOTTOM"], customBlock.connectionType[1],"');");
        }

        stub += StringUtils.format("this.setColour({0});", customBlock.color);
        stub += StringUtils.format("this.setTooltip('');this.setHelpUrl('http://www.example.com/');}};");

        var code = StringUtils.format("Blockly.JavaScript['{0}'] = function(block) {", customBlock.name);
        for (var inputKey in customBlock.inputs) {
            if (customBlock.inputs.hasOwnProperty(inputKey)) {
                code += StringUtils.format("var {0} = Blockly.JavaScript.valueToCode(block, '{1}', Blockly.JavaScript.ORDER_ATOMIC);", customBlock.inputs[inputKey], customBlock.inputs[inputKey]);
            }
        }

        var variables = "";
        for (var inputIndex = 0; inputIndex < customBlock.inputs.length ; inputIndex++) {
            variables += StringUtils.format("'var {0} = ' + {1} + ';' + ", customBlock.inputs[inputIndex], customBlock.inputs[inputIndex]);
        }

        if (customBlock.connection.toUpperCase() == "LEFT"){
            code += StringUtils.format("var code = [eval('(function(){{0}}())'), Blockly.JavaScript.ORDER_ATOMIC];", customBlock.code);
        } else {
            code += StringUtils.format("var code = {0}'{1}';", variables, customBlock.code);
        }
        code += "return code;};";

        return {
            stub: stub,
            code: code
        };
    };

    presenter.convertCustomBlocksToJS = function (customBlocks) {
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

    presenter.validateCustomBlocks = function (customBlocksList) {
        var blocks = [];
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
        var names = [];
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
            value: presenter.convertCustomBlocksToJS(blocks)
        };
    };

    presenter.validateSceneToolboxName = function (sceneToolboxName) {
        if(ModelValidationUtils.isStringEmpty(sceneToolboxName)) {
            return "GridScene";
        } else {
            return sceneToolboxName;
        }
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
            'show' : presenter.show,
            'hide' : presenter.hide
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.hide = function () {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.show = function () {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };

    presenter.setVisibility = function (isVisible) {
        presenter.configuration.isVisible= isVisible;
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
        $('.blocklyToolboxDiv').css('visibility',isVisible ? 'visible' : 'hidden');
    };

    presenter.getWorkspaceCode = function () {
        return Blockly.JavaScript.workspaceToCode(presenter.configuration.workspace);
    };

    presenter.getToolboxXML = function () {
        if (presenter.configuration.isPreview) {
            return presenter.previewToolbox();
        }


        var toolbox = '<xml>';

        toolbox = StringUtils.format("{0}{1}", toolbox, presenter.configuration.toolboxXML);

        if (presenter.configuration.sceneModule !== null
            && presenter.configuration.sceneModule !== undefined
            && presenter.configuration.addSceneToolbox) {
            toolbox = StringUtils.format("{0}<category name = \"{2}\">{1}</category>", toolbox, presenter.configuration.sceneModule.getToolboxCategoryXML(), presenter.configuration.sceneToolboxName);
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

        return categoryXML;
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
        if (presenter.configuration.haveSceneID && presenter.configuration.isValid) {
            if (eventName == "PageLoaded") {
                isPreviewDecorator(presenter.getSceneModuleOnPageLoaded)();
                isPreviewDecorator(presenter.addCustomBlocks)();
                isPreviewDecorator(presenter.updateToolbox)();
                presenter.toolboxPositionFix();
            }
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
        if ((presenter.configuration.sceneModule !== null && presenter.configuration.sceneModule !== undefined)) {
            if (presenter.configuration.sceneModule.addCustomBlocks !== null) {
                presenter.configuration.sceneModule.addCustomBlocks();
            }
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

    presenter.getState = function Blockly_Code_Edtior_get_state () {
        var xml = Blockly.Xml.workspaceToDom(presenter.configuration.workspace);
        var value = {
            code : Blockly.Xml.domToText(xml),
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

    return presenter;
}
