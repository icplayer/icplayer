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
     @param {Array} pagesTimes time spend on pages

     @method getPresentation

     @return {Object} returns current presentation score (min, max, raw and scaled), errors count and checks count
     */
    window.PlayerUtils.prototype.getPresentationScore = function(presentation, pagesTimes) {
        pagesTimes = pagesTimes || { total: 0 };
        if (this.hasOwnProperty('scoreService')) {
            var sumOfScore = 0.0, sumOfErrors = 0, sumOfChecks = 0,
                sumOfMaxScore = 0.0,
                sumOfScaledScore = 0.0,
                sumOfMistakes = 0,
                pageScaledScore = 0,
                count = 0, i, page, score,
                paginatedResults = [];

            for (i = 0; i < presentation.getPageCount(); i++) {
                page = presentation.getPage(i);

                if (page.isReportable()) {
                    score = this.scoreService.getPageScoreById(page.getId());

                    if (score['maxScore']) {
                        pageScaledScore = score['score'] / score['maxScore'];
                    } else {
                        pageScaledScore = page.isVisited() ? 1 : 0;
                    }

                    sumOfScaledScore += pageScaledScore;
                    sumOfScore += score.score;
                    sumOfErrors += score.errorCount;
                    sumOfChecks += score.checkCount;
                    sumOfMaxScore += score.maxScore;
                    sumOfMistakes += score.mistakeCount;

                    paginatedResults[count] = {
                        "page_number": (i + 1),
                        "page_name": page.getName(),
                        "score": Math.floor(pageScaledScore * 100) / 100,
                        "errors_count": score['errorCount'] ? score['errorCount'] : 0,
                        "checks_count": score['checkCount'] ? score['checkCount'] : 0,
                        "mistake_count": score['mistakeCount'] ? score['mistakeCount'] : 0
                    };

                    count += 1;
                }
            }

            var scaledScore = 0;
            if (count > 0) {
                scaledScore = Math.floor((sumOfScaledScore / count) * 100) / 100;
            }

            return {
                minScore: 0,
                maxScore: count,
                rawScore: sumOfScaledScore,
                scaledScore: scaledScore,
                errorsCount: sumOfErrors,
                checksCount: sumOfChecks,
                mistakeCount: sumOfMistakes,
                paginatedResult: paginatedResults,
                totalTime: pagesTimes.total,
                pagesTimes: pagesTimes
            }
        }
    };

})(window);