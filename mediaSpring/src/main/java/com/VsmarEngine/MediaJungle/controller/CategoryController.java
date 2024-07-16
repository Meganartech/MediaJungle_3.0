package com.VsmarEngine.MediaJungle.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import com.VsmarEngine.MediaJungle.model.AddNewCategories;
import com.VsmarEngine.MediaJungle.repository.AddNewCategoriesRepository;


@Controller
public class CategoryController {
	
	@Autowired
	private AddNewCategoriesRepository addnewcategoriesrepository;
	

	public ResponseEntity<?>  createEmployee(@RequestBody AddNewCategories data) {
		addnewcategoriesrepository.save(data);
		return ResponseEntity.ok("success");
	}
	

	public ResponseEntity<List<AddNewCategories>> getAllCategories() {
	    List<AddNewCategories> categories = addnewcategoriesrepository.findAll();
	    return new ResponseEntity<>(categories, HttpStatus.OK);
	}
	

	public ResponseEntity<AddNewCategories> getCategoryById(@PathVariable Long categoryId) {
	    Optional<AddNewCategories> categoryOptional = addnewcategoriesrepository.findById(categoryId);
	    if (categoryOptional.isPresent()) {
	        AddNewCategories category = categoryOptional.get();
	        return new ResponseEntity<>(category, HttpStatus.OK);
	    } else {
	        return ResponseEntity.notFound().build();
	    }
	}
	

    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        try {
            // Assuming you have a method to delete a category by ID in your repository
            addnewcategoriesrepository.deleteById(categoryId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
	

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
