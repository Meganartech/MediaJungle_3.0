//package com.VsmartEngine.MediaJungle.ffmpeg;
//
//import java.io.*;
//import java.util.Arrays;
//import java.util.List;
//import org.springframework.stereotype.Service;
//
//@Service
//public class FFmpegService {
//    
//    private static final String FFMPEG_PATH = "C:/ffmpeg/bin/ffmpeg.exe"; // Adjust if needed
//
//    public void generateDASH(String inputFile, String outputDir) throws IOException, InterruptedException {
//        // Convert Windows backslashes to forward slashes for FFmpeg compatibility
////        outputDir = outputDir.replace("\\", "/");
////        inputFile = inputFile.replace("\\", "/");
//
//        File outputFolder = new File(outputDir);
//        if (!outputFolder.exists()) {
//            outputFolder.mkdirs(); // Create directory if it doesn't exist
//        }
//
//        // FFmpeg command to generate DASH segments
//        List<String> command = Arrays.asList(
//        	    "C:/ffmpeg/bin/ffmpeg.exe", "-i", inputFile,
//        	    // Video at 480p
//        	    "-map", "0:v:0", "-b:v:0", "500k", "-s", "854x480", "-c:v", "libx264", "-preset", "fast", "-f", "mp4", outputDir + "/video_480p.mp4",
//        	    // Video at 720p
//        	    "-map", "0:v:0", "-b:v:1", "1000k", "-s", "1280x720", "-c:v", "libx264", "-preset", "fast", "-f", "mp4", outputDir + "/video_720p.mp4",
//        	    // Video at 1080p
//        	    "-map", "0:v:0", "-b:v:2", "2000k", "-s", "1920x1080", "-c:v", "libx264", "-preset", "fast", "-f", "mp4", outputDir + "/video_1080p.mp4",
//        	    // Audio
//        	    "-map", "0:a:0", "-b:a", "128k", "-c:a", "aac", "-f", "mp4", outputDir + "/audio.mp4",
//        	    // DASH Output
//        	    "-use_timeline", "1", "-use_template", "1",
//        	    "-adaptation_sets", "id=0,streams=v id=1,streams=a",
//        	    "-f", "dash",
//        	    "-init_seg_name", "init_$RepresentationID$.m4s",
//        	    "-media_seg_name", "chunk_$RepresentationID$_$Number$.m4s",
//        	    "-seg_duration", "4",
//        	    "-dash_segment_type", "mp4",
//        	    outputDir + "/manifest.mpd"
//        	);
//        // Execute FFmpeg process
//        ProcessBuilder processBuilder = new ProcessBuilder(command);
//        processBuilder.redirectErrorStream(true);
//        Process process = processBuilder.start();
//
//        // Capture FFmpeg logs
//        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
//            String line;
//            while ((line = reader.readLine()) != null) {
//                System.out.println(line);
//            }
//        }
//
//        int exitCode = process.waitFor();
//        if (exitCode == 0) {
//            System.out.println("DASH Segmentation Completed Successfully.");
//        } else {
//            System.out.println("FFmpeg Processing Failed!");
//        }
//    }
//
//}


package com.VsmartEngine.MediaJungle.ffmpeg;

