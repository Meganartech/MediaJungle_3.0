package com.VsmarEngine.MediaJungle.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.VsmarEngine.MediaJungle.model.CastandCrew;

@Repository
public interface CastandcrewRepository extends JpaRepository<CastandCrew,Long>{

}
