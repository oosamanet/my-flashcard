const CONFIG = { W: 3, H: 10, WPP: 30};

let vm = new Vue({
  el: "#flashcard",
  data: {
    mode: 'list',
    tsv: 
'カード表	カード裏'+"\n"+
'シート１枚目<br />カード1 表のテキスト	シート１枚目<br />カード1 裏のテキスト'+"\n"+
'カード2 表のテキスト	カード2 裏のテキスト'+"\n"+
'カード3 表のテキスト	カード3 裏のテキスト'+"\n"+
'カード4 表のテキスト	カード4 裏のテキスト'+"\n"+
'カード5 表のテキスト	カード5 裏のテキスト'+"\n"+
'カード6 表のテキスト	カード6 裏のテキスト'+"\n"+
'カード7 表のテキスト	カード7 裏のテキスト'+"\n"+
'カード8 表のテキスト	カード8 裏のテキスト'+"\n"+
'カード9 表のテキスト	カード9 裏のテキスト'+"\n"+
'カード10 表のテキスト	カード10 裏のテキスト'+"\n"+
'カード11 表のテキスト	カード11 裏のテキスト'+"\n"+
'カード12 表のテキスト	カード12 裏のテキスト'+"\n"+
'カード13 表のテキスト	カード13 裏のテキスト'+"\n"+
'カード14 表のテキスト	カード14 裏のテキスト'+"\n"+
'カード15 表のテキスト	カード15 裏のテキスト'+"\n"+
'カード16 表のテキスト	カード16 裏のテキスト'+"\n"+
'カード17 表のテキスト	カード17 裏のテキスト'+"\n"+
'カード18 表のテキスト	カード18 裏のテキスト'+"\n"+
'カード19 表のテキスト	カード19 裏のテキスト'+"\n"+
'カード20 表のテキスト	カード20 裏のテキスト'+"\n"+
'カード21 表のテキスト	カード21 裏のテキスト'+"\n"+
'カード22 表のテキスト	カード22 裏のテキスト'+"\n"+
'カード23 表のテキスト	カード23 裏のテキスト'+"\n"+
'カード24 表のテキスト	カード24 裏のテキスト'+"\n"+
'カード25 表のテキスト	カード25 裏のテキスト'+"\n"+
'カード26 表のテキスト	カード26 裏のテキスト'+"\n"+
'カード27 表のテキスト	カード27 裏のテキスト'+"\n"+
'カード28 表のテキスト	カード28 裏のテキスト'+"\n"+
'カード29 表のテキスト	カード29 裏のテキスト'+"\n"+
'カード30 表のテキスト	カード30 裏のテキスト'
    ,
    pages: [],
    card_id: 1
  },
  mounted: function(){
    console.info("mounted");
    if (localStorage.getItem('myflashcard') !== null){
      this.tsv = localStorage.getItem('myflashcard');
    }
    this.pages=[];
  },
  methods: {
    get_width: function(id){
      var dom = document.getElementById(id);
      return dom.offsetWidth;
    },
    calc_maxfontsize: function(boundingid,targetid,w,h){
      var padding = [10,10,10,50];
      var maxfontsize = 40;
      var bounding = document.getElementById(boundingid);
      var target = document.getElementById(targetid);
      if (target == null){
      console.info(targetid + ' not found');
        return;
      }
      var s = target.style['font-size'];
      if (s == ""){
        s='10';
      }
      var fontSize = parseInt(s, 10);
window.t = target;
      var temp = document.createElement('div');
      temp.id = 'temp';
      temp.style.display = 'block';
//      temp.style['font-family'] = target.style['font-family'];
      temp.style.position = 'absolute';
      temp.style['font-size'] = fontSize+'px';
      temp.innerHTML = target.innerHTML;
      var b = document.getElementsByTagName('body')[0];
      b.appendChild(temp);

      var boundingW = bounding.offsetWidth-padding[1]-padding[3];
      var boundingH = bounding.offsetHeight-padding[0]-padding[2];
      var tempW = temp.offsetWidth;
      var tempH = temp.offsetHeight;

        console.info('bounding:temp = '+fontSize+"::"+boundingW + ":" + boundingH+" "+tempW+":"+tempH);

      while (tempW < boundingW && tempH < boundingH) {
        var dw = boundingW / tempW;
        var dh = boundingH / tempH;
        if (dw < dh){
          fontSize = Math.floor(fontSize * dw);
        }else{
          fontSize = Math.floor(fontSize * dh);
        }
        if (maxfontsize < fontSize){
          fontSize = maxfontsize;
        }
        temp.style['font-size'] = fontSize + 'px';
        tempW = temp.offsetW;
        tempH = temp.offsetH;
        console.info('bounding:temp = '+fontSize+"::"+boundingW + ":" + boundingH+" "+tempW+":"+tempH);
      }

      while (tempW >= boundingW && tempH < boundingH) {
        fontSize--;
        temp.style['font-size'] = fontSize + "px";
        tempW = temp.offsetW;
        tempH = temp.offsetH;
      }

      temp.style.display = 'none';
      target.style['font-size'] = fontSize + "px";
      b.removeChild(temp);
    },
    do_print: function(){
      var data=[];
      var lines=this.tsv.split("\n");
      var message = 'Sheet:'+lines.length+'x30word';
      for (var i in lines){
        if (i==0){
          continue;
        }
        var cols=lines[i].split(/\t/);
        if ((cols[0]=="" || cols[0] == undefined) &&
            (cols[1]=="" || cols[1] == undefined)){
          break;
        }
        data.push(cols);
      }
      this.loaddata(data);

      localStorage.setItem('myflashcard',this.tsv);

      this.mode="print";
      this.fit_font();
    },
    fit_font: function(){
      var self=this;
      setTimeout(function(){
        for (var i=1;i<self.card_id;i++){
          self.calc_maxfontsize('cardbox'+i,'card'+i);
        }
      },0);
    },
    loaddata: function(list){
      console.info("vm.loaddata",list);

      var page_f=undefined;
      var page_b=undefined;

      this.pages.length=0;
      
      this.card_id = 1;
    
      for (var i=0;i<list.length;i++){
        var data=list[i];
        if ((data[0]=="" || data[0] == undefined) &&
            (data[1]=="" || data[1] == undefined)){
          break;
        }
        if (page_f===undefined || page_f.count == 30){
          page_f = {page:(i+1),mode:'front',cards:[],count:0};
          page_b = {page:(i+1),mode:'back',cards:[],count:0};
          for (var j=0;j<30;j++){
            page_f.cards[j]={id:0,caption:''};
            page_b.cards[j]={id:0,caption:''};
          }
          this.pages.push(page_f);
          this.pages.push(page_b);
        }
        var card_f = {id:(i+1),caption:data[0]};
        var card_b = {id:(i+1),caption:data[1]};

        var pos=page_f.count;
        var x=pos%3;
        var y=parseInt(pos/3);

        page_f.cards[x+y*3].id = this.card_id++;
        page_f.cards[x+y*3].caption = data[0];
        page_f.count++;
        if (data[1]){
          page_b.cards[(3-x-1)+y*3].id = this.card_id++;
          page_b.cards[(3-x-1)+y*3].caption = data[1];
          page_b.count++;
        }
      }
    },
    create_test: function(pagecount){
      for (var i=0;i<pagecount;i++){
        var cards = this.create_testpage(i*CONFIG.WPP+1,"ページ"+(i+1)+" 表","omote");
        this.pages.push({page:(i+1),mode:'front',cards: cards});
        cards = this.create_testpage(i*CONFIG.WPP+1,"ページ"+(i+1)+" 裏","ura");
        this.pages.push({page:(i+1),mode:'back',cards: cards});
      }
    },
    create_testpage: function(s,comment,type){
      var cards=[];
      for (var y=0;y<CONFIG.H;y++){
        if (type=="omote"){
          for (var x=0;x<CONFIG.W;x++){
            var id=(x+y*CONFIG.W+1);
            cards.push({id:id,caption: id+":"+comment});
          }
        }else{
          for (var x=CONFIG.W-1;x>=0;x--){
            var id=(x+y*CONFIG.W+1);
            cards.push({id:id,caption: id+":"+comment});
          }
        }
      }
      return cards;
    }
  }
});
