package com.VsmartEngine.MediaJungle.MailVerification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
	
	 @Autowired
	 private JavaMailSender mailSender;

	 public void sendEmail(String to, String subject, String body) {
		    long startTime = System.currentTimeMillis(); // Log start time
		    SimpleMailMessage message = new SimpleMailMessage();
		    message.setTo(to);
		    message.setSubject(subject);
		    message.setText(body);
		    message.setFrom("jayarajalakshmi13@gmail.com"); // Sender email address
		    mailSender.send(message);
		    long endTime = System.currentTimeMillis(); // Log end time
		    System.out.println("Email sent in " + (endTime - startTime) + " ms");
		}



}