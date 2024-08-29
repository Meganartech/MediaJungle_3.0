package com.VsmartEngine.MediaJungle.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.VsmartEngine.MediaJungle.model.PlanFeatureMerge;
import com.VsmartEngine.MediaJungle.repository.PlanFeatureMergeRepository;

import java.util.List;

@Service
public class PlanFeatureMergeService {

    @Autowired
    private PlanFeatureMergeRepository repository;

    public List<PlanFeatureMerge> updatePlanFeatureMerges(List<PlanFeatureMerge> planFeatureMerges) {
        return repository.saveAll(planFeatureMerges); // This should handle ID generation
    }
    public void deleteFeaturesByPlanId(Long planId) {
        repository.deleteByPlanId(planId);
    }
}
