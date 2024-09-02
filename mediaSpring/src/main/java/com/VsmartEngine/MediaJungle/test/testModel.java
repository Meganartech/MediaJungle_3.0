package com.VsmartEngine.MediaJungle.test;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="Affilaters")
public class testModel {
    
	
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	
	@Column(name = "name")
	private String name;
	
	@Column(name = "emailId")
	private String emailId;
	
	@Column(name = "mobilenumber")
	private String mobilenumber;
	
	@Column(name = "address")
	private String address;
	
	@Column(name = "coupon10")
	private String coupon10;
	
	@Column(name = "coupon20")
	private String coupon20;
	
	@Column(name = "referalid")
	private String referalid;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

		
	
	
	public String getCoupon10() {
		return coupon10;
	}

	public void setCoupon10(String coupon10) {
		this.coupon10 = coupon10;
	}

	public String getCoupon20() {
		return coupon20;
	}

	public void setCoupon20(String coupon20) {
		this.coupon20 = coupon20;
	}

	public String getReferalid() {
		return referalid;
	}

	public void setReferalid(String referalid) {
		this.referalid = referalid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public String getMobilenumber() {
		return mobilenumber;
	}

	public void setMobilenumber(String mobilenumber) {
		this.mobilenumber = mobilenumber;
	}


	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Override
	public String toString() {
		return "testModel [id=" + id + ", name=" + name + ", emailId=" + emailId + ", mobilenumber=" + mobilenumber
				+ ", address=" + address + "]";
	}
	
	
}
