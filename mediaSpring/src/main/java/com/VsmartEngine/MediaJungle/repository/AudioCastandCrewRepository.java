package com.VsmartEngine.MediaJungle.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.VsmartEngine.MediaJungle.model.AudioCastAndCrew;

@Repository
public interface AudioCastandCrewRepository extends JpaRepository<AudioCastAndCrew,Long>{
	
//	 List<AudioCastAndCrew> findByVideoDescriptionId(Long videoId);

}
