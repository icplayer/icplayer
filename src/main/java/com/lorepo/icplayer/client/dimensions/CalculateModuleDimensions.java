package com.lorepo.icplayer.client.dimensions;

import java.util.HashMap;

import com.google.gwt.user.client.ui.Widget;
import com.lorepo.icplayer.client.module.api.ILayoutDefinition;
import com.lorepo.icplayer.client.module.api.IModuleModel;
import com.lorepo.icplayer.client.module.api.ILayoutDefinition.Property;

public class CalculateModuleDimensions {

	private IModuleModel module;
	private int left;
	private int height;
	private int bottom;
	private int top;
	private int width;
	private int right;
	private PageDimensionsForCalculations pageDimensions;

	public CalculateModuleDimensions() {}
	
	public CalculateModuleDimensions setPageDimensions(PageDimensionsForCalculations pageDimensions) {
		this.pageDimensions = pageDimensions;
		return this;
	}
	
	public CalculateModuleDimensions setModule(IModuleModel module) {
		this.module = module;
		return this;
	}
	
	public ModuleDimensions compute(HashMap<String, Widget> widgets) {
		ILayoutDefinition layout = this.module.getLayout();
		if(layout.hasLeft()){
			this.left = this.calculateLeftPosition(layout, widgets);
			
			if(layout.hasRight()){
				this.right = this.calculateRightPosition(layout, widgets);
				this.width = this.right - this.left;
			}
			else{
				this.width = module.getWidth();
			}
		}
		else{
			this.right = this.calculateRightPosition(layout, widgets);
			this.width = module.getWidth();
			this.left = this.right - this.width;
		}
		
		if(layout.hasTop()){
			this.top = this.calculateTopPosition(layout, widgets);
			if(layout.hasBottom()){
				this.bottom = this.calculateBottomPosition(layout, widgets);
				this.height = this.bottom-this.top;
			}
			else{
				this.height = module.getHeight();
			}
		}
		else{
			this.bottom = this.calculateBottomPosition(layout, widgets);
			this.height = module.getHeight();
			this.top = this.bottom - this.height;
		}
		
		return new ModuleDimensions(this.left, this.right, this.top, this.bottom, this.height, this.width);
	}

	private int calculateBottomPosition(ILayoutDefinition layout, HashMap<String, Widget> widgets) {
		Widget widget = widgets.get(layout.getBottomRelativeTo());
		return this.calculatePosition(widget,  layout.getBottomRelativeToProperty(), -this.module.getBottom());
	}

	private int calculateTopPosition(ILayoutDefinition layout, HashMap<String, Widget> widgets) {
		Widget widget = widgets.get(layout.getTopRelativeTo());
		return this.calculatePosition(widget, layout.getTopRelativeToProperty(), this.module.getTop());
	}

	private int calculateLeftPosition(ILayoutDefinition layout, HashMap<String, Widget> widgets) {
		Widget widget = widgets.get(layout.getLeftRelativeTo());
		return this.calculatePosition(widget, layout.getLeftRelativeToProperty(), this.module.getLeft());
	}

	private int calculateRightPosition(ILayoutDefinition layout, HashMap<String, Widget> widgets) {
		Widget widget = widgets.get(layout.getRightRelativeTo());
		return this.calculatePosition(widget, layout.getRightRelativeToProperty(), -this.module.getRight());
	}
	
	private int calculatePosition(Widget widget, Property property, int modulePos) {
		int pos = 0;
		
		if(property == Property.left){
			if(widget != null){
				pos = widget.getElement().getOffsetLeft() + modulePos;
			}
			else{
				pos = modulePos;
			}
		}
		else if(property == Property.right){
			if(widget != null){
			    pos = widget.getElement().getOffsetLeft() + widget.getOffsetWidth() + modulePos;
			}
			else{
				pos = this.pageDimensions.width + modulePos;
			}
		}
		else if(property == Property.top){
			if(widget != null){
				pos = widget.getElement().getOffsetTop() + modulePos;
			}
			else{
				pos = modulePos;
			}
		}
		else if(property == Property.bottom){
			if(widget != null){
				pos = widget.getElement().getOffsetTop() + widget.getOffsetHeight() + modulePos;
			}
			else{
				pos = this.pageDimensions.height + modulePos;
			}
		}
		
		return pos;
	}
	
}
