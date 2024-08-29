package com.VsmartEngine.MediaJungle;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.VsmartEngine.MediaJungle.controller.AddUserController;
import com.VsmartEngine.MediaJungle.controller.AudioController1;
import com.VsmartEngine.MediaJungle.controller.CastandcrewController;
import com.VsmartEngine.MediaJungle.controller.CategoryController;
import com.VsmartEngine.MediaJungle.controller.CertificateController;
import com.VsmartEngine.MediaJungle.controller.EmployeeController;
import com.VsmartEngine.MediaJungle.controller.FeatureController;
import com.VsmartEngine.MediaJungle.controller.LanguageController;
import com.VsmartEngine.MediaJungle.controller.LicenseController;
import com.VsmartEngine.MediaJungle.controller.PaymentController;
import com.VsmartEngine.MediaJungle.controller.PaymentSettingController;
import com.VsmartEngine.MediaJungle.controller.PlanDescriptionController;
import com.VsmartEngine.MediaJungle.controller.PlanDetailsController;
import com.VsmartEngine.MediaJungle.controller.TagController;
import com.VsmartEngine.MediaJungle.controller.UserWithStatus;
import com.VsmartEngine.MediaJungle.controller.VideoCastAndCrewController;
import com.VsmartEngine.MediaJungle.model.AddCertificate;
import com.VsmartEngine.MediaJungle.model.AddLanguage;
import com.VsmartEngine.MediaJungle.model.AddNewCategories;
import com.VsmartEngine.MediaJungle.model.AddUser;
import com.VsmartEngine.MediaJungle.model.Addaudio1;
import com.VsmartEngine.MediaJungle.model.CastandCrew;
import com.VsmartEngine.MediaJungle.model.Companysiteurl;
import com.VsmartEngine.MediaJungle.model.Contactsettings;
import com.VsmartEngine.MediaJungle.model.Emailsettings;
import com.VsmartEngine.MediaJungle.model.License;
import com.VsmartEngine.MediaJungle.model.Mobilesettings;
import com.VsmartEngine.MediaJungle.model.Othersettings;
import com.VsmartEngine.MediaJungle.model.PaymentUser;
import com.VsmartEngine.MediaJungle.model.Paymentsettings;
import com.VsmartEngine.MediaJungle.model.PlanDetails;
import com.VsmartEngine.MediaJungle.model.PlanFeatures;
import com.VsmartEngine.MediaJungle.model.Seosettings;
import com.VsmartEngine.MediaJungle.model.Sitesetting;
import com.VsmartEngine.MediaJungle.model.Socialsettings;
import com.VsmartEngine.MediaJungle.model.Tag;
import com.VsmartEngine.MediaJungle.model.UserListWithStatus;
import com.VsmartEngine.MediaJungle.model.VideoCastAndCrew;
// import com.VsmartEngine.MediaJungle.model.VideoDescription;
import com.VsmartEngine.MediaJungle.model.Videosettings;
import com.VsmartEngine.MediaJungle.notification.controller.NotificationController;
import com.VsmartEngine.MediaJungle.userregister.UserRegister;
import com.VsmartEngine.MediaJungle.userregister.UserRegisterController;
import com.VsmartEngine.MediaJungle.video.VideoController;
import com.VsmartEngine.MediaJungle.video.VideoDescription;

import com.VsmartEngine.MediaJungle.video.VideoImage;
import com.VsmartEngine.MediaJungle.video.VideoImageController;
import com.VsmartEngine.MediaJungle.video.Videos;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@CrossOrigin()
@RestController
@RequestMapping("/api/v2/")
public class FrontController {

	@Autowired
	public AddUserController AddUserController;

	@Autowired
	private AudioController1 AudioController;

	@Autowired
	private CastandcrewController CastandcrewController;

	@Autowired
	private FeatureController FeatureController;


	@Autowired
	private CategoryController CategoryController;

	@Autowired
	private CertificateController CertificateController;

	@Autowired
	private EmployeeController EmployeeController;

	@Autowired
	private LanguageController LanguageController;

	@Autowired
	private LicenseController LicenseController;

	@Autowired
	private PaymentController PaymentController;

	@Autowired
	private PaymentSettingController PaymentSettingController;

	@Autowired
	private PlanDescriptionController PlanDescriptionController;

	@Autowired
	private PlanDetailsController PlanDetailsController;

	@Autowired
	private TagController TagController;

	@Autowired
	private VideoCastAndCrewController VideoCastAndCrewController;

	@Autowired
	private UserRegisterController UserRegisterController;

	@Autowired
	private NotificationController NotificationController;

	@Autowired
	private VideoController VideoController;
	
	@Autowired
	private VideoImageController videoImageController;
	
