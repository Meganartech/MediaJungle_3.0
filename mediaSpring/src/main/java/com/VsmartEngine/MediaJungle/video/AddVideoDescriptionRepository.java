package com.VsmartEngine.MediaJungle.video;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddVideoDescriptionRepository extends JpaRepository<VideoDescription,Long> {

}