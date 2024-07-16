package com.VsmarEngine.MediaJungle.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.VsmarEngine.MediaJungle.model.Paymentsettings;

@Repository
public interface PaymentsettingRepository extends JpaRepository<Paymentsettings, Long> {

}


