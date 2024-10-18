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
    // Check if system tray is supported
    if (!SystemTray.isSupported()) {
        System.out.println("System tray is not supported.");
        System.out.println("Is headless mode enabled? " + GraphicsEnvironment.isHeadless());

        return;
    }

    // Create a popup menu (context menu)
    PopupMenu popup = new PopupMenu();

    // Create menu items
    MenuItem startServer = new MenuItem("Start Server");
    MenuItem stopServer = new MenuItem("Stop Server");
    MenuItem exitApp = new MenuItem("Exit");

    // Add action listeners for the menu items
    startServer.addActionListener(new ActionListener() {
        @Override
        public void actionPerformed(ActionEvent e) {
            // Logic to start your Spring Boot web application
            System.out.println("Starting server...");
            SpringApplication.run(MediaSpringApplication.class); // Start Spring Boot application
        }
    });

    stopServer.addActionListener(new ActionListener() {
        @Override
        public void actionPerformed(ActionEvent e) {
            // Logic to stop your Spring Boot web application
            System.out.println("Stopping server...");
            System.exit(0); // Shutdown the Spring Boot application
        }
    });

    exitApp.addActionListener(new ActionListener() {
        @Override
        public void actionPerformed(ActionEvent e) {
            System.out.println("Exiting...");
            System.exit(0); // Exit the tray app and shutdown Spring Boot
        }
    });

    // Add items to the popup menu
    popup.add(startServer);
    popup.add(stopServer);
    popup.addSeparator(); // Optional separator line
    popup.add(exitApp);

    // Create an icon for the tray (use PNG image)
    Image image = Toolkit.getDefaultToolkit().getImage("/icon.ico");

    // Create a TrayIcon
    TrayIcon trayIcon = new TrayIcon(image, "Spring Boot App", popup);
    trayIcon.setImageAutoSize(true); // Resize the icon automatically

    // Get the system tray instance
    SystemTray tray = SystemTray.getSystemTray();

    // Add the tray icon to the system tray
    try {
        tray.add(trayIcon);
    } catch (AWTException e) {
        System.out.println("TrayIcon could not be added.");
    }
}
}
