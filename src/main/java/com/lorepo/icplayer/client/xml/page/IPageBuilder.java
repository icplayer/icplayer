package com.lorepo.icplayer.client.xml.page;

import com.lorepo.icplayer.client.model.layout.Size;
import com.lorepo.icplayer.client.model.page.Page.LayoutType;
import com.lorepo.icplayer.client.model.page.Page.PageScoreWeight;
import com.lorepo.icplayer.client.model.page.group.Group;
import com.lorepo.icplayer.client.module.api.IModuleModel;

import java.util.HashMap;
import java.util.List;

import com.lorepo.icplayer.client.ui.Ruler;

public interface IPageBuilder {
	public void setWidth(int width);
	public void setHeight(int height);
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
	public void setHasHeader(boolean value);
	public void setHasFooter(boolean value);
	public void setHeaderId(String name);
	public void setFooterId(String name);
	public void setDefaultLayoutID(String defaultLayoutID);
	public void setInlineStyles(HashMap<String, String> inlineStyles);
	public void setStylesClasses(HashMap<String, String> stylesClasses);
	public void setRandomizeInPrint(boolean value);
	public void setSplitInPrintBlocked(boolean value);
	public void setNotAssignable(boolean value);
	public String getContentBaseURL();
}
