package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Videosettings;

@Repository
public interface videoSettingRepository extends JpaRepository<Videosettings, Long> {

}


