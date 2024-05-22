package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Seosettings;

@Repository
public interface SeosettingsRepository extends JpaRepository<Seosettings, Long> {

}
