package com.VsmartEngine.MediaJungle.MailVerification;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table
public class VerificationCode {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	
	private String email;
    private String code;
    private LocalDateTime expiryTime;
	public VerificationCode() {
		super();
		// TODO Auto-generated constructor stub
	}
	public VerificationCode(long id, String email, String code, LocalDateTime expiryTime) {
		super();
		this.id = id;
		this.email = email;
		this.code = code;
		this.expiryTime = expiryTime;
	}
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public LocalDateTime getExpiryTime() {
		return expiryTime;
	}
	public void setExpiryTime(LocalDateTime expiryTime) {
		this.expiryTime = expiryTime;
	}
    
    

}
