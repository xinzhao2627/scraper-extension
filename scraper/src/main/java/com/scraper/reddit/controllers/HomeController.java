package com.scraper.reddit.controllers;

import com.scraper.reddit.models.ExtractionObject;
import com.scraper.reddit.models.Observation;
import com.scraper.reddit.services.ExtractorService;
import com.scraper.reddit.services.ObservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Validated
public class HomeController {
    ExtractorService extractorService = new ExtractorService();
    @Autowired
    ObservationService observationService;

    @PostMapping("/")
    @ResponseBody
    public ResponseEntity<String> addObservation(@RequestBody String body) {
        try {
            List<String> res = new ArrayList<>();
            ExtractionObject contents = extractorService.extract(body);
            String url = contents.getUrl();
            for (String c: contents.getTextLists()){
                if (!c.isEmpty()){
                    Observation obs = new Observation();
                    obs.setText(c);
                    obs.setUrl(url);

                    Observation savedObservation = observationService.addObservation(obs);
                    res.add(savedObservation.getText());
                }
            }

            System.out.println("Success: " + res);
            return ResponseEntity.ok("successfully added to database");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }

    }
    @GetMapping("/")
    public ResponseEntity<List<Observation>> getObservation (){
        return ResponseEntity.ok(observationService.getObservation());
    }
}
