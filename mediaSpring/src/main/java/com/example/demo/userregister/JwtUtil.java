package com.example.demo.userregister;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Configuration
public class JwtUtil {
	
	 @Autowired
	 private JwtConfig jwtConfig;
	 
	 public static final long JWT_EXPIRATION_MS = 86400000;

	    public String generateToken(String username) {
	    	Date now = new Date();
	        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION_MS);
	        
	        return Jwts.builder()
	            .setSubject(username)
	            .claim("username",username)
	            .signWith(SignatureAlgorithm.HS256, jwtConfig.getSecretKey())
	            .compact();
	    }
	    public boolean validateToken(String token) {
	        try {
	            Jwts.parser()
	                .setSigningKey(jwtConfig.getSecretKey())
	                .parseClaimsJws(token);
	            return true;
	        } catch (Exception e) {
	            return false;
	        }
	    }
	    
	    public String getUsernameFromToken(String token) {
	        try {
	            Claims claims = Jwts.parser()
	                .setSigningKey(jwtConfig.getSecretKey())
	                .parseClaimsJws(token)
	                .getBody();
	            return claims.get("username", String.class);
	        } catch (Exception e) {
	            // Print or log the exception for debugging
	            e.printStackTrace();
	            return null;
	        }
	    }

}
