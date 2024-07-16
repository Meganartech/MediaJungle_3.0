package com.VsmarEngine.MediaJungle.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.VsmarEngine.MediaJungle.model.Socialsettings;

@Repository
public interface SocialsettingRepository extends JpaRepository<Socialsettings, Long> {

}


