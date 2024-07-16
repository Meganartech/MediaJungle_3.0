package com.VsmarEngine.MediaJungle.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.VsmarEngine.MediaJungle.model.Paymentsettings;
import com.VsmarEngine.MediaJungle.repository.PaymentsettingRepository;


@Controller
public class PaymentSettingController {
	
	@Autowired
	private PaymentsettingRepository paymentsettingrepository;
	

	public ResponseEntity<Paymentsettings> Addpaymentsetting (@RequestParam("razorpay_key") String razorpay_key,
			@RequestParam("razorpay_secret_key")String razorpay_secret_key){
		Paymentsettings setting = new Paymentsettings();
		setting.setRazorpay_key(razorpay_key);
		setting.setRazorpay_secret_key(razorpay_secret_key);
		Paymentsettings details = paymentsettingrepository.save(setting);
		return ResponseEntity.ok(details);
	} 
	

	public ResponseEntity<List<Paymentsettings>> getAllrazorpay() {
        List<Paymentsettings> getPlan = paymentsettingrepository.findAll();
        return new ResponseEntity<>(getPlan, HttpStatus.OK);
    }
	

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
