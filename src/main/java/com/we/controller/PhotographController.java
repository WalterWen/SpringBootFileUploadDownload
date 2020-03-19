package com.we.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/photograph")
public class PhotographController {
    private String prefix = "/photograph";

    @GetMapping()
    public String file() {
        return prefix + "/photo";
    }

}
