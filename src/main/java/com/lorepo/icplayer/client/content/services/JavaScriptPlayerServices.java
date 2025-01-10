package com.lorepo.icplayer.client.content.services;

import java.util.Iterator;
import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.dom.client.Document;
import com.google.gwt.dom.client.NativeEvent;
import com.google.gwt.event.dom.client.DomEvent;
import com.google.gwt.user.client.ui.RootPanel;
import com.lorepo.icf.utils.ExtendedRequestBuilder;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.utils.StringUtils;
import com.lorepo.icplayer.client.PlayerApp;
import com.lorepo.icplayer.client.content.services.dto.ScaleInformation;
import com.lorepo.icplayer.client.content.services.externalNotifications.ObserverJSService;
import com.lorepo.icplayer.client.model.Content;
import com.lorepo.icplayer.client.model.adaptive.AdaptiveConnection;
import com.lorepo.icplayer.client.model.page.Page;
import com.lorepo.icplayer.client.module.addon.AddonPresenter;
import com.lorepo.icplayer.client.model.page.group.GroupPresenter;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.player.IChapter;
import com.lorepo.icplayer.client.module.api.player.IPage;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.api.player.PageScore;
import com.lorepo.icplayer.client.module.button.ButtonPresenter;
import com.lorepo.icplayer.client.module.checkbutton.CheckButtonPresenter;
import com.lorepo.icplayer.client.module.choice.ChoicePresenter;
import com.lorepo.icplayer.client.module.errorcounter.ErrorCounterPresenter;
import com.lorepo.icplayer.client.module.image.ImagePresenter;
import com.lorepo.icplayer.client.module.imagegap.ImageGapPresenter;
import com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter;
import com.lorepo.icplayer.client.module.lessonreset.LessonResetPresenter;
import com.lorepo.icplayer.client.module.limitedcheck.LimitedCheckPresenter;
import com.lorepo.icplayer.client.module.limitedreset.LimitedResetPresenter;
import com.lorepo.icplayer.client.module.ordering.OrderingPresenter;
import com.lorepo.icplayer.client.module.pageprogress.PageProgressPresenter;
import com.lorepo.icplayer.client.module.shape.ShapePresenter;
import com.lorepo.icplayer.client.module.sourcelist.SourceListPresenter;
import com.lorepo.icplayer.client.module.text.GapInfo;
import com.lorepo.icplayer.client.module.text.InlineChoiceInfo;
import com.lorepo.icplayer.client.module.text.TextParser;
import com.lorepo.icplayer.client.module.text.TextParser.ParserResult;
import com.lorepo.icplayer.client.module.text.TextPresenter;
import com.lorepo.icplayer.client.module.api.event.ResetPageEvent;
import com.lorepo.icplayer.client.module.api.player.PageOpenActivitiesScore;
import com.lorepo.icplayer.client.module.api.player.PageOpenActivitiesScore.ScoreInfo;
import com.lorepo.icplayer.client.printable.IPrintableModuleModel;
import com.lorepo.icplayer.client.printable.Printable;

public class JavaScriptPlayerServices {
	private final IPlayerServices playerServices;
	private final JavaScriptObject jsObject;
	private JavaScriptObject presentationObject;

	public JavaScriptPlayerServices(IPlayerServices playerServices) {
		this.playerServices = playerServices;
		jsObject = initJSObject(this);
	}

	public JavaScriptObject getJavaScriptObject() {
		return jsObject;
	}

	public JsArray<JavaScriptObject> getAssetsAsJS() {
		List<JavaScriptObject> assetsList = playerServices.getAssetsService().getAssetsAsJS();
		JsArray<JavaScriptObject> jsArray = (JsArray<JavaScriptObject>) JavaScriptObject.createArray();

		for (JavaScriptObject object : assetsList){
			jsArray.push(object);
		}
		return jsArray;
	}

