package com.lorepo.icplayer.client.module.button;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.MouseOverEvent;
import com.google.gwt.event.dom.client.MouseOverHandler;
import com.google.gwt.user.client.ui.Button;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icf.widgets.KeyboarNavigationBasicDialog;
import com.google.gwt.user.client.ui.HasHorizontalAlignment;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.lorepo.icplayer.client.module.api.player.IPlayerCommands;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.Window;
import com.lorepo.icplayer.client.utils.DevicesUtils;

import java.util.ArrayList;

class ResetButton extends ExecutableButton {

	private Element element;
	private com.google.gwt.dom.client.Element parent;
	private String confInfo = "";
	private String confInfoYes = "";
	private String confInfoNo = "";
	private boolean confReset;
	private IPlayerCommands pageService;
	private boolean resetOnlyWrong = false;
	private ArrayList<Button> buttons = new ArrayList<Button>();
	private int position = -1;

	public static native void removeHoveringFromButtons() /*-{
	  var reset = $wnd.$('[id^="Reset"]');

	  $wnd.$(reset).each(function () {
	  	var element = $wnd.$(this),
			classNames = element.attr("class");
		classNames = classNames.replace(/-hovering/g, "");
		element.attr("class", classNames);
	  });
	}-*/;

	public ResetButton(final IPlayerCommands pageService, final boolean confirmReset, final String confirmInfo, final String confirmYesInfo, final String confirmNoInfo, final boolean resetOnlyWrong){
		super(null);

		setStyleName("ic_button_reset");

		this.confReset = confirmReset;
		this.confInfo = confirmInfo;
		this.confInfoYes = confirmYesInfo;
		this.confInfoNo = confirmNoInfo;
		this.pageService = pageService;
		this.resetOnlyWrong = resetOnlyWrong;

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

			final KeyboarNavigationBasicDialog dialogBox = new KeyboarNavigationBasicDialog();
			dialogBox.setStyleName("ic_confim_box");
			dialogBox.addStyleName("ic_active_module");
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
	                removeHoveringFromButtons();
					buttons.clear();
					position = -1;
					dialogBox.hide();
	              }
	        });

	        yesButton.addClickHandler(new ClickHandler() {
	            @Override
	            public void onClick(ClickEvent event) {
	            	pageService.reset(resetOnlyWrong);
	                removeHoveringFromButtons();
					buttons.clear();
					position = -1;
					dialogBox.hide();
	              }
	        });

			buttons.add(yesButton);
			buttons.add(noButton);

            dialogBox.setWidget(dialogHPanel);
            dialogBox.setPopupPosition(left, top);
            dialogBox.show();
        } else {
            this.pageService.reset(resetOnlyWrong);
        }

        if (DevicesUtils.isMobile()) {
            removeHoveringFromButtons();
        }
    }

	public boolean isConfirmationActive() {
		return this.confReset;
	}

	public String getTextFromButton() {
		Button selectedButton = buttons.get(position);
		return selectedButton.getText();
	}

	public String getTextFromDialog() {
		return this.confInfo;
	}

	public boolean isDialogOpen() {
		return buttons.size() > 0;
	}

	public void clear() {
		buttons.clear();
		position = -1;
	}

	public int getSelectedPosition() {
		return position;
	}

	public void enter (KeyDownEvent event, boolean isExiting) {
		if (position == 0) {
			buttons.get(0).click();
		} else if (position == 1) {
			buttons.get(1).click();
		}
	}

	public void tab(KeyDownEvent event) {
		position++;

		if (position == buttons.size()) {
			position = 0;
		}

		this.updateStyleForButtons();
	}

	public void shiftTab(KeyDownEvent event) {
		position--;

		if (position < 0) {
			position = 1;
		}

		this.updateStyleForButtons();
	}

	private void updateStyleForButtons() {
		Button selectedButton = buttons.get(position);
		for (Button button : buttons) {
			button.removeStyleName("ic_selected_module");
		}

		if (selectedButton != null) {
			selectedButton.addStyleName("ic_selected_module");
		}
	}
}