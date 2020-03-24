package com.we.service.impl;

import com.we.mapper.StudentMapper;
import com.we.pojo.Student;
import com.we.service.IStudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentServiceImpl implements IStudentService {

    @Autowired
    private StudentMapper studentMapper;

    @Override
    public List<Student> selectStuList() {
        return studentMapper.selectStuList();
    }
}
