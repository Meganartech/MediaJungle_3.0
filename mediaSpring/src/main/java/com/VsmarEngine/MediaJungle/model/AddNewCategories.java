package com.VsmarEngine.MediaJungle.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="AddNewCategories")
public class AddNewCategories {
	
		@Id
		@GeneratedValue(strategy=GenerationType.IDENTITY)
		private long id;
		
		@Column(name = "categories")
		private String categories;
		
		

		public AddNewCategories() {
			super();
			// TODO Auto-generated constructor stub
		}

		public String getCategories() {
			return categories;
		}

		public void setCategories(String categories) {
			this.categories = categories;
		}

		public long getId() {
			return id;
		}

		public void setId(long id) {
			this.id = id;
		}

		public AddNewCategories(long id, String categories) {
			super();
			this.id = id;
			this.categories = categories;
		}

		
		
		

	}



