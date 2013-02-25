package com.lorepo.icplayer.client.mockup.xml;

import org.apache.commons.lang.NotImplementedException;

import com.google.gwt.xml.client.CDATASection;
import com.google.gwt.xml.client.Document;
import com.google.gwt.xml.client.NamedNodeMap;
import com.google.gwt.xml.client.Node;
import com.google.gwt.xml.client.NodeList;
import com.google.gwt.xml.client.Text;

public class CDATASectionImpl implements CDATASection{

	private org.w3c.dom.CDATASection nodeImpl;
	
	
	public CDATASectionImpl(org.w3c.dom.CDATASection item) {
		this.nodeImpl = item;
	}
	
	
	@Override
	public Text splitText(int offset) {
		throw new NotImplementedException();
	}

	@Override
	public void appendData(String appendedData) {
		throw new NotImplementedException();
	}

	@Override
	public void deleteData(int offset, int count) {
		throw new NotImplementedException();
	}

	@Override
	public String getData() {
		return nodeImpl.getData();
	}

	@Override
	public int getLength() {
		throw new NotImplementedException();
	}

	@Override
	public void insertData(int offset, String insertedData) {
		throw new NotImplementedException();
	}

	@Override
	public void replaceData(int offset, int count, String replacementData) {
		throw new NotImplementedException();
	}

	@Override
	public void setData(String data) {
		throw new NotImplementedException();
	}

	@Override
	public String substringData(int offset, int count) {
		throw new NotImplementedException();
	}

	@Override
	public Node appendChild(Node newChild) {
		throw new NotImplementedException();
	}

	@Override
	public Node cloneNode(boolean deep) {
		throw new NotImplementedException();
	}

	@Override
	public NamedNodeMap getAttributes() {
		throw new NotImplementedException();
	}

	@Override
	public NodeList getChildNodes() {
		throw new NotImplementedException();
	}

	@Override
	public Node getFirstChild() {
		throw new NotImplementedException();
	}

	@Override
	public Node getLastChild() {
		throw new NotImplementedException();
	}

	@Override
	public String getNamespaceURI() {
		throw new NotImplementedException();
	}

	@Override
	public Node getNextSibling() {
		throw new NotImplementedException();
	}

	@Override
	public String getNodeName() {
		throw new NotImplementedException();
	}

	@Override
	public short getNodeType() {
		throw new NotImplementedException();
	}

	@Override
	public String getNodeValue() {
		throw new NotImplementedException();
	}

	@Override
	public Document getOwnerDocument() {
		throw new NotImplementedException();
	}

	@Override
	public Node getParentNode() {
		throw new NotImplementedException();
	}

	@Override
	public String getPrefix() {
		throw new NotImplementedException();
	}

	@Override
	public Node getPreviousSibling() {
		throw new NotImplementedException();
	}

	@Override
	public boolean hasAttributes() {
		throw new NotImplementedException();
	}

	@Override
	public boolean hasChildNodes() {
		throw new NotImplementedException();
	}

	@Override
	public Node insertBefore(Node newChild, Node refChild) {
		throw new NotImplementedException();
	}

	@Override
	public void normalize() {
		throw new NotImplementedException();
	}

	@Override
	public Node removeChild(Node oldChild) {
		throw new NotImplementedException();
	}

	@Override
	public Node replaceChild(Node newChild, Node oldChild) {
		throw new NotImplementedException();
	}

	@Override
	public void setNodeValue(String nodeValue) {
		throw new NotImplementedException();
	}

}
