package com.VsmartEngine.MediaJungle.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

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

import com.VsmartEngine.MediaJungle.model.AddUser;
import com.VsmartEngine.MediaJungle.model.License;
import com.VsmartEngine.MediaJungle.model.UserListWithStatus;
import com.VsmartEngine.MediaJungle.notification.service.NotificationService;
import com.VsmartEngine.MediaJungle.repository.AddUserRepository;
import com.VsmartEngine.MediaJungle.repository.licenseRepository;
import com.VsmartEngine.MediaJungle.userregister.JwtUtil;
import com.VsmartEngine.MediaJungle.userregister.TokenBlacklist;
import com.VsmartEngine.MediaJungle.userregister.UserRegister;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@CrossOrigin()
@RestController
@RequestMapping("/api/v2/")
public class AddUserController {

	@Autowired
	private AddUserRepository adduserrepository;
	
    @Autowired
    private licenseRepository licenseRepository;
    
    @Autowired
    private JwtUtil jwtUtil; // Autowire JwtUtil
    
    @Autowired
    private TokenBlacklist tokenBlacklist;
    
    @Autowired
    private NotificationService notificationservice;
	
//	@PostMapping("/AddUser")
//	public ResponseEntity<String> AddUser(@RequestHeader("Authorization") String token,@RequestBody AddUser data) {
//		 try {
//		        if (!jwtUtil.validateToken(token)) {
//		            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
//		        }
//
//		        String email = jwtUtil.getUsernameFromToken(token);
//		        System.out.println("email: " + email);
//		        Optional<AddUser> opUser = adduserrepository.findByUsername(email);
//
//		        if (opUser.isPresent()) {
//		            AddUser user = opUser.get();
//		            String username = user.getUsername();
//                    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//                    String hashedPassword = passwordEncoder.encode(data.getPassword());
//                    data.setPassword(hashedPassword);
//                    BCryptPasswordEncoder passEncoder = new BCryptPasswordEncoder();
//                    String hashedPass = passwordEncoder.encode(data.getConfirmPassword());
//                    data.setConfirmPassword(hashedPass);
//
//			        AddUser adduser = adduserrepository.save(data);
//			        // Assuming you need to create a notification for a new category
//		            Long adduserId = adduser.getId();
//		            String userName = adduser.getUsername(); // Adjust as needed
//		            String heading = "New SubAdmin Added!";
//
//		            // Create notification
//		            Long notifyId = notificationservice.createNotification(username, email, heading);
//		            if (notifyId != null) {
//		                Set<String> notiUserSet = new HashSet<>();
//		                // Fetch all admins from AddUser table
//		                List<AddUser> adminUsers = adduserrepository.findAll();
//		                for (AddUser admin : adminUsers) {
//		                    notiUserSet.add(admin.getEmail());
//		                }
//		                notificationservice.CommoncreateNotificationAdmin(notifyId, new ArrayList<>(notiUserSet));
//		            }
//
//		            return ResponseEntity.status(HttpStatus.CREATED).body("success");
//		        } else {
//		            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
//		        }
//		    } catch (Exception e) {
//		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
//		    }
//		}
	
    @PostMapping("/AddUser")
	public String AddUser(@RequestBody AddUser data) {
		try {
            // Example: Encrypting password before saving (if AddUser has a password field)
             BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
             String hashedPassword = passwordEncoder.encode(data.getPassword());
             data.setPassword(hashedPassword);
             BCryptPasswordEncoder passwordEnc = new BCryptPasswordEncoder();
             String hashedPass = passwordEncoder.encode(data.getConfirmPassword());
             data.setConfirmPassword(hashedPass);
             

			adduserrepository.save(data);
			return "success";
        } catch (Exception e) {
            return "failure";
        }
    }

	
	
//	@PostMapping("/login/admin")
//	public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
//	    try {
//	        String username = loginRequest.get("username");
//	        String password = loginRequest.get("password");
//	        Optional<AddUser> userOptional = adduserrepository.findByUsername(username);
//	        if (userOptional.isEmpty()) {
//	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
//	        }
//	        AddUser user = userOptional.get();
//	        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//	        if (!passwordEncoder.matches(password, user.getPassword())) {
//	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password");
//	        }
//	        // Here you can generate a JWT token or session management logic
//	        // Example: String token = jwtTokenUtil.generateToken(user);
//	        
//	        return ResponseEntity.ok("Login successful");
//	    } catch (Exception e) {
//	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during login");
//	    }
//	}
	
	
	@PostMapping("/login/admin")
	public ResponseEntity<?> loginadmin(@RequestBody Map<String, String> loginRequest) {
	    try {
	        String username = loginRequest.get("username");
	        String password = loginRequest.get("password");
	        Optional<AddUser> userOptional = adduserrepository.findByUsername(username);

	        if (userOptional.isEmpty()) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
	        }

	        AddUser user = userOptional.get();
	        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	        if (!passwordEncoder.matches(password, user.getPassword())) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password");
	        }

