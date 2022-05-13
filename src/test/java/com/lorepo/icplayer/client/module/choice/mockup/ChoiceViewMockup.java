package com.lorepo.icplayer.client.module.choice.mockup;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.dom.client.Element;
import com.lorepo.icplayer.client.module.choice.ChoiceModel;
import com.lorepo.icplayer.client.module.choice.ChoiceOption;
import com.lorepo.icplayer.client.module.choice.ChoicePresenter.IDisplay;
import com.lorepo.icplayer.client.module.choice.ChoicePresenter.IOptionDisplay;
import com.lorepo.icplayer.client.module.choice.IOptionListener;

public class ChoiceViewMockup implements IDisplay, IOptionMockupListener {

	private ChoiceModel module;
	private ArrayList<IOptionDisplay>	options = new ArrayList<IOptionDisplay>();
	private IOptionListener listener;
	boolean isVisible = true;
	private int[] order;
	
	
	public ChoiceViewMockup(ChoiceModel model){
		this.module = model;
		
		createUI();
	}
	
	
	private void createUI() {

		makeOrder();
		
		for(ChoiceOption option : module.getOptions()){
			OptionViewMockup optionView = new OptionViewMockup(option);
			
			options.add(optionView);
			optionView.addListener(this);
		}
		if(module.isVisible()) show();
		else hide();
	}


	@Override
	public List<IOptionDisplay> getOptions() {
		return options;
	}

	@Override
	public void setEnabled(boolean b) {
		// TODO Auto-generated method stub

	}

	@Override
	public void addListener(IOptionListener listener) {
		this.listener = listener;
	}


	@Override
	public void onOptionChanged(OptionViewMockup option, boolean down) {

		if(listener != null){
			listener.onValueChange(option, down);
		}
	}


	@Override
	public Element getElement() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public void show() {
		isVisible = true;
	}


	@Override
	public void hide() {
		isVisible = false;
	}


	public boolean isVisible() {
		return isVisible;
	}


	private void makeOrder() {
		order = new int[module.getOptionCount()];
		for(int i = 0; i < module.getOptionCount(); i ++) {
			order[i]=i;
		}
	}


	public int[] getOryginalOrder() {
		return order;
	}


	@Override
	public void setVisibleVal(boolean val) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void getOrderedOptions() {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String getName() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public void isShowErrorsMode(boolean isShowErrorsMode) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void connectAudios() {
		// TODO Auto-generated method stub
	}
}
