package com.lorepo.icplayer.client.content.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.dom.client.Document;
import com.google.gwt.dom.client.NativeEvent;
import com.google.gwt.event.dom.client.DomEvent;
import com.google.gwt.user.client.ui.RootPanel;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.PlayerApp;
import com.lorepo.icplayer.client.content.services.dto.ScaleInformation;
import com.lorepo.icplayer.client.model.adaptive.AdaptiveConnection;
import com.lorepo.icplayer.client.module.addon.AddonPresenter;
import com.lorepo.icplayer.client.model.page.group.GroupPresenter;
import com.lorepo.icplayer.client.module.api.IPresenter;
import com.lorepo.icplayer.client.module.api.player.IAdaptiveLearningService;
import com.lorepo.icplayer.client.module.api.player.IChapter;
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

		playerServices.getCurrentPageIndex = function() {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getCurrentPageIndex()();
		};
		
		playerServices.getPageTitle = function() {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getPageTitle()();
		};

		playerServices.getCommands = function() {
			var commands = function() {
			};

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
			
			commands.checkAnswers = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::checkAnswers()();
			};
			
			commands.uncheckAnswers = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::uncheckAnswers()();
			};
			
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
			
			commands.outstretchHeight = function (y, height, dontMoveModules) {
				if (dontMoveModules === undefined) {
					dontMoveModules = false;
				}
				x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::outstretchHeight(IILjava/lang/Boolean;)(y, height, @java.lang.Boolean::valueOf(Z)(dontMoveModules));
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
		
		playerServices.getScaleInformation = function() {
			var scaleInfo = x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getScaleInformation()();
			var jsScaleInfo = {
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
		
		playerServices.isPlayerInCrossDomain = function() {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::isPlayerInCrossDomain()();
		}
		
		playerServices.isWCAGOn = function() {
			return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::isWCAGOn()();
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

		playerServices.getAdaptiveLearningService = function () {
			var adaptive = function() {};

			adaptive.getCurrentPageConnections = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getAdaptiveConnectionCurrentPage()();
			};

			adaptive.getPageConnections = function(pageID) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::getAdaptiveConnectionForPage(Ljava/lang/String;)(pageID);
			};

			adaptive.moveToNextPage = function (pageID) {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::moveToNextPage(Ljava/lang/String;)(pageID);
			}

			adaptive.moveToPrevPage = function () {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::moveToPrevPage()();
			}

			adaptive.resetHistory = function() {
				return x.@com.lorepo.icplayer.client.content.services.JavaScriptPlayerServices::resetHistory()();
			}

			return adaptive;
		}

		return playerServices;
	}-*/;
	
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
	
	private void outstretchHeight(int y, int height, Boolean dontMoveModules) {
		this.playerServices.outstretchHeight(y, height, dontMoveModules.booleanValue());
	}
	
	private String getContentType(String href){
		return playerServices.getAssetsService().getContentType(href);
	}

    private JavaScriptObject getPageByIndex(int index) {
        return playerServices.getModel().getPage(index).toJavaScript();
    }

	private JavaScriptObject getPageById(String id) {
		return playerServices.getModel().getPageById(id).toJavaScript();
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
		ParserResult result = parser.parse(text);
		return result.parsedText;
	}

	private JavaScriptObject parseGaps(String text, JavaScriptObject options) {
		TextParser parser = new TextParser();
		Boolean isCaseSensitive = Boolean.valueOf(JavaScriptUtils.getArrayItemByKey(options, "isCaseSensitive"));
		parser.setCaseSensitiveGaps(isCaseSensitive);
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

	private void checkAnswers() {
		playerServices.getCommands().checkAnswers();
	}

	private void uncheckAnswers() {
		playerServices.getCommands().uncheckAnswers();
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

	private void disableKeyboardNavigation() {
		playerServices.getCommands().disableKeyboardNavigation();
	}
	
	public ScaleInformation getScaleInformation() {
		return this.playerServices.getScaleInformation();
	}
	
	public void setScaleInformation(String scaleX, String scaleY, String transform, String transformOrigin) {
		this.playerServices.setScaleInformation(scaleX, scaleY, transform, transformOrigin);
		PlayerApp.prepareStaticScaledElements();
	}
	
	public boolean isPlayerInCrossDomain() {
		return this.playerServices.isPlayerInCrossDomain();
	}
	
	public boolean isWCAGOn() {
		return this.playerServices.isWCAGOn();
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

	public JsArray<AdaptiveConnection> getAdaptiveConnectionCurrentPage() {
		return this.playerServices.getAdaptiveLearningService().getConnectionsForPage();
	}

	public JsArray<AdaptiveConnection> getAdaptiveConnectionForPage(String pageID) {
		return this.playerServices.getAdaptiveLearningService().getConnectionsForPage(pageID);
	}

	public void moveToNextPage(String pageID) {
		this.playerServices.getAdaptiveLearningService().moveToNextPage(pageID);
	}

	public void moveToPrevPage() {
		this.playerServices.getAdaptiveLearningService().moveToPrevPage();
	}

	public void resetHistory() {
		this.playerServices.getAdaptiveLearningService().resetHistory();
	}
}
