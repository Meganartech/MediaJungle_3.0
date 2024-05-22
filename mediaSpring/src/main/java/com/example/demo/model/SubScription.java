package com.example.demo.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table
public class SubScription {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String subscriptionTitle;
    private String paymentId;
    private String paymentMode;
    private double paidAmount;
    private LocalDate expiryDate;
    private String status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

	public SubScription() {
		super();
		// TODO Auto-generated constructor stub
	}

	public SubScription(Long id, String subscriptionTitle, String paymentId, String paymentMode, double paidAmount,
			LocalDate expiryDate, String status, User user) {
		super();
		this.id = id;
		this.subscriptionTitle = subscriptionTitle;
		this.paymentId = paymentId;
		this.paymentMode = paymentMode;
		this.paidAmount = paidAmount;
		this.expiryDate = expiryDate;
		this.status = status;
		this.user = user;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getSubscriptionTitle() {
		return subscriptionTitle;
	}

	public void setSubscriptionTitle(String subscriptionTitle) {
		this.subscriptionTitle = subscriptionTitle;
	}

	public String getPaymentId() {
		return paymentId;
	}

	public void setPaymentId(String paymentId) {
		this.paymentId = paymentId;
	}

	public String getPaymentMode() {
		return paymentMode;
	}

	public void setPaymentMode(String paymentMode) {
		this.paymentMode = paymentMode;
	}

	public double getPaidAmount() {
		return paidAmount;
	}

	public void setPaidAmount(double paidAmount) {
		this.paidAmount = paidAmount;
	}

	public LocalDate getExpiryDate() {
		return expiryDate;
	}

	public void setExpiryDate(LocalDate expiryDate) {
		this.expiryDate = expiryDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
    
    
}