	        String jwtToken = jwtUtil.generateToken(username); // Use jwtUtil
	        Map<String, Object> responseBody = new HashMap<>();
	        responseBody.put("Token", jwtToken);
	        responseBody.put("message", "Login successful");
	        responseBody.put("UserName", user.getUsername());
	        responseBody.put("Email", user.getEmail());
	        responseBody.put("AdminId", user.getId());

	        // Logging user information
	        System.out.println("Username: " + user.getUsername());
	        System.out.println("JWT Token: " + jwtToken);
	        System.out.println("User ID: " + user.getId());
	        System.out.println("Email: " + user.getEmail());

	        // Successful login
	        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
	    } catch (Exception e) {
	        // Log the exception for further investigation if needed
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during login");
	    }
	}
	
	@PostMapping("/logout/admin")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        // Extract the token from the Authorization header
        // Check if the token is valid (e.g., not expired)
        // Blacklist the token to invalidate it
        tokenBlacklist.blacklistToken(token);
        System.out.println("Logged out successfully");
        // Respond with a success message
        return ResponseEntity.ok().body("Logged out successfully");
    }


		
//		adduserrepository.save(data);
//		return "success";
//	}
	
//	@GetMapping("/GetAllUser")
//	public ResponseEntity<UserListWithStatus> getAllUser() {
//	    List<AddUser> getUser = adduserrepository.findAll();
//	    String name=getUser.getUsername();
//	    Iterable<License> licenseIterable = licenseRepository.findAll();
//    	List<License> licenseList = StreamSupport.stream(licenseIterable.spliterator(), false)
//    	                                         .collect(Collectors.toList());
//	    boolean isEmpty = licenseList.isEmpty();
//	    boolean valid =this.getall();
//	   
//	    
//	    UserListWithStatus userListWithStatus = new UserListWithStatus(getUser, isEmpty, valid);
//	   
//	    return new ResponseEntity<>(userListWithStatus,HttpStatus.OK);
//	}
//	
//	 public boolean getall(){
//	    	
//	    	Iterable<License> licenseIterable = licenseRepository.findAll();
//	    	List<License> licenseList = StreamSupport.stream(licenseIterable.spliterator(), false)
//	    	                                         .collect(Collectors.toList());
//	    	LocalDate currentDate = LocalDate.now();
//            java.util.Date Datecurrent = java.sql.Date.valueOf(currentDate);
//            long milliseconds = Datecurrent.getTime(); // Get the time in milliseconds
//            java.sql.Timestamp timestamp = new java.sql.Timestamp(milliseconds);
//	    	for (License license : licenseList) {
//	    		 System.out.println("---------------------------------------------------");
//	    	    System.out.println("ID: " + license.getId());
//	    	    System.out.println("Company Name: " + license.getCompany_name());
//	    	    System.out.println("Product Name: " + license.getProduct_name());
//	    	    System.out.println("key " + license.getKey());
//	    	    System.out.println("start_date: " + license.getStart_date());
//	    	    System.out.println("end_date: " + license.getEnd_date());
////	            java.util.Date licenseStartDateUtil = java.sql.Date.valueOf(license.getStart_date().toLocaleString());
//	    	    System.out.println(" start date :"+license.getStart_date()+" present date :"+Datecurrent+" is equal"+license.getEnd_date().equals(timestamp));
//	    	    // Print other fields as needed
//	    	}
//	    	 boolean valid = false; // Initialize valid to false
//	    	
//	    	 System.out.println("out of the loop"+valid);
//	    	    for (License license : licenseList) {
//	    	        // Check the validity condition
//	    	        if (license.getEnd_date().equals(timestamp)) {
////	    -------------------------------------testarea-----------------------------
////	    	        	  if (license.getStart_date().equals(timestamp)) {  
//	    	        	
//	    	            valid =  false; // Set valid to true if at least one license is valid
//	    	            System.out.println("inside of the loop"+valid);
//	    	            break; // No need to continue checking, we already found a valid license
//	    	        }
//	    	        else
//	    	        {
//	    	        	valid=true;
//	    	        	 System.out.println("inside of the loop"+valid);
//	    	        }
//	    	    }
//
////	    	  List<Addaudio1> allAudio = audiorepository.findAll();
//	    	
//	    	return valid;
//	    }
	
