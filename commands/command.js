// Copyright 2013 Clark DuVall
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var COMMANDS = COMMANDS || {};

COMMANDS.cat =  function(argv, cb) {
   var filenames = this._terminal.parseArgs(argv).filenames,
       stdout;

   this._terminal.scroll();
   if (!filenames.length) {
      this._terminal.returnHandler = function() {
         stdout = this.stdout();
         if (!stdout)
            return;
         stdout.innerHTML += '<br>' + stdout.innerHTML + '<br>';
         this.scroll();
         this.newStdout();
      }.bind(this._terminal);
      return;
   }
   filenames.forEach(function(filename, i) {
      var entry = this._terminal.getEntry(filename);

      if (!entry)
         this._terminal.write('cat: ' + filename + ': No such file or directory');
      else if (entry.type === 'dir')
         this._terminal.write('cat: ' + filename + ': Is a directory.');
      else
         this._terminal.write(entry.contents);
      if (i !== filenames.length - 1)
         this._terminal.write('<br>');
   }, this);
   cb();
}

COMMANDS.cd = function(argv, cb) {
   var filename = this._terminal.parseArgs(argv).filenames[0],
       entry;

   if (!filename)
      filename = '~';
   entry = this._terminal.getEntry(filename);
   if (!entry)
      this._terminal.write('bash: cd: ' + filename + ': No such file or directory');
   else if (entry.type !== 'dir')
      this._terminal.write('bash: cd: ' + filename + ': Not a directory.');
   else
      this._terminal.cwd = entry;
   cb();
}

COMMANDS.ls = function(argv, cb) {
   var result = this._terminal.parseArgs(argv),
       args = result.args,
       filename = result.filenames[0],
       entry = filename ? this._terminal.getEntry(filename) : this._terminal.cwd,
       maxLen = 0,
       writeEntry;

   writeEntry = function(e, str) {
      this.writeLink(e, str);
      if (args.indexOf('l') > -1) {
         if ('description' in e)
            this.write(' - ' + e.description);
         this.write('<br>');
      } else {
         // Make all entries the same width like real ls. End with a normal
         // space so the line breaks only after entries.
         this.write(Array(maxLen - e.name.length + 2).join('&nbsp') + ' ');
      }
   }.bind(this._terminal);

   if (!entry)
      this._terminal.write('ls: cannot access ' + filename + ': No such file or directory');
   else if (entry.type === 'dir') {
      var dirStr = this._terminal.dirString(entry);
      maxLen = entry.contents.reduce(function(prev, cur) {
         return Math.max(prev, cur.name.length);
      }, 0);

      for (var i in entry.contents) {
         var e = entry.contents[i];
         if (args.indexOf('a') > -1 || e.name[0] !== '.')
            writeEntry(e, dirStr + '/' + e.name);
      }
   } else {
      maxLen = entry.name.length;
      writeEntry(entry, filename);
   }
   cb();
}

COMMANDS.gimp = function(argv, cb) {
   var filename = this._terminal.parseArgs(argv).filenames[0],
       entry,
       imgs;

   if (!filename) {
      this._terminal.write('gimp: please specify an image file.');
      cb();
      return;
   }

   entry = this._terminal.getEntry(filename);
   if (!entry || entry.type !== 'img') {
      this._terminal.write('gimp: file ' + filename + ' is not an image file.');
   } else {
      this._terminal.write('<img src="' + entry.contents + '"/>');
      imgs = this._terminal.div.getElementsByTagName('img');
      imgs[imgs.length - 1].onload = function() {
         this.scroll();
      }.bind(this._terminal);
      if ('caption' in entry)
         this._terminal.write('<br/>' + entry.caption);
   }
   cb();
}

COMMANDS.clear = function(argv, cb) {
   this._terminal.div.innerHTML = '';
   cb();
}

COMMANDS.sudo = function(argv, cb) {
   var count = 0;
   this._terminal.returnHandler = function() {
      if (++count < 3) {
         this.write('<br/>Sorry, try again.<br/>');
         this.write('[sudo] password for ' + this.config.username + ': ');
         this.scroll();
      } else {
         this.write('<br/>sudo: 3 incorrect password attempts');
         cb();
      }
   }.bind(this._terminal);
   this._terminal.write('[sudo] password for ' + this._terminal.config.username + ': ');
   this._terminal.scroll();
}