	@PostMapping("/AdminRegister")
	public ResponseEntity<?> adminRegister(@RequestBody AddUser data) {
		return AddUserController.adminRegister(data);
	}
	

	@PostMapping("/AddUser")
	public ResponseEntity<?> addUser(@RequestBody AddUser data, @RequestHeader("Authorization") String token) {

		return AddUserController.addUser(data,token);
	}

	@PostMapping("/login/admin")
	public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {

		return AddUserController.loginadmin(loginRequest);
	}
	@PostMapping("/logout/admin")
	 public ResponseEntity<String> logoutadmin(@RequestHeader("Authorization") String token) {
		return AddUserController.logoutadmin(token);
	}

	@GetMapping("/GetUserId/{userId}")
	public ResponseEntity<UserListWithStatus> getUser(@PathVariable Long userId) {

		return AddUserController.getUser(userId);
	}
	
	@GetMapping("/checkAdminRole")
	public ResponseEntity<?> checkAdminRole() {
           return AddUserController.checkAdminRole();
	}

	@DeleteMapping("/DeleteUser/{UserId}")
	public ResponseEntity<Void> deleteUser(@PathVariable Long UserId) {

		return AddUserController.deleteUser(UserId);

	}

	@PatchMapping("/UpdateUser/{userId}")
	public ResponseEntity<String> updateUserDetails(@PathVariable Long userId, @RequestBody AddUser updatedUserData) {

		return AddUserController.updateUserDetails(userId, updatedUserData);
	}

	 @PostMapping("/uploadaudio")
	 public ResponseEntity<Addaudio1> uploadAudio(@RequestParam("category") Long categoryId,
	                                              @RequestParam("audioFile") MultipartFile audioFile,
	                                              @RequestParam("thumbnail") MultipartFile thumbnail,
	                                              @RequestParam(value = "paid", required = false) boolean paid,
	                                              @RequestHeader("Authorization") String token) {

		return AudioController.uploadAudio(categoryId, audioFile, thumbnail, paid, token);
	}

	@GetMapping("/{filename}/file")
	public ResponseEntity<Resource> getAudioFi(@PathVariable String filename, HttpServletRequest request) {

		return AudioController.getAudioFi(filename, request);
	}

	@GetMapping("/audio/{id}")
	@Transactional
	public ResponseEntity<Addaudio1> getAudioById(@PathVariable Long id) {

		return AudioController.getAudioById(id);
	}

	@GetMapping("/audio/{id}/file")
	public ResponseEntity<Resource> getAudioFile(@PathVariable String id) throws IOException {

		return AudioController.getAudioFile(id);
	}

	@GetMapping("/audio/list")
	public ResponseEntity<List<String>> listAudioFiles() throws IOException {

		return AudioController.listAudioFiles();
	}

	@GetMapping("/GetAll")
	public ResponseEntity<List<Addaudio1>> getAllAudio() {

		return AudioController.getAllUser();

	}

	@GetMapping("/GetDetail/{id}")
	public ResponseEntity<Addaudio1> getAudioDetail(@PathVariable Long id) {

		return AudioController.getAudioDetail(id);

	}

	@GetMapping("/{id}/filename")
	public ResponseEntity<String> getAudioFilename(@PathVariable Long id) {

		return AudioController.getAudioFilename(id);
	}

	@GetMapping("/GetAllThumbnail")
	public ResponseEntity<List<byte[]>> getAllThumbnail() {

		return AudioController.getAllThumbnail();

	}
	
	
	
	@GetMapping("/getbannerthumbnailsbyid/{id}")
	public ResponseEntity<List<String>> getaudiobannerById(@PathVariable Long id) {

		return AudioController.getaudiobannerById(id);
	}
	
	@GetMapping("/getaudiothumbnailsbyid/{id}")
	public ResponseEntity<List > getaudioThumbnailsById(@PathVariable Long id) {

		return AudioController.getaudioThumbnailsById(id);
	}

	@GetMapping("/GetThumbnailsById/{id}")
	public ResponseEntity<List<String>> getAudioThumbnailsById(@PathVariable Long id) {

		return AudioController.getThumbnailsById(id);
	}

	@DeleteMapping("/audio/{id}")
	 public ResponseEntity<Map<String, String>> deleteAudioById(@PathVariable Long id, @RequestHeader("Authorization") String token) {
		 
		return AudioController.deleteAudioById(id, token);

	}

	@PatchMapping("/updateaudio/update/{audioId}")
	 public ResponseEntity<?> updateAudio(		
		        @PathVariable Long audioId,
		        @RequestParam(value = "audioFile", required = false) MultipartFile audioFile,
		        @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
		        @RequestParam(value = "category", required = false) Long categoryId,
		        @RequestHeader("Authorization") String token)
		     {
		return AudioController.updateAudio(audioId, audioFile, thumbnail, categoryId, token);
	}

