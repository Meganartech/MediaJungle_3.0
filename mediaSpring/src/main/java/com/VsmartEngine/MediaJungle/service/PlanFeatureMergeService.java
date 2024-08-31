package com.VsmartEngine.MediaJungle.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.VsmartEngine.MediaJungle.model.PlanFeatureMerge;
import com.VsmartEngine.MediaJungle.repository.PlanFeatureMergeRepository;

@Service
public class PlanFeatureMergeService {

    @Autowired
    private PlanFeatureMergeRepository repository;

    public List<PlanFeatureMerge> updatePlanFeatureMerges(List<PlanFeatureMerge> planFeatureMerges) {
        // Logic to fully update records
        return repository.saveAll(planFeatureMerges);
    }

    public List<PlanFeatureMerge> patchPlanFeatureMerges(List<PlanFeatureMerge> planFeatureMerges) {
        List<PlanFeatureMerge> updatedRecords = new ArrayList<>();
        for (PlanFeatureMerge newRecord : planFeatureMerges) {
            Optional<PlanFeatureMerge> existingRecordOpt = repository.findById(newRecord.getId());
            if (existingRecordOpt.isPresent()) {
                PlanFeatureMerge existingRecord = existingRecordOpt.get();
                if (newRecord.getActive() != null) {
                    existingRecord.setActive(newRecord.getActive());
                }
                updatedRecords.add(repository.save(existingRecord));
            }
        }
        return updatedRecords;
    }


    public void deleteFeaturesByPlanId(Long planId) {
        // Logic to delete features by plan ID
        repository.deleteByPlanId(planId);
    }

    public List<PlanFeatureMerge> getFeaturesByPlanId(Long planId) {
        // Logic to get features by plan ID
        return repository.findByPlanId(planId);
    }
}
