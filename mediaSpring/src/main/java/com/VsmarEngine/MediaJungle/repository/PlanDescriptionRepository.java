package com.VsmarEngine.MediaJungle.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.VsmarEngine.MediaJungle.model.PlanDescription;

@Repository
public interface PlanDescriptionRepository extends JpaRepository<PlanDescription,Long>{
	

}
