package com.VsmartEngine.MediaJungle.Library;

public class LikedsongsDTO {
	
	private Long audioId;
	private String audioTitle;
	public LikedsongsDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public LikedsongsDTO(Long audioId, String audioTitle) {
		super();
		this.audioId = audioId;
		this.audioTitle = audioTitle;
	}
	public Long getAudioId() {
		return audioId;
	}
	public void setAudioId(Long audioId) {
		this.audioId = audioId;
	}
	public String getAudioTitle() {
		return audioTitle;
	}
	public void setAudioTitle(String audioTitle) {
		this.audioTitle = audioTitle;
	}
	
	
	

}
