package com.VsmartEngine.MediaJungle.test;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface testRepo extends JpaRepository<testModel,Long> {

	
	
//	 @Modifying
//	    @Transactional
//	    @Query("UPDATE testModel u SET u.name = :name, u.emailId = :email,u.mobilenumber = :mobilenumber, u.address = :address,u.coupon10 = :coupon10, u.coupon20 = :coupon20,u.referalid = :referalid WHERE u.id = :id")
//	    int updateUser(@Param("id") Long id, @Param("name") String name, @Param("email") String email,@Param("mobilenumber") String mobilenumber, @Param("address") String address, @Param("coupon10") String coupon10, @Param("coupon20") String coupon20, @Param("referalid") String referalid);
//	
}