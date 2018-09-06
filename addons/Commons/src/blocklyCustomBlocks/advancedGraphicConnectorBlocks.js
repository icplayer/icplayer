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
        "Advanced_Graphic_Connector_correct_answer": "Correct answer",
        "Advanced_Graphic_Connector_play": "Play",
        "Advanced_Graphic_Connector_stop": "Stop",
        "Advanced_Graphic_Connector_seek": "Seek",
        "Advanced_Graphic_Connector_time": "Time:",
        "Advanced_Graphic_Connector_show_subtitles": "Show subtitles",
        "Advanced_Graphic_Connector_hide_subtitles": "Hide subtitles",
        "Advanced_Graphic_Connector_next": "Next",
        "Advanced_Graphic_Connector_prev": "Previous",
        "Advanced_Graphic_Connector_jump_to": "Jump to",
        "Advanced_Graphic_Connector_number": "Number:",
        "Advanced_Graphic_Connector_playing": "Playing",
        "Advanced_Graphic_Connector_finished_playing": "Finished playing",
        "Advanced_Graphic_Connector_pause": "Pause",
        "Advanced_Graphic_Connector_paused": "Paused",
        "Advanced_Graphic_Connector_set_default": "Set default",
        "Advanced_Graphic_Connector_change": "Change",
        "Advanced_Graphic_Connector_enable": "Enable",
        "Advanced_Graphic_Connector_disable": "Disable",
        "Advanced_Graphic_Connector_enable_all": "Enable all",
        "Advanced_Graphic_Connector_disable_all": "Disable all",
        "Advanced_Graphic_Connector_gap_index": "Gap index:",
        "Advanced_Graphic_Connector_mark_as_correct": "Mark as correct",
        "Advanced_Graphic_Connector_mark_as_wrong": "Mark as wrong",
        "Advanced_Graphic_Connector_mark_as_empty": "Mark as empty",
        "Advanced_Graphic_Connector_set_text": "Set text",
        "Advanced_Graphic_Connector_reset": "Reset",
        "Advanced_Graphic_Connector_index": "Index:",
        "Advanced_Graphic_Connector_original_index": "Original index:",
        "Advanced_Graphic_Connector_new_index": "New index:",
        "Advanced_Graphic_Connector_row": "Row:",
        "Advanced_Graphic_Connector_true_false_event": "True False event",
        "Advanced_Graphic_Connector_column": "Column:",
        "Advanced_Graphic_Connector_selection": "Selection:",
        "Advanced_Graphic_Connector_selected": "Selected",
        "Advanced_Graphic_Connector_deselected": "Deselected",
        "Advanced_Graphic_Connector_none": "None",
        "Advanced_Graphic_Connector_connection_event": "Connection Event",
        "Advanced_Graphic_Connector_true": "True",
        "Advanced_Graphic_Connector_false": "False",
        "Advanced_Graphic_Connector_connected": "Connected",
        "Advanced_Graphic_Connector_first_item_id": "First item id:",
        "Advanced_Graphic_Connector_second_item_id": "Second item id:",
        "Advanced_Graphic_Connector_text_event": "Text Event",
        "Advanced_Graphic_Connector_choice_event": "Choice Event"

    };

    agcCustomBlocks.addBlocks = function(labels) {
        if(labels == null) {
            labels = this.DEFAULT_LABELS;
        }
        createSourceModuleBlock(labels);
        createFeedbackModuleBlock(labels);
        createCustomBlocks(labels);
        createVideoBlocks(labels);
        createAudioBlocks(labels);
        createFeedbackBlocks(labels);
        createTextBlocks(labels);
        createChoiceBlocks(labels);
        createConnectionBlocks(labels);
        createOrderingBlocks(labels);
        createTrueFalseBlocks(labels);

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

    function createCustomBlocks(labels) {
        createCustomEventBlock(labels);
        createCustomActionBlock(labels);
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

    function createVideoBlocks(labels) {
        createMethodCallBlock('agc_show', 'show', labels.Advanced_Graphic_Connector_show, []);
        createMethodCallBlock('agc_hide', 'hide', labels.Advanced_Graphic_Connector_hide, []);
        createMethodCallBlock('agc_play', 'play', labels.Advanced_Graphic_Connector_play, []);
        createMethodCallBlock('agc_stop', 'stop', labels.Advanced_Graphic_Connector_stop, []);
        createMethodCallBlock('agc_next', 'next', labels.Advanced_Graphic_Connector_next, []);
        createMethodCallBlock('agc_prev', 'previous', labels.Advanced_Graphic_Connector_prev, []);
        createMethodCallBlock('agc_seek', 'seek', labels.Advanced_Graphic_Connector_seek, [labels.Advanced_Graphic_Connector_time]);
        createMethodCallBlock('agc_show_subs', 'showSubtitles', labels.Advanced_Graphic_Connector_show_subtitles, []);
        createMethodCallBlock('agc_hide_subs', 'hideSubtitles', labels.Advanced_Graphic_Connector_hide_subtitles, []);
        createMethodCallBlock('agc_jump_to', 'jumpTo', labels.Advanced_Graphic_Connector_jump_to, [labels.Advanced_Graphic_Connector_number]);
        createMethodCallBlock('agc_jump_to_id', 'jumpToID', labels.Advanced_Graphic_Connector_jump_to, [labels.Advanced_Graphic_Connector_id]);
        createEventBlock('agc_video_ended',labels.Advanced_Graphic_Connector_finished_playing, {item: labels.Advanced_Graphic_Connector_number}, {value: 'ended'});
        createEventBlock('agc_video_playing',labels.Advanced_Graphic_Connector_playing, {}, {value: 'playing'});
    }

    function createAudioBlocks(labels) {
        createMethodCallBlock('agc_pause', 'pause', labels.Advanced_Graphic_Connector_pause, []);
        createEventBlock('agc_audio_ended',labels.Advanced_Graphic_Connector_finished_playing, {}, {item: 'end'});
        createEventBlock('agc_audio_paused',labels.Advanced_Graphic_Connector_paused, {}, {value: 'pause'});
    }

    function createFeedbackBlocks(labels) {
        createMethodCallBlock('agc_feedback_set_def', 'setDefaultResponse', labels.Advanced_Graphic_Connector_set_default, []);
        createMethodCallBlock('agc_feedback_change', 'change', labels.Advanced_Graphic_Connector_change, [labels.Advanced_Graphic_Connector_id]);
    }

    function createTextBlocks(labels) {
        createMethodCallBlock('agc_enable_gap', 'enableGap', labels.Advanced_Graphic_Connector_enable, [labels.Advanced_Graphic_Connector_gap_index]);
        createMethodCallBlock('agc_enable_gaps', 'enableAllGaps', labels.Advanced_Graphic_Connector_enable_all, []);
        createMethodCallBlock('agc_disable_gap', 'disableGap', labels.Advanced_Graphic_Connector_disable, [labels.Advanced_Graphic_Connector_gap_index]);
        createMethodCallBlock('agc_disable_gaps', 'disableAllGaps', labels.Advanced_Graphic_Connector_disable_all, []);
        createMethodCallBlock('agc_text_mark_correct', 'markGapAsCorrect', labels.Advanced_Graphic_Connector_mark_as_correct, [labels.Advanced_Graphic_Connector_gap_index]);
        createMethodCallBlock('agc_text_mark_wrong', 'markGapAsWrong', labels.Advanced_Graphic_Connector_mark_as_wrong, [labels.Advanced_Graphic_Connector_gap_index]);
        createMethodCallBlock('agc_text_mark_empty', 'markGapAsEmpty', labels.Advanced_Graphic_Connector_mark_as_empty, [labels.Advanced_Graphic_Connector_gap_index]);
        createMethodCallBlock('agc_text_set_text', 'setText', labels.Advanced_Graphic_Connector_set_text, [labels.Advanced_Graphic_Connector_value]);
        createEventBlock('agc_text_correct_gap',labels.Advanced_Graphic_Connector_correct_answer, {item: labels.Advanced_Graphic_Connector_gap_index}, {score: 1});
        createEventBlock('agc_text_wrong_gap',labels.Advanced_Graphic_Connector_wrong_answer, {item: labels.Advanced_Graphic_Connector_gap_index}, {score: 0});
        createEventBlock('agc_text_event',labels.Advanced_Graphic_Connector_text_event, {
            item: labels.Advanced_Graphic_Connector_gap_index,
            value: labels.Advanced_Graphic_Connector_value,
            score: labels.Advanced_Graphic_Connector_score
        }, {});
    }

    function createChoiceBlocks(labels) {
        createMethodCallBlock('agc_disable', 'disable', labels.Advanced_Graphic_Connector_disable, []);
        createMethodCallBlock('agc_enable', 'enable', labels.Advanced_Graphic_Connector_enable, []);
        createMethodCallBlock('agc_reset', 'reset', labels.Advanced_Graphic_Connector_reset, []);
        createMethodCallBlock('agc_choice_mark_correct', 'markOptionAsCorrect', labels.Advanced_Graphic_Connector_mark_as_correct, [labels.Advanced_Graphic_Connector_index]);
        createMethodCallBlock('agc_choice_mark_wrong', 'markOptionAsWrong', labels.Advanced_Graphic_Connector_mark_as_wrong, [labels.Advanced_Graphic_Connector_index]);
        createMethodCallBlock('agc_choice_mark_empty', 'markOptionAsEmpty', labels.Advanced_Graphic_Connector_mark_as_empty, [labels.Advanced_Graphic_Connector_index]);

        Blockly.Blocks['agc_choice_event'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_choice_event);
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_id)
                .appendField(new Blockly.FieldTextInput(""), "id");
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_selection)
                .appendField(new Blockly.FieldDropdown([
                    [labels.Advanced_Graphic_Connector_none,"-1"],
                    [labels.Advanced_Graphic_Connector_selected,"1"],
                    [labels.Advanced_Graphic_Connector_deselected,"0"]]),
                    "selection");
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_score)
                .appendField(new Blockly.FieldDropdown([
                    [labels.Advanced_Graphic_Connector_none,"-1"],
                    [labels.Advanced_Graphic_Connector_correct_answer,"1"],
                    [labels.Advanced_Graphic_Connector_wrong_answer,"0"]]),
                    "score");
            this.appendStatementInput("action")
                .setCheck("agc_feedback");
            this.setOutput(true, "agc_event");
            this.setColour(230);
         this.setTooltip("");
         this.setHelpUrl("");
          }
        };

        Blockly.JavaScript['agc_choice_event'] = function(block) {
            var text_id = block.getFieldValue('id');
          var dropdown_selection = block.getFieldValue('selection');
          var dropdown_score = block.getFieldValue('score');
          var statements_action = Blockly.JavaScript.statementToCode(block, 'action');
          var number_selection = Number(dropdown_selection);
          var number_score = Number(dropdown_score);

            var code = '';
            if (text_id.length > 0) {
                code += 'Item:' + text_id + '\n';
            }
            if (number_selection > -1) {
                code += 'Value:' + number_selection + '\n';
            }
            if (number_score > -1) {
                code += 'Score:' + number_score + '\n';
            }
            code += 'SCRIPTSTART\n';
            code += statements_action;
            code += 'SCRIPTEND\n';
            return [code, Blockly.JavaScript.ORDER_ATOMIC];
        };
    }

    function createConnectionBlocks(labels) {
        createEventBlock('agc_connection_new_correct',labels.Advanced_Graphic_Connector_correct_answer, {}, {score: 1, value: 1});
        createEventBlock('agc_connection_new_wrong',labels.Advanced_Graphic_Connector_wrong_answer, {}, {score: 0, value: 1});

        Blockly.Blocks['agc_connection_event'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_connection_event);
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_first_item_id)
                .appendField(new Blockly.FieldTextInput(""), "first");
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_second_item_id)
                .appendField(new Blockly.FieldTextInput(""), "second");
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_connected)
                .appendField(new Blockly.FieldDropdown([
                    [labels.Advanced_Graphic_Connector_none,"-1"],
                    [labels.Advanced_Graphic_Connector_true,"1"],
                    [labels.Advanced_Graphic_Connector_false,"0"]]),
                    "connection");
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_score)
                .appendField(new Blockly.FieldDropdown([
                    [labels.Advanced_Graphic_Connector_none,"-1"],
                    [labels.Advanced_Graphic_Connector_correct_answer,"1"],
                    [labels.Advanced_Graphic_Connector_wrong_answer,"0"]]),
                    "score");
            this.appendStatementInput("action")
                .setCheck("agc_feedback");
            this.setOutput(true, "agc_event");
            this.setColour(230);
         this.setTooltip("");
         this.setHelpUrl("");
          }
        };

        Blockly.JavaScript['agc_connection_event'] = function(block) {
          var text_first = block.getFieldValue('first');
          var text_second = block.getFieldValue('second');
          var dropdown_connection = block.getFieldValue('connection');
          var dropdown_score = block.getFieldValue('score');
          var statements_action = Blockly.JavaScript.statementToCode(block, 'action');
          var number_connection = Number(dropdown_connection);
          var number_score = Number(dropdown_score);

            var code = '';
            if (text_first.length > 0 && text_second.length > 0) {
                code += 'Item:'+text_first+'-'+text_second+'\n';
            }
            if (number_connection > -1) {
                code += 'Value:' + number_connection + '\n';
            }
            if (number_score > -1) {
                code += 'Score:' + number_score + '\n';
            }
            code += 'SCRIPTSTART\n';
            code += statements_action;
            code += 'SCRIPTEND\n';
            return [code, Blockly.JavaScript.ORDER_ATOMIC];
        };
    }

    function createOrderingBlocks(labels) {
        createEventBlock('agc_ordering_event',labels.Advanced_Graphic_Connector_correct_answer, {
            item: labels.Advanced_Graphic_Connector_original_index,
            value: labels.Advanced_Graphic_Connector_new_index,
            score: labels.Advanced_Graphic_Connector_score
        }, {});
    }

    function createTrueFalseBlocks(labels) {
        createEventBlock('agc_true_false_correct',labels.Advanced_Graphic_Connector_correct_answer, {}, {item: 'all'});

        Blockly.Blocks['agc_true_false_correct_row'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_correct_answer);
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_row)
                .appendField(new Blockly.FieldNumber(1), "row");
            this.appendStatementInput("action")
                .setCheck("agc_feedback");
            this.setOutput(true, "agc_event");
            this.setColour(230);
         this.setTooltip("");
         this.setHelpUrl("");
          }
        };

        Blockly.JavaScript['agc_true_false_correct_row'] = function(block) {
            var number_row = block.getFieldValue('row');
            var statements_action = Blockly.JavaScript.statementToCode(block, 'action');
            // TODO: Assemble JavaScript into code variable.
            var code = 'Item:'+number_row+'-all\n';
            code += 'SCRIPTSTART\n';
            code += statements_action;
            code += 'SCRIPTEND\n';
            return [code, Blockly.JavaScript.ORDER_ATOMIC];
        };

        Blockly.Blocks['agc_true_false_event'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_true_false_event);
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_row)
                .appendField(new Blockly.FieldNumber(0), "question");
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_column)
                .appendField(new Blockly.FieldNumber(0), "answer");
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_selection)
                .appendField(new Blockly.FieldDropdown([
                    [labels.Advanced_Graphic_Connector_none,"-1"],
                    [labels.Advanced_Graphic_Connector_selected,"1"],
                    [labels.Advanced_Graphic_Connector_deselected,"0"]]),
                    "selection");
            this.appendDummyInput()
                .appendField(labels.Advanced_Graphic_Connector_score)
                .appendField(new Blockly.FieldDropdown([
                    [labels.Advanced_Graphic_Connector_none,"-1"],
                    [labels.Advanced_Graphic_Connector_correct_answer,"1"],
                    [labels.Advanced_Graphic_Connector_wrong_answer,"0"]]),
                    "score");
            this.appendStatementInput("action")
                .setCheck("agc_feedback");
            this.setOutput(true, "agc_event");
            this.setColour(230);
         this.setTooltip("");
         this.setHelpUrl("");
          }
        };

        Blockly.JavaScript['agc_true_false_event'] = function(block) {
          var number_question = block.getFieldValue('question');
          var number_answer = block.getFieldValue('answer');
          var dropdown_selection = block.getFieldValue('selection');
          var dropdown_score = block.getFieldValue('score');
          var statements_action = Blockly.JavaScript.statementToCode(block, 'action');
          var number_selection = Number(dropdown_selection);
          var number_score = Number(dropdown_score);

            var code = '';
            if (number_question > 0 && number_answer > 0) {
                code += 'Item:'+number_question+'-'+number_answer+'\n';
            }
            if (number_selection > -1) {
                code += 'Value:' + number_selection + '\n';
            }
            if (number_score > -1) {
                code += 'Score:' + number_score + '\n';
            }
            code += 'SCRIPTSTART\n';
            code += statements_action;
            code += 'SCRIPTEND\n';
            return [code, Blockly.JavaScript.ORDER_ATOMIC];
        };
    }

    /*
    * Creates a blockly block for a method named methodName with argumentTitles.length arguments
    *
    * arguments:
    * blockID - id of the block in blockly
    * methodName - name of the method to be called
    * blockTitle - the title of the block, displayed at the top of it
    * argumentTitles - an array containing the titles of each input field in the block
    * */
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
                    if (!isNaN(arg)) {
                        args.push(arg);
                    } else {
                        args.push("'" + arg + "'");
                    }
                } else {
                    args.push("''");
                }
            }
            var code = methodName+'(' + args.join(',')+')';

          return [code, Blockly.JavaScript.ORDER_ATOMIC];
        };
    }

    /*
    * Creates a blockly block for the defined event
    *
    * valid field names for argumentDict and staticDict are: item, value, score, type, word
    * field names used in argumentDict and staticDict should not overlap
    *
    * arguments:
    * blockID - id of the block in blockly
    * blockTitle - the title of the block displayed on top of it
    * argumentDict - a dictionary of inputs, where keys are the field names and the values are their displayed Titles
    * staticDict - a dictionary of static values, where keys are the field names
    *
    * */
    function createEventBlock(blockID, blockTitle, argumentDict, staticDict) {
        Blockly.Blocks[blockID] = {
          init: function() {
            this.appendDummyInput()
                .appendField(blockTitle);
            var argumentKeys = Object.keys(argumentDict);
            for (var i = 0; i < argumentKeys.length; i++) {
                var key = argumentKeys[i];
                this.appendDummyInput()
                    .appendField(argumentDict[key])
                    .appendField(new Blockly.FieldTextInput(""), key);

            }
            this.appendStatementInput("Action")
                .setCheck("agc_feedback");
            this.setOutput(true, "agc_event");
            this.setColour(230);
         this.setTooltip("");
         this.setHelpUrl("");
          }
        };

        Blockly.JavaScript[blockID] = function (block) {
            var fields = {
              item: 'Item:',
              value: 'Value:',
              score: 'Score:',
              type: 'Type:',
              word: 'Word:'
            };

            var fieldKeys = Object.keys(fields);

            var args = {};
            for (var i = 0; i < fieldKeys.length; i++) {
                var key = fieldKeys[i];
                if (key in argumentDict) {
                    args[key] = block.getFieldValue(key);
                }
            }
            var statements_action = Blockly.JavaScript.statementToCode(block, 'Action');

            var code = '';
            for (var i = 0; i < fieldKeys.length; i++) {
                var key = fieldKeys[i];
                if ((key in args && args[key].trim().length > 0) || key in staticDict) {
                    if (key in args && args[key].trim().length > 0) {
                        var text_item = args[key];
                    } else {
                        var text_item = staticDict[key];
                    }
                    code += fields[key] + text_item + '\n';
                }
            }
            code += 'SCRIPTSTART\n';
            code += statements_action;
            code += 'SCRIPTEND\n';
            return [code, Blockly.JavaScript.ORDER_ATOMIC];
        };
    }

    window.BlocklyCustomBlocks = window.BlocklyCustomBlocks || {};
    window.BlocklyCustomBlocks.AGC = window.BlocklyCustomBlocks.AGC || agcCustomBlocks;

})(window);