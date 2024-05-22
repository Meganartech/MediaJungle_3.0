package com.example.demo.userregister;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;




@Repository
public interface UserRegisterRepository extends JpaRepository<UserRegister, Long>{

	@Query("SELECT u FROM UserRegister u WHERE u.email = ?1")
    UserRegister findByEmail(String email);
}
