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

import com.example.demo.model.AddLanguage;
import com.example.demo.model.Tag;
import com.example.demo.repository.AddLanguageRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v2/")
public class LanguageController {
	
	@Autowired
	private AddLanguageRepository addlanguagerepository;
	
	
	@PostMapping("/AddLanguage")
	public String createEmployee(@RequestBody AddLanguage data) {
		addlanguagerepository.save(data);
		return "success";
	}
	
	@GetMapping("/GetAllLanguage")
	public ResponseEntity<List<AddLanguage>> getAllLanguage() {
	    List<AddLanguage> categories = addlanguagerepository.findAll();
	    return new ResponseEntity<>(categories, HttpStatus.OK);
	}
	
	@GetMapping("/GetLanguageById/{languageId}")
	public ResponseEntity<AddLanguage> getTagById(@PathVariable Long languageId) {
	    Optional<AddLanguage> langOptional = addlanguagerepository.findById(languageId);
	    if (langOptional.isPresent()) {
	    	AddLanguage lang = langOptional.get();
	        return new ResponseEntity<>(lang, HttpStatus.OK);
	    } else {
	        return ResponseEntity.notFound().build();
	    }
	    
	}
	
	@DeleteMapping("/DeleteLanguage/{categoryId}")
    public ResponseEntity<Void> deleteLanguage(@PathVariable Long categoryId) {
        try {
            // Assuming you have a method to delete a category by ID in your repository
        	addlanguagerepository.deleteById(categoryId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
	
	@PatchMapping("/editLanguage/{languageId}")
	public ResponseEntity<String> editLanguage(@PathVariable Long languageId, @RequestBody AddLanguage editlanguage) {
		   try {
		        // Retrieve existing user data from the repository
		        AddLanguage existingLanguage = addlanguagerepository.findById(languageId)
		                .orElseThrow(() -> new RuntimeException("Category not found"));

		        // Apply partial updates to the existing user data
		        if ( editlanguage.getLanguage() != null) {
		        	existingLanguage.setLanguage(editlanguage.getLanguage());
		        }
		     // Save the updated user data back to the repository
		        addlanguagerepository.save(existingLanguage);

		        return new ResponseEntity<>("Language details updated successfully", HttpStatus.OK);
		   }
		   catch (Exception e) {
		        return new ResponseEntity<>("Error updating Language details", HttpStatus.INTERNAL_SERVER_ERROR);
		    }
	}
	


}
