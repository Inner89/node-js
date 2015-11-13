var map=require('./map.js'),
	format=require('new-format');



exports.table=function(){
	var pri={
		name:undefined,
		comment:undefined,
		engine:undefined,
		columns:[],
		constraints:[],
	}

	var pub={
		getName:function(){ return pri.name},
		getComment:function(){ return pri.comment},
		getEngine:function(){return pri.engine},
		getColumns:function(){ return pri.columns},
		getConstraint:function(){return pri.constraints},

		set:function(table){
			pri.name=table.TABLE_NAME;
			pri.comment=table.TABLE_COMMENT;
			pri.engine=table.ENGINE;
		},

		setColumns:function(columns){
			pri.columns=columns;
		}

		setContraints:function(constraints){
			pri.constraints=constraints;
		}
	}
	return pub;
};



exports.column=function(){
	var pri={
		name:undefined,
		position:undefined,
		default_vaule:undefined,
		is_nullable:undefined,
		column_type:undefined,
		comment:undefined

	}

	var pub={
		getName:function(){return pri.name},
		getPosition:function(){return pri.position},
		getDefaultValue:function(){return pri.default_vaule},
		getIsNull:function(){return pri.is_nullable},
		getColumnType:function(){return pri.column_type},
		getComment:function(){return pri.comment},

		set:function(column){
			pri.name=column.COLUMN_NAME;
			pri.position=column.ORDINAL_POSITION;
			pri.default_vaule=column.
		}
	}

	return pub;
}

exports.constraint=function(){
	var pri={
		name:undefined,
		table:undefined,
		column:undefined,
		unique_position:undefined,
		reference_table:undefined,
		referenve_column:undefined,
	}
	var pub= {
		getName:function(){return pri.name},
		getTable:function(){return pri.table},
		getColumn:function(){return pri.column},
		getUniquePosition:function(){return pri.unique_position},
		getReferenceTable:function(){return pri.reference_table},
		getReferenceColumn:function(){return pri.reference_column},

		set:function(key){
		pri.name=key.CONSTRAINT_NAME;
		pri.table=key.TABLE_NAME;
		pri.column=key.COLUMN_NAME;
		pri.unique_position=key.POSITION_IN_UNIQUE_CONSTRAINT;
		pri.reference_table=key.REFERENCED_TABLE_NAME;
		pri.referenve_column=key.REFERENCED_COLUMN_NAME;
		}
	}
	return pub;
}