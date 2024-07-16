package com.VsmarEngine.MediaJungle.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.VsmarEngine.MediaJungle.model.VideoDescription;

@Repository
public interface AddVideoDescriptionRepository extends JpaRepository<VideoDescription,Long> {

}