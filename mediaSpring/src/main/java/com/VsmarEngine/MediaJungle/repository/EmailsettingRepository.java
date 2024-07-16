package com.VsmarEngine.MediaJungle.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.VsmarEngine.MediaJungle.model.Emailsettings;

@Repository
public interface EmailsettingRepository extends JpaRepository<Emailsettings, Long> {

}


