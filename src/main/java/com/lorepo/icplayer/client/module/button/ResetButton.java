package com.lorepo.icplayer.client.module.button;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.MouseOverEvent;
import com.google.gwt.event.dom.client.MouseOverHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HasHorizontalAlignment;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.Window;


class ResetButton extends PushButton implements IWCAG {

	private Element element;
	private com.google.gwt.dom.client.Element parent;
	private String confInfo = "";
	private String confInfoYes = "";
	private String confInfoNo = "";
	private boolean confReset;
	private IPlayerCommands pageService;
	
	public static native void removeHoveringFromButtons() /*-{
	  var reset = $wnd.$('[id^="Reset"]');
	  
	  $wnd.$(reset).each(function () {
	  	var element = $wnd.$(this),
			classNames = element.attr("class");
		classNames = classNames.replace(/-hovering/g, "");
		element.attr("class", classNames);
	  });
	}-*/;
	
	public ResetButton(final IPlayerCommands pageService, final boolean confirmReset, final String confirmInfo, final String confirmYesInfo, final String confirmNoInfo){
		
		setStyleName("ic_button_reset");
		
		this.confReset = confirmReset;
		this.confInfo = confirmInfo;
		this.confInfoYes = confirmYesInfo;
		this.confInfoNo = confirmNoInfo;
		this.pageService = pageService;
		
		addMouseOverHandler(new MouseOverHandler() {
			
			@Override
			public void onMouseOver(MouseOverEvent event) {
				String classNames = getElement().getClassName();
				if(!classNames.contains("hovering")) {
					classNames = classNames.replaceAll("-up", "-up-hovering");
					getElement().setClassName(classNames);
				}
			}
		});
		
		addClickHandler(new ClickHandler() {
			
			@Override
			public void onClick(ClickEvent event) {
				event.stopPropagation();
				event.preventDefault();
				execute();
			}
		});
		
	}
	
	public void execute(){
		if(this.confReset){
			
			if(this.confInfo == "") {
				this.confInfo = "Are you sure that you want to reset the modules?";
			}
			
			if(this.confInfoYes == "") {
				this.confInfoYes = "Yes";
			}
			
			if(this.confInfoNo == "") {
				this.confInfoNo = "No";
			}
			
			final DialogBox dialogBox = new DialogBox();
			dialogBox.setStyleName("ic_confim_box");
	        dialogBox.setHTML("<center>" + confInfo + "</center>");
	        Button yesButton =  new Button(confInfoYes);
	        Button noButton = new Button(confInfoNo);
	        HorizontalPanel dialogHPanel = new HorizontalPanel();
	        dialogHPanel.setStyleName("ic_confirm_box_buttons");
	        yesButton.setStyleName("ic_confirm_box_yes");
	        noButton.setStyleName("ic_confirm_box_no");
	        
	        dialogHPanel.setWidth("100%");
	        dialogHPanel.setHorizontalAlignment(HasHorizontalAlignment.ALIGN_CENTER);
	        dialogHPanel.add(yesButton);
	        dialogHPanel.add(noButton);
	        this.element = getElement();
	        parent = this.element.getParentElement();
	        int top = 200 + Window.getScrollTop();
	        int left = (parent.getClientWidth() / 2) - 150;

	        noButton.addClickHandler(new ClickHandler() {
	            @Override
	            public void onClick(ClickEvent event) {
	                dialogBox.hide();
	                removeHoveringFromButtons();
	              }
	        });

	        yesButton.addClickHandler(new ClickHandler() {
	            @Override
	            public void onClick(ClickEvent event) {
	            	pageService.reset();
	                dialogBox.hide();
	                removeHoveringFromButtons();
	              }
	        });

	        dialogBox.setWidget(dialogHPanel);
	        dialogBox.setPopupPosition(left, top);
	        dialogBox.show();
		} else {
			this.pageService.reset();
		}				
	}

	@Override
	public void enter() {
		this.execute();
		
	}
}
