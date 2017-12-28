父子组件之间传值问题
(1)父给子组件传值

在父组件中，
<v-box  :fag="index"></v-box>
 data中定义
 data:{
    index:1,
 }
 在子组件中，通过
 props: ['fag']获取，
 
(2)子给父传值，
在子组件中，用 
this.$emit('idatalist', this.listTerm);   //触发自定义函数
'idatalist'是自定义函数，上述的意思就是触发函数，并将参数this.listTerm传进去，

在父组件中，通过@idatalist="getchilddata" 获取，
getchilddata:function(oldlist){
	this.listTerm = oldlist;
},
其中，getchilddata是个用来接收传来的数据的函数。
idatalist就是子组件中出发的事件。
