package com.VsmartEngine.MediaJungle.video;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.VsmartEngine.MediaJungle.userregister.UserRegister;

@Repository
public interface VideoImageRepository extends JpaRepository<VideoImage,Long>{
	
//	@Query("SELECT u.videoThumbnail FROM VideoImage u WHERE u.videoId = ?1")
//	Optional<byte[]> findVideoThumbnailByVideoId(long videoId);

	@Query("SELECT u.videoThumbnail FROM VideoImage u WHERE u.videoId = ?1")
	Optional<byte[]> findVideoThumbnailByVideoId(long videoId);


}
