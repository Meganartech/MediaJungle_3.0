package com.VsmartEngine.MediaJungle.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.VsmartEngine.MediaJungle.model.SocialSettings;
import com.VsmartEngine.MediaJungle.service.SocialSettingsService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v2")

public class SocialSettingsController {

    @Autowired
    private SocialSettingsService service;

    @PostMapping("/social-settings")
    public SocialSettings saveSocialSettings(@RequestBody SocialSettings settings) {
        System.out.println("Received Settings: " + settings);
        return service.saveSocialSettings(settings);
    }

    @GetMapping("/social-settings/{id}")
    public SocialSettings getSocialSettings(@PathVariable Long id) {
        return service.getSocialSettings(id);
    }
}