	private native JavaScriptObject initJSObject(JavaScriptPlayerServices x) /*-{

		var playerServices = function() {};

		playerServices.getPresentation = function() {
			var model = function() {};

			model.getPageCount = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getPageCount()();
			};

			model.getPage = function(index) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getPageByIndex(I)(index);
			};

			model.getPageById = function(id) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getPageById(Ljava/lang/String;)(id);
			};

			model.getTableOfContents = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getTableOfContents()();
			};

			return model;
		};

		playerServices.getRenderedModuleOrderForPrint = function() {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getRenderedModuleOrderForPrint()();
		}

		playerServices.getRenderedDefaultHeaderModuleOrderForPrint = function() {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getRenderedDefaultHeaderModuleOrderForPrint()();
		}

		playerServices.getRenderedDefaultFooterModuleOrderForPrint = function() {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getRenderedDefaultFooterModuleOrderForPrint()();
		}

		playerServices.getCurrentPageIndex = function() {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getCurrentPageIndex()();
		};
		
		playerServices.getPageTitle = function() {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getPageTitle()();
		};

		playerServices.getObserverService = function() {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getJSObserverService()();
		};

		playerServices.getCommands = function() {
			var commands = function() {
			};

			commands.showNextAnswer = function(worksWith) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::showNextAnswer(Ljava/lang/String;)(worksWith);
			}

			commands.hideGradualAnswers = function() {
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::hideGradualAnswers()();
			}

			commands.enableKeyboardNavigation = function() {
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::enableKeyboardNavigation()();
			};
			
			commands.disableKeyboardNavigation = function() {
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::disableKeyboardNavigation()();
			};

			commands.gotoPage = function(pageName) {
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::gotoPage(Ljava/lang/String;)(pageName);
			};

			commands.gotoPageIndex = function(index) {
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::gotoPageIndex(I)(index);
			};
			
			commands.gotoPageId = function(pageId) {
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::gotoPageId(Ljava/lang/String;)(pageId);
			};

			commands.gotoCommonPage = function(pageName) {
			    x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::gotoCommonPage(Ljava/lang/String;)(pageName);
			}

			commands.gotoCommonPageId = function(pageId) {
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::gotoCommonPageId(Ljava/lang/String;)(pageId);
			};
			
			commands.executeEventCode = function(code) {
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::executeEventCode(Ljava/lang/String;)(code);
			};
			
			commands.getTimeElapsed = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getTimeElapsed()();
			};
			
			commands.incrementCheckCounter = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::incrementCheckCounter()();
			};
			
			commands.increaseMistakeCounter = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::increaseMistakeCounter()();
			};

			commands.checkAnswers = function(updateCounter) {
				if (updateCounter == undefined) updateCounter = true;
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::checkAnswers(Z)(updateCounter);

			};
			
			commands.uncheckAnswers = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::uncheckAnswers()();
			};

			commands.showAnswers = function(source) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::showAnswers(Ljava/lang/String;)(source);
			}

			commands.hideAnswers = function(source) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::hideAnswers(Ljava/lang/String;)(source);
			}
			
			commands.sendPageAllOkOnValueChanged = function(sendEvent) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::sendPageAllOkOnValueChanged(Z)(sendEvent);
			};
			
			commands.setNavigationPanelsAutomaticAppearance = function(shouldAppear) {
				if (typeof shouldAppear != "boolean") {
					throw new TypeError();
				}
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::setNavigationPanelsAutomaticAppearance(Z)(shouldAppear);
			};
			
			commands.showNavigationPanels = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::showNavigationPanels()();
			};
			
			commands.hideNavigationPanels = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::hideNavigationPanels()();
			};
			
			commands.showPopup = function(pageName, top, left, additionalClasses) {
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::showPopup(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)(pageName, top, left, additionalClasses);
			};
			
			commands.closePopup = function() {
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::closePopup()();
			};
			
			commands.outstretchHeight = function (y, height, dontMoveModules, layoutName) {
				if (dontMoveModules === undefined) {
					dontMoveModules = false;
				}
				if (layoutName === undefined) {
					layoutName = "";
				}
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::outstretchHeight(IILjava/lang/Boolean;Ljava/lang/String;)(y, height, @java.lang.Boolean::valueOf(Z)(dontMoveModules), layoutName);
			};

			commands.changeHeaderVisibility = function (isVisible) {
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::changeHeaderVisibility(Z)(isVisible);
			};

			commands.changeFooterVisibility = function (isVisible) {
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::changeFooterVisibility(Z)(isVisible);
			};
			
			commands.getPageStamp = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getPageStamp()();
			}

			commands.reset = function(resetOnlyWrong) {
			    x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::reset(Z)(resetOnlyWrong);
			}

			commands.resetPage = function(index) {
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::resetPage(I)(index - 1);
			}

			commands.resetPageById = function(id) {
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::resetPageById(Ljava/lang/String;)(id);
			}

			commands.setAllPagesAsVisited = function() {
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::setAllPagesAsVisited()();
			}

			return commands;
		};

		playerServices.getEventBus = function() {
			var commands = function() {
			};

			commands.addEventListener = function(name, listener, isDelayed) {
				if(isDelayed == undefined){
					isDelayed = false;
				}

				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::addEventListener(Ljava/lang/String;Lcom/google/gwt/core/client/JavaScriptObject;Z)(name, listener, isDelayed);
			};

			commands.sendEvent = function(name, data) {
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::sendEvent(Ljava/lang/String;Lcom/google/gwt/core/client/JavaScriptObject;)(name, data);
			};
			return commands;
		};

		playerServices.getTextParser = function() {
			var commands = function() {
			};

			commands.parse = function(text) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::parseText(Ljava/lang/String;)(text);
			};
			
			commands.parseAltTexts = function(text) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::parseAltTexts(Ljava/lang/String;)(text);
			};

			commands.parseGaps = function(text, options) {
				if (typeof options == 'undefined') {
					options = {
						isCaseSensitive: false
					};
				}

				if (!('isCaseSensitive' in options)) {
					options.isCaseSensitive = false;
				}
				
				if (!('isKeepOriginalOrder' in options)) {
					options.isKeepOriginalOrder = false;
				}

				if (!('useDraggableGaps' in options)) {
					options.useDraggableGaps = false;
				}

				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::parseGaps(Ljava/lang/String;Lcom/google/gwt/core/client/JavaScriptObject;)(text, options);
			};

			commands.connectLinks = function(node) {
				node
						.find('.ic_definitionLink')
						.click(
								function(e) {
									e.preventDefault();
									e.stopPropagation();
									var name = 'Definition' ;
									var data = {
										'word' : $wnd.$(this).html()
									};
									x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::sendEvent(Ljava/lang/String;Lcom/google/gwt/core/client/JavaScriptObject;)(name, data);
								});
			};

			commands.escapeXMLEntities = function (text) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::escapeXMLEntities(Ljava/lang/String;)(text);
			}

			commands.parseAnswer = function (rawAnswer) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::parseAnswer(Ljava/lang/String;)(rawAnswer);
			}

			return commands;
		};

		playerServices.getGroup = function(id) {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getGroup(Ljava/lang/String;)(id);
		};

		playerServices.getModule = function(id) {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getModule(Ljava/lang/String;)(id);
		};

		playerServices.getHeaderModule = function(id) {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getHeaderModule(Ljava/lang/String;)(id);
		};

		playerServices.getFooterModule = function(id) {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getFooterModule(Ljava/lang/String;)(id);
		};

		playerServices.getModuleMetadata = function (moduleID) {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getModuleMetadata(Ljava/lang/String;)(moduleID);
		};

		playerServices.setAbleChangeLayout = function(isAbleChangeLayout){
			x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::setAbleChangeLayout(Z)(isAbleChangeLayout); 
		};

		playerServices.getScore = function() {
			var score = function() {
			};

			score.getMaxScore = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getMaxScore()();
			};

			score.getTotalScore = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getTotalScore()();
			};

			score.getPageScore = function(name) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getPageScore(Ljava/lang/String;)(name);
			};

			score.getPageScoreById = function(pageId) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getPageScoreById(Ljava/lang/String;)(pageId);
			};

			score.getOpenActivityScores = function(pageID, moduleID){
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getOpenActivityScores(Ljava/lang/String;Ljava/lang/String;)(pageID, moduleID);
			};

			score.getPageScoreWithoutOpenActivitiesById = function(pageID){
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getPageScoreWithoutOpenActivitiesById(Ljava/lang/String;)(pageID);
			};

			score.updateOpenActivityScore = function(pageID, moduleID, aiGrade, aiRelevance){
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::updateOpenActivityScore(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)(pageID, moduleID, aiGrade, aiRelevance);
			};

			return score;
		};

		playerServices.getTimeService = function() {
			var time = function() {
			};

			time.getTotalTime = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getTotalTime()();
			}

			time.getPageTimeById = function(pageId) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getPageTimeById(Ljava/lang/String;)(pageId);
			}

			return time;
		}

		playerServices.getAssets = function() {
			var assets = function() {
			};

			assets.getContentType = function(href) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getContentType(Ljava/lang/String;)(href);
			};

			assets.getAssetsAsJS = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getAssetsAsJS()();
			};

			return assets;
		};

		playerServices.getStaticFilesPath = function() {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getStaticFilesPath()();
		};

		playerServices.isBookMode = function() {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::isBookMode()();
		};

		playerServices.hasCover = function() {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::hasCover()();
		};
		
		playerServices.iframeScroll = function() {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getIframeScroll()();
		};
		
		playerServices.sendExternalEvent = function(eventType, data) {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::sendExternalEvent(Ljava/lang/String;Ljava/lang/String;)(eventType, data);
		};

		playerServices.getScaleInformation = function() {
			var scaleInfo = x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getScaleInformation()();
			var jsScaleInfo = {
				baseScaleX: scaleInfo.@com.lorepo.icplayer.client.content.services.dto.ScaleInformation::baseScaleX,
				baseScaleY: scaleInfo.@com.lorepo.icplayer.client.content.services.dto.ScaleInformation::baseScaleY,
				scaleX: scaleInfo.@com.lorepo.icplayer.client.content.services.dto.ScaleInformation::scaleX,
				scaleY: scaleInfo.@com.lorepo.icplayer.client.content.services.dto.ScaleInformation::scaleY,
				transform: scaleInfo.@com.lorepo.icplayer.client.content.services.dto.ScaleInformation::transform,
				transformOrigin: scaleInfo.@com.lorepo.icplayer.client.content.services.dto.ScaleInformation::transformOrigin
			}
			return jsScaleInfo;
		};
		
		playerServices.setScaleInformation = function(scaleInfo) {
			x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::setScaleInformation(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)(scaleInfo.scaleX,scaleInfo.scaleY,scaleInfo.transform,scaleInfo.transformOrigin);
		};
		
		playerServices.setFinalScaleInformation = function(scaleInfo) {
			x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::setFinalScaleInformation(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)(scaleInfo.scaleX,scaleInfo.scaleY,scaleInfo.transform,scaleInfo.transformOrigin);
		};

		playerServices.isPlayerInCrossDomain = function() {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::isPlayerInCrossDomain()();
		}
		
		playerServices.isWCAGOn = function() {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::isWCAGOn()();
		};

		playerServices.getResponsiveVoiceLang = function() {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getResponsiveVoiceLang()();
		};
		
		playerServices.getKeyboardController = function() {
			var keyboardController = function() {
			};

			keyboardController.moveActiveModule = function(reverseDirection) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::moveActiveModule(Z)(reverseDirection);
			}

			return keyboardController;
		}
		
		playerServices.changeSemiResponsiveLayout = function (layoutIDOrName) {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::changeSemiResponsiveLayout(Ljava/lang/String;)(layoutIDOrName);
		}
		
		playerServices.changeResponsiveLayout = function (layoutIDOrName) {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::changeSemiResponsiveLayout(Ljava/lang/String;)(layoutIDOrName);
		}

		playerServices.getContextMetadata = function() {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getContextMetadata()();
		};

		playerServices.setExternalVariable = function (key, value) {
			x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::setExternalVariable(Ljava/lang/String;Ljava/lang/String;)(key, value);
		};

		playerServices.getExternalVariable = function(key){
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getExternalVariable(Ljava/lang/String;)(key);
		};

		playerServices.sendResizeEvent = function() {
			x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::sendResizeEvent()();
		};

		playerServices.getContentMetadataValue = function (key) {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getContentMetadataValue(Ljava/lang/String;)(key);
		}

		playerServices.getAdaptiveLearningService = function () {
			var adaptive = function() {};

			adaptive.getCurrentPageConnections = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getAdaptiveConnectionCurrentPage()();
			};

			adaptive.addAndMoveToNextPage = function(pageID) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::addAndMoveToNextPage(Ljava/lang/String;)(pageID);
			};

			adaptive.getPageConnections = function(pageID) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getAdaptiveConnectionForPage(Ljava/lang/String;)(pageID);
			};

			adaptive.moveToNextPage = function (pageID) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::moveToNextAdaptivePage()();
			}

			adaptive.moveToPrevPage = function () {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::moveToPrevAdaptivePage()();
			}

			adaptive.isNextAdaptivePageAvailable = function () {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::isNextAdaptivePageAvaialable()();
			}

			adaptive.resetHistory = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::resetHistory()();
			}

			adaptive.getPageDifficulty = function(pageID) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getPageDifficulty(Ljava/lang/String;)(pageID);
			}

			adaptive.isLastStep = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::isLastStep()();
			}

			adaptive.isFirstStep = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::isFirstStep()();
			}

			return adaptive;
		}

		playerServices.getPagesMapping = function() {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getPagesMapping()();
		}

		playerServices.getOpenEndedContentForCurrentPage = function () {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getOpenEndedContentForCurrentPage()();
		}

		playerServices.clearVisitedPages = function() {
			x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::clearVisitedPages()();
		};

		playerServices.getResponsiveLayouts = function () {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getResponsiveLayouts()();
		}
			
		playerServices.getRequestsConfig = function () {
			var commands = function() {};
			
			commands.shouldIncludeCredentials = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::shouldIncludeCredentials()();
			};
			
			commands.getSigningPrefix = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getSigningPrefix()();
			};
			
			commands.signURL = function(url) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::signURL(Ljava/lang/String;)(url);
			};

			commands.isURLMatchesWhitelist = function(url) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::isURLMatchesWhitelist(Ljava/lang/String;)(url);
			};
			
			return commands;
		};
		
		return playerServices;
	}-*/;

