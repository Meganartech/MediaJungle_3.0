package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.VideoCastAndCrew;

@Repository
public interface VideoCastandCrewRepository extends JpaRepository<VideoCastAndCrew,Long>{
	
	 List<VideoCastAndCrew> findByVideoDescriptionId(Long videoId);

}
