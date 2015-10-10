var map=require('./map.js'),
	format=require('new-format');



exports.table=function(){
	var pri={
		name:undefined,
		comment:undefined,
		orginColumns:[],
		columns:[],
		attributes:[],
	}

	var pub={
		getName:function(){ return pri.name},
		getComment:function(){ return pri.comment},
		getOrginColumns:function(){ return pri.orginColumns},
		getColumns:function(){ return pri.columns},
		getAttributes:function(){return pri.attributes},
		getPri:function(){return pri},
		getDefaults:function(){
			var cols=[];
			for(var i=0;i<pri.columns.length;i++){
				if(pri.columns[i].getDefault()) cols.push(pri.columns[i]);
			}
			return cols;
		},


		set:function(table){
			pri.name=table.TABLE_NAME;
			pri.comment=table.TABLE_COMMENT;
			pri.attributes.push('[Serializable]');
			pri.attributes.push(format('[Table(\"{0}\")]',pri.name));
		},

		setColumns:function(columns){
			pri.orginColumns=columns;
			for(var i=0;i<columns.length;i++){
				var c=new column();
				c.set(pri,columns[i]);
				pri.columns.push(c );
			}
		}
	}
	return pub;
};



column=function(){
	var pri={
		name:undefined,
		type:undefined,
		orginName:undefined,
		comment:undefined,
		remark:undefined,
		defaultValue:undefined,
		attributes:[],

		canNull:false,
		isPrimary:false,
	}

	var pub={
		getName:function(){return pri.name},
		getType:function(){return pri.type},
		getOrginName:function(){return pri.orginName},
		getComment:function(){return pri.comment},
		getRemark:function(){return pri.remark},
		getDefault:function(){return pri.defaultValue},
		getAttributes:function(){return pri.attributes},

		set:function(table,column){
			pri.orginName=column.COLUMN_NAME;
			pri.name=map.isConflict(pri.orginName)?('@'+pri.orginName):pri.orginName;
			pri.comment=column.COLUMN_COMMENT;
			pri.canNull=column.IS_NULLABLE == "YES";
			pri.isPrimary=column.COLUMN_KEY == 'PRI';
			pri.remark=format('数据类型:{0},默认:{1},是否可空:{2}',column.COLUMN_TYPE,column.COLUMN_DEFAULT,pri.canNull);
			if(pri.isPrimary)pri.remark+=',主键';

			if(!pri.isPrimary)pri.attributes.push(format('[Column(\"{0}\")]',column.COLUMN_NAME));
			else{
				pri.attributes.push('[Key]');
				var order=0;
				var columns=table.orginColumns;
				for(var i=0;i<columns.length;i++){
					if (columns[i].COLUMN_KEY=='PRI') order++;
					if(columns[i].COLUMN_NAME==pri.orginName)break;
				}
				pri.attributes.push(format('[Column(\"{0}\",Order={1})]',pri.orginName,order));
			}

			var type=map.getType(column);
			pri.type=type=='String'?'String':format('{0}{1}',type,pri.canNull?'?':'');
			if(column.COLUMN_DEFAULT=='"null"'||column.COLUMN_DEFAULT==undefined) return;
			if(type=='String')pri.defaultValue= format('\"{0}\"',column.COLUMN_DEFAULT);
			if(column.COLUMN_TYPE == "bit(1)") pri.defaultValue= column.COLUMN_DEFAULT.indexOf("1")>0 ? "true" : "false";
			if(type=='Int16'||type=='Int32'||type=="Int64"||type=="Single"||type=='Double')pri.defaultValue= column.COLUMN_DEFAULT;
			if(type=='Decimal')pri.defaultValue= format('{0}M',column.COLUMN_DEFAULT);
			if(type=='Byte')pri.defaultValue= format('(Byte){0}',column.COLUMN_DEFAULT);
			if(type=='SByte')pri.defaultValue= format('{0}',column.COLUMN_DEFAULT);

		}
	}

	return pub;
}