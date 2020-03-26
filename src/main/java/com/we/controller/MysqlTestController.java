package com.we.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mysql.cj.xdevapi.JsonArray;
import com.we.pojo.Student;
import com.we.service.IStudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.Mapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.List;

@Controller
public class MysqlTestController {

    private String prefix = "/mysqltest";


    @Autowired
    private IStudentService studentService;

    @GetMapping("/listtest")
    public String selectAll(Model model) {
        List<Student> stus = studentService.selectStuList();
        model.addAttribute("stus", stus);
        return prefix + "/listtest";
    }

    @PostMapping("/list")
    @ResponseBody
    public JSONArray selectAllTable() {
        List<Student> stus = studentService.selectStuList();
        JSONArray array= JSONArray.parseArray(JSON.toJSONString(stus));
        return array;
    }

}