COMMANDS.python = function(argv, cb) {
   
   this._terminal.config.username = 'no13bus';
   var myDate = new Date();
   var timestr = myDate.toLocaleDateString() + ' '+myDate.toLocaleTimeString()
   // this._terminal.scroll();
   this._terminal.write(
'Python 2.7.5 (default, '+ timestr +')<br>'+
'[GCC 4.2.1 Compatible Apple LLVM 5.0 (clang-500.0.68)] on darwin<br>'+
'Type "import no13bus" for more information.');
   cb();
}


COMMANDS.cd = function(argv, cb) {
   var filename = this._terminal.parseArgs(argv).filenames[0],
       entry;

   if (!filename)
      filename = '~';
   entry = this._terminal.getEntry(filename);
   if (!entry)
      this._terminal.write('bash: cd: ' + filename + ': No such file or directory');
   else if (entry.type !== 'dir')
      this._terminal.write('bash: cd: ' + filename + ': Not a directory.');
   else
      this._terminal.cwd = entry;
   cb();
}


COMMANDS.import = function(argv, cb) {
  var modulename = this._terminal.parseArgs(argv).filenames[0];
  if (modulename) {
      if (modulename=="no13bus") {
        this._terminal.write(
          '***************************************************************************************<br>'+
          '我的网络ID为no13bus。现在居住地<i class="fa fa-map-marker">天津</i><br>'+
          '目前是一名pythoner。之前一直用c#做三维设计软件的二次开发。后来因为项目原因开始使用python来做web app。<br>'+
          '从此喜欢上了python的简捷,快速和<span class="prettytext">There is only one way to do it</span> 的编程思想。<br>'+
          '目前的技术栈是 python, django, celery, mysql, git, linux。网站部署常用的是gunicorn+nginx+git<br>'+
          '这个是我的个人网站。当然你可以从<a href="https://github.com/no13bus" target="_blank">GitHub</a>上面看到我之前写的一些python开源项目。<br>'+
          '你可以通过邮件联系我 <a href="mailto:no13bus@gmail.com">no13bus@gmail.com</a> 或者QQ: 364416072 或者<a target="_blank" href="https://v2ex.com/member/no13bus">v2ex</a><br>'+
          '最后你可以试着输入 <span class="prettytext">no13bus.__doc__</span> 看看这个module有哪些属性和方法以便您更好的了解和使用它<br>'+
          '你可以点击命令输出结果中的任何绿色文字连接。在输入命令的时候如果你想中途退出，请输入Ctrl+D或者Ctrl+C。<br>'+
          '你可以输入&uarr;或者&darr;查看之前输入的命令<br>'+
          '***************************************************************************************<br>'
        );
      }else{
        this._terminal.write(
              'Traceback (most recent call last):<br>'+
              ' File "<stdin>", line 1, in <module><br>'+
              'ImportError: No module named '+modulename
          );
      }
  }else{
    this._terminal.write(
              'File "<stdin>", line 1<br>'+
              ' import<br>'+
              '       ^<br>'+
              'SyntaxError: invalid syntax'
          );
  }
   cb();
}



