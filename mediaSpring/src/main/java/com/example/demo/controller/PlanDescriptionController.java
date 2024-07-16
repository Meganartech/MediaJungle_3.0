package com.example.demo.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.AddNewCategories;
import com.example.demo.model.AddUser;
import com.example.demo.model.PlanDescription;
import com.example.demo.model.PlanDetails;
import com.example.demo.repository.AddUserRepository;
import com.example.demo.repository.PlanDescriptionRepository;
import com.example.demo.repository.PlanDetailsRepository;
import com.example.demo.userregister.JwtUtil;

@CrossOrigin()
@RestController
@RequestMapping("/api/v2/")
public class PlanDescriptionController {
	
	@Autowired
	private PlanDescriptionRepository plandescriptionrepository;
	
	@Autowired
	private JwtUtil jwtUtil; // Autowire JwtUtil
	
	@Autowired
	private AddUserRepository adduserrepository;
	
	
	@PostMapping("/AddPlanDescription")
	public ResponseEntity<?> addPlanDescription(@RequestParam("description") String description,
	        @RequestParam("planId") Long planId,
	        @RequestHeader("Authorization") String token) {
	    try {
	        // Validate JWT token
	        if (!jwtUtil.validateToken(token)) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
	        }

	        // Extract email from token
	        String email = jwtUtil.getUsernameFromToken(token);
	        System.out.println("email: " + email);

	        // Fetch user details from repository
	        Optional<AddUser> opUser = adduserrepository.findByUsername(email);
	        if (!opUser.isPresent()) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
	        }

	        AddUser user = opUser.get();
	        String username = user.getUsername();

	        // Create a new PlanDescription object
	        PlanDescription plan = new PlanDescription();
	        plan.setDescription(description);
	        plan.setPlanId(planId);

	        // Save the PlanDescription in the repository
	        PlanDescription savedPlanDescription = plandescriptionrepository.save(plan);

	        // Optionally, you can create a notification or perform other actions here
	        
	        return ResponseEntity.ok(savedPlanDescription);
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding plan description.");
	    }
	}

	@PostMapping("/active/{id}")
	public ResponseEntity<?> addActiveStatus(
	        @PathVariable Long id,
	        @RequestParam("active") String active,
	        @RequestHeader("Authorization") String token
	) {
	    try {
	        // Validate JWT token
	        if (!jwtUtil.validateToken(token)) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
	        }

	        // Extract email from token
	        String email = jwtUtil.getUsernameFromToken(token);
	        System.out.println("email: " + email);

	        // Fetch user details from repository
	        Optional<AddUser> opUser = adduserrepository.findByUsername(email);
	        if (!opUser.isPresent()) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
	        }

	        AddUser user = opUser.get();
	        String username = user.getUsername();

	        // Fetch the plan description from repository
	        Optional<PlanDescription> optionalPlan = plandescriptionrepository.findById(id);
	        if (optionalPlan.isPresent()) {
	            PlanDescription plan = optionalPlan.get();
	            plan.setActive(active);

	            // Save the updated plan description
	            PlanDescription updatedPlan = plandescriptionrepository.save(plan);

	            // Optionally, you can create a notification or perform other actions here

	            return ResponseEntity.ok(updatedPlan); // Return 200 OK with the updated plan description
	        } else {
	            return ResponseEntity.notFound().build(); // Return 404 Not Found if plan with id is not found
	        }
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating active status.");
	    }
	}
	
	@DeleteMapping("/deletedesc/{id}")
	public ResponseEntity<?> deletedescription(@PathVariable Long id, @RequestHeader("Authorization") String token) {
	    try {
	        // Validate JWT token
	        if (!jwtUtil.validateToken(token)) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
	        }

	        // Extract username from token
	        String email = jwtUtil.getUsernameFromToken(token);
	        System.out.println("email: " + email);

	        // Fetch user details from repository
	        Optional<AddUser> optionalUser = adduserrepository.findByUsername(email);
	        if (!optionalUser.isPresent()) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not authorized"));
	        }

	        // Delete plan description by ID
	        plandescriptionrepository.deleteById(id);

	        return ResponseEntity.noContent().build();
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }
	}


	
	
	
}
