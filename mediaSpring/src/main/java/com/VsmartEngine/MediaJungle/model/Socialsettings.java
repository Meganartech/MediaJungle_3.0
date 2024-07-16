package com.VsmartEngine.MediaJungle.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name= "social_setting")
public class Socialsettings {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	
	@Column (name="fb_client_id")
	private String fb_client_id;
	
	@Column (name="fb_client_secret")
	private String fb_client_secret;
	
	@Column (name="fb_call_back")
	private String fb_call_back;
	
	@Column (name="googl_client_id")
	private String googl_client_id;
	
	@Column (name="googl_client_secret")
	private String googl_client_secret;
	
	@Column (name="googl_client_back")
	private String googl_client_back;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getFb_client_id() {
		return fb_client_id;
	}

	public void setFb_client_id(String fb_client_id) {
		this.fb_client_id = fb_client_id;
	}

	public String getFb_client_secret() {
		return fb_client_secret;
	}

	public void setFb_client_secret(String fb_client_secret) {
		this.fb_client_secret = fb_client_secret;
	}

	public String getFb_call_back() {
		return fb_call_back;
	}

	public void setFb_call_back(String fb_call_back) {
		this.fb_call_back = fb_call_back;
	}

	public String getGoogl_client_id() {
		return googl_client_id;
	}

	public void setGoogl_client_id(String googl_client_id) {
		this.googl_client_id = googl_client_id;
	}

	public String getGoogl_client_secret() {
		return googl_client_secret;
	}

	public void setGoogl_client_secret(String googl_client_secret) {
		this.googl_client_secret = googl_client_secret;
	}

	public String getGoogl_client_back() {
		return googl_client_back;
	}

	public void setGoogl_client_back(String googl_client_back) {
		this.googl_client_back = googl_client_back;
	}

	public Socialsettings(long id, String fb_client_id, String fb_client_secret, String fb_call_back,
			String googl_client_id, String googl_client_secret, String googl_client_back) {
		super();
		this.id = id;
		this.fb_client_id = fb_client_id;
		this.fb_client_secret = fb_client_secret;
		this.fb_call_back = fb_call_back;
		this.googl_client_id = googl_client_id;
		this.googl_client_secret = googl_client_secret;
		this.googl_client_back = googl_client_back;
	}
	
	
}
