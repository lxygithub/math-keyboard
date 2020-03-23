<template>
  <div class="keyboard" :class="{'keyboardup':show}" id="keyboard">
    <div class="keyboard-div" @click="keyhide()" v-show="show && bgshow"></div>
    <div class="keyboard-output">
        <span :id="mathinput"
              class="editor"
              style="background:#fff;border:2px solid #0099FF;border-radius:4px;width: 75%"
              @touchstart="cursorDown($event)"
              @touchmove="cursorMove($event)"
              @touchup="cursorUp($event)">
        </span>
      <a @click="keyhide()" style="width: 15%">确定</a>
    </div>
    <div class="keyboard-panel" id="keyboard-panel"
         :style="{display:keyorwrite === 1 ? 'unset':'none'}">
      <div class="keyboard-panel-default" v-if="panel === 1">
        <div class="keyboard-default-symbol">
          <ul>
            <li v-for="item in keysym" @click="insertar(item.v)"
                @touchstart="item.t = true"
                @touchend="item.t = false"
                :style="{'background-color':item.t?'#bababa':'#F7F7F7'}">
              <div class="letter-shade"></div>
              <img :src="item.i" v-if="item.i"/>{{item.k}}
            </li>
          </ul>
        </div>
        <div class="keyboard-default-num">
          <ul>
            <li v-for="item in keynum"
                @click="insertar(item.v)"
                @touchstart="item.t = true"
                @touchend="item.t = false"
                :style="{'background-color':item.t?'#bababa':'#fff'}"
            >{{item.k}}
            </li>
          </ul>
        </div>
        <div class="keyboard-default-right">
          <ul>
            <li @touchstart="backDown('Backspace')" @touchend="backUp('Backspace')" style="background-color: #F7F7F7;margin-top: 0px"><img :src="img.back"/></li>
            <li v-for="item in keyboardRight"
                @click="insertar(item.v)"
                @touchstart="item.t = true"
                @touchend="item.t = false"
                :style="{'background-color':item.t?'#bababa':'#F7F7F7'}">
              <div class="letter-shade"></div>
              <img :src="item.i" v-if="item.i"/>{{item.k}}
            </li>
          </ul>
        </div>
      </div>

      <div class="keyboard-panel-letter" v-if="panel === 3">
        <div class="letter-row" v-for="items in keyabc[capsletter]">
          <ul>
            <li v-for="item in items"
                @click="(item.v !== 'shift' ? (item.v !== 'Backspace' ? insertar(item.v) : '') : caps())"
                @touchstart="item.t = true,backDown(item.v),item.v === 'Backspace' ? item.i = img.dback : ''"
                @touchend="item.t = false,backUp(item.v),item.v === 'Backspace' ? item.i = img.back : ''"
                :style="item.v !== 'shift' ? item.v !== 'Backspace' ? {'background-color':item.t ? '#bababa' : '#fff'} : {'background-color':item.t ? '#fff' : '#F7F7F7'} :{'background-color':item.s ? '#fff' : '#F7F7F7'}"
            >
              <div class="letter-shade"></div>
              <img :src="item.i" v-if="item.i"/>{{item.k}}
            </li>
          </ul>
        </div>
      </div>
      <div class="keyboard-bottom">
        <ul>
          <li @click="changepanel(panel===1?3:1)" style="font-size: 15px;margin-left: 0px">{{panel===1?'abc':'123'}}</li>
          <li v-for="item in keyBottomSym"
              @click="item.v==='hide'?keyhide():insertar(item.v)"
              @touchstart="item.t = true"
              @touchend="item.t = false"
              :style="{'background-color':item.t?'#bababa':'#fff'}">
            <div class="letter-shade"></div>
            <img :src="item.i" v-if="item.i"/>{{item.k}}
          </li>
        </ul>
      </div>
    </div>


  </div>
</template>

