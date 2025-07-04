package com.lorepo.icplayer.client.module.pageprogress.mockup;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.dom.client.Element;
import com.lorepo.icplayer.client.module.choice.ChoicePresenter.IOptionDisplay;
import com.lorepo.icplayer.client.module.pageprogress.PageProgressModule;
import com.lorepo.icplayer.client.module.pageprogress.PageProgressPresenter.IDisplay;


public class PageProgressViewMockup implements IDisplay {

    public int value = 5;
    public boolean visible = true;
    private ArrayList<IOptionDisplay> options = new ArrayList<IOptionDisplay>();

    public PageProgressViewMockup(PageProgressModule model) {
        this.visible = model.isVisible();
    }

    @Override
    public void setData(int value, int limitedMaxScore) {
        this.value = value;
    }

    @Override
    public void show() {
        this.visible = true;
    }

    @Override
    public void hide() {
        this.visible = false;
    }

	public boolean isVisible(){
		return this.visible;
	}

    @Override
    public List<IOptionDisplay> getOptions() {
        return options;
    }

    @Override
    public Element getElement() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getName() {
        // TODO Auto-generated method stub
        return null;
    }
}
