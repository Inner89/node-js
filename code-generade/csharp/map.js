var keyWords=("abstract,as,base,bool,break,byte,case,catch,char,Checked,class,const,continue,decimal,default,delegate,do,double,else,enum,event,explicit,extern,false,finally,fixed,float,for,foreach,goto,if,implicit,in,in,int,interface,internal,is,lock,long,namespace,new,null,Object,operator,out,out,override,params,private,protected,public,readonly,ref,return,sbyte,sealed,short,sizeof,stackalloc,static,string,struct,switch,this,throw,true,try,typeof,uint,ulong,Unchecked,unsafe,ushort,using,virtual,void,volatile,while,add,alias,ascending,async,await,descending,dynamic,源,get,global,group,into,join,let,orderby,partial,remove,select,set,value,var,where,yield").split(',');


module.exports.isConflict=function(field){return keyWords.indexOf(field)>=0};


module.exports.getType=function(column){
		if(column.DATA_TYPE==undefined)return 'object';
		switch(column.DATA_TYPE){
			case 'bit':
				return column.COLUMN_TYPE =='bit(1)'?'Boolean':'Int64';
			case 'boolean':
			case 'bool':
				return 'Boolean';
			case 'tinyint':
				return column.COLUMN_TYPE.indexOf("unsigned")>0 ? 'Byte' : 'SByte';
			case 'smallint':
				return column.COLUMN_TYPE.indexOf("unsigned")>0 ? 'Int32' : 'Int16';
			case 'year':
				return 'Int16';
			case 'int':
			case 'integer':
				return column.COLUMN_TYPE.indexOf("unsigned")>0 ? 'Int64' : 'Int32';	
			case 'mediumint':
				return 'Int32';
			case 'bigint':
				return column.COLUMN_TYPE.indexOf("unsigned")>0 ? 'Decimal' : 'Int64';
			case 'float':
				return column.COLUMN_TYPE.indexOf("unsigned")>0 ? 'Decimal' : 'Single';
			case 'real':
				return 'Double';
			case 'double':
				return column.COLUMN_TYPE.indexOf("unsigned")>0 ? 'Decimal' : 'Double';			
	        case "decimal":
	        case "numeric":
	        case "dec":
	        case "fixed":
	        case "serial":
	            return 'Decimal';
	        case "date":
	        case "timestamp":
	        case "datetime":
	            return 'DateTime';
	        case "time":
	            return 'TimeSpan';
	        case "char":
	        case "varchar":
	        case "tinytext":
	        case "text":
	        case "mediumtext":
	        case "longtext":
	        case "set":
	        case "enum":
	        case "nchar":
	            return 'String';            
	        case "binary":
	        case "varbinary":
	        case "blob":
	        case "tinyblob":
	        case "mediumblob":
	        case "longblob":
	            return 'Byte[]';            

			default:
			return 'object';
		}
	}
