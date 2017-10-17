TestCase("[TrueFalse] Model upgrading tests", {
   setUp: function () {
     this.presenter = AddonTrueFalse_create();

     this.model = {
         'isNotActivity': "True",
         'Multi': "False",
         'Questions': [{
                 'Question': "True is on the left",
                 'Answser': "1"
             }],
         'Choices': [{
             'Choice': "True"
         }]
     };

     this.expectedModel = {
         'isNotActivity': "True",
         'Multi': "False",
         'Questions': [{
                 'Question': "True is on the left",
                 'Answser': "1"
             }],
         'Choices': [{
             'Choice': "True"
         }],
         'enableTabindex': "False"
     };
   },

    'test should upgrade model': function () {
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertEquals(this.expectedModel, upgradedModel);
    },

    'test should not upgrade isTabindexEnabled when it already exists': function () {
        this.model['enableTabindex'] = "True";
        this.expectedModel['enableTabindex'] = "True";

        var upgradedModel = this.presenter.upgradeModel(this.model);
        assertEquals(this.expectedModel, upgradedModel);
    }
});