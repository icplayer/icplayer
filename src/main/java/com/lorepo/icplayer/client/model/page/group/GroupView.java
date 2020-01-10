package com.lorepo.icplayer.client.model.page.group;

import com.google.gwt.user.client.ui.AbsolutePanel;
import com.lorepo.icplayer.client.model.page.group.GroupPresenter.IDisplay;
import com.lorepo.icplayer.client.utils.DOMUtils;


public class GroupView extends AbsolutePanel implements IDisplay{
	
	
	private Group group = null; 
	
	public GroupView(Group group, boolean isPreview) {
		this.group = group; 

		createUI(isPreview);
	}
	
	private void createUI(boolean isPreview) {
		
		
		this.getElement().setClassName("modules_group");
		String styleClass = group.getStyleClass();
		String inlineStyle = group.getInlineStyle();

		if(inlineStyle != null) {
			DOMUtils.applyInlineStyle(this.getElement(), inlineStyle);
		}
        if(styleClass != null && !styleClass.isEmpty()){
            this.addStyleName(styleClass);
        }
        if(!isPreview){
			setVisible(isVisibleGroup());
		}
		this.getElement().setId(this.group.getId());
		this.setPixelSize(group.getWidth()+2, group.getHeight()+2);
	
	}
	
	@Override
	public void show() {
		setVisible(true);
	}

	@Override
	public void hide() {
		setVisible(false);
	}

	@Override
	public String getName() {
		return "Group";
	}
	
	public int getLeft() {
		if(this.group != null) {
			return group.getLeft(); 
		}
		return 0; 
	}
	
	
	public int getTop() {
		if(this.group != null) {
			return group.getTop(); 
		}
		return 0; 
	}
	
	public String getId() {
		return group.getId(); 
	}
	
	public Group getGroup() {
		return group; 
	}
	
	private boolean isVisibleGroup() {
		return this.group.isVisible(); 
	}
	
}
