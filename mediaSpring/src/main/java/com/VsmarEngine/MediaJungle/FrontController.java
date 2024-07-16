package com.VsmarEngine.MediaJungle;

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

import com.VsmarEngine.MediaJungle.controller.AddUserController;
import com.VsmarEngine.MediaJungle.controller.AudioController1;
import com.VsmarEngine.MediaJungle.controller.CastandcrewController;
import com.VsmarEngine.MediaJungle.controller.CategoryController;
import com.VsmarEngine.MediaJungle.controller.CertificateController;
import com.VsmarEngine.MediaJungle.controller.EmployeeController;
import com.VsmarEngine.MediaJungle.controller.LanguageController;
import com.VsmarEngine.MediaJungle.controller.LicenseController;
import com.VsmarEngine.MediaJungle.controller.PaymentController;
import com.VsmarEngine.MediaJungle.controller.PaymentSettingController;
import com.VsmarEngine.MediaJungle.controller.PlanDescriptionController;
import com.VsmarEngine.MediaJungle.controller.PlanDetailsController;
import com.VsmarEngine.MediaJungle.controller.TagController;
import com.VsmarEngine.MediaJungle.controller.UserWithStatus;
import com.VsmarEngine.MediaJungle.controller.VideoCastAndCrewController;
import com.VsmarEngine.MediaJungle.model.AddCertificate;
import com.VsmarEngine.MediaJungle.model.AddLanguage;
import com.VsmarEngine.MediaJungle.model.AddNewCategories;
import com.VsmarEngine.MediaJungle.model.AddUser;
import com.VsmarEngine.MediaJungle.model.Addaudio1;
import com.VsmarEngine.MediaJungle.model.CastandCrew;
import com.VsmarEngine.MediaJungle.model.Companysiteurl;
import com.VsmarEngine.MediaJungle.model.Contactsettings;
import com.VsmarEngine.MediaJungle.model.Emailsettings;
import com.VsmarEngine.MediaJungle.model.License;
import com.VsmarEngine.MediaJungle.model.Mobilesettings;
import com.VsmarEngine.MediaJungle.model.Othersettings;
import com.VsmarEngine.MediaJungle.model.Paymentsettings;
import com.VsmarEngine.MediaJungle.model.PlanDescription;
import com.VsmarEngine.MediaJungle.model.PlanDetails;
import com.VsmarEngine.MediaJungle.model.Seosettings;
import com.VsmarEngine.MediaJungle.model.Sitesetting;
import com.VsmarEngine.MediaJungle.model.Socialsettings;
import com.VsmarEngine.MediaJungle.model.Tag;
import com.VsmarEngine.MediaJungle.model.UserListWithStatus;
import com.VsmarEngine.MediaJungle.model.VideoCastAndCrew;
import com.VsmarEngine.MediaJungle.model.Videosettings;
import com.VsmarEngine.MediaJungle.userregister.UserRegister;
import com.VsmarEngine.MediaJungle.userregister.UserRegisterController;

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

	@PostMapping("/AddUser")
	public ResponseEntity<?> AddUser(@RequestBody AddUser data) {

		return AddUserController.AddUser(data);
	}

	@PostMapping("/login/admin")
	public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {

		return AddUserController.login(loginRequest);
	}

	@GetMapping("/GetUserId/{userId}")
	public ResponseEntity<UserListWithStatus> getUser(@PathVariable Long userId) {

		return AddUserController.getUser(userId);
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
			@RequestParam("audioFile") MultipartFile audioFile, @RequestParam("thumbnail") MultipartFile thumbnail,
			@RequestParam(value = "paid", required = false) boolean paid) {

		return AudioController.updateAudio(categoryId, audioFile, thumbnail, categoryId);
	}

	@GetMapping("/{filename}/file")
	public ResponseEntity<Resource> getAudioFi(@PathVariable String filename, HttpServletRequest request) {

		return AudioController.getAudioFi(filename, request);
	}

	@GetMapping("/audio/{id}")
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

	@GetMapping("/GetThumbnailsById/{id}")
	public ResponseEntity<List<String>> getAudioThumbnailsById(@PathVariable Long id) {

		return AudioController.getThumbnailsById(id);
	}

	@DeleteMapping("/audio/{id}")
	public ResponseEntity<String> deleteAudioById(@PathVariable Long id, String fileName) {

		return AudioController.deleteAudioById(id, fileName);

	}

	@PatchMapping("/updateaudio/update/{audioId}")
	public ResponseEntity<Addaudio1> updateAudio(@PathVariable Long audioId,
			@RequestParam(value = "audioFile", required = false) MultipartFile audioFile,
			@RequestParam(value = "thumbnail", required = false) MultipartFile thumbnail,
			@RequestParam(value = "category", required = false) Long categoryId) {

		return AudioController.updateAudio(audioId, audioFile, thumbnail, categoryId);
	}

	@PostMapping("/addcastandcrew")
	public ResponseEntity<CastandCrew> addcast(@RequestParam("image") MultipartFile image,
			@RequestParam("name") String name) throws IOException {

		return CastandcrewController.addcast(image, name);
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
	public ResponseEntity<Void> deletecast(@PathVariable Long Id) {

		return CastandcrewController.deletecast(Id);
	}

	public ResponseEntity<String> updateCast(@PathVariable Long id,
			@RequestParam(value = "image", required = false) MultipartFile image,
			@RequestParam(value = "name", required = false) String name) {

		return CastandcrewController.updateCast(id, image, name);
	}

	@PostMapping("/AddNewCategories")
	public ResponseEntity<?> createEmployee(@RequestBody AddNewCategories data) {

		return CategoryController.createEmployee(data);
	}

	@GetMapping("/GetAllCategories")
	public ResponseEntity<List<AddNewCategories>> getAllCategories() {

		return CategoryController.getAllCategories();
	}

	@GetMapping("/GetCategoryById/{categoryId}")
	public ResponseEntity<AddNewCategories> getCategoryById(@PathVariable Long categoryId) {

		return CategoryController.getCategoryById(categoryId);
	}

	@DeleteMapping("/DeleteCategory/{categoryId}")
	public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {

		return CategoryController.deleteCategory(categoryId);
	}

	@PatchMapping("/editCategory/{categoryId}")
	public ResponseEntity<String> editCategories(@PathVariable Long categoryId,
			@RequestBody AddNewCategories editCategory) {

		return CategoryController.editCategories(categoryId, editCategory);
	}

	@PostMapping("/AddCertificate")
	public ResponseEntity<?> createEmployee(@RequestBody AddCertificate data) {

		return CertificateController.createEmployee(data);
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
	public ResponseEntity<Void> deletecertficateCategory(@PathVariable Long certificateId) {

		return CertificateController.deleteCategory(certificateId);
	}

	@PatchMapping("/editCertificate/{certificateId}")
	public ResponseEntity<String> editCategories(@PathVariable Long certificateId,
			@RequestBody AddCertificate editCertificate) {

		return CertificateController.editCategories(certificateId, editCertificate);
	}

	@PostMapping("/OtherSettings")
	public ResponseEntity<Othersettings> addothersetting(@RequestParam("appstore") String appstore,
			@RequestParam("playstore") String playstore) {

		return EmployeeController.addothersetting(appstore, playstore);
	}

	@GetMapping("/GetOthersettings")
	public ResponseEntity<List<Othersettings>> getOthersettings() {

		return EmployeeController.getOthersettings();
	}

	@PatchMapping("/editothersettings/{id}")
	public ResponseEntity<String> editothersetting(@PathVariable Long id,
			@RequestBody Othersettings updatedothersetting) {

		return EmployeeController.editothersetting(id, updatedothersetting);
	}

	@PostMapping("/Companysiteurl")
	public ResponseEntity<?> createCompanysiteurl(@RequestBody Companysiteurl data) {

		return EmployeeController.addCompanysiteurl(data);
	}

	@GetMapping("/GetCompanysiteurl")
	public ResponseEntity<List<Companysiteurl>> getcompanysiteurl() {
		return EmployeeController.getcompanysiteurl();

	}

	@PostMapping("/seoSettings")
	public ResponseEntity<?> createSeosettings(@RequestBody Seosettings data) {
		return EmployeeController.addSeosettings(data);

	}

	@GetMapping("/GetseoSettings")
	public ResponseEntity<List<Seosettings>> getseoSettings() {
		return EmployeeController.getseoSettings();
	}

	@PostMapping("/Contactsettings")
	public ResponseEntity<Contactsettings> contactsetting(@RequestParam("contact_email") String contact_email,
			@RequestParam("contact_mobile") String contact_mobile,
			@RequestParam("contact_address") String contact_address,
			@RequestParam("copyright_content") String copyright_content) {

		return EmployeeController.contactsetting(contact_email, contact_mobile, contact_address, copyright_content);

	}

	@GetMapping("/GetcontactSettings")
	public ResponseEntity<List<Contactsettings>> getcontactsettings() {

		return EmployeeController.getcontactsettings();

	}

	@PatchMapping("/editcontactsetting/{id}")
	public ResponseEntity<String> editcontact(@PathVariable Long id,
			@RequestParam(required = false) String contact_email, @RequestParam(required = false) String contact_mobile,
			@RequestParam(required = false) String contact_address,
			@RequestParam(required = false) String copyright_content) {

		return EmployeeController.editcontact(id, contact_email, contact_mobile, contact_address, copyright_content);
	}

	@PostMapping("/Paymentsettings")
	public ResponseEntity<?> createPaymentsettings(@RequestBody Paymentsettings data) {

		return EmployeeController.addPaymentsettings(data);
	}

	@GetMapping("/GetpaymentSettings")
	public ResponseEntity<List<Paymentsettings>> getpaymentsettings() {

		return EmployeeController.getpaymentsettings();
	}

	@PostMapping("/Emailsettings")
	public ResponseEntity<?> createEmployee(@RequestBody Emailsettings data) {
		return EmployeeController.addEmailsettings(data);
	}

	@GetMapping("/GetemailSettings")
	public ResponseEntity<List<Emailsettings>> getemailsettings() {
		return EmployeeController.getemailsettings();
	}

	@PostMapping("/Mobilesettings")
	public ResponseEntity<?> createMobilesetting(@RequestBody Mobilesettings data) {
		return EmployeeController.addMobilesettings(data);
	}

	@GetMapping("/GetmobileSettings")
	public ResponseEntity<List<Mobilesettings>> getmobilesettings() {
		return EmployeeController.getmobilesettings();
	}

	@PostMapping("/SiteSetting")
	public ResponseEntity<Sitesetting> addsitesetting(@RequestParam("sitename") String sitename,
			@RequestParam("appurl") String appurl, @RequestParam("tagName") String tagName,
			@RequestParam("icon") MultipartFile icon, @RequestParam("logo") MultipartFile logo) throws IOException {

		return EmployeeController.addsitesetting(sitename, appurl, tagName, icon, logo);
	}

	@GetMapping("/GetsiteSettings")
	public ResponseEntity<List<Sitesetting>> getsitesettings() {

		return EmployeeController.getsitesettings();
	}

	@PatchMapping("/editsettings/{id}")
	public ResponseEntity<String> editSetting(@PathVariable Long id, @RequestParam(required = false) String sitename,
			@RequestParam(required = false) String appurl, @RequestParam(required = false) String tagName,
			@RequestParam(required = false) MultipartFile icon, @RequestParam(required = false) MultipartFile logo) {

		return EmployeeController.editSetting(id, sitename, appurl, tagName, icon, logo);
	}

	@PostMapping("/videoSetting")
	public ResponseEntity<?> createVideosetting(@RequestBody Videosettings data) {
		return EmployeeController.addVideosettings(data);
	}

	@GetMapping("/GetvideoSettings")
	public ResponseEntity<List<Videosettings>> getvideosettings() {
		return EmployeeController.getvideosettings();
	}

	@PostMapping("/Socialsettings")
	public ResponseEntity<?> createSocialsettings(@RequestBody Socialsettings data) {
		return EmployeeController.addSocialsettings(data);
	}

	@GetMapping("/GetsocialSettings")
	public ResponseEntity<List<Socialsettings>> getsocialsettings() {
		return EmployeeController.getsocialsettings();
	}

	@PostMapping("/AddLanguage")
	public ResponseEntity<?> createEmployee(@RequestBody AddLanguage data) {
		return LanguageController.createEmployee(data);
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
	public ResponseEntity<Void> deleteLanguage(@PathVariable Long categoryId) {
		return LanguageController.deleteLanguage(categoryId);
	}

	@PatchMapping("/editLanguage/{languageId}")
	public ResponseEntity<String> editLanguage(@PathVariable Long languageId, @RequestBody AddLanguage editlanguage) {
		return LanguageController.editLanguage(languageId, editlanguage);
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
	public ResponseEntity<String> Payment(@RequestBody Map<String, String> requestData) {
		return PaymentController.Payment(requestData);
	}

	@PostMapping("/buy")
	public ResponseEntity<String> updatePaymentId(@RequestBody Map<String, String> requestData) {

		return PaymentController.updatePaymentId(requestData);
	}

	@PostMapping("/AddrazorpayId")
	public ResponseEntity<Paymentsettings> Addpaymentsetting(@RequestParam("razorpay_key") String razorpay_key,
			@RequestParam("razorpay_secret_key") String razorpay_secret_key) {
		return PaymentSettingController.Addpaymentsetting(razorpay_key, razorpay_secret_key);
	}

	@GetMapping("/getrazorpay")
	public ResponseEntity<List<Paymentsettings>> getAllrazorpay() {

		return PaymentSettingController.getAllrazorpay();
	}

	@PatchMapping("/Editrazorpay/{id}")
	public ResponseEntity<String> editrazorpay(@PathVariable Long id, @RequestBody Paymentsettings updatedrazorpay) {

		return PaymentSettingController.editrazorpay(id, updatedrazorpay);
	}

	@PostMapping("/AddPlanDescription")
	public ResponseEntity<PlanDescription> addPlanDescription(@RequestParam("description") String description,
			@RequestParam("planId") Long planId) {
		return PlanDescriptionController.addPlanDescription(description, planId);
	}

	@PostMapping("/active/{id}")
	public ResponseEntity<PlanDescription> addActiveStatus(@PathVariable Long id,
			@RequestParam("active") String active) {
		return PlanDescriptionController.addActiveStatus(id, active);
	}

	@PostMapping("/PlanDetails")
	public ResponseEntity<PlanDetails> planDetails(@RequestParam("planname") String planname,
			@RequestParam("amount") double amount, @RequestParam("validity") int validity) {

		return PlanDetailsController.planDetails(planname, amount, validity);
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
	public ResponseEntity<String> deletePlan(@PathVariable Long planId) {

		return PlanDetailsController.deletePlan(planId);
	}

	@PatchMapping("/editPlans/{planId}")
	public ResponseEntity<String> editplans(@PathVariable Long planId, @RequestBody PlanDetails updatedPlanDetails) {
		return PlanDetailsController.editplans(planId, updatedPlanDetails);
	}

	@PostMapping("/AddTag")
	public ResponseEntity<?> posttag(@RequestBody Tag data) {

		return TagController.posttag(data);
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
	public ResponseEntity<Void> deleteTag(@PathVariable Long tagId) {

		return TagController.deleteTag(tagId);
	}

	@PatchMapping("/editTag/{tagId}")
	public ResponseEntity<String> editTag(@PathVariable Long tagId, @RequestBody Tag editTag) {

		return TagController.editTag(tagId, editTag);
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
	public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> loginRequest) {

		return UserRegisterController.resetPassword(loginRequest);
	}

}