<script>
    import "mathquill/build/mathquill";
    import img from './img.js'
    import {setTimeout, clearTimeout} from 'timers';

    export default {
        name: "math-keyboard",
        data() {
            return {
                img: img,
                mathField: null,
                mathview: 'mathview' + parseInt(Math.random() * (999999 - 100000 + 1) + 100000, 10),
                mathinput: 'mathinput',
                panel: this.keypanel,
                capsletter: 'letter',
                keyabc: {
                    'letter': [
                        [
                            {k: 'q', v: 'q', t: false},
                            {k: 'w', v: 'w', t: false},
                            {k: 'e', v: 'e', t: false},
                            {k: 'r', v: 'r', t: false},
                            {k: 't', v: 't', t: false},
                            {k: 'y', v: 'y', t: false},
                            {k: 'u', v: 'u', t: false},
                            {k: 'i', v: 'i', t: false},
                            {k: 'o', v: 'o', t: false},
                            {k: 'p', v: 'p', t: false},
                        ],
                        [
                            {k: 'a', v: 'a', t: false},
                            {k: 's', v: 's', t: false},
                            {k: 'd', v: 'd', t: false},
                            {k: 'f', v: 'f', t: false},
                            {k: 'g', v: 'g', t: false},
                            {k: 'h', v: 'h', t: false},
                            {k: 'j', v: 'j', t: false},
                            {k: 'k', v: 'k', t: false},
                            {k: 'l', v: 'l', t: false},
                        ],
                        [
                            {k: '', v: 'shift', i: img.shift, s: false},
                            {k: 'z', v: 'z', t: false},
                            {k: 'x', v: 'x', t: false},
                            {k: 'c', v: 'c', t: false},
                            {k: 'v', v: 'v', t: false},
                            {k: 'b', v: 'b', t: false},
                            {k: 'n', v: 'n', t: false},
                            {k: 'm', v: 'm', t: false},
                            {k: '', v: 'Backspace', i: img.back, t: false},
                        ]
                    ],
                    'caps': [
                        [
                            {k: 'Q', v: 'Q', t: false},
                            {k: 'W', v: 'W', t: false},
                            {k: 'E', v: 'E', t: false},
                            {k: 'R', v: 'R', t: false},
                            {k: 'T', v: 'T', t: false},
                            {k: 'Y', v: 'Y', t: false},
                            {k: 'U', v: 'U', t: false},
                            {k: 'I', v: 'I', t: false},
                            {k: 'O', v: 'O', t: false},
                            {k: 'P', v: 'P', t: false},
                        ],
                        [
                            {k: 'A', v: 'A', t: false},
                            {k: 'S', v: 'S', t: false},
                            {k: 'D', v: 'D', t: false},
                            {k: 'F', v: 'F', t: false},
                            {k: 'G', v: 'G', t: false},
                            {k: 'H', v: 'H', t: false},
                            {k: 'J', v: 'J', t: false},
                            {k: 'K', v: 'K', t: false},
                            {k: 'L', v: 'L', t: false},
                        ],
                        [
                            {k: '', v: 'shift', i: img.dshift, s: true},
                            {k: 'Z', v: 'Z', t: false},
                            {k: 'X', v: 'X', t: false},
                            {k: 'C', v: 'C', t: false},
                            {k: 'V', v: 'V', t: false},
                            {k: 'B', v: 'B', t: false},
                            {k: 'N', v: 'N', t: false},
                            {k: 'M', v: 'M', t: false},
                            {k: '', v: 'Backspace', i: img.back, t: false},
                        ]
                    ]
                },
                keynum: [
                    {k: '1', v: '1', t: false},
                    {k: '2', v: '2', t: false},
                    {k: '3', v: '3', t: false},
                    {k: '4', v: '4', t: false},
                    {k: '5', v: '5', t: false},
                    {k: '6', v: '6', t: false},
                    {k: '7', v: '7', t: false},
                    {k: '8', v: '8', t: false},
                    {k: '9', v: '9', t: false},
                    {k: '0', v: '0', t: false},
                    {k: '.', v: '.', t: false},
                ],
                keysym: [
                    {k: '', v: '\\nthroot', i: img.raiz, t: false},
                    {k: '', v: '\\sqrt', i: img.raiz2, t: false},
                    {k: '', v: '^', i: img.potencia, t: false},
                    {k: '', v: '^2', i: img.cuadrado, t: false},
                    {k: '', v: '|', i: img.abs, t: false},
                    {k: '', v: '/', i: img.fraccion, t: false},
                    {k: '', v: '\\pi', i: img._pi, t: false},
                    {k: '', v: '或', i: img.or, t: false},
                    // {k: '', v: '^3', i: img.tercera},
                    // {k: '(', v: '(', i: ''},
                    // {k: ')', v: ')', i: ''},
                    // {k: '[', v: '[', i: ''},
                    // {k: ']', v: ']', i: ''},
                    // {k: 'sin', v: '\\sin', i: ''},
                    // {k: 'cos', v: '\\cos', i: ''},
                    // {k: 'tan', v: '\\tan', i: ''},
                    // {k: '≈', v: '\\approx', i: ''},
                    // {k: '≠', v: '\\neq', i: ''},
                    // {k: '%', v: '%', i: ''},
                    // {k: '', v: '-', i: img.subtract},
                    // {k: '', v: '+', i: img.plus},
                    // {k: '×', v: '\\times', i: ''},
                    // {k: '÷', v: '\\div', i: ''},
                    // {k: '', v: '±', i: img.union},
                    // {k: ',', v: ',', i: ''},
                    // {k: ':', v: ':', i: ''},
                    // {k: '°', v: '\\degree', i: ''},
                    // {k: '且', v: '且', i: ''},
                    // {k: '非', v: '非', i: ''},
                    // {k: 'x', v: 'x', i: ''},
                    // {k: 'y', v: 'y', i: ''},
                    // {k: '∑', v: '\\sum', i: ''},
                    // {k: '向量', v: '\\overrightarrow', i: ''},
                    // {k: '∠', v: '∠', i: ''},
                    // {k: '∵', v: '\\because', i: ''},
                    // {k: '∴', v: '\\therefore', i: ''},
                    // {k: '∈', v: '\\in', i: ''},
                    // {k: '∉', v: '\\notin', i: ''},
                    // {k: '∩', v: '\\intersection', i: ''},
                    // {k: '∪', v: '\\cup', i: ''},
                    // {k: '⊂', v: '\\subset', i: ''},
                    // {k: '⊃', v: '\\superset', i: ''},
                    // {k: '∞', v: '\\infty', i: ''},
                    // {k: 'log', v: '\\log', i: ''},
                    // {k: '←', v: '\\leftarrow', i: ''},
                    // {k: '→', v: '\\rightarrow', i: ''},
                    // {k: '⇔', v: '\\iff', i: ''}
                ],
                keyBottomSym: [
                    // {k: '', v: 'abc', i: img.abc},
                    {k: '', v: 'hide', i: img.hide, t: false},
                    {k: '', v: '<', i: img.less_than, t: false},
                    {k: '', v: '>', i: img.more_than, t: false},
                    {k: '', v: '\\leq', i: img.less_equals, t: false},
                    {k: '', v: '\\geq', i: img.more_equals, t: false},

                ],
                keyboardRight: [
                    {k: '', v: '-', i: img.subtract, t: false},
                    {k: '', v: '+', i: img.plus, t: false},
                    {k: '', v: '±', i: img.union, t: false}
                ],
                latex: this.value,
                keyshow: this.show,
                keyorwrite: 1,
                cursorx: 0,
                cursory: 0,
                timer: null,
                interval: null
            };
        },
        props: {
            show: Boolean,
            value: String,
            bgshow: {
                type: Boolean,
                default: true
            },
            keypanel: {
                type: Number,
                default: 1
            },
            ctrl: {
                type: Number,
                default: 0
            },
            output: String,
        },
        mounted() {
            var that = this;
            var mathFieldSpan = document.getElementById(this.mathinput);

            var MQ = MathQuill.getInterface(2);
            var mathField = that.mathField = MQ.MathField(mathFieldSpan, {
                spaceBehavesLikeTab: true,
                leftRightIntoCmdGoes: 'up',
                restrictMismatchedBrackets: true,
                sumStartsWithNEquals: true,
                supSubsRequireOperand: true,
                //charsThatBreakOutOfSupSub: '+-=<>',
                autoSubscriptNumerals: true,
                autoOperatorNames: 'sin COMMA',
                handlers: {
                    edit: function (mathField) {
                        // var texto = mathField.text();

                        that.$emit('update:value', mathField.latex());

                        //显示光标
                        const controller = mathField.__controller;
                        controller.cursor.show();
                        controller.blurred = false;
                    }
                }
            });

            that.mathField.latex(that.value);

            window.onresize = function () {
                var content = $('#mathinput .mq-root-block');
                content.scrollLeft(content[0].scrollWidth)
            };
        },
        methods: {
            /**
             * 插入符号
             * @param valor
             */
            insertar(valor) {
                var that = this;
                if (valor.includes("^2") || valor.includes("^3")) {
                    that.mathField.write(valor);
                } else if (valor === 'Backspace') {
                    that.mathField.keystroke(valor);
                } else {
                    that.mathField.cmd(valor);

                    // 我真特么机智。。。。
                    // that.mathField.keystroke("Left");
                    // that.mathField.keystroke("Right");
                }
            },
            /**
             * 键盘布局切换
             * @param val
             */
            changepanel(val) {
                this.panel = val;
                this.$emit('update:keypanel', val);
                let keyboardDiv = document.getElementById('keyboard');
                let height = window.getComputedStyle(keyboardDiv).getPropertyValue("height");
                console.log(height);
                try {
                    $App.keyboardHeight(height);
                } catch (e) {
                }
            },
            /**
             * 字母大小写切换
             */
            caps() {
                if (this.capsletter === 'letter') {
                    this.capsletter = 'caps'
                } else {
                    this.capsletter = 'letter'
                }
            },
            /**
             * 键盘隐藏
             * @param event
             */
            keyhide(event) {
                this.$emit('update:show', false);
                this.$emit('update:output', this.value);
                $App.hideKeyboard();
            },
            cursorDown(event) {
                var _this = this;
                // console.log(event.changedTouches[0].clientX)

                _this.cursorx = event.changedTouches[0].clientX;
                _this.cursory = event.changedTouches[0].clientY;
            },
            cursorMove(event) {
                var x = this.cursorx - event.changedTouches[0].clientX;
                var y = this.cursory - event.changedTouches[0].clientY;

                if (x > 10) {
                    this.mathField.keystroke("Left");
                    this.cursorx = event.changedTouches[0].clientX;
                }

                if (x < -10) {
                    this.mathField.keystroke("Right");
                    this.cursorx = event.changedTouches[0].clientX;
                }

                if (y > 10) {
                    this.mathField.keystroke("Up");
                    this.cursory = event.changedTouches[0].clientY;
                }

                if (y < -10) {
                    this.mathField.keystroke("Down");
                    this.cursory = event.changedTouches[0].clientY;
                }
            },
            cursorUp(event) {
                var _this = this
            },
            insertCursorNode(x, y) {
                var cursor = this.mathField.__controller.cursor;

                var root = $("#mathinput .mq-root-block")[0];
                // var root = document.getElementsByClassName('mq-root-block')

                console.log('root', root);
                var firstChildBounds = root.firstChild.getBoundingClientRect();
                var lastChildBounds = root.lastChild.getBoundingClientRect();

                const left = firstChildBounds.left;
                const right = lastChildBounds.right;

                if (Math.abs(x - right) < Math.abs(x - left)) {
                    cursor.insAtRightEnd(this.mathField.__controller.root);
                } else {
                    cursor.insAtLeftEnd(this.mathField.__controller.root);
                }
            },
            backDown(val) {
                var _this = this;
                if (val === 'Backspace') {
                    _this.timer = setTimeout(function () {
                        _this.interval = setInterval(function () {
                            _this.mathField.keystroke('Backspace')
                        }, 100)
                    }, 500)
                }

            },
            backUp(val) {
                if (val === 'Backspace') {
                    this.mathField.keystroke('Backspace');
                    clearTimeout(this.timer);
                    clearInterval(this.interval)
                }
            }
        },
        watch: {
            value(nval, oval) {
                if (!this.show) {
                    this.mathField.latex(this.value)
                }

                var content = $('#mathinput .mq-root-block');
                content.scrollLeft(content[0].scrollWidth)
            },
            ctrl(nval, oval) {
                this.$emit('update:ctrl', nval)
                // this.keyhide()
                // console.log('ctrl'+nval)
            },
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  * {
    box-sizing: content-box !important;
  }

  .keyboard-div {
    position: fixed;
    width: 100vw;
    top: 0;
    left: 0;
    z-index: -1;
  }


  .keyboard {
    margin-top: -8px;
    width: 100%;
    position: fixed;
    padding-top: 4px;
    padding-right: 4px;
    padding-bottom: 4px;
    left: 0;
    background-color: #F1F1F1;
    z-index: 16777271;
    transition: all 0.5s;
  }

  .keyboard-output {
    width: calc(100% - 4px);
    margin: 3px 2px;
    position: relative;
    background-color: #fff;
  }

  .keyboard-output > span {
    width: calc(100vw - 48px);
    min-height: 42px;
    border: none;
    font-size: 16px;
    padding-left: 3px;
    display: flex;
    align-items: center;
  }

  .keyboard-output > svg {
    width: 24px;
    min-height: 42px;
    color: rgb(201, 201, 201);
    padding-right: 10px;
    position: absolute;
    right: 42px;
    top: 50%;
    transform: translateY(-50%);
  }

  @-webkit-keyframes van-circular {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -40;
    }
    to {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -120;
    }
  }

  @keyframes van-circular {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -40;
    }
    to {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -120;
    }
  }

  .keyboard-output > svg circle {
    stroke: currentColor;
    stroke-width: 3;
    stroke-linecap: round;
    -webkit-animation: van-circular 1.5s ease-in-out infinite;
    animation: van-circular 1.5s ease-in-out infinite;
  }

  .keyboard-output > a {
    display: block;
    text-decoration: none;
    line-height: 42px;
    width: 42px;
    text-align: center;
    background-color: #fff;
    color: #2e7bfd;
    font-size: 15px;
    position: absolute;
    right: 2px;
    top: 50%;
    transform: translateY(-50%);
  }

  .keyboard-panel-letter {
    margin-top: -5px;
    width: calc(100% - 4px);
    padding: 2px;
  }

  .keyboard-bottom ul {
    width: 100%;
    display: flex;
  }

  .keyboard-bottom li {
    background-color: #F7F7F7;
    margin-left: 4px;
    margin-top: 4px;
    flex: 1;
  }

  .keyboard-panel .letter-row {
    margin-top: 5px;
    height: 42px;
    width: 100%;
  }

  .keyboard-panel-letter .letter-row:nth-child(3) li:first-child {
    width: calc((300vw - 97px) / 20);
    background-color: #F7F7F7;
  }

  .keyboard-panel-letter .letter-row:nth-child(3) li:last-child {
    width: calc((300vw - 97px) / 20);
    background-color: #F7F7F7;
  }

  .keyboard-panel-letter .letter-row:nth-child(4) li:first-child {
    width: calc((100vw - 19px) / 4);
    font-size: 15px;
    background-color: #F7F7F7;
  }

  .keyboard-panel-letter .letter-row:nth-child(4) li:last-child {
    width: calc((100vw - 19px) / 4);
    font-size: 15px;
    background-color: #F7F7F7;
  }

  .keyboard-panel-letter .letter-row:nth-child(4) li:nth-child(2) {
    width: calc((100vw - 49px) / 10);
    font-size: 15px;
    background-color: #F7F7F7;
  }

  .keyboard-panel-letter .letter-row:nth-child(4) li:nth-child(3) {
    width: calc(2 * (100vw - 49px) / 5 + 15px);
    font-size: 15px;
    /* background-color: #F7F7F7 */
  }

  .keyboard-panel-letter ul {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }

  .keyboard-panel-default {
    padding: 2px;
    float: left;
  }

  .keyboard-panel ul {
    margin: 0;
    padding: 0;
    float: left;
  }

  .keyboard-panel ul li {
    list-style: none;
    height: 42px;
    line-height: 42px;
    text-align: center;
    float: left;
    border-radius: 5px;
    -moz-user-select: none;
    -webkit-user-select: none;
    font-size: 20px;
    color: #0d0d0d;
    position: relative;
  }

  .letter-shade {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
  }

  .keyboard-panel-letter ul li {
    width: calc((100vw - 49px) / 10);
    margin-right: 5px;
    background-color: #fff;
  }

  .keyboard-panel-letter ul li:last-child {
    margin-right: 0;
  }

  .keyboard-panel-default ul li {
    width: calc((100vw - 29px) / 6);
    margin-top: 5px;
    margin-right: 5px;
  }

  .keyboard-default-symbol {
    width: calc((100vw - 14px) / 3);
    margin-right: 5px;
    float: left;
  }

  .keyboard-default-symbol > ul {
    background-color: #F7F7F7;
    border-radius: 5px;
  }

  .keyboard-default-symbol ul li:nth-child(2n) {
    margin-right: 0;
  }

  .keyboard-default-symbol > ul li:nth-child(1) {
    margin-top: 0;
  }

  .keyboard-default-symbol > ul li:nth-child(2) {
    margin-top: 0;
  }

  .keyboard-panel li img {
    top: 50%;
    transform: translate(-50%, -50%);
    max-height: 42px;
    position: absolute;
    z-index: 0;
    left: 50%;
  }

  .keyboard-default-symbol-bottom ul li {
    background-color: #F1F1F1;
    font-size: 15px;
  }

  .keyboard-default-num {
    width: calc((100vw + 1px) / 2);
    float: left;
    margin-top: -5px;
  }

  .keyboard-default-num ul li {
    background-color: #fff;
  }

  .keyboard-default-num ul li:nth-child(10) {
    width: calc((100vw - 14px) / 3);
  }

  .keyboard-default-right {
    width: calc((100vw - 29px) / 6);
    float: left;
    background-color: #F7F7F7;
    border-radius: 4px;
  }

  .keyboard-default-right ul li {
    background-color: #F7F7F7;
  }

  .keyboard-symbol-left {
    width: calc((500vw - 25px) / 6);
    margin-right: 5px;
    float: left;
  }

  .keyboard-symbol-left > ul {
    height: 146px;
    overflow-y: scroll;
    background-color: #F7F7F7;
    border-radius: 5px;
  }

  .keyboard-panel-symbol {
    padding: 2px;
    float: left;
  }

  .keyboard-panel-symbol ul li {
    width: calc((100vw - 29px) / 6);
    margin-top: 10px;
    margin-right: 5px;
  }

  .keyboard-symbol-left ul li:nth-child(5n) {
    margin-right: 0;
  }

  .keyboard-symbol-left .keyboard-default-symbol-bottom ul li:nth-child(3) {
    width: calc((100vw - 9px) / 2);
    margin-right: 0;
    background-color: #fff;
  }

  .keyboard-func img {
    height: 36px;
  }

  .keyboard-func-icon:last-child img {
    height: 28px;
    margin-top: 4px;
  }

</style>

<style>
  .keyboard textarea {
    display: none !important;
  }

  .mathview textarea {
    display: none !important;
  }

  .keyboard-output {
  }

</style>
