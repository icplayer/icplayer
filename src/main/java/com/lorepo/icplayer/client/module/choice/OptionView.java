package com.lorepo.icplayer.client.module.choice;

import java.util.Iterator;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.ui.ToggleButton;
import com.lorepo.icplayer.client.module.api.event.DefinitionEvent;
import com.lorepo.icplayer.client.module.choice.ChoicePresenter.IOptionDisplay;
import com.lorepo.icplayer.client.module.text.LinkInfo;
import com.lorepo.icplayer.client.module.text.LinkWidget;
import com.lorepo.icplayer.client.module.text.TextParser;
import com.lorepo.icplayer.client.module.text.TextParser.ParserResult;

public class OptionView extends ToggleButton implements IOptionDisplay{

	private ChoiceOption 	choiceOption;
	private ParserResult parserResult;
	private EventBus eventBus;
	
	
	public OptionView(ChoiceOption option, boolean isMulti){
		super();
		this.choiceOption = option;
		initUI(isMulti);
	}

	
	private void initUI(boolean isMulti) {
		
		TextParser parser = new TextParser();
		parserResult = parser.parse(choiceOption.getText());
		this.setHTML(parserResult.parsedText);
		
		if(isMulti){
			setStylePrimaryName("ic_moption");
		}
		else{
			setStylePrimaryName("ic_soption");
		}
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
		
		if(isDown()){
			addStyleDependentName("down-wrong");
		}
		else{
			addStyleDependentName("up-wrong");
		}
	}

	@Override
	public void setCorrectStyle() {
		
		if(isDown()){
			addStyleDependentName("down-correct");
		}
		else{
			addStyleDependentName("up-correct");
		}
	}

	@Override
	public void resetStyles() {
		removeStyleDependentName("up-correct");
		removeStyleDependentName("up-wrong");
		removeStyleDependentName("down-correct");
		removeStyleDependentName("down-wrong");
	}

	
	public void connectLinks(Iterator<LinkInfo> it) {
		
		if(eventBus != null){
			while(it.hasNext()){
				final LinkInfo info = it.next();
				if(DOM.getElementById(info.getId()) != null){
					LinkWidget widget = new LinkWidget(info);
					widget.addClickHandler(new ClickHandler() {
						
						@Override
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
}
