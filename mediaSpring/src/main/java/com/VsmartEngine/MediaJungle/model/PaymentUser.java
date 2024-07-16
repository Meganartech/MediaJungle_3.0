package com.VsmartEngine.MediaJungle.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Table
@Entity
public class PaymentUser {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
	private String orderId;
	private Long userId;
	private String paymentId;
	private double Amount;
	private LocalDate expiryDate;
    private String status;
    private String subscriptionTitle;
	
	public PaymentUser() {
		super();
		// TODO Auto-generated constructor stub
	}

	public PaymentUser(Long id, String orderId, Long userId, String paymentId, double amount, LocalDate expiryDate,
			String status, String subscriptionTitle) {
		super();
		this.id = id;
		this.orderId = orderId;
		this.userId = userId;
		this.paymentId = paymentId;
		Amount = amount;
		this.expiryDate = expiryDate;
		this.status = status;
		this.subscriptionTitle = subscriptionTitle;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getPaymentId() {
		return paymentId;
	}

	public void setPaymentId(String paymentId) {
		this.paymentId = paymentId;
	}

	public double getAmount() {
		return Amount;
	}

	public void setAmount(double amount) {
		Amount = amount;
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

	public String getSubscriptionTitle() {
		return subscriptionTitle;
	}

	public void setSubscriptionTitle(String subscriptionTitle) {
		this.subscriptionTitle = subscriptionTitle;
	}

	
}
