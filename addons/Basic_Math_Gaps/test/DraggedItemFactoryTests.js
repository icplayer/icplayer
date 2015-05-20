TestCase("[Basic_Math_Gaps] [Dragged Item Factory] Validate Event data", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
        this.factory = new this.presenter.DraggedItemFactoryObject();

        this.invalidData = {
        };

        this.validData = {
            type: "string",
            value: "2",
            item: "test source"
        };

    },

    'test when data is valid, it shouldnt change it type': function () {
        var validatedData = this.factory._validateEventData(this.validData);
        assertEquals(this.validData.type, validatedData.type);
    },

    'test when data dont have type is invalid, it type should be NullObject': function () {
        var validatedData = this.factory._validateEventData(this.invalidData);
        assertEquals("NullObject", validatedData.type);
    },

    'test when data dont have value is invalid, it type should be NullObject': function () {
        this.invalidData = {
            type: 'string'
        };

        var validatedData = this.factory._validateEventData(this.invalidData);
        assertEquals("NullObject", validatedData.type);
    },

    'test when data dont have item is invalid, it type should be NullObject': function () {
        this.invalidData = {
            type: 'string',
            value: "54"
        };

        var validatedData = this.factory._validateEventData(this.invalidData);
        assertEquals("NullObject", validatedData.type);
    }
});



TestCase("[Basic_Math_Gaps] [Dragged Item Factory] Produce validation", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
        this.factory = new this.presenter.DraggedItemFactoryObject();

        this.textItemData = {
            type: "string",
            value: "2",
            item: "test source"
        };

        this.invalidData = {
            type: "lkfjahspoa3",
            value: "2",
            item: "test source"
        };
    },
    'test when type is string it should produce text item': function () {
        var producedObject = this.factory.produce(this.textItemData);

        assertInstanceOf(this.presenter.TextItem, producedObject);
    },

    'test when type is not valid it should produce null item': function () {
        var producedObject = this.factory.produce(this.invalidData);

        assertInstanceOf(this.presenter.NullItemObject, producedObject);
    }
});