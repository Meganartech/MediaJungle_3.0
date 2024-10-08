package com.VsmartEngine.MediaJungle.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.VsmartEngine.MediaJungle.model.PaymentUser;
import com.VsmartEngine.MediaJungle.repository.PaymentRepository;
import com.razorpay.Plan;

@Service
public class UserService {
    @Autowired
    private PaymentRepository userRepository;

    public String getPlanDetailsByUserId(Long userId) {
        Optional<PaymentUser> userOptional = userRepository.findByUserId(userId);
        
        // Using Optional's isPresent() method to check and get the plan details
        return userOptional.map(PaymentUser::getSubscriptionTitle).orElse(null);
    }
}
