package com.VsmartEngine.MediaJungle.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.VsmartEngine.MediaJungle.model.AudioTags;

public interface AudioTagRepository extends JpaRepository<AudioTags, Long> {

}