	@PostMapping("/addcastandcrew")
	public ResponseEntity<?> addCast(@RequestParam("image") MultipartFile image,
            @RequestParam("name") String name,
            @RequestParam("description")String description,
            @RequestHeader("Authorization") String token) throws IOException {

		return CastandcrewController.addCast(image, name,description, token);
	}

	@GetMapping("/GetAllcastandcrew")
	public ResponseEntity<List<CastandCrew>> getAllPCastandcrew() {

		return CastandcrewController.getAllPCastandcrew();
	}

	@GetMapping("/getcast/{id}")
	public ResponseEntity<CastandCrew> getcast(@PathVariable Long id) {

		return CastandcrewController.getcast(id);
	}

	@GetMapping("/GetAllcastthumbnail")
	public ResponseEntity<List<byte[]>> getcastthumbnail() {

		return CastandcrewController.getcastthumbnail();
	}

	@GetMapping("/GetThumbnailsforcast/{id}")
	public ResponseEntity<List<String>> getCastThumbnailsById(@PathVariable Long id) {

		return CastandcrewController.getThumbnailsById(id);

	}

	@DeleteMapping("/Deletecastandcrew/{Id}")
	  public ResponseEntity<?> deletecast(@PathVariable Long Id,@RequestHeader("Authorization") String token) {

		return CastandcrewController.deletecast(Id, token);
	}

	@PatchMapping("/updatecastandcrew/{id}")
	public ResponseEntity<String> updateCast(
	        @PathVariable Long id,
	        @RequestParam(value = "image", required = false) MultipartFile image,
	        @RequestParam(value = "name", required = false) String name,
	        @RequestParam(value= "description",required = false)String description,
	        @RequestHeader("Authorization") String token) {
		return CastandcrewController.updateCast(id, image, name,description,token);
	}
	
	@PostMapping("/AddNewCategories")
	public ResponseEntity<String> createCategory(@RequestHeader("Authorization") String token, @RequestBody AddNewCategories data) {
		
		return CategoryController.createCategory(token, data);
	}

	@PostMapping("/PlanFeatures")
	public ResponseEntity<String> createFeature(@RequestHeader("Authorization") String token, @RequestBody PlanFeatures data) {
		
		return FeatureController.createFeature(token, data);
	}


	@GetMapping("/GetAllFeatures")
	public ResponseEntity<List<PlanFeatures>> getAllFeature() {

		return FeatureController.getAllFeatures();
	}
	@GetMapping("/GetAllCategories")
	public ResponseEntity<List<AddNewCategories>> getAllCategories() {

		return CategoryController.getAllCategories();
	}


	@GetMapping("/GetFeatureById/{featureId}")
	public ResponseEntity<PlanFeatures> getFeatureById(@PathVariable Long featureId) {

		return FeatureController.getFeatureById(featureId);
	}
	@GetMapping("/GetCategoryById/{categoryId}")
	public ResponseEntity<AddNewCategories> getCategoryById(@PathVariable Long categoryId) {

		return CategoryController.getCategoryById(categoryId);
	}

	@DeleteMapping("/DeleteFeature/{featureId}")
	public ResponseEntity<?> deleteFeature(@PathVariable Long featureId, @RequestHeader("Authorization") String token) {
		

		return FeatureController.deleteFeature(featureId, token);
	}

	@DeleteMapping("/DeleteCategory/{categoryId}")
	public ResponseEntity<?> deleteCategory(@PathVariable Long categoryId, @RequestHeader("Authorization") String token) {
		

		return CategoryController.deleteCategory(categoryId, token);
	}
	@PatchMapping("/editFeature/{featureId}")
	public ResponseEntity<String> editFeatures(@PathVariable Long featureId, @RequestBody PlanFeatures editFeature,@RequestHeader("Authorization") String token) {


		return FeatureController.editFeatures(featureId, editFeature, token);
	}


	@PatchMapping("/editCategory/{categoryId}")
	public ResponseEntity<String> editCategories(@PathVariable Long categoryId, @RequestBody AddNewCategories editCategory,@RequestHeader("Authorization") String token) {


		return CategoryController.editCategories(categoryId, editCategory, token);
	}

	@PostMapping("/AddCertificate")
	public ResponseEntity<String> createEmployee(@RequestHeader("Authorization") String token,@RequestBody AddCertificate data) {

		return CertificateController.createEmployee(token, data);
	}

	@GetMapping("/GetAllCertificate")
	public ResponseEntity<List<AddCertificate>> getAllCertificate() {

		return CertificateController.getAllCertificate();
	}

	@GetMapping("/GetCertificateById/{certificateId}")
	public ResponseEntity<AddCertificate> getcetificateById(@PathVariable Long certificateId) {

		return CertificateController.getTagById(certificateId);
	}

