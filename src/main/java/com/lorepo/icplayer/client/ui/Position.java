package com.lorepo.icplayer.client.ui;

public class Position {
	private int left;
	private int top;
	
	public Position(int left, int top) {
		super();
		this.left = left;
		this.top = top;
	}
	
	public int getLeft() {
		return left;
	}
	public void setLeft(int left) {
		this.left = left;
	}
	public int getTop() {
		return top;
	}
	public void setTop(int top) {
		this.top = top;
	}
}