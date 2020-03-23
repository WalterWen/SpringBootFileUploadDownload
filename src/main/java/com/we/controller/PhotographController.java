package com.we.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import sun.misc.BASE64Decoder;

import java.io.FileOutputStream;
import java.io.OutputStream;

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
     * @param op
     * @param base64url
     * @return
     */
    @RequestMapping("/photoUpload")
    @ResponseBody
    public int fileUpload(@RequestParam("op") String op, @RequestParam("base64url") String base64url) {
        String opStr = "takePhoto";
        if (!opStr.equals(op)) {
            return -1;
        }
        BASE64Decoder decoder = new BASE64Decoder();
        String baseurl = base64url.replace("data:image/png;base64,", "");
        try {
            // Base64解码
            byte[] b = decoder.decodeBuffer(baseurl);
            for (int i = 0; i < b.length; ++i) {
                // 调整异常数据
                if (b[i] < 0) {
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
