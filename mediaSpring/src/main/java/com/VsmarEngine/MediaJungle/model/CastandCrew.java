package com.VsmarEngine.MediaJungle.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table
public class CastandCrew {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	
	@Lob
	@Column(name="thumbnail" ,length=1000000)
	private byte[] image;
	
	private String name;
	
	 @OneToMany(mappedBy = "castAndCrew")
	 @JsonBackReference
	 private List<VideoCastAndCrew> videoCastAndCrews;
	
//	@ManyToMany(mappedBy = "castandcrewlist")
//	@JsonBackReference
//	private List<VideoDescription> videos;
	


	public CastandCrew() {
		super();
		// TODO Auto-generated constructor stub
	}
	



	public CastandCrew(long id, byte[] image, String name, List<VideoCastAndCrew> videoCastAndCrews) {
	super();
	this.id = id;
	this.image = image;
	this.name = name;
	this.videoCastAndCrews = videoCastAndCrews;
}




	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public byte[] getImage() {
		return image;
	}

	public void setImage(byte[] image) {
		this.image = image;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}




	public List<VideoCastAndCrew> getVideoCastAndCrews() {
		return videoCastAndCrews;
	}




	public void setVideoCastAndCrews(List<VideoCastAndCrew> videoCastAndCrews) {
		this.videoCastAndCrews = videoCastAndCrews;
	}




	
	
	
}
