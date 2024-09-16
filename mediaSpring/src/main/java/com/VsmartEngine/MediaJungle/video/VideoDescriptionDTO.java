package com.VsmartEngine.MediaJungle.video;

public class VideoDescriptionDTO {
	
	private long videoid;
	private String category;
	private String videothumbnailimage;
	public VideoDescriptionDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public VideoDescriptionDTO(long videoid, String category, String videothumbnailimage) {
		super();
		this.videoid = videoid;
		this.category = category;
		this.videothumbnailimage = videothumbnailimage;
	}
	public long getVideoid() {
		return videoid;
	}
	public void setVideoid(long videoid) {
		this.videoid = videoid;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public String getVideothumbnailimage() {
		return videothumbnailimage;
	}
	public void setVideothumbnailimage(String videothumbnailimage) {
		this.videothumbnailimage = videothumbnailimage;
	}
	
	

}