	@DeleteMapping("/DeleteCertificate/{certificateId}")
	   public ResponseEntity<?> deletecertificate(@PathVariable Long certificateId,@RequestHeader("Authorization") String token) {

		return CertificateController.deleteCategory(certificateId, token)
				;
	}

	@PatchMapping("/editCertificate/{certificateId}")
	public ResponseEntity<String> editCategories(@PathVariable Long certificateId, @RequestBody AddCertificate editCertificate,@RequestHeader("Authorization") String token) {
		

		return CertificateController.editCategories(certificateId, editCertificate, token);
	}

	@PostMapping("/OtherSettings")
	public ResponseEntity<?> addothersetting(@RequestHeader("Authorization") String token,@RequestParam("appstore") String appstore,
			@RequestParam("playstore") String playstore){

		return EmployeeController.addothersetting(token, appstore, playstore);
	}

	@GetMapping("/GetOthersettings")
	public ResponseEntity<List<Othersettings>> getOthersettings() {

		return EmployeeController.getOthersettings();
	}

	@PatchMapping("/editothersettings/{id}")
	public ResponseEntity<String> editothersetting(@PathVariable Long id, @RequestBody Othersettings updatedothersetting,
	        @RequestHeader("Authorization") String token) {
		
		return EmployeeController.editothersetting(id, updatedothersetting, token);
	}

	@PostMapping("/Companysiteurl")
	public ResponseEntity<?> addCompanysiteurl(@RequestBody Companysiteurl data) {
		
		return EmployeeController.addCompanysiteurl(data);
	}

	@GetMapping("/GetCompanysiteurl")
	public ResponseEntity<List<Companysiteurl>> getcompanysiteurl() {
		return EmployeeController.getcompanysiteurl();

	}

	@PostMapping("/seoSettings")
	public ResponseEntity<?> addSeosettings(@RequestBody Seosettings data) {
		return EmployeeController.addSeosettings(data);

	}

	@GetMapping("/GetseoSettings")
	public ResponseEntity<List<Seosettings>> getseoSettings() {
		return EmployeeController.getseoSettings();
	}

	@PostMapping("/Contactsettings")
	public ResponseEntity<?> contactsetting(@RequestHeader("Authorization") String token,@RequestParam("contact_email") String contact_email,
			@RequestParam("contact_mobile") String contact_mobile,
			@RequestParam("contact_address") String contact_address,
			@RequestParam("copyright_content") String copyright_content) {
		
		return EmployeeController.contactsetting(token, contact_email, contact_mobile, contact_address, copyright_content);

	}

	@GetMapping("/GetcontactSettings")
	public ResponseEntity<List<Contactsettings>> getcontactsettings() {

		return EmployeeController.getcontactsettings();

	}

	@PatchMapping("/editcontactsetting/{id}")
	public ResponseEntity<String> editcontact(@PathVariable Long id, 
	        @RequestParam(required = false) String contact_email,
	        @RequestParam(required = false) String contact_mobile,
	        @RequestParam(required = false) String contact_address,
	        @RequestParam(required = false) String copyright_content,
	        @RequestHeader("Authorization") String token) {

		return EmployeeController.editcontact(id, contact_email, contact_mobile, contact_address, copyright_content, token);
	}


	@PostMapping("/Emailsettings")
	public ResponseEntity<?> addEmailsettings(@RequestBody Emailsettings data) {
		return EmployeeController.addEmailsettings(data);
	}

	@GetMapping("/GetemailSettings")
	public ResponseEntity<List<Emailsettings>> getemailsettings() {
		return EmployeeController.getemailsettings();
	}

	@PostMapping("/Mobilesettings")
	public ResponseEntity<?> addMobilesettings(@RequestBody Mobilesettings data) {
		return EmployeeController.addMobilesettings(data);
	}

	@GetMapping("/GetmobileSettings")
	public ResponseEntity<List<Mobilesettings>> getmobilesettings() {
		return EmployeeController.getmobilesettings();
	}

	@PostMapping("/SiteSetting")
	public ResponseEntity<?> addsitesetting(@RequestParam("sitename") String sitename,
			@RequestParam("appurl") String appurl,
			@RequestParam("tagName") String tagName,
			@RequestParam("icon") MultipartFile icon,
			@RequestParam("logo") MultipartFile logo,
			@RequestHeader("Authorization") String token) throws IOException {

		return EmployeeController.addsitesetting(sitename, appurl, tagName, icon, logo, token);
	}

	@GetMapping("/GetsiteSettings")
	public ResponseEntity<List<Sitesetting>> getsitesettings() {

		return EmployeeController.getsitesettings();
	}

