UtilityValidation = TestCase("Utility Validation");

UtilityValidation.prototype.testGetDialogDataById = function() {
    var presenter = AddonGlossary_create();
    var expectedData = {
        "title" : "Karol",
        "description" : "A Handbook of Agile Sofware Craftsmanship"
    };
    
    presenter.model = {
        "List of words" : [{
            "ID" : "1",
            "Text" : "Frugo",
            "Description" : "Bez konserwantow"
        }, {
            "ID" : "2",
            "Text" : "Karol",
            "Description" : "A Handbook of Agile Sofware Craftsmanship"
        }],
        "Visible" : "False"
    };

    var dialogData = presenter.getDialogDataById("2");

    assertEquals("Dialog data object and expected data object should have the same value of parameter title.", expectedData.title, dialogData.title);
    assertEquals("Dialog data object and expected data object should have the same value of parameter description.", expectedData.description, dialogData.description);
};