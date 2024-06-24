package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

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
	
	@ManyToMany(mappedBy = "castandcrewlist")
	@JsonBackReference
	private List<VideoDescription> videos;

	public CastandCrew() {
		super();
		// TODO Auto-generated constructor stub
	}
	public CastandCrew(long id, byte[] image, String name, List<VideoDescription> videos) {
		super();
		this.id = id;
		this.image = image;
		this.name = name;
		this.videos = videos;
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
	public List<VideoDescription> getVideos() {
		return videos;
	}
	public void setVideos(List<VideoDescription> videos) {
		this.videos = videos;
	}




}