	@PatchMapping("/editsettings/{id}")
    public ResponseEntity<String> editSetting(
	        @PathVariable Long id, 
	        @RequestParam(required = false) String sitename,
	        @RequestParam(required = false) String appurl,
	        @RequestParam(required = false) String tagName,
	        @RequestParam(required = false) MultipartFile icon,
	        @RequestParam(required = false) MultipartFile logo,
	        @RequestHeader("Authorization") String token) {

		return EmployeeController.editSetting(id, sitename, appurl, tagName, icon, logo, token);
	}

	@PostMapping("/videoSetting")
	public ResponseEntity<?> addVideosettings(@RequestBody Videosettings data) {
		return EmployeeController.addVideosettings(data);
	}

	@GetMapping("/GetvideoSettings")
	public ResponseEntity<List<Videosettings>> getvideosettings() {
		return EmployeeController.getvideosettings();
	}

	@PostMapping("/Socialsettings")
	public ResponseEntity<?> addSocialsettings(@RequestBody Socialsettings data) {
		return EmployeeController.addSocialsettings(data);
	}

	@GetMapping("/GetsocialSettings")
	public ResponseEntity<List<Socialsettings>> getsocialsettings() {
		return EmployeeController.getsocialsettings();
	}

	@PostMapping("/AddLanguage")
	public ResponseEntity<String> createEmployee(@RequestHeader("Authorization") String token,@RequestBody AddLanguage data) {
		
		return LanguageController.createEmployee(token, data);
	}

	@GetMapping("/GetAllLanguage")
	public ResponseEntity<List<AddLanguage>> getAllLanguage() {
		return LanguageController.getAllLanguage();
	}

	@GetMapping("/GetLanguageById/{languageId}")
	public ResponseEntity<AddLanguage> getLanguageById(@PathVariable Long languageId) {
		return LanguageController.getTagById(languageId);
	}

	@DeleteMapping("/DeleteLanguage/{categoryId}")
	  public ResponseEntity<?> deleteLanguage(@PathVariable Long categoryId,@RequestHeader("Authorization") String token) {
		return LanguageController.deleteLanguage(categoryId, token);
	}

	@PatchMapping("/editLanguage/{languageId}")
	public ResponseEntity<String> editLanguage(@PathVariable Long languageId,@RequestBody AddLanguage editlanguage,@RequestHeader("Authorization") String token) {
		
		return LanguageController.editLanguage(languageId, editlanguage, token);
	}

	@GetMapping("/GetAllUser")
	public ResponseEntity<UserWithStatus> getAllUser() {
		return LicenseController.getAllUser();
	}

	@GetMapping("/count")
	public ResponseEntity<Integer> count() {
		return LicenseController.count();
	}

	@PostMapping("/uploadfile")
	public ResponseEntity<License> upload(@RequestParam("audioFile") MultipartFile File,
			@RequestParam("lastModifiedDate") String lastModifiedDate) {
		return LicenseController.upload(File, lastModifiedDate);
	}

	@PostMapping("/payment")
    public String Payment(@RequestBody Map<String, String> requestData) {
		return PaymentController.Payment(requestData);
	}

	@PostMapping("/buy")
	public ResponseEntity<String> updatePaymentId(@RequestBody Map<String, String> requestData) {

		return PaymentController.updatePaymentId(requestData);
	}
	
	@GetMapping("/paymentHistory/{userId}")
	public ResponseEntity<List<PaymentUser>> getPaymentHistory(@PathVariable Long userId) {
			
		return PaymentController.getPaymentHistory(userId);
	  
	}
	
	@PostMapping("/AddrazorpayId")
	public ResponseEntity<?>  Addpaymentsetting (@RequestParam("razorpay_key") String razorpay_key,
			@RequestParam("razorpay_secret_key")String razorpay_secret_key,
			@RequestHeader("Authorization") String token){
		return PaymentSettingController.Addpaymentsetting(razorpay_key, razorpay_secret_key, token);
	}

	@GetMapping("/getrazorpay")
	public ResponseEntity<List<Paymentsettings>> getAllrazorpay() {

		return PaymentSettingController.getAllrazorpay();
	}

	@PatchMapping("/Editrazorpay/{id}")
	public ResponseEntity<String> editrazorpay(@PathVariable Long id , @RequestBody Paymentsettings updatedrazorpay,
			@RequestHeader("Authorization") String token){
		return PaymentSettingController.editrazorpay(id, updatedrazorpay, token);
	}

	@PostMapping("/AddPlanDescription")
	public ResponseEntity<?> addPlanDescription(@RequestParam("description") String description,
	        @RequestHeader("Authorization") String token) {
		return PlanDescriptionController.addPlanDescription(description, token);
	}