	private JavaScriptObject getContextMetadata() {
		return this.playerServices.getContextMetadata();
	}

	private void sendResizeEvent() {
		this.playerServices.sendResizeEvent();
	}

	private boolean changeSemiResponsiveLayout(String layoutIDOrName) {
		return this.playerServices.changeSemiResponsiveLayout(layoutIDOrName);
	}
	
	private void changeFooterVisibility(boolean isVisible) {
		this.playerServices.getCommands().changeFooterVisibility(isVisible);
	}

	private void changeHeaderVisibility(boolean isVisible) {
		this.playerServices.getCommands().changeHeaderVisibility(isVisible);
	}
	
	
	private String getPageStamp() {
		return this.playerServices.getCommands().getPageStamp();
	}
	
	private String getPageTitle() {
		return this.playerServices.getModel().getPage(getCurrentPageIndex()).getName();
	}

	private void showPopup(String pageName, String top, String left, String additinalClasses){
		playerServices.getCommands().showPopup(pageName, top, left, additinalClasses);
	}
	
	private void closePopup(){
		playerServices.getCommands().closePopup();
	}
	
	private void outstretchHeight(int y, int height, Boolean dontMoveModules, String layoutName) {
		this.playerServices.outstretchHeight(y, height, dontMoveModules.booleanValue(), layoutName);
	}
	
