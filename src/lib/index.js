import 'mathquill/build/mathquill.css'
import MathKeyboard from './keyboard.vue' // 导入组件
import MathRender from './render.vue'

const mathkeyboard = {
  install(Vue, options) {
    Vue.component(MathKeyboard.name, MathKeyboard)  // vuePayKeyboard.name 组件的name属性
    Vue.component(MathRender.name, MathRender)
    // 类似通过 this.$xxx 方式调用插件的 其实只是挂载到原型上而已
    // Vue.prototype.$xxx  // 最终可以在任何地方通过 this.$xxx 调用
    // 虽然没有明确规定用$开头  但是大家都默认遵守这个规定
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(mathkeyboard);
}

function render(elementTag) {
  window.MathJax.Hub.Queue([
    "Typeset",
    MathJax.Hub,
    elementTag
  ]);
}

export default mathkeyboard // 导出..
function insertElement(parentId, question, blankSpanId) {
  const parent = document.getElementById(parentId);

  const span = document.createElement('span');
  const spanTxt = document.createElement('span');
  spanTxt.innerText = question;
  const innerSpan = document.createElement('span');
  innerSpan.id = blankSpanId;
  innerSpan.className = 'latex_input';
  span.appendChild(spanTxt);
  span.appendChild(innerSpan);
  span.appendChild(document.createElement('br'));

  parent.appendChild(span);

}

function str2Dom(str) {
  var obj = document.createElement("div");
  obj.innerHTML = str;
  return obj.childNodes;
}

function dom2String(node) {
  let tmpNode = document.createElement('div')
  tmpNode.appendChild(node);
  let str = tmpNode.innerHTML;
  tmpNode = node = null; // 解除引用，以便于垃圾回收
  return str;
}

function createTextSpan(text) {
  const span = document.createElement('span');
  span.innerText = text;
  return span;
}

function createBlankSpan(index) {
  var span = document.createElement('span');
  span.id = "input_result" + index;
  span.className = "latex_input";
  return span;
}

function setInnerText(elementId, innerText) {
  document.getElementById(elementId).innerText = innerText;
}

let Model = {
  content: "",
  model_type: 0
};

function questionTrans2Html(questionStr, blank) {
  questionStr = '____sadosadjglajsdlgjapodspt____paodpgujp____adjgpjaposjdgpojahrm{C}$。____';
  blank = '____';

  let modelArr = new Array();
  let split = questionStr.split(blank);
  for (var i = 0; i < split.length; i++) {
    let s = split[i];
    let m = Object.create(Model);
    m.content = s;
    m.model_type = 0;
    modelArr.add(m);
    let n = Object.create(Model);
    n.content = blank;
    n.model_type = 1;
    modelArr.push(n);
  }

  let domStrArr = [];
  for (var j = 0; j < modelArr.length; j++) {
    let newVar = modelArr.get[j];
    if (newVar.model_type === 0) {
      domStrArr[j] = dom2String(createTextSpan(newVar.content));
    } else {
      domStrArr[j] = dom2String(createBlankSpan(j));
    }
  }

  let domStr = '';
  for (let domStrArrElement of domStrArr) {
    domStr += domStrArrElement;
  }
  console.log(domStr);

  // var index = 0;
  // while (questionStr.indexOf(blank) !== -1) {
  //   var span = document.createElement('span');
  //   span.id = "input_result" + index;
  //   span.className = "latex_input";
  //   questionStr = questionStr.replace(blank, dom2String(span));
  //   ++index;
  // }
  // console.log(questionStr);
  // return questionStr.replace('\n', '<br>');
}
