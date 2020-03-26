(function ($) {
    //对jquery的一个扩展
    $.fn.serializeJson = function () {
        var jsonData1 = {};
        var serializeArray = this.serializeArray();
        $(serializeArray).each(function () {
            if (jsonData1[this.name]) {
                if ($.isArray(jsonData1[this.name])) {
                    jsonData1[this.name].push(this.value);
                } else {
                    jsonData1[this.name] = [jsonData1[this.name], this.value];
                }
            } else {
                jsonData1[this.name] = this.value;
            }
        });
        var vCount = 0;
        // 计算json内部的数组最大长度
        for (var item in jsonData1) {
            var tmp = $.isArray(jsonData1[item]) ? jsonData1[item].length : 1;
            vCount = (tmp > vCount) ? tmp : vCount;
        }

        if (vCount > 1) {
            var jsonData2 = [];
            for (var i = 0; i < vCount; i++) {
                var jsonObj = {};
                for (var item in jsonData1) {
                    jsonObj[item] = jsonData1[item][i];
                }
                jsonData2.push(jsonObj);
            }
            return jsonData2;
        } else {
            return jsonData1;
        }
    };


})(jQuery);


var appendDevice = function (response) {
    var result = '';

    for (var i = 0; i < response.rows.length; i++) {
        if (response.rows[i].deviceTypeCode.indexOf("EV") != -1 || response.rows[i].deviceTypeCode.indexOf("ER") != -1||deviceCode.indexOf("EPR")!=-1) {
            var param = response.rows[i].name;
            var value = response.rows[i].id;
            result += "<option value='" + value + "' selected>" + param + "</option>";
        }
    }
    return result;
}

var appendStores = function (response) {
    var result = '';
    for (var i = 0; i < response.data.length; i++) {
        var param = response.data[i];
        var value = response.data[i];
        result += "<option value='" + value + "' selected>" + param + "</option>";
    }
    return result;
}

//动态添加有字典的参数选择框
function selectOption(param,name,selected) {
    var _selected = selected;
    var _param = param;
    var _name = name;
    var _append="<select class=\"form-control\" name=\""+_name+"\">";
    for (var i in _param) {
        if (_selected == _param[i].dictValue) {
            _append += "<option selected value=\"" + _param[i].dictValue + "\">" + _param[i].dictLabel + "</option>";
        } else {
            _append+="<option value=\""+_param[i].dictValue+"\">"+_param[i].dictLabel+"</option>" ;
        }
    }
    _append += "</select>";
    return _append;
}

