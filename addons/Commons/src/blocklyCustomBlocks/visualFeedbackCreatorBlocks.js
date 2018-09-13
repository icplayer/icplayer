(function (window) {

    var agcCustomBlocks = function(){};

    var statementSeperator = '&statementSeperator&';

    agcCustomBlocks.DEFAULT_LABELS = {
        "Visual_Feedback_Creator_source_module": "Source module",
        "Visual_Feedback_Creator_id": "ID:",
        "Visual_Feedback_Creator_custom_event": "Custom event",
        "Visual_Feedback_Creator_item": "Item:",
        "Visual_Feedback_Creator_value": "Value:",
        "Visual_Feedback_Creator_score": "Score:",
        "Visual_Feedback_Creator_type": "Type:",
        "Visual_Feedback_Creator_word": "Word:",
        "Visual_Feedback_Creator_feedback_module": "Feedback module",
        "Visual_Feedback_Creator_custom_action": "Custom action",
        "Visual_Feedback_Creator_script": "Script:",
        "Visual_Feedback_Creator_show": "Show module",
        "Visual_Feedback_Creator_hide": "Hide module",
        "Visual_Feedback_Creator_wrong_answer": "Wrong answer",
        "Visual_Feedback_Creator_correct_answer": "Correct answer",
        "Visual_Feedback_Creator_play": "Play",
        "Visual_Feedback_Creator_stop": "Stop",
        "Visual_Feedback_Creator_seek": "Seek",
        "Visual_Feedback_Creator_time": "Time:",
        "Visual_Feedback_Creator_show_subtitles": "Show subtitles",
        "Visual_Feedback_Creator_hide_subtitles": "Hide subtitles",
        "Visual_Feedback_Creator_next": "Next",
        "Visual_Feedback_Creator_prev": "Previous",
        "Visual_Feedback_Creator_jump_to": "Jump to",
        "Visual_Feedback_Creator_number": "Number:",
        "Visual_Feedback_Creator_playing": "Playing",
        "Visual_Feedback_Creator_finished_playing": "Finished playing",
        "Visual_Feedback_Creator_pause": "Pause",
        "Visual_Feedback_Creator_paused": "Paused",
        "Visual_Feedback_Creator_set_default": "Set default",
        "Visual_Feedback_Creator_change": "Change",
        "Visual_Feedback_Creator_enable": "Enable",
        "Visual_Feedback_Creator_disable": "Disable",
        "Visual_Feedback_Creator_enable_all": "Enable all",
        "Visual_Feedback_Creator_disable_all": "Disable all",
        "Visual_Feedback_Creator_gap_index": "Gap index:",
        "Visual_Feedback_Creator_mark_as_correct": "Mark as correct",
        "Visual_Feedback_Creator_mark_as_wrong": "Mark as wrong",
        "Visual_Feedback_Creator_mark_as_empty": "Mark as empty",
        "Visual_Feedback_Creator_set_text": "Set text",
        "Visual_Feedback_Creator_reset": "Reset",
        "Visual_Feedback_Creator_index": "Index:",
        "Visual_Feedback_Creator_original_index": "Original index:",
        "Visual_Feedback_Creator_new_index": "New index:",
        "Visual_Feedback_Creator_row": "Row:",
        "Visual_Feedback_Creator_true_false_event": "True False event",
        "Visual_Feedback_Creator_column": "Column:",
        "Visual_Feedback_Creator_selection": "Selection:",
        "Visual_Feedback_Creator_selected": "Selected",
        "Visual_Feedback_Creator_deselected": "Deselected",
        "Visual_Feedback_Creator_none": "None",
        "Visual_Feedback_Creator_connection_event": "Connection Event",
        "Visual_Feedback_Creator_true": "True",
        "Visual_Feedback_Creator_false": "False",
        "Visual_Feedback_Creator_connected": "Connected",
        "Visual_Feedback_Creator_first_item_id": "First item id:",
        "Visual_Feedback_Creator_second_item_id": "Second item id:",
        "Visual_Feedback_Creator_text_event": "Text Event",
        "Visual_Feedback_Creator_choice_event": "Choice Event",
        "Visual_Feedback_Creator_source_event": "Source Event",
        "Visual_Feedback_Creator_check": "Check",
        "Visual_Feedback_Creator_uncheck": "Uncheck",
        "Visual_Feedback_Creator_reset": "Reset"

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
        Blockly.Blocks['vfc_source_module'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_source_module);
            this.appendValueInput("event")
                .setCheck("vfc_event")
                .appendField(labels.Visual_Feedback_Creator_id)
                .appendField(new Blockly.FieldTextInput("module1"), "ID");
            this.setColour(120);
         this.setTooltip("");
         this.setHelpUrl("");
          }
        };

        Blockly.JavaScript['vfc_source_module'] = function(block) {
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
        createSourceEventBlock(labels);
    }

    function createCustomEventBlock(labels) {
        // CUSTOM EVENT
        Blockly.Blocks['vfc_custom_event'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_custom_event);
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_item)
                .appendField(new Blockly.FieldTextInput(""), "item");
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_value)
                .appendField(new Blockly.FieldTextInput(""), "value");
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_score)
                .appendField(new Blockly.FieldTextInput(""), "score");
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_type)
                .appendField(new Blockly.FieldTextInput(""), "type");
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_word)
                .appendField(new Blockly.FieldTextInput(""), "word");
            this.appendStatementInput("Action")
                .setCheck("vfc_feedback");
            this.setOutput(true, "vfc_event");
            this.setColour(230);
         this.setTooltip("");
         this.setHelpUrl("");
          }
        };

        Blockly.JavaScript['vfc_custom_event'] = function (block) {
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

    function createSourceEventBlock(labels) {
        Blockly.Blocks['vfc_source_event'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_source_event);
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown(
                    [[labels.Visual_Feedback_Creator_check,"check"],
                    [labels.Visual_Feedback_Creator_uncheck,"uncheck"],
                    [labels.Visual_Feedback_Creator_reset,"reset"]]), "event");
            this.appendStatementInput("action")
                .setCheck("vfc_feedback");
            this.setColour(230);
         this.setTooltip("");
         this.setHelpUrl("");
          }
        };

        Blockly.JavaScript['vfc_source_event'] = function(block) {
            var dropdown_event = block.getFieldValue('event');
            var statements_action = Blockly.JavaScript.statementToCode(block, 'action');

            var code = '\nEVENTSTART\n';
            switch (dropdown_event) {
                case 'check':
                    code += 'Name:Check\n';
                    break;
                case 'uncheck':
                    code += 'Name:Uncheck\n';
                    break;
                case 'reset':
                    code += 'Name:Reset\n';
                    break;
            }
            code += 'SCRIPTSTART\n';
            code += statements_action;
            code += 'SCRIPTEND\n';
            code += 'EVENTEND\n';
            return code;
        };
    }

    function createFeedbackModuleBlock(labels) {
        Blockly.Blocks['vfc_feedback_module'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_feedback_module);
            this.appendStatementInput("action")
                .setCheck("vfc_action")
                .appendField(labels.Visual_Feedback_Creator_id)
                .appendField(new Blockly.FieldTextInput("module2"), "id");
            this.setPreviousStatement(true, "vfc_feedback");
            this.setNextStatement(true, "vfc_feedback");
            this.setColour(20);
         this.setTooltip("");
         this.setHelpUrl("");
          }
        };

        Blockly.JavaScript['vfc_feedback_module'] = function(block) {
          var text_id = block.getFieldValue('id');
          var statements_action = Blockly.JavaScript.statementToCode(block, 'action');

          var statements = statements_action.split(statementSeperator);

          var code = '';
          for (var i = 0; i < statements.length; i++) {
              var value_action = statements[i].trim();
              if (value_action.length == 0) continue;
              code += "presenter.playerController.getModule('" + text_id + "')." + value_action + ";\n";
          }
          return code;
        };
    }

    function createCustomActionBlock(labels) {
        //CUSTOM ACTION
        Blockly.Blocks['vfc_custom_action'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_custom_action);
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_script)
                .appendField(new Blockly.FieldTextInput(""), "script");
            this.setPreviousStatement(true, "vfc_action");
            this.setNextStatement(true, "vfc_action");
            this.setColour(290);
         this.setTooltip("");
         this.setHelpUrl("");
          }
        };

        Blockly.JavaScript['vfc_custom_action'] = function(block) {
          var text_script = block.getFieldValue('script');
          return text_script + statementSeperator;
        };
    }

    function createVideoBlocks(labels) {
        createMethodCallBlock('vfc_show', 'show', labels.Visual_Feedback_Creator_show, []);
        createMethodCallBlock('vfc_hide', 'hide', labels.Visual_Feedback_Creator_hide, []);
        createMethodCallBlock('vfc_play', 'play', labels.Visual_Feedback_Creator_play, []);
        createMethodCallBlock('vfc_stop', 'stop', labels.Visual_Feedback_Creator_stop, []);
        createMethodCallBlock('vfc_next', 'next', labels.Visual_Feedback_Creator_next, []);
        createMethodCallBlock('vfc_prev', 'previous', labels.Visual_Feedback_Creator_prev, []);
        createMethodCallBlock('vfc_seek', 'seek', labels.Visual_Feedback_Creator_seek, [labels.Visual_Feedback_Creator_time]);
        createMethodCallBlock('vfc_show_subs', 'showSubtitles', labels.Visual_Feedback_Creator_show_subtitles, []);
        createMethodCallBlock('vfc_hide_subs', 'hideSubtitles', labels.Visual_Feedback_Creator_hide_subtitles, []);
        createMethodCallBlock('vfc_jump_to', 'jumpTo', labels.Visual_Feedback_Creator_jump_to, [labels.Visual_Feedback_Creator_number]);
        createMethodCallBlock('vfc_jump_to_id', 'jumpToID', labels.Visual_Feedback_Creator_jump_to, [labels.Visual_Feedback_Creator_id]);
        createEventBlock('vfc_video_ended',labels.Visual_Feedback_Creator_finished_playing, {item: labels.Visual_Feedback_Creator_number}, {value: 'ended'});
        createEventBlock('vfc_video_playing',labels.Visual_Feedback_Creator_playing, {}, {value: 'playing'});
    }

    function createAudioBlocks(labels) {
        createMethodCallBlock('vfc_pause', 'pause', labels.Visual_Feedback_Creator_pause, []);
        createEventBlock('vfc_audio_ended',labels.Visual_Feedback_Creator_finished_playing, {}, {item: 'end'});
        createEventBlock('vfc_audio_paused',labels.Visual_Feedback_Creator_paused, {}, {value: 'pause'});
    }

    function createFeedbackBlocks(labels) {
        createMethodCallBlock('vfc_feedback_set_def', 'setDefaultResponse', labels.Visual_Feedback_Creator_set_default, []);
        createMethodCallBlock('vfc_feedback_change', 'change', labels.Visual_Feedback_Creator_change, [labels.Visual_Feedback_Creator_id]);
    }

    function createTextBlocks(labels) {
        createMethodCallBlock('vfc_enable_gap', 'enableGap', labels.Visual_Feedback_Creator_enable, [labels.Visual_Feedback_Creator_gap_index]);
        createMethodCallBlock('vfc_enable_gaps', 'enableAllGaps', labels.Visual_Feedback_Creator_enable_all, []);
        createMethodCallBlock('vfc_disable_gap', 'disableGap', labels.Visual_Feedback_Creator_disable, [labels.Visual_Feedback_Creator_gap_index]);
        createMethodCallBlock('vfc_disable_gaps', 'disableAllGaps', labels.Visual_Feedback_Creator_disable_all, []);
        createMethodCallBlock('vfc_text_mark_correct', 'markGapAsCorrect', labels.Visual_Feedback_Creator_mark_as_correct, [labels.Visual_Feedback_Creator_gap_index]);
        createMethodCallBlock('vfc_text_mark_wrong', 'markGapAsWrong', labels.Visual_Feedback_Creator_mark_as_wrong, [labels.Visual_Feedback_Creator_gap_index]);
        createMethodCallBlock('vfc_text_mark_empty', 'markGapAsEmpty', labels.Visual_Feedback_Creator_mark_as_empty, [labels.Visual_Feedback_Creator_gap_index]);
        createMethodCallBlock('vfc_text_set_text', 'setText', labels.Visual_Feedback_Creator_set_text, [labels.Visual_Feedback_Creator_value]);
        createEventBlock('vfc_text_correct_gap',labels.Visual_Feedback_Creator_correct_answer, {item: labels.Visual_Feedback_Creator_gap_index}, {score: 1});
        createEventBlock('vfc_text_wrong_gap',labels.Visual_Feedback_Creator_wrong_answer, {item: labels.Visual_Feedback_Creator_gap_index}, {score: 0});
        createEventBlock('vfc_text_event',labels.Visual_Feedback_Creator_text_event, {
            item: labels.Visual_Feedback_Creator_gap_index,
            value: labels.Visual_Feedback_Creator_value,
            score: labels.Visual_Feedback_Creator_score
        }, {});
    }

    function createChoiceBlocks(labels) {
        createMethodCallBlock('vfc_disable', 'disable', labels.Visual_Feedback_Creator_disable, []);
        createMethodCallBlock('vfc_enable', 'enable', labels.Visual_Feedback_Creator_enable, []);
        createMethodCallBlock('vfc_reset', 'reset', labels.Visual_Feedback_Creator_reset, []);
        createMethodCallBlock('vfc_choice_mark_correct', 'markOptionAsCorrect', labels.Visual_Feedback_Creator_mark_as_correct, [labels.Visual_Feedback_Creator_index]);
        createMethodCallBlock('vfc_choice_mark_wrong', 'markOptionAsWrong', labels.Visual_Feedback_Creator_mark_as_wrong, [labels.Visual_Feedback_Creator_index]);
        createMethodCallBlock('vfc_choice_mark_empty', 'markOptionAsEmpty', labels.Visual_Feedback_Creator_mark_as_empty, [labels.Visual_Feedback_Creator_index]);

        Blockly.Blocks['vfc_choice_event'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_choice_event);
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_id)
                .appendField(new Blockly.FieldTextInput(""), "id");
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_selection)
                .appendField(new Blockly.FieldDropdown([
                    [labels.Visual_Feedback_Creator_none,"-1"],
                    [labels.Visual_Feedback_Creator_selected,"1"],
                    [labels.Visual_Feedback_Creator_deselected,"0"]]),
                    "selection");
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_score)
                .appendField(new Blockly.FieldDropdown([
                    [labels.Visual_Feedback_Creator_none,"-1"],
                    [labels.Visual_Feedback_Creator_correct_answer,"1"],
                    [labels.Visual_Feedback_Creator_wrong_answer,"0"]]),
                    "score");
            this.appendStatementInput("action")
                .setCheck("vfc_feedback");
            this.setOutput(true, "vfc_event");
            this.setColour(230);
         this.setTooltip("");
         this.setHelpUrl("");
          }
        };

        Blockly.JavaScript['vfc_choice_event'] = function(block) {
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
        createEventBlock('vfc_connection_new_correct',labels.Visual_Feedback_Creator_correct_answer, {}, {score: 1, value: 1});
        createEventBlock('vfc_connection_new_wrong',labels.Visual_Feedback_Creator_wrong_answer, {}, {score: 0, value: 1});

        Blockly.Blocks['vfc_connection_event'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_connection_event);
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_first_item_id)
                .appendField(new Blockly.FieldTextInput(""), "first");
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_second_item_id)
                .appendField(new Blockly.FieldTextInput(""), "second");
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_connected)
                .appendField(new Blockly.FieldDropdown([
                    [labels.Visual_Feedback_Creator_none,"-1"],
                    [labels.Visual_Feedback_Creator_true,"1"],
                    [labels.Visual_Feedback_Creator_false,"0"]]),
                    "connection");
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_score)
                .appendField(new Blockly.FieldDropdown([
                    [labels.Visual_Feedback_Creator_none,"-1"],
                    [labels.Visual_Feedback_Creator_correct_answer,"1"],
                    [labels.Visual_Feedback_Creator_wrong_answer,"0"]]),
                    "score");
            this.appendStatementInput("action")
                .setCheck("vfc_feedback");
            this.setOutput(true, "vfc_event");
            this.setColour(230);
         this.setTooltip("");
         this.setHelpUrl("");
          }
        };

        Blockly.JavaScript['vfc_connection_event'] = function(block) {
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
        createEventBlock('vfc_ordering_event',labels.Visual_Feedback_Creator_correct_answer, {
            item: labels.Visual_Feedback_Creator_original_index,
            value: labels.Visual_Feedback_Creator_new_index,
            score: labels.Visual_Feedback_Creator_score
        }, {});
    }

    function createTrueFalseBlocks(labels) {
        createEventBlock('vfc_true_false_correct',labels.Visual_Feedback_Creator_correct_answer, {}, {item: 'all'});

        Blockly.Blocks['vfc_true_false_correct_row'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_correct_answer);
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_row)
                .appendField(new Blockly.FieldNumber(1), "row");
            this.appendStatementInput("action")
                .setCheck("vfc_feedback");
            this.setOutput(true, "vfc_event");
            this.setColour(230);
         this.setTooltip("");
         this.setHelpUrl("");
          }
        };

        Blockly.JavaScript['vfc_true_false_correct_row'] = function(block) {
            var number_row = block.getFieldValue('row');
            var statements_action = Blockly.JavaScript.statementToCode(block, 'action');
            var code = 'Item:'+number_row+'-all\n';
            code += 'SCRIPTSTART\n';
            code += statements_action;
            code += 'SCRIPTEND\n';
            return [code, Blockly.JavaScript.ORDER_ATOMIC];
        };

        Blockly.Blocks['vfc_true_false_event'] = {
          init: function() {
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_true_false_event);
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_row)
                .appendField(new Blockly.FieldNumber(0), "question");
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_column)
                .appendField(new Blockly.FieldNumber(0), "answer");
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_selection)
                .appendField(new Blockly.FieldDropdown([
                    [labels.Visual_Feedback_Creator_none,"-1"],
                    [labels.Visual_Feedback_Creator_selected,"1"],
                    [labels.Visual_Feedback_Creator_deselected,"0"]]),
                    "selection");
            this.appendDummyInput()
                .appendField(labels.Visual_Feedback_Creator_score)
                .appendField(new Blockly.FieldDropdown([
                    [labels.Visual_Feedback_Creator_none,"-1"],
                    [labels.Visual_Feedback_Creator_correct_answer,"1"],
                    [labels.Visual_Feedback_Creator_wrong_answer,"0"]]),
                    "score");
            this.appendStatementInput("action")
                .setCheck("vfc_feedback");
            this.setOutput(true, "vfc_event");
            this.setColour(230);
         this.setTooltip("");
         this.setHelpUrl("");
          }
        };

        Blockly.JavaScript['vfc_true_false_event'] = function(block) {
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

            this.setPreviousStatement(true, "vfc_action");
            this.setNextStatement(true, "vfc_action");
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

          return code+statementSeperator;
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
                .setCheck("vfc_feedback");
            this.setOutput(true, "vfc_event");
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