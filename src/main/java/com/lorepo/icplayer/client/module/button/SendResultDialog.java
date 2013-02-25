package com.lorepo.icplayer.client.module.button;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.Event.NativePreviewEvent;
import com.google.gwt.user.client.ui.AbsolutePanel;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.FormPanel;
import com.google.gwt.user.client.ui.FormPanel.SubmitCompleteEvent;
import com.google.gwt.user.client.ui.FormPanel.SubmitCompleteHandler;
import com.google.gwt.user.client.ui.Hidden;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.TextArea;
import com.google.gwt.user.client.ui.Widget;


class SendResultDialog extends DialogBox {

	private static final int	DLG_WIDTH = 500;
	private static final int	DLG_HEIGHT = 400;
	
	/** URL where results should be post */
	private String postUrl;
	/** Results */
	private String score;
	
	
	public SendResultDialog(String url, String score) {

		postUrl = url;
		this.score = score;
		setText("Send results to the server");
		setAnimationEnabled(true);
		setGlassEnabled(true);
		setWidget(createUI());
		center();
	}

	  
	/**
	 * Obsługa zamykania klawiszem Esc
	 */
	@Override
    protected void onPreviewNativeEvent(NativePreviewEvent event) {
        super.onPreviewNativeEvent(event);
        switch (event.getTypeInt()) {
            case Event.ONKEYDOWN:
                if (event.getNativeEvent().getKeyCode() == KeyCodes.KEY_ESCAPE) {
                    hide();
                }
                break;
        }
    }
	
	
	/**
	 * Create dialogbox UI
	 * @return
	 */
	private Widget createUI() {

		AbsolutePanel	innerPanel = new AbsolutePanel();
		
		innerPanel.setPixelSize(DLG_WIDTH, DLG_HEIGHT);
		
		Label feedbackLabel = new Label("Comments (optional):");
		innerPanel.add(feedbackLabel);
		TextArea textArea = new TextArea();
		textArea.setName("comments");
		textArea.setPixelSize(470, 300);
		innerPanel.add(textArea);
	    Button sendButton = new Button("<b>Send</b>");
	    innerPanel.add(sendButton);
	    Button cancelButton = new Button("Cancel");
	    innerPanel.add(cancelButton);
	    Hidden resultsHidden = new Hidden("score", score);
	    innerPanel.add(resultsHidden);
	    
	    // Set widget positions
	    innerPanel.setWidgetPosition(feedbackLabel, 10, 10);
	    innerPanel.setWidgetPosition(textArea, 10, 30);
	    innerPanel.setWidgetPosition(sendButton, DLG_WIDTH-130, DLG_HEIGHT-40);
	    innerPanel.setWidgetPosition(cancelButton, DLG_WIDTH-70, DLG_HEIGHT-40);

		final FormPanel form = new FormPanel();
		form.setAction(postUrl);

        form.setMethod(FormPanel.METHOD_POST);
        form.setWidget(innerPanel);
        
	    cancelButton.addClickHandler(new ClickHandler() {
	        public void onClick(ClickEvent event) {
	        	SendResultDialog.this.hide();
	        }
	    });

	    sendButton.addClickHandler(new ClickHandler() {
	        public void onClick(ClickEvent event) {
	        	form.submit();
	        }
	    });

	    form.addSubmitCompleteHandler(new SubmitCompleteHandler() {
			
			@Override
			public void onSubmitComplete(SubmitCompleteEvent event) {
	        	SendResultDialog.this.hide();
			}
		});
	    
	    return form;
	}

}