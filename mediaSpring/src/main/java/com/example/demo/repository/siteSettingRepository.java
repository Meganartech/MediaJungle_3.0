package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Sitesetting;

@Repository
public interface siteSettingRepository extends JpaRepository<Sitesetting, Long> {

}


