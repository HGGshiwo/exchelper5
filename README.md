# exchelper5

State中保存: settings, myExc, history 



后台请求数据：

exc.json，格式：

```
{
	"00000“:{
		text:"xx",
		choices:{
		"A":"xxx",
		"B":"xxx"
		},
		multi: false,
		key:["A"]
	}
}
```

history保存数据:

```
{
	"2022:2:9:12:23:12":{
		exc:"test1",
		done:{
			"xxxx":{"A":true,"B":false,"C":false},
			"xxxx":{"A":true,"B":false,"C":false},
		},
		start-time: 12:00:20,
		end-time: 12:00:11,
		span: 00:00:11
		num: 0,
		proper: 0,
	}
}
```

更新信息my exc：

```
{
	"xxx":{last:"2022:2:9:12:23:12",total:100,done:20,proper:5}
}
```

tableHistory:

```
[
[1,2,0,0,0,0,33],
[1,2,0,0,0,0,33],
[1,2,0,0,0,0,33],
[1,2,0,0,0,0,33],
]
```



点击题集->根据历史生成题集id->请求数据->显示

点击提交->生成历史记录, 修改myExc

点击设置->请求数据->和myExc对比->显示数据，修改settings



服务器上：

题集索引，题目集