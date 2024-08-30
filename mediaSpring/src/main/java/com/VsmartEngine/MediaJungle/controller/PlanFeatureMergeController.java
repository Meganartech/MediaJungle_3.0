package com.VsmartEngine.MediaJungle.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.VsmartEngine.MediaJungle.model.PlanFeatureMerge;
import com.VsmartEngine.MediaJungle.service.PlanFeatureMergeService;

@RestController
@RequestMapping("/api/v2")

@CrossOrigin(origins = "http://localhost:3000")
public class PlanFeatureMergeController {

    @Autowired
    private PlanFeatureMergeService service;

    @PutMapping("/planfeaturemerge")
    public ResponseEntity<List<PlanFeatureMerge>> updatePlanFeatureMerge(
            @RequestBody List<PlanFeatureMerge> planFeatureMerges) {

        try {
            List<PlanFeatureMerge> updatedRecords = service.updatePlanFeatureMerges(planFeatureMerges);
            return new ResponseEntity<>(updatedRecords, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @DeleteMapping("/planfeaturemerge")
    public ResponseEntity<HttpStatus> deleteFeaturesByPlanId(
            @RequestParam Long planId) {
        try {
            service.deleteFeaturesByPlanId(planId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/GetFeaturesByPlanId")
    public List<PlanFeatureMerge> getFeaturesByPlanId(@RequestParam Long planId) {
        return service.getFeaturesByPlanId(planId);
    }
}
