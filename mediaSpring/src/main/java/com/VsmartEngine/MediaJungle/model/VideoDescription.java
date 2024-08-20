package com.VsmartEngine.MediaJungle.model;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table
public class VideoDescription {
		
//	private String moviename ;
//	private String description ;
//	private String tags ;
//	private String category ;
//	private String certificate ;
//	private String language ;
//	private String duration ;
//	private String year; 
//	private String name; 
//	private boolean paid;
//	@OneToMany(mappedBy = "videoDescription", cascade = CascadeType.ALL)
//	@JsonBackReference
//	private List<VideoCastAndCrew> videoCastAndCrews;	
//	@Lob
//	@Column(name="thumbnail" ,length=1000000)
//	private byte[] thumbnail;

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
	@Column(name="videoThumbnail" ,length=1000000)
	private byte[] videoThumbnail;
	@Column(name="trailerThumbnail" ,length=1000000)
	private byte[] trailerThumbnail;
	@Column(name="userBanner" ,length=1000000)
	private byte[] userBanner;
	private List<Long> certificateName = new ArrayList<>();
	private List<Long> castandcrewlist = new ArrayList<>();
	private List<Long> taglist = new ArrayList<>();
	private List<Long> categorylist = new ArrayList<>();
	
	public VideoDescription() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public VideoDescription(long id, String videoTitle, String mainVideoDuration, String trailerDuration, String rating,
			String certificateNumber, boolean videoAccessType, String description, String productionCompany,
			byte[] videoThumbnail, byte[] trailerThumbnail, byte[] userBanner, List<Long> certificateName,
			List<Long> castandcrewlist, List<Long> taglist, List<Long> categorylist) {
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
		this.videoThumbnail = videoThumbnail;
		this.trailerThumbnail = trailerThumbnail;
		this.userBanner = userBanner;
		this.certificateName = certificateName;
		this.castandcrewlist = castandcrewlist;
		this.taglist = taglist;
		this.categorylist = categorylist;
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
	public byte[] getVideoThumbnail() {
		return videoThumbnail;
	}
	public void setVideoThumbnail(byte[] videoThumbnail) {
		this.videoThumbnail = videoThumbnail;
	}
	public byte[] getTrailerThumbnail() {
		return trailerThumbnail;
	}
	public void setTrailerThumbnail(byte[] trailerThumbnail) {
		this.trailerThumbnail = trailerThumbnail;
	}
	public byte[] getUserBanner() {
		return userBanner;
	}
	public void setUserBanner(byte[] userBanner) {
		this.userBanner = userBanner;
	}

	public List<Long> getCertificateName() {
		return certificateName;
	}

	public void setCertificateName(List<Long> certificateName) {
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
	
		
//	@Override
//	public String toString() {
//		return "VideoDescription [id=" + id + ", moviename=" + moviename + ", description=" + description + ", tags="
//				+ tags + ", category=" + category + ", certificate=" + certificate + ", language=" + language
//				+ ", duration=" + duration + ", year=" + year + ", name=" + name + ",paid=" + paid + ",thumbnail="
//				+ Arrays.toString(thumbnail) + "]";
//	}
	
	

}


