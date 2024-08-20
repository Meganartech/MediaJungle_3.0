package com.VsmartEngine.MediaJungle.model;

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
public class Audioimages {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	
	@Column(name="audio_id") 
	private long audio_id;
	
	@Lob
	@Column(name="Bannerthumbnail" ,length=1000000)
	private byte[] bannerthumbnail;
	
	@Lob
	@Column(name="Audio_thumbnail" ,length=1000000)
	private byte[] audio_thumbnail;

	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	

	public byte[] getBannerthumbnail() {
		return bannerthumbnail;
	}

	public void setBannerthumbnail(byte[] bannerthumbnail) {
		this.bannerthumbnail = bannerthumbnail;
	}

	public byte[] getAudio_thumbnail() {
		return audio_thumbnail;
	}

	public void setAudio_thumbnail(byte[] audio_thumbnail) {
		this.audio_thumbnail = audio_thumbnail;
	}

	public long getAudio_id() {
		return audio_id;
	}

	public void setAudio_id(long audio_id) {
		this.audio_id = audio_id;
	}

	@Override
	public String toString() {
		return "Audioimages [id=" + id + ", audio_id=" + audio_id + ", bannerthumbnail="
				+ Arrays.toString(bannerthumbnail) + ", audio_thumbnail=" + Arrays.toString(audio_thumbnail) + "]";
	}

	
		
	

	
}
