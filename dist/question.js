function str2Dom(str, tagName) {
  var obj = document.createElement(tagName);
  obj.innerHTML = str;
  return obj;
};

function dom2String(node) {
  let tmpNode = document.createElement('div')
  tmpNode.appendChild(node);
  let str = tmpNode.innerHTML;
  tmpNode = node = null; // 解除引用，以便于垃圾回收
  return str;
};

function createTextSpan(text) {
  const span = document.createElement('span');
  span.innerText = text;
  return span;
};

function createBlankSpan(index) {
  var id = "input_result" + index;
  var span = '<span id=' + id + ' class="latex_input" onclick="spanClick(' + index + ')"></span>'
  // var span = document.createElement('span');
  // span.id = "input_result" + index;
  // span.className = "latex_input";
  // span.click(spanClick(span.id));
  return str2Dom(span, 'span');
};
let selectionId = "input_result0";
let blankSpanArr = null;

function spanClick(index) {
  selectionId = "input_result" + index;
  if (blankSpanArr !== null) {
    for (let x of blankSpanArr) {
      if (x.id === selectionId) {
        x.style.cssText = 'border-bottom: 1px solid #0099FF;';
      } else {
        x.style.cssText = 'border-bottom: 1px solid #26292C;';
      }
    }
  }

  try {
    window.question.blankSpanClicked(selectionId);
  } catch (e) {
  }
};

function setInnerText(innerText) {
  var span = document.getElementById(selectionId);
  span.innerText = '$' + innerText + '$';
  span.setAttribute('title', span.innerText);
  window.MathJax.Hub.Queue([
    "Typeset",
    MathJax.Hub,
    span
  ]);
};


let Model = {
  content: "",
  model_type: 0
};

function questionTrans2Html(questionStr, blank) {
  questionStr =
    "  (1) $x^{2}/cdot x^{5}=$____.\n" +
    "  (2)$a/cdot a^{6}=$____.\n" +
    "  (3)$(-2)/times(-2)^{4}/times(-2)^{3}=$____.\n" +
    "  (4)$x^{m}/cdot x^{3m+1}=$____.";
  blank = '____';

  // questionStr = Base64.decode(questionStr);

  let modelArr = new Array();
  let split = questionStr.split(blank);
  for (var i = 0; i < split.length; i++) {
    let s = split[i];
    let m = Object.create(Model);
    m.content = s;
    m.model_type = 0;
    modelArr.push(m);
    if (i < split.length - 1) {
      let n = Object.create(Model);
      n.content = blank;
      n.model_type = 1;
      modelArr.push(n);
    }
  }

  let domStrArr = [];

  let m = 0;
  for (var j = 0; j < modelArr.length; j++) {
    let newVar = modelArr[j];
    if (newVar.model_type === 0) {
      domStrArr[j] = dom2String(createTextSpan(newVar.content));
    } else {
      domStrArr[j] = dom2String(createBlankSpan(m));
      ++m;
    }
  }

  let domStr = '';
  for (let domStrArrElement of domStrArr) {
    domStr += domStrArrElement;
  }

  while (domStr.indexOf('\n') !== -1) {
    domStr = domStr.replace('\n', '<br>');
  }
  console.log(domStr);
  let dom = str2Dom(domStr, 'div');
  console.log(dom);
  window.MathJax.Hub.Queue([
    "Typeset",
    MathJax.Hub,
    dom
  ]);
  document.getElementById('div_question').appendChild(dom);
  blankSpanArr = document.getElementsByClassName('latex_input');
  if (blankSpanArr !== null) {
    blankSpanArr[0].style.cssText = 'border-bottom: 1px solid #0099FF;';
  }

  let height = window.getComputedStyle(document.getElementById('div_question')).getPropertyValue("height");
  console.log(height);
  try {
    window.Question.contentHeight(height);
  } catch (e) {
  }
};

function getAllInputs() {
  if (blankSpanArr !== null) {
    let result = '';
    for (var blankSpan of blankSpanArr) {
      result += (blankSpan.title + '|');
    }
    console.log(result);
  }

};
/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info
 *
 **/
var Base64 = {

  // private property
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

  // public method for encoding
  , encode: function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
    } // Whend

    return output;
  } // End Function encode


  // public method for decoding
  , decode: function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }

      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }

    } // Whend

    output = Base64._utf8_decode(output);

    return output;
  } // End Function decode


  // private method for UTF-8 encoding
  , _utf8_encode: function (string) {
    var utftext = "";
    string = string.replace(/\r\n/g, "\n");

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    } // Next n

    return utftext;
  } // End Function _utf8_encode

  // private method for UTF-8 decoding
  , _utf8_decode: function (utftext) {
    var string = "";
    var i = 0;
    var c, c1, c2, c3;
    c = c1 = c2 = 0;

    while (i < utftext.length) {
      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }

    } // Whend

    return string;
  } // End Function _utf8_decode

};

