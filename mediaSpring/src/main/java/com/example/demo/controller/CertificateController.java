package com.example.demo.controller;


import java.util.List;
import java.util.Optional;

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
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;



import com.example.demo.model.AddCertificate;
import com.example.demo.model.AddLanguage;
import com.example.demo.repository.CertificateRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v2/")
public class CertificateController {
	
	@Autowired
	private CertificateRepository certificaterepository ;
	
	@PostMapping("/AddCertificate")
	public String createEmployee(@RequestBody AddCertificate data) {
		certificaterepository.save(data);
		return "success";
	}
	
	@GetMapping("/GetAllCertificate")
	public ResponseEntity<List<AddCertificate>> getAllCertificate() {
	    List<AddCertificate> certificate = certificaterepository.findAll();
	    return new ResponseEntity<>(certificate, HttpStatus.OK);
	}
	
	@GetMapping("/GetCertificateById/{certificateId}")
	public ResponseEntity<AddCertificate> getTagById(@PathVariable Long certificateId) {
	    Optional<AddCertificate> certOptional = certificaterepository.findById(certificateId);
	    if (certOptional.isPresent()) {
	    	AddCertificate cert = certOptional.get();
	        return new ResponseEntity<>(cert, HttpStatus.OK);
	    } else {
	        return ResponseEntity.notFound().build();
	    }    
	}
	
	@DeleteMapping("/DeleteCertificate/{certificateId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long certificateId) {
        try {
            // Assuming you have a method to delete a category by ID in your repository
        	certificaterepository.deleteById(certificateId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
	
	@PatchMapping("/editCertificate/{certificateId}")
	public ResponseEntity<String> editCategories(@PathVariable Long certificateId, @RequestBody AddCertificate editCertificate) {
		   try {
		        // Retrieve existing user data from the repository
		        AddCertificate existingCertificate = certificaterepository.findById(certificateId)
		                .orElseThrow(() -> new RuntimeException("Certificate not found"));

		        // Apply partial updates to the existing user data
		        if (editCertificate.getCertificate() != null) {
		        	existingCertificate.setCertificate(editCertificate.getCertificate());
		        }
		     // Save the updated user data back to the repository
		        certificaterepository.save(existingCertificate);

		        return new ResponseEntity<>("Certificate details updated successfully", HttpStatus.OK);
		   }
		   catch (Exception e) {
		        return new ResponseEntity<>("Error updating Certificate details", HttpStatus.INTERNAL_SERVER_ERROR);
		    }
	}
		   
}
