package com.VsmartEngine.MediaJungle.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.VsmartEngine.MediaJungle.model.PaymentUser;
import com.VsmartEngine.MediaJungle.model.Paymentsettings;
import com.VsmartEngine.MediaJungle.repository.PaymentRepository;
import com.VsmartEngine.MediaJungle.repository.PaymentsettingRepository;
import com.VsmartEngine.MediaJungle.userregister.UserRegister;
import com.VsmartEngine.MediaJungle.userregister.UserRegisterRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@CrossOrigin()
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

    public ResponseEntity<List<PaymentUser>> getPaymentHistory(@PathVariable Long userId) {
        try {
            List<PaymentUser> paymentHistory = paymentrepository.findUserByUserId(userId);
            if (paymentHistory.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(paymentHistory, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public String Payment(@RequestBody Map<String, String> requestData) {
        try {
            Long amount = Long.parseLong(requestData.get("amount"));
            Long userId = Long.parseLong(requestData.get("userId"));
            String planName = requestData.get("planname");

            Optional<PaymentUser> optionPayment = paymentrepository.findByUserId(userId);
            Optional<UserRegister> userOption = userregisterrepository.findById(userId);

            if (userOption.isPresent()) {
                UserRegister user = userOption.get();
                
                // Check if the user has an existing payment
                if (optionPayment.isPresent()){
                    PaymentUser paym = optionPayment.get();
                    
                    // Check if the existing payment is still valid
                    if (paym.getExpiryDate().isAfter(LocalDate.now()) && paym.getPaymentId() != null && paym.getStatus().equals("paid")) {
                        return "You have already paid for the plan. Your subscription is valid until " + paym.getExpiryDate();
                    }
                }

                // Fetch Razorpay keys from the payment settings repository
                Optional<Paymentsettings> paymentSettingOptional = paymentsettingrepository.findById(1L); // Adjust ID as needed
                if (!paymentSettingOptional.isPresent()) {
                    return "Payment settings not found";
                }

                Paymentsettings paymentSetting = paymentSettingOptional.get();
                String razorpayApiKey = paymentSetting.getRazorpay_key();
                String razorpayApiSecret = paymentSetting.getRazorpay_secret_key();

                // Create a new Razorpay order
                RazorpayClient client = new RazorpayClient(razorpayApiKey, razorpayApiSecret);
                JSONObject orderRequest = new JSONObject();
                orderRequest.put("amount", amount * 100); // Convert amount to paisa
                orderRequest.put("currency", "INR");
                orderRequest.put("notes", new JSONObject().put("user_id", userId));
                Order order = client.orders.create(orderRequest);

                String orderId = order.get("id").toString();
                
//                // Save or update payment details
//                PaymentUser payment;
//                if (optionPayment.isPresent()) {
//                    payment = optionPayment.get();
//                } else {
//                    payment = new PaymentUser();
//                    payment.setUserId(userId);
//                }
//                payment.setOrderId(orderId);
//                payment.setSubscriptionTitle(planName);
//                payment.setExpiryDate(LocalDate.now().plusMonths(1)); // Assuming 1-month subscription
//                paymentrepository.save(payment);

             // Save or update payment details
                PaymentUser payment = optionPayment.orElseGet(() -> {
                    PaymentUser newPayment = new PaymentUser();
                    newPayment.setUserId(userId);
                    return newPayment;
                });

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

   


    public ResponseEntity<String> updatePaymentId(@RequestBody Map<String, String> requestData) {
        try {
            String orderId = requestData.get("orderId");
            String paymentId = requestData.get("paymentId");
            String planname = requestData.get("planname");
            int validityDays = Integer.parseInt(requestData.get("validity"));
            long userid = Long.parseLong(requestData.get("userId"));

            // Fetch Razorpay keys from the payment settings repository
            Optional<Paymentsettings> paymentSettingOptional = paymentsettingrepository.findById(1L); // Adjust ID as needed
            if (!paymentSettingOptional.isPresent()) {
                return new ResponseEntity<>("Payment settings not found", HttpStatus.NOT_FOUND);
            }
            Paymentsettings paymentSetting = paymentSettingOptional.get();
            String razorpayApiKey = paymentSetting.getRazorpay_key();
            String razorpayApiSecret = paymentSetting.getRazorpay_secret_key();

            RazorpayClient client = new RazorpayClient(razorpayApiKey, razorpayApiSecret);

            // Fetch order details from Razorpay
            Order detailedOrder = client.orders.fetch(orderId);
            String amountPaidString = detailedOrder.get("amount_paid").toString();
            int amountPaidIn = Integer.parseInt(amountPaidString) / 100;
            String status = detailedOrder.get("status").toString();
            System.out.println(detailedOrder);

            Optional<PaymentUser> paym = paymentrepository.findByUserId(userid);
            Optional<UserRegister> useroption = userregisterrepository.findById(userid);

            LocalDate currentDate = LocalDate.now();
            LocalDate expiryDate = currentDate.plusDays(validityDays);

            Optional<PaymentUser> orderUserOptional = paymentrepository.findByOrderId(orderId);
            if (orderUserOptional.isPresent()) {
                PaymentUser pay = orderUserOptional.get();
                pay.setPaymentId(paymentId);
                pay.setAmount(amountPaidIn);
                pay.setSubscriptionTitle(planname);
                pay.setStatus(status);
                pay.setExpiryDate(expiryDate);
                paymentrepository.save(pay);
                
                
                if (useroption.isPresent()) {
                    UserRegister user = useroption.get();
                    PaymentUser p = paym.orElseThrow(() -> new RuntimeException("PaymentUser not found"));

                    if (status.equals("paid")) { 
                        user.setPaymentId(p);
                        userregisterrepository.save(user);
                    }
                } else {
                    return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
                }

                // Return a success response with the userId
                return new ResponseEntity<>("Payment ID updated successfully for user ID: " + userid, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Order ID not found", HttpStatus.NOT_FOUND);
            }
        } catch (NumberFormatException e) {
            return new ResponseEntity<>("Invalid number format", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Log the exception (use a logger in real applications)
            e.printStackTrace();
            return new ResponseEntity<>("An error occurred while updating the payment ID", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
    
    
    


