package com.VsmarEngine.MediaJungle.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.VsmarEngine.MediaJungle.model.PlanDetails;
import com.VsmarEngine.MediaJungle.repository.PlanDetailsRepository;


@Controller
public class PlanDetailsController {
	
	@Autowired
	private PlanDetailsRepository planrepository;
	

	public ResponseEntity<PlanDetails> planDetails(@RequestParam("planname")String planname,
			@RequestParam("amount") double amount,
			@RequestParam("validity") int validity){
		PlanDetails pay = new PlanDetails();
		pay.setPlanname(planname);
		pay.setAmount(amount);
		pay.setValidity(validity);
		PlanDetails details = planrepository.save(pay);		
		return ResponseEntity.ok(details);	
	}
	

    public ResponseEntity<List<PlanDetails>> getAllPlanDetails() {
        List<PlanDetails> getPlan = planrepository.findAll();
        return new ResponseEntity<>(getPlan, HttpStatus.OK);
    }
	

    public ResponseEntity<PlanDetails> getPlanById(@PathVariable Long id) {
        Optional<PlanDetails> planOptional = planrepository.findById(id);
        
        if (planOptional.isPresent()) {
            return ResponseEntity.ok(planOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
	

	    public ResponseEntity<String> deletePlan(@PathVariable Long planId) {
	        try {
	            if (planrepository.existsById(planId)) {
	                planrepository.deleteById(planId);
	                return new ResponseEntity<>("Plan deleted successfully", HttpStatus.NO_CONTENT);
	            } else {
	                return new ResponseEntity<>("Plan not found", HttpStatus.NOT_FOUND);
	            }
	        } catch (Exception e) {
	            return new ResponseEntity<>("Error deleting plan", HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }
	

    public ResponseEntity<String> editplans(@PathVariable Long planId, @RequestBody PlanDetails updatedPlanDetails) {
        try {
            // Retrieve existing plan data from the repository
            PlanDetails existingplan = planrepository.findById(planId)
                    .orElseThrow(() -> new RuntimeException("Plan not found"));

            // Apply partial updates to the existing plan data
            if (updatedPlanDetails.getPlanname() != null) {
                existingplan.setPlanname(updatedPlanDetails.getPlanname());
            }

            if (updatedPlanDetails.getAmount() != 0) {
                existingplan.setAmount(updatedPlanDetails.getAmount());
            }

            if (updatedPlanDetails.getValidity() != 0) {
                existingplan.setValidity(updatedPlanDetails.getValidity());
            }


            planrepository.save(existingplan);

            return new ResponseEntity<>("Plan details updated successfully", HttpStatus.OK);
        } catch (RuntimeException e) {
            
            return new ResponseEntity<>("Plan not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            
            return new ResponseEntity<>("Error updating plan details", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

	}
	

	


