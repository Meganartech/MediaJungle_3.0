package com.example.demo.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.PaymentUser;


@Repository
public interface PaymentRepository extends JpaRepository<PaymentUser,Long>{

	Optional<PaymentUser> findByOrderId(String orderId);
	Optional<PaymentUser> findByUserId(Long userId);
//	List<PaymentUser> findByUserId(Long userId);
}