//	@GetMapping("/GetAllUser")
//	public ResponseEntity<UserListWithStatus> getAllUser() {
//	    // Retrieve all users
//	    List<AddUser> getUsers = adduserrepository.findAll();
//	    
//	    // Extract usernames from the list of users
//	    List<String> usernames = getUsers.stream()
//	                                    .map(AddUser::getUsername)
//	                                    .collect(Collectors.toList());
//	    
//	    // Retrieve all licenses
//	    Iterable<License> licenseIterable = licenseRepository.findAll();
//	    List<License> licenseList = StreamSupport.stream(licenseIterable.spliterator(), false)
//	                                             .collect(Collectors.toList());
//	    
//	    // Check if the license list is empty
//	    boolean isEmpty = licenseList.isEmpty();
//	    
//	    // Check license validity
//	    boolean valid = this.getall();
//	    
//	    // Create UserListWithStatus object
////	    UserListWithStatus userListWithStatus = new UserListWithStatus(usernames, isEmpty, valid);
//	    UserListWithStatus userListWithStatus = new UserListWithStatus(getUsers, isEmpty, valid);
//	    
//	    // Return response entity
//	    return new ResponseEntity<>(userListWithStatus, HttpStatus.OK);
//	}

	public boolean getall() {
	    // Retrieve all licenses
	    Iterable<License> licenseIterable = licenseRepository.findAll();
	    List<License> licenseList = StreamSupport.stream(licenseIterable.spliterator(), false)
	                                             .collect(Collectors.toList());
	    
	    // Get current date
	    LocalDate currentDate = LocalDate.now();
	    java.util.Date Datecurrent = java.sql.Date.valueOf(currentDate);
	    long milliseconds = Datecurrent.getTime(); // Get the time in milliseconds
	    java.sql.Timestamp timestamp = new java.sql.Timestamp(milliseconds);
	    
	    // Iterate over licenses
	    for (License license : licenseList) {
	        System.out.println("---------------------------------------------------");
	        System.out.println("ID: " + license.getId());
	        System.out.println("Company Name: " + license.getCompany_name());
	        System.out.println("Product Name: " + license.getProduct_name());
	        System.out.println("Key: " + license.getKey());
	        System.out.println("Start Date: " + license.getStart_date());
	        System.out.println("End Date: " + license.getEnd_date());
	        System.out.println("Is End Date Equal to Current Date: " + license.getEnd_date().equals(timestamp));
	        // Print other fields as needed
	    }
	    
	    boolean valid = false; // Initialize valid to false
	    
	    System.out.println("out of the loop" + valid);
	    
	    // Check license validity
	    for (License license : licenseList) {
	        // Check the validity condition
	        if (license.getEnd_date().equals(timestamp)) {
	            valid = false; // Set valid to false if at least one license is valid
	            System.out.println("inside of the loop" + valid);
	            break; // No need to continue checking, we already found a valid license
	        } else {
	            valid = true;
	            System.out.println("inside of the loop" + valid);
	        }
	    }
	    
	    return valid;
	}

	 
	 
	 @GetMapping("/GetUserId/{userId}")
	 public ResponseEntity<UserListWithStatus> getUser(@PathVariable Long userId) {
	     // Assuming adduserrepository is your repository for AddUser entity
	     Optional<AddUser> userOptional = adduserrepository.findById(userId);
	     if (userOptional.isPresent()) {
	         AddUser user = userOptional.get();
	         // Retrieve the user's data
	         
	         // Now you can construct the response as needed
	         // For example:
	         return new ResponseEntity<>(new UserListWithStatus(Collections.singletonList(user), false, true), HttpStatus.OK);
	     } else {
	         // User not found with the given ID
	         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	     }
	 }


	
	
	
	@DeleteMapping("/DeleteUser/{UserId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long UserId) {
        try {
            // Assuming you have a method to delete a category by ID in your repository
        	adduserrepository.deleteById(UserId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
	
	@PatchMapping("/UpdateUser/{userId}")
	public ResponseEntity<String> updateUserDetails(@PathVariable Long userId, @RequestBody AddUser updatedUserData) {
	    try {
	        // Retrieve existing user data from the repository
	        AddUser existingUser = adduserrepository.findById(userId)
	                .orElseThrow(() -> new RuntimeException("User not found"));

	        // Apply partial updates to the existing user data
	        if (updatedUserData.getUsername() != null) {
	            existingUser.setUsername(updatedUserData.getUsername());
	        }

	        // Update additional fields
	        if (updatedUserData.getEmail() != null) {
	            existingUser.setEmail(updatedUserData.getEmail());
	        }

	        
	        if (updatedUserData.getMobnum() != null) {
	            existingUser.setMobnum(updatedUserData.getMobnum());
	        }

	        if (updatedUserData.getCompname() != null) {
	            existingUser.setCompname(updatedUserData.getCompname());
	        }

	        if (updatedUserData.getPincode() != null) {
	            existingUser.setPincode(updatedUserData.getPincode());
	        }

	        if (updatedUserData.getCountry() != null) {
	            existingUser.setCountry(updatedUserData.getCountry());
	        }

	        if (updatedUserData.getPassword() != null) {
	            existingUser.setPassword(updatedUserData.getPassword());
	        }

	        if (updatedUserData.getConfirmPassword() != null) {
	            existingUser.setConfirmPassword(updatedUserData.getConfirmPassword());
	        }

	        if (updatedUserData.getAddress() != null) {
	            existingUser.setAddress(updatedUserData.getAddress());
	        }

	        // Save the updated user data back to the repository
	        adduserrepository.save(existingUser);

	        return new ResponseEntity<>("User details updated successfully", HttpStatus.OK);
	    } catch (Exception e) {
	        return new ResponseEntity<>("Error updating user details", HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}


}