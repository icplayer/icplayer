TestCase("[Connection] Connection printable html validation", {
    setUp: function () {
        this.connectionNumber = 0;
        this.checkUserAnswers = false;
        this.answersDiv = {};

        this.presenter = AddonConnection_create();
        this.renderMathJax = sinon.stub(this.presenter, 'renderMathJax');
        this.showAnswers = false;
        this.presenter.printableState = undefined;
        this.presenter.printableParserCallback = () => true;
        this.presenter.model = {
            'ID': "Connection1",
            'Width': "300",
            'Left column': [
                {
                    'id': "1",
                    'connects to': "a",
                    'content': "1"
                },
                {
                    'id': "2",
                    'connects to': "a,b",
                    'content': "2"
                },
                {
                    'id': "3",
                    'connects to': "",
                    'content': "3"
                },
            ],
            'Right column': [
                {
                    'id': "a",
                    'connects to': "",
                    'content': "a"
                },
                {
                    'id': "b",
                    'connects to': "",
                    'content': "b"
                },
                {
                    'id': "c",
                    'connects to': "",
                    'content': "c"
                },
            ],
            'Single connection mode': "True"
        };

        this.stubs = {
            getLessonTemplateStub: sinon.stub()
        };
        this.stubs.getLessonTemplateStub.returns(this.getLessonTemplate());
        this.presenter.printableController = {
            getLessonTemplate: this.stubs.getLessonTemplateStub
        };
        this.presenter.textParser = {
            parseAltTexts: sinon.stub(),
            parse: sinon.stub(),
        };
        this.presenter.textParser.parse.returnsArg(0);
        this.presenter.textParser.parseAltTexts.returnsArg(0);
    },

    'test empty printable state': function () {
        // given
        var $connectionsSVG = $('<svg class="connections"></svg>');
        var expectedHtmlValue = this.getExpectedHTML($connectionsSVG[0].outerHTML);

        // actual
        var actualHtmlValue = this.presenter.getPrintableHTML(this.presenter.model, this.showAnswers);

        // expected
        assertEquals(expectedHtmlValue[0].outerHTML, actualHtmlValue);
    },

    'test showAnswers printable state': function () {
        // given
        this.showAnswers = true;
        this.connectionNumber = 3;
        var $connectionsSVG = $('<svg class="connections"></svg>');
        $connectionsSVG.html(
            '<line class="correctConnectionLine" x1="0" x2="100%" style="stroke: rgb(0, 0, 0); stroke-width: 1;" y1="16.666666666666668%" y2="16.666666666666668%"></line>' +
            '<line class="correctConnectionLine" x1="0" x2="100%" style="stroke: rgb(0, 0, 0); stroke-width: 1;" y1="50%" y2="16.666666666666668%"></line>' +
            '<line class="correctConnectionLine" x1="0" x2="100%" style="stroke: rgb(0, 0, 0); stroke-width: 1;" y1="50%" y2="50%"></line>'
        )
        var expectedHtmlValue = this.getExpectedHTML($connectionsSVG[0].outerHTML);

        // actual
        var actualHtmlValue = this.presenter.getPrintableHTML(this.presenter.model, this.showAnswers);

        // expected
        assertEquals(expectedHtmlValue[0].outerHTML, actualHtmlValue);
    },
    'test show user answer state': function () {
        // given
        this.presenter.printableState = {
            "id": [
                "1:a",
                "1:b",
                "1:c"
            ],
            "isVisible":true
        }
        this.connectionNumber = this.presenter.printableState.id.length;
        var $connectionsSVG = $('<svg class="connections"></svg>');
        $connectionsSVG.html(
            '<line class="correctConnectionLine" x1="0" x2="100%" style="stroke: rgb(0, 0, 0); stroke-width: 1;" y1="16.666666666666668%" y2="16.666666666666668%"></line>' +
            '<line class="correctConnectionLine" x1="0" x2="100%" style="stroke: rgb(0, 0, 0); stroke-width: 1;" y1="16.666666666666668%" y2="50%"></line>' +
            '<line class="correctConnectionLine" x1="0" x2="100%" style="stroke: rgb(0, 0, 0); stroke-width: 1;" y1="16.666666666666668%" y2="83.33333333333333%"></line>'
        )
        var expectedHtmlValue = this.getExpectedHTML($connectionsSVG[0].outerHTML);

        // actual
        var actualHtmlValue = this.presenter.getPrintableHTML(this.presenter.model, this.showAnswers);

        // expected
        assertEquals(expectedHtmlValue[0].outerHTML, actualHtmlValue);
    },
    'test show user answer - no answer': function () {
        // given
        this.presenter.printableState = {
            "id": [],
            "isVisible":true
        }
        this.connectionNumber = this.presenter.printableState.id.length;
        var $connectionsSVG = $('<svg class="connections"></svg>');
        var expectedHtmlValue = this.getExpectedHTML($connectionsSVG[0].outerHTML);

        // actual
        var actualHtmlValue = this.presenter.getPrintableHTML(this.presenter.model, this.showAnswers);

        // expected
        assertEquals(expectedHtmlValue[0].outerHTML, actualHtmlValue);
    },
    'test check user answer state': function () {
        // given
        this.showAnswers = true;
        this.checkUserAnswers = true;
        this.presenter.printableState = {
            "id": [
                "1:a",
                "1:b",
                "1:c"
            ],
            "isVisible":true
        };
        this.connectionNumber = this.presenter.printableState.id.length;
        var $connectionsSVG = $('<svg class="connections"></svg>');
        $connectionsSVG.html(
            '<line class="correctConnectionLine" x1="0" x2="100%" style="stroke: rgb(0, 0, 0); stroke-width: 1;" y1="16.666666666666668%" y2="16.666666666666668%"></line>' +
            '<line class="inCorrectConnectionLine" x1="0" x2="100%" style="stroke: rgb(0, 0, 0); stroke-width: 1;" stroke-dasharray="4" y1="16.666666666666668%" y2="50%"></line>' +
            '<line class="inCorrectConnectionLine" x1="0" x2="100%" style="stroke: rgb(0, 0, 0); stroke-width: 1;" stroke-dasharray="4" y1="16.666666666666668%" y2="83.33333333333333%"></line>'
        )
        this.answersDivs = {
            'answersLeft': [
                {
                    'id': '1',
                    'answerDiv': '<div class="inCorrectAnswerDiv"></div>'
                },
                {
                    'id': '2',
                    'answerDiv': '<div class="inCorrectAnswerDiv"></div>'
                },
                {
                    'id': '3',
                    'answerDiv': '<div class="correctAnswerDiv"></div>'
                },
            ],
            'answersRight': [
                {
                    'id': 'a',
                    'answerDiv': '<div class="inCorrectAnswerDiv"></div>'
                },
                {
                    'id': 'b',
                    'answerDiv': '<div class="inCorrectAnswerDiv"></div>'
                },
                {
                    'id': 'c',
                    'answerDiv': '<div class="inCorrectAnswerDiv"></div>'
                },
            ]
        }
        var expectedHtmlValue = this.getExpectedHTML($connectionsSVG[0].outerHTML);

        // actual
        var actualHtmlValue = this.presenter.getPrintableHTML(this.presenter.model, this.showAnswers);

        // expected
        assertEquals(expectedHtmlValue[0].outerHTML, actualHtmlValue);
    },
    'test check user answer state - no answer': function () {
        // given
        this.showAnswers = true;
        this.checkUserAnswers = true;
        this.presenter.printableState = {
            "id": [],
            "isVisible":true
        };
        this.connectionNumber = this.presenter.printableState.id.length;
        var $connectionsSVG = $('<svg class="connections"></svg>');
        this.answersDivs = {
            'answersLeft': [
                {
                    'id': '1',
                    'answerDiv': '<div class="inCorrectAnswerDiv"></div>'
                },
                {
                    'id': '2',
                    'answerDiv': '<div class="inCorrectAnswerDiv"></div>'
                },
                {
                    'id': '3',
                    'answerDiv': '<div class="correctAnswerDiv"></div>'
                },
            ],
            'answersRight': [
                {
                    'id': 'a',
                    'answerDiv': '<div class="inCorrectAnswerDiv"></div>'
                },
                {
                    'id': 'b',
                    'answerDiv': '<div class="inCorrectAnswerDiv"></div>'
                },
                {
                    'id': 'c',
                    'answerDiv': '<div class="correctAnswerDiv"></div>'
                },
            ]
        }
        var expectedHtmlValue = this.getExpectedHTML($connectionsSVG[0].outerHTML);

        // actual
        var actualHtmlValue = this.presenter.getPrintableHTML(this.presenter.model, this.showAnswers);

        // expected
        assertEquals(expectedHtmlValue[0].outerHTML, actualHtmlValue);
    },


    getCoreElements: function(elementsToAdd, isLeft) {
        var $elements = $("<tbody></tbody>")
        for (var i = 0; i < elementsToAdd.length; i++) {
            var $content = $("<tr></tr>");
            if (isLeft) {
                $content.html(
                    '<td class="inner">' +
                        '<div class="innerWrapper" style="direction: ltr;">' + elementsToAdd[i].content +'</div>' +
                    '</td>' +
                    '<td class="icon">' +
                        '<div class="iconWrapper"></div>' +
                    '</td>'
                )
            } else {
                $content.html(
                    '<td class="icon">' +
                        '<div class="iconWrapper"></div>' +
                    '</td>' +
                    '<td class="inner">' +
                        '<div class="innerWrapper" style="direction: ltr;">' + elementsToAdd[i].content +'</div>' +
                    '</td>'
                )
            }

            var $element = $("<tr></tr>");
            $element.html('<td class="connectionItemWrapper">' +
               '<table class="connectionItem" id="connection-' + elementsToAdd[i].id + '">' +
                  '<tbody>' +
                        $content[0].outerHTML +
                  '</tbody>' +
               '</table>' +
            '</td>');
            $elements.append($element);
        }
        return $elements[0].outerHTML;
    },

    getAnswerElements: function(isLeft) {
        var $answerColumnContent = $("<tbody></tbody>")
        var columnClassType = isLeft ? '<td class="answersLeftColumn">' : '<td class="answersRightColumn">';
        var answers = isLeft ? this.answersDivs['answersLeft'] : this.answersDivs['answersRight'];
        for (var i = 0; i < answers.length; i++) {
            var answerDiv = answers[i]['answerDiv'];
            var $content = $("<tr></tr>");
            $content.html(
                '<td class="connectionItemWrapper">' +
                   '<table class="answerItem" id="connection-' + answers[i]['id'] + '">' +
                      '<tbody>' +
                         '<tr>' +
                            '<td class="inner">' +
                               answerDiv +
                            '</td>' +
                         '</tr>' +
                      '</tbody>' +
                   '</table>' +
                '</td>'
            );
            $answerColumnContent.append($content);
        }
        return (
            columnClassType +
            '<table class="content">' +
                $answerColumnContent[0].outerHTML +
            '</table>' +
        '</td>'
        );
    },

    getExpectedHTML: function(svgConnectionsHTML) {
        var answersLeftColumn = this.checkUserAnswers ? this.getAnswerElements(true) : '';
        var answersRightColumn = this.checkUserAnswers ? this.getAnswerElements(false) : '';

        var $root = $("<div></div>");
        $root.attr('id', '');
        $root.addClass('printable_addon_Connection');
        $root.css('max-width', '300px');
        $root.css('height', '156px');
        $root.html(
            '<table class="connectionContainer">' +
                '<tr>' + answersLeftColumn +
                    '<td class="connectionLeftColumn" style="width: auto;">' +
                        '<table class="content">' + 
                            this.getCoreElements(this.presenter.model['Left column'], true) +
                        '</table>' +
                    '</td>' +
                    '<td class="connectionMiddleColumn" style="width: auto;">' +
                        svgConnectionsHTML +
                    '</td>' +
                    '<td class="connectionRightColumn" style="width: auto;">' +
                        '<table class="content">' +
                            this.getCoreElements(this.presenter.model['Right column'], false) +
                        '</table>' +
                    '</td>' + answersRightColumn +
                '</tr>' +
            '</table>');
        return $root;
    },

    getLessonTemplate: function() {
        const printableLesson = document.createElement("div");
        printableLesson.classList.add("printable_lesson");

        const printablePage = document.createElement("div");
        printablePage.classList.add("printable_page");
        printablePage.setAttribute("style", "width:718px; height:1046px;");
        printableLesson.append(printablePage);

        const table = document.createElement("table");
        printablePage.append(table);
        const tbody = document.createElement("tbody");
        table.append(tbody);
        const tr = document.createElement("tr");
        tbody.append(tr);

        const printableContent = document.createElement("td");
        printableContent.classList.add("printable_content");
        printableContent.classList.add("single_column_print");
        tr.append(printableContent);

        const printablePlaceholder = document.createElement("div");
        printablePlaceholder.id = "printable_placeholder";
        printablePlaceholder.setAttribute("style", "vertical-align: top;height: 1046px;width: 100%; columns: 1;-webkit-columns:1;-moz-columns: 1; column-gap: 40px;");
        printableContent.append(printablePlaceholder);

        return printableLesson.outerHTML;
	}
});
