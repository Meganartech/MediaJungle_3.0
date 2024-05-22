package com.example.demo.userregister;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;




@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v2/")
public class UserRegisterController {
    
    @Autowired
    private UserRegisterRepository userregisterrepository;
    
    @Autowired
    private JwtUtil jwtUtil; // Autowire JwtUtil

    @Autowired
    private TokenBlacklist tokenBlacklist;
    
    @PostMapping("/userregister")
    public ResponseEntity<?> registerUser(@RequestBody UserRegister user){
//    	String hashedPassword = new BCryptPasswordEncoder().encode(user.getPassword());
//        user.setPassword(hashedPassword);
        userregisterrepository.save(user);
        return ResponseEntity.ok("User registered successfully");
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
    public ResponseEntity<?> login (@RequestBody Map<String,String> loginRequest){
        
        String username = loginRequest.get("email");
        String password = loginRequest.get("password");
        
        UserRegister user = userregisterrepository.findByEmail(username);
        
        if (user == null) {
             // User with the provided username doesn't exist
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"message\": \"User not found\"}");
         }

         // Check if the password matches (you should use proper password hashing)
         if (!user.getPassword().equals(password)) {
             // Incorrect password
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"message\": \"Incorrect password\"}");
         }

         // Generate JWT token
         String jwtToken = jwtUtil.generateToken(username); // Use jwtUtil
         Map<String, Object> responseBody = new HashMap<>();
         responseBody.put("token", jwtToken);
         responseBody.put("message", "Login successful");
         String name=user.getUsername();
         String email=user.getEmail();
         String pword=user.getPassword();
         long userId = user.getId();
         responseBody.put("name", name);
         responseBody.put("email", email);
         responseBody.put("password",pword);
          
         responseBody.put("userId",userId);
        
        System.out.println(name);
        System.out.println(jwtToken);
        System.out.println(userId);
        System.out.println(email);
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
}
