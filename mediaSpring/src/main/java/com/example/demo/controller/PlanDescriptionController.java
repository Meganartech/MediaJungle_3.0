package com.example.demo.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.AddNewCategories;
import com.example.demo.model.PlanDescription;
import com.example.demo.model.PlanDetails;
import com.example.demo.repository.PlanDescriptionRepository;
import com.example.demo.repository.PlanDetailsRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v2/")
public class PlanDescriptionController {
	
	@Autowired
	private PlanDescriptionRepository plandescriptionrepository;
	
	
	@PostMapping("/AddPlanDescription")
    public ResponseEntity<PlanDescription> addPlanDescription(@RequestParam("description") String description,
            @RequestParam("planId") Long planId) {
        
        PlanDescription plan = new PlanDescription();
        plan.setDescription(description);
        plan.setPlanId(planId);
        
        PlanDescription savedPlanDescription = plandescriptionrepository.save(plan);
        
        return ResponseEntity.ok(savedPlanDescription);
    }
	
	@PostMapping("/active/{id}")
    public ResponseEntity<PlanDescription> addActiveStatus(
            @PathVariable Long id,
            @RequestParam("active") String active
    ) {
        Optional<PlanDescription> optionalPlan = plandescriptionrepository.findById(id);
        
        if (optionalPlan.isPresent()) {
            PlanDescription plan = optionalPlan.get();
            plan.setActive(active);
            plandescriptionrepository.save(plan); // Save the updated plan description
            
            return ResponseEntity.ok(plan); // Return 200 OK with the updated plan description
        } else {
            return ResponseEntity.notFound().build(); // Return 404 Not Found if plan with id is not found
        }
    }
	
}