//动态添加有字典参数的过滤搜索条件
var appendFilter = function (params,title,name,obj) {
    var _params = params;
    var _name = name;
    var _title = title||"选择参数:";
    var _obj = obj || $("#zoneId");
    var data = "<li><select class=\"form-control\"  name="+_name+" style=\"padding-top: 0px;padding-bottom: 0px;width: 110px\">";
    data += "<option  value=\"\">"+_title+"</option>";
    for (var i in _params) {
        data+="<option value="+_params[i].dictValue+">"+_params[i].dictLabel+"</option>"
    }
    data += "</select> </li>"
    _obj.after(data);
}
//设备类型函数动态添加html参数
var expendHtml = function (response) {
    //用来判断参数是否可隐藏之类的
    function confirm() {
        return {
            isRequired: function (param) {
                var data = {};
                //必需
                if (param == '1') {
                    data.symbol = "<span style=\"color: red; \">*</span>";
                    data.req = "required";
                } else {
                    data.symbol = "";
                    data.req = "";
                }
                return data;
            },
            isShow: function (param) {
                var data = {};
                //如果参数是1，那么就是显示，否则不显示
                if (param == '1') {
                    data.isShow = "";
                } else {
                    data.isShow = "display:none";
                }
                return data;
            },
            isEdit: function (param) {
                var data = {};
                //如果是1那么就是可以编辑，否则不编辑
                if (param == '1') {
                    data.isEdit = "";
                } else {
                    data.isEdit = "disabled";
                }
                return data;
            },
            isDigit: function (param) {
                var data = {};
                //如果参数是int，那么就进行校验，否则不校验
                if (param == 'int') {
                    data.isDigits = "true";
                } else {
                    data.isDigits = "false";
                }
                return data;
            }
        };
    }

    var getConfirm = confirm();

    //抽取扩展的html组成一个方法再进行调用，简化了操作代码
    function appendHtml(data) {
        return {
            addParams: function () {
                var addParam = "";
                var isRequired = getConfirm.isRequired(data.isRequired);
                var isShow = getConfirm.isShow(data.isShow);
                var isEdit = getConfirm.isEdit(data.isEdit);
                var isDigit = getConfirm.isDigit(data.dataType);

                addParam += "<div class=\"col-sm-6\" style='" + isShow.isShow + "'>" +
                    "<label class=\"col-sm-4 control-label left\" style='padding-left: 0px;padding-right: 0px'>" + isRequired.symbol + data.attributeName + "</label>"
                    + "<div class=\"col-sm-8\" style='padding-bottom: 15px;'>"
                if (data.inputType == 'input') {//如果参数为input
                    if (isEmpty(data.val)) {
                        //如果对象有没有值的话
                        addParam += "<input type=\"text\" data-rule-digits=" + isDigit.isDigits + " name='" + data.attributeCode + "' class=\"form-control\" placeholder='请输入" + data.attributeName + "参数' " + isRequired.req + " " + isEdit.isEdit + "></div>";
                    } else {
                        //然后这样,如果有值的话
                        addParam += "<input type=\"text\" data-rule-digits=" + isDigit.isDigits + " name='" + data.attributeCode + "' class=\"form-control\" value='" + data.val + "' " + isRequired.req + "+' '+" + isEdit.isEdit + "></div>";
                    }

                } else if (data.inputType == 'select') {//参数为select
                    addParam += "<select class=\"form-control\" onchange=\"shootportChange(this.options[this.selectedIndex].text)\" name='" + data.attributeCode + "'" + isRequired.req + " " + isEdit.isEdit + ">";
                    if (data.params == null || data.params.length == 0) {
                        addParam += "<option id=\"deviceType\" value=\"\">请设置字典参数</option>";
                    } else {
                        addParam += "<option id=\"deviceType\" value=\"\">请选择字典参数</option>";
                        var n = 0;
                        for (var j = 0; j < data.params.length; j++) {
                            var param = data.params[j];
                            if (param.dictValue == data.val) {
                                //有参数的情况下选中的参数
                                n = 1;
                                addParam += "<option value='" + param.dictValue + "' selected>" + param.dictLabel + "</option>";
                            } else {
                                //如果没有参数值的情况，默认是选中第一个参数，后端已做处理，第一个参数是默认的参数
                                if (!data.val && n == 0) {
                                    n = 1;
                                    addParam += "<option value='" + param.dictValue + "' selected>" + param.dictLabel + "</option>";
                                } else {
                                    addParam += "<option value='" + param.dictValue + "'>" + param.dictLabel + "</option>";
                                }
                            }
                        }
                    }
                    addParam += "</select></div>";
                }
                addParam += "</div>";
                return addParam;
            }
        }
    }


    return {
        getExpendHtml: function (param) {
            var data;
            if (param == "设备") {
                data = "<input class=\"btn btn-success btn-sm\" style=\"margin-left:20px;\" type=\"button\" value=\"获取参数\" onclick=\"queryParam()\">";
            } else {
                data = "";
            }
            var addParam = "<div>" +
                "<h4 class=\"form-header h4\">" + param + "动态参数" + data +
                "</h4></div><div class=\"form-group\">";

            for (var i = 0; i < response.data.length; i = i + 2) {
                var html1 = appendHtml(response.data[i]).addParams();
                addParam += html1;
                //判断第二个参数是否是空，如果是空的话就不显示
                if (response.data[i + 1]) {
                    var html2 = appendHtml(response.data[i + 1]).addParams();
                    addParam += html2;
                }

            }
            addParam += "</div>";
            return addParam;
        }
    }
}

/**
 * 判断是否是空
 * @param value
 */