	private String getContentType(String href){
		return playerServices.getAssetsService().getContentType(href);
	}

    private JavaScriptObject getPageByIndex(int index) {
		IPage page = playerServices.getModel().getPage(index);
		if (page == null) {
			return null;
		} else {
			return page.toJavaScript();
		}
    }

	private JavaScriptObject getPageById(String id) {
		IPage page = playerServices.getModel().getPageById(id);
		if (page == null) {
			return null;
		} else {
			return page.toJavaScript();
		}
	}

	private int getCurrentPageIndex(){
		return playerServices.getCurrentPageIndex();
	}

	private int getPageCount(){
		return playerServices.getModel().getPageCount();
	}

	private void gotoPage(String pageName){
		playerServices.getCommands().gotoPage(pageName);
	}

	private void gotoPageIndex(int index){
		playerServices.getCommands().gotoPageIndex(index);
	}

	private void gotoPageId(String pageId){
		playerServices.getCommands().gotoPageId(pageId);
	}

    private void gotoCommonPage(String pageName) {
        playerServices.getCommands().gotoCommonPage(pageName);
    }

	private void gotoCommonPageId(String id) {
		playerServices.getCommands().gotoCommonPageId(id);
	}

	private void executeEventCode(String code){
		playerServices.getCommands().executeEventCode(code);
	}

