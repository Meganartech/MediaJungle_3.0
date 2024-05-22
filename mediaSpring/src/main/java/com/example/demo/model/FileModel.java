package com.example.demo.model;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class FileModel {
	
	
	private String videoFileName ;
//	private Double duration ;
	public String getVideoFileName() {
		return videoFileName;
	}
	public void setVideoFileName(String videoFileName) {
		this.videoFileName = videoFileName;
	}

	public FileModel(String videoFileName) {
		super();
		this.videoFileName = videoFileName;
	}

	public FileModel() {
		super();
		// TODO Auto-generated constructor stub
	}
//	public Double getDuration() {
//		return duration;
//	}
//	public void setDuration(Double duration) {
//		this.duration = duration;
//	}

}
