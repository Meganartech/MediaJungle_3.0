package com.VsmarEngine.MediaJungle.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.VsmarEngine.MediaJungle.model.Addaudio1;

@Repository
public interface AddAudioRepository extends JpaRepository<Addaudio1, Long>{
	
	

}
