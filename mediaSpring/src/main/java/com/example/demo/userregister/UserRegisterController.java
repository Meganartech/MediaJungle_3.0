package com.example.demo.userregister;

import java.io.IOException;
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

import com.example.demo.compresser.ImageUtils;

import jakarta.transaction.Transactional;

@CrossOrigin()
@RestController
@RequestMapping("/api/v2/")
public class UserRegisterController {
    
    @Autowired
    private UserRegisterRepository userregisterrepository;
    
//    @Autowired
//    private PasswordEncoder passwordEncoder;

    
    @Autowired
    private JwtUtil jwtUtil; // Autowire JwtUtil

    @Autowired
    private TokenBlacklist tokenBlacklist;
        
    @PostMapping("/userregister")
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
			
			UserRegister newRegister = new UserRegister();
			newRegister.setUsername(username);
			newRegister.setEmail(email);
			newRegister.setPassword(encodedPassword);
			newRegister.setConfirmPassword(confirmPassword);
			newRegister.setMobnum(mobnum);
			
			if (profile != null && !profile.isEmpty()) {
			byte[] thumbnailBytes = ImageUtils.compressImage(profile.getBytes());
			newRegister.setProfile(thumbnailBytes);
			}
			
			UserRegister savedUser = userregisterrepository.save(newRegister);
			return ResponseEntity.ok(savedUser);
			}

    
    @GetMapping("/GetAllUsers")
    public ResponseEntity<List<UserRegister>> getAllUser() {
        List<UserRegister> getUser = userregisterrepository.findAll();
        return new ResponseEntity<>(getUser, HttpStatus.OK);
    }
     
    @GetMapping("/GetUserById/{id}")
    public ResponseEntity<UserRegister> getUserById(@PathVariable Long id) {
        Optional<UserRegister> userOptional = userregisterrepository.findById(id);
        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
  
 
    @PostMapping("/login")
    @Transactional
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
        String jwtToken = jwtUtil.generateToken(email); // Use jwtUtil
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("token", jwtToken);
        responseBody.put("message", "Login successful");
        String name=user.getUsername();
      String Email=user.getEmail();
      String pword=user.getPassword();
      long userId = user.getId();
        responseBody.put("name", user.getUsername());
        responseBody.put("email", user.getEmail());
        responseBody.put("password", user.getPassword()); // Consider removing password from the response for security reasons
        responseBody.put("userId", user.getId());
        
        System.out.println(name);
      System.out.println(jwtToken);
      System.out.println(userId);
      System.out.println(Email);
      System.out.println(pword);
        
        // Successful login
        return ResponseEntity.status(HttpStatus.OK).body(responseBody);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        // Extract the token from the Authorization header
        // Check if the token is valid (e.g., not expired)
        // Blacklist the token to invalidate it
        tokenBlacklist.blacklistToken(token);
        System.out.println("Logged out successfully");
        // Respond with a success message
        return ResponseEntity.ok().body("Logged out successfully");
    }
    
//    @PostMapping("/forgetPassword")
//    public ResponseEntity<?> forgetPassword( String email) {
//        // Finding the user by email
//        Optional<UserRegister> userOptional = userregisterrepository.findByEmail(email);
//
//        // If the user doesn't exist, return 404 Not Found
//        if (userOptional.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        } else {
//            // If the user exists, return 200 OK
//            return ResponseEntity.ok().build();
//        }
//    }

    @PostMapping("/forgetPassword")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> loginRequest) {
        // Finding the user by email
    	
    	String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        String confirmpassword = loginRequest.get("confirmPassword");
        Optional<UserRegister> userOptional = userregisterrepository.findByEmail(email);

        // If the user doesn't exist, return 404 Not Found
        if (!userOptional.isPresent()) {
            System.out.println("User not found: " + email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        UserRegister user = userOptional.get();

        // If passwords do not match, return 400 Bad Request
        if (!password.equals(confirmpassword)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Passwords do not match");
        }

        // Assuming you have a method to hash the password
        user.setPassword(password);
        user.setConfirmPassword(confirmpassword);
        // Do not set confirmPassword in the entity, it's used only for validation

        userregisterrepository.save(user);

        return ResponseEntity.ok("Password reset successfully");
    }

}
