package com.lorepo.icplayer.client.xml.page;

import com.lorepo.icplayer.client.model.Group;
import com.lorepo.icplayer.client.model.Page.LayoutType;
import com.lorepo.icplayer.client.model.Page.PageScoreWeight;
import com.lorepo.icplayer.client.model.layout.Size;
import com.lorepo.icplayer.client.module.api.IModuleModel;

import java.util.List;

import com.lorepo.icplayer.client.ui.Ruler;

public interface IPageBuilder {
	public void setWidth(Integer width);
	public void setHeight(Integer height);
	public void setStyleCss(String css);
	public void setStyleClass(String styleClass);
	public void setLayout(LayoutType layoutType);
	public void setScoring(String scoring);
	public void addModule(IModuleModel module);
	public void addGroupModules(Group group);
	public void setRulers(List<Ruler> verticals, List<Ruler> horizontals);
	public void setWeight(Integer weight);
	public void setWeightMode(PageScoreWeight pageScoreWeight);
	public String getBaseURL();
	public void markAsLoaded();
	public void clearGroupModules();
	public void clearModules();
	public void clearRulers();
	public void addSize(String string, Size size);
}
