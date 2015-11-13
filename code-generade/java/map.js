var keyWords=('abstract,assert,boolean,break,byte,case,catch,char,class,const,continue,default,do,double,else,enum,extends,final,finally,float,for,if,implements,import,instanceof,int,interface,long,native,new,package,private,protected,public,return,short,static,strictfp,super,switch,synchronized,this,throw,throws,transient,try,void,volatile,while').split(',');
var reservedWords=('byValue,cast,alse,future,generic,inner,operator,outer,rest,true,var ， goto ，const,null').split(',');

var getLength=function(column_type){
	if(column_type==undefined)return 0;
	var ary=column_type.match('\([0-9]{1,5}\)');
	if(ary==null) return 0;
	return ary[0];
}
var isUnsigne=function(column_type){
	if (column_type==undefined) return false;
	if(column_type.indexOf('unsigned')>0)return true;
	return false;
}

module.exports.isConflict=function(field){return (keyWords.indexOf(field)+reservedWords.indexOf(field))>=0};


module.exports.getType=function(column){
		if(column.DATA_TYPE==undefined)return 'Object';
		var length=getLength(column.COLUMN_TYPE);
		var isunsign=isUnsigne(column.COLUMN_TYPE);

		switch(column.DATA_TYPE){
			case 'bit':
				return length<2?'Boolean':'byte[]';
			case 'tinyint':
				return length<2 ?'Boolean':'Integer';
			case 'boolean':
			case 'bool':
				return 'Boolean';
			case 'smallint':
				return 'Integer';
			case 'mediumint':
				return 'Integer'
			case 'int':
			case 'integer':
				return isunsign ? 'Long' : 'Integer';	
			case 'bigint':
				return isunsign ? 'BigInteger' : 'Long';
			case 'float':
				return 'Float';
			case 'double':
				return 'Double';
			case 'decimal':
				return 'java.math.BigDecimal';
			case 'date':
				return 'java.sql.Date';
			case 'datetime':
				return 'java.sql.Timestamp';
			case 'timestamp':
				return 'java.sql.Timestamp';
			case 'time':
				return 'java.sql.Time';

			case 'char':
			case 'varchar':
				return 'String';

			case 'binary':
			case 'varbinary':
			case 'tinyblob':
			case 'blob':
			case 'mediumblob':
			case 'longblob':
				return 'String';

			case 'tinytext':
			case 'text':
			case 'mediumtext':
			case 'longtext':
			case 'enum':
			case 'set':
				return 'String';   

			default:
			return 'Object';
		}
	}
