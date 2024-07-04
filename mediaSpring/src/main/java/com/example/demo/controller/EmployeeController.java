package com.example.demo.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.compresser.ImageUtils;
import com.example.demo.model.AddLanguage;
import com.example.demo.model.CastandCrew;
import com.example.demo.model.Companysiteurl;
import com.example.demo.model.Contactsettings;
import com.example.demo.model.Emailsettings;
import com.example.demo.model.Mobilesettings;
import com.example.demo.model.Othersettings;
import com.example.demo.model.Paymentsettings;
import com.example.demo.model.Seosettings;
import com.example.demo.model.Sitesetting;
import com.example.demo.model.Socialsettings;
import com.example.demo.model.Videosettings;
import com.example.demo.repository.CompanysiteurlRepository;
import com.example.demo.repository.ContactsettingsRepository;
import com.example.demo.repository.EmailsettingRepository;
import com.example.demo.repository.MobilesettingRepository;
import com.example.demo.repository.OthersettingRepository;
import com.example.demo.repository.PaymentsettingRepository;
import com.example.demo.repository.SeosettingsRepository;
import com.example.demo.repository.SocialsettingRepository;
import com.example.demo.repository.siteSettingRepository;
import com.example.demo.repository.videoSettingRepository;

@CrossOrigin()
@RestController
@RequestMapping("/api/v2/")

public class EmployeeController {

	@Autowired
	private siteSettingRepository siteSetting ;
	@Autowired
	private videoSettingRepository videosetting;
	@Autowired
	private SocialsettingRepository socialsetting;
	@Autowired
	private CompanysiteurlRepository companysiteurl;
	@Autowired
	private EmailsettingRepository emailsetting;
	@Autowired
	private MobilesettingRepository mobilesetting;
	@Autowired
	private PaymentsettingRepository paymentsetting;
	@Autowired
	private OthersettingRepository othersetting;
	@Autowired
	private ContactsettingsRepository contactsetting;
	@Autowired
	private SeosettingsRepository seosetting;
	
//	@GetMapping("/employees")
//	public List<sample> getAllEmployees() {
//		return employeeRepository.findAll();
//	}
	
	
//	--------------------Othersettings -----------------------------
	
//	@PostMapping("/Othersettings")
//	public Othersettings createEmployee(@RequestBody Othersettings data) {
//		return othersetting.save(data);
//	}
	@PostMapping("/OtherSettings")
	public ResponseEntity<Othersettings> addothersetting(@RequestParam("appstore") String appstore,
			@RequestParam("playstore") String playstore){
		Othersettings other = new Othersettings() ;
		other.setAppstore(appstore);
		other.setPlaystore(playstore);
		Othersettings details = othersetting.save(other);
		return ResponseEntity.ok(details);	
	}
	
	@GetMapping("/GetOthersettings")
	public ResponseEntity<List<Othersettings>> getOthersettings() {
	    List<Othersettings> othersettingss = othersetting.findAll();
	    return new ResponseEntity<>(othersettingss, HttpStatus.OK);
	}
	
