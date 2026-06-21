package com.spotbite.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }

    public String uploadImage(MultipartFile file) throws IOException {
        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "spotbite/restaurants",
                        "resource_type", "image",
                        "transformation", ObjectUtils.asMap(
                                "width", 800,
                                "height", 600,
                                "crop", "fill",
                                "quality", "auto"
                        )
                )
        );
        return (String) result.get("secure_url");
    }

    public void deleteImage(String imageUrl) {
        try {
            // Extract public_id from URL
            String publicId = extractPublicId(imageUrl);
            if (publicId != null) {
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            }
        } catch (IOException e) {
            // Log but don't throw — deletion failure shouldn't break other operations
            System.err.println("Failed to delete image from Cloudinary: " + e.getMessage());
        }
    }

    private String extractPublicId(String imageUrl) {
        if (imageUrl == null || !imageUrl.contains("cloudinary.com")) return null;
        try {
            // URL format: https://res.cloudinary.com/cloud/image/upload/v123/spotbite/restaurants/filename.jpg
            String[] parts = imageUrl.split("/upload/");
            if (parts.length < 2) return null;
            String withVersion = parts[1];
            // Remove version prefix (v12345678/)
            String publicIdWithExt = withVersion.replaceFirst("v\\d+/", "");
            // Remove file extension
            int dotIndex = publicIdWithExt.lastIndexOf('.');
            return dotIndex > 0 ? publicIdWithExt.substring(0, dotIndex) : publicIdWithExt;
        } catch (Exception e) {
            return null;
        }
    }
}