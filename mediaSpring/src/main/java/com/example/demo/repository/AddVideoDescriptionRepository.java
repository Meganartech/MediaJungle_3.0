package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.VideoDescription;

@Repository
public interface AddVideoDescriptionRepository extends JpaRepository<VideoDescription,Long> {

}