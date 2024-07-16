package com.VsmarEngine.MediaJungle.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.VsmarEngine.MediaJungle.model.AddCertificate;

@Repository
public interface CertificateRepository extends JpaRepository<AddCertificate, Long>{

}