	private void addEventListener(String eventName, JavaScriptObject listener, boolean isDelayed) {
		this.playerServices.addEventListener(eventName, listener, isDelayed);
	}

	private String parseText(String text){
		TextParser parser = new TextParser();
		parser.skipGaps();
		parser.setBaseURL(playerServices.getModel().getBaseUrl());
		ParserResult result = parser.parse(text);
		return result.parsedText;
	}

	private JavaScriptObject parseGaps(String text, JavaScriptObject options) {
		TextParser parser = new TextParser();
		Boolean isCaseSensitive = Boolean.valueOf(JavaScriptUtils.getArrayItemByKey(options, "isCaseSensitive"));
		parser.setCaseSensitiveGaps(isCaseSensitive);
		Boolean isKeepOriginalOrder = Boolean.valueOf(JavaScriptUtils.getArrayItemByKey(options, "isKeepOriginalOrder"));
		parser.setKeepOriginalOrder(isKeepOriginalOrder);
		Boolean useDraggableGaps = Boolean.valueOf(JavaScriptUtils.getArrayItemByKey(options, "useDraggableGaps"));
		parser.setUseDraggableGaps(useDraggableGaps);
		ParserResult result = parser.parse(text);

		JavaScriptObject inlineGaps = inLineChoiceToJs(result.choiceInfos);
		JavaScriptObject gaps = gapsToJs(result.gapInfos);

		JavaScriptObject model = JavaScriptObject.createArray();
		JavaScriptUtils.addObjectAsPropertyToJSArray(model, "inLineGaps", inlineGaps);
		JavaScriptUtils.addObjectAsPropertyToJSArray(model, "gaps", gaps);
		JavaScriptUtils.addPropertyToJSArray(model, "parsedText", result.parsedText);

		return model;
	}

	private String parseAltTexts(String text) {
		TextParser parser = new TextParser();
		return parser.parseAltText(text);
	}
	
	private JavaScriptObject getHeaderModule(String id){
		IPresenter presenter = playerServices.getHeaderModule(id);
		return getModulePresentationJSObject(presenter);
	}

	private JavaScriptObject getFooterModule(String id){
		IPresenter presenter = playerServices.getFooterModule(id);
		return getModulePresentationJSObject(presenter);
	}

	private JavaScriptObject getModule(String id) {
		IPresenter presenter = playerServices.getModule(id);
		return getModulePresentationJSObject(presenter);
	}
	
	private JavaScriptObject getGroup(String id) {
		GroupPresenter group = playerServices.getGroup(id); 
		if(group!=null) {
			return group.getAsJavaScript(); 
		}
		return null; 
	}

	private JavaScriptObject getModulePresentationJSObject(IPresenter presenter) {
		if (presenter instanceof AddonPresenter) {
			return ((AddonPresenter) presenter).getAsJavaScript();
		} else if (presenter instanceof TextPresenter) {
			return ((TextPresenter) presenter).getAsJavaScript();
		} else if (presenter instanceof ImagePresenter) {
			return ((ImagePresenter) presenter).getAsJavaScript();
		} else if (presenter instanceof ImageGapPresenter) {
			return ((ImageGapPresenter) presenter).getAsJavaScript();
		} else if (presenter instanceof ImageSourcePresenter) {
			return ((ImageSourcePresenter) presenter).getAsJavaScript();
		} else if (presenter instanceof ChoicePresenter) {
			return ((ChoicePresenter) presenter).getAsJavaScript();
		} else if (presenter instanceof OrderingPresenter) {
			return ((OrderingPresenter) presenter).getAsJavaScript();
		} else if (presenter instanceof ButtonPresenter) {
			return ((ButtonPresenter) presenter).getAsJavaScript();
		} else if (presenter instanceof SourceListPresenter) {
			return ((SourceListPresenter) presenter).getAsJavaScript();
		} else if (presenter instanceof PageProgressPresenter) {
			return ((PageProgressPresenter) presenter).getAsJavaScript();
		} else if (presenter instanceof CheckButtonPresenter) {
			return ((CheckButtonPresenter) presenter).getAsJavaScript();
		} else if (presenter instanceof LimitedCheckPresenter) {
			return ((LimitedCheckPresenter) presenter).getAsJavaScript();
		} else if (presenter instanceof LimitedResetPresenter) {
			return ((LimitedResetPresenter) presenter).getAsJavaScript();
		} else if (presenter instanceof ErrorCounterPresenter) {
			return ((ErrorCounterPresenter) presenter).getAsJavaScript();
		} else if (presenter instanceof ShapePresenter) {
			return ((ShapePresenter) presenter).getAsJavaScript();
		} else if (presenter instanceof LessonResetPresenter) {
			return ((LessonResetPresenter) presenter).getAsJavaScript();
		}else if (presenter instanceof GroupPresenter) {
			return ((GroupPresenter) presenter).getAsJavaScript();
		}

		return null;
	}

