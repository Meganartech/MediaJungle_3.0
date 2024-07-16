package com.VsmarEngine.MediaJungle.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table
public class PlanDescription {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
	private String description;

	private Long planId;
	
	private String active;
	

	public PlanDescription() {
		super();
		// TODO Auto-generated constructor stub
	}

	

	public PlanDescription(Long id, String description, Long planId, String active) {
		super();
		this.id = id;
		this.description = description;
		this.planId = planId;
		this.active = active;
	}



	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Long getPlanId() {
		return planId;
	}

	public void setPlanId(Long planId) {
		this.planId = planId;
	}



	public String getActive() {
		return active;
	}



	public void setActive(String active) {
		this.active = active;
	}

	
	
	
}
