package com.we.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

@Controller
public class FileController {
    private String prefix = "/fileoperation";

    @GetMapping("file")
    public String file() {
        return prefix + "/file";
    }

    /**
     * 单文件上传
     * @param file
     * @return
     */
    @RequestMapping("/fileUpload")
    @ResponseBody
    public String fileUpload(@RequestParam("fileName")MultipartFile file) {
        if (file.isEmpty()) {
            return "false";
        }
        String fileName = file.getOriginalFilename();
        int size = (int)file.getSize();
        System.out.println(fileName + "--->" + size);

        String path = "D:/datafile";
        File dest = new File(path + "/" + fileName);
        // 判断父文件目录是否存在
        if (!dest.getParentFile().exists()) {
            dest.getParentFile().mkdir();
        }

        try {
            // 保存文件
            file.transferTo(dest);
            return "true";
        } catch (IllegalStateException e) {
            e.printStackTrace();
            return "false";
        } catch (IOException e) {
            e.printStackTrace();
            return "false";
        }
    }

    @RequestMapping("multifile")
    public String multifile() {
        return prefix + "/multifile";
    }

    /**
     * 实现多文件上传
     * @param files
     * @return
     */
    @RequestMapping("/multifileUpload")
    @ResponseBody
    public String multifileUpload(@RequestParam("fileName")List<MultipartFile> files) {
    //@RequestMapping("/multifileUpload")
    //@ResponseBody
    //public String multifileUpload(HttpServletRequest request) {

        //List<MultipartFile> files = ((MultipartHttpServletRequest) request).getFiles("fileName");

        if (files.isEmpty()) {
            return "false";
        }

        String path = "D:/datafile";

        for (MultipartFile file : files) {
            String fileName = file.getOriginalFilename();
            int size = (int) file.getSize();
            System.out.println(fileName + "-->" + size);

            if (file.isEmpty()) {
                return "false";
            } else {
                File dest = new File(path + "/" + fileName);
                // 判断文件父目录是否存在
                if (!dest.getParentFile().exists()) {
                    dest.getParentFile().mkdir();
                }
                try {
                    file.transferTo(dest);
                } catch (Exception e) {
                    e.printStackTrace();
                    return "false";
                }
            }
        }
        return "true";
    }

    /**
     * 实现文件检索
     * @param model
     * @return
     */
    @RequestMapping("/fileDownload")
    public String fileDownload(Model model) {

        String inputPath = "D:/datafile";
        // 获取其file对象
        File file = new File(inputPath);
        // 遍历path下的文件和目录，放在File数组中
        File[] fs = file.listFiles();
        ArrayList files = new ArrayList();
        // 遍历File[]数组
        for (File f : fs) {
            // 获取文件和目录名
            String fileName = f.getName();
            // 另外可用fileName.endsWith("txt")来过滤出以txt结尾的文件
            if (!f.isDirectory()) {
                files.add(fileName);
            }
        }
        model.addAttribute("inputPath", inputPath);
        model.addAttribute("fileNames", files);
        return prefix + "/fileDownload";
    }

    /**
     * 文件下载
     * @param downFileName
     * @param response
     * @return
     * @throws UnsupportedEncodingException
     */
    @GetMapping("/download/{downFileName:.+}")
    public String downLoad(@PathVariable("downFileName") String downFileName, HttpServletResponse response)
            throws UnsupportedEncodingException {
        String filename = downFileName;
        String filePath = "D:/datafile";
        File file = new File(filePath + "/" + filename);
        // 判断文件父目录是否存在
        if (file.exists()) {
            response.setContentType("application/vnd.ms-excel;charset=UTF-8");
            response.setCharacterEncoding("UTF-8");
            response.setHeader("Content-Disposition", "attachment;fileName=" + java.net.URLEncoder.encode(filename, "UTF-8"));
            byte[] buffer = new byte[1024];
            // 文件输入流
            FileInputStream fis = null;
            BufferedInputStream bis = null;

            // 输出流
            OutputStream os = null;
            try {
                os = response.getOutputStream();
                fis = new FileInputStream(file);
                bis = new BufferedInputStream(fis);
                int i = bis.read(buffer);
                while (i != -1) {
                    os.write(buffer);
                    i = bis.read(buffer);
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
            System.out.println("----------file download---" + filename);
            try {
                bis.close();
                fis.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

}
