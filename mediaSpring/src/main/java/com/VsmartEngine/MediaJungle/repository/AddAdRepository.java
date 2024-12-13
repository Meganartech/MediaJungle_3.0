package com.VsmartEngine.MediaJungle.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.VsmartEngine.MediaJungle.model.AddAd;

@Repository
public interface AddAdRepository extends JpaRepository<AddAd, Long> {
}
