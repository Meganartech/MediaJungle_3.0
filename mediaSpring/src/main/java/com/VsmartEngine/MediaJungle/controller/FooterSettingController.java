import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.VsmartEngine.MediaJungle.dto.FooterSettingForm;

@Controller
@RequestMapping("/api/v2/footer-settings")
public class FooterSettingController {

    @PostMapping("/submit")
    @ResponseBody
    public String handleFormSubmission(@RequestBody FooterSettingForm form) {
        // Process the form data here
        // You can save it to a database or perform other operations
        System.out.println("Received form data: " + form);

        // Return a response to the frontend
        return "Form submitted successfully!";
    }
}
