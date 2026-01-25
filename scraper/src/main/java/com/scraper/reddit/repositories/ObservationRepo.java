package com.scraper.reddit.repositories;

import com.scraper.reddit.models.Observation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ObservationRepo extends JpaRepository<Observation, Integer> {}
