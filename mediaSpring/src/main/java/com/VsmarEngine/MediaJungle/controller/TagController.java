package com.VsmarEngine.MediaJungle.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import com.VsmarEngine.MediaJungle.model.Tag;
import com.VsmarEngine.MediaJungle.repository.TagRepository;


@Controller
public class TagController {
	
	@Autowired
	private TagRepository tagrepository;

	
	public ResponseEntity<?> posttag(@RequestBody Tag data) {
		tagrepository.save(data);
		return ResponseEntity.ok("success");
	}
	

	public ResponseEntity<List<Tag>> getAllTag() {
	    List<Tag> tag = tagrepository.findAll();
	    return new ResponseEntity<>(tag, HttpStatus.OK);
	}
	

	public ResponseEntity<Tag> getTagById(@PathVariable Long tagId) {
	    Optional<Tag> tagOptional = tagrepository.findById(tagId);
	    if (tagOptional.isPresent()) {
	    	Tag tag = tagOptional.get();
	        return new ResponseEntity<>(tag, HttpStatus.OK);
	    } else {
	        return ResponseEntity.notFound().build();
	    }
	}
	
		

    public ResponseEntity<Void> deleteTag(@PathVariable Long tagId) {
        try {
            // Assuming you have a method to delete a category by ID in your repository
        	tagrepository.deleteById(tagId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
	

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
