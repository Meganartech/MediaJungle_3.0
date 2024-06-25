package com.example.demo.controller;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;
import java.util.List;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.demo.model.PaymentUser;
import com.example.demo.model.Paymentsettings;
import com.example.demo.model.SubScription;
import com.example.demo.repository.PaymentRepository;
import com.example.demo.repository.PaymentsettingRepository;
import com.example.demo.repository.SubScriptionRepository;
import com.example.demo.userregister.UserRegister;
import com.example.demo.userregister.UserRegisterRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v2/")
public class PaymentController {

    @Value("${rzp_currency}")
    private String currency;
    
    @Autowired
    private PaymentRepository paymentrepository;
   
    @Autowired
    private UserRegisterRepository userregisterrepository;
    
    @Autowired
    private PaymentsettingRepository paymentsettingrepository;
        

    @PostMapping("/payment")
    public String Payment(@RequestBody Map<String, String> requestData) {
        try {
            Long amount = Long.parseLong(requestData.get("amount"));
            Long userId = Long.parseLong(requestData.get("userId"));
            String planName = requestData.get("planname");

            Optional<PaymentUser> optionPayment = paymentrepository.findByUserId(userId);
            Optional<UserRegister> userOption = userregisterrepository.findById(userId);

            if (userOption.isPresent()) {
                // Check if the user has already made a payment
                if (optionPayment.isPresent()) {
                    PaymentUser paym = optionPayment.get();
                    if (paym.getExpiryDate().isAfter(LocalDate.now())) {
                        // Return message indicating already paid and not expired
                        System.out.println("You have already paid for the plan");
                        return "You have already paid for the plan. Your subscription is valid until " + paym.getExpiryDate();
                    }
                }

                // Fetch Razorpay keys from the payment settings repository
                Optional<Paymentsettings> paymentSettingOptional = paymentsettingrepository.findById(1L); // Assuming ID is 1, adjust as needed
                if (!paymentSettingOptional.isPresent()) {
                    return "Payment settings not found";
                }
                Paymentsettings paymentSetting = paymentSettingOptional.get();
                String razorpayApiKey = paymentSetting.getRazorpay_key();
                String razorpayApiSecret = paymentSetting.getRazorpay_secret_key();
                // Proceed to create a new order
                RazorpayClient client = new RazorpayClient(razorpayApiKey, razorpayApiSecret);
                JSONObject orderRequest = new JSONObject();
                orderRequest.put("amount", amount * 100); // Convert amount to paisa
                orderRequest.put("currency", "INR");
                orderRequest.put("notes", new JSONObject().put("user_id", userId));
                Order order = client.orders.create(orderRequest);
                System.out.println("orderRequest" + order);
                String orderId = order.get("id").toString();

                // Save payment details
                PaymentUser payment = new PaymentUser();
                payment.setUserId(userId);
                payment.setOrderId(orderId);
                payment.setSubscriptionTitle(planName);
                payment.setExpiryDate(LocalDate.now().plusMonths(1)); // Assuming 1-month subscription
                paymentrepository.save(payment);

                return orderId;
            } else {
                // Return an error response if the user is not found
                return "User not found";
            }
        } catch (NumberFormatException e) {
            return "Invalid data format";
        } catch (RazorpayException e) {
            e.printStackTrace();
            return "Error creating order: " + e.getMessage();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error creating order: " + e.getMessage();
        }
    }
    
   

    @PostMapping("/buy")
    public ResponseEntity<String> updatePaymentId(@RequestBody Map<String, String> requestData) {
        try {
            String orderId = requestData.get("orderId");
            String paymentId = requestData.get("paymentId");
            String statuscode = requestData.get("status_code");
            String planname = requestData.get("planname");
            String amount = requestData.get("amount");
            double Amount = Double.parseDouble(amount);
            int validityDays = Integer.parseInt(requestData.get("validity"));
            
            String userIdString = requestData.get("userId");
            long userid = Long.parseLong(userIdString);
            
            
            Optional<PaymentUser> paym = paymentrepository.findByUserId(userid);
            Optional<UserRegister> useroption = userregisterrepository.findById(userid);
            
            if (useroption.isPresent()) {
                UserRegister user = useroption.get();
                PaymentUser p = paym.get();
            
                if (statuscode.equals("200")) { 
                    user.setPaymentId(p);
                    // Save the updated user entity
                    userregisterrepository.save(user);
                }
            }
            LocalDate currentDate = LocalDate.now();
            LocalDate expiryDate = currentDate.plusDays(validityDays);

            Optional<PaymentUser> orderUserOptional = paymentrepository.findByOrderId(orderId);
            if (orderUserOptional.isPresent()) {
                PaymentUser pay = orderUserOptional.get();
                pay.setPaymentId(paymentId);
                pay.setAmount(Amount);
                pay.setSubscriptionTitle(planname);
                pay.setStatus(statuscode);
                pay.setExpiryDate(expiryDate);
                paymentrepository.save(pay);
                // Return a success response with the userId
                return new ResponseEntity<>("Payment ID updated successfully for user ID: " ,HttpStatus.OK);
          } 
            else {
                // Return a response indicating the order ID was not found
                return new ResponseEntity<>("Order ID not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            // Handle exceptions and return an internal server error response
            return new ResponseEntity<>("An error occurred while updating the payment ID", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    


    
}
    
    
    


