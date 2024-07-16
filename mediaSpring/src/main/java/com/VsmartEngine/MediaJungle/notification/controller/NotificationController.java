package com.VsmartEngine.MediaJungle.notification.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.VsmartEngine.MediaJungle.compresser.ImageUtils;
import com.VsmartEngine.MediaJungle.model.AddUser;
import com.VsmartEngine.MediaJungle.notification.NotificationAdmin;
import com.VsmartEngine.MediaJungle.notification.NotificationDetails;
import com.VsmartEngine.MediaJungle.notification.NotificationUser;
import com.VsmartEngine.MediaJungle.notification.repository.NotificationAdminRepository;
import com.VsmartEngine.MediaJungle.notification.repository.NotificationDetailsRepository;
import com.VsmartEngine.MediaJungle.notification.repository.NotificationUserRepository;
import com.VsmartEngine.MediaJungle.notification.service.NotificationService;
import com.VsmartEngine.MediaJungle.repository.AddUserRepository;
import com.VsmartEngine.MediaJungle.userregister.JwtUtil;
import com.VsmartEngine.MediaJungle.userregister.UserRegister;
import com.VsmartEngine.MediaJungle.userregister.UserRegisterRepository;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@CrossOrigin()
@RestController
@RequestMapping("/api/v2/")
public class NotificationController {
	
	@Autowired
	private NotificationDetailsRepository notificationdetails;
	
	@Autowired
	private NotificationUserRepository notificationuser;
	
	@Autowired
	private NotificationAdminRepository notificationadmin;
	
	@Autowired
	private UserRegisterRepository userregisterrepository;
	 
	@Autowired
	private AddUserRepository adduserrepository;
	
	 @Autowired
	 private JwtUtil jwtUtil;
	 
