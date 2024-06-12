package com.example.demo.userregister;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.example.demo.model.Addaudio1;
import com.example.demo.model.SubScription;
import com.example.demo.model.VideoDescription;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.JoinColumn;

@Entity
@Table
public class UserRegister {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	
	@Column(name="username")
	private String username;
	
	@Column(unique = true)
	private String email;
	
	@Column(name="password")
	private String password;
	
	@Column(name="confirmPassword")
	private String confirmPassword;
	
	@Column(name="mobnum")
	private  String mobnum;
	
	@Lob
	@Column(name="profile" ,length=1000000)
	private byte[] profile;
	
	private String planname;
	private String Subscriped;
	private String orderid;
	
	
	@ManyToMany
    @JoinTable(
        name = "user_favorites",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "audio_id")
    )
	@JsonManagedReference
    private Set<Addaudio1> favoriteAudios = new HashSet<>();
	
	@ManyToMany
	@JoinTable(
	    name = "user_favoritesvideo",
	    joinColumns = @JoinColumn(name = "user_id"),
	    inverseJoinColumns = @JoinColumn(name = "video_id")
	)
	@JsonManagedReference
	private Set<VideoDescription> favoriteVideos = new HashSet<>();
	
	public UserRegister() {
		super();
		// TODO Auto-generated constructor stub
	}



	public UserRegister(long id, String username, String email, String password, String confirmPassword, String mobnum,
			byte[] profile, String planname, String subscriped, String orderid, Set<Addaudio1> favoriteAudios,
			Set<VideoDescription> favoriteVideos) {
		super();
		this.id = id;
		this.username = username;
		this.email = email;
		this.password = password;
		this.confirmPassword = confirmPassword;
		this.mobnum = mobnum;
		this.profile = profile;
		this.planname = planname;
		Subscriped = subscriped;
		this.orderid = orderid;
		this.favoriteAudios = favoriteAudios;
		this.favoriteVideos = favoriteVideos;
	}



	public long getId() {
		return id;
	}



	public void setId(long id) {
		this.id = id;
	}



	public String getUsername() {
		return username;
	}



	public void setUsername(String username) {
		this.username = username;
	}



	public String getEmail() {
		return email;
	}



	public void setEmail(String email) {
		this.email = email;
	}



	public String getPassword() {
		return password;
	}



	public void setPassword(String password) {
		this.password = password;
	}



	public String getConfirmPassword() {
		return confirmPassword;
	}



	public void setConfirmPassword(String confirmPassword) {
		this.confirmPassword = confirmPassword;
	}



	public String getMobnum() {
		return mobnum;
	}



	public void setMobnum(String mobnum) {
		this.mobnum = mobnum;
	}



	public byte[] getProfile() {
		return profile;
	}



	public void setProfile(byte[] profile) {
		this.profile = profile;
	}



	public String getPlanname() {
		return planname;
	}



	public void setPlanname(String planname) {
		this.planname = planname;
	}



	public String getSubscriped() {
		return Subscriped;
	}



	public void setSubscriped(String subscriped) {
		Subscriped = subscriped;
	}



	public String getOrderid() {
		return orderid;
	}



	public void setOrderid(String orderid) {
		this.orderid = orderid;
	}



	public Set<Addaudio1> getFavoriteAudios() {
		return favoriteAudios;
	}



	public void setFavoriteAudios(Set<Addaudio1> favoriteAudios) {
		this.favoriteAudios = favoriteAudios;
	}



	public Set<VideoDescription> getFavoriteVideos() {
		return favoriteVideos;
	}



	public void setFavoriteVideos(Set<VideoDescription> favoriteVideos) {
		this.favoriteVideos = favoriteVideos;
	}
	
	
	}
