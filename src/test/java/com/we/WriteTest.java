package com.we;

import com.we.pojo.Student;
import com.we.service.IStudentService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;
@RunWith(SpringRunner.class)
@SpringBootTest(classes = MainApplication.class, webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
public class WriteTest {

    @Autowired
    private IStudentService studentService;


    @Test
    public void selectAll() {
        List<Student> stus = studentService.selectStuList();
        System.out.println(stus.get(0));
    }


}
