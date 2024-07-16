package com.VsmarEngine.MediaJungle.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import com.VsmarEngine.MediaJungle.model.AddLanguage;
import com.VsmarEngine.MediaJungle.repository.AddLanguageRepository;


@Controller
public class LanguageController {
	
	@Autowired
	private AddLanguageRepository addlanguagerepository;
	
	

	public ResponseEntity<?> createEmployee(@RequestBody AddLanguage data) {
		addlanguagerepository.save(data);
		return ResponseEntity.ok("success");
	}
	

	public ResponseEntity<List<AddLanguage>> getAllLanguage() {
	    List<AddLanguage> categories = addlanguagerepository.findAll();
	    return new ResponseEntity<>(categories, HttpStatus.OK);
	}
	

	public ResponseEntity<AddLanguage> getTagById(@PathVariable Long languageId) {
	    Optional<AddLanguage> langOptional = addlanguagerepository.findById(languageId);
	    if (langOptional.isPresent()) {
	    	AddLanguage lang = langOptional.get();
	        return new ResponseEntity<>(lang, HttpStatus.OK);
	    } else {
	        return ResponseEntity.notFound().build();
	    }
	    
	}
	

    public ResponseEntity<Void> deleteLanguage(@PathVariable Long categoryId) {
        try {
            // Assuming you have a method to delete a category by ID in your repository
        	addlanguagerepository.deleteById(categoryId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
	

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
