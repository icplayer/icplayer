package com.lorepo.icplayer.client.module.choice;

import java.util.Iterator;
import java.util.List;
import java.util.ArrayList;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.TouchCancelEvent;
import com.google.gwt.event.dom.client.TouchCancelHandler;
import com.google.gwt.event.dom.client.TouchEndEvent;
import com.google.gwt.event.dom.client.TouchEndHandler;
import com.google.gwt.event.dom.client.TouchMoveEvent;
import com.google.gwt.event.dom.client.TouchMoveHandler;
import com.google.gwt.event.dom.client.TouchStartEvent;
import com.google.gwt.event.dom.client.TouchStartHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.ui.ToggleButton;
import com.lorepo.icplayer.client.module.api.event.DefinitionEvent;
import com.lorepo.icplayer.client.module.choice.ChoicePresenter.IOptionDisplay;
import com.lorepo.icplayer.client.module.text.LinkInfo;
import com.lorepo.icplayer.client.module.text.LinkWidget;
import com.lorepo.icplayer.client.module.text.TextParser;
import com.lorepo.icplayer.client.module.text.TextParser.ParserResult;
import com.lorepo.icplayer.client.utils.DevicesUtils;
import com.lorepo.icplayer.client.module.text.AudioInfo;
import com.google.gwt.dom.client.EventTarget;

public class OptionView extends ToggleButton implements IOptionDisplay{

    public List<AudioInfo> audioInfos = new ArrayList<AudioInfo>();

	private ChoiceOption choiceOption;
	private ParserResult parserResult;
	private EventBus eventBus;
	
	private boolean isTouched = false;
	
	public OptionView(ChoiceOption option, boolean isMulti){
		super();
		this.choiceOption = option;
		initUI(isMulti);
		setListener(this.getElement());
	}

	
	private void initUI(boolean isMulti) {
		
		TextParser parser = new TextParser();
		parser.setBaseURL(choiceOption.getBaseURL());
		parser.setContentBaseURL(choiceOption.getContentBaseURL());
		parserResult = parser.parse(choiceOption.getText());
		audioInfos = parserResult.audioInfos;
		this.setHTML(parserResult.parsedText);

		if(isMulti){
			setStylePrimaryName("ic_moption");
		}
		else{
			setStylePrimaryName("ic_soption");
		}

		setElementId();
	}
	
	public boolean isEnable() {
		return super.isEnabled(); 
	}
	
	private native void setListener(Element el)/*-{
		var $el = $wnd.$(el);
		var self = this;
		$el.on('touchend',function(e){ //onBrowserEvent is not used to avoid visible delay
			var isFromInsertedAudio = $wnd.$(e.target).is("input");
			if (isFromInsertedAudio) return;
			
			var isFromAddedAudio = $wnd.$(e.target).parents().hasClass("inner_addon");
			if (isFromAddedAudio) return;
			
			e.preventDefault();
			var isEnabled = self.@com.lorepo.icplayer.client.module.choice.OptionView::isEnable()();
			if(isEnabled){
				self.@com.lorepo.icplayer.client.module.choice.OptionView::onClick()();
			}
		});
	}-*/;
	
	@Override
	public void onBrowserEvent(Event event) {
	    if( DOM.eventGetType(event) == Event.ONCLICK){
	    	event.stopPropagation();
	    }
	    if( DOM.eventGetType(event) != Event.ONTOUCHEND) { //Touchend is handled in setListener
            if (isEventTargetAudioButton(event)) { //if click event comes from audio then option should not be checked
                return;
            }
	    	super.onBrowserEvent(event);
	    }
	}

	private boolean isEventTargetAudioButton (Event event) {
	    EventTarget target = event.getEventTarget();
	    if(!com.google.gwt.dom.client.Element.is(target)) {
	        return false;
	    }

	    com.google.gwt.dom.client.Element elem = com.google.gwt.dom.client.Element.as(target);
	    String classNames = elem.getClassName();
	    if (classNames.contains("ic_text_audio_button")) {
	        return true;
	    }

	    return false;
	}
	
	protected void onAttach() {
		
		super.onAttach();
		connectLinks(parserResult.linkInfos.iterator());
	}

	
	/**
	 * Pobranie opcji powiązanej z tym check boxem
	 * @return
	 */
	public ChoiceOption getOption() {
		
		return choiceOption;
	}

	
	/**
	 * Get score
	 * @return
	 */
	public float getScore() {
		
		int score = 0;
		
		if(isDown()){
			score = choiceOption.getValue();
		}
		
		return score;
	}
	
	
	/**
	 * Ustawienie stanu w zależności czy jest poprawną odpowiedzią value > 0 czy nie
	 */
	public void reset() {
		resetStyles();
		setDown(false);
		setEnabled(true);
	}

