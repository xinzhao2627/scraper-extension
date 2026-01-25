package com.scraper.reddit.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "observation")
public class Observation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(columnDefinition = "TEXT")
    private String url;


    @Column(columnDefinition = "TEXT")
    private String text;
    private LocalDate fetchedon;
//    1: english; 2: tagalog; 3: taglish
    private Integer language;
//    1: safe; 2: nsfw
    private Integer category;

}
