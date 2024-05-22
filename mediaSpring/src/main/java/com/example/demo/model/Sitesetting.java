package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="site_setting")
public class Sitesetting {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;

    @Column(name = "sitename")
    private String sitename;
    
    @Column(name = "appurl")
    private String appurl;

    @Column(name = "tagName")
    private String tagName;
    
    @Column(name = "icon")
    private String icon;
    
    @Column(name = "logo")
    private String logo; 
   

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getSitename() {
		return sitename;
	}

	public void setSitename(String sitename) {
		this.sitename = sitename;
	}

	public String getLogo() {
		return logo;
	}

	public void setLogo(String logo) {
		this.logo = logo;
	}

	public String getAppurl() {
		return appurl;
	}

	public void setAppurl(String appurl) {
		this.appurl = appurl;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getTagName() {
		return tagName;
	}

	public void setTagName(String tagName) {
		this.tagName = tagName;
	}

	public Sitesetting() {

    }

    
   
}
	