	private String getTotalTime() {
		return Long.toString(playerServices.getTimeService().getTotalTime());
	}

	private String getPageTimeById(String pageId) {
		return Long.toString(playerServices.getTimeService().getPageTimeById(pageId));
	}

	private int getMaxScore(){
		return playerServices.getScoreService().getTotalMaxScore();
	}

	private int getTotalScore(){
		return playerServices.getScoreService().getTotalScore();
	}

	private JavaScriptObject getPageScore(String pageName){
		PageScore score = playerServices.getScoreService().getPageScoreByName(pageName);
		JavaScriptObject model = scoreToJs(score);

		return model;
	}

	private JavaScriptObject getPageScoreById(String id){
		PageScore score = playerServices.getScoreService().getPageScoreById(id);
		Long time = playerServices.getTimeService().getPageTimeById(id);

		JavaScriptObject model = scoreToJs(score, time);

		return model;
	}

	private JavaScriptObject getPageScoreWithoutOpenActivitiesById(String id){
		PageScore score = playerServices.getScoreService().getPageScoreWithoutOpenActivitiesById(id);
		Long time = playerServices.getTimeService().getPageTimeById(id);

		JavaScriptObject model = scoreToJs(score, time);

		return model;
	}

	private JavaScriptObject getOpenActivityScores(String pageID, String moduleID){
		ScoreInfo scoreInfo = playerServices.getScoreService().getOpenActivityScores(pageID, moduleID);
		return scoreInfo.getAsJSObject();
	}

	private void updateOpenActivityScore(String pageID, String moduleID, String aiGrade, String aiRelevance) {
		playerServices.getScoreService().updateOpenActivityScore(pageID, moduleID, aiGrade, aiRelevance);
	}

	private static JavaScriptObject scoreToJs(PageScore score, Long time) {
		JavaScriptObject model = scoreToJs(score);
		JavaScriptUtils.addPropertyToJSArray(model, "time", Long.toString(time));
		return model;
	}

	private static JavaScriptObject scoreToJs(PageScore score) {
		JavaScriptObject model = JavaScriptObject.createArray();
		JavaScriptUtils.addPropertyToJSArray(model, "score", (int) score.getScore());
		JavaScriptUtils.addPropertyToJSArray(model, "maxScore", (int) score.getMaxScore());
		JavaScriptUtils.addPropertyToJSArray(model, "checkCount", score.getCheckCount());
		JavaScriptUtils.addPropertyToJSArray(model, "errorCount", score.getErrorCount());
		JavaScriptUtils.addPropertyToJSArray(model, "mistakeCount", score.getMistakeCount());
		JavaScriptUtils.addPropertyToJSArray(model, "weight", score.getWeight());
		JavaScriptUtils.addPropertyToJSArray(model, "scaledScore", score.getScaledScore());
		return model;
	}

	private static JavaScriptObject inLineChoiceToJs(List<InlineChoiceInfo> choiceInfos) {
		JavaScriptObject model = JavaScriptObject.createArray();

		for (int i = 0; i < choiceInfos.size(); i++) {
			JavaScriptObject gap = JavaScriptObject.createArray();
			JavaScriptUtils.addPropertyToJSArray(gap, "id", choiceInfos.get(i).getId());
			JavaScriptUtils.addPropertyToJSArray(gap, "answer", choiceInfos.get(i).getAnswer());
			JavaScriptUtils.addPropertyToJSArray(gap, "value", choiceInfos.get(i).getValue());

			JavaScriptObject distractors = JavaScriptObject.createArray();
			Iterator<String> gapDistractors = choiceInfos.get(i).getDistractors();

			while (gapDistractors.hasNext()) {
				String dist = gapDistractors.next();
				JavaScriptUtils.addElementToJSArray(distractors, dist);
			}

			JavaScriptUtils.addObjectAsPropertyToJSArray(gap, "distractors", distractors);
			JavaScriptUtils.addObjectToJSArray(model, gap);
		}
		return model;
	}

	private static JavaScriptObject gapsToJs(List<GapInfo> gapInfos) {
		JavaScriptObject model = JavaScriptObject.createArray();

		for (int i = 0; i < gapInfos.size(); i++) {
			JavaScriptObject gap = JavaScriptObject.createArray();
			JavaScriptUtils.addPropertyToJSArray(gap, "id", gapInfos.get(i).getId());
			JavaScriptUtils.addPropertyToJSArray(gap, "value", gapInfos.get(i).getValue());

			JavaScriptObject answersArray = JavaScriptObject.createArray();
			Iterator<String> answers = gapInfos.get(i).getAnswers();

			while (answers.hasNext()) {
				String dist = answers.next();
				JavaScriptUtils.addElementToJSArray(answersArray, dist);
			}

			JavaScriptUtils.addObjectAsPropertyToJSArray(gap, "answers", answersArray);
			JavaScriptUtils.addObjectToJSArray(model, gap);
		}
		return model;
	}

	private String getStaticFilesPath(){
		return GWT.getModuleBaseForStaticFiles();
	}

	private int getTimeElapsed(){
		return (int)playerServices.getCommands().getTimeElapsed();
	}

	private void incrementCheckCounter() {
		playerServices.getCommands().incrementCheckCounter();
	}

