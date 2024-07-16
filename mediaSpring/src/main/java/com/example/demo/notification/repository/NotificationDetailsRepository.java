package com.example.demo.notification.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.notification.NotificationDetails;

@Repository
public interface NotificationDetailsRepository extends JpaRepository<NotificationDetails,Long>{

}
