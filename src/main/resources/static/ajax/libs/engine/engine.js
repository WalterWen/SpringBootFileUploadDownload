//校验是否选中行为类
function checkActionCode() {
    var length = 0;
    var param = "";
    $.each($('input:checkbox:checked'),function(){
        length = $('input[type=checkbox]:checked').length;
        param+=$(this).val()+","
    });
    return {actionCode:param,length:length}
}
//检查变量是否符合相关规则，比如左边的变量时数值的时候，右侧如果是输入就必须要输入数字
//返回的是一个对象，用来标识是哪一行出了问题
function checkVariable(obj) {
    var _obj = obj;
    var params = {};
    params.locate = [];
    for (var i in _obj.ruleExpression) {
        var _ruleExs = _obj.ruleExpression[i].rules;
        //遍历以下的规则
        for (var j in _ruleExs) {
            //等于	3就是数字类型，如果左边的参数类型是数值变量，且右边的参数类型是值
            if (_ruleExs[j].leftSideFactorType == 3&&_ruleExs[j].isRightSideFactor==1) {
                //判断右侧的值是否是数字
                if (!isNumber(_ruleExs[j].rightSideValue)) {
                    //记录这个位置，第几组的第几行
                    var c = Number(1) + Number(i);
                    params.locate.push(c+","+j);
                }
            }
        }
    }
    params.htmlParam="<label id=\"ruleName-error\" class=\"error\" for=\"ruleName\">" +
        "<i class=\"fa fa-times-circle\"></i>  值需为数值类型</label>";
    return params;
}

function isSelectedOption(p1,p2) {
    if (p1 == p2) {
        return {selected: "selected"};
    } else {
        return {selected: ""};
    }
}
//自动加载变量参数
function getVariable(response,param) {
    var _param = param ||{};
    var _self = this;
    var addParams = "";
    var addParamLeft = "<select  name='leftSideFactorCode' onchange='onChangeParams(this)' class=\"form-control\" type=\"text\" required>";
    var addParamRight ="<select  name='rightSideFactorCode' onchange='onChangeParams(this)' class=\"form-control\" type=\"text\" required>";
    addParams += "<option  value=\"\">选择变量</option>";
    var lparams = "";
    var rparams = "";
    for (var i = 0; i < response.data.length; i++) {
        lparams += "<option factType='" + response.data[i].factType + "' " + (_param.leftSideFactorCode == response.data[i].factCode ? 'selected' : '') + " value=" + response.data[i].factCode + ">" + response.data[i].factName + "</option>";
        rparams += "<option factType='" + response.data[i].factType + "'" + (_param.rightSideFactorCode == response.data[i].factCode ? 'selected' : '') + " value=" + response.data[i].factCode + ">" + response.data[i].factName + "</option>";
    }
    addParamRight += addParams + rparams+"</select>";
    addParamLeft += addParams + lparams+"</select>";
    //这里用来记录自定义属性的值，用做后续的js传参
    addParamLeft += "<input type='hidden' name='leftSideFactorType' value='"+(_param.leftSideFactorType==''?'notValue':_param.leftSideFactorType)+"'/>";
    addParamRight += "<input type='hidden' name='rightSideFactorType' value='"+(_param.rightSideFactorType==''?'notValue':_param.rightSideFactorType)+"'/>";
    //右侧需要加上这段参数，不然序列化的时候会出问题
    addParamRight += "<input name='rightSideValue' value='notValue' type='hidden'> ";
    _self.onChangeParams=function (obj) {
        var _obj = obj.options[obj.selectedIndex];
        //获取这个自定义标签的值
        var _data = $(_obj).attr("factType");
        if (_data) {
            $(obj).next().val(_data);
        } else {
            $(obj).next().val("notValue");
        }
    }
    return {addParamLeft:addParamLeft,addParamRight:addParamRight};
}

