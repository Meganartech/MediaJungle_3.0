package com.VsmartEngine.MediaJungle.videoContainer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VideoContainerRepository extends JpaRepository<VideoContainer,Long>{

}
