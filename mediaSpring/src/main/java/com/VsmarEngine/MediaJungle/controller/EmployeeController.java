package com.VsmarEngine.MediaJungle.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.VsmarEngine.MediaJungle.compresser.ImageUtils;
import com.VsmarEngine.MediaJungle.model.Companysiteurl;
import com.VsmarEngine.MediaJungle.model.Contactsettings;
import com.VsmarEngine.MediaJungle.model.Emailsettings;
import com.VsmarEngine.MediaJungle.model.Mobilesettings;
import com.VsmarEngine.MediaJungle.model.Othersettings;
import com.VsmarEngine.MediaJungle.model.Paymentsettings;
import com.VsmarEngine.MediaJungle.model.Seosettings;
import com.VsmarEngine.MediaJungle.model.Sitesetting;
import com.VsmarEngine.MediaJungle.model.Socialsettings;
import com.VsmarEngine.MediaJungle.model.Videosettings;
import com.VsmarEngine.MediaJungle.repository.CompanysiteurlRepository;
import com.VsmarEngine.MediaJungle.repository.ContactsettingsRepository;
import com.VsmarEngine.MediaJungle.repository.EmailsettingRepository;
import com.VsmarEngine.MediaJungle.repository.MobilesettingRepository;
import com.VsmarEngine.MediaJungle.repository.OthersettingRepository;
import com.VsmarEngine.MediaJungle.repository.PaymentsettingRepository;
import com.VsmarEngine.MediaJungle.repository.SeosettingsRepository;
import com.VsmarEngine.MediaJungle.repository.SocialsettingRepository;
import com.VsmarEngine.MediaJungle.repository.siteSettingRepository;
import com.VsmarEngine.MediaJungle.repository.videoSettingRepository;


@Controller


public class EmployeeController {

	@Autowired
	private siteSettingRepository siteSetting;
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

	public ResponseEntity<Othersettings> addothersetting(@RequestParam("appstore") String appstore,
			@RequestParam("playstore") String playstore) {
		Othersettings other = new Othersettings();
		other.setAppstore(appstore);
		other.setPlaystore(playstore);
		Othersettings details = othersetting.save(other);
		return ResponseEntity.ok(details);
	}


	public ResponseEntity<List<Othersettings>> getOthersettings() {
		List<Othersettings> othersettingss = othersetting.findAll();
		return new ResponseEntity<>(othersettingss, HttpStatus.OK);
	}


