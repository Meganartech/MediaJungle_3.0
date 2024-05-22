package com.example.demo.controller;

import java.util.Collections;
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
import com.example.demo.model.AddUser;
import com.example.demo.model.UserListWithStatus;
import com.example.demo.repository.AddNewCategoriesRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v2/")
public class CategoryController {
	
	@Autowired
	private AddNewCategoriesRepository addnewcategoriesrepository;
	
	@PostMapping("/AddNewCategories")
	public String createEmployee(@RequestBody AddNewCategories data) {
		addnewcategoriesrepository.save(data);
		return "success";
	}
	
	@GetMapping("/GetAllCategories")
	public ResponseEntity<List<AddNewCategories>> getAllCategories() {
	    List<AddNewCategories> categories = addnewcategoriesrepository.findAll();
	    return new ResponseEntity<>(categories, HttpStatus.OK);
	}
	
	@GetMapping("/GetCategoryById/{categoryId}")
	public ResponseEntity<AddNewCategories> getCategoryById(@PathVariable Long categoryId) {
	    Optional<AddNewCategories> categoryOptional = addnewcategoriesrepository.findById(categoryId);
	    if (categoryOptional.isPresent()) {
	        AddNewCategories category = categoryOptional.get();
	        return new ResponseEntity<>(category, HttpStatus.OK);
	    } else {
	        return ResponseEntity.notFound().build();
	    }
	}
	
	@DeleteMapping("/DeleteCategory/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        try {
            // Assuming you have a method to delete a category by ID in your repository
            addnewcategoriesrepository.deleteById(categoryId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
	
	@PatchMapping("/editCategory/{categoryId}")
	public ResponseEntity<String> editCategories(@PathVariable Long categoryId, @RequestBody AddNewCategories editCategory) {
		   try {
		        // Retrieve existing user data from the repository
		        AddNewCategories existingCategory = addnewcategoriesrepository.findById(categoryId)
		                .orElseThrow(() -> new RuntimeException("Category not found"));

		        // Apply partial updates to the existing user data
		        if (editCategory.getCategories() != null) {
		        	existingCategory.setCategories(editCategory.getCategories());
		        }
		     // Save the updated user data back to the repository
		        addnewcategoriesrepository.save(existingCategory);

		        return new ResponseEntity<>("Category details updated successfully", HttpStatus.OK);
		   }
		   catch (Exception e) {
		        return new ResponseEntity<>("Error updating Category details", HttpStatus.INTERNAL_SERVER_ERROR);
		    }
	}
		   

}
