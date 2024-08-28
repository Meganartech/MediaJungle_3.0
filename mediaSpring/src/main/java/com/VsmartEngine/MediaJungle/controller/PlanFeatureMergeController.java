package com.VsmartEngine.MediaJungle.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.VsmartEngine.MediaJungle.model.PlanFeatureMerge;
import com.VsmartEngine.MediaJungle.service.PlanFeatureMergeService;

@RestController
@RequestMapping("/api/v2")
@CrossOrigin(origins = "http://localhost:3000")
public class PlanFeatureMergeController {

    @Autowired
    private PlanFeatureMergeService planFeatureMergeService;

    @PostMapping("/SaveFeatures")
    public ResponseEntity<Void> saveFeatures(@RequestBody List<PlanFeatureMerge> featuresData) {
        planFeatureMergeService.saveFeatures(featuresData);
        return ResponseEntity.ok().build();
    }
    
}
