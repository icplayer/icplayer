TestCase("Events creation", {
    setUp: function () {
        this.presenter = AddonDouble_State_Button_create();
        this.presenter.configuration = {
            addonID: 'DoubleStateButton1'
        };
    },

    'test addon was selected': function () {
        this.presenter.configuration.isSelected = true;

        var eventData = this.presenter.createEventData();

        assertEquals('DoubleStateButton1', eventData.source);
        assertEquals('', eventData.item);
        assertEquals('1', eventData.value);
        assertEquals('', eventData.score);
    },

    'test addon was deselected': function () {
        this.presenter.configuration.isSelected = false;

        var eventData = this.presenter.createEventData();

        assertEquals('DoubleStateButton1', eventData.source);
        assertEquals('', eventData.item);
        assertEquals('0', eventData.value);
        assertEquals('', eventData.score);
    }
});

TestCase("Events sending", {
    setUp: function () {
        this.presenter = AddonDouble_State_Button_create();
        this.presenter.configuration = {
            addonID: 'DoubleStateButton1',
            selected: { event: "" },
            deselected: { event: "" }
        };

        this.eventData = {
            stopPropagation: function () {}
        };

        sinon.stub(this.presenter, 'executeUserEventCode');
        sinon.stub(this.presenter, 'setElementSelection');
        sinon.stub(this.presenter, 'updateLaTeX');
        sinon.stub(this.presenter, 'sendEventData');

        sinon.stub(this.eventData, 'stopPropagation');
    },

    tearDown: function () {
        this.presenter.executeUserEventCode.restore();
        this.presenter.setElementSelection.restore();
        this.presenter.updateLaTeX.restore();
        this.presenter.sendEventData.restore();
    },

    'test user selects element': function () {
        this.presenter.configuration.isSelected = false;

        this.presenter.clickHandler(this.eventData);

        assertTrue(this.eventData.stopPropagation.calledOnce);
        assertTrue(this.presenter.sendEventData.calledOnce);
    },

    'test user deselects element': function () {
        this.presenter.configuration.isSelected = false;

        this.presenter.clickHandler(this.eventData);

        assertTrue(this.eventData.stopPropagation.calledOnce);
        assertTrue(this.presenter.sendEventData.calledOnce);
    }
});