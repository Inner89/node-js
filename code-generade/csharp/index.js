var mysql=require('mysql'),
	path=require('path'),
	ejs=require('ejs'),
	fs=require('fs'),
	async=require('async'),
	moment=require('moment'),
	format=require('new-format'),
	map=require('./schema.js'),
	config=require('./generate_config.js'),
	mkdirs=require('./../../utils/mkdirs.js'),
	dbConfig=require('./../db_config.js');

var db=dbConfig.excuteDb;

var tableSql='select * from tables where TABLE_SCHEMA= ?';
var columnSql='select *  from columns where table_schema=? and table_name=?';

var tables=[];

var tableTask=function(){
	conn.query(tableSql,[db],function(err,results){
		for(var i=0;i<results.length;i++){
			var table=new map.table();
			table.set(results[i]);
			table.config=config;
			tables.push(table);
			console.log(' get table '+table.getName());
		}		
	});
};

var columnTask=function(){
	async.eachSeries(tables,function(table,callback){
	conn.query(columnSql,[db,table.getName()],function(err, results){
		table.setColumns(results);
		console.log(format(' get  detail : {0}',table.getName()));
		callback();
	});
	},function(err){
		if(err)console.log(err);
		else{
			console.log('get table detail completed');
			conn.end();
			generateTask();
		}
	});
};

var generateTask=function(){

	var date=moment().format("YYYYMMDDHHmmss");
	var base_path=path.join(__dirname,'csharp',date);

	var tempmate1=path.join(__dirname,'./templates/domain_model.ejs');
	var template_string1=fs.readFileSync(tempmate1, 'utf8');
	var savepath1=path.join(base_path,config.domain_model_path);

	var tempmate2=path.join(__dirname,'./templates/i_repository.ejs');
	var template_string2=fs.readFileSync(tempmate2, 'utf8');
	var savepath2=path.join(base_path,config.i_repository_path);

	var tempmate3=path.join(__dirname,'./templates/db_context.ejs');
	var template_string3=fs.readFileSync(tempmate3, 'utf8');

	var tempmate4=path.join(__dirname,'./templates/repository.ejs');
	var template_string4=fs.readFileSync(tempmate4, 'utf8');
	var savepath4=path.join(base_path,config.repository_path);

	var tempmate5=path.join(__dirname,'./templates/const_IRepository.ejs');
	var template_string5=fs.readFileSync(tempmate5, 'utf8');

	var tempmate6=path.join(__dirname,'./templates/const_BaseRepository.ejs');
	var template_string6=fs.readFileSync(tempmate6, 'utf8');

	mkdirs.mkdirsSync(savepath1,0777);
	for(var i=0;i<tables.length;i++){
	var content=ejs.render(template_string1,{table:tables[i],generate_config:config,filename:tempmate1});
	fs.appendFile(path.join(savepath1,tables[i].getName()+'.cs'),content);
	}

	mkdirs.mkdirsSync(savepath2,0777);
	for(var i=0;i<tables.length;i++){
	var content=ejs.render(template_string2,{table:tables[i],generate_config:config,filename:tempmate2});
	fs.appendFile(path.join(savepath2,"I"+tables[i].getName()+'Repository.cs'),content);
	}

	{ 
	var content=ejs.render(template_string3,{tables:tables,generate_config:config,filename:tempmate3});
	fs.appendFile(path.join(base_path,config.db_context_name+'DbContext.cs'),content);
	}

	mkdirs.mkdirsSync(savepath4,0777);
	for(var i=0;i<tables.length;i++){
	var content=ejs.render(template_string4,{table:tables[i],generate_config:config,filename:tempmate4});
	fs.appendFile(path.join(savepath4,tables[i].getName()+'Repository.cs'),content);
	}

	{
	var content=ejs.render(template_string5,{generate_config:config,filename:tempmate5});
	fs.appendFile(path.join(base_path,'IRepository.cs'),content);
	}

	{
	var content=ejs.render(template_string6,{generate_config:config,filename:tempmate6});
	fs.appendFile(path.join(base_path,config.db_context_name+'BaseRepository.cs'),content);
	}


}


var conn=mysql.createConnection(dbConfig);
conn.connect();


conn.query(tableSql,[db],function(err,results){
		if(err)console.log(err);
		else{
			for(var i=0;i<results.length;i++){
				var table=new map.table();
				table.set(results[i]);
				tables.push(table);
				console.log(' get table '+table.getName());
			}
			columnTask();

		}
});







