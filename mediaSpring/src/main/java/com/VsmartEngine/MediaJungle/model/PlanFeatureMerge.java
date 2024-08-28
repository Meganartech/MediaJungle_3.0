package com.VsmartEngine.MediaJungle.model;

import jakarta.persistence.*;

@Entity
@Table(name = "plan_feature_merge")
public class PlanFeatureMerge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "plan_id")
    private Long planId;

    @Column(name = "feature_id")
    private Long featureId;

    @Column(name = "active")
    private boolean active;

    public PlanFeatureMerge() {}

    public PlanFeatureMerge(Long planId, Long featureId, boolean active) {
        this.planId = planId;
        this.featureId = featureId;
        this.active = active;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPlanId() {
        return planId;
    }

    public void setPlanId(Long planId) {
        this.planId = planId;
    }

    public Long getFeatureId() {
        return featureId;
    }

    public void setFeatureId(Long featureId) {
        this.featureId = featureId;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
