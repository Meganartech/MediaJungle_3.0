package com.VsmartEngine.MediaJungle.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.VsmartEngine.MediaJungle.exception.ResourceNotFoundException;
import com.VsmartEngine.MediaJungle.model.Tenure;
import com.VsmartEngine.MediaJungle.repository.TenureRepository;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v2")
public class TenureController {
	
	@Autowired
	private TenureRepository tenureRepository;
	
	@GetMapping("/tenures")
public List<Tenure> getAllTenures()
	{
		return tenureRepository.findAll();

	}
	 @PostMapping("/addtenure")
public Tenure createTenure( @RequestBody Tenure tenure) {
		   System.out.println("Received Tenure: " + tenure);
	return tenureRepository.save(tenure);
}
	 
@GetMapping("/tenures/{id}")
public ResponseEntity<Tenure> getTenureById(@PathVariable long id){
	Tenure tenure = tenureRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Tenure not exist with id:" +id));
	return ResponseEntity.ok(tenure);
}
@PutMapping("/edittenure/{id}")
public ResponseEntity<Map<String, Object>> updateTenure(@PathVariable long id, @RequestBody Tenure tenureDetails) {
    Tenure updateTenure = tenureRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Tenure not exist with id:" + id));
    updateTenure.setTenure_name(tenureDetails.getTenure_name());
    updateTenure.setMonths(tenureDetails.getMonths());
    updateTenure.setDiscount(tenureDetails.getDiscount());
    tenureRepository.save(updateTenure);
    
    Map<String, Object> response = new HashMap<>();
    response.put("success", true);
    response.put("data", updateTenure);
    return ResponseEntity.ok(response);
}


@DeleteMapping("/deletetenure/{id}")
public ResponseEntity<HttpStatus> deleteTenure(@PathVariable long id){
	Tenure tenure = tenureRepository.findById(id)
			.orElseThrow(() -> new ResourceNotFoundException("Tenure not exist with id" + id));
	tenureRepository.delete(tenure);
	return new ResponseEntity<>(HttpStatus.NO_CONTENT);
}
}
