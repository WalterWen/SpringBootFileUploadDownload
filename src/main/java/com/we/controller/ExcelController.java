package com.we.controller;
import	java.net.URLEncoder;

import com.alibaba.excel.EasyExcel;
import com.we.pojo.Student;
import com.we.service.IStudentService;
import com.we.service.impl.StudentServiceImpl;
import com.we.util.UploadDataListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Controller
public class ExcelController {

    private String prefix = "/excelop";

    @Autowired
    private IStudentService studentService;
    @Autowired
    private StudentServiceImpl studentServiceImpl;


    @GetMapping("/excel")
    public String excel() {
        return prefix + "/excel";
    }

    /**
     * 导出Excel
     */
    @RequestMapping("/exportExcel")
    public String exportExcel() {
        List stuList = studentService.selectStuList();
        String path = "F:/Desktop/";
        String fileName = path + "学生信息表格" + System.currentTimeMillis() + ".xlsx";
        EasyExcel.write(fileName, Student.class).sheet("学生信息表格").doWrite(stuList);
        return prefix + "/exportExcel";
    }

    /**
     * 下载Excel
     *
     * @param response
     */
    @RequestMapping("/downloadExcel")
    public void downloadExcel(HttpServletResponse response) throws IOException {
        List stuList = studentService.selectStuList();
        response.setContentType("application/vnd.ms-excel");
        response.setCharacterEncoding("utf-8");
        // 这里URLEncoder.encode可以防止中文乱码
        String fileName = URLEncoder.encode("学生信息表下载", "UTF-8");
        response.setHeader("Content-disposition", "attachment;filename=" + fileName + ".xlsx");
        EasyExcel.write(response.getOutputStream(), Student.class).sheet("学生信息").doWrite(stuList);
    }

    /**
     * Excel导入
     * @param file
     * @return
     * @throws IOException
     */
    @PostMapping("/uploadExcel")
    @ResponseBody
    public String uploadExcel(@RequestParam("fileName")MultipartFile file) throws IOException {
        EasyExcel.read(file.getInputStream(), Student.class, new UploadDataListener(studentServiceImpl)).sheet().doRead();
        return "success";
    }

}
