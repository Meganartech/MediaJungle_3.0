package com.VsmartEngine.MediaJungle.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.VsmartEngine.MediaJungle.model.AddNewCategories;
import com.VsmartEngine.MediaJungle.model.AudioCategories;

public interface AudioCategoriesRepository extends JpaRepository<AudioCategories, Long> {
	
	
	 @Query("SELECT Categories_id  FROM AudioCategories a WHERE audio_id.id = :audio_id")
	    List<AddNewCategories> findByCategorie_Id(@Param("audio_id") long audio_id);

}
