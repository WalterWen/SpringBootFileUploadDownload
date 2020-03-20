package com.we.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import sun.misc.BASE64Decoder;
import sun.text.resources.FormatData;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.text.DateFormat;
import java.text.Format;
import java.util.Date;

@Controller
@RequestMapping("/photograph")
public class PhotographController {
    private String prefix = "/photograph";

    @GetMapping()
    public String file() {
        return prefix + "/photo";
    }


    /**
     * 头像上传
     * @param file
     * @return
     */
    @RequestMapping("/photoUpload")
    @ResponseBody
    public int fileUpload(@RequestParam("op") String op, @RequestParam("base64url") String base64url) {
        if (!"takePhoto".equals(op)) {
            return -1;
        }
        BASE64Decoder decoder = new BASE64Decoder();
        String baseurl = base64url.replace("data:image/png;base64,", "");
        try {
            // Base64解码
            byte[] b = decoder.decodeBuffer(baseurl);
            for (int i = 0; i < b.length; ++i) {
                if (b[i] < 0) {// 调整异常数据
                    b[i] += 256;
                }
            }
            String imgFilePath = "D:\\datafile\\photo.jpg";
            OutputStream out = new FileOutputStream(imgFilePath);
            out.write(b);
            out.flush();
            out.close();

            return 1;
        } catch (Exception e) {
            return 0;
        }

    }

}
