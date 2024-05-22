package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Paymentsettings;

@Repository
public interface PaymentsettingRepository extends JpaRepository<Paymentsettings, Long> {

}


