package com.VsmartEngine.MediaJungle.video;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AddVideoDescriptionRepository extends JpaRepository<VideoDescription,Long> {
	
//	@Query("SELECT vd.id FROM VideoDescription vd WHERE :categoryId IN (vd.categorylist)")
//	List<Long> findVideoIdsByCategory(@Param("categoryId") Long categoryId);


//	@Query("SELECT vd.id FROM VideoDescription vd WHERE :categoryId MEMBER OF vd.categorylist")
//	List<Long> findVideoIdsByCategory(@Param("categoryId") Long categoryId);
	
//	@Query("SELECT vd.id, vi.videoThumbnail FROM VideoDescription vd JOIN VideoImage vi ON vd.id = vi.videoId WHERE :categoryId MEMBER OF vd.categorylist")
//	List<Object[]> findVideoIdsAndThumbnailsByCategory(@Param("categoryId") Long categoryId);



}