//一次性获取所有的变量参数
var getVaraParam=function () {
    var data = "";
    $.ajax({
        type:'post',
        async:false,
        url:prefix+'/getVariable',
        success:function (response) {
            data = response;
        }
    });
    return data;
}
function commonParams(params,param) {
    var addParams = "";
    var _param = param ||"";
    var appendParam = "";
    if (_param) {
        appendParam +=
            "<select  name=\"groupOp\" class=\"form-control\" type=\"text\">" +
            "<option value=\"1\">与</option>" +
            "<option value=\"0\">或</option>" +
            "</select>";
    } else {
        appendParam += "<input type='hidden' name='groupOp' value='notValue'/>";
    }
    var _data = appendParam || "";
    if (params == 'single') {
        addParams +=
            "<div class=\"form-group\" id='single'>" +
            "<div class=\"col-sm-12\" >" +
            "<div class=\"col-sm-1\" style=\"padding-top: 3px;\">" +
            "单条件："+
            "</div>" +
            "<div class=\"col-sm-1\">" +_data+
            "<input type='hidden' name='type' value='single'/>"+
            "</div>" +
            "<div class=\"col-sm-2\" style=\"padding-left: 10px\">" +
            data.addParamLeft +
            "</div>" +
            controlParams().addparams+
            "<div class=\"col-sm-1\">" +
            "<button type=\"button\" class=\"btn btn-sm btn-primary\" onclick=deleteParam($(this),'single')>" +
            "<i class=\"fa fa-plus\"></i>删除" +
            "</button>" +
            "</div>" +
            "<div class=\"col-sm-1\">" +
            "<button type=\"button\" class=\"btn btn-sm btn-primary\" onclick=addParam($(this),'single')>" +
            "<i class=\"fa fa-plus\"></i>增加" +
            "</button>" +
            "</div>" +
            "</div>" +
            "</div>";
    } else if (params=="group") {
        addParams+="<div class=\"col-sm-12\" style='padding-top: 5px'>"+
            "<div class=\"col-sm-1\" style=\"padding-top: 3px\">"
            +_param+
            "</div>" +
            "<div class=\"col-sm-1\">" +_data+
            "<input type='hidden' name='type' value='group'/>"+
            "</div>"+
            "<div class=\"col-sm-2\" style=\"padding-left: 10px\">" +
            data.addParamLeft+
            "</div>" +
            controlParams().addparams+
            "<div class=\"col-sm-1\">" +
            "<button type=\"button\" class=\"btn btn-sm btn-primary\" onclick=deleteParam($(this),'group','"+_param+"')>" +
            "<i class=\"fa fa-plus\"></i>删除" +
            "</button>" +
            "</div>" +
            "<div class=\"col-sm-1\">" +
            "<button type=\"button\" class=\"btn btn-sm btn-primary\" onclick=addParam($(this),'group')>" +
            "<i class=\"fa fa-plus\"></i>增加" +
            "</button>" +
            "</div>" +
            "</div>";
    }

    return {addParams: addParams};
}

var controlParams=function () {
    var _self=this;
    var params = "";
    params+="<div class=\"col-sm-2\">" +
        "<select  name=\"ruleOp\" class=\"form-control\" type=\"text\" required>" +
        "<option value=\"\">选择逻辑操作符</option>" +
        "<option value=\"1\">等于</option></option>" +
        "<option value=\"2\">不等于</option>" +
        "<option value=\"3\">大于</option>" +
        "<option value=\"4\">大于等于</option>" +
        "<option value=\"5\">小于</option>" +
        "<option value=\"6\">小于等于</option>" +
        "</select>" +
        "</div>" +
        "<div class=\"col-sm-1\">" +
        "<select  name=\"isRightSideFactor\" onchange='onChangeParam(this)' class=\"form-control\" style='padding-right: 0px;' type=\"text\">" +
        "<option  value=\"1\">值</option>" +
        "<option  value=\"0\">变量</option>" +
        "</select>" +
        "</div>" +
        "<div class=\"col-sm-3\">" +
        "<input  name=\"rightSideValue\" class=\"form-control\" type=\"text\" required>" +
        "<input name='rightSideFactorCode' value='notValue' type='hidden'> "+
        "<input name='rightSideFactorType' value='notValue' type='hidden'> "+
        "</div>";
    _self.onChangeParam=function (obj) {
        var _obj = $(obj);
        _obj.parent().next().remove();
        var _data = obj.options[obj.selectedIndex].value;
        var params;
        if (_data == 1) {
            params = "<div class=\"col-sm-3\">" +
                "<input  name=\"rightSideValue\" class=\"form-control\" type=\"text\" required>" +
                "<input name='rightSideFactorCode' value='notValue' type='hidden'> "+
                "<input name='rightSideFactorType' value='notValue' type='hidden'> "+
                "</div>";
        } else {
            params="<div class=\"col-sm-3\">" +
                data.addParamRight+
                "</div>"
        }
        _obj.parent().after(params);
    }
    return {addparams: params}
}
//如果是行内点击事件，两个方法需要改进优化一下，重复的代码比较多
function getParam(params) {
    var addParam = "";
    //如果是单条件
    if (params == 'single') {
        addParam = commonParams(params).addParams;
    } else if (params == 'group') {//如果是条件组
        addParam = commonParams(params).addParams;
    }
    return addParam;
}