	public ResponseEntity<String> editothersetting(@PathVariable Long id,
			@RequestBody Othersettings updatedothersetting) {

		try {
			// Retrieve existing plan data from the repository
			Othersettings existingsetting = othersetting.findById(id)
					.orElseThrow(() -> new RuntimeException("not found"));

			// Apply partial updates to the existing plan data
			if (updatedothersetting.getAppstore() != null) {
				existingsetting.setAppstore(updatedothersetting.getAppstore());
			}
			if (updatedothersetting.getPlaystore() != null) {
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

	public ResponseEntity<?> addCompanysiteurl(@RequestBody Companysiteurl data) {

		companysiteurl.save(data);
		return ResponseEntity.ok("Success");
	}


	public ResponseEntity<List<Companysiteurl>> getcompanysiteurl() {
		List<Companysiteurl> companysiteurll = companysiteurl.findAll();
		return new ResponseEntity<>(companysiteurll, HttpStatus.OK);
	}

//	--------------------working

	public ResponseEntity<?> addSeosettings(@RequestBody Seosettings data) {
		seosetting.save(data);
		return ResponseEntity.ok("Success");
	}

	@GetMapping("/GetseoSettings")
	public ResponseEntity<List<Seosettings>> getseoSettings() {
		List<Seosettings> seosettingss = seosetting.findAll();
		return new ResponseEntity<>(seosettingss, HttpStatus.OK);
	}

//	--------------------working

	public ResponseEntity<Contactsettings> contactsetting(@RequestParam("contact_email") String contact_email,
			@RequestParam("contact_mobile") String contact_mobile,
			@RequestParam("contact_address") String contact_address,
			@RequestParam("copyright_content") String copyright_content) {
		Contactsettings contact = new Contactsettings();
		contact.setContact_email(contact_email);
		contact.setContact_mobile(contact_mobile);
		contact.setContact_address(contact_address);
		contact.setCopyright_content(copyright_content);
		Contactsettings detail = contactsetting.save(contact);
		return ResponseEntity.ok(detail);
	}


	public ResponseEntity<List<Contactsettings>> getcontactsettings() {
		List<Contactsettings> contactsettingss = contactsetting.findAll();
		return new ResponseEntity<>(contactsettingss, HttpStatus.OK);
	}


	public ResponseEntity<String> editcontact(@PathVariable Long id,
			@RequestParam(required = false) String contact_email, @RequestParam(required = false) String contact_mobile,
			@RequestParam(required = false) String contact_address,
			@RequestParam(required = false) String copyright_content) {
		try {
			// Retrieve existing setting data from the repository
			Contactsettings existingSetting = contactsetting.findById(id)
					.orElseThrow(() -> new RuntimeException("contact not found"));

			// Apply partial updates to the existing setting data
			if (contact_email != null) {
				existingSetting.setContact_email(contact_email);
			}
			if (contact_address != null) {
				existingSetting.setContact_address(contact_address);
			}
			if (contact_mobile != null) {
				existingSetting.setContact_mobile(contact_mobile);
			}
			if (copyright_content != null) {
				existingSetting.setCopyright_content(copyright_content);
			}

			contactsetting.save(existingSetting);

			return new ResponseEntity<>("contact updated successfully", HttpStatus.OK);
		} catch (RuntimeException e) {
			// Log the error for debugging
			System.err.println("Runtime exception: " + e.getMessage());
			return new ResponseEntity<>("contact not found", HttpStatus.NOT_FOUND);
		} catch (Exception e) {
			// Log the error for debugging
			System.err.println("Exception: " + e.getMessage());
			return new ResponseEntity<>("Error when updating contact", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

//	--------------------working

	public ResponseEntity<?> addPaymentsettings(@RequestBody Paymentsettings data) {
		paymentsetting.save(data);
		return ResponseEntity.ok("Success");
	}


	public ResponseEntity<List<Paymentsettings>> getpaymentsettings() {
		List<Paymentsettings> paymentsettingss = paymentsetting.findAll();
		return new ResponseEntity<>(paymentsettingss, HttpStatus.OK);
	}

//	--------------------working

	public ResponseEntity<?> addEmailsettings(@RequestBody Emailsettings data) {

		emailsetting.save(data);
		return ResponseEntity.ok("Success");
	}


	public ResponseEntity<List<Emailsettings>> getemailsettings() {
		List<Emailsettings> emailsettingss = emailsetting.findAll();
		return new ResponseEntity<>(emailsettingss, HttpStatus.OK);
	}

//	--------------------working

	public ResponseEntity<?> addMobilesettings(@RequestBody Mobilesettings data) {

		mobilesetting.save(data);
		return ResponseEntity.ok("Success");
	}


	public ResponseEntity<List<Mobilesettings>> getmobilesettings() {
		List<Mobilesettings> mobilesettingss = mobilesetting.findAll();
		return new ResponseEntity<>(mobilesettingss, HttpStatus.OK);
	}

//	--------------------working
	public ResponseEntity<Sitesetting> addsitesetting(@RequestParam("sitename") String sitename,
			@RequestParam("appurl") String appurl, @RequestParam("tagName") String tagName,
			@RequestParam("icon") MultipartFile icon, @RequestParam("logo") MultipartFile logo) throws IOException {
		Sitesetting setting = new Sitesetting();
		byte[] thumbnailBytes = ImageUtils.compressImage(icon.getBytes());
		byte[] thumbnailByte = ImageUtils.compressImage(logo.getBytes());
		setting.setSitename(sitename);
		setting.setAppurl(appurl);
		setting.setTagName(tagName);
		setting.setIcon(thumbnailBytes);
		setting.setLogo(thumbnailByte);
		Sitesetting details = siteSetting.save(setting);
		return ResponseEntity.ok(details);
	}


	public ResponseEntity<List<Sitesetting>> getsitesettings() {
		List<Sitesetting> sitesettingss = siteSetting.findAll();
		for (Sitesetting cast : sitesettingss) {
			byte[] logo = ImageUtils.decompressImage(cast.getLogo());
			cast.setLogo(logo);
			byte[] icon = ImageUtils.decompressImage(cast.getIcon());
			cast.setIcon(icon);
		}
		return new ResponseEntity<>(sitesettingss, HttpStatus.OK);
	}


	public ResponseEntity<String> editSetting(@PathVariable Long id, @RequestParam(required = false) String sitename,
			@RequestParam(required = false) String appurl, @RequestParam(required = false) String tagName,
			@RequestParam(required = false) MultipartFile icon, @RequestParam(required = false) MultipartFile logo) {

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

	public ResponseEntity<?> addVideosettings(@RequestBody Videosettings data) {

		videosetting.save(data);
		return ResponseEntity.ok("Success");
	}


	public ResponseEntity<List<Videosettings>> getvideosettings() {
		List<Videosettings> videosettingss = videosetting.findAll();
		return new ResponseEntity<>(videosettingss, HttpStatus.OK);
	}

//	--------------------working

	public ResponseEntity<?> addSocialsettings(@RequestBody Socialsettings data) {

		socialsetting.save(data);
		return ResponseEntity.ok("Success");
	}


	public ResponseEntity<List<Socialsettings>> getsocialsettings() {
		List<Socialsettings> socialsettingss = socialsetting.findAll();
		return new ResponseEntity<>(socialsettingss, HttpStatus.OK);
	}

}
