


var getLength=function(column_type){
	if(column_type==undefined)return undefined;
	var ary=column_type.match('\([0-9]{1,5}\)');
	if(ary==null) return undefined;
	return ary[0];
}

console.log(getLength('123'));