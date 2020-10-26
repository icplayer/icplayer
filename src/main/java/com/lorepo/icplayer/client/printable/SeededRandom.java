package com.lorepo.icplayer.client.printable;

import com.google.gwt.user.client.Random;
import com.lorepo.icf.utils.JavaScriptUtils;

public class SeededRandom {

	private int a = 48271;
	private int c = 0;
	private int modulus = 2147483647;
	private int seed = 0;
	
	public SeededRandom() {
		setSeed(Random.nextInt(modulus));
	}
	
	public SeededRandom(int seedValue) {
		setSeed(seedValue);
	}
	
	public void setSeed(int value) {
		if (value == 0) {
			value = 1;
		} else if (value < 0) {
			value *= -1;
		}
		if (value > modulus) {
			value = modulus % value;
		}
		this.seed = value;
	}
	
	public int nextInt(int upperBound) {
		int newSeed = (a * seed + c) % modulus;
		seed = newSeed;
		
		float floatResult = upperBound * seed / modulus;
		return (int) floatResult;
	}
	
	
}
