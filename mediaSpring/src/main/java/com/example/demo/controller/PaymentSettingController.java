package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Paymentsettings;
import com.example.demo.model.PlanDetails;
import com.example.demo.repository.PaymentsettingRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v2/")
public class PaymentSettingController {
	
	@Autowired
	private PaymentsettingRepository paymentsettingrepository;
	
	@PostMapping("/AddrazorpayId")
	public ResponseEntity<Paymentsettings> Addpaymentsetting (@RequestParam("razorpay_key") String razorpay_key,
			@RequestParam("razorpay_secret_key")String razorpay_secret_key){
		Paymentsettings setting = new Paymentsettings();
		setting.setRazorpay_key(razorpay_key);
		setting.setRazorpay_secret_key(razorpay_secret_key);
		Paymentsettings details = paymentsettingrepository.save(setting);
		return ResponseEntity.ok(details);
	} 
	
 	@GetMapping("/getrazorpay")
	public ResponseEntity<List<Paymentsettings>> getAllrazorpay() {
        List<Paymentsettings> getPlan = paymentsettingrepository.findAll();
        return new ResponseEntity<>(getPlan, HttpStatus.OK);
    }
	
	@PatchMapping("/Editrazorpay/{id}")
	public ResponseEntity<String> editrazorpay(@PathVariable Long id , @RequestBody Paymentsettings updatedrazorpay){
		try {
            // Retrieve existing plan data from the repository
			Paymentsettings existingplan = paymentsettingrepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("not found"));

            // Apply partial updates to the existing plan data
            if (updatedrazorpay.getRazorpay_key() != null) {
                existingplan.setRazorpay_key(updatedrazorpay.getRazorpay_key());
            }
            
            if (updatedrazorpay.getRazorpay_secret_key()!= null) {
            	existingplan.setRazorpay_secret_key(updatedrazorpay.getRazorpay_secret_key());
            }
            
            paymentsettingrepository.save(existingplan);

            return new ResponseEntity<>(" updated successfully", HttpStatus.OK);
        } catch (RuntimeException e) {
            
            return new ResponseEntity<>("not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            
            return new ResponseEntity<>("Error when updating", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
	
}
