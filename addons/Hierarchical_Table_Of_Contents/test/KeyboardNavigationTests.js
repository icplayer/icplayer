TestCase("[Hierarchical Table Of Contents] Keyboard Navigation", {

    setUp : function() {
        this.presenter = AddonHierarchical_Table_Of_Contents_create();

        this.presenter.configuration = {
            ID: "Hierarchical_Table_of_Contents",
            displayOnlyChapters: false,
            isValid: true,
        };

        this.presenter.$view = $('<div></div>');
        this.$tableOfContent = this.generateView();
        this.$tableOfContent.appendTo(this.presenter.$view);

        setSpeechTexts(this.presenter);
        this.presenter.buildKeyboardController();
    },

    generateView: function () {
        let $view = $(`<div></div>`);
        $view.addClass("addon_Hierarchical_Table_Of_Contents");
        $view.append(this.generateHierReport());

        return $view;
    },

    generateHierReport: function () {
        let $hierReport = $(`<div></div>`);
        $hierReport.addClass("hier_report");
        $hierReport.append(this.generateTable());

        return $hierReport;
    },

    generateTable: function () {
        const $table = $(`<table></table>`);
        $table.append("<tbody></tbody>");

        const $tableBody = $table.find("tbody");
        $tableBody.append(this.generateTableHeader());
        $tableBody.append(this.generateTableRowWithId(1));
        $tableBody.append(this.generateChapterWithID(2));
        $tableBody.append(this.generateTableRowWithIdAndParent(3, 2));
        $tableBody.append(this.generateChapterWithID(4));

        return $table;
    },

    generateTableHeader: function () {
        let $header = $(`
            <tr>
                <td>Header</td>
            </tr>
        `);
        $header.addClass("hier_report-header");

        return $header;
    },

    generateChapterWithID: function (id) {
        let $tr = $(`
            <tr class="treegrid-${id} treegrid-collapsed hier_report-chapter">
                <td>
                    <div class="treegrid-expander treegrid-expander-collapsed"></div>
                    <div class="text-wrapper">Chapter</div>
                </td>
            </tr>
        `);

        return $tr;
    },

    generateTableRowWithIdAndParent: function (id, parentId) {
        let $tr = $(`
            <tr class="treegrid-${id} treegrid-parent-${parentId}" style="display: none">
                <td>
                    <div class="text-wrapper">Page with parent</div>
                </td>
            </tr>
        `);

        return $tr;
    },

    generateTableRowWithId: function (id) {
        let $tr = $(`
            <tr class="treegrid-${id}">
                <td>
                    <div class="text-wrapper">
                        Page
                    </div>
                </td>
            </tr>
        `);

        return $tr;
    },

    getTreeGrid: function (id) {
        return this.presenter.$view.find(`.treegrid-${id}`);
    },

    setCollapsedChapterAsCurrentElement: function () {
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);
    },

    setLastKeyNavElementAsCurrentElement: function () {
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 1);
    },

    setTableRowAfterCollapsedChapterAsCurrentElement: function () {
        KeyboardController.prototype.switchElement.call(this.presenter.keyboardControllerObject, 3);
    },

    'test given view when entering for the first time by keyboard navigation then should mark first hyper link' : function() {
        activateEnterEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.presenter.$view.find(".treegrid-1")));
    },

    'test given keyNav next element collapsed when moving to next element then skip to next one' : function() {
        activateEnterEvent(this.presenter);
        this.setCollapsedChapterAsCurrentElement();

        activateTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.presenter.$view.find(".treegrid-4")));
    },

    'test given keyNav previous element collapsed when moving to previous element then skip to next one' : function() {
        activateEnterEvent(this.presenter);
        this.setTableRowAfterCollapsedChapterAsCurrentElement();

        activateShiftTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(this.presenter.$view.find(".treegrid-2")));
    },

    'test given current element expanded when switching to next then should get first child' : function() {
        activateEnterEvent(this.presenter);
        this.setCollapsedChapterAsCurrentElement();
        const nestedTreeGrid = this.getTreeGrid(3);
        setVisible(nestedTreeGrid);

        activateTabEvent(this.presenter);

        assertTrue(hasKeyboardNavigationActiveElementClass(nestedTreeGrid));
    },

    'test given first enter when TTS active then title should be marked' : function() {
        this.setWCAGStatus(true);

        activateEnterEvent(this.presenter);

        const tableHeader = this.presenter.$view.find(".hier_report-header")
        assertTrue(hasKeyboardNavigationActiveElementClass(tableHeader));
    },

    'test given last keyNav element active when switching to next then should stay at last' : function() {
        activateEnterEvent(this.presenter);
        this.setLastKeyNavElementAsCurrentElement();

        activateTabEvent(this.presenter);
        activateTabEvent(this.presenter);

        const lastTreeGrid = this.getTreeGrid(4);
        assertTrue(hasKeyboardNavigationActiveElementClass(lastTreeGrid));
    },

    'test given first keyNav element active when switching to previous then should stay at first' : function() {
        activateEnterEvent(this.presenter);

        activateShiftTabEvent(this.presenter);
        activateShiftTabEvent(this.presenter);

        const firstTreeGrid = this.getTreeGrid(1);
        assertTrue(hasKeyboardNavigationActiveElementClass(firstTreeGrid));
    },

});

function activateEnterEvent(presenter, stub) {
    const keycode = 13;
    const event = {
        'keyCode': keycode,
        preventDefault: stub ? stub : sinon.stub()
    };
    presenter.keyboardController(keycode, false, event);
}

function activateShiftTabEvent(presenter, stub) {
    const keycode = 9;
    const event = {
        'keyCode': keycode,
        preventDefault: stub ? stub : sinon.stub()
    };
    presenter.keyboardController(keycode, true, event);
}

function activateTabEvent(presenter, stub) {
    const keycode = 9;
    const event = {
        'keyCode': keycode,
        preventDefault: stub ? stub : sinon.stub()
    };
    presenter.keyboardController(keycode, false, event);
}

function setVisible($element) {
    $element.show();
}

function setSpeechTexts(presenter) {
    presenter.setSpeechTexts({
        Title: {Title: ""},
        GoToPage: {GoToPage: ""},
        Chapter: {Chapter: ""},
        Expanded: {Expanded: ""},
        Collapsed: {Collapsed: ""},
    });
}

function hasKeyboardNavigationActiveElementClass($element) {
    return $element.hasClass("keyboard_navigation_active_element");
}

