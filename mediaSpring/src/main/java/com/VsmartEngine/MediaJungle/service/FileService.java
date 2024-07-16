package com.VsmartEngine.MediaJungle.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.web.multipart.MultipartFile;

import com.VsmartEngine.MediaJungle.model.FileModel;

public interface FileService {

	FileModel uploadVideo(String path, MultipartFile file) throws IOException ;
	
	InputStream getVideoFIle(String path,String fileName , long id) throws FileNotFoundException ;

}
