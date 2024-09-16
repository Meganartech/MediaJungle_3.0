package com.VsmartEngine.MediaJungle.videoContainer;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table
public class VideoContainer {

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
	    private String name;
	    private String categoryName;
		public VideoContainer() {
			super();
			// TODO Auto-generated constructor stub
		}
		public VideoContainer(Long id, String name, String categoryName) {
			super();
			this.id = id;
			this.name = name;
			this.categoryName = categoryName;
		}
		public Long getId() {
			return id;
		}
		public void setId(Long id) {
			this.id = id;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getCategoryName() {
			return categoryName;
		}
		public void setCategoryName(String categoryName) {
			this.categoryName = categoryName;
		}
	    
	    
}
