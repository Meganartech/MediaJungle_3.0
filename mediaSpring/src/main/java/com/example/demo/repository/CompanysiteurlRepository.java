package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Companysiteurl;

@Repository
public interface CompanysiteurlRepository extends JpaRepository<Companysiteurl, Long> {

}


