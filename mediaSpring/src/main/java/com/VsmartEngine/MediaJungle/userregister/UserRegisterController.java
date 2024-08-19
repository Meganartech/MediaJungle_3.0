package com.VsmartEngine.MediaJungle.userregister;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.VsmartEngine.MediaJungle.compresser.ImageUtils;
import com.VsmartEngine.MediaJungle.notification.service.NotificationService;

import jakarta.transaction.Transactional;

@CrossOrigin()
@RestController
@RequestMapping("/api/v2/")
public class UserRegisterController {
    
    @Autowired
    private UserRegisterRepository userregisterrepository;
    
    @Autowired
    private JwtUtil jwtUtil; // Autowire JwtUtil

    @Autowired
    private TokenBlacklist tokenBlacklist;
    
	@Autowired
    private NotificationService notificationservice;
        

	public ResponseEntity<UserRegister> register(@RequestParam("username") String username,
			            @RequestParam("email") String email,
			            @RequestParam("password") String password,
			            @RequestParam("mobnum") String mobnum,
			            @RequestParam("confirmPassword") String confirmPassword,
			            @RequestParam(value = "profile", required = false) MultipartFile profile) throws IOException {
			if (!password.equals(confirmPassword)) {
			return ResponseEntity.badRequest().body(null);
			}
			BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		    String encodedPassword = passwordEncoder.encode(password);
		    String encodedconfirmPassword = passwordEncoder.encode(confirmPassword);
			
			UserRegister newRegister = new UserRegister();
			newRegister.setUsername(username);
			newRegister.setEmail(email);
			newRegister.setPassword(encodedPassword);
			newRegister.setConfirmPassword(encodedconfirmPassword);
			newRegister.setMobnum(mobnum);
			newRegister.setRole("USER");
			
			if (profile != null && !profile.isEmpty()) {
			byte[] thumbnailBytes = ImageUtils.compressImage(profile.getBytes());
			newRegister.setProfile(thumbnailBytes);
			}
			
			UserRegister savedUser = userregisterrepository.save(newRegister);
			return ResponseEntity.ok(savedUser);
			}

    

    public ResponseEntity<List<UserRegister>> getAllUser() {
        List<UserRegister> getUser = userregisterrepository.findAll();
        return new ResponseEntity<>(getUser, HttpStatus.OK);
    }
     

    public ResponseEntity<UserRegister> getUserById(@PathVariable Long id) {
        Optional<UserRegister> userOptional = userregisterrepository.findById(id);
        if (userOptional.isPresent()) {
            UserRegister user = userOptional.get();
            // Check if the profile is present (not null and not empty)
            if (user.getProfile() != null && user.getProfile().length > 0) {
                byte[] images = ImageUtils.decompressImage(user.getProfile());
                user.setProfile(images);
            }
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
  
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        Optional<UserRegister> userOptional = userregisterrepository.findByEmail(email);
        if (!userOptional.isPresent()) {
            // User with the provided email doesn't exist
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\": \"User not found\"}");
        }
        UserRegister user = userOptional.get();
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            // Incorrect password
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"Incorrect password\"}");
        }
        // Generate JWT token
        String role = user.getRole(); // Get user role
        String jwtToken = jwtUtil.generateToken(email,role);
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("token", jwtToken);
        responseBody.put("message", "Login successful");
        responseBody.put("name", user.getUsername());
        responseBody.put("email", user.getEmail());
        responseBody.put("userId", user.getId());
//        responseBody.put("profile", null); // Simply set image as null without loading it

        // Check if the user has an expiry date for subscription
        if (user.getPaymentId() != null && user.getPaymentId().getExpiryDate() != null) {
            LocalDate expdate = user.getPaymentId().getExpiryDate();
            LocalDate today = LocalDate.now();
            String plan = user.getPaymentId().getSubscriptionTitle();
            
            if (expdate.minusDays(1).equals(today)) {
                // Create notification and associate with user
                String heading = user.getUsername() + ", your " + plan + " subscription validity expires on " + expdate;
                try {
                    Long notifyId = notificationservice.createNotification(user.getUsername(), user.getEmail(), heading);
                    if (notifyId != null) {
                        notificationservice.notificationuser(notifyId, user.getId());
                    } else {
                        // Handle notification creation failure
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\": \"Failed to create notification\"}");
                    }
                } catch (Exception e) {
                    // Handle any exceptions during notification creation
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"message\": \"Error creating notification\"}");
                }
            }
        }
        // Successful login
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        // Extract the token from the Authorization header
        // Check if the token is valid (e.g., not expired)
        // Blacklist the token to invalidate it
        tokenBlacklist.blacklistToken(token);
        System.out.println("Logged out successfully");
        // Respond with a success message
        return ResponseEntity.ok().body("Logged out successfully");
    }
    
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> loginRequest) {
        try {
            // Finding the user by email
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");
            String confirmPassword = loginRequest.get("confirmPassword");
            Optional<UserRegister> userOptional = userregisterrepository.findByEmail(email);

            // If the user doesn't exist, return 404 Not Found
            if (!userOptional.isPresent()) {
                System.out.println("User not found: " + email);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            UserRegister user = userOptional.get();

            // If passwords do not match, return 400 Bad Request
            if (!password.equals(confirmPassword)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Passwords do not match");
            }

            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String encodedPassword = passwordEncoder.encode(password);

            // Update the user password
            user.setPassword(encodedPassword);
            user.setConfirmPassword(encodedPassword); // You don't need a separate field for confirmPassword in the database

            // Save the updated user
            UserRegister savedUser = userregisterrepository.save(user);
            Long userId = savedUser.getId();
            String name = savedUser.getUsername();
            String heading = name + " successfully changed your password";

            // Create notification and associate with user
            Long notifyId = notificationservice.createNotification(name, email, heading);
            
            if (notifyId != null) {
                notificationservice.notificationuser(notifyId, userId);
            }

            return ResponseEntity.ok("Password reset successfully");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }
    
    
   

}

