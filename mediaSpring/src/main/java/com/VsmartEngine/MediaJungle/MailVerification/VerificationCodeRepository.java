package com.VsmartEngine.MediaJungle.MailVerification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long>{

	 VerificationCode findByEmail(String email);
	 
	 @Query(value = "SELECT * FROM verification_code WHERE email = :email ORDER BY expiry_time DESC LIMIT 1", nativeQuery = true)
	 VerificationCode findLatestByEmail(@Param("email") String email);


}