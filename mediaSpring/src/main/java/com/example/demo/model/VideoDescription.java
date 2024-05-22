package com.example.demo.model;

import java.util.Arrays;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;



@Entity
@Table
public class VideoDescription {
	
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	private String moviename ;
	private String description ;
	private String tags ;
	private String category ;
	private String certificate ;
	private String language ;
	private String duration ;
	private String year; 
	private String name; 
	private boolean paid;
	@Lob
	@Column(name="thumbnail" ,length=1000000)
	private byte[] thumbnail;
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getMoviename() {
		return moviename;
	}
	public void setMoviename(String moviename) {
		this.moviename = moviename;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getTags() {
		return tags;
	}
	public void setTags(String tags) {
		this.tags = tags;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public String getCertificate() {
		return certificate;
	}
	public void setCertificate(String certificate) {
		this.certificate = certificate;
	}
	public String getLanguage() {
		return language;
	}
	public void setLanguage(String language) {
		this.language = language;
	}
	public String getDuration() {
		return duration;
	}
	public void setDuration(String duration) {
		this.duration = duration;
	}
	public String getYear() {
		return year;
	}
	public void setYear(String year) {
		this.year = year;
	}
	public byte[] getThumbnail() {
		return thumbnail;
	}
	public void setThumbnail(byte[] thumbnail) {
		this.thumbnail = thumbnail;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	 public boolean isPaid() {
	        return paid;
	    }

	 public void setPaid(boolean paid) {
	        this.paid = paid;
	    }
	
	public VideoDescription(long id, String moviename, String description, String tags, String category,
			String certificate, String language, String duration, String year, String name,boolean paid, byte[] thumbnail) {
		super();
		this.id = id;
		this.moviename = moviename;
		this.description = description;
		this.tags = tags;
		this.category = category;
		this.certificate = certificate;
		this.language = language;
		this.duration = duration;
		this.year = year;
		this.name = name;
		this.paid=paid;
		this.thumbnail = thumbnail;
	}
	public VideoDescription() {
		super();
	}
	
	@Override
	public String toString() {
		return "VideoDescription [id=" + id + ", moviename=" + moviename + ", description=" + description + ", tags="
				+ tags + ", category=" + category + ", certificate=" + certificate + ", language=" + language
				+ ", duration=" + duration + ", year=" + year + ", name=" + name + ",paid=" + paid + ",thumbnail="
				+ Arrays.toString(thumbnail) + "]";
	}
	
	
	

}
