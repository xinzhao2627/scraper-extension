package com.scraper.reddit.services;


import com.scraper.reddit.models.Observation;
import com.scraper.reddit.repositories.ObservationRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ObservationService {
    @Autowired
    private ObservationRepo observationRepository;

    public List<Observation> getObservation(){
        List<Observation> res = observationRepository.findAll();
        if (res.isEmpty()){
            res = new ArrayList<>();
        }
        return res;
    }

    public Observation addObservation(Observation observation){
        observation.setFetchedon(LocalDate.now());
        Observation savedObservation = observationRepository.save(observation);

        return savedObservation;
    }
}