	public float getMaxScore() {
		return choiceOption.getValue();
	}

	@Override
	public ChoiceOption getModel() {
		return choiceOption;
	}

	@Override
	public void setWrongStyle() {	
		if (isDown()) {
			addStyleDependentName("down-wrong");
		} else {
			addStyleDependentName("up-wrong");
		}
	}

	@Override
	public void setCorrectStyle() {
		if (isDown()) {
			addStyleDependentName("down-correct");
		} else {
			addStyleDependentName("up-correct");
		}
	}
	
	@Override
	public void setCorrectAnswerStyle() {
		addStyleDependentName("down-correct-answer");
	}
	
	@Override
	public void resetStyles() {
		removeStyleDependentName("up-correct");
		removeStyleDependentName("up-wrong");
		removeStyleDependentName("down-correct");
		removeStyleDependentName("down-correct-answer");
		removeStyleDependentName("down-wrong");
		removeStyleName("ic_soption-markedAsCorrect");
		removeStyleName("ic_soption-markedAsWrong");
	}
	
	public void connectLinks(Iterator<LinkInfo> it) {

		if(eventBus != null) {
			while(it.hasNext()) {
				final LinkInfo info = it.next();
				if(DOM.getElementById(info.getId()) != null) {
					LinkWidget widget = new LinkWidget(info);

					widget.addTouchStartHandler(new TouchStartHandler() {
						public void onTouchStart(TouchStartEvent event) {
							event.stopPropagation();
							event.preventDefault();
							
							isTouched = true;
						}
					});

					widget.addTouchMoveHandler(new TouchMoveHandler() {
						public void onTouchMove(TouchMoveEvent event) {
							event.stopPropagation();
							event.preventDefault();
							
							isTouched = false;
						}
					});

					widget.addTouchCancelHandler(new TouchCancelHandler() {
						public void onTouchCancel(TouchCancelEvent event) {
							event.stopPropagation();
							event.preventDefault();
							
							isTouched = false;
						}
					});

					widget.addTouchEndHandler(new TouchEndHandler() {
						public void onTouchEnd(TouchEndEvent event) {
							event.stopPropagation();
							event.preventDefault();
							
							if (isTouched) {
								DefinitionEvent defEvent = new DefinitionEvent(info.getHref());
								eventBus.fireEvent(defEvent);
							}
						}
					});

					widget.addClickHandler(new ClickHandler() {
						public void onClick(ClickEvent event) {
							event.preventDefault();
							event.stopPropagation();
							DefinitionEvent defEvent = new DefinitionEvent(info.getHref());
							eventBus.fireEvent(defEvent);
						}
					});
				}
			}
		}		
	}


	@Override
	public void setEventBus(EventBus eventBus) {
		this.eventBus = eventBus;
	}


	private void setStyleFromCommandMarkAsCorrect() {
		addStyleName("ic_soption-markedAsCorrect");
	}
	
	private void setStyleFromCommandMarkAsWrong() {
		addStyleName("ic_soption-markedAsWrong");
	}
	
	@Override
	public void markAsCorrect() {
		resetStyles();
		setCorrectStyle();
		setStyleFromCommandMarkAsCorrect();
	}


	@Override
	public void markAsEmpty() {
		resetStyles();
	}


	@Override
	public void markAsWrong() {
		resetStyles();
		setWrongStyle();
		setStyleFromCommandMarkAsWrong();
	}
	
	@Override
	public void removeBorder() {
		removeStyleName("ic_option_border");
	}

	@Override
	public void addBorder() {
		addStyleName("ic_option_border");
	}
	
	@Override
	public void addStyleDependentName(String styleSuffix) {
		if(DevicesUtils.isMobile() ) { // Disable hovering style on mobile devices
			if (styleSuffix.indexOf("up-hovering") > -1) {
				styleSuffix = styleSuffix.replace("up-hovering","up");
				super.removeStyleDependentName("down");
			};
			if (styleSuffix.indexOf("down-hovering") > -1) {
				styleSuffix = styleSuffix.replace("down-hovering","down");
				super.removeStyleDependentName("up");
			};
		}
		super.addStyleDependentName(styleSuffix);
	}

	private void setElementId() {
		// if parent id is not set, then it may be possible that html ids will be duplicated in different modules
		boolean isParentIdSet = !choiceOption.getParentId().equals("");
		if (isParentIdSet) {
			getElement().setId(getViewId());
		}
	}

	private String getViewId() {
		return choiceOption.getParentId() + "_ic_option_" + choiceOption.getID();
	}

	public List<AudioInfo> getAudioInfos() {
		return audioInfos;
	}
}
