<template>
  <div class="math-render">
    <span :id="mathview" class="mathview"></span>
    <img :src="img.penicon" v-if="imgshow && !value"/>
  </div>
</template>

<script>
    import "mathquill/build/mathquill";
    import img from './img.js'

    export default {
        name: "math-render",
        data() {
            return {
                img: img,
                mathview: 'mathview' + parseInt(Math.random() * (999999 - 100000 + 1) + 100000, 10),
                viewField: null
            }
        },
        props: {
            value: String,
            imgshow: {
                type: Boolean,
                default: true
            }
        },
        mounted() {
            var that = this;
            var mathview = document.getElementById(this.mathview);

            var MQ = MathQuill.getInterface(2);

            var viewField = that.viewField = MQ.MathField(mathview);

            viewField.latex(that.value);

        },
        watch: {

            value: function (val) {
                console.log(val);
                this.viewField.latex(val);
                try {
                    $App.outputLatex(val)
                } catch (e) {
                }

                // let cursor = $('.mq-cursor');
                // let span = document.createElement('span');
                // span.className = 'mq-supsub mq-empty';
                // span.setAttribute('mathquill-command-id','26');
                // cursor.insertAfter(span);
            }
        }
    };
</script>

<style scoped>
  .mathview {
    border: none;
    border-bottom: 1px solid gray;
    min-width: 45px;
    min-height: 22px;
  }

  .math-render {
    position: relative;
    float: left;
  }

  .math-render img {
    position: absolute;
    left: 10px;
    top: 0;
    height: 24px;
  }
</style>

<style>
  .mathview textarea {
    display: none !important;
  }

  .mathview {
    display: none !important;
  }

  .mq-empty {
    background: rgb(225,243,255) !important;
    border: 1px solid rgb(112,191,248);
    min-width: 15px !important;
  }
  .mq-cursor-box{
    border: 1px solid rgb(112,191,248);
    background: rgb(225,243,255);
    width: 10px;
    position: relative;
    z-index: 1;
    display: inline-block;
  }

</style>
