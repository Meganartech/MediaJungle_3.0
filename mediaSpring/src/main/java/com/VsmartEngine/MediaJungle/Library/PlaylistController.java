package com.VsmartEngine.MediaJungle.Library;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Objects;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.VsmartEngine.MediaJungle.exception.ResourceNotFoundException;
import com.VsmartEngine.MediaJungle.model.Audiodescription;
import com.VsmartEngine.MediaJungle.repository.AddAudioRepository;
import com.VsmartEngine.MediaJungle.repository.AddAudiodescription;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v2/")
public class PlaylistController {
	
	@Autowired
	private PlaylistRepository playlistrepository;
	
	@Autowired
	private AddAudiodescription audio ;
	
	@PostMapping("/createplaylist")
    public ResponseEntity<Playlist> createPlaylist(
        @RequestParam String title, @RequestParam String description,@RequestParam Long userId) {
		Playlist playlist = new Playlist();
        playlist.setTitle(title);
        playlist.setDescription(description);
        playlist.setUserId(userId);
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
    
    @PostMapping("/createplaylistid")
    public ResponseEntity<Playlist> createPlaylistwithid(
        @RequestParam String title, 
        @RequestParam String description,
        @RequestParam Long audioId,
        @RequestParam Long userId) {
        
        // Create a new Playlist instance and set title and description
        Playlist playlist = new Playlist();
        playlist.setTitle(title);
        playlist.setDescription(description);
        playlist.setUserId(userId);
        
        // Save the playlist to generate an ID
        playlistrepository.save(playlist);

        // Add the audioId to the playlist's audioIds list
        playlist.getAudioIds().add(audioId);
        
        // Save the updated playlist with the audio ID
        Playlist updatedPlaylist = playlistrepository.save(playlist);
        
        return ResponseEntity.ok(updatedPlaylist);
    }
    
    @GetMapping("/user/{userId}/playlists")
    public ResponseEntity<List<Playlist>> getPlaylistsByUserId(@PathVariable Long userId) {
        // Retrieve all playlists for the given userId
        List<Playlist> playlists = playlistrepository.findAllByUserId(userId);
        
        // Return the list of playlists
        return ResponseEntity.ok(playlists);
    }
    
//    @GetMapping("/{id}/getPlaylistaudio")
//    public ResponseEntity<List<Playlist>> getplaylistidsongs(@PathVariable Long id) {
//    	List<Playlist> playlists = playlistrepository.findByPlaylist(id);
//    	return ResponseEntity.ok(playlists);
//    }
    
    
    @GetMapping("/{id}/getPlaylistWithAudioDetails")
    public ResponseEntity<List<playlistDTO>> getPlaylistWithAudioDetails(@PathVariable Long id) {
        List<Playlist> playlists = playlistrepository.findByPlaylist(id);

        // Map each Playlist to a PlaylistDTO with audio details
        List<playlistDTO> playlistDTOs = playlists.stream().map(playlist -> {
            // Convert audioIds to a list of LikedsongsDTO
            List<LikedsongsDTO> audioDetails = playlist.getAudioIds().stream()
                .map(audioId -> {
                    Optional<Audiodescription> optionalAudio = audio.findById(audioId);
                    if (optionalAudio.isPresent()) {
                        Audiodescription audioDescription = optionalAudio.get();
                        return new LikedsongsDTO(audioDescription.getId(), audioDescription.getAudio_title());
                    }
                    return null;
                })
                .filter(Objects::nonNull)  // Filter out any null values
                .collect(Collectors.toList());

            // Create and return a PlaylistDTO with audio details
            return new playlistDTO(
                playlist.getUserId(),
                playlist.getTitle(),
                playlist.getDescription(),
                audioDetails
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(playlistDTOs);
    }


    


        
    
    
    

}
