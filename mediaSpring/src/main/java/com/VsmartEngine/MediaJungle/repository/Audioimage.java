package com.VsmartEngine.MediaJungle.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.VsmartEngine.MediaJungle.model.Audioimages;


@Repository
public interface Audioimage extends JpaRepository<Audioimages,Long>{

}


