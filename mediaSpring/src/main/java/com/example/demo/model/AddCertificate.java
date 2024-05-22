package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table
public class AddCertificate {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
    private long id;
	
    @Column(name="certificate")
    private String certificate;

	public AddCertificate() {
		super();
		// TODO Auto-generated constructor stub
	}

	public AddCertificate(long id, String certificate) {
		super();
		this.id = id;
		this.certificate = certificate;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getCertificate() {
		return certificate;
	}

	public void setCertificate(String certificate) {
		this.certificate = certificate;
	}

	
}
