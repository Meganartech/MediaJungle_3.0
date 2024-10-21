package com.VsmartEngine.MediaJungle.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.VsmartEngine.MediaJungle.model.MovieName;

public interface MovieNameRepository {

	@Repository
	public interface AddAudiodescription extends JpaRepository<MovieName, Long>{
		
		

	}
}
