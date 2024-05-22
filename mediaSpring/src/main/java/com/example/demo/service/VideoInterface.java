package com.example.demo.service;

import java.util.List;

import com.example.demo.model.UpdateModel;
import com.example.demo.model.Videos;

public interface VideoInterface {
	
	public Videos createPost(Videos videos);
	
	public Videos getVideosById(Integer id);
	
	public List<Videos> getAllVideos();
	
	public Videos updatePost(Videos videos , Integer id);
	
	public void deleteVideos(Integer id);
	
public UpdateModel updateModel(UpdateModel updateModel, int id);

Videos updatePost1(Videos videos);
}
