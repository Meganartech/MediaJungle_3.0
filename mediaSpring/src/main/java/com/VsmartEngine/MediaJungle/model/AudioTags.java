package com.VsmartEngine.MediaJungle.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;


@Entity
@Table
public class AudioTags {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long AudioTags_id;
	
	@ManyToOne
	 @JoinColumn(name = "audio_id")
	 @JsonManagedReference
	 private Audiodescription audio_id;

	 @ManyToOne
	 @JoinColumn(name = "tag_id")
	 @JsonManagedReference
	private Tag Tag_id;

	public long getAudioTags_id() {
		return AudioTags_id;
	}

	public void setAudioTags_id(long audioTags_id) {
		AudioTags_id = audioTags_id;
	}

	public Audiodescription getAudio_id() {
		return audio_id;
	}

	public void setAudio_id(Audiodescription audio_id) {
		this.audio_id = audio_id;
	}

	public Tag getTag_id() {
		return Tag_id;
	}

	public void setTag_id(Tag tag_id) {
		Tag_id = tag_id;
	}

	@Override
	public String toString() {
		return "AudioTags [AudioTags_id=" + AudioTags_id + ", audio_id=" + audio_id + ", Tag_id=" + Tag_id + "]";
	}

	
	
	

}
