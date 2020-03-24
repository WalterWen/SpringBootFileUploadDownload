package com.we.mapper;

import com.we.pojo.Student;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentMapper {

    public List<Student> selectStuList();
}
