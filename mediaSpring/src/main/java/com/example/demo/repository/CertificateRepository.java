package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.AddCertificate;

@Repository
public interface CertificateRepository extends JpaRepository<AddCertificate, Long>{

}