import java.io.*;
import java.util.Arrays;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class FFmpegService {

    private static final String FFMPEG_PATH = "C:/ffmpeg/bin/ffmpeg.exe"; // Adjust if needed

    public void generateDASH(String inputFile, String outputDir) throws IOException, InterruptedException {
        // Create the output directory if it doesn't exist
        File outputFolder = new File(outputDir);
        if (!outputFolder.exists()) {
            outputFolder.mkdirs();
        }

        List<String> command = Arrays.asList(
        	    "C:/ffmpeg/bin/ffmpeg.exe", "-y", "-i", inputFile,

        	    // 480p Video Stream (SD)
        	    "-map", "0:v:0", "-b:v:0", "500k", "-s", "854x480", "-c:v", "libx264", "-preset", "ultrafast",
        	    "-g", "60", "-sc_threshold", "0", "-keyint_min", "60",

        	    // 720p Video Stream (HD)
        	    "-map", "0:v:0", "-b:v:1", "2500k", "-s", "1280x720", "-c:v", "libx264", "-preset", "ultrafast",
        	    "-g", "60", "-sc_threshold", "0", "-keyint_min", "60",

        	    // 1080p Video Stream (Full HD)
        	    "-map", "0:v:0", "-b:v:2", "5000k", "-s", "1920x1080", "-c:v", "libx264", "-preset", "ultrafast",
        	    "-g", "60", "-sc_threshold", "0", "-keyint_min", "60",

        	    // 2160p Video Stream (4K UHD)
        	    "-map", "0:v:0", "-b:v:3", "15000k", "-s", "3840x2160", "-c:v", "libx264", "-preset", "ultrafast",
        	    "-g", "60", "-sc_threshold", "0", "-keyint_min", "60",

        	    // Audio Stream
        	    "-map", "0:a:0", "-b:a", "128k", "-c:a", "aac",

        	    // DASH Manifest - Generate a Single MPD File
        	    "-use_timeline", "1", "-use_template", "1",
        	    "-adaptation_sets", "id=0,streams=v id=1,streams=a",
        	    "-init_seg_name", "init_$RepresentationID$.m4s",
        	    "-media_seg_name", "chunk_$RepresentationID$_$Number$.m4s",
        	    "-seg_duration", "4",
        	    "-dash_segment_type", "mp4",
        	    "-f", "dash",
        	    outputDir + "/manifest.mpd"
        	);


        // Execute FFmpeg process
        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        // Capture FFmpeg logs for debugging or monitoring
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        }

        int exitCode = process.waitFor();
        if (exitCode == 0) {
            System.out.println("DASH Segmentation Completed Successfully.");
        } else {
            System.out.println("FFmpeg Processing Failed!");
        }
    }

    // You can use parallel execution for different video resolutions (optional but can speed up process)
    public void generateDASHInParallel(String inputFile, String outputDir) throws InterruptedException {
        // Video at 480p
        Thread thread1 = new Thread(() -> {
            try {
                generateVideo(inputFile, outputDir, "480p", "500k", "854x480");
            } catch (Exception e) {
                e.printStackTrace();
            }
        });

        // Video at 720p
        Thread thread2 = new Thread(() -> {
            try {
                generateVideo(inputFile, outputDir, "720p", "1000k", "1280x720");
            } catch (Exception e) {
                e.printStackTrace();
            }
        });

        // Video at 1080p
        Thread thread3 = new Thread(() -> {
            try {
                generateVideo(inputFile, outputDir, "1080p", "2000k", "1920x1080");
            } catch (Exception e) {
                e.printStackTrace();
            }
        });

        // Start the threads
        thread1.start();
        thread2.start();
        thread3.start();

        // Wait for all threads to finish
        thread1.join();
        thread2.join();
        thread3.join();

        // Generate audio and manifest in the main thread
        try {
			generateAudioAndManifest(inputFile, outputDir);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }

    private void generateVideo(String inputFile, String outputDir, String resolution, String bitrate, String size) throws IOException, InterruptedException {
        List<String> command = Arrays.asList(
            "C:/ffmpeg/bin/ffmpeg.exe", "-i", inputFile,
            "-map", "0:v:0", "-b:v", bitrate, "-s", size, "-c:v", "libx264", "-preset", "ultrafast", "-threads", "4", "-f", "mp4", outputDir + "/video_" + resolution + ".mp4"
        );

        // Execute the FFmpeg command
        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        // Capture logs for the video encoding process
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        }

        int exitCode = process.waitFor();
        if (exitCode == 0) {
            System.out.println("Video " + resolution + " encoding completed successfully.");
        } else {
            System.out.println("Video " + resolution + " encoding failed!");
        }
    }

    private void generateAudioAndManifest(String inputFile, String outputDir) throws IOException, InterruptedException {
        // Audio (copy the stream to avoid re-encoding)
        List<String> audioCommand = Arrays.asList(
            "C:/ffmpeg/bin/ffmpeg.exe", "-i", inputFile,
            "-map", "0:a:0", "-c:a", "copy", "-f", "mp4", outputDir + "/audio.mp4"
        );

        ProcessBuilder audioProcessBuilder = new ProcessBuilder(audioCommand);
        audioProcessBuilder.redirectErrorStream(true);
        Process audioProcess = audioProcessBuilder.start();

        // Capture audio process logs
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(audioProcess.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        }

        int audioExitCode = audioProcess.waitFor();
        if (audioExitCode == 0) {
            System.out.println("Audio extraction completed successfully.");
        } else {
            System.out.println("Audio extraction failed!");
        }

        // Generate the DASH manifest
        List<String> manifestCommand = Arrays.asList(
            "C:/ffmpeg/bin/ffmpeg.exe", "-i", inputFile,
            "-use_timeline", "1", "-use_template", "1",
            "-adaptation_sets", "id=0,streams=v id=1,streams=a",
            "-f", "dash",
            "-init_seg_name", "init_$RepresentationID$.m4s",
            "-media_seg_name", "chunk_$RepresentationID$_$Number$.m4s",
            "-seg_duration", "6",  // Longer segments for faster processing
            "-dash_segment_type", "mp4",
            outputDir + "/manifest.mpd"
        );

        ProcessBuilder manifestProcessBuilder = new ProcessBuilder(manifestCommand);
        manifestProcessBuilder.redirectErrorStream(true);
        Process manifestProcess = manifestProcessBuilder.start();

        // Capture manifest generation logs
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(manifestProcess.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        }

        int manifestExitCode = manifestProcess.waitFor();
        if (manifestExitCode == 0) {
            System.out.println("DASH Manifest generation completed successfully.");
        } else {
            System.out.println("DASH Manifest generation failed!");
        }
    }
}

