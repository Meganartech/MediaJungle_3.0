package com.example.demo.controller;

import java.util.ArrayList;
import java.util.Collections;
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
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.AddNewCategories;
import com.example.demo.model.AddUser;
import com.example.demo.model.Addaudio1;
import com.example.demo.model.Paymentsettings;
import com.example.demo.model.UserListWithStatus;
import com.example.demo.notification.service.NotificationService;
import com.example.demo.repository.AddNewCategoriesRepository;
import com.example.demo.repository.AddUserRepository;
import com.example.demo.userregister.JwtUtil;

@CrossOrigin()
@RestController
@RequestMapping("/api/v2/")
public class CategoryController {
	
	@Autowired
	private AddNewCategoriesRepository addnewcategoriesrepository;
	
	@Autowired
    private NotificationService notificationservice;
	
	@Autowired
	private JwtUtil jwtUtil; // Autowire JwtUtil
	
	@Autowired
	private AddUserRepository adduserrepository;
	

	
	@PostMapping("/AddNewCategories")
	public ResponseEntity<String> createCategory(@RequestHeader("Authorization") String token, @RequestBody AddNewCategories data) {
	    try {
	        if (!jwtUtil.validateToken(token)) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
	        }

	        String email = jwtUtil.getUsernameFromToken(token);
	        System.out.println("email: " + email);
	        Optional<AddUser> opUser = adduserrepository.findByUsername(email);

	        if (opUser.isPresent()) {
	            AddUser user = opUser.get();
	            String username = user.getUsername();

	            // Save the new category
	            AddNewCategories savedCategory = addnewcategoriesrepository.save(data);

	            // Assuming you need to create a notification for a new category
	            Long categoryId = savedCategory.getId();
	            String categoryName = savedCategory.getCategories(); // Adjust as needed
	            String heading = categoryName +": New Category Added!";

	            // Create notification
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

	            return ResponseEntity.status(HttpStatus.CREATED).body("success");
	        } else {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
	        }
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
	    }
	}


	
	@GetMapping("/GetAllCategories")
	public ResponseEntity<List<AddNewCategories>> getAllCategories() {
	    List<AddNewCategories> categories = addnewcategoriesrepository.findAll();
	    return new ResponseEntity<>(categories, HttpStatus.OK);
	}
	
	@GetMapping("/GetCategoryById/{categoryId}")
	public ResponseEntity<AddNewCategories> getCategoryById(@PathVariable Long categoryId) {
	    Optional<AddNewCategories> categoryOptional = addnewcategoriesrepository.findById(categoryId);
	    if (categoryOptional.isPresent()) {
	        AddNewCategories category = categoryOptional.get();
	        return new ResponseEntity<>(category, HttpStatus.OK);
	    } else {
	        return ResponseEntity.notFound().build();
	    }
	}
	
	@DeleteMapping("/DeleteCategory/{categoryId}")
	public ResponseEntity<?> deleteCategory(@PathVariable Long categoryId, @RequestHeader("Authorization") String token) {
	    try {
	        // Validate JWT token
	        if (!jwtUtil.validateToken(token)) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
	        }

	        // Extract username from token
	        String email = jwtUtil.getUsernameFromToken(token);
	        System.out.println("email: " + email);
	        Optional<AddUser> optionalUser = adduserrepository.findByUsername(email);

	        if (optionalUser.isPresent()) {
	            AddUser user = optionalUser.get();
	            String username = user.getUsername();

	            // Fetch category details before deletion
	            Optional<AddNewCategories> optionalCategory = addnewcategoriesrepository.findById(categoryId);
	            if (optionalCategory.isEmpty()) {
	                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Category not found"));
	            }
	            AddNewCategories category = optionalCategory.get();
	            String name = category.getCategories();

	            // Delete the category by ID
	            addnewcategoriesrepository.deleteById(categoryId);

	            // Create notification if category is deleted
	            String heading = name + " Category Deleted!";
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
	            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	        } else {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not authorized"));
	        }
	    } catch (Exception e) {
	        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

	
	@PatchMapping("/editCategory/{categoryId}")
	public ResponseEntity<String> editCategories(@PathVariable Long categoryId, @RequestBody AddNewCategories editCategory,@RequestHeader("Authorization") String token) {
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

		        // Retrieve existing user data from the repository
		        AddNewCategories existingCategory = addnewcategoriesrepository.findById(categoryId)
		                .orElseThrow(() -> new RuntimeException("Category not found"));
		        
		        String category =  existingCategory.getCategories();

		        // Apply partial updates to the existing user data
		        if (editCategory.getCategories() != null) {
		        	existingCategory.setCategories(editCategory.getCategories());
		        }
		        String newcategory = existingCategory.getCategories();
		     // Save the updated user data back to the repository
		        AddNewCategories details = addnewcategoriesrepository.save(existingCategory);
		        // Create notification for the user who updated the setting
	 	        String heading = category +" category upadted to " + newcategory;
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


		        return new ResponseEntity<>("Category details updated successfully", HttpStatus.OK);
		   }
		   catch (Exception e) {
		        return new ResponseEntity<>("Error updating Category details", HttpStatus.INTERNAL_SERVER_ERROR);
		    }
	}
		   

}
