package com.VsmartEngine.MediaJungle.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.VsmartEngine.MediaJungle.model.FooterSettings;

public interface FooterSettingsRepository extends JpaRepository<FooterSettings, Long> {
	
	   @Query(value = "SELECT * FROM footer_settings LIMIT 1", nativeQuery = true)
	    FooterSettings findFirstFooterSettings();
}
