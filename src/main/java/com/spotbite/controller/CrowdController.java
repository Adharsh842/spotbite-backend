package com.spotbite.controller;

import com.spotbite.model.CrowdStatus;
import com.spotbite.service.CrowdStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/crowd")
@CrossOrigin(origins = "*")
public class CrowdController {

    @Autowired
    private CrowdStatusService crowdStatusService;

    @GetMapping("/{restaurantId}")
    public ResponseEntity<CrowdStatus> getCrowd(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(crowdStatusService.getCrowdStatus(restaurantId));
    }

    @PutMapping("/{restaurantId}")
    public ResponseEntity<CrowdStatus> updateCrowd(
            @PathVariable Long restaurantId,
            @RequestParam CrowdStatus.Status status) {
        return ResponseEntity.ok(crowdStatusService.updateCrowdStatus(restaurantId, status));
    }
}