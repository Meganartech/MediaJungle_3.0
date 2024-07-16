package com.example.demo.notification.service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.compresser.ImageUtils;
import com.example.demo.model.AddUser;
import com.example.demo.notification.NotificationAdmin;
import com.example.demo.notification.NotificationDetails;
import com.example.demo.notification.NotificationUser;
import com.example.demo.notification.repository.NotificationAdminRepository;
import com.example.demo.notification.repository.NotificationDetailsRepository;
import com.example.demo.notification.repository.NotificationUserRepository;
import com.example.demo.repository.AddUserRepository;
import com.example.demo.userregister.UserRegister;
import com.example.demo.userregister.UserRegisterRepository;

import jakarta.transaction.Transactional;

@Service
public class NotificationService {
	
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
	
	
	@Transactional
    public void markAllAsRead(Long adminId) {
		notificationadmin.markAllAsRead(adminId);
    }
	
	@Transactional
    public void markAllAsReaduser(Long userId) {
		notificationadmin.markAllAsRead(userId);
    }
	
	
	
	
//Create Notification with Multipart
	
    public Long  createNotification(String username, String createdBy,String heading ,Optional<MultipartFile> file) {
        
        NotificationDetails Details= new NotificationDetails();
        Details.setHeading(heading);
//        Details.setLink(link);
        if (file.isPresent()) { // Check if file is present (for approach 2)
            try {
                Details.setNotimage(ImageUtils.compressImage(file.get().getBytes()));; 
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        
        Details.setUsername(username);
        Details.setCreatedBy(createdBy);
        Details.setCreatedDate(LocalDate.now());
        Details.setIsActive(true);
//        Details.setDescription(description);
        NotificationDetails savedNotiDetails= notificationdetails.save(Details);
        return (savedNotiDetails.getNotifyId());
    }
    
    
  //Create Notification with byte image
    public Long  createNotification(String username, String createdBy,String heading ,byte[] file) {
        
        NotificationDetails notiDetails= new NotificationDetails();
        notiDetails.setHeading(heading);
//        notiDetails.setLink(link);
      
        notiDetails.setNotimage(file);
        
        notiDetails.setUsername(username);
        notiDetails.setCreatedBy(createdBy);
        notiDetails.setCreatedDate(LocalDate.now());
        notiDetails.setIsActive(true);
//        notiDetails.setDescription(description);
        NotificationDetails savedNotiDetails= notificationdetails.save(notiDetails);
        return (savedNotiDetails.getNotifyId());
    }
    
    
    
  //create notification without pic   
    public Long  createNotification(String username, String createdBy,String heading ) {
    	
        NotificationDetails notiDetails= new NotificationDetails();
        notiDetails.setHeading(heading);
//        notiDetails.setLink(link); 
        notiDetails.setUsername(username);
        notiDetails.setCreatedBy(createdBy);
        notiDetails.setCreatedDate(LocalDate.now());
        notiDetails.setIsActive(true);
//        notiDetails.setDescription(description);
        NotificationDetails savedNotiDetails= notificationdetails.save(notiDetails);
        return (savedNotiDetails.getNotifyId());
    }
    
    
  //create notification without pic   
    public Long  createNotification(String username, String createdBy,String heading ,String detail) {
    	
        NotificationDetails notiDetails= new NotificationDetails();
        notiDetails.setHeading(heading);
//        notiDetails.setLink(link); 
        notiDetails.setUsername(username);
        notiDetails.setCreatedBy(createdBy);
        notiDetails.setCreatedDate(LocalDate.now());
        notiDetails.setIsActive(true);
        notiDetails.setDescription(detail);
        NotificationDetails savedNotiDetails= notificationdetails.save(notiDetails);
        return (savedNotiDetails.getNotifyId());
    }
	
    
    
    public Boolean LicenceExpitedNotification(Long notificationId ,LocalDate datetonotify) {
    	 List<AddUser> listofadmins = adduserrepository.findAll();
		for(AddUser admin :listofadmins) {
			 NotificationAdmin notificationAdmin = new NotificationAdmin();
			 notificationAdmin.setAdminid(admin.getId());
			 notificationAdmin.setNotificationId(notificationId);
			 notificationAdmin.setIs_read(false);
			 notificationAdmin.setIs_Active(true);
			 notificationAdmin.setDatetonotify(datetonotify);
			 notificationadmin.save(notificationAdmin);
		}
    	return(true);
    }
    

public Boolean CommoncreateNotificationAdmin(Long notificationId, List<String> userlist) {
    for (String singleuser : userlist) {
        List<AddUser> adminUsers = adduserrepository.findAll();
        for (AddUser admin : adminUsers) {
            if (admin.getEmail().equals(singleuser)) {
                NotificationAdmin notificationAdmin = new NotificationAdmin();
                notificationAdmin.setAdminid(admin.getId());
                System.out.println(admin.getId());
                notificationAdmin.setNotificationId(notificationId);
                notificationAdmin.setIs_read(false);
                notificationAdmin.setIs_Active(true);
                notificationadmin.save(notificationAdmin);
            }
        }
        

//        List<UserRegister> regularUsers = userregisterrepository.findAll();
//        for (UserRegister regularUser : regularUsers) {
//            if (regularUser.getEmail().equals(singleuser)) {
//                NotificationUser notificationUser = new NotificationUser();
//                notificationUser.setUserid(regularUser.getId());
//                notificationUser.setNotificationId(notificationId);
//                notificationUser.setIs_read(false);
//                notificationUser.setIs_Active(true);
//                notificationuser.save(notificationUser);
//            }
        //}
    }
    return true;
}


public Boolean CommoncreateNotificationUser(Long notificationId, List<String> userlist) {
	 for (String singleuser : userlist) {
	List<UserRegister> regularUsers = userregisterrepository.findAll();
  for (UserRegister regularUser : regularUsers) {
      if (regularUser.getEmail().equals(singleuser)) {
          NotificationUser notificationUser = new NotificationUser();
          notificationUser.setUserid(regularUser.getId());
          notificationUser.setNotificationId(notificationId);
          notificationUser.setIs_read(false);
          notificationUser.setIs_Active(true);
          notificationuser.save(notificationUser);
      }
  }
}
return true;	
}



    
    

    

}