	private void increaseMistakeCounter() {
		playerServices.getCommands().increaseMistakeCounter();
	}

	private void checkAnswers(boolean updateCounter) {
		playerServices.getCommands().checkAnswers(updateCounter);
	}

	private void uncheckAnswers() {
		playerServices.getCommands().uncheckAnswers();
	}

	private void showAnswers(String source) {
		playerServices.getCommands().showAnswers(source);
	}

	private void hideAnswers(String source) {
		playerServices.getCommands().hideAnswers(source);
	}

	private void sendPageAllOkOnValueChanged(boolean sendEvent) {
		playerServices.getCommands().sendPageAllOkOnValueChanged(sendEvent);
	}

	private void setNavigationPanelsAutomaticAppearance(boolean shouldAppear) {
		playerServices.getCommands().setNavigationPanelsAutomaticAppearance(shouldAppear);
	}

	private void showNavigationPanels() {
		playerServices.getCommands().showNavigationPanels();
	}

	private void hideNavigationPanels() {
		playerServices.getCommands().hideNavigationPanels();
	}
	
	private int getIframeScroll() {
		return playerServices.getCommands().getIframeScroll();
	}

	private void sendEvent(String eventName, JavaScriptObject eventData){
		this.playerServices.sendEvent(eventName, eventData);
	}

	private boolean isBookMode() {
		return playerServices.isBookMode();
	}

	private boolean hasCover() {
		return playerServices.hasCover();
	}

	private JavaScriptObject getTableOfContents() {
		IChapter toc = playerServices.getModel().getTableOfContents();
		return toc.toJavaScript();
	}
	
	private void enableKeyboardNavigation() {
		playerServices.getCommands().enableKeyboardNavigation();
	}

	private boolean showNextAnswer(String worksWith) {
		return playerServices.getGradualShowAnswersService().showNext(worksWith);
	}

	private void hideGradualAnswers() {
		playerServices.getGradualShowAnswersService().hideAll();
	}

	private void disableKeyboardNavigation() {
		playerServices.getCommands().disableKeyboardNavigation();
	}
	
	public ScaleInformation getScaleInformation() {
		return this.playerServices.getScaleInformation();
	}
	
	public void setScaleInformation(String baseScaleX, String baseScaleY, String baseTransform, String baseTransformOrigin) {
		this.playerServices.setScaleInformation(baseScaleX, baseScaleY, baseTransform, baseTransformOrigin);
		PlayerApp.prepareStaticScaledElements();
	}
	
	public void setFinalScaleInformation(String scaleX, String scaleY, String transform, String transformOrigin) {
		this.playerServices.setFinalScaleInformation(scaleX, scaleY, transform, transformOrigin);
		PlayerApp.prepareStaticScaledElements();
	}
	
	public boolean isPlayerInCrossDomain() {
		return this.playerServices.isPlayerInCrossDomain();
	}
	
	public boolean isWCAGOn() {
		return this.playerServices.isWCAGOn();
	}

	public String getResponsiveVoiceLang() {
		return this.playerServices.getResponsiveVoiceLang();
	}

	public void setAbleChangeLayout(boolean isAbleChangeLayout) {
		this.playerServices.setAbleChangeLayout(isAbleChangeLayout);
	}
	
	// Move to the next/previous module in keyboard navigation
	public void moveActiveModule(boolean reverseDirection){
		NativeEvent event = Document.get().createKeyDownEvent(false, false, reverseDirection, false, 9);
		// Send a Tab or Tab+Shift keydown event to the keyboard controller
		DomEvent.fireNativeEvent(event,  RootPanel.get());
	}

	public void sendExternalEvent(String eventType, String data) {
		this.playerServices.sendExternalEvent(eventType, data);
	}

	public String getContentMetadataValue(String key) {
		return playerServices.getContentMetadata(key);
	}

	public JavaScriptObject getPagesMapping() {
		return JavaScriptUtils.convertMappingToJSArray(playerServices.getModel().getPagesMapping());
	}

	public JavaScriptObject getModuleMetadata(String moduleID) {
		return this.playerServices.getModule(moduleID).getModel().getMetadata().toJavaScript();
	}

	public String escapeXMLEntities(String text) {
		return StringUtils.escapeXML(text);
	}

    private void reset(boolean resetOnlyWrong) {
        this.playerServices.getCommands().reset(resetOnlyWrong);
    }

	private void resetPage(int index) {
		this.playerServices.getCommands().resetPage(index);
	}

	private void resetPageById(String id) {
		this.playerServices.getCommands().resetPageById(id);
	}

	public JsArray<AdaptiveConnection> getAdaptiveConnectionCurrentPage() {
		return this.playerServices.getAdaptiveLearningService().getConnectionsForPage();
	}

	public JsArray<AdaptiveConnection> getAdaptiveConnectionForPage(String pageID) {
		return this.playerServices.getAdaptiveLearningService().getConnectionsForPage(pageID);
	}

	public void moveToNextAdaptivePage() {
		this.playerServices.getAdaptiveLearningService().moveToNextPage();
	}

	public void moveToPrevAdaptivePage() {
		this.playerServices.getAdaptiveLearningService().moveToPrevPage();
	}

	public void resetHistory() {
		this.playerServices.getAdaptiveLearningService().resetHistory();
	}

