package com.spotbite.service;

import com.spotbite.model.CrowdStatus;
import com.spotbite.model.Restaurant;
import com.spotbite.repository.CrowdStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CrowdStatusService {

    @Autowired
    private CrowdStatusRepository crowdStatusRepository;

    @Autowired
    private RestaurantService restaurantService;

    public CrowdStatus getCrowdStatus(Long restaurantId) {
        return crowdStatusRepository.findByRestaurantId(restaurantId)
                .orElseGet(() -> {
                    Restaurant r = restaurantService.getRestaurantById(restaurantId);
                    CrowdStatus cs = new CrowdStatus();
                    cs.setRestaurant(r);
                    cs.setStatus(CrowdStatus.Status.LOW);
                    return crowdStatusRepository.save(cs);
                });
    }

    public CrowdStatus updateCrowdStatus(Long restaurantId, CrowdStatus.Status status) {
        CrowdStatus cs = getCrowdStatus(restaurantId);
        cs.setStatus(status);
        cs.setUpdatedAt(java.time.LocalDateTime.now());
        return crowdStatusRepository.save(cs);
    }
}