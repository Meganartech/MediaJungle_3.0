package com.VsmartEngine.MediaJungle.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.VsmartEngine.MediaJungle.model.Audiodescription;

@Repository
public interface AddAudiodescription extends JpaRepository<Audiodescription, Long>{
	
	

}