	@PatchMapping("/editothersettings/{id}")
	public ResponseEntity<String> editothersetting(@PathVariable Long id , @RequestBody Othersettings updatedothersetting){
		
		try {
            // Retrieve existing plan data from the repository
			Othersettings existingsetting = othersetting.findById(id)
                    .orElseThrow(() -> new RuntimeException("not found"));

            // Apply partial updates to the existing plan data
            if (updatedothersetting.getAppstore() != null) {
                existingsetting.setAppstore(updatedothersetting.getAppstore());
            }
            if (updatedothersetting.getPlaystore()!= null) {
            	existingsetting.setPlaystore(updatedothersetting.getPlaystore());
            }
            
            othersetting.save(existingsetting);

            return new ResponseEntity<>(" updated successfully", HttpStatus.OK);
        } catch (RuntimeException e) {
            
            return new ResponseEntity<>("not found", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            
            return new ResponseEntity<>("Error when updating", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    
	}


//	--------------------working
	@PostMapping("/Companysiteurl")
	public Companysiteurl createEmployee(@RequestBody Companysiteurl data) {
		return companysiteurl.save(data);
	}
	
	@GetMapping("/GetCompanysiteurl")
	public ResponseEntity<List<Companysiteurl>> getcompanysiteurl(){
		List<Companysiteurl> companysiteurll = companysiteurl.findAll();
		return new ResponseEntity<>(companysiteurll, HttpStatus.OK);
	}
	
//	--------------------working
	@PostMapping("/seoSettings")
	public Seosettings createEmployee(@RequestBody Seosettings data) {
		return seosetting.save(data);
	}
	
	@GetMapping("/GetseoSettings")
	public ResponseEntity<List<Seosettings>> getseoSettings(){
		List<Seosettings> seosettingss = seosetting.findAll();
		return new ResponseEntity<>(seosettingss, HttpStatus.OK);
	}
	
//	--------------------working
	@PostMapping("/Contactsettings")
	public Contactsettings createEmployee(@RequestBody Contactsettings data) {
		return contactsetting.save(data);
	}
	
	@GetMapping("/GetcontactSettings")
	public ResponseEntity<List<Contactsettings>> getcontactsettings(){
		List<Contactsettings> contactsettingss = contactsetting.findAll();
		return new ResponseEntity<>(contactsettingss, HttpStatus.OK);
	}

	
	
//	--------------------working
	@PostMapping("/Paymentsettings")
	public Paymentsettings createEmployee(@RequestBody Paymentsettings data) {
		return paymentsetting.save(data);
	}
	
	@GetMapping("/GetpaymentSettings")
	public ResponseEntity<List<Paymentsettings>> getpaymentsettings(){
		List<Paymentsettings> paymentsettingss = paymentsetting.findAll();
		return new ResponseEntity<>(paymentsettingss, HttpStatus.OK);
	}
	
//	--------------------working
	@PostMapping("/Emailsettings")
	public Emailsettings createEmployee(@RequestBody Emailsettings data) {
		return emailsetting.save(data);
	}
	
	@GetMapping("/GetemailSettings")
	public ResponseEntity<List<Emailsettings>> getemailsettings(){
		List<Emailsettings> emailsettingss = emailsetting.findAll();
		return new ResponseEntity<>(emailsettingss, HttpStatus.OK);
	}
//	--------------------working
	@PostMapping("/Mobilesettings")
	public Mobilesettings createEmployee(@RequestBody Mobilesettings data) {
		return mobilesetting.save(data);
	}
	
	@GetMapping("/GetmobileSettings")
	public ResponseEntity<List<Mobilesettings>> getmobilesettings(){
		List<Mobilesettings> mobilesettingss = mobilesetting.findAll();
		return new ResponseEntity<>(mobilesettingss, HttpStatus.OK);
	}
	
//	--------------------working
	@PostMapping("/SiteSetting")
	public ResponseEntity<Sitesetting> addsitesetting(@RequestParam("sitename") String sitename,
			@RequestParam("appurl") String appurl,
			@RequestParam("tagName") String tagName,
			@RequestParam("icon") MultipartFile icon,
			@RequestParam("logo") MultipartFile logo) throws IOException {
			Sitesetting setting = new Sitesetting();
			byte[] thumbnailBytes =ImageUtils.compressImage(icon.getBytes());
			byte[] thumbnailByte =ImageUtils.compressImage(logo.getBytes());
			setting.setSitename(sitename);
			setting.setAppurl(appurl);
			setting.setTagName(tagName);
			setting.setIcon(thumbnailBytes);
			setting.setLogo(thumbnailByte);
			Sitesetting details = siteSetting.save(setting);
			return ResponseEntity.ok(details);
	}
	
	@GetMapping("/GetsiteSettings")
	public ResponseEntity<List<Sitesetting>> getsitesettings(){
		List<Sitesetting> sitesettingss = siteSetting.findAll();
		 for (Sitesetting cast : sitesettingss) {
	            byte[] logo = ImageUtils.decompressImage(cast.getLogo());
	            cast.setLogo(logo);
	            byte[] icon = ImageUtils.decompressImage(cast.getIcon());
	            cast.setIcon(icon);
	        }
		return new ResponseEntity<>(sitesettingss, HttpStatus.OK);
	}
	
	 @PatchMapping("/editsettings/{id}")
	    public ResponseEntity<String> editSetting(
	        @PathVariable Long id, 
	        @RequestParam(required = false) String sitename,
	        @RequestParam(required = false) String appurl,
	        @RequestParam(required = false) String tagName,
	        @RequestParam(required = false) MultipartFile icon,
	        @RequestParam(required = false) MultipartFile logo) {

	        try {
	            // Retrieve existing setting data from the repository
	            Sitesetting existingSetting = siteSetting.findById(id)
	                    .orElseThrow(() -> new RuntimeException("Setting not found"));

	            // Apply partial updates to the existing setting data
	            if (sitename != null) {
	                existingSetting.setSitename(sitename);
	            }
	            if (appurl != null) {
	                existingSetting.setAppurl(appurl);
	            }
	            if (tagName != null) {
	                existingSetting.setTagName(tagName);
	            }
	            if (icon != null && !icon.isEmpty()) {
	                byte[] thumbnailBytes = ImageUtils.compressImage(icon.getBytes());
	                existingSetting.setIcon(thumbnailBytes);
	            }
	            if (logo != null && !logo.isEmpty()) {
	                byte[] thumbnailBytes = ImageUtils.compressImage(logo.getBytes());
	                existingSetting.setLogo(thumbnailBytes);
	            }

	            siteSetting.save(existingSetting);

	            return new ResponseEntity<>("Settings updated successfully", HttpStatus.OK);
	        } catch (RuntimeException e) {
	            // Log the error for debugging
	            System.err.println("Runtime exception: " + e.getMessage());
	            return new ResponseEntity<>("Setting not found", HttpStatus.NOT_FOUND);
	        } catch (Exception e) {
	            // Log the error for debugging
	            System.err.println("Exception: " + e.getMessage());
	            return new ResponseEntity<>("Error when updating settings", HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }

//	--------------------working
	@PostMapping("/videoSetting")
	public Videosettings createEmployee(@RequestBody Videosettings data) {
		return videosetting.save(data);
	}
	
	@GetMapping("/GetvideoSettings")
	public ResponseEntity<List<Videosettings>> getvideosettings(){
		List<Videosettings> videosettingss = videosetting.findAll();
		return new ResponseEntity<>(videosettingss, HttpStatus.OK);
	}
//	--------------------working
	@PostMapping("/Socialsettings")
	public Socialsettings createEmployee(@RequestBody Socialsettings data) {
		return socialsetting.save(data);
	}
	
	@GetMapping("/GetsocialSettings")
	public ResponseEntity<List<Socialsettings>> getsocialsettings(){
		List<Socialsettings> socialsettingss = socialsetting.findAll();
		return new ResponseEntity<>(socialsettingss, HttpStatus.OK);
	}
	



}
