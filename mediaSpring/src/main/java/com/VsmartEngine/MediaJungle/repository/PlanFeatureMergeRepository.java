package com.VsmartEngine.MediaJungle.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.VsmartEngine.MediaJungle.model.PlanFeatureMerge;
@Repository
public interface PlanFeatureMergeRepository extends JpaRepository<PlanFeatureMerge,Long>{

}
