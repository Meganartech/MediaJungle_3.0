package com.VsmartEngine.MediaJungle.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.VsmartEngine.MediaJungle.model.SocialSettings;
import com.VsmartEngine.MediaJungle.repository.SocialSettingsRepository;

@Service
public class SocialSettingsService {

    @Autowired
    private SocialSettingsRepository repository;

    public SocialSettings saveSocialSettings(SocialSettings settings) {
        return repository.save(settings);
    }

    public SocialSettings getSocialSettings(Long id) {
        return repository.findById(id).orElse(null);
    }
    public SocialSettings updateSocialSettings(Long id, SocialSettings settings) {
        SocialSettings existingSettings = repository.findById(id).orElse(null);
        
        if (existingSettings != null) {
            existingSettings.setFbUrl(settings.getFbUrl());
            existingSettings.setLinkedinUrl(settings.getLinkedinUrl());
            existingSettings.setXUrl(settings.getXUrl());
            existingSettings.setYoutubeUrl(settings.getYoutubeUrl());
            return repository.save(existingSettings);
        }
        return null;
    }

}
