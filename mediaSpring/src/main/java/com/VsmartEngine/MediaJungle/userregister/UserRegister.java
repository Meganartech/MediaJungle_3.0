package com.VsmartEngine.MediaJungle.userregister;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.VsmartEngine.MediaJungle.model.AddNewCategories;
import com.VsmartEngine.MediaJungle.model.Addaudio1;
import com.VsmartEngine.MediaJungle.model.PaymentUser;
import com.VsmartEngine.MediaJungle.model.SubScription;
import com.VsmartEngine.MediaJungle.model.VideoDescription;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
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
	
	@Column(name="role")
	private String role;
	
	@Column(name="password")
	private String password;
	
	@Column(name="confirmPassword")
	private String confirmPassword;
	
	@Column(name="mobnum")
	private  String mobnum;
	
	@Lob
	@Column(name="profile" ,length=1000000)
	private byte[] profile;
	
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
	
	@OneToOne
	@JoinColumn(name = "Payment_details")
	private PaymentUser paymentId;
	
	public UserRegister() {
		super();
		// TODO Auto-generated constructor stub
	}

	public UserRegister(long id, String username, String email, String role, String password, String confirmPassword,
			String mobnum, byte[] profile, Set<Addaudio1> favoriteAudios, Set<VideoDescription> favoriteVideos,
			PaymentUser paymentId) {
		super();
		this.id = id;
		this.username = username;
		this.email = email;
		this.role = role;
		this.password = password;
		this.confirmPassword = confirmPassword;
		this.mobnum = mobnum;
		this.profile = profile;
		this.favoriteAudios = favoriteAudios;
		this.favoriteVideos = favoriteVideos;
		this.paymentId = paymentId;
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

	public PaymentUser getPaymentId() {
		return paymentId;
	}

	public void setPaymentId(PaymentUser paymentId) {
		this.paymentId = paymentId;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	
}