	 @Autowired
	 private NotificationService notificationservice;
	 
	 
	 
//	 @GetMapping("/notifications")
//	 public ResponseEntity<?> GetAllNotification(@RequestHeader("Authorization") String token) {
//	     try {
//	         if (!jwtUtil.validateToken(token)) {
//	             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//	         }
//
//	         String email = jwtUtil.getUsernameFromToken(token);
//	         Optional<UserRegister> opmuser = userregisterrepository.findByEmail(email);
//	         if (opmuser.isPresent()) {
//	        	 List<Object> notimap = new ArrayList<>();
//	             UserRegister user = opmuser.get();
//	             LocalDate today = LocalDate.now();
//	             List<Long> userIds = notificationuser.findNotificationIdsByUserId(user.getId(), today);
//	             notimap.addAll(getNotificationDetails(userIds));
//	         }
//	         List<Object> notimap = new ArrayList<>();
//	         LocalDate today = LocalDate.now();
//
//	         // Fetch user notifications
//	        
//	         
//
//	         // Fetch admin notifications
//	         Optional<AddUser> opmAdmin = adduserrepository.findByUsername(email);
//	         if (opmAdmin.isPresent()) {
//	             AddUser adduser = opmAdmin.get();
//	             List<Long> adminIds = notificationuser.findNotificationIdsByUserId(adduser.getId(), today);
//	             notimap.addAll(getNotificationDetails(adminIds));
//	         }
//
//	         if (notimap.isEmpty()) {
//	             return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//	         }
//
//	         return ResponseEntity.ok(notimap);
//
//	     } catch (Exception e) {
//	         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
//	     }
//	 }
//
//	 private List<Object> getNotificationDetails(List<Long> ids) {
//	     List<Object> notimap = new ArrayList<>();
//	     for (Long id : ids) {
//	         Optional<NotificationDetails> opnotidetails = notificationdetails.findById(id);
//	         if (opnotidetails.isPresent()) {
//	             NotificationDetails notidetails = opnotidetails.get();
//	             if (notidetails.getNotimage() != null) {
//	                 try {
//	                     byte[] images = ImageUtils.decompressImage(notidetails.getNotimage());
//	                     notidetails.setNotimage(images);
//	                 } catch (Exception e) {
//	                     e.printStackTrace();
//	                 }
//	             }
//	             notimap.add(notidetails);
//	         }
//	     }
//	     return notimap;
//	 }
	 
	 
//	 @GetMapping("/notifications")
//	 public ResponseEntity<?> getAllNotifications(@RequestHeader("Authorization") String token) {
//	     try {
//	         if (!jwtUtil.validateToken(token)) {
//	             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//	         }
//	         
//	         String email = jwtUtil.getUsernameFromToken(token);
//	         Optional<AddUser> opmuser = adduserrepository.findByUsername(email);
//	         Optional<UserRegister> opmuse = userregisterrepository.findByEmail(email);
//	         
//	         if (opmuser.isPresent() || opmuse.isPresent()) {
//	             List<Object> notimap = new ArrayList<>();
//	             LocalDate today = LocalDate.now();
//	             List<Long> ids = opmuser.isPresent() ?
//	                               notificationadmin.findNotificationIdsByUserId(opmuser.get().getId(), today) :
//	                               notificationuser.findNotificationIdsByUserId(opmuse.get().getId(), today);
//	             
//	             for (Long id : ids) {
//	                 Optional<NotificationDetails> opnotidetails = notificationdetails.findById(id);
//	                 if (opnotidetails.isPresent()) {
//	                     NotificationDetails notidetails = opnotidetails.get();
//	                     if (notidetails.getNotimage() != null) {
//	                         try {
//	                             byte[] images = ImageUtils.decompressImage(notidetails.getNotimage());
//	                             notidetails.setNotimage(images);
//	                         } catch (Exception e) {
//	                             e.printStackTrace();
//	                             // Handle image decompression error
//	                         }
//	                     }
//	                     notimap.add(notidetails);
//	                 }
//	             }
//	             return ResponseEntity.ok(notimap);
//	         } else {
//	             return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//	         }
//	     } catch (Exception e) {
//	         e.printStackTrace();
//	         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
//	     }
//	 }

	 
	 @GetMapping("/notifications")
	 public ResponseEntity<?>GetAllNotification(@RequestHeader("Authorization") String token){
			try {

		         if (!jwtUtil.validateToken(token)) {
		             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		         }
		         String email=jwtUtil.getUsernameFromToken(token);
		         Optional<AddUser> opmuser= adduserrepository.findByUsername(email);
		         if(opmuser.isPresent()) {
		        	 AddUser user=opmuser.get();
		        	 LocalDate today=LocalDate.now();
		        	 List<Long> ids=notificationadmin.findNotificationIdsByadminId(user.getId(),today);

	              	 List<Object> notimap = new ArrayList<>();
		        	 for(Long id:ids) {
		        		 
		        		Optional<NotificationDetails> opnotidetails=notificationdetails.findById(id);
		        		 if (opnotidetails.isPresent()) {
		        			 NotificationDetails notidetails=opnotidetails.get();
		        			 if(notidetails.getNotimage() !=null) {
		        			 try {
		        				 byte[] images = ImageUtils.decompressImage(notidetails.getNotimage()); 
		        				 notidetails.setNotimage(images);
		        	            } catch (Exception e) {
		        	                e.printStackTrace();
		        	            }
		        			 }
		        			 notimap.add(notidetails);
				            }
		        		 
		        		 
		        	 }
		        	 return ResponseEntity.ok(notimap);
		         }else {
		        	 return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		         }
		         
			}catch (Exception e) {
		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
	        }
		}
	 
//	 @PostMapping("/markallread")
//	 public ResponseEntity<?> markAllAsRead(@RequestHeader("Authorization") String token, @RequestBody List<Long> notiIds ) {
//		    try {
//		        if (!jwtUtil.validateToken(token)) {
//		            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//		        }
//		        String email = jwtUtil.getUsernameFromToken(token);
//		        Optional<AddUser> opAddUser = adduserrepository.findByUsername(email);
//		        if (opAddUser.isPresent()) {
//		            AddUser addUser = opAddUser.get();
//		            for(Long id :notiIds) {
//						NotificationAdmin notiadmin= notificationadmin.findbyuserIdNotificationId(addUser.getId(), id);
//						notiadmin.setIs_read(true);
//						notificationadmin.save(notiadmin);
//					}
//					return ResponseEntity.ok().body("");
//		        }
//
//		        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//		    } catch (Exception e) {
//		        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//		                .body("{\"error\": \"An error occurred while processing the request.\"}");
//		    }
//		}
	 
//	 @PostMapping("/markallread")
//	 public ResponseEntity<?> MarkALLasRead(@RequestHeader("Authorization") String token, @RequestBody List<Long> notiIds){
//			try {
//				if (!jwtUtil.validateToken(token)) {
//		            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//		        }
//				String email= jwtUtil.getUsernameFromToken(token);
//			    Optional<AddUser> opuser=adduserrepository.findByUsername(email);
//			    if(opuser.isPresent()) {
//			    	AddUser user=opuser.get();
//			    	for(Long id :notiIds) {
//			    	System.out.println("id"+ notiIds);
//			    	}
//					for(Long id :notiIds) {
//						NotificationAdmin notiuser= notificationadmin.findbyuserIdNotificationId(user.getId(),id);
//						notiuser.setIs_read(true);
//						notificationadmin.save(notiuser);
//					}
//					return ResponseEntity.ok().body("");
//			    }else {
//			    	return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//			    }
//				
//			}catch (Exception e) {
//			        // If an error occurs, return 500
//			    	  return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//			    	            .body("{\"error\": \"An error occurred while processing the request.\"}");
//			    	     }
//		 }
	 
