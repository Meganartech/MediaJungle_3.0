package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.PlanDescription;

@Repository
public interface PlanDescriptionRepository extends JpaRepository<PlanDescription,Long>{
	

}
