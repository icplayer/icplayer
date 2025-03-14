/**
 * @module commons
 */

(function (window) {
    /**
     Open activities utils.
     @class OpenActivitiesUtils
     */
    var OpenActivitiesUtils = {};

    /**
     Check if module supports AI.
     @method isAIReady

     @param {object} playerController player controller
     @param {String} pageID page ID
     @param {String} moduleID module ID
     @return {boolean} True if module supports AI, otherwise false
    */
    OpenActivitiesUtils.isAIReady = function OpenActivitiesUtils_isAIReady(playerController, pageID, moduleID) {
        return (OpenActivitiesUtils.isEnabled(playerController)
            && OpenActivitiesUtils.isAIModelReady(playerController, pageID, moduleID)
        );
    };

    /**
     Check if open activities are enabled.
     @method isEnabled

     @param {object} playerController player controller
     @return {boolean} True if enabled, otherwise false
    */
    OpenActivitiesUtils.isEnabled = function OpenActivitiesUtils_isEnabled(playerController) {
        var contextMetadata = playerController.getContextMetadata();
        return (!!contextMetadata && contextMetadata.isOpenActivitiesEnabled);
    };

    /**
     Check if AI model for module is ready.
     @method isAIModelReady

     @param {object} playerController player controller
     @param {String} pageID page ID
     @param {String} moduleID module ID
     @return {boolean} True if ready, otherwise false
    */
    OpenActivitiesUtils.isAIModelReady = function OpenActivitiesUtils_isAIModelReady(playerController, pageID, moduleID) {
        var contextMetadata = playerController.getContextMetadata();
        if (!contextMetadata || !contextMetadata.aiReady) {
            return false;
        }
        var configuration = contextMetadata.aiReady.find(
            function (configuration) {return (configuration.page_id === pageID && configuration.activity_id === moduleID);}
        );
        return configuration !== undefined;
    };

    /**
     Update addon score with AI grade.
     @method updateOpenActivityScore

     @param {object} playerController player controller
     @param {String} pageID page ID
     @param {String} moduleID module ID
     @param {Integer} aiGrade grade/score from AI
     @param {Integer} aiRelevance how relevant answer is
    */
    OpenActivitiesUtils.updateOpenActivityScore = function OpenActivitiesUtils_updateOpenActivityScore(playerController, pageID, moduleID, aiGrade, aiRelevance) {
        if (!this.isEnabled(playerController)) {
            return;
        }

        playerController.getScore().updateOpenActivityScore(pageID, moduleID, aiGrade, aiRelevance);
    };

    window.OpenActivitiesUtils = OpenActivitiesUtils;
})(window);
