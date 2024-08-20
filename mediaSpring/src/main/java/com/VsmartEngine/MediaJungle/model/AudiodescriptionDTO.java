package com.VsmartEngine.MediaJungle.model;

public class AudiodescriptionDTO {

	    private Long id;
	    private String audioTitle;
//		private byte[] bannerthumbnail;
		
		
        

	    public AudiodescriptionDTO(Long id, String audioTitle) {
			super();
			this.id = id;
			this.audioTitle = audioTitle;
//			this.bannerthumbnail = bannerthumbnail;
		}

		// Getters and setters (optional)
	    public Long getId() {
	        return id;
	    }

	    public void setId(Long id) {
	        this.id = id;
	    }
	    
	    

//	    public byte[] getBannerthumbnail() {
//			return bannerthumbnail;
//		}
//
//		public void setBannerthumbnail(byte[] bannerthumbnail) {
//			this.bannerthumbnail = bannerthumbnail;
//		}

		public String getAudioTitle() {
	        return audioTitle;
	    }

	    public void setAudioTitle(String audioTitle) {
	        this.audioTitle = audioTitle;
	    }

		@Override
		public String toString() {
			return "AudiodescriptionDTO [id=" + id + ", audioTitle=" + audioTitle + "]";
		}
	
	    

}
