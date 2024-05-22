package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.AddNewCategories;

@Repository
public interface AddNewCategoriesRepository extends JpaRepository<AddNewCategories, Long>{
    
	

}
