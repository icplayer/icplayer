(function (window) {

    var agcCustomBlocks = function(){};

    agcCustomBlocks.DEFAULT_LABELS = {
        "Advanced_Graphic_Connector_source_module": "Source module",
        "Advanced_Graphic_Connector_id": "ID:",
        "Advanced_Graphic_Connector_custom_event": "Custom event",
        "Advanced_Graphic_Connector_item": "Item:",
        "Advanced_Graphic_Connector_value": "Value:",
        "Advanced_Graphic_Connector_score": "Score:",
        "Advanced_Graphic_Connector_type": "Type:",
        "Advanced_Graphic_Connector_word": "Word:",
        "Advanced_Graphic_Connector_feedback_module": "Feedback module",
        "Advanced_Graphic_Connector_custom_action": "Custom action",
        "Advanced_Graphic_Connector_script": "Script:",
        "Advanced_Graphic_Connector_show": "Show module",
        "Advanced_Graphic_Connector_hide": "Hide module",
        "Advanced_Graphic_Connector_wrong_answer": "Wrong answer",
        "Advanced_Graphic_Connector_play": "Play",
        "Advanced_Graphic_Connector_stop": "Stop",
        "Advanced_Graphic_Connector_seek": "Seek",
        "Advanced_Graphic_Connector_time": "Time:"
    };

    agcCustomBlocks.addBlocks = function(labels) {
        if(labels == null) {
            labels = this.DEFAULT_LABELS;
        }
        createSourceModuleBlock(labels);
        createCustomEventBlock(labels);
        createFeedbackModuleBlock(labels);
        createCustomActionBlock(labels);
        createWrongAnswerBlock(labels);
        createVideoBlocks(labels);

    };

    function createSourceModuleBlock(labels) {
        // SOURCE MODULE
        Blockly.Blocks['agc_source_module'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_source_module);
            this.appendValueInput("event")
                .setCheck("agc_event")
                .appendField(labels.Advanced_Graphic_Connector_id)
                .appendField(new Blockly.FieldTextInput("module1"), "ID");
            this.setColour(120);
         this.setTooltip("");
         this.setHelpUrl("");
          }
        };

        Blockly.JavaScript['agc_source_module'] = function(block) {
          var text_id = block.getFieldValue('ID');
          var value_event = Blockly.JavaScript.valueToCode(block, 'event', Blockly.JavaScript.ORDER_ATOMIC);
           var code = '\nEVENTSTART\n';
            code += 'Source:' + text_id + '\n';
            code += value_event;
            code += 'EVENTEND\n';
          return code;
        };
    }

    function createCustomEventBlock(labels) {
        // CUSTOM EVENT
        Blockly.Blocks['agc_custom_event'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_custom_event);
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_item)
                .appendField(new Blockly.FieldTextInput(""), "item");
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_value)
                .appendField(new Blockly.FieldTextInput(""), "value");
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_score)
                .appendField(new Blockly.FieldTextInput(""), "score");
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_type)
                .appendField(new Blockly.FieldTextInput(""), "type");
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_word)
                .appendField(new Blockly.FieldTextInput(""), "word");
            this.appendStatementInput("Action")
                .setCheck("agc_feedback");
            this.setOutput(true, "agc_event");
            this.setColour(230);
         this.setTooltip("");
         this.setHelpUrl("");
          }
        };

        Blockly.JavaScript['agc_custom_event'] = function (block) {
            var text_item = block.getFieldValue('item');
            var text_value = block.getFieldValue('value');
            var text_score = block.getFieldValue('score');
            var text_type = block.getFieldValue('type');
            var text_word = block.getFieldValue('word');
            var statements_action = Blockly.JavaScript.statementToCode(block, 'Action');
            var code = '';
            if(text_item.trim().length > 0) {
                code += 'Item:' + text_item + '\n';
            }
            if(text_value.trim().length > 0) {
                code += 'Value:' + text_value + '\n';
            }
            if(text_score.trim().length > 0) {
                code += 'Score:' + text_score + '\n';
            }
            if(text_type.trim().length > 0) {
                code += 'Type:' + text_type + '\n';
            }
            if(text_word.trim().length > 0) {
                code += 'Word:' + text_word + '\n';
            }
            code += 'SCRIPTSTART\n';
            code += statements_action;
            code += 'SCRIPTEND\n';
            return [code, Blockly.JavaScript.ORDER_ATOMIC];
        };
    }

    function createFeedbackModuleBlock(labels) {
        Blockly.Blocks['agc_feedback_module'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_feedback_module);
            this.appendValueInput("action")
                .setCheck("agc_action")
                .appendField(labels.Advanced_Graphic_Connector_id)
                .appendField(new Blockly.FieldTextInput("module2"), "id");
            this.setPreviousStatement(true, "agc_feedback");
            this.setNextStatement(true, "agc_feedback");
            this.setColour(20);
         this.setTooltip("");
         this.setHelpUrl("");
          }
        };

        Blockly.JavaScript['agc_feedback_module'] = function(block) {
          var text_id = block.getFieldValue('id');
          var value_action = Blockly.JavaScript.valueToCode(block, 'action', Blockly.JavaScript.ORDER_ATOMIC);
          var code = "presenter.playerController.getModule('" + text_id +"')."+value_action+";\n";
          return code;
        };
    }

    function createCustomActionBlock(labels) {
        //CUSTOM ACTION
        Blockly.Blocks['agc_custom_action'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_custom_action);
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_script)
                .appendField(new Blockly.FieldTextInput(""), "script");
            this.setOutput(true, "agc_action");
            this.setColour(290);
         this.setTooltip("");
         this.setHelpUrl("");
          }
        };

        Blockly.JavaScript['agc_custom_action'] = function(block) {
          var text_script = block.getFieldValue('script');
          return [text_script, Blockly.JavaScript.ORDER_ATOMIC];
        };
    }

    function createWrongAnswerBlock(labels) {
        // CUSTOM EVENT
        Blockly.Blocks['agc_wrong_answer_event'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_wrong_answer);
            this.appendStatementInput("Action")
                .setCheck("agc_feedback");
            this.setOutput(true, "agc_event");
            this.setColour(230);
         this.setTooltip("");
         this.setHelpUrl("");
          }
        };

        Blockly.JavaScript['agc_wrong_answer_event'] = function (block) {
            var statements_action = Blockly.JavaScript.statementToCode(block, 'Action');
            var code = 'Score: 0\n';
            code += 'SCRIPTSTART\n';
            code += statements_action;
            code += 'SCRIPTEND\n';
            return [code, Blockly.JavaScript.ORDER_ATOMIC];
        };
    }

    function createVideoBlocks(labels) {
        createMethodCallBlock('agc_show', 'show', labels.Advanced_Graphic_Connector_show, []);
        createMethodCallBlock('agc_hide', 'hide', labels.Advanced_Graphic_Connector_hide, []);
        createMethodCallBlock('agc_play', 'play', labels.Advanced_Graphic_Connector_play, []);
        createMethodCallBlock('agc_stop', 'stop', labels.Advanced_Graphic_Connector_stop, []);
        createMethodCallBlock('agc_seek', 'seek', labels.Advanced_Graphic_Connector_seek, [labels.Advanced_Graphic_Connector_time]);
    }

    function createMethodCallBlock(blockID, methodName, blockTitle, argumentTitles) {
        Blockly.Blocks[blockID] = {
          init: function() {
            this.appendDummyInput()
                .appendField(blockTitle);
            for (var i = 0; i< argumentTitles.length; i++) {
                this.appendDummyInput()
                    .appendField(argumentTitles[i])
                    .appendField(new Blockly.FieldTextInput(""), i + '#' + argumentTitles[i]);
            }

            this.setOutput(true, "agc_action");
            this.setColour(290);
         this.setTooltip("");
         this.setHelpUrl("");
          }
        };

        Blockly.JavaScript[blockID] = function(block) {
            var args = [];
            for (var i = 0; i < argumentTitles.length; i++) {
                var arg = block.getFieldValue(i + '#' + argumentTitles[i]);
                if (arg != null && arg.length > 0) {
                    args.push(arg);
                } else {
                    args.push("''");
                }
            }
            var code = methodName+'(' + args.join(',')+')';

          return [code, Blockly.JavaScript.ORDER_ATOMIC];
        };
    }

    window.BlocklyCustomBlocks = window.BlocklyCustomBlocks || {};
    window.BlocklyCustomBlocks.AGC = window.BlocklyCustomBlocks.AGC || agcCustomBlocks;

})(window);