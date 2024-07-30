package com.VsmartEngine.MediaJungle.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.VsmartEngine.MediaJungle.model.PaymentUser;


@Repository
public interface PaymentRepository extends JpaRepository<PaymentUser,Long>{

	Optional<PaymentUser> findByOrderId(String orderId);
	Optional<PaymentUser> findByUserId(Long userId);
	List<PaymentUser> findUserByUserId(Long userId);
}
