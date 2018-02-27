const consoleClasses = {
    "LINES_CONTAINER": "pseudoConsole-console-container",
    "CURSOR": "pseudoConsole-console-cursor",
    "ACTIVE_CURSOR": "pseudoConsole-console-cursor-active",
    "RIGHT_ELEMENT": "pseudoConsole-console-right-element",
    "LEFT_ELEMENT": "pseudoConsole-console-left-element",
    "TEXT_AREA": "pseudoConsole-console-textarea"
};

/**
 *
 * @param {jQuery} $element
 * @param {{inputChecker: Function}}config
 * @constructor
 */
export function UserConsole($element, config) {
        this.container = $("<pre></pre>");
        this.$textArea = $("<textarea class='pseudoConsole-console-textarea'></textarea>");
        this.linesContainer = $("<div class='" + consoleClasses.LINES_CONTAINER + "'></div>");
        this.$parentElement = $element;
        this.lines = [];
        this.activeLineIndex = -1;
        this.isReadMode = false;    //Console is waiting for user input
        this.isDisabled = false;
        this.config = config;
        this.characterWidth = 0;

        $element.append(this.container);
        $element.append(this.$textArea);

        this.container.append(this.linesContainer);

        this.addNewLine(true);

}

UserConsole.prototype = {
    generateLine: function (className) {
        if (!className) {
            className = '';
        }

        let $htmlObject = $("<span></span>"),
            $left = $("<span class='" + className + " " + consoleClasses.LEFT_ELEMENT + "'></span>"),
            $right = $("<span class='" + className + " " + consoleClasses.RIGHT_ELEMENT + "'></span>"),
            $cursor = $("<span class='" + consoleClasses.CURSOR + "'></span>");

        $htmlObject.append($left);
        $htmlObject.append($cursor);
        $htmlObject.append($right);

        return {
            $htmlObject : $htmlObject,
            elements: {
                $left: $left,
                $cursor: $cursor,
                $right: $right
            }
        };
    },

    /**
     * @param  {Boolean} isActive Activate this line automatically
     * @param  {String} [className] set class for that line
     */
    addNewLine: function (isActive, className) {
        if (!className) {
            className = '';
        }

        let line = this.generateLine(className);
        this.lines.push(line);
        this.linesContainer.append(line.$htmlObject);

        if (isActive) {
            this.selectLineAsActive(this.lines.length - 1);
        }

        this.$parentElement[0].scrollTop = this.$parentElement[0].scrollHeight;
    },

    selectLineAsActive: function (index) {
        let activeLine = null;
        if (this.activeLineIndex > -1) {
            activeLine = this.getActiveLine();
            activeLine.elements.$left.text(activeLine.elements.$left.text() + activeLine.elements.$right.text());
            activeLine.elements.$right.text('');
            activeLine.elements.$cursor.html('');
            activeLine.elements.$cursor.removeClass(consoleClasses.ACTIVE_CURSOR);
        }

        this.activeLineIndex = index;
        activeLine = this.lines[index];
        activeLine.elements.$cursor.html('&nbsp;');
        activeLine.elements.$cursor.addClass(consoleClasses.ACTIVE_CURSOR);
    },
    /**
     * @returns {{$htmlObject: jQuery, elements: {$left: jQuery, $right: jQuery, $cursor: jQuery}}}
     */
    getActiveLine: function () {
        return this.lines[this.activeLineIndex];
    },

    /**
     * @param  {String} text
     * @param  {String} className
     */
    Write: function (text, className) {
        if (this.isReadMode) {  //Dont write to console if is in read mode.
            return;
        }

        text = String(text);

        this.addNewLine(true, className);

        let lines = text.split('\n'),
            line,
            activeLine = this.getActiveLine(),
            i;

        for (i = 0; i < lines.length - 1; i += 1) {
            line = lines[i];
            activeLine.elements.$left.text(activeLine.elements.$left.text() + line);
            this.addNewLine(true, className);
            activeLine = this.getActiveLine();
            activeLine.elements.$left.text("\n");

        }

        activeLine = this.getActiveLine();
        line = lines[i];
        activeLine.elements.$left.text(activeLine.elements.$left.text() + line);
        this.scrollRight();
    },

    ReadLine: function (callback) {
        if (this.isReadMode) {
            return;
        }

        this.isReadMode = true;
        let self = this;

        this.readLineFunction(function (data) {
            self.isReadMode = false;
            callback(data);
        });
    },

    readLineFunction: function (onExitCallback) {
        if (!this.isReadMode) {
            return;
        }

        this.addNewLine(true);

        let textAreaElement = this.$textArea,
            parentElement = this.$parentElement,
            self = this;

        $(parentElement).on('click', function () {
            textAreaElement.off();
            textAreaElement.focus();

            textAreaElement.on('input', function () {
                return self.onInputCallback();
            });

            textAreaElement.on('keydown', function (event) {
                return self.onKeyDownCallback(event, onExitCallback);
            });
        });

        $(parentElement).click();
    },

    onInputCallback: function () {
        if (this.isDisabled) {
            return;
        }

        let textAreaElement = this.$textArea,
            activeLine = this.getActiveLine(),
            data = textAreaElement.val(),
            leftText = activeLine.elements.$left.text(),
            rightText = activeLine.elements.$right.text();

        textAreaElement.val('');

        if (!this.config.inputChecker(data, leftText + data + rightText)) {
            return false;
        }

        if (data.length > 0) {
            if (data[data.length - 1] !== '\n') {
                leftText = leftText + data;
            }
        }

        activeLine.elements.$left.text(leftText);
        activeLine.elements.$right.text(rightText);

        this.scrollRight();

        return false;
    },

    onKeyDownCallback: function (event, onExitCallback) {
        if (this.isDisabled) {
            return;
        }

        let textAreaElement = this.$textArea,
            activeLine = this.getActiveLine(),
            keycode = event.which || event.keycode,
            leftText = activeLine.elements.$left.text(),
            rightText = activeLine.elements.$right.text(),
            parentElement = this.$parentElement;

        if (keycode === 39 || keycode === 37 || keycode === 8 || keycode === 13) {
            if (keycode === 39) {    //Left arrow
                if (rightText.length > 0) {
                    leftText += rightText[0];
                    rightText = rightText.substring(1);
                }
            } else if (keycode === 37) {    //Right arrow
                if (leftText.length > 0) {
                    rightText = leftText[leftText.length - 1] + rightText;
                    leftText = leftText.substring(0, leftText.length - 1);
                }
            } else if (keycode === 8) {     //Backspace
                leftText = leftText.substring(0, leftText.length - 1);
            } else if (keycode === 13) {
                if ((leftText + rightText).length > 0) {
                    $(parentElement).off();
                    textAreaElement.off();
                    onExitCallback(leftText + rightText);
                }
            }

            activeLine.elements.$left.text(leftText);
            activeLine.elements.$right.text(rightText);
            textAreaElement.val('');

            this.scrollRight();
            return false;
        }
    },

    ReadChar: function (callback) {
        if (this.isReadMode) {
            return;
        }

        this.isReadMode = true;

        this.addNewLine(true);

        let activeLine = this.getActiveLine(),
            textAreaElement = this.$textArea,
            parentElement = this.$parentElement,
            data,
            leftText,
            self = this;

        $(parentElement).on('click', function () {
            textAreaElement.off();
            textAreaElement.focus();

            textAreaElement.on('input', function () {
                if (self.isDisabled) {
                    return;
                }

                leftText = activeLine.elements.$left.text();
                data = textAreaElement.val();

                if (!self.config.inputChecker(data, data)) {
                    return;
                }

                if (data[data.length - 1] !== "\n") {
                    $(parentElement).off();
                    textAreaElement.off();
                    activeLine.elements.$left.text(leftText + data[data.length - 1]);   //Get only last char
                    self.isReadMode = false;
                    textAreaElement.val('');
                    callback(data[data.length - 1]);
                }

                self.scrollRight();
            });
        });

        $(parentElement).click();
    },

    Reset: function () {
        let textAreaElement = this.$textArea,
            parentElement = this.$parentElement;

        parentElement.off();
        textAreaElement.off();

        this.isReadMode = false;

        this.linesContainer.find('span').remove();
        this.lines = [];

        this.activeLineIndex = -1;

        this.addNewLine(true);

        this.$textArea.val('');
        },

    destroy: function () {
        this.Reset();
    },

    disable: function () {
        this.isDisabled = true;
    },

    enable: function () {
        this.isDisabled = false;
    },

    scrollRight: function () {
        let actualLine = this.getActiveLine();
        let cursorLeftPosition = actualLine.elements.$cursor.position().left;
        let actualScroll = this.$parentElement.scrollLeft();
        let parentWidth = this.$parentElement.width();

        this.$parentElement.scrollLeft(actualScroll + cursorLeftPosition - (parentWidth / 2));
    }
};