package com.VsmartEngine.MediaJungle.model;

public class CastAndCrewModalDTO {

	 private Long id;
     private String name;
     private String description;
	public CastAndCrewModalDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public CastAndCrewModalDTO(Long id, String name, String description) {
		super();
		this.id = id;
		this.name = name;
		this.description = description;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
     
     
     
}
