package com.example.demo.controller;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.AddCertificate;
import com.example.demo.model.AddUser;
import com.example.demo.model.PlanDetails;
import com.example.demo.notification.service.NotificationService;
import com.example.demo.repository.AddUserRepository;
import com.example.demo.repository.PlanDescriptionRepository;
import com.example.demo.repository.PlanDetailsRepository;
import com.example.demo.userregister.JwtUtil;
import com.example.demo.userregister.UserRegister;

@CrossOrigin()
@RestController
@RequestMapping("/api/v2/")
public class PlanDetailsController {
	
	@Autowired
	private PlanDetailsRepository planrepository;
	
	@Autowired
	private NotificationService notificationservice;
	
	@Autowired
	private JwtUtil jwtUtil; // Autowire JwtUtil
	
	@Autowired
	private AddUserRepository adduserrepository;
	
	
	@PostMapping("/PlanDetails")
	public ResponseEntity<?> planDetails(@RequestParam("planname")String planname,
			@RequestParam("amount") double amount,
			@RequestParam("validity") int validity,
			@RequestHeader("Authorization") String token){
		 try {
		        if (!jwtUtil.validateToken(token)) {
		            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
		        }

		        String email = jwtUtil.getUsernameFromToken(token);
		        Optional<AddUser> opUser = adduserrepository.findByUsername(email);

		        if (opUser.isPresent()) {
		            AddUser user = opUser.get();
		            String username = user.getUsername();
		             PlanDetails pay = new PlanDetails();
		             pay.setPlanname(planname);
		             pay.setAmount(amount);
		             pay.setValidity(validity);
		             PlanDetails details = planrepository.save(pay);	
		             Long planId = details.getId();
			            String Name = details.getPlanname();
			            String heading = Name + " New Paln Added!";
			            // Create notification with optional file (thumbnail)
			            Long notifyId = notificationservice.createNotification(username, email, heading);

			            if (notifyId != null) {
			                Set<String> notiUserSet = new HashSet<>();

			                // Fetch all admins from AddUser table
			                List<AddUser> adminUsers = adduserrepository.findAll();
			                for (AddUser admin : adminUsers) {
			                    notiUserSet.add(admin.getEmail());
			                }
			                notificationservice.CommoncreateNotificationAdmin(notifyId, new ArrayList<>(notiUserSet));
			            }

			            return ResponseEntity.ok(details);
			        } else {
			            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
			        }
			    } catch (Exception e) {
			        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
			    }
			}
	
	@GetMapping("/GetAllPlans")
    public ResponseEntity<List<PlanDetails>> getAllPlanDetails() {
        List<PlanDetails> getPlan = planrepository.findAll();
        return new ResponseEntity<>(getPlan, HttpStatus.OK);
    }
	
	@GetMapping("/GetPlanById/{id}")
    public ResponseEntity<PlanDetails> getPlanById(@PathVariable Long id) {
        Optional<PlanDetails> planOptional = planrepository.findById(id);
        
        if (planOptional.isPresent()) {
            return ResponseEntity.ok(planOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
	
	@DeleteMapping("/DeletePlan/{planId}")
	public ResponseEntity<?> deletePlan(@PathVariable Long planId, @RequestHeader("Authorization") String token) {
	    try {
	        // Validate JWT token
	        if (!jwtUtil.validateToken(token)) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
	        }

	        // Extract username from token
	        String email = jwtUtil.getUsernameFromToken(token);
	        Optional<AddUser> optionalUser = adduserrepository.findByUsername(email);

	        if (optionalUser.isPresent()) {
	            AddUser user = optionalUser.get();
	            String username = user.getUsername();

	            // Fetch plan details before deletion
	            Optional<PlanDetails> optionalPlan = planrepository.findById(planId);
	            if (optionalPlan.isEmpty()) {
	                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Plan not found"));
	            }
	            PlanDetails plan = optionalPlan.get();
	            String name = plan.getPlanname();

	            
	            // Delete the plan
	            planrepository.deleteById(planId);

	            // Create notification if plan is deleted
	            String heading = name + " Plan Deleted!";
	            Long notifyId = notificationservice.createNotification(username, email, heading);

	            if (notifyId != null) {
	                // Notify all admins
	                Set<String> notiUserSet = new HashSet<>();
	                List<AddUser> adminUsers = adduserrepository.findAll();
	                for (AddUser admin : adminUsers) {
	                    notiUserSet.add(admin.getEmail());
	                }
	                notificationservice.CommoncreateNotificationAdmin(notifyId, new ArrayList<>(notiUserSet));
	            }

	            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	        } else {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not authorized"));
	        }
	    } catch (Exception e) {
	        // Log the exception for debugging
	        e.printStackTrace();
	        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

	
	@PatchMapping("/editPlans/{planId}")
    public ResponseEntity<String> editplans(@PathVariable Long planId, @RequestBody PlanDetails updatedPlanDetails,@RequestHeader("Authorization") String token) {
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
            // Retrieve existing plan data from the repository
            PlanDetails existingplan = planrepository.findById(planId)
                    .orElseThrow(() -> new RuntimeException("Plan not found"));
            
            String plan = existingplan.getPlanname();

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
            
            String newplan = existingplan.getPlanname();
            


            planrepository.save(existingplan);
            
            String heading = newplan + " plan upadted ";
 	        Long notifyId = notificationservice.createNotification(username, email, heading);
             if (notifyId != null) {
                 Set<String> notiUserSet = new HashSet<>();
                 // Fetch all admins from AddUser table
                 List<AddUser> adminUsers = adduserrepository.findAll();
                 for (AddUser admin : adminUsers) {
                     notiUserSet.add(admin.getEmail());
                 }
                 notificationservice.CommoncreateNotificationAdmin(notifyId, new ArrayList<>(notiUserSet));
             }

            return new ResponseEntity<>("Plan details updated successfully", HttpStatus.OK);
        } catch (RuntimeException e) {
            
            return new ResponseEntity<>("Plan not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            
            return new ResponseEntity<>("Error updating plan details", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

	}
	

	


