package com.lorepo.icplayer.client.module.choice.mockup;

import java.util.List;
import java.util.ArrayList;

import com.google.gwt.event.shared.EventBus;
import com.lorepo.icplayer.client.module.choice.ChoiceOption;
import com.lorepo.icplayer.client.module.choice.ChoicePresenter.IOptionDisplay;
import com.lorepo.icplayer.client.module.text.AudioInfo;

public class OptionViewMockup implements IOptionDisplay {

	public enum StyleType{
		normal,
		correct,
		wrong,
	}

	private ChoiceOption option;
	private boolean down = false;
	private IOptionMockupListener	listener;
	private StyleType style;
	private List<AudioInfo> audioInfos = new ArrayList<AudioInfo>();

	public OptionViewMockup(ChoiceOption option){
		this.option = option;
		style = StyleType.normal;
	}


	@Override
	public void setDown(boolean down) {
		this.down = down;

		if(listener != null){
			listener.onOptionChanged(this, down);
		}
	}

	public void addListener(IOptionMockupListener l){
		listener = l;
	}

	@Override
	public boolean isDown() {
		return down;
	}

	@Override
	public ChoiceOption getModel() {
		return option;
	}

	@Override
	public void setWrongStyle() {
		style = StyleType.wrong;
	}

	@Override
	public void setCorrectStyle() {
		style = StyleType.correct;
	}

	@Override
	public void resetStyles() {
		style = StyleType.normal;
	}


	public StyleType getStyle(){
		return style;
	}


	@Override
	public void setEventBus(EventBus eventBus) {
		// TODO Auto-generated method stub
	}


	@Override
	public void markAsCorrect() {
		// TODO Auto-generated method stub
	}


	@Override
	public void markAsEmpty() {
		// TODO Auto-generated method stub
	}


	@Override
	public void markAsWrong() {
		// TODO Auto-generated method stub
	}


	@Override
	public void setCorrectAnswerStyle() {
		// TODO Auto-generated method stub
	}


	@Override
	public void addBorder() {
		// TODO Auto-generated method stub

	}


	@Override
	public void removeBorder() {
		// TODO Auto-generated method stub

	}

	@Override
	public List<AudioInfo> getAudioInfos() {
		// TODO Auto-generated method stub
		return audioInfos;
	}
}
