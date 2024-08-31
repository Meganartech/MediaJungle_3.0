package com.VsmartEngine.MediaJungle.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.VsmartEngine.MediaJungle.model.AudioCastAndCrew;
import com.VsmartEngine.MediaJungle.model.CastandCrew;

@Repository
public interface AudioCastandCrewRepository extends JpaRepository<AudioCastAndCrew,Long>{
	
//	 List<AudioCastAndCrew> findByVideoDescriptionId(Long videoId);
//	 @Query("SELECT castandcrew_id  FROM AudioCastAndCrew a WHERE audio_id.id = :audio_id")
//	   Optional<String> findByCastandCrew_Id(@Param("audio_id") long audio_id);


}
