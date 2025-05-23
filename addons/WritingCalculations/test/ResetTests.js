TestCase("[Writing Calculations] Reset tests", {
    setUp : function() {
        this.presenter = AddonWritingCalculations_create();
        this.presenter.isNotActivity = false;
    },

    createMockupOfAddonInShowAnswers: function() {
        this.presenter.isShowAnswersActive = true;
        this.presenter.helpBoxesDefaultValues = [["1", "2"]];
        this.presenter.userAnswers = ["3", "4"];
        this.presenter.helpBoxesUserAnswers = ["5", "6"];
        this.presenter.isDisabled = true;

        this.emptyBox1 = this.createEmptyBoxContainer("1", "1", "3");
        this.emptyBox1.children[0].setAttribute("disabled", "true");

        this.emptyBox2 = this.createEmptyBoxContainer("2", "1", "4");
        this.emptyBox2.children[0].setAttribute("disabled", "true");

        this.helpBox1 = this.createHelpBoxContainer("1", "2", "5");
        this.helpBox1.children[0].setAttribute("disabled", "true");

        this.helpBox2 = this.createHelpBoxContainer("2", "2", "6");
        this.helpBox2.children[0].setAttribute("disabled", "true");

        this.presenter.$view = this.createViewMockup([
            this.emptyBox1, this.helpBox1, this.emptyBox2, this.helpBox2
        ]);
    },

    createViewMockup: function (elements) {
        const view = document.createElement("div");

        elements.forEach((element) => {
            view.append(element);
        });

        return $(view);
    },

    createHelpBoxContainer: function (row, cell, value) {
        return this.createContainer(row, cell, value,"container-helpBox");
    },

    createEmptyBoxContainer: function (row, cell, value) {
        return this.createContainer(row, cell, value, "container-emptyBox");
    },

    createContainer: function (row, cell, value, className) {
        const container = document.createElement("div");
        container.classList.add(className);

        const input = document.createElement("input");
        input.classList.add("writing-calculations-input");
        input.setAttribute("row", row);
        input.setAttribute("cell", cell);
        input.setAttribute("value", value);

        container.append(input);
        return container;
    },

    validateElementValue: function (expectedValue, element) {
        assertEquals(expectedValue, $(element.firstChild).val());
    },

    'test given hidden addon by default but currently visible when reset executed then set visibility to default' : function() {
        // GIVEN
        this.createMockupOfAddonInShowAnswers();
        this.presenter.isVisibleByDefault = false;
        this.presenter.isVisible = true;
        this.presenter.$view.css("visibility", "visible");

        // WHEN
        this.presenter.reset();

        // THEN
        assertFalse(this.presenter.isVisibleByDefault);
        assertFalse(this.presenter.isVisible);
        assertEquals("hidden", this.presenter.$view.css("visibility"));
    },

    'test given addon in show answers state when reset executed then remove values from inputs' : function() {
        // GIVEN
        this.createMockupOfAddonInShowAnswers();

        // WHEN
        this.presenter.reset();

        // THEN
        this.validateElementValue("", this.emptyBox1);
        this.validateElementValue("", this.emptyBox2);
        this.validateElementValue("1", this.helpBox1);
        this.validateElementValue("2", this.helpBox2);
    },

    'test given addon in show answers state when reset executed then remove HTML attribute disabled from inputs' : function() {
        // GIVEN
        this.createMockupOfAddonInShowAnswers();

        // WHEN
        this.presenter.reset();

        // THEN
        assertNull(this.emptyBox1.children[0].getAttribute("disabled"));
        assertNull(this.emptyBox2.children[0].getAttribute("disabled"));
        assertNull(this.helpBox1.children[0].getAttribute("disabled"));
        assertNull(this.helpBox2.children[0].getAttribute("disabled"));
        assertFalse(this.presenter.isDisabled);
    },

    'test given addon in show answers state when reset executed then remove user answers' : function() {
        // GIVEN
        this.createMockupOfAddonInShowAnswers();

        // WHEN
        this.presenter.reset();

        // THEN
        assertEquals(0, this.presenter.userAnswers.length);
        assertEquals(0, this.presenter.helpBoxesUserAnswers.length);
    }
});