	@PostMapping("/AddPlanFeature")
	public ResponseEntity<?> addPlanFeature(@RequestParam("feature") String feature,
	        @RequestHeader("Authorization") String token) {
		return FeatureController.addPlanFeature(feature, token);
	}

//	@PostMapping("/active/{id}")
//	public ResponseEntity<?> addActiveStatus(
//	        @PathVariable Long id,
//	        @RequestParam("active") String active,
//	        @RequestHeader("Authorization") String token
//	) {
//		return PlanDescriptionController.addActiveStatus(id, active, token);
//	}
	
	@DeleteMapping("/deletedesc/{id}")
	public ResponseEntity<?> deletedescription(@PathVariable Long id, @RequestHeader("Authorization") String token) {
	
		return PlanDescriptionController.deletedescription(id, token);
	}


	@PostMapping("/PlanDetails")
	public ResponseEntity<?> planDetails(@RequestParam("planname")String planname,
			@RequestParam("amount") double amount,
			@RequestParam("validity") int validity,
			@RequestHeader("Authorization") String token){

		return PlanDetailsController.planDetails(planname, amount, validity, token);
	}
	
	
	@GetMapping("/GetAllPlans")
	public ResponseEntity<List<PlanDetails>> getAllPlanDetails() {

		return PlanDetailsController.getAllPlanDetails();
	}

	@GetMapping("/GetPlanById/{id}")
	public ResponseEntity<PlanDetails> getPlanById(@PathVariable Long id) {
		return PlanDetailsController.getPlanById(id);
	}

	@DeleteMapping("/DeletePlan/{planId}")
	public ResponseEntity<?> deletePlan(@PathVariable Long planId, @RequestHeader("Authorization") String token) {

		return PlanDetailsController.deletePlan(planId, token);
	}

	@PatchMapping("/editPlans/{planId}")
    public ResponseEntity<String> editplans(@PathVariable Long planId, @RequestBody PlanDetails updatedPlanDetails,@RequestHeader("Authorization") String token) {

		return PlanDetailsController.editplans(planId, updatedPlanDetails, token);
	}

	@PostMapping("/AddTag")
	public ResponseEntity<String> posttag(@RequestHeader("Authorization") String token,@RequestBody Tag data) {

		return TagController.posttag(token, data);
	}

	@GetMapping("/GetAllTag")
	public ResponseEntity<List<Tag>> getAllTag() {
		return TagController.getAllTag();
	}

	@GetMapping("/GetTagById/{tagId}")
	public ResponseEntity<Tag> getTagById(@PathVariable Long tagId) {

		return TagController.getTagById(tagId);
	}

	@DeleteMapping("/DeleteTag/{tagId}")
    public ResponseEntity<?> deleteTag(@PathVariable Long tagId,@RequestHeader("Authorization") String token) {

		return TagController.deleteTag(tagId, token);
	}

	@PatchMapping("/editTag/{tagId}")
	public ResponseEntity<String> editTag(@PathVariable Long tagId, @RequestBody Tag editTag,@RequestHeader("Authorization") String token) {

		return TagController.editTag(tagId, editTag, token);
	}

	@PostMapping("/save")
	public ResponseEntity<?> saveVideoCastAndCrew(@RequestParam("videoId") long videoId,
			@RequestParam("castAndCrewIds") List<Long> castAndCrewIds) {

		return VideoCastAndCrewController.saveVideoCastAndCrew(videoId, castAndCrewIds);
	}

	@GetMapping("/Getvideocast")
	public ResponseEntity<List<VideoCastAndCrew>> getAllPCastvideo() {

		return VideoCastAndCrewController.getAllPCastvideo();
	}

	@GetMapping("/GetcastvideoById/{Id}")
	public ResponseEntity<VideoCastAndCrew> getcastvideoById(@PathVariable Long Id) {

		return VideoCastAndCrewController.getcastvideoById(Id);
	}

	@GetMapping("/get/{videoId}")
	public ResponseEntity<List<VideoCastAndCrew>> getCastVideo(@PathVariable Long videoId) {

		return VideoCastAndCrewController.getCastVideo(videoId);
	}

	@PostMapping("/userregister")
	public ResponseEntity<UserRegister> register(@RequestParam("username") String username,
			@RequestParam("email") String email, @RequestParam("password") String password,
			@RequestParam("mobnum") String mobnum, @RequestParam("confirmPassword") String confirmPassword,
			@RequestParam(value = "profile", required = false) MultipartFile profile) throws IOException {

		return UserRegisterController.register(username, email, password, mobnum, confirmPassword, profile);
	}

	@GetMapping("/GetAllUsers")
	public ResponseEntity<List<UserRegister>> getAllUserRegester() {

		return UserRegisterController.getAllUser();
	}

	@GetMapping("/GetUserById/{id}")
	public ResponseEntity<UserRegister> getUserById(@PathVariable Long id) {

		return UserRegisterController.getUserById(id);
	}

