(function (window) {
    var initialized = false;

    function SceneGridCustomBlocks() {}

    function emptyAsUndefined(value) {
        try {
            if(value.trim() == "") {
                return undefined;
            } else {
                return value;
            }
        } catch (e) {
            console.log(e);
        }
    }

    SceneGridCustomBlocks.DEFAULT_LABELS = {
        "command_clear": "clear",
        "command_mark": "mark",
        "command_drawLeft": "drawLeft",
        "command_drawRight": "drawRight",
        "command_drawUp": "drawUp",
        "command_drawDown": "drawDown",
        "command_drawLeftFrom": "drawLeftFrom",
        "command_drawRightFrom": "drawRightFrom",
        "command_drawUpFrom": "drawUpFrom",
        "command_drawDownFrom": "drawDownFrom",
        "command_setColor": "setColor",
        "command_setCursor": "setCursor",
        "command_clearMark": "clearMark",
        "block_mark": "mark",
        "block_x": "x",
        "block_y": "y",
        "block_clear": "clear",
        "block_steps": "steps",
        "block_drawLeft": "drawLeft",
        "block_drawRight": "drawRight",
        "block_drawUp": "drawUp",
        "block_drawDown": "drawDown",
        "block_drawLeftFrom": "drawLeftFrom",
        "block_drawRightFrom": "drawRightFrom",
        "block_drawUpFrom": "drawUpFrom",
        "block_drawDownFrom": "drawDownFrom",
        "block_setColor": "setColor",
        "block_setCursor": "setCursor",
        "block_clearMark": "clearMark"
    };

    SceneGridCustomBlocks.addBlocks = function (labels) {
        if (initialized) {
            return;
        }

        if (labels === undefined) {
            labels = SceneGridCustomBlocks.DEFAULT_LABELS
        } else {
            labels = $.extend({}, SceneGridCustomBlocks.DEFAULT_LABELS, labels);
        }
        
        markBlock(labels);
        clearBlock(labels);
        drawLeftFromBlock(labels);
        drawRightFromBlock(labels);
        drawUpFromBlock(labels);
        drawDownFromBlock(labels);
        drawLeftBlock(labels);
        drawRightBlock(labels);
        drawUpBlock(labels);
        drawDownBlock(labels);
        setColorBlock(labels);
        setCursorBlock(labels);
        clearMarkBlock(labels);

        initialized = true;
    };

    function drawUpBlock(labels) {
        Blockly.Blocks['scene_grid_drawup'] = {
            init: function() {
                this.appendDummyInput()
                    .appendField(labels["block_drawUp"]);
                this.appendValueInput("steps")
                    .setCheck("Number")
                    .appendField(labels["block_steps"]);
                this.setInputsInline(true);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(120);
                this.setTooltip('');
                this.setHelpUrl('http://mauthor.com/doc/en/page/Blockly-Code-Editor');
            }
        };

        Blockly.JavaScript['scene_grid_drawup'] = function(block) {
            var value_steps = Blockly.JavaScript.valueToCode(block, 'steps', Blockly.JavaScript.ORDER_ATOMIC);
            var code = StringUtils.format("{0}({1});\n", labels["command_drawUp"], emptyAsUndefined(value_steps));
            return code;
        };
    }

    function drawDownBlock(labels) {
        Blockly.Blocks['scene_grid_drawdown'] = {
            init: function() {
                this.appendDummyInput()
                    .appendField(labels["block_drawDown"]);
                this.appendValueInput("steps")
                    .setCheck("Number")
                    .appendField(labels["block_steps"]);
                this.setInputsInline(true);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(150);
                this.setTooltip('');
                this.setHelpUrl('http://mauthor.com/doc/en/page/Blockly-Code-Editor');
            }
        };

        Blockly.JavaScript['scene_grid_drawdown'] = function(block) {
            var value_steps = Blockly.JavaScript.valueToCode(block, 'steps', Blockly.JavaScript.ORDER_ATOMIC);
            var code = StringUtils.format("{0}({1});\n", labels["command_drawDown"], emptyAsUndefined(value_steps));
            return code;
        };
    }

    function drawLeftBlock(labels) {
        Blockly.Blocks['scene_grid_drawleft'] = {
            init: function() {
                this.appendDummyInput()
                    .appendField(labels["block_drawLeft"]);
                this.appendValueInput("steps")
                    .setCheck("Number")
                    .appendField(labels["block_steps"]);
                this.setInputsInline(true);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(195);
                this.setTooltip('');
                this.setHelpUrl('http://mauthor.com/doc/en/page/Blockly-Code-Editor');
            }
        };

        Blockly.JavaScript['scene_grid_drawleft'] = function(block) {
            var value_steps = Blockly.JavaScript.valueToCode(block, 'steps', Blockly.JavaScript.ORDER_ATOMIC);
            var code = StringUtils.format("{0}({1});\n", labels["command_drawLeft"], emptyAsUndefined(value_steps));
            return code;
        };
    }

    function drawRightBlock(labels) {
        Blockly.Blocks['scene_grid_drawright'] = {
            init: function() {
                this.appendDummyInput()
                    .appendField(labels["block_drawRight"]);
                this.appendValueInput("steps")
                    .setCheck("Number")
                    .appendField(labels["block_steps"]);
                this.setInputsInline(true);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(270);
                this.setTooltip('');
                this.setHelpUrl('http://mauthor.com/doc/en/page/Blockly-Code-Editor');
            }
        };

        Blockly.JavaScript['scene_grid_drawright'] = function(block) {
            var value_steps = Blockly.JavaScript.valueToCode(block, 'steps', Blockly.JavaScript.ORDER_ATOMIC);
            var code = StringUtils.format("{0}({1});\n", labels["command_drawRight"], emptyAsUndefined(value_steps));
            return code;
        };
    }

    function markBlock(labels) {
        Blockly.Blocks['scene_grid_mark'] = {
            init: function() {
                this.appendDummyInput()
                    .appendField(labels["block_mark"]);
                this.appendValueInput("x")
                    .setCheck("Number")
                    .setAlign(Blockly.ALIGN_CENTRE)
                    .appendField(labels["block_x"]);
                this.appendValueInput("y")
                    .setCheck("Number")
                    .setAlign(Blockly.ALIGN_CENTRE)
                    .appendField(labels["block_y"]);
                this.setInputsInline(true);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(260);
                this.setTooltip('');
                this.setHelpUrl('http://mauthor.com/doc/en/page/Blockly-Code-Editor');
            }
        };

        Blockly.JavaScript['scene_grid_mark'] = function(block) {
            var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
            var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
            var code = StringUtils.format("{0}({1}, {2});\n", labels.command_mark, emptyAsUndefined(value_x), emptyAsUndefined(value_y));
            return code;
        };
    }

    function clearBlock (labels) {
        Blockly.Blocks['scene_grid_clear'] = {
            init: function() {
                this.appendDummyInput()
                    .appendField(labels["block_clear"]);
                this.setColour(0);
                this.setTooltip('');
                this.setHelpUrl('http://mauthor.com/doc/en/page/Blockly-Code-Editor');
            }
        };

        Blockly.JavaScript['scene_grid_clear'] = function(block) {
            var code = StringUtils.format('{0}();\n', labels.command_clear);
            return code;
        };
    }

    function drawLeftFromBlock (labels) {
        Blockly.Blocks['scene_grid_drawleftfrom'] = {
            init: function() {
                this.appendDummyInput()
                    .appendField(labels["block_drawLeftFrom"]);
                this.appendValueInput("x")
                    .setCheck("Number")
                    .appendField(labels["block_x"]);
                this.appendValueInput("y")
                    .setCheck("Number")
                    .appendField(labels["block_y"]);
                this.appendValueInput("steps")
                    .setCheck("Number")
                    .appendField(labels["block_steps"]);
                this.setInputsInline(true);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(195);
                this.setTooltip('');
                this.setHelpUrl('http://mauthor.com/doc/en/page/Blockly-Code-Editor');
            }
        };

        Blockly.JavaScript['scene_grid_drawleftfrom'] = function(block) {
            var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
            var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
            var value_steps = Blockly.JavaScript.valueToCode(block, 'steps', Blockly.JavaScript.ORDER_ATOMIC);
            var code = StringUtils.format("{0}({1}, {2}, {3});\n", labels["command_drawLeftFrom"], emptyAsUndefined(value_x), emptyAsUndefined(value_y), emptyAsUndefined(value_steps));
            return code;
        };
    }

    function drawRightFromBlock (labels) {
        Blockly.Blocks['scene_grid_drawrightfrom'] = {
            init: function() {
                this.appendDummyInput()
                    .appendField(labels["block_drawRightFrom"]);
                this.appendValueInput("x")
                    .setCheck("Number")
                    .appendField(labels["block_x"]);
                this.appendValueInput("y")
                    .setCheck("Number")
                    .appendField(labels["block_y"]);
                this.appendValueInput("steps")
                    .setCheck("Number")
                    .appendField(labels["block_steps"]);
                this.setInputsInline(true);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(270);
                this.setTooltip('');
                this.setHelpUrl('http://mauthor.com/doc/en/page/Blockly-Code-Editor');
            }
        };

        Blockly.JavaScript['scene_grid_drawrightfrom'] = function(block) {
            var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
            var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
            var value_steps = Blockly.JavaScript.valueToCode(block, 'steps', Blockly.JavaScript.ORDER_ATOMIC);
            var code = StringUtils.format("{0}({1}, {2}, {3});\n", labels["command_drawRightFrom"], emptyAsUndefined(value_x), emptyAsUndefined(value_y), emptyAsUndefined(value_steps));
            return code;
        };
    }

    function drawUpFromBlock(labels) {
        Blockly.Blocks['scene_grid_drawupfrom'] = {
            init: function() {
                this.appendDummyInput()
                    .appendField(labels["block_drawUpFrom"]);
                this.appendValueInput("x")
                    .setCheck("Number")
                    .appendField(labels["block_x"]);
                this.appendValueInput("y")
                    .setCheck("Number")
                    .appendField(labels["block_y"]);
                this.appendValueInput("steps")
                    .setCheck("Number")
                    .appendField(labels["block_steps"]);
                this.setInputsInline(true);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(120);
                this.setTooltip('');
                this.setHelpUrl('http://mauthor.com/doc/en/page/Blockly-Code-Editor');
            }
        };

        Blockly.JavaScript['scene_grid_drawupfrom'] = function(block) {
            var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
            var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
            var value_steps = Blockly.JavaScript.valueToCode(block, 'steps', Blockly.JavaScript.ORDER_ATOMIC);
            var code = StringUtils.format("{0}({1}, {2}, {3});\n", labels["command_drawUpFrom"], emptyAsUndefined(value_x), emptyAsUndefined(value_y), emptyAsUndefined(value_steps));
            return code;
        };
    }

    function drawDownFromBlock(labels) {
        Blockly.Blocks['scene_grid_drawdownfrom'] = {
            init: function() {
                this.appendDummyInput()
                    .appendField(labels["block_drawDownFrom"]);
                this.appendValueInput("x")
                    .setCheck("Number")
                    .appendField(labels["block_x"]);
                this.appendValueInput("y")
                    .setCheck("Number")
                    .appendField(labels["block_y"]);
                this.appendValueInput("steps")
                    .setCheck("Number")
                    .appendField(labels["block_steps"]);
                this.setInputsInline(true);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(150);
                this.setTooltip('');
                this.setHelpUrl('http://mauthor.com/doc/en/page/Blockly-Code-Editor');
            }
        };

        Blockly.JavaScript['scene_grid_drawdownfrom'] = function(block) {
            var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
            var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
            var value_steps = Blockly.JavaScript.valueToCode(block, 'steps', Blockly.JavaScript.ORDER_ATOMIC);
            var code = StringUtils.format("{0}({1}, {2}, {3});\n", labels["command_drawDownFrom"], emptyAsUndefined(value_x), emptyAsUndefined(value_y), emptyAsUndefined(value_steps));
            return code;
        };
    }

    function setColorBlock(labels) {
        Blockly.Blocks['scene_grid_setcolor'] = {
            init: function() {
                this.appendDummyInput()
                    .appendField(labels["block_setColor"]);
                this.appendValueInput("color")
                    .setCheck("String")
                    .appendField(labels["color"]);
                this.setInputsInline(true);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(300);
                this.setTooltip('');
                this.setHelpUrl('http://mauthor.com/doc/en/page/Blockly-Code-Editor');
            }
        };

        Blockly.JavaScript['scene_grid_setcolor'] = function(block) {
            var value_color = Blockly.JavaScript.valueToCode(block, 'color', Blockly.JavaScript.ORDER_ATOMIC);
            var code = StringUtils.format("{0}({1});\n", labels["command_setColor"], value_color);
            var code = StringUtils.format('setColor({0});\n', value_color);
            return code;
        };
    }

    function setCursorBlock(labels) {
        Blockly.Blocks['scene_grid_setcursor'] = {
            init: function() {
                this.appendDummyInput()
                    .appendField(labels["block_setCursor"]);
                this.appendValueInput("x")
                    .setCheck("Number")
                    .appendField(labels["block_x"]);
                this.appendValueInput("y")
                    .setCheck("Number")
                    .appendField(labels["block_y"]);
                this.setInputsInline(true);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(300);
                this.setTooltip('');
                this.setHelpUrl('http://mauthor.com/doc/en/page/Blockly-Code-Editor');
            }
        };

        Blockly.JavaScript['scene_grid_setcursor'] = function(block) {
            var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
            var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
            var code = StringUtils.format("{0}({1}, {2});\n", labels["command_setCursor"], emptyAsUndefined(value_x), emptyAsUndefined(value_y));
            return code;
        };
    }

    function clearMarkBlock(labels) {
        Blockly.Blocks['scene_grid_clearmark'] = {
            init: function() {
                this.appendDummyInput()
                    .appendField(labels["block_clearMark"]);
                this.appendValueInput("x")
                    .setCheck("Number")
                    .appendField(labels["block_x"]);
                this.appendValueInput("y")
                    .setCheck("Number")
                    .appendField(labels["block_y"]);
                this.setInputsInline(true);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(210);
                this.setTooltip('');
                this.setHelpUrl('http://mauthor.com/doc/en/page/Blockly-Code-Editor');
            }
        };

        Blockly.JavaScript['scene_grid_clearmark'] = function(block) {
            var value_x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
            var value_y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
            var code = StringUtils.format("{0}({1}, {2});\n", labels["command_clearMark"], emptyAsUndefined(value_x), emptyAsUndefined(value_y));
            return code;
        };
    }

    window.BlocklyCustomBlocks = window.BlocklyCustomBlocks || {};
    window.BlocklyCustomBlocks.SceneGrid = window.BlocklyCustomBlocks.SceneGrid || SceneGridCustomBlocks;
})(window);