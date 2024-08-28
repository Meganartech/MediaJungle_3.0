package com.VsmartEngine.MediaJungle.service;

import com.VsmartEngine.MediaJungle.model.PlanFeatureMerge;
import com.VsmartEngine.MediaJungle.repository.PlanFeatureMergeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlanFeatureMergeService {

    @Autowired
    private PlanFeatureMergeRepository repository;

    public void saveFeatures(List<PlanFeatureMerge> features) {
        repository.saveAll(features);
    }
}
