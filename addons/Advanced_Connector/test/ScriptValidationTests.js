TestCase("Script validation", {
    setUp: function() {
        this.presenter = AddonAdvanced_Connector_create();
    },

    'test script undefined': function() {
        var validationResult = this.presenter.validateScript(undefined);

        assertTrue(validationResult.isError);
        assertEquals('SV_01', validationResult.errorCode);
    },

    'test script empty': function() {
        var validationResult = this.presenter.validateScript('');

        assertTrue(validationResult.isError);
        assertEquals('SV_01', validationResult.errorCode);
    },

    'test missing EVENTSTART': function() {
        var script =
            'Source: ImageViewer1T\n' +
            'Item: .*\n' +
            'EVENTEND';

        var validationResult = this.presenter.validateScript(script);

        assertTrue(validationResult.isError);
        assertEquals('SV_02', validationResult.errorCode);
    },

    'test missing EVENTEND': function() {
        var script =
            'EVENTSTART\n' +
            'Source: ImageViewer1T\n' +
            'Item: .*';

        var validationResult = this.presenter.validateScript(script);

        assertTrue(validationResult.isError);
        assertEquals('SV_03', validationResult.errorCode);
    },

    'test missing newline after EVENTSTART keyword': function() {
        var script =
            'EVENTSTART Item:2\n' +
            'Source: ImageViewer1T\n' +
            'Item: .*\n' +
            'EVENTEND';

        var validationResult = this.presenter.validateScript(script);

        assertTrue(validationResult.isError);
        assertEquals('SV_02', validationResult.errorCode);
    },

    'test missing newline after EVENTEND keyword': function() {
        var script =
            'EVENTSTART\n' +
            'Source: ImageViewer1T\n' +
            'Item: .*' +
            'EVENTEND EVENTSTART' +
            'Source: ImageViewer1T\n' +
            'Item: .*' +
            'EVENTSTART Item:2\n';

        var validationResult = this.presenter.validateScript(script);

        assertTrue(validationResult.isError);
        assertEquals('SV_03', validationResult.errorCode);
    },

    'test repeated EVENTSTART word': function() {
        var script =
            'EVENTSTART\n' +
            'Source:Slider.+\n' +
            'EVENTSTART\n' +
            'Item:1-1.+\n' +
            'Score:1\n' +
            'Value:2\n' +
            'SCRIPTSTART\n' +
            'Feedback1.change("Slider-New-Step");\n' +
            'SCRIPTEND\n' +
            'EVENTEND';

        var validationResult = this.presenter.validateScript(script);

        assertTrue(validationResult.isError);
        assertEquals('SV_07', validationResult.errorCode);
    },

    'test repeated EVENTEND word': function() {
        var script =
            'EVENTSTART\n' +
            'Source:Slider.+\n' +
            'Item:1-1.+\n' +
            'Score:1\n' +
            'Value:2\n' +
            'SCRIPTSTART\n' +
            'Feedback1.change("Slider-New-Step");\n' +
            'SCRIPTEND\n' +
            'EVENTEND\n' +
            'EVENTEND';

        var validationResult = this.presenter.validateScript(script);

        assertTrue(validationResult.isError);
        assertEquals('SV_02', validationResult.errorCode);
    },

    'test proper single event declaration': function() {
        var script =
            'EVENTSTART\n' +
            'Source:Slider.+\n' +
            'Item:1-1\n' +
            'Score:1\n' +
            'Value:2\n' +
            'SCRIPTSTART\n' +
            'Feedback1.change("Slider-New-Step");\n' +
            'SCRIPTEND\n' +
            'EVENTEND';
        var expectedEvents = [{
            Source: 'Slider.+',
            Item: '1-1',
            Value: '2',
            Score: '1',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: 'Feedback1.change("Slider-New-Step");'
        }];

        var validationResult = this.presenter.validateScript(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvents, validationResult.events);
    },

    'test proper multiple events declaration': function() {
        var script =
            'EVENTSTART\n' +
            'Source:Slider.+\n' +
            'Item:1-1\n' +
            'Score:1\n' +
            'Value:2\n' +
            'SCRIPTSTART\n' +
            'Feedback1.change("Slider-New-Step");\n' +
            'SCRIPTEND\n' +
            'EVENTEND\n' +
            'EVENTSTART\n' +
            'Source:ImageViewer1\n' +
            'Score:.*\n' +
            'Value:2\n' +
            'EVENTEND';
        var expectedEvents = [{
            Source: 'Slider.+',
            Item: '1-1',
            Value: '2',
            Score: '1',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: 'Feedback1.change("Slider-New-Step");'
        }, {
            Source: 'ImageViewer1',
            Item: '.*',
            Value: '2',
            Score: '.*',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: ''
        }];

        var validationResult = this.presenter.validateScript(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvents, validationResult.events);
    },

    'test proper multiple events declaration with redundant newlines': function() {
        var script =
            'EVENTSTART\n' +
            '\n' +
            'Source:Slider.+\n' +
            'Item:1-1\n' +
            'Score:1\n' +
            'Value:2\n' +
            '\n' +
            'SCRIPTSTART\n' +
            'Feedback1.change("Slider-New-Step");\n' +
            'SCRIPTEND\n' +
            'EVENTEND\n' +
            '\n' +
            'EVENTSTART\n' +
            'Source:ImageViewer1\n' +
            'Score:.*\n' +
            'Value:2\n' +
            'EVENTEND';
        var expectedEvents = [{
            Source: 'Slider.+',
            Item: '1-1',
            Value: '2',
            Score: '1',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: 'Feedback1.change("Slider-New-Step");'
        }, {
            Source: 'ImageViewer1',
            Item: '.*',
            Value: '2',
            Score: '.*',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: ''
        }];

        var validationResult = this.presenter.validateScript(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvents, validationResult.events);
    },

    'test empty event declaration': function() {
        var script =
            'EVENTSTART\n' +
            'EVENTEND';
        var expectedEvents = [{
            Source: '.*',
            Item: '.*',
            Value: '.*',
            Score: '.*',
            Type: '.*',
            Word: '.*',
            Name: 'ValueChanged',
            Code: ''
        }];

        var validationResult = this.presenter.validateScript(script);

        assertFalse(validationResult.isError);
        assertEquals(expectedEvents, validationResult.events);
    }
});