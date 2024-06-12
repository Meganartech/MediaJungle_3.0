package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.PlanDetails;

@Repository
public interface PlanDetailsRepository extends JpaRepository<PlanDetails,Long>{
	

}