function isEmpty(value) {
    if (value == null || value == "" || value == "undefined" || value == undefined || value == "null") {
        return true;
    } else {
        value = value.replace(/\s/g, "");
        if (value == "") {
            return true;
        }
        return false;
    }
}
//判断是否是数字
function isNumber(val){
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，

    if(val === "" || val ==null){
        return false;
    }
    if(!isNaN(val)){
        //对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,
        //所以如果不需要val包含这些特殊情况，则这个判断改写为if(!isNaN(val) && typeof val === 'number' )
        return true;
    }

    else{
        return false;
    }
}
function isEmptyObject(object) {
    return (JSON.stringify(object) == "{}");
}


var statusTool = function (row, p1, p2, p3) {
    var a = p1 || "启用";
    var b = p2 || "禁用";

    if ((p3 || row.status) == '1') {
        return '<i style="color: #0e9aef" >' + a + '</i> ';
    } else {
        return '<i style="color: red" >' + b + '</i> ';
    }
}

var transformStatus = function (status, p1, p2, p3) {
    var a = p1 || "启用";
    var b = p2 || "禁用";

    if ((p3 || status) == '1') {
        return '<i style="color: #0e9aef" >' + a + '</i> ';
    } else {
        return '<i style="color: red" >' + b + '</i> ';
    }
}

var editDevice = function (deviceId, typeId) {
    $.operate.editDevice(deviceId, typeId);
}
var statusTools = function (row, p1, p2, p3) {
    var a = p1 || "启用";
    var b = p2 || "禁用";

    if (row.status == '1') {
        return '<i style="cursor:pointer;color: #0e9aef" onclick=enable(\'' + row.id + '\')>' + a + '</i> ';
    } else {
        return '<i style="cursor:pointer;color: red" onclick=disable(\'' + row.id + '\')>' + b + '</i> ';
    }
}
/* 用户管理启用 */
var enable = function (data) {
    $.modal.confirm("确认要禁用设备吗？", function () {
        $.operate.post(prefix + "/changeStatus", {"id": data, "status": 0});
    })
}
/* 用户管理-停用 */
var disable = function (data) {
    $.modal.confirm("确认要启用设备吗？", function () {
        $.operate.post(prefix + "/changeStatus", {"id": data, "status": 1});
    })
}

/*用户点击按钮设置*/
var buttonTools = function (row) {
    if (row.status == 1) {
        return '<i class="fa fa-remove"></i>禁用';
    } else {
        return '<i class="fa fa-check"></i>启用';
    }
}
var statusN = function (status) {
    if (status == 1) {
        return '禁用';
    } else {
        return '启用';
    }
}
//校验ip是否正确
var checkIp = function (ip) {
    var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;//正则表达式
    if (re.test(ip)) {
        if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256)
            return true;
    }
    return false;
}

