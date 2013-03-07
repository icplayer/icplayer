TestCase("Blank fields filling", {
    setUp: function() {
        this.presenter = AddonAdvanced_Connector_create();
    },

    'test blank Source': function() {
        var eventDeclaration = {
            Source: undefined,
            Item: '2',
            Value: '3',
            Score: '4',
            Type: 'image',
            Name: 'ValueChanged',
            Word: 'babylon',
            Code: ''
        }, expectedEventDeclaration = {
            Source: '.*',
            Item: '2',
            Value: '3',
            Score: '4',
            Type: 'image',
            Name: 'ValueChanged',
            Word: 'babylon',
            Code: ''
        };

        this.presenter.fillBlankFields(eventDeclaration);

        assertEquals(expectedEventDeclaration, eventDeclaration);
    },

    'test blank Value': function() {
        var eventDeclaration = {
            Source: '1',
            Item: '2',
            Value: undefined,
            Score: '4',
            Type: 'image',
            Name: 'ValueChanged',
            Word: 'babylon',
            Code: ''
        }, expectedEventDeclaration = {
            Source: '1',
            Item: '2',
            Value: '.*',
            Score: '4',
            Type: 'image',
            Name: 'ValueChanged',
            Word: 'babylon',
            Code: ''
        };

        this.presenter.fillBlankFields(eventDeclaration);

        assertEquals(expectedEventDeclaration, eventDeclaration);
    },

    'test blank Score': function() {
        var eventDeclaration = {
            Source: '1',
            Item: '2',
            Value: '3',
            Score: undefined,
            Type: 'image',
            Name: 'ValueChanged',
            Word: 'babylon',
            Code: ''
        }, expectedEventDeclaration = {
            Source: '1',
            Item: '2',
            Value: '3',
            Score: '.*',
            Type: 'image',
            Name: 'ValueChanged',
            Word: 'babylon',
            Code: ''
        };

        this.presenter.fillBlankFields(eventDeclaration);

        assertEquals(expectedEventDeclaration, eventDeclaration);
    },

    'test blank Item': function() {
        var eventDeclaration = {
            Source: '1',
            Item: undefined,
            Value: '3',
            Score: '4',
            Type: 'image',
            Name: 'ValueChanged',
            Word: 'babylon',
            Code: ''
        }, expectedEventDeclaration = {
            Source: '1',
            Item: '.*',
            Value: '3',
            Score: '4',
            Type: 'image',
            Name: 'ValueChanged',
            Word: 'babylon',
            Code: ''
        };

        this.presenter.fillBlankFields(eventDeclaration);

        assertEquals(expectedEventDeclaration, eventDeclaration);
    },

    'test blank Type': function() {
        var eventDeclaration = {
            Source: '1',
            Item: '2',
            Value: '3',
            Score: '4',
            Type: undefined,
            Name: 'ValueChanged',
            Word: 'babylon',
            Code: ''
        }, expectedEventDeclaration = {
            Source: '1',
            Item: '2',
            Value: '3',
            Score: '4',
            Type: '.*',
            Name: 'ValueChanged',
            Word: 'babylon',
            Code: ''
        };

        this.presenter.fillBlankFields(eventDeclaration);

        assertEquals(expectedEventDeclaration, eventDeclaration);
    },

    'test blank Name': function() {
        var eventDeclaration = {
            Source: '1',
            Item: '2',
            Value: '3',
            Score: '4',
            Type: 'image',
            Name: undefined,
            Word: 'babylon',
            Code: ''
        }, expectedEventDeclaration = {
            Source: '1',
            Item: '2',
            Value: '3',
            Score: '4',
            Type: 'image',
            Name: 'ValueChanged',
            Word: 'babylon',
            Code: ''
        };

        this.presenter.fillBlankFields(eventDeclaration);

        assertEquals(expectedEventDeclaration, eventDeclaration);
    },

    'test blank Word': function() {
        var eventDeclaration = {
            Source: '1',
            Item: '2',
            Value: '3',
            Score: '4',
            Type: 'image',
            Name: 'ItemSelected',
            Word: undefined,
            Code: ''
        }, expectedEventDeclaration = {
            Source: '1',
            Item: '2',
            Value: '3',
            Score: '4',
            Type: 'image',
            Name: 'ItemSelected',
            Word: '.*',
            Code: ''
        };

        this.presenter.fillBlankFields(eventDeclaration);

        assertEquals(expectedEventDeclaration, eventDeclaration);
    },

    'test no blank fields': function() {
        var eventDeclaration = {
            Source: '1',
            Item: '2',
            Value: '3',
            Score: '4',
            Type: 'image',
            Name: 'ValueChanged',
            Word: 'babylon',
            Code: ''
        }, expectedEventDeclaration = {
            Source: '1',
            Item: '2',
            Value: '3',
            Score: '4',
            Type: 'image',
            Name: 'ValueChanged',
            Word: 'babylon',
            Code: ''
        };

        this.presenter.fillBlankFields(eventDeclaration);

        assertEquals(expectedEventDeclaration, eventDeclaration);
    },

    'test empty fields not to be filled': function() {
        var eventDeclaration = {
            Source: '',
            Item: '',
            Value: '',
            Score: '',
            Type: '',
            Name: '',
            Word: '',
            Code: ''
        }, expectedEventDeclaration = {
            Source: '',
            Item: '',
            Value: '',
            Score: '',
            Type: '',
            Name: '',
            Word: '',
            Code: ''
        };

        this.presenter.fillBlankFields(eventDeclaration);

        assertEquals(expectedEventDeclaration, eventDeclaration);
    }
});