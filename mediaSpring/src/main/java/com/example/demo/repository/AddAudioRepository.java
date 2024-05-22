package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Addaudio1;

@Repository
public interface AddAudioRepository extends JpaRepository<Addaudio1, Long>{
	
	

}
