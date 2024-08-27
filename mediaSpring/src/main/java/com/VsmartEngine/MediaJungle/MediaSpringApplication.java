package com.VsmartEngine.MediaJungle;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class MediaSpringApplication {

	public static void main(String[] args) {
		SpringApplication.run(MediaSpringApplication.class, args);
		
	}
	
}
