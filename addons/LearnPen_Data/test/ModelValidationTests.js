TestCase("[Smart_Pen_Data] Model validation", {

//    setUp: function() {
//        this.presenter = AddonSmart_Pen_Data_create();
//
//        this.model = {
//            'Is Disable': 'false',
//            'Chart type': 'Gauge',
//            '1st label': 'a',
//            '2nd label': 'b',
//            '3rd label': 'c',
//            '4th label': 'p',
//            'Background color': '#000000',
//            'Text color': 'black',
//            '1st color': '#000000',
//            '2nd color': '#000000',
//            '3rd color': '#000000',
//            '4th color': '#000000',
//            'Refresh time': '1000',
//            'Mode': 'All'
//        };
//    },

    'test wrong color name' : function() {
//        this.model['Background color'] = '666';
//        var validatedModel = this.presenter.validateModel(this.model);
//        assertFalse(validatedModel.is_valid);
//        assertEquals('C02', validatedModel.errorCode);
    },

    'test to low and too high Refresh time value' : function() {
//        this.model['Refresh time'] = 49;
//        var validatedModel = this.presenter.validateModel(this.model);
//        assertFalse(validatedModel.is_valid);
//        assertEquals('T01', validatedModel.errorCode);
//
//        this.model['Refresh time'] = 2001;
//        var validatedModel = this.presenter.validateModel(this.model);
//        assertFalse(validatedModel.is_valid);
//        assertEquals('T01', validatedModel.errorCode);
    },

    'test wrong type and mode combination' : function() {
//        this.model['Chart type'] = 'Bars';
//        this.model['Mode'] = 'Sum from squeezes';
//        var validatedModel = this.presenter.validateModel(this.model);
//        assertFalse(validatedModel.is_valid);
//        assertEquals('M01', validatedModel.errorCode);
//
//        this.model['Chart type'] = 'Radar';
//        this.model['Mode'] = 'Max from squeezes + pressure';
//        var validatedModel = this.presenter.validateModel(this.model);
//        assertFalse(validatedModel.is_valid);
//        assertEquals('M01', validatedModel.errorCode);
//
//        this.model['Chart type'] = 'Rose';
//        this.model['Mode'] = 'Squeeze C';
//        var validatedModel = this.presenter.validateModel(this.model);
//        assertFalse(validatedModel.is_valid);
//        assertEquals('M01', validatedModel.errorCode);
    }

});