	@PostMapping("/login")
	@Transactional
	public ResponseEntity<?> userlogin(@RequestBody Map<String, String> loginRequest) {
		return UserRegisterController.login(loginRequest);
	}

	@PostMapping("/logout")
	public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {

		return UserRegisterController.logout(token);
	}

	@PostMapping("/forgetPassword")
	@Transactional
	public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> loginRequest) {

		return UserRegisterController.resetPassword(loginRequest);
	}
	
	 @GetMapping("/notifications")
	 public ResponseEntity<?>GetAllNotification(@RequestHeader("Authorization") String token){
		 
		 return NotificationController.GetAllNotification(token);
	 }

	 @GetMapping("/usernotifications")
	 public ResponseEntity<?>GetuserNotification(@RequestHeader("Authorization") String token){
		 
		 return NotificationController.GetuserNotification(token);
		 
	 }
	 
	 @PostMapping("/markAllAsRead")
	    public ResponseEntity<?> markAllAsRead(@RequestHeader("Authorization") String token) {
		 
		 return NotificationController.markAllAsRead(token);
	 }
	 
	 @PostMapping("/markAllAsReaduser")
	    public ResponseEntity<?> markAllAsReaduser(@RequestHeader("Authorization") String token) {
		 
		 return NotificationController.markAllAsReaduser(token);
	 }
	 
		@GetMapping("/unreadCount")
		public ResponseEntity<?> UreadCount(@RequestHeader("Authorization") String token) {
			
			return NotificationController.UreadCount(token);
		}
		
		@GetMapping("/unreadCountuser")
		public ResponseEntity<?> UreadCountuser(@RequestHeader("Authorization") String token) {
			
			return NotificationController.UreadCountuser(token);
		}
		
		@GetMapping("/clearAll")
		public ResponseEntity<?>ClearAll(@RequestHeader("Authorization") String token){
			
			return NotificationController.ClearAll(token);
		}
		
		@GetMapping("/clearAlluser")
		public ResponseEntity<?>ClearAlluser(@RequestHeader("Authorization") String token){
			
			return NotificationController.ClearAlluser(token);
		}
		
		@PostMapping("/uploaddescription")
	    public ResponseEntity<?> uploadVideoDescription(
	    		@RequestParam("videoTitle") String videoTitle,
				@RequestParam("mainVideoDuration") String mainVideoDuration,
				@RequestParam("trailerDuration") String trailerDuration,
				@RequestParam("rating") String rating,
				@RequestParam("certificateNumber") String certificateNumber,
				@RequestParam("videoAccessType") boolean videoAccessType,
				@RequestParam("description") String description,
				@RequestParam("productionCompany") String productionCompany,
				@RequestParam("certificateName") String certificateName,
				@RequestParam("castandcrewlist") List<Long> castandcrewlist,
				@RequestParam("taglist") List<Long> taglist,
				@RequestParam("categorylist") List<Long> categorylist,
				@RequestParam("videoThumbnail") MultipartFile videoThumbnail,
				@RequestParam("trailerThumbnail") MultipartFile trailerThumbnail,
				@RequestParam("userBanner") MultipartFile userBanner,
				@RequestParam("video") MultipartFile video,
		        @RequestParam("trailervideo") MultipartFile trailervideo,
	            @RequestHeader("Authorization") String token){
			return VideoController.uploadVideoDescription(videoTitle, mainVideoDuration, trailerDuration, rating, certificateNumber, videoAccessType,
                    description, productionCompany, certificateName, castandcrewlist, taglist, categorylist,
                    videoThumbnail, trailerThumbnail, userBanner,video,trailervideo,token);
		}
		
		@GetMapping("/video/getall")
		public ResponseEntity<List<VideoDescription>> getAllVideo() {
			return VideoController.getAllVideo();
		}
		
		 @GetMapping("/GetvideoDetail/{id}")
		 public ResponseEntity<VideoDescription> getVideoDetailById(@PathVariable Long id) {			 
			 return VideoController.getVideoDetailById(id);
		 }
		 
		 @GetMapping("/videoimage/{id}")
			@Transactional
			public ResponseEntity<Map<String, byte[]>> getVideoImagesByVideoId(@PathVariable Long id) {
					return videoImageController.getVideoImagesByVideoId(id);
			}
		 
		 @GetMapping("/{videofilename}/videofile")
		 public ResponseEntity<?> getVideo(@PathVariable String videofilename, HttpServletRequest request) {	
			return VideoController.getVideo(videofilename, request);
		}
		 
		
		 @PatchMapping("/updateVideoDescription/{videoId}")
		 @Transactional
		 public ResponseEntity<?> updateVideoDescription(
		         @PathVariable("videoId") Long videoId,
		         @RequestParam(value = "videoTitle", required = false) String videoTitle,
		         @RequestParam(value = "mainVideoDuration", required = false) String mainVideoDuration,
		         @RequestParam(value = "trailerDuration", required = false) String trailerDuration,
		         @RequestParam(value = "rating", required = false) String rating,
		         @RequestParam(value = "certificateNumber", required = false) String certificateNumber,
		         @RequestParam(value = "videoAccessType", required = false) Boolean videoAccessType,
		         @RequestParam(value = "description", required = false) String description,
		         @RequestParam(value = "productionCompany", required = false) String productionCompany,
		         @RequestParam(value = "certificateName", required = false) String certificateName,
		         @RequestParam(value = "castandcrewlist", required = false) List<Long> castandcrewlist,
		         @RequestParam(value = "taglist", required = false) List<Long> taglist,
		         @RequestParam(value = "categorylist", required = false) List<Long> categorylist,
		         @RequestParam(value = "videoThumbnail", required = false) MultipartFile videoThumbnail,
		         @RequestParam(value = "trailerThumbnail", required = false) MultipartFile trailerThumbnail,
		         @RequestParam(value = "userBanner", required = false) MultipartFile userBanner,
		         @RequestParam(value = "video", required = false) MultipartFile video,
		         @RequestParam(value = "trailervideo", required = false) MultipartFile trailervideo,
		         @RequestHeader("Authorization") String token) {
			 
			 return VideoController.updateVideoDescription(videoId,videoTitle, mainVideoDuration, trailerDuration, rating, certificateNumber, videoAccessType,
	                    description, productionCompany, certificateName, castandcrewlist, taglist, categorylist,
	                    videoThumbnail, trailerThumbnail, userBanner,video,trailervideo,token);
			}
		 
		 @DeleteMapping("/deletevideo/{videoId}")
		 @Transactional
		    public ResponseEntity<?> deleteVideoDescription(@PathVariable("videoId") Long videoId,
		                                                    @RequestHeader("Authorization") String token) {
			 return VideoController.deleteVideoDescription(videoId, token);
		 }
		 
		
