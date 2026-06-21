package com.spotbite.repository;

import com.spotbite.model.CrowdStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CrowdStatusRepository extends JpaRepository<CrowdStatus, Long> {
    Optional<CrowdStatus> findByRestaurantId(Long restaurantId);
}