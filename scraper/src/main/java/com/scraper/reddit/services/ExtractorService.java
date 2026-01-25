package com.scraper.reddit.services;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.scraper.reddit.models.ExtractionObject;

import java.util.ArrayList;

public class ExtractorService {
    Gson gson;
    public ExtractorService () {
        gson = new Gson();
    }
    public ExtractionObject extract(String jsonString) {
        ArrayList<String> res = new ArrayList<>();
        JsonObject jsonObject = gson.fromJson(jsonString, JsonObject.class);
        var s = jsonObject.get("data").getAsJsonArray();
        var url = jsonObject.get("url").getAsString();
        for (JsonElement el : s){
            String el_string = el.getAsString();
            if (!el_string.isEmpty()){
                res.add(el_string);
            }
        }
        return new ExtractionObject(res, url);
    }
}
