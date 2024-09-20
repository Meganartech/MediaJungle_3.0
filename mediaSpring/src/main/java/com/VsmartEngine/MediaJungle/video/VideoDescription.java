package com.VsmartEngine.MediaJungle.video;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table
public class VideoDescription {
		

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	private String videoTitle;
	private String mainVideoDuration;
	private String trailerDuration;
	private String rating;
	private String certificateNumber;
	private boolean videoAccessType;
	private String description;
	private String productionCompany;
	private String certificateName;
	private String vidofilename;
	private String videotrailerfilename;
	
	private List<Long> castandcrewlist = new ArrayList<>();
	private List<Long> taglist = new ArrayList<>();
	private List<Long> categorylist = new ArrayList<>();
	private LocalDate date ;
	
	public VideoDescription() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	

	public VideoDescription(long id, String videoTitle, String mainVideoDuration, String trailerDuration, String rating,
			String certificateNumber, boolean videoAccessType, String description, String productionCompany,
			String certificateName, String vidofilename, String videotrailerfilename, List<Long> castandcrewlist,
			List<Long> taglist, List<Long> categorylist,LocalDate date) {
		super();
		this.id = id;
		this.videoTitle = videoTitle;
		this.mainVideoDuration = mainVideoDuration;
		this.trailerDuration = trailerDuration;
		this.rating = rating;
		this.certificateNumber = certificateNumber;
		this.videoAccessType = videoAccessType;
		this.description = description;
		this.productionCompany = productionCompany;
		this.certificateName = certificateName;
		this.vidofilename = vidofilename;
		this.videotrailerfilename = videotrailerfilename;
		this.castandcrewlist = castandcrewlist;
		this.taglist = taglist;
		this.categorylist = categorylist;
		this.date = date;
		}



	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getVideoTitle() {
		return videoTitle;
	}
	public void setVideoTitle(String videoTitle) {
		this.videoTitle = videoTitle;
	}
	public String getMainVideoDuration() {
		return mainVideoDuration;
	}
	public void setMainVideoDuration(String mainVideoDuration) {
		this.mainVideoDuration = mainVideoDuration;
	}
	public String getTrailerDuration() {
		return trailerDuration;
	}
	public void setTrailerDuration(String trailerDuration) {
		this.trailerDuration = trailerDuration;
	}
	public String getRating() {
		return rating;
	}
	public void setRating(String rating) {
		this.rating = rating;
	}
	public String getCertificateNumber() {
		return certificateNumber;
	}
	public void setCertificateNumber(String certificateNumber) {
		this.certificateNumber = certificateNumber;
	}
	public boolean isVideoAccessType() {
		return videoAccessType;
	}
	public void setVideoAccessType(boolean videoAccessType) {
		this.videoAccessType = videoAccessType;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getProductionCompany() {
		return productionCompany;
	}
	public void setProductionCompany(String productionCompany) {
		this.productionCompany = productionCompany;
	}
	

	public String getCertificateName() {
		return certificateName;
	}

	public void setCertificateName(String certificateName) {
		this.certificateName = certificateName;
	}

	public List<Long> getCastandcrewlist() {
		return castandcrewlist;
	}

	public void setCastandcrewlist(List<Long> castandcrewlist) {
		this.castandcrewlist = castandcrewlist;
	}

	public List<Long> getTaglist() {
		return taglist;
	}

	public void setTaglist(List<Long> taglist) {
		this.taglist = taglist;
	}

	public List<Long> getCategorylist() {
		return categorylist;
	}

	public void setCategorylist(List<Long> categorylist) {
		this.categorylist = categorylist;
	}



	public String getVidofilename() {
		return vidofilename;
	}



	public void setVidofilename(String vidofilename) {
		this.vidofilename = vidofilename;
	}



	public String getVideotrailerfilename() {
		return videotrailerfilename;
	}



	public void setVideotrailerfilename(String videotrailerfilename) {
		this.videotrailerfilename = videotrailerfilename;
	}



	public LocalDate getDate() {
		return date;
	}



	public void setDate(LocalDate date) {
		this.date = date;
	}
	
	
	
		
//	@Override
//	public String toString() {
//		return "VideoDescription [id=" + id + ", moviename=" + moviename + ", description=" + description + ", tags="
//				+ tags + ", category=" + category + ", certificate=" + certificate + ", language=" + language
//				+ ", duration=" + duration + ", year=" + year + ", name=" + name + ",paid=" + paid + ",thumbnail="
//				+ Arrays.toString(thumbnail) + "]";
//	}
	
	

}


