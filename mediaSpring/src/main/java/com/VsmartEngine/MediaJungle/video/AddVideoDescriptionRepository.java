package com.VsmartEngine.MediaJungle.video;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AddVideoDescriptionRepository extends JpaRepository<VideoDescription,Long> {
	
	@Query("SELECT v FROM VideoDescription v ORDER BY v.date DESC")
    List<VideoDescription> findTop3ByOrderByDateDesc();

}