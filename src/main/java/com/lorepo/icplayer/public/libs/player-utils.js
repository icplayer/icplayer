/**
 * @module PlayerUtils
 */
(function (window) {
    /**
     Player utils
     @class PlayerUtils
     */

        // Expose utils to the global object
    window.PlayerUtils = function (playerObject) {

        if (playerObject.hasOwnProperty("getPlayerServices")) {
            this.player = playerObject;
            this.playerServices = playerObject.getPlayerServices();
            this.scoreService = this.playerServices.getScore();
        }
    };

    /**
     Returns Presentation object
     @method getPresentation

     @return {Object} current presentation
     */
    window.PlayerUtils.prototype.getPresentation = function getPresentation() {
        if (this.hasOwnProperty("playerServices")) {
            return this.playerServices.getPresentation();
        }
        else {
            return undefined;
        }
    };

    /**
     Returns Presentation object

     @param {Object} presentation current presentation object

     @method getPresentation

     @return {Object} returns current presentation score (min, max, raw and scaled), errors count and checks count
     */
    window.PlayerUtils.prototype.getPresentationScore = function (presentation) {
        if (this.hasOwnProperty("scoreService")) {
            var sumOfScore = 0.0, sumOfErrors = 0, sumOfChecks = 0,
                sumOfMaxScore = 0.0,
                sumOfScaledScore = 0.0,
                sumOfMistakes = 0,
                count = 0, i, page, score,
                paginatedResults = new Array();

            for (i = 0; i < presentation.getPageCount(); i++) {
                page = presentation.getPage(i);

                if (page.isReportable()) {
                    score = this.scoreService.getPageScoreById(page.getId());
                    sumOfScaledScore += score['maxScore'] ? score['score']/score['maxScore'] : 0;
                    sumOfScore += score.score;
                    sumOfErrors += score.errorCount;
                    sumOfChecks += score.checkCount;
                    sumOfMaxScore += score.maxScore;
                    sumOfMistakes += score.mistakeCount;
  					paginatedResults[count] = { "page_number": (i+1),
								"page_name" : page.getName(),
								"score" : score['maxScore'] ? (score['score']/score['maxScore']) : 0,
								"errors_count": score['errorCount'] ? score['errorCount'] : 0,
								"checks_count" : score['checkCount'] ? score['checkCount'] : 0,
								"mistake_count" : score['mistakeCount'] ? score['mistakeCount'] : 0
							  };

                    count += 1;
                }
            }

            return {
                minScore: 0,
                maxScore: count,
                rawScore: sumOfScaledScore,
                scaledScore: count > 0 ? sumOfScaledScore / count : 0,
                errorsCount: sumOfErrors,
                checksCount: sumOfChecks,
                mistakeCount: sumOfMistakes,
                paginatedResult: paginatedResults
            }
        }
        else {
            return undefined;
        }
    };
})(window);