package com.VsmartEngine.MediaJungle.videoContainer;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public class VideoContainerDTO {
	
	private String value;
    private String category;
	public VideoContainerDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public VideoContainerDTO(String value, String category) {
		super();
		this.value = value;
		this.category = category;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
    
    

}
