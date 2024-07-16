package com.VsmarEngine.MediaJungle.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.VsmarEngine.MediaJungle.model.Videosettings;

@Repository
public interface videoSettingRepository extends JpaRepository<Videosettings, Long> {

}


