package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
@Entity
@Table(name="payment_settings")
public class Paymentsettings {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	
	@Column (name ="paypal_id")
	private String paypal_id;
	
	@Column (name ="paypal_secret")
	private String paypal_secret;
	
	@Column (name ="stripe_publishable_key")
	private String stripe_publishable_key;
	
	@Column (name ="stripe_secret_key")
	private String stripe_secret_key;
	
	@Column (name ="razorpay_key")
	private String razorpay_key;
	
	@Column (name ="razorpay_secret_key")
	private String razorpay_secret_key;
	
	@Column (name ="paystack_key")
	private String paystack_key;
	
	@Column (name ="paystack_secret_key")
	private String paystack_secret_key;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getPaypal_id() {
		return paypal_id;
	}

	public void setPaypal_id(String paypal_id) {
		this.paypal_id = paypal_id;
	}

	public String getPaypal_secret() {
		return paypal_secret;
	}

	public void setPaypal_secret(String paypal_secret) {
		this.paypal_secret = paypal_secret;
	}

	public String getStripe_publishable_key() {
		return stripe_publishable_key;
	}

	public void setStripe_publishable_key(String stripe_publishable_key) {
		this.stripe_publishable_key = stripe_publishable_key;
	}

	public String getStripe_secret_key() {
		return stripe_secret_key;
	}

	public void setStripe_secret_key(String stripe_secret_key) {
		this.stripe_secret_key = stripe_secret_key;
	}

	public String getRazorpay_key() {
		return razorpay_key;
	}

	public void setRazorpay_key(String razorpay_key) {
		this.razorpay_key = razorpay_key;
	}

	public String getRazorpay_secret_key() {
		return razorpay_secret_key;
	}

	public void setRazorpay_secret_key(String razorpay_secret_key) {
		this.razorpay_secret_key = razorpay_secret_key;
	}

	public String getPaystack_key() {
		return paystack_key;
	}

	public void setPaystack_key(String paystack_key) {
		this.paystack_key = paystack_key;
	}

	public String getPaystack_secret_key() {
		return paystack_secret_key;
	}

	public void setPaystack_secret_key(String paystack_secret_key) {
		this.paystack_secret_key = paystack_secret_key;
	}

	public Paymentsettings(long id, String paypal_id, String paypal_secret, String stripe_publishable_key,
			String stripe_secret_key, String razorpay_key, String razorpay_secret_key, String paystack_key,
			String paystack_secret_key) {
		super();
		this.id = id;
		this.paypal_id = paypal_id;
		this.paypal_secret = paypal_secret;
		this.stripe_publishable_key = stripe_publishable_key;
		this.stripe_secret_key = stripe_secret_key;
		this.razorpay_key = razorpay_key;
		this.razorpay_secret_key = razorpay_secret_key;
		this.paystack_key = paystack_key;
		this.paystack_secret_key = paystack_secret_key;
	}
	
	

}
