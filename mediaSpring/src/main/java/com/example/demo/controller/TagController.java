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

import com.example.demo.model.AddNewCategories;
import com.example.demo.model.Tag;
import com.example.demo.repository.TagRepository;

@CrossOrigin()
@RestController
@RequestMapping("/api/v2/")
public class TagController {
	
	@Autowired
	private TagRepository tagrepository;
	
	@PostMapping("/AddTag")
	public String posttag(@RequestBody Tag data) {
		tagrepository.save(data);
		return "success";
	}
	
	@GetMapping("/GetAllTag")
	public ResponseEntity<List<Tag>> getAllTag() {
	    List<Tag> tag = tagrepository.findAll();
	    return new ResponseEntity<>(tag, HttpStatus.OK);
	}
	
	@GetMapping("/GetTagById/{tagId}")
	public ResponseEntity<Tag> getTagById(@PathVariable Long tagId) {
	    Optional<Tag> tagOptional = tagrepository.findById(tagId);
	    if (tagOptional.isPresent()) {
	    	Tag tag = tagOptional.get();
	        return new ResponseEntity<>(tag, HttpStatus.OK);
	    } else {
	        return ResponseEntity.notFound().build();
	    }
	}
	
		
	@DeleteMapping("/DeleteTag/{tagId}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long tagId) {
        try {
            // Assuming you have a method to delete a category by ID in your repository
        	tagrepository.deleteById(tagId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
	
	@PatchMapping("/editTag/{tagId}")
	public ResponseEntity<String> editTag(@PathVariable Long tagId, @RequestBody Tag editTag) {
		   try {
		        // Retrieve existing user data from the repository
		        Tag existingTag = tagrepository.findById(tagId)
		                .orElseThrow(() -> new RuntimeException("Tag not found"));

		        // Apply partial updates to the existing user data
		        if (editTag.getTag() != null) {
		        	existingTag.setTag(editTag.getTag());
		        }
		     // Save the updated user data back to the repository
		        tagrepository.save(existingTag);

		        return new ResponseEntity<>("Tag details updated successfully", HttpStatus.OK);
		   }
		   
		   catch (Exception e) {
		        return new ResponseEntity<>("Error updating Tag details", HttpStatus.INTERNAL_SERVER_ERROR);
		    }
	}
		   


}
