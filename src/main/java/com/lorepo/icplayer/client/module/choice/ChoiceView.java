package com.lorepo.icplayer.client.module.choice;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.user.client.ui.AbsolutePanel;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icf.utils.RandomUtils;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.choice.ChoicePresenter.IOptionDisplay;
import com.lorepo.icplayer.client.utils.MathJax;

public class ChoiceView extends AbsolutePanel implements ChoicePresenter.IDisplay, ValueChangeHandler<Boolean>{

	private ChoiceModel module;
	private VerticalPanel optionsPanel;
	private HorizontalPanel optionsPanelHorizontal;
	private ArrayList<IOptionDisplay> optionWidgets = new ArrayList<IOptionDisplay>();
	private ArrayList<IOptionDisplay> orderedWidgets = new ArrayList<IOptionDisplay>();
	private IOptionListener listener;
	private int[] order;
	
	
	public ChoiceView(ChoiceModel module, boolean isPreview){
	
		this.module = module;
		createUI(isPreview);
	}

	
	/**
	 * To zamieszanie z tworzeniem VerticalPanel jest potrzebne ponieważ bez tego 
	 * GWT głupieje.
	 * @param isPreview 
	 */
	private void createUI(boolean isPreview){
		
		optionsPanel = new VerticalPanel();
		optionsPanelHorizontal = new HorizontalPanel();

		if(module.isHorizontalLayout()){
			optionsPanelHorizontal.setStyleName("ic_choice");
		}else{
			optionsPanel.setStyleName("ic_choice");
		}
		
		makeOrder(isPreview);
		
		for(int i = 0; i < order.length; i++) {
			ChoiceOption option;
			option = module.getOption(order[i]);
			OptionView widget;
			widget = new OptionView(option, module.isMulti());
			widget.addValueChangeHandler(this);
			optionWidgets.add(widget);
			if(module.isHorizontalLayout()){
				optionsPanelHorizontal.add((Widget)widget);
			}else{
				optionsPanel.add((Widget)widget);
			}
		}

		getOrderedOptions();
		if(module.isHorizontalLayout()){
			optionsPanelHorizontal.setSize("100%", "100%");
			add(optionsPanelHorizontal);
			setWidgetPosition(optionsPanelHorizontal, 0, 0);
		}else{
			optionsPanel.setSize("100%", "100%");
			add(optionsPanel);
			setWidgetPosition(optionsPanel, 0, 0);
		}
		
		StyleUtils.applyInlineStyle(this, module);
		if(!isPreview){
			setVisible(module.isVisible());
		}
		getElement().setId(module.getId());
		if(module.isDisabled()){
			setEnabled(false);
		}
	}
	    
	private void makeOrder(boolean isPreview) {
		if (!isPreview && module.isRandomOrder()) {
			List<Integer> tmp_order = RandomUtils.singlePermutation(module.getOptionCount());
			order = new int[module.getOptionCount()];
			for(int i = 0; i < module.getOptionCount(); i ++) {
				order[i]=tmp_order.get(i);
			}
		} else {
			order = new int[module.getOptionCount()];
			for(int i = 0; i < module.getOptionCount(); i ++) {
				order[i]=i;
			}
		}
	}

	public void getOrderedOptions() {
		for (int i = 0; i < order.length; i++) {
			for (int j = 0; j < order.length; j++) {
				if (order[j] == i) {
					orderedWidgets.add(optionWidgets.get(j));
				}
			}
		}
	}
	
	@Override
	public List<IOptionDisplay> getOptions() {
		return orderedWidgets;
	}

	@Override
	public void addListener(IOptionListener listener) {
		this.listener = listener;
	}

	@Override
	public void onValueChange(ValueChangeEvent<Boolean> event) {

		if(listener != null){
			listener.onValueChange((IOptionDisplay) event.getSource(), event.getValue());
		}
		
	}

	@Override
	public void setEnabled(boolean b) {

		for(IOptionDisplay optionView : optionWidgets){
			OptionView widget = (OptionView) optionView;
			widget.setEnabled(b);
		}
	}

	@Override
	public void hide() {
		setVisible(false);
	}

	@Override
	public void show() {
		setVisible(true);
		refreshMath();
	}
	
	@Override
	public void setVisibleVal(boolean val) {
		setVisible(val);
	}

	public void refreshMath() {
		MathJax.refreshMathJax(getElement());
	}

	public int[] getOryginalOrder() {
		int[] array = new int[order.length];
		for (int i=0; i<order.length; i++) {
			array[order[i]]=i;
		}
		return array;
	}
}
