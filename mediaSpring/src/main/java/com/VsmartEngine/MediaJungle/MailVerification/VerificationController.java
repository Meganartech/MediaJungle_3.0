package com.VsmartEngine.MediaJungle.MailVerification;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.VsmartEngine.MediaJungle.userregister.UserRegister;
import com.VsmartEngine.MediaJungle.userregister.UserRegisterRepository;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v2/")
public class VerificationController {
	
	@Autowired
    private EmailService emailService;

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;
    
    @Autowired
    private UserRegisterRepository userregisterrepository;
    

//    // Step 1: Send Verification Code
//    @PostMapping("/send-code")
//    public ResponseEntity<String> sendCode(@RequestBody Map<String, String> request) {
//        String email = request.get("email");
//
//        // Generate a random 6-digit code
//        String code = UUID.randomUUID().toString().substring(0, 6);
//
//        // Save the code with expiry time
//        VerificationCode verificationCode = new VerificationCode();
//        verificationCode.setEmail(email);
//        verificationCode.setCode(code);
//        verificationCode.setExpiryTime(LocalDateTime.now().plusMinutes(10)); // Expires in 10 minutes
//        verificationCodeRepository.save(verificationCode);
//
//        // Send the email
//        emailService.sendEmail(email, "Your Verification Code", "Verification Code: " + code);
//
//        return ResponseEntity.ok("Verification code sent.");
//    }
    
    @PostMapping("/send-code")
    public ResponseEntity<String> sendCode(@RequestParam String email) {
        // Check if the user exists by email
        Optional<UserRegister> userOptional = userregisterrepository.findByEmail(email);

        // If the user doesn't exist, return "Invalid email"
        if (!userOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email");
        }

        // Generate a random 6-digit code
        String code = UUID.randomUUID().toString().substring(0, 6);

        // Save the code with expiry time
        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setEmail(email);
        verificationCode.setCode(code);
        verificationCode.setExpiryTime(LocalDateTime.now().plusMinutes(10)); // Expires in 10 minutes
        verificationCodeRepository.save(verificationCode);

        // Send the email
        emailService.sendEmail(email, "Your Verification Code", "Verification Code: " + code);

        return ResponseEntity.ok("Verification code sent to your email.");
    }


    @PostMapping("/verify-code")
    public ResponseEntity<String> verifyCode(@RequestParam String email, @RequestParam String code) {
        
        // Fetch the latest verification code for the given email
        VerificationCode verificationCode = verificationCodeRepository.findLatestByEmail(email);

        // If no code exists or the code doesn't match, return an error
        if (verificationCode == null || !verificationCode.getCode().equals(code)) {
            return ResponseEntity.badRequest().body("Invalid verification code.");
        }

        // Check if the code has expired
        if (verificationCode.getExpiryTime().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Verification code expired.");
        }

        return ResponseEntity.ok("Code verified.");
    }


}
