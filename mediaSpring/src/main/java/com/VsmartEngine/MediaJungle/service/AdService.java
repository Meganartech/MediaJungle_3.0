package com.VsmartEngine.MediaJungle.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.VsmartEngine.MediaJungle.model.AddAd;
import com.VsmartEngine.MediaJungle.repository.AddAdRepository;


@Service
public class AdService {

    @Autowired
    private AddAdRepository adRepository;

    // Create new Ad
    public AddAd addAd(AddAd ad) {
        return adRepository.save(ad);
    }

    // Edit existing Ad
    public AddAd updateAd(Long id, AddAd adDetails) {
        AddAd ad = adRepository.findById(id).orElseThrow(() -> new RuntimeException("Ad not found"));
        ad.setAdName(adDetails.getAdName());
        ad.setCertificateNumber(adDetails.getCertificateNumber());
        ad.setCertificateName(adDetails.getCertificateName());
        ad.setViews(adDetails.getViews());
        ad.setRollType(adDetails.getRollType());
        ad.setVideoFile(adDetails.getVideoFile());
        return adRepository.save(ad);
    }

    // Get Ad by ID
    public AddAd getAdById(Long id) {
        return adRepository.findById(id).orElseThrow(() -> new RuntimeException("Ad not found"));
    }
}
