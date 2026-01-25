package com.scraper.reddit.models;

import lombok.Getter;

import java.util.List;

@Getter
public class ExtractionObject {
    List<String> textLists;
    String url;

    public ExtractionObject(List<String> lists, String urlstring){
        textLists = lists;
        url = urlstring;
    }


}
