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
}
