package com.VsmartEngine.MediaJungle.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.VsmartEngine.MediaJungle.model.Seosettings;

@Repository
public interface SeosettingsRepository extends JpaRepository<Seosettings, Long> {

}