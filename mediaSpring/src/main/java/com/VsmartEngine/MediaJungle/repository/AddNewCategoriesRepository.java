package com.VsmartEngine.MediaJungle.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.VsmartEngine.MediaJungle.model.AddNewCategories;

@Repository
public interface AddNewCategoriesRepository extends JpaRepository<AddNewCategories, Long>{
    
	

}
