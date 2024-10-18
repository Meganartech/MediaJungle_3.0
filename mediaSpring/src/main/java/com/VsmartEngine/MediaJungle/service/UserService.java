package com.VsmartEngine.MediaJungle.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.VsmartEngine.MediaJungle.model.PaymentUser;
import com.VsmartEngine.MediaJungle.repository.PaymentRepository;
import com.VsmartEngine.MediaJungle.userregister.UserRegister;
import com.VsmartEngine.MediaJungle.userregister.UserRegisterRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {
    @Autowired
    private PaymentRepository userRepository;

    @Autowired
    private UserRegisterRepository userRegisterRepository;
    
    public String getPlanDetailsByUserId(Long userId) {
        Optional<PaymentUser> userOptional = userRepository.findByUserId(userId);
        
        // Using Optional's isPresent() method to check and get the plan details
        return userOptional.map(PaymentUser::getSubscriptionTitle).orElse(null);
    }
    @Transactional
    public void updateProfilePicture(Long userId, byte[] profilePictureData) {
        UserRegister user = userRegisterRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setProfile(profilePictureData);
        userRegisterRepository.save(user);
    }
    public UserRegister getUserById(Long userId) {
        return userRegisterRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}
