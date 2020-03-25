package com.we.controller;

import com.we.pojo.Student;
import com.we.service.IStudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class MysqlTestController {

    private String prefix = "/mysqltest";


    @Autowired
    private IStudentService studentService;


    @GetMapping("/listtest")
    public String selectAll(Model model) {
        List<Student> stus = studentService.selectStuList();
        //Map<String, Object> model= new HashMap<String, Object>();
        //model.put("stus", stus);
        model.addAttribute("stus", stus);
        return prefix + "/listtest";
    }
}