	 @PostMapping("/markAllAsRead")
	    public ResponseEntity<?> markAllAsRead(@RequestHeader("Authorization") String token) {
	        try {
	            if (!jwtUtil.validateToken(token)) {
	                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	            }
	            String email = jwtUtil.getUsernameFromToken(token);
	            Optional<AddUser> opUser = adduserrepository.findByUsername(email);
	            if (opUser.isPresent()) {
	                AddUser user = opUser.get();
	                notificationservice.markAllAsRead(user.getId());
	                return ResponseEntity.ok("All notifications marked as read");
	            } else {
	                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	            }
	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
	        }
	    }
	 
	 
	 @PostMapping("/markAllAsReaduser")
	    public ResponseEntity<?> markAllAsReaduser(@RequestHeader("Authorization") String token) {
	        try {
	            if (!jwtUtil.validateToken(token)) {
	                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	            }
	            String email = jwtUtil.getUsernameFromToken(token);
	            Optional<UserRegister> opUser = userregisterrepository.findByEmail(email);
	            if (opUser.isPresent()) {
	                UserRegister user = opUser.get();
	                notificationservice.markAllAsRead(user.getId());
	                return ResponseEntity.ok("All notifications marked as read");
	            } else {
	                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	            }
	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
	        }
	    }


		
		@GetMapping("/unreadCount")
		public ResponseEntity<?> UreadCount(@RequestHeader("Authorization") String token) {
			try {

		         if (!jwtUtil.validateToken(token)) {
		             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		         }
		         String email=jwtUtil.getUsernameFromToken(token);
		         Optional<UserRegister> opmuser= userregisterrepository.findByEmail(email);
		         if(opmuser.isPresent()) {
		        	 UserRegister user=opmuser.get();
		        	 LocalDate today=LocalDate.now();
		        	 Long count=notificationuser.CountUnreadNotificationOftheUser(user.getId(), false,today);
		        	 return ResponseEntity.ok(count);
		         }
		         Optional<AddUser> adminuser= adduserrepository.findByUsername(email);
		         if(adminuser.isPresent()) {
		        	 AddUser user=adminuser.get();
		        	 LocalDate today=LocalDate.now();
		        	 Long count=notificationadmin.CountUnreadNotificationOftheUser(user.getId(), false,today);
		        	 return ResponseEntity.ok(count);
		         }
		         
		         else {
		        	 return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		         }
		         
			
		}catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
	    }

	}
		
		@GetMapping("/clearAll")
		public ResponseEntity<?>ClearAll(@RequestHeader("Authorization") String token){
			 
			try {
				if (!jwtUtil.validateToken(token)) {
	             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	         }
	         String email=jwtUtil.getUsernameFromToken(token);
//	         Optional<UserRegister> opmuser= userregisterrepository.findByEmail(email);
//	         if(opmuser.isPresent()) {
//	        	 UserRegister user=opmuser.get();
//	        	 Long id=user.getId();
//	        	 List<Long> ids=notificationuser.findprimaryIdsByUserId(id);
//	        	 for(Long singleid :ids) {
//	        		 notificationuser.deleteById(singleid);
//	        	 }
//	        	 return ResponseEntity.ok().build();	 
//	         }
	         Optional<AddUser> adminuser= adduserrepository.findByUsername(email);
	         if(adminuser.isPresent()) {
	        	 AddUser user=adminuser.get();
	        	 Long id=user.getId();
	        	 List<Long> ids=notificationadmin.findprimaryIdsByadminId(id);
	        	 for(Long singleid :ids) {
	        		 notificationadmin.deleteById(singleid);
	        	 }
	        	 return ResponseEntity.ok().build();	 
	         }
	         
	         else {
	        	 return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); 
	         }
			}catch (Exception e) {
				e.printStackTrace();
	             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
	         }
		}


}
	