COMMANDS.no13bus = function(argv, cb) {
  var attr = this._terminal.parseArgs(argv).filenames[0];
  if (attr=='v2ex') {
    this._terminal.write('v2ex是一个非常棒的社区。这里有关创意, 技术以及分享。id:<br><a target="_blank" href="https://v2ex.com/member/no13bus">http://v2ex.com/member/no13bus</a>');
  }else if(attr=='github'){
    this._terminal.write('自己特别喜欢逛github和分享自己的项目,就跟老婆逛淘宝的感觉一样样的, 发现了好玩的项目就忍不住star。id:<br><a href="https://github.com/no13bus" target="_blank">https://github.com/no13bus</a><br>开源项目 <a href="https://github.com/no13bus/download4kuaipan" target="_blank">download4kuaipan</a> <a href="https://github.com/no13bus/musicnote" target="_blank">musicnote</a>');
  }else if (attr=='stackoverflow') {
    this._terminal.write('在代码求索之路上，善用sof会让你少走很多弯路，可惜目前自己提问的多，回答的少。以后加油PS:老外的回复速度挺快的。id:<br><a href="http://stackoverflow.com/users/1820192/no13bus" target="_blank">http://stackoverflow.com/users/1820192/no13bus</a>');
  }else if (attr=='blog') {
    this._terminal.write('博客，主要记录一些平时忽视的小细节和坑，目前内容不多。url:<br><a href="http://blog.pythoner.tips" target="_blank">http://blog.pythoner.tips</a>');
  }else if (attr=='codewars') {
    this._terminal.write('最近在玩codewars。一个最近很火的编程挑战网站。有在玩的同学可以一起.id:<br><a href="http://www.codewars.com/users/no13bus">http://www.codewars.com/users/no13bus</a>');
  }else if (attr=='__doc__') {
    this._terminal.write(
      'v2ex的账户id-<span class="pythonattr">属性</span> no13bus.v2ex<br>'+
      'github的账户id-<span class="pythonattr">属性</span> no13bus.github<br>'+
      'stackoverflow的账户id-<span class="pythonattr">属性</span> no13bus.stackoverflow<br>'+
      'blog的账户id-<span class="pythonattr">属性</span> no13bus.blog<br>'+
      '自己的真实名字-<span class="pythonattr">属性</span> no13bus.realname<br>'+
      'codewars的账户id-<span class="pythonattr">属性</span> no13bus.codewars<br>'+
      '给我发邮件-<span class="pythonmethod">方法</span> no13bus.sendmail()<br>'
      );
  }
  else if (attr=='realname') {
    this._terminal.write('贾启辉');
  }else if (attr=='sendmail()') {
    window.location.href="mailto:no13bus@gmail.com";
  }else{
    this._terminal.write(
        'Traceback (most recent call last):<br>'+
        ' File "<stdin>", line 1, in <module><br>'+
        "AttributeError: 'module' object has no attribute '"+attr+"'"
      );
  }
  
   cb();
}


COMMANDS.login = function(argv, cb) {
   this._terminal.returnHandler = function() {
      var username = this.stdout().innerHTML;

      this.scroll();
      if (username)
         this.config.username = username;
      this.write('<br>Password: ');
      this.scroll();
      this.returnHandler = function() { cb(); }
   }.bind(this._terminal);
   this._terminal.write('Username: ');
   this._terminal.newStdout();
   this._terminal.scroll();
}

COMMANDS.tree = function(argv, cb) {
   var term = this._terminal,
       home;

   function writeTree(dir, level) {
      dir.contents.forEach(function(entry) {
         var str = '';

         if (entry.name.startswith('.'))
            return;
         for (var i = 0; i < level; i++)
            str += '|  ';
         str += '|&mdash;&mdash;';
         term.write(str);
         term.writeLink(entry, term.dirString(dir) + '/' + entry.name);
         term.write('<br>');
         if (entry.type === 'dir')
            writeTree(entry, level + 1);
      });
   };
   home = this._terminal.getEntry('~');
   this._terminal.writeLink(home, '~');
   this._terminal.write('<br>');
   writeTree(home, 0);
   cb();
}

COMMANDS.help = function(argv, cb) {
   this._terminal.write(
       'import thiswebsite<br>' + 
       'You can navigate either by clicking on anything that ' +
       '<a href="javascript:void(0)">underlines</a> when you put your mouse ' +
       'over it, or by typing commands in the terminal. '+
       '<br>If there is a command you want to get ' +
       'out of, press Ctrl+C or Ctrl+D.<br><br>');
   this._terminal.write('Commands are:<br>');
   for (var c in this._terminal.commands) {
      if (this._terminal.commands.hasOwnProperty(c) && !c.startswith('_'))
         this._terminal.write(c + '  ');
   }
   cb();
}
