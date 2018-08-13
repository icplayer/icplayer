function AddonParagraph_Keyboard_create() {
    var presenter = function () {};
    presenter.editor = null;
    presenter.window = null;
    presenter.isVisibleValue = null;
    presenter.view = null;
    presenter.configuration = null;
    presenter.$view = null;
    presenter.jQueryTinyMCEHTML = null;
    presenter.$tinyMCEToolbar = null;
    presenter.$TinyMCEBody = null;
    presenter.eKeyboardButtons = [];
    var checkHeightCounter = 0;

    presenter.DEFAULTS = {
        TOOLBAR: 'bold italic underline numlist bullist alignleft aligncenter alignright alignjustify',
        FONT_FAMILY: 'Verdana,Arial,Helvetica,sans-serif',
        FONT_SIZE: '11px',
        BUTTON_WIDTH: 37,
        FORMAT_WIDTH: 85,
        STYLE_SELECT_NAME: "styleselect",
    };

    presenter.ALLOWED_TOOLBAR_BUTTONS = 'customBold customUnderline customItalic newdocument bold italic underline strikethrough alignleft aligncenter '+
        'alignright alignjustify styleselect formatselect fontselect fontsizeselect '+
        'bullist numlist outdent indent blockquote undo redo '+
        'removeformat subscript superscript forecolor backcolor |'.split(' ');
    
    presenter.ERROR_CODES = {
        'defaultLayoutError' : 'Custom Keyboard Layout should be a JavaScript object with at least "default" property ' +
            'which should be an array of strings with space-seperated chars.'
    };

    presenter.LAYOUT_TO_LANGUAGE_MAPPING = {
        'french (special characters)' : "{ \
            'default': ['\u00e0 \u00e2 \u00e7 \u00e8 \u00e9 \u00ea \u00ee \u00ef \u00f4 \u00f9 \u0153 \u00e6 \u00eb {shift}'], \
            'shift': ['\u00c0 \u00c2 \u00c7 \u00c8 \u00c9 \u00ca \u00cb \u00ce \u00cf \u00d4 \u00d9 \u00c6 \u0152 {shift}'] \
        }",
        'german (special characters)' : "{ \
            'default': ['\u00e4 \u00f6 \u00fc \u00df {shift}'], \
            'shift': ['\u00c4 \u00d6 \u00dc {empty} {shift}'] \
        }",
        'spanish (special characters)' : "{ \
            'default': ['\u00e1 \u00e9 \u00ed \u00f3 \u00fa \u00f1 \u00e7 \u00fc \u00a1 \u00bf \u00ba \u00aa {shift}'], \
            'shift': ['\u00c1 \u00c9 \u00cd \u00d3 \u00da \u00d1 \u00c7 \u00dc {empty} {empty} {empty} {empty} {shift}'] \
        }"
    };

    presenter.validateType = function AddonParagraph_Keyboard_validateType(rawType) {
        if (!rawType || rawType.length == 0) {
            return 'french (special characters)';
        }

        return rawType.toLowerCase();
    };

    presenter.setVisibility = function AddonParagraph_Keyboard_setVisibility(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
        if (isVisible) {
            presenter.$view.find(".paragraph-keyboard-wrapper").show();
        } else {
            presenter.$view.find(".paragraph-keyboard-wrapper").hide();
        }

        presenter.isVisibleValue = isVisible;
    };

    presenter.createPreview = function AddonParagraph_Keyboard_createPreview(view, model) {
        presenter.initializeEditor(view, model, true);
        var clickhandler = $("<div></div>").css({"background":"transparent", 'width': '100%', 'height': '100%', 'position':'absolute', 'top':0, 'left':0});
        presenter.$view.append(clickhandler);
    };

    presenter.run = function AddonParagraph_Keyboard_run(view, model) {
        presenter.initializeEditor(view, model, false);
    };

    presenter.validateToolbar = function AddonParagraph_validateToolbar(controls, width) {
        if (!controls) {
            controls = presenter.DEFAULTS.TOOLBAR;
        }

        controls = controls.split(" ");
        if (controls.indexOf("|") != -1) {
            return presenter.parseToolbarWithGroups(controls, width);
        } else {
            return presenter.parseToolbarWithoutGroups(controls, width);
        }
    };

    presenter.parseToolbarWithGroups = function (controls, toolbarWidth) {
        var controlGroups = controls.join(" ").split("|");
        return controlGroups.filter(function (group) {
            return group.trim().length > 0;
        }).map(function (group) {
            return presenter.parseToolbarWithoutGroups(group.trim().split(" "), toolbarWidth);
        }).join(" | ");
    };

    presenter.parseToolbarWithoutGroups = function (controls, toolbarWidth) {
        var filteredControls = controls.filter(function(param){
            return presenter.ALLOWED_TOOLBAR_BUTTONS.indexOf(param) != -1;
        });

        var result = "";
        var bufor = 0;
        var widthToAdd = 0;
        for(var i = 0; i < filteredControls.length; i++) {
            if (filteredControls[i] !== presenter.DEFAULTS.STYLE_SELECT_NAME) {
                widthToAdd = presenter.DEFAULTS.BUTTON_WIDTH;
            } else {
                widthToAdd = presenter.DEFAULTS.FORMAT_WIDTH;
            }

            if (bufor + widthToAdd < toolbarWidth) {
                bufor += widthToAdd;
                result += filteredControls[i].trim() + " ";
            } else {
                bufor = widthToAdd;
                result += "| " + filteredControls[i].trim() + " ";
            }
        }

        return result.trim();
    };

    function pasteHtmlAtCaret(html, wnd, ownerDocument) {
        var sel, range;
        if (wnd.getSelection) {
            // IE9 and non-IE
            sel = wnd.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();

                // Range.createContextualFragment() would be useful here but is
                // only relatively recently standardized and is not supported in
                // some browsers (IE9, for one)
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(), node, lastNode;

                // fix for IE
                if (ownerDocument) {
                    frag = ownerDocument.createDocumentFragment()
                }

                while ( (node = el.firstChild) ) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);

                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if (document.selection && document.selection.type != "Control") {
            // IE < 9
            document.selection.createRange().pasteHTML(html);
        }
    }

     function transposeLayout(layout){
        var newLayout = {};
        $.each(layout, function(name,keyset){
            var ar = [];
            for (var i=0; i < keyset.length; i++) {
                var row = keyset[i].split(' ');
                for (var j=0; j < row.length; j++) {
                    if (!ar[j]) ar[j] = [];
                    ar[j][i] = row[j];
                }
            }
            for (var k=0; k < ar.length; k++) {
                ar[k] = ar[k].join(' ');
            }
            newLayout[name] = ar;
        });
        return newLayout;
    }

    /**
     * Parses model and set settings to default values if either of them is empty
     *
     * @param model
     * @returns {{fontFamily: *, fontSize: *}}
     */
    presenter.parseModel = function AddonParagraph_Keyboard_parseModel(model) {
        var fontFamily = model['Default font family'],
            fontSize = model['Default font size'],
            isToolbarHidden = ModelValidationUtils.validateBoolean(model['Hide toolbar']),
            toolbar = presenter.validateToolbar(model['Custom toolbar'], model["Width"]),
            height = model.Height,
            hasDefaultFontFamily = false,
            hasDefaultFontSize = false,
            keyboardPosition = model['keyboardPosition'] ? model['keyboardPosition'].toLowerCase() : 'bottom',
            layoutType = presenter.validateType(model['layoutType']),
            keyboardLayout = model['keyboardLayout'];

        if (ModelValidationUtils.isStringEmpty(fontFamily)) {
            fontFamily = presenter.DEFAULTS.FONT_FAMILY;
            hasDefaultFontFamily = true;
        }

        if (ModelValidationUtils.isStringEmpty(fontSize)) {
            fontSize = presenter.DEFAULTS.FONT_SIZE;
            hasDefaultFontSize = true;
        }

        if (presenter.LAYOUT_TO_LANGUAGE_MAPPING[layoutType] != undefined) {
            keyboardLayout = presenter.LAYOUT_TO_LANGUAGE_MAPPING[layoutType];
        }

        height -= !isToolbarHidden ? 37 : 2;

        if (keyboardLayout.length > 0) {
            try {
                eval('keyboardLayout = ' + keyboardLayout);
            } catch(e) {
                presenter.ERROR_CODES['evaluationError'] = 'Custom keyboard layout parsing error: ' + e.message;
                return {error: 'evaluationError'};
            }
        }

        if (typeof keyboardLayout['default'] !== 'object' || keyboardLayout['default'].length < 1) {
            return {error: 'defaultLayoutError'};
        }

        var supportedPositions = ['top', 'bottom', 'custom', 'left', 'right'];

        if (keyboardPosition == 'left' || keyboardPosition == 'right') {
            keyboardLayout = transposeLayout(keyboardLayout);
        } else if (supportedPositions.indexOf(keyboardPosition) == -1) {
            keyboardPosition = 'bottom';
        }

        return {
            ID: model["ID"],
            isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            isValid: true,

            fontFamily: fontFamily,
            fontSize: fontSize,
            isToolbarHidden: isToolbarHidden,
            toolbar: toolbar,
            textAreaHeight: height,
            paragraphHeight: model.Height,
            width: model['Width'],
            hasDefaultFontFamily: hasDefaultFontFamily,
            hasDefaultFontSize: hasDefaultFontSize,
            content_css: model['Custom CSS'],

            keyboardLayout: keyboardLayout,
            keyboardPosition: keyboardPosition,
            error: false
        };
    };

    presenter.setWrapperID = function AddonParagraph_Keyboard_setWrapperID() {
        var $paragraphWrapper = presenter.$view.find('.paragraph-wrapper');
        $paragraphWrapper.attr('id', presenter.configuration.ID + '-wrapper');
    };

    /**
     * Initialize the addon.
     * For now the height is set to addon height minus 37 which is TinyMCE toolbar height.
     * It was not possible to get that value in easy and dynamic way and it didn't make sense
     * for prototype purpose. Also the set of controls is static and it could be be moved to
     * configuration.
     */
    presenter.initializeEditor = function AddonParagraph_Keyboard_initializeEditor(view, model) {
        presenter.view = view;
        presenter.$view = $(view);
        presenter.configuration = presenter.parseModel(model);

        if (presenter.configuration.error) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.error);
            return;
        }

        presenter.view.addEventListener('DOMNodeRemoved', presenter.destroy);
        presenter.$view.on('click', function(e){
            e.stopPropagation();
            e.preventDefault();
        });

        presenter.setWrapperID();
        presenter.buildKeyboard();

        var $keyboard = presenter.$view.find('.paragraph-keyboard'),
            $paragraph = presenter.$view.find('.paragraph-wrapper'),
            keyboardPosition = presenter.configuration.keyboardPosition;

        if (keyboardPosition != 'custom') {

            var width, height, offset = {};

            width = parseInt($keyboard.width(), 10);
            height = parseInt($keyboard.height(), 10);
            offset.bottom = parseInt($keyboard.css('padding-bottom'), 10);
            offset.bottom += parseInt($keyboard.css('border-bottom-width'), 10);
            offset.top = parseInt($keyboard.css('padding-top'), 10);
            offset.top += parseInt($keyboard.css('border-top-width'), 10);

            offset.left = parseInt($keyboard.css('padding-left'), 10);
            offset.left += parseInt($keyboard.css('border-left-width'), 10);
            offset.right = parseInt($keyboard.css('padding-right'), 10);
            offset.right += parseInt($keyboard.css('border-right-width'), 10);

            switch (keyboardPosition) {
                case 'top':
                    presenter.configuration.paragraphHeight -= height + 2 * offset.bottom + offset.top + 1;
                    $paragraph.css('top', (height + offset.top + offset.bottom) + 'px');
                    $paragraph.width('100%');
                    break;
                case 'bottom':
                    presenter.configuration.paragraphHeight -= height + offset.bottom + 2 * offset.top - 1;
                    offset.additional = presenter.configuration.isToolbarHidden ? 1 : 0;
                    $keyboard.css('top', (presenter.configuration.paragraphHeight + offset.top - offset.additional) + 'px');
                    $paragraph.width('100%');
                    break;
                case 'left':
                    presenter.configuration.width -= width + offset.right + 1;
                    $paragraph.width(presenter.configuration.width + 'px');
                    $paragraph.css('left', (width + offset.left + offset.right) + 'px');
                    $paragraph.height('100%');
                    break;
                case 'right':
                    presenter.configuration.width -= width + offset.left + offset.right + 2;
                    $paragraph.width(presenter.configuration.width + 'px');
                    $keyboard.css('left', (presenter.configuration.width + offset.left - 1) + 'px');
                    $paragraph.height('100%');
                    break;
            }
        }

        var plugins = undefined;
        if (presenter.configuration.toolbar.indexOf('forecolor') > -1 ||
            presenter.configuration.toolbar.indexOf('backcolor') > -1 ) {
            plugins = "textcolor";
        }

        tinymce.init({
            plugins: plugins,
            selector : presenter.getTinyMCESelector(),
            width: presenter.configuration.width,
            height: presenter.configuration.paragraphHeight,
            statusbar: false,
            menubar: false,
            toolbar: presenter.configuration.toolbar,
            content_css: presenter.configuration.content_css,
            setup : function(editor) {
                editor.on("NodeChange", presenter.setStyles);
            }
        }).then(function (editors) {
            presenter.editor = editors[0];
            presenter.onInit();
        });

        presenter.setVisibility(presenter.configuration.isVisible || isPreview);
    };

    presenter.destroy = function AddonParagraph_Keyboard_destroy(event) {
        if (event.target !== presenter.view) {
            return;
        }
        presenter.view.removeEventListener('DOMNodeRemoved', presenter.destroy);

        presenter.$view.off();
        presenter.jQueryTinyMCEHTML.off();
        presenter.$tinyMCEToolbar.off();
        presenter.$TinyMCEBody.off();
        presenter.editor.destroy();
        tinymce.remove();
        tinymce.AddOnManager.PluginManager.items.length = 0;

        presenter.$tinyMCEToolbar = null;
        presenter.jQueryTinyMCEHTML = null;
        presenter.$TinyMCEBody = null;
        presenter.configuration = null;
        presenter.$view = null;
        presenter.view = null;
        presenter.editor = null;
        presenter.tinyMceContainer = null;
        presenter.window = null;
        presenter.isVisibleValue = null;
        presenter.ERROR_CODES = null;
        presenter.DEFAULTS = null;
        presenter.LAYOUT_TO_LANGUAGE_MAPPING = null;

        presenter.setWrapperID = null;
        presenter.findIframeAndSetStyles = null;
        presenter.getSpecifyToolbar = null;
        presenter.addStylesToButton = null;
        presenter.getButton = null;
        presenter.onBlur = null;
        presenter.onFocus = null;
        presenter.onInit = null;
        presenter.setIframeHeight = null;
        presenter.destroy = null;
        presenter.setStyles = null;
        transposeLayout = null;
        pasteHtmlAtCaret = null;

        presenter.switchKeyboard = null;
        presenter.clickKeyboard = null;
        presenter.buildKeyboard = null;
        presenter.eKeyboardButtons.forEach(function ($button) {
            $button.off();
        });
        presenter.eKeyboardButtons.length = 0;
        presenter.eKeyboardButtons = null;
    };

    presenter.getTinyMCESelector = function AddonParagraph_Keyboard_getTinyMCESelector() {
        return '#' + presenter.configuration.ID + '-wrapper .paragraph_field';
    };

    presenter.setStyles = function AddonParagraph_Keyboard_setStyles() {
        if (presenter.editor == null) {
            return;
        }

        var hasDefaultFontFamily = presenter.configuration.hasDefaultFontFamily,
            hasDefaultFontSize = presenter.configuration.hasDefaultFontSize,
            hasContentCss = !ModelValidationUtils.isStringEmpty(presenter.configuration.content_css);

        if (!hasDefaultFontFamily || !hasDefaultFontSize || !hasContentCss) {
            var elements = [ presenter.editor.dom.$('p'), presenter.editor.dom.$('ol'), presenter.editor.dom.$('ul')];

            for (var i = 0; i < elements.length; i++) {
                if (!hasDefaultFontFamily || !hasContentCss) {
                    elements[i].css('font-family', presenter.configuration.fontFamily);
                }

                if (!hasDefaultFontSize || !hasContentCss) {
                    elements[i].css('font-size', presenter.configuration.fontSize);
                }
            }
        }
    };

    presenter.setIframeHeight = function AddonParagraph_Keyboard_setIframeHeight() {
        var $editor = presenter.$view.find('#' + presenter.editor.id + '_ifr'),
            editorHeight = presenter.configuration.paragraphHeight;

        if (!presenter.configuration.isToolbarHidden) {
            editorHeight -=  presenter.$view.find('.mce-toolbar').height();
        }

        $editor.height(editorHeight);
    };


    presenter.caret = function AddonParagraph_Keyboard_caret() {
        var caretData;
        if (arguments.length) {
            caretData = arguments[0];
            presenter.window.getSelection().collapse(caretData.start.node, caretData.start.offset);
            if (caretData.range) {
                caretData.range.deleteContents();
            }
        } else {
            var selection = presenter.window.getSelection(),
                start = {
                    offset: selection.anchorOffset,
                    node: selection.anchorNode
                },
                range = false;

            if (selection.rangeCount > 0) {
                range = selection.getRangeAt(0);
            }

            caretData = {
                start : start,
                range: range
            };
        return caretData;
        }
    };

    presenter.clickKeyboard = function AddonParagraph_Keyboard_clickKeyboard(e){
        e.stopPropagation();
        e.preventDefault();
        var $this = $(this),
            text = $this.text();

        presenter.window.focus();
        $(presenter.editor.contentDocument).find('body').focus();

        if (presenter.lastCaret) {
            // in IE 11 we have to set caret's position manually, because by default it is set at the beginning
            presenter.caret(presenter.lastCaret);
            pasteHtmlAtCaret(text, presenter.window, presenter.ownerDocument);
            presenter.lastCaret = presenter.caret();
        } else {
            pasteHtmlAtCaret(text, presenter.window, presenter.ownerDocument);
        }

        $this.addClass('clicked');
        window.setTimeout(function(){
            $this.removeClass('clicked');
        }, 200);
    };

    presenter.switchKeyboard = function AddonParagraph_Keyboard_switchKeyboard(e) {
        e.stopPropagation();
        e.preventDefault();
        presenter.$view.find('.keySetLayer:visible').hide();
        presenter.currentKeyboard = (presenter.currentKeyboard == 'default' ? 'shift' : 'default');
        presenter.$view.find('.keyset-' + presenter.currentKeyboard).show();
        presenter.$view.find('.paragraph-keyboard-shift:visible').addClass('clicked');

        window.setTimeout(function(){
            presenter.$view.find('.paragraph-keyboard-shift.clicked').removeClass('clicked');
        }, 200);

        presenter.window.focus();
        $(presenter.editor.contentDocument).find('body').focus();
        if (presenter.lastCaret) {
            presenter.caret(presenter.lastCaret);
        }
    };

    presenter.buildKeyboard = function AddonParagraph_Keyboard_buildKeyboard(){
        var keyboard = presenter.$view.find('.paragraph-keyboard'),
            row, currentSet, keys, key, keyRow, $button, t, keySetLayer;
        $.each(presenter.configuration.keyboardLayout, function(set, keySet) {
            keySetLayer = $('<div>').addClass('keySetLayer');
            keySetLayer.addClass('keyset-' + set);
            
            for ( row = 0; row < keySet.length; row++ ){
                currentSet = $.trim(keySet[row]).replace(/\{(\.?)[\s+]?:[\s+]?(\.?)\}/g,'{$1:$2}');
                keys = currentSet.split(/\s+/);
                
                if (!keys) { 
                    continue; 
                }
                
                keyRow = $('<div>').addClass('keyRow');
                for ( key = 0; key < keys.length; key++ ) {
                    // ignore empty keys
                    if (keys[key].length === 0) { 
                        continue; 
                    }
                    
                    t = keys[key];

                    if (t == '{empty}') {
                        keyRow.append($('<div>').addClass('paragraph-keyboard-empty').html('&nbsp;'));
                    } else if (t == '{shift}') {
                        $button = $('<div>').addClass('paragraph-keyboard-shift').html('&nbsp;');
                        $button.on('click', presenter.switchKeyboard);
                        keyRow.append($button);
                    } else {
                        $button = $('<div>').addClass('paragraph-keyboard-letter').text(t);
                        $button.on('click', presenter.clickKeyboard);
                        keyRow.append($button);
                    }

                    presenter.eKeyboardButtons.push($button);

                }
                keySetLayer.append(keyRow);
                keySetLayer.append($('<div>').addClass('keyboard-clear'));
            }
            if (set != 'default') {
                keySetLayer.hide();
            } else {
                presenter.currentKeyboard = 'default';
            }
            keyboard.append(keySetLayer);
        });
    };

    presenter.onInit = function AddonParagraph_Keyboard_onInit() {
        presenter.window = presenter.editor.contentWindow;

        if (presenter.configuration.isToolbarHidden) {
            presenter.$view.find('.mce-container.mce-panel.mce-first').remove();
            presenter.$view.find('.mce-edit-area').css('border-top-width', '0');
        }

        presenter.jQueryTinyMCEHTML = $(presenter.editor.dom.select('html'));
        presenter.jQueryTinyMCEHTML.click(function () {
            presenter.window.focus();
            $(presenter.editor.contentDocument).find('body').focus();
        });

        var stylesheetFullPath = DOMOperationsUtils.getResourceFullPath(presenter.playerController, "addons/resources/style.css");
        presenter.editor.dom.loadCSS(stylesheetFullPath);

        presenter.setStyles();

        if (presenter.configuration.state !== undefined) {
        	presenter.editor.setContent(presenter.configuration.state, {format : 'raw'});
        }

        setTimeout(function () {
            presenter.setIframeHeight();
        }, 0);

        presenter.$tinyMCEToolbar = presenter.$view.find('.mce-toolbar');
        presenter.lastHeight = presenter.$tinyMCEToolbar.css('height');
        presenter.$tinyMCEToolbar.on('resize', function () {
            presenter.setIframeHeight();
        });

        checkForChanges();

        presenter.$view.find('.mce-container.mce-panel.mce-tinymce').css('border',0);

        var el = presenter.editor.dom.select('body')[0];
        presenter.$TinyMCEBody = $(el);
        if (typeof el.ownerDocument.parentWindow !== 'undefined') {
            presenter.window = el.ownerDocument.parentWindow;
            presenter.ownerDocument = el.ownerDocument;
            presenter.lastCaret = presenter.caret();
            presenter.$TinyMCEBody.on('mouseup keyup', function(e){
                presenter.lastCaret = presenter.caret();
            });
        } else {
            presenter.ownerDocument = false;
        }
    };

    function checkForChanges(){
        if (presenter.$tinyMCEToolbar.css('height') != presenter.lastHeight){
            presenter.lastHeight = presenter.$tinyMCEToolbar.css('height');
            presenter.setIframeHeight();
            return;
        }

        checkHeightCounter += 1;
        if(checkHeightCounter == 3) return;

        setTimeout(checkForChanges, 500);
    }

    presenter.setPlayerController = function AddonParagraph_Keyboard_playerController(controller) {
        presenter.playerController = controller;
    };

    presenter.getState = function AddonParagraph_Keyboard_getState() {
        var tinymceState = '';

        if (presenter.editor != null && presenter.editor.hasOwnProperty("id")) {
            tinymceState = presenter.editor.getContent({format : 'raw'});
        }

        return JSON.stringify({
            'tinymceState' : tinymceState,
            'isVisible' : presenter.isVisibleValue
        });
    };

    presenter.setState = function AddonParagraph_Keyboard_setState(state) {
        var parsedState = JSON.parse(state);

        if (presenter.editor  != null) {
            presenter.editor.setContent(parsedState.tinymceState, {format : 'raw'});
        } else {
            presenter.configuration.state = parsedState.tinymceState;
        }

        presenter.setVisibility(parsedState.isVisible);
    };


    presenter.executeCommand = function AddonParagraph_Keyboard_executeCommand(name, params) {
        if (!presenter.configuration.isValid) { return; }

        var commands = {
            'show': presenter.show,
            'hide': presenter.hide,
            'isVisible': presenter.isVisible
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    presenter.reset = function AddonParagraph_Keyboard_reset() {
        presenter.editor.setContent('');
        presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.show = function AddonParagraph_Keyboard_show() {
        presenter.setVisibility(true);
    };

    presenter.hide = function AddonParagraph_Keyboard_hide() {
        presenter.setVisibility(false);
    };

    presenter.isVisible = function AddonParagraph_Keyboard_isVisible() {
        return presenter.isVisibleValue;
    };

    return presenter;
}