	public boolean isNextAdaptivePageAvaialable() {
		return this.playerServices.getAdaptiveLearningService().isNextPageAvailable();
	}

	public void addAndMoveToNextPage(String pageId) {
		this.playerServices.getAdaptiveLearningService().addAndMoveToNextPage(pageId);
	}

	public String getPageDifficulty(String pageId) {
		return this.playerServices.getAdaptiveLearningService().getPageDifficulty(pageId);
	}

	public boolean isLastStep() {
		return this.playerServices.getAdaptiveLearningService().isLastStep();
	}

	public boolean isFirstStep() {
		return this.playerServices.getAdaptiveLearningService().isFirstStep();
	}

	private void setExternalVariable(String key, String value) {
		this.playerServices.setExternalVariable(key, value);
	}

	private String getExternalVariable(String key) {
		return this.playerServices.getExternalVariable(key);
	}

	public ObserverJSService getJSObserverService() {
		return playerServices.getObserverService().getAsJS();
	}

	private JavaScriptObject getOpenEndedContentForCurrentPage() { return this.playerServices.getOpenEndedContentForCurrentPage(); }

	private void clearVisitedPages() {
	    this.playerServices.clearVisitedPages();
	    playerServices.getEventBusService().getEventBus().fireEvent(new ResetPageEvent(false));
	}

	private void setAllPagesAsVisited() {
		this.playerServices.getCommands().setAllPagesAsVisited();
		playerServices.getEventBusService().sendEvent("visitedPagesUpdate", JavaScriptObject.createObject());
	}

	private JavaScriptObject getResponsiveLayouts() {
		return playerServices.getApplication().getSemiResponsiveLayouts();
	}

	private String parseAnswer(String rawAnswer) {
		return TextParser.parseAnswer(rawAnswer);
	}

	private boolean shouldIncludeCredentials() {
		return ExtendedRequestBuilder.shouldIncludeCredentials();
	}

	private String getSigningPrefix() {
		return ExtendedRequestBuilder.getSigningPrefix();
	}

	private String signURL(String url) {
		return ExtendedRequestBuilder.signURL(url);
	}

	private boolean isURLMatchesWhitelist(String url) {
		return ExtendedRequestBuilder.isURLMatchesWhitelist(url);
	}

	private JavaScriptObject getRenderedModuleOrderForPrint() {
		IPage page = this.playerServices.getModel().getPage(this.getCurrentPageIndex());
		return getRenderedModuleOrderForPrint(page, false, false);
	}

	private JavaScriptObject getRenderedDefaultHeaderModuleOrderForPrint() {
		Page page = (Page) this.playerServices.getModel().getPage(this.getCurrentPageIndex());
		Content content = (Content) this.playerServices.getModel();
		Page header = content.getHeader(page);
		Page defHeader = content.getDefaultHeader();
		if (header == null || defHeader == null || header.getId() != defHeader.getId()) return null;
		return getRenderedModuleOrderForPrint(header, true, false);
	}

	private JavaScriptObject getRenderedDefaultFooterModuleOrderForPrint() {
		Page page = (Page) this.playerServices.getModel().getPage(this.getCurrentPageIndex());
		Content content = (Content) this.playerServices.getModel();
		Page footer = content.getFooter(page);
		Page defFooter = content.getDefaultFooter();
		if (footer == null || defFooter == null || footer.getId() != defFooter.getId()) return null;
		return getRenderedModuleOrderForPrint(footer, false, true);
	}

	private JavaScriptObject getRenderedModuleOrderForPrint(IPage page, boolean isHeader, boolean isFooter) {
		List<String> modules = page.getModulesList();
		JavaScriptObject jsModules = JavaScriptUtils.createEmptyJsArray();
		for (String id: modules) {
			IPresenter presenter = null;
			if (isHeader) {
				presenter = this.playerServices.getHeaderModule(id);
			} else if (isFooter) {
				presenter = this.playerServices.getFooterModule(id);
			} else {
				presenter = this.playerServices.getModule(id);
			}
			if (presenter != null) {
				IModuleModel model = presenter.getModel();
				if (model instanceof IPrintableModuleModel
						&& ((IPrintableModuleModel) model).getPrintableMode() != Printable.PrintableMode.NO) {
					JavaScriptUtils.addElementToJSArray(jsModules, id);
				}
			}
		}
		return getRenderedModuleOrderForPrint(jsModules, page.getId());
	}

	private native JavaScriptObject getRenderedModuleOrderForPrint(JavaScriptObject moduleIDs, String pageID) /*-{
		var modules = [];
		for (var i = 0; i < moduleIDs.length; i++) {
			var $view = $wnd.$("#"+pageID+" [id='"+moduleIDs[i]+"']");
			if ($view.length > 0) {
				var rect = $view[0].getBoundingClientRect();
				modules.push({id: moduleIDs[i], x: rect.x, y: rect.y});
			}
		}
		modules.sort(function(a,b){
			if (a.y < b.y) return -1;
			if (a.y > b.y) return 1;
			if (a.x < b.x) return -1;
			if (a.x > b.x) return 1;
			return 0;
		});
		var result = [];
		for (var i = 0; i < modules.length; i++) result.push(modules[i].id);
		return result;
	}-*/;
}
