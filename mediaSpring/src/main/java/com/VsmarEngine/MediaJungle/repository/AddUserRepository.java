package com.VsmarEngine.MediaJungle.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.VsmarEngine.MediaJungle.model.AddUser;

public interface AddUserRepository extends JpaRepository<AddUser, Long>{
	@Query("SELECT u FROM AddUser u WHERE u.Username = ?1")
    Optional<AddUser> findByUsername(String Username);

}
