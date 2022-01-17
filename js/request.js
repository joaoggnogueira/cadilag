(function () {
    var timeoutCallback = 20000;
    href = function (_url, _gets) {
        var saida = "";
        if (_gets) {
            var count = 0;
            for (var key in _gets) {
                var attrName = key;
                var attrValue = _gets[key];
                if (count == 0) {
                    saida += "?";
                } else {
                    saida += "&";
                }
                saida += attrName + "=" + attrValue;
                count++;
            }
        }
        return _url + saida;
    };
    getPageLastURL = function () {
        var path = window.location.pathname;
        var page = path.split("/").pop();
        return page;
    };
    /**
     * Recarrega a página
     * @param {type} _gets
     * @returns {undefined}
     */
    reload = function (_gets) {
        window.location.href = href("./" + getPageLastURL(), _gets);
    };
    /**
     * Redireciona de página
     * @param {type} _url
     * @param {type} _gets
     * @returns {undefined}
     */
    redirect = function (_url, _gets) {
        window.location.href = href(_url, _gets);
    };
    formdata = function (_formid) {
        var formArray = $(_formid).serializeArray();
        var returnArray = {};
        for (var i = 0; i < formArray.length; i++) {
            returnArray[formArray[i]['name']] = formArray[i]['value'];
        }
        return returnArray;
    };
    closeMessage = function (messagefooter) {
        setTimeout(function () {
            messagefooter.slideUp(500);
        }, 400);
    };
    createMessage = function (text) {
        var messagefooter = $("<div>");
        messagefooter.addClass("loading_request");

        $("<div>").addClass("dot").addClass("dot1").appendTo(messagefooter);
        $("<div>").addClass("dot").addClass("dot2").appendTo(messagefooter);
        $("<div>").addClass("dot").addClass("dot3").appendTo(messagefooter);
        
        $(document.body).append(messagefooter);
        
        messagefooter.hide().slideDown(500);

        return messagefooter;
    };
    validateFile = function (_fileid, maxsize, allowedTypes) {
        if ($("#" + _fileid).get(0).files.length != 0) {
            $elem = $("#" + _fileid);
            var file = $elem.get(0).files[0];
            var key = false;
            for (var i = 0; i < allowedTypes.length; i++) {
                if (allowedTypes[i] == file.type) {
                    key = true;
                    break;
                }
            }
            if (key) {
                if (parseInt(file.size) < maxsize) {
                    $elem.get(0).validate = true;
                    return true;
                } else {
                    sweetAlert({title: "Opss ...", text: "Arquivo excedeu o tamanho limite de " + ((maxsize / 1024) / 1024) + " MB", type: "error"});
                }
            } else {
                sweetAlert({title: "Formato de Arquivo inválido", type: "error"});
            }
        } else {
            sweetAlert({title: "Opss..", text: "Ocorreu algum erro ao encontrar o arquivo, tente novamente!", type: "error"});
        }
        $elem.get(0).validate = false;
        return false;
    };
    postSubmit = function (_url, _data) {
        var form = $("<form method='POST' action='" + _url + "'>");

        for (var key in _data) {
            form.append($("<input name='" + key + "'>").val(_data[key]));
        }
        $(document.body).append(form);
        form.submit();
        form.remove();
    };
    generateMessage = function (_fn) {
        if (_fn) {
            if (_fn.message) {
                if (_fn.message.load) {
                    return createMessage(_fn.message.load);
                }
            }
        }
        return  createMessage("Aguarde");
    };
    postWithFile = function (_url, _callback, _data, _fn) {
        var message = generateMessage();
        $.ajax({
            url: _url,
            type: 'POST',
            dataType: 'json',
            data: _data,
            processData: false,
            contentType: false,
            timeout: timeoutCallback,
            success: function (data) {
                closeMessage(message);
                if (data.resultado) {
                    _callback(data);
                } else {
                    sweetAlert({title: "Oops...", text: data.resposta, type: "error"});
                    console.log(_data);
                    console.log(data);
                }
            },
            error: function (data) {
                closeMessage(message);
                sweetAlert({title: "Erro interno", text: "Tente novamente mais tarde", type: "error"});
                console.log(_data);
                console.log(data.responseText);
            }
        });
    };
    postHTML = function (_url, _callback, _data, _fn) {
        $.ajax({
            url: _url,
            type: 'POST',
            data: _data,
            timeout: timeoutCallback,
            success: function (data) {
                _callback(data);
            },
            error: function (data) {
                alert("Error post HTML");
            }
        });
    };
    post = function (_url, _callback, _data, _fn) {
        if(!_fn || !_fn.hide) {
            var message = generateMessage();
        }
        $.ajax({
            url: _url,
            type: 'POST',
            dataType: 'json',
            data: _data,
            timeout: timeoutCallback,
            success: function (data) {
                if(!_fn || !_fn.hide) {
                    closeMessage(message);
                }
                if(_fn) {
                    if(_fn.appendData) {
                        data._appendedData = _fn.appendData;
                    }
                }
                
                if (data.resultado) {
                    _callback(data);
                } else {
                    if(data.sessionexpired){
                        redirect("./includes/session_expired.php");
                    } else {
                        if(!_fn || !_fn.hideFalseMessage){
                            sweetAlert({title: "Oops...", text: data.resposta, type: "error"});
                        }
                        console.log(_data);
                        console.log(data);
                        console.log(_url);
                        if (_fn && _fn.callbackFalse) {
                            _fn.callbackFalse(data);
                        }
                    }
                }
            },
            error: function (data) {
                if(!_fn || !_fn.hide) {
                    closeMessage(message);
                }
                if(!_fn || !_fn.hideErrorMessage) {
                    sweetAlert({title: "Erro interno", text: "Tente novamente mais tarde", type: "error"});
                }
                console.log(_data);
                console.log(_url);
                console.log(data.responseText);
                if (_fn && _fn.callbackError) {
                    _fn.callbackError(data);
                }
            }
        });
    };

})();
