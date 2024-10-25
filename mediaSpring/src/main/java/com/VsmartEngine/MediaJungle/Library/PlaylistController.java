package com.VsmartEngine.MediaJungle.Library;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.VsmartEngine.MediaJungle.exception.ResourceNotFoundException;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v2/")
public class PlaylistController {
	
	@Autowired
	private PlaylistRepository playlistrepository;
	
	@PostMapping("/createplaylist")
    public ResponseEntity<Playlist> createPlaylist(
        @RequestParam String title, @RequestParam String description) {
		Playlist playlist = new Playlist();
        playlist.setTitle(title);
        playlist.setDescription(description);
        Playlist playlists = playlistrepository.save(playlist);
        return ResponseEntity.ok(playlists);
    }
	
	// Add an audio ID to a playlist
    @PostMapping("/{playlistId}/audio/{audioId}")
    public ResponseEntity<Playlist> addAudioIdToPlaylist(
        @PathVariable Long playlistId, @PathVariable Long audioId) {
    	Playlist playlist = playlistrepository.findById(playlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found"));
            
            playlist.getAudioIds().add(audioId);
            Playlist playlists = playlistrepository.save(playlist);
        return ResponseEntity.ok(playlists);
    }
    
    

}