//		 @GetMapping("/{filename}/file")
//			public ResponseEntity<Resource> getAudioFi(@PathVariable String filename, HttpServletRequest request) {
//
//				return AudioController.getAudioFi(filename, request);
//			}
		
//		

//		@PostMapping("/updatedescriprion")
//		public ResponseEntity<VideoDescription> updatedescription(
//		        @RequestParam("Movie_name") String moviename,
//		        @RequestParam("description") String description,
//		        @RequestParam("tags") String tags,
//		        @RequestParam("category") String category,
//		        @RequestParam("certificate") String certificate,
//		        @RequestParam("Language") String language,
//		        @RequestParam("Duration") String duration,
//		        @RequestParam("Year") String year,
//		        @RequestParam(value = "paid", required = false) boolean paid,
//		        @RequestParam("id") long id,
//		        @RequestHeader("Authorization") String token) {
//			
//			return VideoController.updatedescription(moviename, description, tags, category, certificate, language, duration, year, paid, id, token);
//		}
//		
//		@PostMapping("/postit")
//		public Videos uploadingVideo(@RequestParam("video") MultipartFile video) throws IOException
//		{
//			
//			return VideoController.uploadingVideo(video);
//		}
//		
//		@GetMapping(value = "/play/{id}")
//		 public ResponseEntity<?> getVideo(@PathVariable Long id, HttpServletRequest request) {
//			
//			return VideoController.getVideo(id, request);
//
//		}
//		
//		@GetMapping(value = "/updatevideo")
//		public ResponseEntity<String> updateById() throws IOException {
//			
//			return VideoController.updateById();
//		}		
//		 @GetMapping(value = "/videogetall")
//		    public ResponseEntity<List<VideoDescription>> videogetall() {
//			 
//			 return VideoController.videogetall();
//		 }
//		 
//		 @GetMapping("/GetvideoThumbnail")
//		    public ResponseEntity<List<byte[]>> getAllThumbnails() {
//			 
//			 return VideoController.getAllThumbnail();
//			 
//		 }
		 
//		 @DeleteMapping("/video/{id}")
//		 public ResponseEntity<?> deleteVideoById(@PathVariable Long id, @RequestHeader("Authorization") String token) {
//			 
//			 return VideoController.deleteVideoById(id, token);
//		 }
//		 
//		
//		 
//		 @GetMapping("/GetThumbnailsByid/{id}")
//		    public ResponseEntity<List<String>> getThumbnailsById(@PathVariable Long id) {
//			 
//			 return VideoController.getThumbnailsById(id);
//		 }
//		 
//		 @GetMapping("/GetAllThumbnaill")
//		    public ResponseEntity<List<byte[]>> getAllThumbnaill() {
//			 
//			 return VideoController.getAllThumbnaill();
//		 }

}
