package com.we.pojo;

import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Data
@Getter
@Setter
@ToString
public class Student {
    @ExcelProperty(value = {"基础信息", "学号"}, index = 0)
    private String stuid;
    @ExcelProperty(value = {"基础信息", "班级"}, index = 1)
    private String stuclass;
    @ExcelProperty(value = {"基础信息", "姓名"}, index = 2)
    private String stuname;
    @ExcelProperty(value = "年龄", index = 3)
    private String stuage;
    @ExcelProperty(value = "性别", index = 4)
    private String stusex;
    @ExcelProperty(value = "电话", index = 5)
    private String stutel;

}
