package com.VsmartEngine.MediaJungle.model;

import jakarta.persistence.*;

@Entity
@Table(name = "plan_feature_merge")
public class PlanFeatureMerge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long planFeatureId;

    @ManyToOne
    @JoinColumn(name = "planid", nullable = false)
    private PlanDetails plan;

    @ManyToOne
    @JoinColumn(name = "featureid", nullable = false)
    private PlanFeatures feature;

    @Column(nullable = false)
    private Boolean active;

	public Long getPlanFeatureId() {
		return planFeatureId;
	}

	public void setPlanFeatureId(Long planFeatureId) {
		this.planFeatureId = planFeatureId;
	}

	public PlanDetails getPlan() {
		return plan;
	}

	public void setPlan(PlanDetails plan) {
		this.plan = plan;
	}

	public PlanFeatures getFeature() {
		return feature;
	}

	public void setFeature(PlanFeatures feature) {
		this.feature = feature;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

    // Getters and Setters
    
}
