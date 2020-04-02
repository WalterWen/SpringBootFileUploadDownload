package com.we;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.ExcelWriter;
import com.alibaba.excel.write.metadata.WriteSheet;
import com.we.pojo.Student;
import com.we.service.IStudentService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RunWith(SpringRunner.class)
@SpringBootTest//(classes = MainApplication.class, webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
public class WriteTest {

    public static final Logger log = LoggerFactory.getLogger(WriteTest.class);

    @Autowired
    private IStudentService studentService;


    @Test
    public void selectAll() {
        List<Student> stus = studentService.selectStuList();
        log.info("查询结果：");
        System.out.println(stus.get(0));
    }

    @Test
    public void simpleWrite() {
        List<Student> stuList = studentService.selectStuList();
        String path = "F:/Desktop/";
        String fileName = path + "学生信息表格" + System.currentTimeMillis() + ".xlsx";
        // 这里 需要指定写用哪个class去写，然后写到第一个sheet，名字为模板 然后文件流会自动关闭
        // 如果这里想使用03 则 传入excelType参数即可
        EasyExcel.write(fileName, Student.class).sheet("学生信息").doWrite(stuList);
    }

    /**
     * 指定不导出的列
     */
    @Test
    public void excludeOrIncludeWriter() {

        List<Student> stuList = studentService.selectStuList();
        String path = "F:/Desktop/";
        String fileName = path + "学生信息表格" + System.currentTimeMillis() + ".xlsx";

        Set<String> excludeColumnFiledNames = new HashSet<>();
        excludeColumnFiledNames.add("stuage");
        EasyExcel.write(fileName, Student.class).excludeColumnFiledNames(excludeColumnFiledNames).sheet("学生信息").doWrite(stuList);
    }

    /**
     * 同一个对象，写入不同的sheet
     */
    @Test
    public void repeatedWrite1() {

        List<Student> stuList = studentService.selectStuList();
        String path = "F:/Desktop/";
        String fileName = path + "学生信息表格" + System.currentTimeMillis() + ".xlsx";

        ExcelWriter excelWriter = EasyExcel.write(fileName, Student.class).build();
        for (int i= 0; i < 2; i ++) {
            WriteSheet writeSheet = EasyExcel.writerSheet(i, "信息"+i).build();

            excelWriter.write(stuList, writeSheet);
        }
        excelWriter.finish();

    }

    /**
     * 不同的对象，不同的sheet
     */
    @Test
    public void repeatedWrite2() {

        List<Student> stuList = studentService.selectStuList();
        String path = "F:/Desktop/";
        String fileName = path + "学生信息表格" + System.currentTimeMillis() + ".xlsx";

        ExcelWriter excelWriter = EasyExcel.write(fileName).build();
        for (int i= 0; i < 2; i ++) {
            // Student.class 可以每次都变
            if (i == 0) {
                WriteSheet writeSheet = EasyExcel.writerSheet(i, "信息"+i).head(Student.class).build();
                excelWriter.write(stuList, writeSheet);
            }
            if (i == 1) {
                Set<String> excludeColumnFiledNames = new HashSet<>();
                excludeColumnFiledNames.add("stuage");
                WriteSheet writeSheet = EasyExcel.writerSheet(i, "信息"+i).excludeColumnFiledNames(excludeColumnFiledNames).head(Student.class).build();
                excelWriter.write(stuList, writeSheet);
            }
        }
        excelWriter.finish();

    }


}
