package com.VsmartEngine.MediaJungle.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table
public class AudioCastAndCrew {
	
	@Id
	private long audio_id;
	

	 @ManyToOne
	 @JoinColumn(name = "castandcrew_id")
	 @JsonManagedReference
	 private CastandCrew castandcrew_id;
	 
//	 @Transient
//	 private String castAndCrewImage;


	public long getAudio_id() {
		return audio_id;
	}

	public void setAudio_id(long audio_id) {
		this.audio_id = audio_id;
	}

	public CastandCrew getCastandcrew_id() {
		return castandcrew_id;
	}

	public void setCastandcrew_id(CastandCrew castandcrew_id) {
		this.castandcrew_id = castandcrew_id;
	}

//	public String getCastAndCrewImage() {
//		return castAndCrewImage;
//	}
//
//	public void setCastAndCrewImage(String castAndCrewImage) {
//		this.castAndCrewImage = castAndCrewImage;
//	}


	 

}
