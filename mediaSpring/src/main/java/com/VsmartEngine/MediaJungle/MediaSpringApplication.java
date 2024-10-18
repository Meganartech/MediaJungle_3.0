package com.VsmartEngine.MediaJungle;

import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.scheduling.annotation.EnableAsync;

	@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
	@EnableAsync
	public class MediaSpringApplication {

		public static void main(String[] args) {
			SpringApplication.run(MediaSpringApplication.class, args);

		}
}