//如果是Condition点击事件
function getParams(params) {
    var addParams ="";
    //如果是单条件
    if (params == 'single') {
        addParams = commonParams(params).addParams;
    } else if (params == 'group') {//如果是条件组
        addParams =
            "<div class=\"form-group\" id='group'>" +
            commonParams(params,"条件组:").addParams+
            commonParams(params).addParams+"</div>";
    }
    return addParams;
}

//点击增加参数的方法
var addCondition = function (obj, params) {
    var _obj = obj;
    //增加参数信息
    if (obj != null) {
        _obj.parent().parent().parent().append(getParams(params));
    }
}
var addParam = function (obj,params) {
    var _obj = obj;
    if (params == 'single') {
        _obj.parent().parent().parent().after(getParam(params));
    } else {
        _obj.parent().parent().parent().append(getParam(params));
    }
}

var deleteParam=function (obj,params,param) {
    var _obj = obj;
    if (params == 'single' || param != "") {
        _obj.parent().parent().parent().remove();
    } else {
        _obj.parent().parent().remove();
    }
}

//obj1和obj2是jquery的对象
var getStrategyJsonObj = function (obj) {
    var _obj = obj;
    var data = _obj.serializeJson();
    var objs = {};
    //获取全局执行条件参数
    objs.executionCondition = $("#executionCondition").val();
    objs.ruleExpression = [];

    //如果仅有一个单条件的话，那其格式不是一个数组
    if (!(data instanceof Array)) {
        data = [data];
    }
    var tempParam1 = {};//申明一个临时对象，用来存拼接的值
    tempParam1.rules = [];

    var tempParam2 = {};//存放二维数组的临时对象

    var isFlag = false;//用来判断是否用来tempParam1.rules，push参数
    var nextGroup = 1;
    //拼接符合格式的dom对象参数
    for (var i = 0; i < data.length; i++) {
        //如果是单条件的话
        if (data[i].groupOp == 'notValue' && data[i].type == 'single') {
            tempParam1.groupOp = 1;//组比较方法
            isFlag = true;//设置为真，下面加一个判断，如果为真就push这个值
        } else {
            //如果带方法参数，就是规则组的第一个参数，添加进去，同时将数据设置为+1
            if (data[i].groupOp != 'notValue' && data[i].type == 'group' && nextGroup == 1) {
                nextGroup = nextGroup + 1;
                tempParam1.groupOp = data[i].groupOp;//组比较方法
            } else
            //如果再次进入到此方法，就证明是第二个组参数了，这时候需要重新进入循环遍历
            if (data[i].groupOp != 'notValue' && data[i].type == 'group' && nextGroup != 1) {
                nextGroup = 1;
                i--;
                objs.ruleExpression.push(tempParam1);
                tempParam1 = null;//切断tempParam1与变量之间的联系
                tempParam1 = {};
                tempParam1.rules = [];
                isFlag = false;
                continue;
            }
        }
        tempParam2.leftSideFactorCode = data[i].leftSideFactorCode;//变量编码
        tempParam2.leftSideFactorType = data[i].leftSideFactorType;//变量类型
        tempParam2.ruleOp = data[i].ruleOp;//变量的op，大于小于之类的
        //定义右侧的参数是否是变量或者是值
        if (data[i].isRightSideFactor == 1) {
            tempParam2.isRightSideFactor = 1;
            tempParam2.rightSideFactorCode = "";
            tempParam2.rightSideFactorType = "";
            tempParam2.rightSideValue = data[i].rightSideValue;
        } else {
            tempParam2.isRightSideFactor = 0;
            tempParam2.rightSideFactorCode = data[i].rightSideFactorCode;
            tempParam2.rightSideFactorType = data[i].rightSideFactorType;
            tempParam2.rightSideValue = "";
        }

        tempParam1.rules.push(tempParam2);//将这个参数push进去
        tempParam2 = null;//切断变量之间的联系
        tempParam2 = {};
        if (isFlag || i == data.length - 1) {
            isFlag = false;
            objs.ruleExpression.push(tempParam1);
            tempParam1 = null;//切断tempParam1与变量之间的联系
            tempParam1 = {};
            tempParam1.rules = [];
            nextGroup = 1;
        }
    }

    return {strategy: objs}
}