//校验端口是否正确
var checkPort = function (port) {
    var re = /^(\d|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
    if (re.test(port)) {
        return true;
    }
    return false;

};
var statusNum = function (status) {

    if (status == 1) {
        return '0';
    } else {
        return '1';
    }
}
/* 状态管理-停用-启用 */
var changeStatus = function (status, id, type) {
    if (!type) {
        type = "设备";
    }
    $.modal.confirm("确认要" + statusN(status) + "该" + type + "类型吗？", function () {
        $.operate.post(prefix + "/changeStatus", {"id": id, "status": statusNum(status)});
    });
}
//增加选项框的参数
//这里是要将属性提取出来的
var addParams = function (i, param) {

    //增加的选择参数字典值
    function addOptions(param) {
        var params = "";
        for (var j = 0; j < param.length; j++) {
            params += "<option value='" + param[j].dictType + "'>" + param[j].dictName + "</option>";
        }
        return params;
    }

    var addParams = "";
    var data = addOptions(param);
    addParams += "<div class=\"form-group\">" +
        "<div class=\"col-sm-12\">" +
        "<div class=\"col-sm-1 left\" style='padding-top: 4px'>" +
        "<input type=\"button\" value=\"删除\" onclick=deleteP($(this),i)><br>" +
        "</div>" +
        "<div class=\"col-sm-1\" style='padding-left: 0px;'>" +
        "<input type=\"text\"  class='form-control' style='padding-left: 0px;padding-right: 0px' name='attributeCode' data-rule-required=\"true\"  value='attribute" + i + "' required>" +
        "</div>" +
        "<div class=\"col-sm-1\" style='padding-left: 0px;padding-right: 0px'>" +
        "<input type=\"text\" class='form-control' style='padding-left: 0px;padding-right: 0px' name=\"attributeName\" data-rule-required=\"true\"  required>" +
        "</div>" +
        "<div class=\"col-sm-1\">" +
        "<select class='form-control select2-false' style='padding-left: 0px;padding-right: 0px' name=\"dataType\">" +
        "<option value=\"String\">String</option>" +
        "<option value=\"int\">int</option>" +
        "</select>" +
        "</div>" +
        "<div class=\"col-sm-1\">" +
        "<select class='form-control select2-false' style='padding-left: 0px;padding-right: 0px' name=\"inputType\">" +
        "<option value=\"input\">input</option>" +
        "<option value=\"select\">select</option>" +
        "</select>" +
        "</div>" +
        "<div class=\"col-sm-2\">" +
        "<select class='form-control'   name=\"dictType\" >" +
        "<option value=\"\">请选择字典</option>";
    addParams += data +
        "</select>" +
        "</div>" +
        "<div class=\"col-sm-1\">" +
        "<select  class='form-control select2-false'  name=\"isRequired\">" +
        "<option  value=\"1\">是</option>" +
        "<option  value=\"0\">否</option>" +
        "</select>" +
        "</div>" +
        "<div class=\"col-sm-1\">" +
        "<select  class='form-control select2-false'  name=\"isEdit\">" +
        "<option  value=\"1\">是</option>" +
        "<option  value=\"0\">否</option>" +
        "</select>" +
        "</div>" +
        "<div class=\"col-sm-1\">" +
        "<select  class='form-control select2-false'  name=\"isShow\">" +
        "<option  value=\"1\">是</option>" +
        "<option  value=\"0\">否</option>" +
        "</select>" +
        "</div>" +
        "<div class=\"col-sm-2\" style='padding-left: 0px;'>" +
        "<input type=\"text\" class='form-control' style='padding-left: 0px;padding-right: 0px' name=\"mapSdkAttribute\" data-rule-required=\"true\"  required>" +
        "</div>" +
        "</div>" +
        "</div>";

    $("#formParam").append(addParams);
}


var deleteParams = function (data, i) {

    data.parent().parent().parent().remove();
}


var getTypeNames = function (prefix) {
    var data;
    $.ajax({
        async: false,
        type: 'post',
        url: prefix + "/getDictTypeNames",
        success: function (response) {
            data = response.data;
        }
    });
    return data;
}
var validateParams = function () {

    return {
        initParams: function (obj, param) {
            obj.validate({
                rules: {
                    onkeyup: false,
                    name: {
                        remote: {
                            url: prefix + "/checkNameUnique",
                            type: "post",
                            dataType: "json",
                            data: {
                                "name": function () {
                                    return $.common.trim($("#name").val());
                                }
                            },
                            dataFilter: function (data, type) {
                                return $.validate.unique(data);
                            }
                        }
                    },
                    code: {
                        remote: {
                            url: prefix + "/checkCodeUnique",
                            type: "post",
                            dataType: "json",
                            data: {
                                "code": function () {
                                    return $.common.trim($("#code").val());
                                }
                            },
                            dataFilter: function (data, type) {
                                return $.validate.unique(data);
                            }
                        }
                    },
                },
                messages: {
                    "name": {
                        remote: param + "类型名字已经存在"
                    },
                    "code": {
                        remote: param + "类型编号已经存在"
                    }

                },
                focusCleanup: true
            });
        }
    }

}
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

//发送消息的调用方法，策略的规则和表达式增加或者修改都要发布消息
//通知策略页面进行刷新，将table的参数值改为未发布
//值暂时为随机值，不做业务处理
var updateStrategyTable =function() {
    localStorage.setItem('updateStrategyTable', (Math.random() * 1000).toString());
}