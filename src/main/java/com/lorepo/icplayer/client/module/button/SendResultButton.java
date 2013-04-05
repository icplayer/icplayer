package com.lorepo.icplayer.client.module.button;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.user.client.ui.PushButton;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;


/**
 * This class will be removed 
 * @author Krzysztof Langner
 *
 */
@Deprecated
class SendResultButton extends PushButton{

	public SendResultButton(final IPlayerServices services){
		
		setStyleName("ic_button_send");

		addClickHandler(new ClickHandler() {
			
			@Override
			public void onClick(ClickEvent event) {

//				IScoreService scoreService = services.getScoreService();
//				IServerService serverService = services.getServerService();
//				int result = scoreService.getTotalPercentage();
//				SendResultDialog dlg = new SendResultDialog(
//						serverService.getServerApiUrl()+"/addresult", Integer.toString(result)+"%");
//				dlg.show();
			}
		});
		
	}
}
